import { useState } from "react";
import { useAppData } from "../../context/useAppData.js";
import { useTranslation } from "../../hooks/useTranslation.js";
import { getTodayLocalDate } from "../../lib/dates.js";
import {
  IconBookmark,
  IconMail,
  IconLock,
  IconBookOpen,
  IconStethoscope,
} from "../common/Icons.jsx";

const CATEGORIES = [
  { id: "all", labelKey: "allEntries" },
  { id: "journal", labelKey: "journal" },
  { id: "doctor", labelKey: "doctorQuestions" },
  { id: "letter", labelKey: "futureLetters" },
];

export function MySpaceView() {
  const { appData, updatePersonalNotes, updateFutureLetters } = useAppData();
  const { lang, t } = useTranslation();

  const todayStr = getTodayLocalDate();
  const notes = Array.isArray(appData.personalNotes) ? appData.personalNotes : [];
  const futureLetters = Array.isArray(appData.futureLetters) ? appData.futureLetters : [];

  // Filter & search
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Editor modal/card state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("journal");
  const [pinned, setPinned] = useState(false);
  const [revealDate, setRevealDate] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  function handleOpenNew() {
    setEditingId(null);
    setTitle("");
    setBody("");
    setTag("journal");
    setPinned(false);
    setRevealDate("");
    setIsEditing(true);
  }

  function handleEditNote(note) {
    setEditingId(note.id);
    setTitle(note.title || "");
    setBody(note.body || "");
    setTag(note.tag || "journal");
    setPinned(Boolean(note.pinned));
    setRevealDate(note.revealDate || "");
    setIsEditing(true);
  }

  function handleSaveNote(e) {
    e.preventDefault();
    if (!title.trim() && !body.trim()) return;

    if (tag === "letter" && revealDate) {
      // Save to future letters
      const newLetter = {
        id: editingId || `letter-${Date.now()}`,
        title: title.trim() || (lang === "hi" ? "भविष्य के नाम पत्र" : "Letter to Future Self"),
        body: body.trim(),
        createdAt: todayStr,
        revealDate,
      };
      const updatedLetters = editingId
        ? futureLetters.map((l) => (l.id === editingId ? newLetter : l))
        : [newLetter, ...futureLetters];
      updateFutureLetters(updatedLetters);
    } else {
      // Save to personal notes
      const newNote = {
        id: editingId || `note-${Date.now()}`,
        title: title.trim() || (lang === "hi" ? "बिना शीर्षक नोट" : "Untitled Note"),
        body: body.trim(),
        tag,
        pinned,
        createdAt: todayStr,
      };
      const updatedNotes = editingId
        ? notes.map((n) => (n.id === editingId ? newNote : n))
        : [newNote, ...notes];
      updatePersonalNotes(updatedNotes);
    }

    setIsEditing(false);
  }

  function handleDeleteNote(id, isLetter = false) {
    if (isLetter) {
      updateFutureLetters(futureLetters.filter((l) => l.id !== id));
    } else {
      updatePersonalNotes(notes.filter((n) => n.id !== id));
    }
    setDeleteConfirmId(null);
  }

  // Filter notes based on active category and search
  const filteredNotes = notes.filter((n) => {
    const matchesCategory = selectedCategory === "all" || n.tag === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.createdAt.localeCompare(a.createdAt);
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--plum)]">
            {t("nav", "myspace")}
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[var(--ink)]">
            {t("myspace", "title")}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {t("myspace", "subtitle")}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="touch-target inline-flex items-center gap-2 rounded-2xl bg-[#79516F] px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-[#633E5A] dark:bg-[#8D5C82] dark:hover:bg-[#A06B95] transition-all"
        >
          <span>+</span>
          <span>{t("myspace", "writeNew")}</span>
        </button>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("myspace", "searchPlaceholder")}
            className="w-full rounded-2xl border border-[var(--line-strong)] bg-[var(--card)] px-4 py-2.5 text-xs text-[var(--ink)] placeholder-[var(--muted)] focus-visible:outline-2 focus-visible:outline-[#79516F]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`touch-target rounded-xl px-3.5 py-2 text-xs font-semibold transition-all border whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-[#79516F] text-white border-[#79516F] dark:bg-[#8D5C82] dark:border-[#8D5C82]"
                  : "bg-[var(--card)] text-[var(--ink)] border-[var(--line-strong)] hover:bg-[var(--card-subtle)]"
              }`}
            >
              {t("myspace", cat.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Card (Shown when writing / editing) */}
      {isEditing && (
        <form
          onSubmit={handleSaveNote}
          className="rounded-3xl border-2 border-[#79516F] dark:border-[#8D5C82] bg-[var(--card)] p-6 sm:p-8 shadow-md space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-[var(--ink)]">
              {editingId ? t("buttons", "edit") : t("myspace", "writeNew")}
            </h2>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="touch-target text-xs text-[var(--muted)] hover:text-[var(--ink)]"
            >
              {t("buttons", "cancel")}
            </button>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("myspace", "noteTitle")}
              className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] placeholder-[var(--muted)] focus-visible:outline-2 focus-visible:outline-[#79516F]"
            />

            <textarea
              rows="5"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t("myspace", "noteBody")}
              className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] p-4 text-sm text-[var(--ink)] placeholder-[var(--muted)] focus-visible:outline-2 focus-visible:outline-[#79516F]"
            />

            {/* Tag Selection & Options */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-[var(--muted)]">
                  {t("myspace", "noteTag")}:
                </label>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)]"
                >
                  <option value="journal">{t("myspace", "journal")}</option>
                  <option value="doctor">{t("myspace", "doctorQuestions")}</option>
                  <option value="letter">{t("myspace", "futureLetters")}</option>
                </select>
              </div>

              {tag === "letter" && (
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-[var(--plum)]">
                    {t("myspace", "revealDate")}:
                  </label>
                  <input
                    type="date"
                    value={revealDate}
                    onChange={(e) => setRevealDate(e.target.value)}
                    min={todayStr}
                    className="rounded-xl border border-[var(--line-strong)] bg-[var(--card-subtle)] px-3 py-1.5 text-xs text-[var(--ink)]"
                  />
                </div>
              )}

              {tag !== "letter" && (
                <label className="flex items-center gap-2 text-xs text-[var(--ink)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pinned}
                    onChange={(e) => setPinned(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#79516F]"
                  />
                  <span className="inline-flex items-center gap-1.5">
                    <IconBookmark className="h-3.5 w-3.5 text-[var(--plum)]" aria-hidden="true" />
                    {t("myspace", "pinned")}
                  </span>
                </label>
              )}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="touch-target rounded-xl border border-[var(--line-strong)] bg-[var(--card)] px-4 py-2 text-xs font-semibold text-[var(--ink)]"
            >
              {t("buttons", "cancel")}
            </button>
            <button
              type="submit"
              className="touch-target rounded-xl bg-[#79516F] px-5 py-2 text-xs font-bold text-white hover:bg-[#633E5A] dark:bg-[#8D5C82] dark:hover:bg-[#A06B95]"
            >
              {t("buttons", "save")}
            </button>
          </div>
        </form>
      )}

      {/* Future Letters Section (if selectedCategory is all or letter) */}
      {(selectedCategory === "all" || selectedCategory === "letter") && futureLetters.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-serif text-lg font-bold text-[var(--plum)] inline-flex items-center gap-2">
            <IconMail className="h-5 w-5 text-[var(--plum)]" aria-hidden="true" />
            <span>{t("myspace", "futureLetters")}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {futureLetters.map((letter) => {
              const isLocked = letter.revealDate && letter.revealDate > todayStr;
              return (
                <div
                  key={letter.id}
                  className="rounded-3xl border border-[#E9B7C8] dark:border-[#5C2E4A] bg-[var(--card)] p-6 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--plum)] inline-flex items-center gap-1.5">
                      {isLocked ? (
                        <>
                          <IconLock className="h-3.5 w-3.5 text-[var(--plum)]" aria-hidden="true" />
                          <span>Locked Capsule</span>
                        </>
                      ) : (
                        <>
                          <IconMail className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                          <span>Unlocked Letter</span>
                        </>
                      )}
                    </span>
                    <span className="text-xs text-[var(--muted)]">
                      {t("myspace", "lockedUntil")}: {letter.revealDate}
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-[var(--ink)]">
                    {letter.title}
                  </h3>

                  {isLocked ? (
                    <div className="rounded-2xl border border-dashed border-[var(--line-strong)] p-4 text-center text-xs text-[var(--muted)] bg-[var(--card-subtle)]">
                      <p>✨ Written for your future self on {letter.createdAt}.</p>
                      <p className="mt-1 font-semibold text-[var(--plum)]">
                        This capsule will open on {letter.revealDate}.
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs leading-relaxed text-[var(--ink)] bg-[var(--card-subtle)] p-3 rounded-xl border border-[var(--line)]">
                      {letter.body}
                    </p>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => handleDeleteNote(letter.id, true)}
                      className="text-[11px] text-[#8F1D1D] dark:text-[#FFB3B8] hover:underline"
                    >
                      {t("buttons", "delete")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Personal Notes Grid */}
      {selectedCategory !== "letter" && (
        <div className="space-y-4">
          {sortedNotes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sortedNotes.map((note) => (
                <div
                  key={note.id}
                  className={`rounded-3xl border p-6 shadow-xs space-y-3 transition-all ${
                    note.pinned
                      ? "border-[#79516F] dark:border-[#8D5C82] bg-[var(--card)] ring-1 ring-[#79516F]"
                      : "border-[var(--line)] bg-[var(--card)] hover:border-[var(--line-strong)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[var(--card-subtle)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--plum)] uppercase border border-[var(--line-strong)] inline-flex items-center gap-1.5">
                      {note.tag === "doctor" ? (
                        <>
                          <IconStethoscope className="h-3 w-3 text-[var(--plum)]" aria-hidden="true" />
                          <span>{t("myspace", "doctorQuestions")}</span>
                        </>
                      ) : (
                        <>
                          <IconBookOpen className="h-3 w-3 text-[var(--plum)]" aria-hidden="true" />
                          <span>{t("myspace", "journal")}</span>
                        </>
                      )}
                    </span>

                    <div className="flex items-center gap-2">
                      {note.pinned && (
                        <IconBookmark
                          className="h-3.5 w-3.5 text-[var(--plum)] fill-current"
                          aria-hidden="true"
                          title="Pinned"
                        />
                      )}
                      <span className="text-[11px] text-[var(--muted)]">{note.createdAt}</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-base font-bold text-[var(--ink)]">
                    {note.title}
                  </h3>

                  <p className="text-xs text-[var(--ink)] leading-relaxed line-clamp-4">
                    {note.body}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-[var(--line)]">
                    <button
                      type="button"
                      onClick={() => handleEditNote(note)}
                      className="text-xs font-semibold text-[var(--plum)] hover:underline"
                    >
                      {t("buttons", "edit")}
                    </button>

                    {deleteConfirmId === note.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-xs font-bold text-[#8F1D1D] dark:text-[#FFB3B8]"
                        >
                          {t("buttons", "confirm")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="text-xs text-[var(--muted)]"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(note.id)}
                        className="text-xs text-[#8F1D1D] dark:text-[#FFB3B8] hover:underline"
                      >
                        {t("buttons", "delete")}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-12 text-center space-y-3">
              <span className="text-3xl" aria-hidden="true">
                📖
              </span>
              <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
                {t("emptyStates", "noNotes")}
              </p>
              <button
                type="button"
                onClick={handleOpenNew}
                className="touch-target inline-flex items-center gap-1.5 rounded-xl bg-[#79516F] px-4 py-2 text-xs font-semibold text-white hover:bg-[#633E5A] dark:bg-[#8D5C82] dark:hover:bg-[#A06B95]"
              >
                + {t("myspace", "writeNew")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
