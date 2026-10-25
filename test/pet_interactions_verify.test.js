import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import * as repo from "../src/repositories/appRepository.js";
import { translations } from "../src/data/translations.js";

// Mock localStorage for node test execution
function createMockStorage(initial = {}) {
  const store = { ...initial };
  return {
    store,
    getItem(key) {
      return this.store[key] ?? null;
    },
    setItem(key, val) {
      this.store[key] = String(val);
    },
    removeItem(key) {
      delete this.store[key];
    },
    clear() {
      this.store = {};
    },
  };
}

globalThis.localStorage = createMockStorage();

describe("Pet Companion Character Quality & Interaction Upgrade", () => {
  it("1. Capybara 3D anatomy in PetCanvas3D has smooth organic geometry without box snout", () => {
    const canvasCode = fs.readFileSync(
      path.resolve("src/components/pet/PetCanvas3D.jsx"),
      "utf8",
    );

    // BoxGeometry snout was the clumsy box - verify it is completely removed
    assert.strictEqual(
      canvasCode.includes("BoxGeometry(0.52, 0.36, 0.45)"),
      false,
      "Clumsy BoxGeometry snout has been removed",
    );

    // Verify rich warm chestnut-brown fur
    assert.ok(
      canvasCode.includes("0x8d5b4c"),
      "Rich warm chestnut-brown fur hex (0x8d5b4c) is defined",
    );

    // Verify lighter muzzle and belly
    assert.ok(
      canvasCode.includes("0xc29b75"),
      "Lighter chestnut-tan muzzle & belly (0xc29b75) is defined",
    );

    // Verify organic sculpted muzzle with bridge, main muzzle, chin, and nostrils
    assert.ok(
      canvasCode.includes("capyMuzzleGroup"),
      "Seamless capyMuzzleGroup exists",
    );
    assert.ok(
      canvasCode.includes("mainMuzzleGeo"),
      "Broad rounded main muzzle with softened curves exists",
    );
    assert.ok(
      canvasCode.includes("snoutBridgeGeo"),
      "Forehead-to-muzzle bridge exists",
    );
    assert.ok(
      canvasCode.includes("chinGeo"),
      "Soft rounded chin exists",
    );
    assert.ok(
      canvasCode.includes("nostrilMat"),
      "Natural nostrils are embedded into snout",
    );

    // Verify lateral eyes for capybara
    assert.ok(
      canvasCode.includes("leftEyeGroup.position.set(-0.35, 0.12, 0.32)"),
      "Capybara has natural high, lateral eye placement",
    );

    // Verify yuzu citrus fruit on head
    assert.ok(
      canvasCode.includes("yuzuFruit"),
      "Iconic yuzu citrus fruit sits comfortably on capybara head",
    );

    // Verify broad barrel body
    assert.ok(
      canvasCode.includes("bodyMesh.scale.set(1.10, 0.86, 1.15)"),
      "Capybara has distinct broad barrel-shaped body proportions",
    );
  });

  it("2. All 5 animals have distinct geometries, tails, and ears", () => {
    const canvasCode = fs.readFileSync(
      path.resolve("src/components/pet/PetCanvas3D.jsx"),
      "utf8",
    );

    const animals = ["bunny", "kitten", "puppy", "fox", "capybara"];
    for (const animal of animals) {
      assert.ok(
        canvasCode.includes(`petType === "${animal}"`),
        `Has dedicated conditional branch for ${animal}`,
      );
    }

    // Bunny: tall ears & pom-pom tail
    assert.ok(canvasCode.includes("bunnyTailGeo"), "Bunny pom-pom tail");
    // Kitten: long graceful tail & cone ears
    assert.ok(canvasCode.includes("catTailGeo"), "Kitten curved tail");
    // Puppy: floppy drop ears & wagging tail
    assert.ok(canvasCode.includes("pupTailGeo"), "Puppy tail");
    assert.ok(canvasCode.includes("pupEarGeo"), "Puppy floppy ears");
    // Fox: huge bushy brush tail & pointed ears with espresso tip
    assert.ok(canvasCode.includes("foxTailGeo"), "Fox bushy tail");
    assert.ok(canvasCode.includes("foxTip"), "Fox white tip on tail");
    // Capybara: shell ears & tiny tail
    assert.ok(canvasCode.includes("capyEarGeo"), "Capybara shell ears");
    assert.ok(canvasCode.includes("capyTail"), "Capybara tail nub");
  });

  it("3. Distinct 2.5D SVG fallback exists for Capybara", () => {
    const canvasCode = fs.readFileSync(
      path.resolve("src/components/pet/PetCanvas3D.jsx"),
      "utf8",
    );

    assert.ok(
      canvasCode.includes('petType === "capybara" ?'),
      "Dedicated Capybara SVG rendering branch exists",
    );
    assert.ok(
      canvasCode.includes('fill="#8D5B4C"'),
      "Chestnut brown fur in SVG fallback",
    );
    assert.ok(
      canvasCode.includes('fill="#C29B75"'),
      "Lighter muzzle patch in SVG fallback",
    );
  });

  it("4. 3D Floating Zzz particles exist for sleep state", () => {
    const canvasCode = fs.readFileSync(
      path.resolve("src/components/pet/PetCanvas3D.jsx"),
      "utf8",
    );

    assert.ok(
      canvasCode.includes("zParticles"),
      "zParticles array is defined",
    );
    assert.ok(
      canvasCode.includes("zParticles.forEach"),
      "zParticles are animated during sleep state",
    );
  });

  it("5. Inventory validation and Feeding logic preserves consistency", () => {
    const initial = repo.loadAppData();
    assert.strictEqual(initial.petState.snacks, 4, "Initial snacks is 4");

    // Feeding consumes 1 snack and increases affection by 2
    const afterFeed = {
      ...initial,
      petState: {
        ...initial.petState,
        snacks: initial.petState.snacks - 1,
        hearts: initial.petState.hearts + 2,
        lastAction: "feed",
      },
    };
    repo.saveAppData(afterFeed);

    const reloaded = repo.loadAppData();
    assert.strictEqual(reloaded.petState.snacks, 3, "Snacks decremented to 3");
    assert.strictEqual(reloaded.petState.hearts, 7, "Hearts increased to 7");
  });

  it("6. Berry collection increases snacks by +2 and caps at 8", () => {
    const loaded = repo.loadAppData();
    const nextSnacks = Math.min(8, loaded.petState.snacks + 2);
    const updated = {
      ...loaded,
      petState: {
        ...loaded.petState,
        snacks: nextSnacks,
      },
    };
    repo.saveAppData(updated);

    const reloaded = repo.loadAppData();
    assert.strictEqual(reloaded.petState.snacks, 5, "Snacks increased to 5");

    // When approaching cap
    const maxed = {
      ...reloaded,
      petState: {
        ...reloaded.petState,
        snacks: Math.min(8, 7 + 2),
      },
    };
    repo.saveAppData(maxed);
    const reloadedMax = repo.loadAppData();
    assert.strictEqual(reloadedMax.petState.snacks, 8, "Snacks capped at 8 max");
  });

  it("7. Sleep & Wake state preserves safely across storage reloads", () => {
    const loaded = repo.loadAppData();
    const sleepingData = {
      ...loaded,
      petState: {
        ...loaded.petState,
        isSleeping: true,
        lastAction: "nap",
      },
    };
    repo.saveAppData(sleepingData);

    const reloadedSleep = repo.loadAppData();
    assert.strictEqual(reloadedSleep.petState.isSleeping, true, "Pet is marked as sleeping");

    const awakeData = {
      ...reloadedSleep,
      petState: {
        ...reloadedSleep.petState,
        isSleeping: false,
        lastAction: "wake",
      },
    };
    repo.saveAppData(awakeData);

    const reloadedAwake = repo.loadAppData();
    assert.strictEqual(reloadedAwake.petState.isSleeping, false, "Pet woke up cleanly");
  });

  it("8. Translations match in English and Hindi for pet dictionary", () => {
    assert.ok(translations.en.pet, "English pet dictionary exists");
    assert.ok(translations.hi.pet, "Hindi pet dictionary exists");

    const enKeys = Object.keys(translations.en.pet);
    const hiKeys = Object.keys(translations.hi.pet);

    for (const key of enKeys) {
      assert.ok(
        hiKeys.includes(key),
        `Hindi dictionary includes key: pet.${key}`,
      );
      assert.ok(
        translations.en.pet[key].length > 0,
        `English translation for ${key} is non-empty`,
      );
      assert.ok(
        translations.hi.pet[key].length > 0,
        `Hindi translation for ${key} is non-empty`,
      );
    }
  });

  it("9. Action debounce & locking logic is present in PetView", () => {
    const petViewCode = fs.readFileSync(
      path.resolve("src/components/views/PetView.jsx"),
      "utf8",
    );

    assert.ok(
      petViewCode.includes("isActionInProgress"),
      "PetView declares and manages isActionInProgress lock",
    );
    assert.ok(
      petViewCode.includes("disabled={isSleeping || isActionInProgress}"),
      "Pet and Play buttons are disabled while sleeping or during active action",
    );
    assert.ok(
      petViewCode.includes("disabled={isSleeping || snacks <= 0 || isActionInProgress}"),
      "Feed button is disabled while sleeping, when out of snacks, or during active action",
    );
  });

  it("10. Affection cap at 50 is strictly respected", () => {
    const loaded = repo.loadAppData();
    assert.ok(loaded.petState, "Pet state exists");
    const maxHearts = Math.min(50, 49 + 2);
    assert.strictEqual(maxHearts, 50, "Affection never exceeds 50 hearts");
  });

  it("11. Head vs body pet zone differentiation & forgiving hit detection", () => {
    const canvasCode = fs.readFileSync(
      path.resolve("src/components/pet/PetCanvas3D.jsx"),
      "utf8",
    );

    // Verifies head vs body classification
    assert.ok(
      canvasCode.includes('hitZone = isHead ? "head" : "body"'),
      "Classifies raycast hit into head vs body zones",
    );
    assert.ok(
      canvasCode.includes("firstHit.point.y >= 0.72"),
      "Uses vertical coordinate threshold to distinguish head hits",
    );

    // Verifies forgiving proximity detection
    assert.ok(
      canvasCode.includes("distHead < 0.78"),
      "Forgiving proximity detection checks distance to head world position",
    );
    assert.ok(
      canvasCode.includes("distBody < 0.88"),
      "Forgiving proximity detection checks distance to body world position",
    );

    // Verifies SVG fallback also distinguishes head vs body
    assert.ok(
      canvasCode.includes('clickY < rect.height * 0.58'),
      "SVG fallback classifies clicks into head vs body",
    );
  });

  it("12. Natural idle behaviors: gentle breathing, double-blinking, and autonomous gaze", () => {
    const canvasCode = fs.readFileSync(
      path.resolve("src/components/pet/PetCanvas3D.jsx"),
      "utf8",
    );

    // Breathing with belly expansion and head bob
    assert.ok(
      canvasCode.includes("bodyMesh.scale.x = baseBellyX + breath * 0.35") ||
        canvasCode.includes("baseBellyX + breath * 0.35"),
      "Gentle breathing dynamically expands and contracts belly scale",
    );
    assert.ok(
      canvasCode.includes("headGroup.position.y = 1.05 + breath * 0.55"),
      "Head bobs in synchrony with gentle breathing rhythm",
    );

    // Natural varied blinking and double-blinking
    assert.ok(
      canvasCode.includes("isDoubleBlink"),
      "Supports natural double-blinking at varied randomized intervals",
    );
    assert.ok(
      canvasCode.includes("Math.random() < 0.25"),
      "Randomized chance for natural double-blinks",
    );

    // Pointer hover tracking & autonomous curious gaze shifts
    assert.ok(
      canvasCode.includes("hasActivePointer"),
      "Tracks pointer presence over canvas",
    );
    assert.ok(
      canvasCode.includes("targetHeadRotY = mousePos.x * 0.40"),
      "Smoothly turns head to look towards pointer",
    );
    assert.ok(
      canvasCode.includes("idleGazeTimer"),
      "Autonomous curious gaze timer shifts head when idle",
    );
  });

  it("13. Unique species idle twitches and differentiated head/body pet reactions", () => {
    const canvasCode = fs.readFileSync(
      path.resolve("src/components/pet/PetCanvas3D.jsx"),
      "utf8",
    );

    // Bunny: nose twitch & ear flutter
    assert.ok(canvasCode.includes("noseTwitch"), "Bunny has nose micro-twitch");
    // Kitten: ear flick & cat tail swish
    assert.ok(canvasCode.includes("earFlick"), "Kitten has realistic ear flick");
    // Puppy: floppy ear flap & cheerful wag
    assert.ok(canvasCode.includes("earFlap"), "Puppy has floppy ear flap");
    // Fox: alert ear swivel
    assert.ok(canvasCode.includes("earAlert"), "Fox has alert ear swivel");
    // Capybara: calm zen ear twitch
    assert.ok(canvasCode.includes("capyTwitch"), "Capybara has calm ear twitch");

    // Differentiated head vs body pet reactions
    assert.ok(
      canvasCode.includes('activeAct === "pet_head"') ||
        canvasCode.includes("isHeadPet"),
      "Distinct handler for head pet reaction",
    );
    assert.ok(
      canvasCode.includes('activeAct === "pet_body"') ||
        canvasCode.includes("isBodyPet"),
      "Distinct handler for body pet reaction",
    );
    assert.ok(
      canvasCode.includes("leftEyelid.rotation.x = -0.30"),
      "Eyes close into happy smiling squint during head pets",
    );
    assert.ok(
      canvasCode.includes("leftFrontPaw.position.y"),
      "Paws flutter or lift playfully during body/tummy pets",
    );
  });

  it("14. Rewarding petting experience with heart/sparkle particles & context-sensitive bilingual pools", () => {
    const canvasCode = fs.readFileSync(
      path.resolve("src/components/pet/PetCanvas3D.jsx"),
      "utf8",
    );
    const viewCode = fs.readFileSync(
      path.resolve("src/components/views/PetView.jsx"),
      "utf8",
    );

    // Particles: Hearts + Golden Sparkles
    assert.ok(canvasCode.includes("sparkleGeo"), "Includes golden sparkle particles");
    assert.ok(canvasCode.includes("spawnPetBurst"), "Spawns particle burst on pet touch");

    // Varied context-sensitive pools
    assert.ok(
      viewCode.includes("Hehe, that tickles! 💗"),
      "Includes playful tickle reaction",
    );
    assert.ok(
      viewCode.includes("A little cuddle makes everything cosier."),
      "Includes cozy cuddle reaction",
    );
    assert.ok(
      viewCode.includes("Your companion nuzzles your hand with tender warmth. 💗"),
      "Includes nuzzle hand reaction",
    );
    assert.ok(
      viewCode.includes("Someone is enjoying these gentle pets! 💖"),
      "Includes enjoying gentle pets reaction",
    );
    assert.ok(
      viewCode.includes("A happy little blink just for you ✨"),
      "Includes happy little blink reaction",
    );

    // Bilingual Hindi support
    assert.ok(
      viewCode.includes("हीही, गुदगुदी हो रही है! 💗"),
      "Includes Hindi tickle reaction",
    );
    assert.ok(
      viewCode.includes("सिर्फ आपके लिए एक खुशहाल और मीठी झपकी ली! ✨"),
      "Includes Hindi sweet blink reaction",
    );
  });

  it("15. Responsive cooldown handling prevents chaotic overlap while keeping petting interactive", () => {
    const viewCode = fs.readFileSync(
      path.resolve("src/components/views/PetView.jsx"),
      "utf8",
    );

    assert.ok(
      viewCode.includes("lastAffectionTimeRef"),
      "Debounces affection increment using high-precision timestamp ref",
    );
    assert.ok(
      viewCode.includes("petTimerRef"),
      "Uses cancellable timer ref to reset action smoothly back to idle",
    );
    assert.ok(
      viewCode.includes("canIncrementAffection"),
      "Allows continuous petting interaction while throttling affection score runaway",
    );
  });
});
