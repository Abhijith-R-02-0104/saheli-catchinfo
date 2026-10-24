import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { pipeline, env } from '@huggingface/transformers';
import ffmpegPath from 'ffmpeg-static';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { FAQS } from '../src/content/faq.js';

// Models are downloaded on first run and cached locally. After caching, inference can run locally.
env.allowRemoteModels = true;
env.allowLocalModels = true;
const execFileAsync = promisify(execFile);
const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 18 * 1024 * 1024 } });
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json({ limit: '1mb' }));

let embedderPromise;
let whisperPromise;
let indexedFaqsPromise;
const embedder = () => (embedderPromise ??= pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2'));
const whisper = () => (whisperPromise ??= pipeline('automatic-speech-recognition', 'onnx-community/whisper-base'));

function normalize(s = '') {
  return String(s).toLocaleLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}\s'-]/gu, ' ').replace(/\s+/g, ' ').trim();
}
function detectLanguage(text = '') {
  const devanagari = (text.match(/[\u0900-\u097F]/g) ?? []).length;
  const latin = (text.match(/[A-Za-z]/g) ?? []).length;
  return devanagari > latin * 0.2 ? 'hi' : 'en';
}
function categoryIntent(text = '') {
  const q = normalize(text);
  const intents = [
    ['warning-signs', /severe pain|very heavy|soak.{0,15}pad|faint|unconscious|fever|तेज दर्द|बहुत अधिक रक्तस्राव|बेहोश|बुखार/],
    ['pregnancy', /pregnan|pregnancy test|missed period|गर्भावस्था|प्रेग्न|पीरियड नहीं आया/],
    ['cycle', /period|menstrual|cycle|late|delay|irregular|माहवारी|पीरियड|मासिक चक्र|देरी/],
    ['hygiene', /pad|tampon|menstrual cup|hygiene|पैड|टैम्पॉन|साफ सफाई/],
    ['conditions', /pcos|pcod|endometriosis|thyroid|पीसीओएस|पीसीओडी|थायरॉइड/],
    ['symptoms', /cramp|pain|discharge|smell|itch|ऐंठन|दर्द|स्राव|खुजली/],
  ];
  return intents.find(([, pattern]) => pattern.test(q))?.[0] ?? null;
}
function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}
async function vectorFor(text) {
  const model = await embedder();
  const out = await model(text, { pooling: 'mean', normalize: true });
  return Array.from(out.data);
}
async function indexedFaqs() {
  if (!indexedFaqsPromise) indexedFaqsPromise = (async () => Promise.all(FAQS.map(async faq => {
    const searchable = [faq.question?.en, faq.question?.hi, ...(faq.keywords?.en ?? []), ...(faq.keywords?.hi ?? []), faq.category].filter(Boolean).join(' | ');
    return { faq, vector: await vectorFor(searchable) };
  })))();
  try { return await indexedFaqsPromise; } catch (error) { indexedFaqsPromise = null; throw error; }
}

app.get('/api/health', (_req, res) => res.json({ ok: true, mode: 'local multilingual retrieval + extractive answers' }));
app.post('/api/ask', async (req, res) => {
  const question = String(req.body?.question ?? '').trim();
  if (!question) return res.status(400).json({ error: 'Please enter a question.' });
  try {
    const lang = detectLanguage(question);
    const [queryVector, rows] = await Promise.all([vectorFor(question), indexedFaqs()]);
    const intent = categoryIntent(question);
    const ranked = rows.map(({ faq, vector }) => {
      const similarity = cosine(queryVector, vector);
      const intentBoost = intent && faq.category === intent ? 0.025 : 0;
      return { faq, score: similarity + intentBoost, similarity };
    }).sort((a, b) => b.score - a.score);
    const best = ranked[0];
    // Conservative threshold: if retrieval is uncertain, return no answer instead of guessing.
    if (!best || best.similarity < 0.36) return res.json({ matched: false, language: lang, intent, answer: lang === 'hi' ? 'मुझे इस प्रश्न के लिए पर्याप्त भरोसेमंद जानकारी नहीं मिली। कृपया प्रश्न को दूसरे तरीके से पूछें या स्वास्थ्यकर्मी से सलाह लें।' : 'I could not find sufficiently relevant information for that question. Please rephrase it or ask a healthcare professional.', source: null, confidence: best?.similarity ?? 0 });
    res.json({ matched: true, language: lang, intent: intent ?? best.faq.category, answer: best.faq.answer?.[lang] ?? best.faq.answer?.en, source: best.faq.source ?? null, faqId: best.faq.id, confidence: Number(best.similarity.toFixed(3)), related: ranked.slice(1, 4).map(item => ({ id: item.faq.id, question: item.faq.question?.[lang] ?? item.faq.question?.en, score: Number(item.similarity.toFixed(3)) })) });
  } catch (error) {
    console.error('RAG retrieval failed:', error);
    res.status(503).json({ error: 'Local retrieval model is not ready. Please retry after the model finishes loading.' });
  }
});
app.post('/api/voice', upload.single('audio'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No audio was received.' });
  try {
    const model = await whisper();
    const folder = await mkdtemp(join(tmpdir(), 'saheli-audio-'));
    try {
      const inputPath = join(folder, 'input-audio');
      const wavPath = join(folder, 'question.wav');
      await writeFile(inputPath, req.file.buffer);
      // Convert browser WebM/Opus to the mono 16 kHz WAV format expected by speech models.
      await execFileAsync(ffmpegPath, ['-y', '-i', inputPath, '-ac', '1', '-ar', '16000', '-f', 'wav', wavPath], { timeout: 60000 });
      const result = await model(wavPath, { task: 'transcribe' });
      const transcript = String(result?.text ?? '').trim();
      if (!transcript) return res.status(422).json({ error: 'I could not understand that recording. Please try again slowly.' });
      res.json({ transcript, language: detectLanguage(transcript) });
    } finally {
      await rm(folder, { recursive: true, force: true });
    }
  } catch (error) {
    console.error('Local speech recognition failed:', error);
    res.status(503).json({ error: 'Local voice recognition could not process this recording. Try text input or check the local model setup.' });
  }
});

const port = Number(process.env.PORT ?? 8787);
app.listen(port, () => console.log(`Saheli local RAG server listening on http://localhost:${port}`));
