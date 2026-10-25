import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function checkWebGLAvailability() {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

function getInitialReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * PetCanvas3D - Premium 3D Plush Virtual Companion for Saheli
 *
 * Implements genuine character-driven 3D plush models in Three.js for all 5 animals:
 * - 🐰 Bunny: Tall expressive ears, pink inner velvet, fluffy pom-pom tail, soft lavender fur.
 * - 🐱 Kitten: Perky triangular cat ears, delicate snout, graceful swaying tail, peach-cream fur.
 * - 🐶 Puppy: Floppy drop puppy ears that flap on hops, golden biscuit fur, cheerful wagging tail.
 * - 🦊 Fox: Vibrant terracotta amber fur, snowy chest ruff, pointed black-tipped ears, big brush tail.
 * - 🐹 Capybara: Toasted cocoa fur, iconic blocky rounded barrel snout, sleepy zen eyes, yuzu fruit on head.
 *
 * Perfect Camera Framing:
 * - Complete character visible from rug to ear tips without top clipping.
 * - Responsive FOV & distance adapting smoothly to portrait/mobile and landscape.
 *
 * Distinct 2.5D SVG Fallback:
 * - Specific handcrafted plush illustration for each animal when WebGL is unavailable or reduced motion is active.
 */
export function PetCanvas3D({
  petState = {},
  petType = "bunny",
  currentAction = "idle",
  isSleeping = false,
  growthStage = "baby",
  onPetClick,
  onPlayBallClick,
}) {
  const mountRef = useRef(null);
  const [webGLAvailable] = useState(checkWebGLAvailability);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    getInitialReducedMotion,
  );

  const onPetClickRef = useRef(onPetClick);
  const onPlayBallClickRef = useRef(onPlayBallClick);
  const currentActionRef = useRef(currentAction);
  const isSleepingRef = useRef(isSleeping);
  const growthStageRef = useRef(growthStage);

  useEffect(() => {
    onPetClickRef.current = onPetClick;
  }, [onPetClick]);

  useEffect(() => {
    onPlayBallClickRef.current = onPlayBallClick;
  }, [onPlayBallClick]);

  useEffect(() => {
    currentActionRef.current = currentAction;
  }, [currentAction]);

  useEffect(() => {
    isSleepingRef.current = isSleeping;
  }, [isSleeping]);

  useEffect(() => {
    growthStageRef.current = growthStage;
  }, [growthStage]);

  // Subscribe to reduced-motion preference changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener?.("change", handler);
    return () => mediaQuery.removeEventListener?.("change", handler);
  }, []);

  // Three.js Scene Setup & Loop
  useEffect(() => {
    if (prefersReducedMotion || !webGLAvailable) return;

    const container = mountRef.current;
    if (!container) return;

    let animationFrameId;
    let isDisposed = false;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);

    function updateCameraFraming(w, h) {
      const aspect = w / h;
      camera.aspect = aspect;
      // Pull back proportionally on portrait/narrow screens to ensure tall ears and props never clip
      const baseDistance = aspect < 1.0 ? 5.2 / Math.max(0.72, aspect) : 5.2;
      camera.position.set(0, 1.15, baseDistance);
      camera.lookAt(0, 0.92, 0);
      camera.updateProjectionMatrix();
    }
    updateCameraFraming(width, height);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.replaceChildren(renderer.domElement);
    } catch {
      return;
    }

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xfff6f0, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff1e8, 1.4);
    keyLight.position.set(2.5, 4.5, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 12;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8d5ea, 0.65);
    fillLight.position.set(-3.0, 2.5, 2.0);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffdbe8, 0.7);
    rimLight.position.set(0, 3.5, -3.5);
    scene.add(rimLight);

    // --- Dynamic Character Color Schemes ---
    let furHex = 0xf5ebf6; // bunny lavender default
    let innerEarHex = 0xf6c6d9;
    let tummyHex = 0xfff7fb;
    let noseHex = 0xe084a0;

    if (petType === "kitten") {
      furHex = 0xfdeee2; // warm peach cream
      innerEarHex = 0xf9bfce;
      tummyHex = 0xfffaf5;
      noseHex = 0xe2859e;
    } else if (petType === "puppy") {
      furHex = 0xedcbb1; // golden caramel biscuit
      innerEarHex = 0xb88863;
      tummyHex = 0xfff8f0;
      noseHex = 0x241a22;
    } else if (petType === "fox") {
      furHex = 0xe57350; // vibrant terracotta amber
      innerEarHex = 0xffffff;
      tummyHex = 0xffffff;
      noseHex = 0x221820;
    } else if (petType === "capybara") {
      furHex = 0x8d5b4c; // rich warm chestnut-brown earth fur
      innerEarHex = 0x764b3c; // slightly darker warm ear cavity
      tummyHex = 0xc29b75; // lighter chestnut-tan belly and muzzle
      noseHex = 0x38241d; // dark soft espresso
    }

    // Plush Materials
    const plushFurMat = new THREE.MeshStandardMaterial({
      color: furHex,
      roughness: 0.78,
      metalness: 0.04,
    });

    const innerEarMat = new THREE.MeshStandardMaterial({
      color: innerEarHex,
      roughness: 0.85,
      metalness: 0.02,
    });

    const tummyMat = new THREE.MeshStandardMaterial({
      color: tummyHex,
      roughness: 0.82,
      metalness: 0.02,
    });

    const cheekMat = new THREE.MeshBasicMaterial({
      color: 0xf39bb4,
      transparent: true,
      opacity: 0.55,
    });

    const glossyEyeMat = new THREE.MeshStandardMaterial({
      color: 0x1f1624,
      roughness: 0.08,
      metalness: 0.25,
    });

    const catchlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const softCatchlightMat = new THREE.MeshBasicMaterial({
      color: 0xf0e3f4,
      transparent: true,
      opacity: 0.75,
    });

    const noseMat = new THREE.MeshStandardMaterial({
      color: noseHex,
      roughness: 0.45,
      metalness: 0.1,
    });

    // --- Root Character Group ---
    const characterGroup = new THREE.Group();
    scene.add(characterGroup);
    characterGroup.position.set(0, -0.32, 0);

    // Woven Pastel Rug
    const rugGeo = new THREE.CylinderGeometry(1.65, 1.65, 0.03, 36);
    const rugMat = new THREE.MeshStandardMaterial({
      color: 0xfaf1f5,
      roughness: 0.9,
    });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.position.set(0, -0.015, 0);
    rug.receiveShadow = true;
    characterGroup.add(rug);

    const ringGeo = new THREE.RingGeometry(1.45, 1.58, 36);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xe8c7d8,
      side: THREE.DoubleSide,
    });
    const rugRing = new THREE.Mesh(ringGeo, ringMat);
    rugRing.rotation.x = -Math.PI / 2;
    rugRing.position.set(0, 0.002, 0);
    characterGroup.add(rugRing);

    // Soft Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(1.3, 1.1);
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext("2d");
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 60);
      grad.addColorStop(0, "rgba(100, 60, 90, 0.28)");
      grad.addColorStop(0.5, "rgba(120, 80, 110, 0.12)");
      grad.addColorStop(1, "rgba(120, 80, 110, 0)");
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, 0.005, 0);
    characterGroup.add(shadowMesh);

    // --- Body ---
    const bodyGroup = new THREE.Group();
    characterGroup.add(bodyGroup);

    const bodyGeo = new THREE.SphereGeometry(0.62, 32, 28);
    const bodyMesh = new THREE.Mesh(bodyGeo, plushFurMat);
    if (petType === "capybara") {
      // Broad, barrel-shaped body for Capybara
      bodyMesh.scale.set(1.10, 0.86, 1.15);
    } else {
      bodyMesh.scale.set(0.95, 0.88, 0.92);
    }
    bodyMesh.position.set(0, 0.52, 0);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    bodyGroup.add(bodyMesh);

    // Tummy patch
    const tummyGeo = new THREE.SphereGeometry(0.42, 24, 20);
    const tummyMesh = new THREE.Mesh(tummyGeo, tummyMat);
    if (petType === "capybara") {
      tummyMesh.scale.set(0.90, 0.76, 0.42);
      tummyMesh.position.set(0, 0.48, 0.50);
    } else {
      tummyMesh.scale.set(0.75, 0.82, 0.35);
      tummyMesh.position.set(0, 0.48, 0.46);
    }
    bodyGroup.add(tummyMesh);

    // Hind paws
    const hindPawGeo = new THREE.SphereGeometry(0.2, 20, 16);
    const leftHindPaw = new THREE.Mesh(hindPawGeo, plushFurMat);
    const rightHindPaw = new THREE.Mesh(hindPawGeo, plushFurMat);
    if (petType === "capybara") {
      leftHindPaw.scale.set(0.95, 0.54, 1.15);
      leftHindPaw.position.set(-0.46, 0.14, 0.22);
      rightHindPaw.scale.set(0.95, 0.54, 1.15);
      rightHindPaw.position.set(0.46, 0.14, 0.22);
    } else {
      leftHindPaw.scale.set(0.85, 0.6, 1.25);
      leftHindPaw.position.set(-0.42, 0.16, 0.22);
      rightHindPaw.scale.set(0.85, 0.6, 1.25);
      rightHindPaw.position.set(0.42, 0.16, 0.22);
    }
    leftHindPaw.castShadow = true;
    rightHindPaw.castShadow = true;
    bodyGroup.add(leftHindPaw, rightHindPaw);

    // Front paws
    const frontPawGeo = new THREE.SphereGeometry(0.14, 20, 16);
    const leftFrontPaw = new THREE.Mesh(frontPawGeo, plushFurMat);
    const rightFrontPaw = new THREE.Mesh(frontPawGeo, plushFurMat);
    if (petType === "capybara") {
      leftFrontPaw.scale.set(0.95, 0.74, 1.1);
      leftFrontPaw.position.set(-0.28, 0.32, 0.54);
      rightFrontPaw.scale.set(0.95, 0.74, 1.1);
      rightFrontPaw.position.set(0.28, 0.32, 0.54);
    } else {
      leftFrontPaw.scale.set(0.9, 0.8, 1.15);
      leftFrontPaw.position.set(-0.24, 0.36, 0.48);
      rightFrontPaw.scale.set(0.9, 0.8, 1.15);
      rightFrontPaw.position.set(0.24, 0.36, 0.48);
    }
    leftFrontPaw.castShadow = true;
    rightFrontPaw.castShadow = true;
    bodyGroup.add(leftFrontPaw, rightFrontPaw);

    // --- Distinct Tail Groups ---
    const tailPivot = new THREE.Group();
    tailPivot.position.set(0, 0.36, -0.58);
    bodyGroup.add(tailPivot);

    if (petType === "bunny") {
      // Bunny: Round fluffy pom-pom
      const bunnyTailGeo = new THREE.SphereGeometry(0.18, 20, 16);
      const bTail = new THREE.Mesh(bunnyTailGeo, tummyMat);
      bTail.castShadow = true;
      tailPivot.add(bTail);
    } else if (petType === "kitten") {
      // Kitten: Long elegant curved cat tail
      const catTailGeo = new THREE.CylinderGeometry(0.06, 0.045, 0.72, 16);
      const cTail = new THREE.Mesh(catTailGeo, plushFurMat);
      cTail.position.set(0, 0.34, -0.06);
      cTail.rotation.x = -0.4;
      cTail.castShadow = true;
      tailPivot.add(cTail);

      const cTip = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 12, 10),
        tummyMat,
      );
      cTip.position.set(0, 0.68, -0.2);
      tailPivot.add(cTip);
    } else if (petType === "puppy") {
      // Puppy: Perky wagging puppy tail
      const pupTailGeo = new THREE.CylinderGeometry(0.06, 0.04, 0.48, 16);
      const pTail = new THREE.Mesh(pupTailGeo, plushFurMat);
      pTail.position.set(0, 0.24, -0.05);
      pTail.rotation.x = -0.55;
      pTail.castShadow = true;
      tailPivot.add(pTail);
    } else if (petType === "fox") {
      // Fox: Huge, magnificent bushy brush tail with white tip
      const foxTailGeo = new THREE.SphereGeometry(0.26, 20, 16);
      const fTail = new THREE.Mesh(foxTailGeo, plushFurMat);
      fTail.scale.set(0.9, 1.6, 0.9);
      fTail.position.set(0.22, 0.42, 0.05);
      fTail.rotation.z = -0.35;
      fTail.rotation.x = -0.3;
      fTail.castShadow = true;
      tailPivot.add(fTail);

      const fTip = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 14),
        tummyMat,
      );
      fTip.position.set(0.38, 0.78, 0.1);
      tailPivot.add(fTip);
    } else if (petType === "capybara") {
      // Capybara: Tiny discrete tail nub
      const capyTail = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 10, 8),
        plushFurMat,
      );
      tailPivot.add(capyTail);
    }

    // --- Head Hierarchy ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.05, 0.08);
    characterGroup.add(headGroup);

    const headGeo = new THREE.SphereGeometry(0.54, 32, 28);
    const headMesh = new THREE.Mesh(headGeo, plushFurMat);
    if (petType === "capybara") {
      // Rounded, slightly elongated head
      headMesh.scale.set(0.96, 0.98, 1.25);
      headMesh.rotation.x = 0.04;
    } else {
      headMesh.scale.set(1.06, 0.96, 0.98);
    }
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Cheeks & Snout Variations
    if (petType === "capybara") {
      // Sculpted organic rounded muzzle that blends naturally into the head
      const capyMuzzleMat = new THREE.MeshStandardMaterial({
        color: 0xc29b75, // lighter chestnut-tan muzzle
        roughness: 0.82,
        metalness: 0.02,
      });

      const capyMuzzleGroup = new THREE.Group();
      capyMuzzleGroup.position.set(0, -0.07, 0.44);
      headGroup.add(capyMuzzleGroup);

      // 1. Broad, rounded main muzzle with softened curves
      const mainMuzzleGeo = new THREE.SphereGeometry(0.35, 28, 22);
      const mainMuzzle = new THREE.Mesh(mainMuzzleGeo, capyMuzzleMat);
      mainMuzzle.scale.set(1.22, 0.82, 1.15);
      mainMuzzle.castShadow = true;
      capyMuzzleGroup.add(mainMuzzle);

      // 2. Snout bridge seamlessly connecting forehead into the broad muzzle
      const snoutBridgeGeo = new THREE.SphereGeometry(0.30, 24, 18);
      const snoutBridge = new THREE.Mesh(snoutBridgeGeo, capyMuzzleMat);
      snoutBridge.scale.set(1.08, 0.74, 1.12);
      snoutBridge.position.set(0, 0.12, -0.06);
      capyMuzzleGroup.add(snoutBridge);

      // 3. Smooth rounded lower chin
      const chinGeo = new THREE.SphereGeometry(0.25, 20, 16);
      const chin = new THREE.Mesh(chinGeo, capyMuzzleMat);
      chin.scale.set(1.04, 0.62, 0.95);
      chin.position.set(0, -0.13, -0.06);
      capyMuzzleGroup.add(chin);

      // 4. Subtle, naturally positioned dark oval nostrils
      const nostrilMat = new THREE.MeshBasicMaterial({ color: 0x38241d });
      const nostrilGeo = new THREE.SphereGeometry(0.038, 12, 10);

      const leftNostril = new THREE.Mesh(nostrilGeo, nostrilMat);
      leftNostril.scale.set(0.9, 1.35, 0.7);
      leftNostril.position.set(-0.11, 0.02, 0.38);
      leftNostril.rotation.z = 0.2;
      capyMuzzleGroup.add(leftNostril);

      const rightNostril = new THREE.Mesh(nostrilGeo, nostrilMat);
      rightNostril.scale.set(0.9, 1.35, 0.7);
      rightNostril.position.set(0.11, 0.02, 0.38);
      rightNostril.rotation.z = -0.2;
      capyMuzzleGroup.add(rightNostril);

      // 5. Subtle zen curved mouth line under nostrils
      const mouthGeo = new THREE.TorusGeometry(0.075, 0.013, 8, 16, Math.PI);
      const mouthMat = new THREE.MeshBasicMaterial({ color: 0x5a3c2e });
      const mouth = new THREE.Mesh(mouthGeo, mouthMat);
      mouth.rotation.x = Math.PI * 0.45;
      mouth.position.set(0, -0.11, 0.36);
      capyMuzzleGroup.add(mouth);
    } else {
      // Standard Chubby Cheeks
      const cheekGeo = new THREE.SphereGeometry(0.22, 20, 16);
      const leftCheek = new THREE.Mesh(cheekGeo, plushFurMat);
      leftCheek.scale.set(1.05, 0.82, 0.85);
      leftCheek.position.set(-0.32, -0.1, 0.3);
      headGroup.add(leftCheek);

      const rightCheek = new THREE.Mesh(cheekGeo, plushFurMat);
      rightCheek.scale.set(1.05, 0.82, 0.85);
      rightCheek.position.set(0.32, -0.1, 0.3);
      headGroup.add(rightCheek);

      // Cute button nose
      const noseGeo = new THREE.SphereGeometry(0.065, 16, 12);
      const noseMesh = new THREE.Mesh(noseGeo, noseMat);
      noseMesh.scale.set(1.15, 0.85, 0.8);
      noseMesh.position.set(0, -0.05, 0.52);
      headGroup.add(noseMesh);
    }

    // Soft blush spots
    const blushGeo = new THREE.PlaneGeometry(0.18, 0.12);
    const leftBlush = new THREE.Mesh(blushGeo, cheekMat);
    const rightBlush = new THREE.Mesh(blushGeo, cheekMat);
    if (petType === "capybara") {
      leftBlush.position.set(-0.38, -0.02, 0.28);
      leftBlush.rotation.y = -0.45;
      rightBlush.position.set(0.38, -0.02, 0.28);
      rightBlush.rotation.y = 0.45;
    } else {
      leftBlush.position.set(-0.32, -0.06, 0.44);
      leftBlush.rotation.y = -0.3;
      rightBlush.position.set(0.32, -0.06, 0.44);
      rightBlush.rotation.y = 0.3;
    }
    headGroup.add(leftBlush, rightBlush);

    // --- Glossy Eyes with Highlights ---
    const eyeGeo = new THREE.SphereGeometry(0.11, 24, 20);

    const leftEyeGroup = new THREE.Group();
    const rightEyeGroup = new THREE.Group();

    if (petType === "capybara") {
      // Natural high and lateral eye placement for Capybara
      leftEyeGroup.position.set(-0.35, 0.12, 0.32);
      leftEyeGroup.rotation.y = -0.42;
      leftEyeGroup.scale.set(0.85, 0.78, 0.85);

      rightEyeGroup.position.set(0.35, 0.12, 0.32);
      rightEyeGroup.rotation.y = 0.42;
      rightEyeGroup.scale.set(0.85, 0.78, 0.85);
    } else {
      leftEyeGroup.position.set(-0.24, 0.08, 0.44);
      rightEyeGroup.position.set(0.24, 0.08, 0.44);
    }
    headGroup.add(leftEyeGroup, rightEyeGroup);

    const leftEyeBall = new THREE.Mesh(eyeGeo, glossyEyeMat);
    leftEyeGroup.add(leftEyeBall);

    const bigCatchlightGeo = new THREE.SphereGeometry(0.038, 16, 12);
    const leftCatch1 = new THREE.Mesh(bigCatchlightGeo, catchlightMat);
    leftCatch1.position.set(-0.025, 0.04, 0.095);
    leftEyeGroup.add(leftCatch1);

    const smallCatchlightGeo = new THREE.SphereGeometry(0.02, 12, 10);
    const leftCatch2 = new THREE.Mesh(smallCatchlightGeo, softCatchlightMat);
    leftCatch2.position.set(0.045, -0.03, 0.092);
    leftEyeGroup.add(leftCatch2);

    const eyelidGeo = new THREE.SphereGeometry(
      0.12,
      24,
      16,
      0,
      Math.PI * 2,
      0,
      Math.PI / 2,
    );
    const leftEyelid = new THREE.Mesh(eyelidGeo, plushFurMat);
    leftEyelid.rotation.x = -Math.PI / 2;
    leftEyeGroup.add(leftEyelid);

    const rightEyeBall = new THREE.Mesh(eyeGeo, glossyEyeMat);
    rightEyeGroup.add(rightEyeBall);

    const rightCatch1 = new THREE.Mesh(bigCatchlightGeo, catchlightMat);
    rightCatch1.position.set(-0.025, 0.04, 0.095);
    rightEyeGroup.add(rightCatch1);

    const rightCatch2 = new THREE.Mesh(smallCatchlightGeo, softCatchlightMat);
    rightCatch2.position.set(0.045, -0.03, 0.092);
    rightEyeGroup.add(rightCatch2);

    const rightEyelid = new THREE.Mesh(eyelidGeo, plushFurMat);
    rightEyelid.rotation.x = -Math.PI / 2;
    rightEyeGroup.add(rightEyelid);

    // --- Distinct Animal Ears Geometry & Pivots ---
    const leftEarPivot = new THREE.Group();
    headGroup.add(leftEarPivot);

    const rightEarPivot = new THREE.Group();
    headGroup.add(rightEarPivot);

    if (petType === "bunny") {
      // 🐰 Bunny: Tall elongated upright rabbit ears
      leftEarPivot.position.set(-0.2, 0.45, -0.04);
      rightEarPivot.position.set(0.2, 0.45, -0.04);

      const earOuterGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.82, 20);
      const lEar = new THREE.Mesh(earOuterGeo, plushFurMat);
      lEar.scale.set(1.0, 1.0, 0.45);
      lEar.position.set(0, 0.38, 0);
      lEar.castShadow = true;
      leftEarPivot.add(lEar);

      const earTipGeo = new THREE.SphereGeometry(0.08, 16, 12);
      const lTip = new THREE.Mesh(earTipGeo, plushFurMat);
      lTip.scale.set(1.0, 0.8, 0.45);
      lTip.position.set(0, 0.78, 0);
      leftEarPivot.add(lTip);

      const earInnerGeo = new THREE.CylinderGeometry(0.05, 0.08, 0.65, 16);
      const lInner = new THREE.Mesh(earInnerGeo, innerEarMat);
      lInner.scale.set(0.9, 1.0, 0.3);
      lInner.position.set(0, 0.36, 0.035);
      leftEarPivot.add(lInner);

      const rEar = lEar.clone();
      const rTip = lTip.clone();
      const rInner = lInner.clone();
      rightEarPivot.add(rEar, rTip, rInner);

      leftEarPivot.rotation.z = 0.15;
      rightEarPivot.rotation.z = -0.15;
    } else if (petType === "kitten") {
      // 🐱 Kitten: Perky triangular feline ears
      leftEarPivot.position.set(-0.28, 0.42, 0.02);
      rightEarPivot.position.set(0.28, 0.42, 0.02);

      const catEarGeo = new THREE.ConeGeometry(0.18, 0.36, 16);
      const lEar = new THREE.Mesh(catEarGeo, plushFurMat);
      lEar.position.set(0, 0.18, 0);
      lEar.scale.set(1.0, 1.0, 0.55);
      lEar.castShadow = true;
      leftEarPivot.add(lEar);

      const catInnerGeo = new THREE.ConeGeometry(0.11, 0.28, 12);
      const lInner = new THREE.Mesh(catInnerGeo, innerEarMat);
      lInner.position.set(0, 0.14, 0.03);
      lInner.scale.set(1.0, 1.0, 0.4);
      leftEarPivot.add(lInner);

      const rEar = lEar.clone();
      const rInner = lInner.clone();
      rightEarPivot.add(rEar, rInner);

      leftEarPivot.rotation.z = 0.35;
      rightEarPivot.rotation.z = -0.35;
    } else if (petType === "puppy") {
      // 🐶 Puppy: Adorable floppy drop ears that fold down
      leftEarPivot.position.set(-0.35, 0.32, 0.08);
      rightEarPivot.position.set(0.35, 0.32, 0.08);

      const pupEarGeo = new THREE.CylinderGeometry(0.08, 0.14, 0.58, 16);
      const lEar = new THREE.Mesh(pupEarGeo, plushFurMat);
      lEar.position.set(0, -0.22, 0);
      lEar.scale.set(1.0, 1.0, 0.45);
      lEar.castShadow = true;
      leftEarPivot.add(lEar);

      const pupTip = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 14, 10),
        plushFurMat,
      );
      pupTip.scale.set(1.0, 0.7, 0.45);
      pupTip.position.set(0, -0.48, 0);
      leftEarPivot.add(pupTip);

      const rEar = lEar.clone();
      const rTip = pupTip.clone();
      rightEarPivot.add(rEar, rTip);

      leftEarPivot.rotation.z = 0.45;
      leftEarPivot.rotation.x = 0.25;
      rightEarPivot.rotation.z = -0.45;
      rightEarPivot.rotation.x = 0.25;
    } else if (petType === "fox") {
      // 🦊 Fox: Large pointed triangular ears with dark espresso tips
      leftEarPivot.position.set(-0.25, 0.42, 0.0);
      rightEarPivot.position.set(0.25, 0.42, 0.0);

      const foxEarGeo = new THREE.ConeGeometry(0.18, 0.48, 16);
      const lEar = new THREE.Mesh(foxEarGeo, plushFurMat);
      lEar.position.set(0, 0.24, 0);
      lEar.scale.set(1.0, 1.0, 0.55);
      lEar.castShadow = true;
      leftEarPivot.add(lEar);

      // Espresso tip
      const tipMat = new THREE.MeshStandardMaterial({
        color: 0x38241d,
        roughness: 0.8,
      });
      const foxTip = new THREE.Mesh(
        new THREE.ConeGeometry(0.09, 0.18, 12),
        tipMat,
      );
      foxTip.position.set(0, 0.39, 0);
      foxTip.scale.set(1.0, 1.0, 0.55);
      leftEarPivot.add(foxTip);

      const rEar = lEar.clone();
      const rTip = foxTip.clone();
      rightEarPivot.add(rEar, rTip);

      leftEarPivot.rotation.z = 0.3;
      rightEarPivot.rotation.z = -0.3;
    } else if (petType === "capybara") {
      // 🐹 Capybara: Small cute rounded shell ears near top of the head
      leftEarPivot.position.set(-0.30, 0.32, -0.02);
      rightEarPivot.position.set(0.30, 0.32, -0.02);

      const capyEarGeo = new THREE.SphereGeometry(0.095, 16, 12);
      const lEar = new THREE.Mesh(capyEarGeo, plushFurMat);
      lEar.scale.set(1.0, 0.72, 0.38);
      leftEarPivot.add(lEar);

      const lInner = new THREE.Mesh(
        new THREE.SphereGeometry(0.065, 12, 10),
        innerEarMat,
      );
      lInner.scale.set(1.0, 0.70, 0.25);
      lInner.position.set(0, 0, 0.02);
      leftEarPivot.add(lInner);

      const rEar = lEar.clone();
      const rInner = lInner.clone();
      rightEarPivot.add(rEar, rInner);

      leftEarPivot.rotation.z = 0.32;
      leftEarPivot.rotation.x = -0.12;
      rightEarPivot.rotation.z = -0.32;
      rightEarPivot.rotation.x = -0.12;

      // Special Capybara Head Yuzu Citrus Fruit!
      const yuzuGroup = new THREE.Group();
      yuzuGroup.position.set(0, 0.52, 0.05);
      headGroup.add(yuzuGroup);

      const yuzuMat = new THREE.MeshStandardMaterial({
        color: 0xff9e1b,
        roughness: 0.35,
      });
      const yuzuFruit = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 16, 14),
        yuzuMat,
      );
      yuzuFruit.scale.set(1.0, 0.85, 1.0);
      yuzuGroup.add(yuzuFruit);

      const leafMat = new THREE.MeshStandardMaterial({
        color: 0x489d6e,
        roughness: 0.5,
      });
      const yuzuLeaf = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 10, 8),
        leafMat,
      );
      yuzuLeaf.scale.set(1.3, 0.22, 0.65);
      yuzuLeaf.position.set(0.04, 0.10, 0);
      yuzuLeaf.rotation.z = 0.4;
      yuzuGroup.add(yuzuLeaf);
    }

    // --- Growth Stage Accessories ---
    const flowerGroup = new THREE.Group();
    flowerGroup.position.set(-0.32, 0.44, 0.12);
    headGroup.add(flowerGroup);

    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xfcbcd2,
      roughness: 0.6,
    });
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0xfde08b,
      roughness: 0.4,
    });

    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const petalGeo = new THREE.SphereGeometry(0.06, 12, 10);
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.scale.set(1.0, 0.4, 0.8);
      petal.position.set(Math.cos(angle) * 0.08, Math.sin(angle) * 0.08, 0);
      flowerGroup.add(petal);
    }

    const centerGeo = new THREE.SphereGeometry(0.05, 12, 10);
    const center = new THREE.Mesh(centerGeo, centerMat);
    center.position.set(0, 0, 0.03);
    flowerGroup.add(center);

    const crownGroup = new THREE.Group();
    crownGroup.position.set(0, 0.46, 0.06);
    headGroup.add(crownGroup);

    const crownLeafMat = new THREE.MeshStandardMaterial({
      color: 0xc8e3ca,
      roughness: 0.7,
    });
    for (let i = 0; i < 7; i++) {
      const lGeo = new THREE.SphereGeometry(0.045, 10, 8);
      const leaf = new THREE.Mesh(lGeo, crownLeafMat);
      leaf.scale.set(1.2, 0.4, 0.8);
      const spread = (i - 3) * 0.11;
      leaf.position.set(spread, 0.02 - Math.abs(spread) * 0.1, 0.38);
      crownGroup.add(leaf);
    }

    // --- Interactive 3D Props ---
    // 1. Strawberry Snack
    const snackGroup = new THREE.Group();
    snackGroup.visible = false;
    scene.add(snackGroup);

    const berryGeo = new THREE.ConeGeometry(0.16, 0.28, 16);
    const berryMat = new THREE.MeshStandardMaterial({
      color: 0xef476f,
      roughness: 0.3,
      metalness: 0.1,
    });
    const berryMesh = new THREE.Mesh(berryGeo, berryMat);
    berryMesh.rotation.x = Math.PI;
    snackGroup.add(berryMesh);

    const berryLeafMat = new THREE.MeshStandardMaterial({
      color: 0x52b788,
      roughness: 0.6,
    });
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const bLeaf = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 8, 8),
        berryLeafMat,
      );
      bLeaf.scale.set(1.2, 0.3, 0.6);
      bLeaf.position.set(
        Math.cos(angle) * 0.09,
        0.14,
        Math.sin(angle) * 0.09,
      );
      snackGroup.add(bLeaf);
    }

    // 2. Pastel Bouncy Ball
    const ballGroup = new THREE.Group();
    ballGroup.visible = false;
    scene.add(ballGroup);

    const ballGeo = new THREE.SphereGeometry(0.24, 24, 20);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0xdcebdd,
      roughness: 0.4,
      metalness: 0.05,
    });
    const ballMesh = new THREE.Mesh(ballGeo, ballMat);
    ballMesh.castShadow = true;
    ballGroup.add(ballMesh);

    const stripeGeo = new THREE.TorusGeometry(0.242, 0.035, 12, 32);
    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0xe9b7c8,
      roughness: 0.3,
    });
    const stripeMesh = new THREE.Mesh(stripeGeo, stripeMat);
    ballGroup.add(stripeMesh);

    // 3. Floating Heart & Sparkle Particles
    const heartParticles = [];
    const heartGeo = new THREE.SphereGeometry(0.065, 12, 10);
    const heartMat = new THREE.MeshStandardMaterial({
      color: 0xf7a8c4,
      roughness: 0.35,
    });
    const sparkleGeo = new THREE.OctahedronGeometry(0.048, 0);
    const sparkleMat = new THREE.MeshBasicMaterial({
      color: 0xffdf88,
      transparent: true,
      opacity: 0.92,
    });

    for (let i = 0; i < 8; i++) {
      const isSparkle = i % 2 === 1;
      const pMesh = new THREE.Mesh(
        isSparkle ? sparkleGeo : heartGeo,
        isSparkle ? sparkleMat : heartMat,
      );
      pMesh.visible = false;
      scene.add(pMesh);
      heartParticles.push({
        mesh: pMesh,
        active: false,
        age: 0,
        maxAge: 1.2 + Math.random() * 0.4,
        vx: 0,
        vy: 0.016,
        vz: 0,
        rotSpeed: (Math.random() - 0.5) * 0.12,
      });
    }

    function spawnPetBurst(originVec, zone) {
      heartParticles.forEach((hp) => {
        hp.active = true;
        hp.mesh.visible = true;
        hp.age = 0;
        const spreadX = (Math.random() - 0.5) * (zone === "head" ? 0.35 : 0.55);
        const spreadY = (Math.random() - 0.5) * 0.2;
        const spreadZ = (Math.random() - 0.5) * 0.25;
        hp.mesh.position.set(
          originVec.x + spreadX,
          originVec.y + spreadY + 0.1,
          originVec.z + spreadZ,
        );
        hp.vx = (Math.random() - 0.5) * 0.008;
        hp.vy = 0.015 + Math.random() * 0.012;
        hp.vz = (Math.random() - 0.5) * 0.006;
      });
    }

    // 4. Floating 3D "Zzz" Particles for Sleeping State
    const zCanvas = document.createElement("canvas");
    zCanvas.width = 64;
    zCanvas.height = 64;
    const zCtx = zCanvas.getContext("2d");
    if (zCtx) {
      zCtx.fillStyle = "rgba(185, 140, 195, 0.95)";
      zCtx.font = "bold 44px sans-serif";
      zCtx.textAlign = "center";
      zCtx.textBaseline = "middle";
      zCtx.fillText("z", 32, 32);
    }
    const zTex = new THREE.CanvasTexture(zCanvas);
    const zMat = new THREE.MeshBasicMaterial({
      map: zTex,
      transparent: true,
      depthWrite: false,
    });
    const zParticles = [];
    for (let i = 0; i < 3; i++) {
      const zMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.24), zMat);
      zMesh.visible = false;
      scene.add(zMesh);
      zParticles.push({
        mesh: zMesh,
        offset: i * 0.95,
        i,
      });
    }

    // --- Interactive Mouse & Touch Raycasting with Forgiving Boundaries ---
    const raycaster = new THREE.Raycaster();
    const mousePos = new THREE.Vector2(0, 0);
    let targetHeadRotY = 0;
    let targetHeadRotX = 0;
    let targetHeadRotZ = 0;
    let lastPointerTime = -10;
    let hasActivePointer = false;
    let lastClickTime = 0;

    function handlePointerMove(e) {
      const rect = renderer.domElement.getBoundingClientRect();
      const clientX = e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches && e.touches[0] ? e.touches[0].clientY : e.clientY;

      if (typeof clientX !== "number" || typeof clientY !== "number") return;

      mousePos.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mousePos.y = -(((clientY - rect.top) / rect.height) * 2 - 1);

      hasActivePointer = true;
      lastPointerTime = clock.getElapsedTime();
    }

    function handlePointerLeave() {
      hasActivePointer = false;
    }

    function handleCanvasClick(e) {
      const now = performance.now();
      if (now - lastClickTime < 180) return;
      lastClickTime = now;

      const rect = renderer.domElement.getBoundingClientRect();
      const clientX = e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches && e.touches[0] ? e.touches[0].clientY : e.clientY;

      if (typeof clientX !== "number" || typeof clientY !== "number") return;

      const clickCoords = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -(((clientY - rect.top) / rect.height) * 2 - 1),
      );

      raycaster.setFromCamera(clickCoords, camera);

      if (ballGroup.visible) {
        const ballHits = raycaster.intersectObjects(ballGroup.children, true);
        if (ballHits.length > 0) {
          if (onPlayBallClickRef.current) onPlayBallClickRef.current();
          return;
        }
      }

      if (isSleepingRef.current) {
        if (onPetClickRef.current) onPetClickRef.current("head");
        return;
      }

      // Check direct character mesh hits first
      const hits = raycaster.intersectObjects(characterGroup.children, true);
      let hitZone = "head";
      let isHit = false;
      const burstPos = new THREE.Vector3(0, 1.05, 0.4);

      if (hits.length > 0) {
        isHit = true;
        const firstHit = hits[0];
        burstPos.copy(firstHit.point);

        // Distinguish head vs body:
        // Check if hit object is inside headGroup or if world Y >= 0.72
        let isHead = firstHit.point.y >= 0.72;
        let curr = firstHit.object;
        while (curr && curr !== characterGroup) {
          if (curr === headGroup) {
            isHead = true;
            break;
          }
          if (curr === bodyGroup) {
            isHead = false;
            break;
          }
          curr = curr.parent;
        }
        hitZone = isHead ? "head" : "body";
      } else {
        // Accessible & forgiving hit detection: clicks near face or body trigger interaction
        const headWorld = new THREE.Vector3();
        headGroup.getWorldPosition(headWorld);
        const distHead = raycaster.ray.distanceToPoint(headWorld);

        const bodyWorld = new THREE.Vector3();
        bodyGroup.getWorldPosition(bodyWorld);
        const distBody = raycaster.ray.distanceToPoint(bodyWorld);

        if (distHead < 0.78) {
          isHit = true;
          hitZone = "head";
          burstPos.copy(headWorld);
          burstPos.z += 0.25;
        } else if (distBody < 0.88) {
          isHit = true;
          hitZone = "body";
          burstPos.copy(bodyWorld);
          burstPos.z += 0.35;
        }
      }

      if (isHit && onPetClickRef.current) {
        spawnPetBurst(burstPos, hitZone);
        onPetClickRef.current(hitZone);
      }
    }

    const domElement = renderer.domElement;
    domElement.addEventListener("mousemove", handlePointerMove);
    domElement.addEventListener("mouseleave", handlePointerLeave);
    domElement.addEventListener("touchmove", handlePointerMove, {
      passive: true,
    });
    domElement.addEventListener("touchend", handlePointerLeave, {
      passive: true,
    });
    domElement.addEventListener("click", handleCanvasClick);

    // --- Animation Timers & Loop ---
    let clock = new THREE.Clock();
    let blinkTimer = 0;
    let nextBlinkTime = 3.2;
    let isBlinking = false;
    let isDoubleBlink = false;
    let idleGazeTimer = 0;
    let nextIdleGazeTime = 3.5;
    let idleGazeTargetY = 0;
    let idleGazeTargetX = 0;
    let idleGazeTargetZ = 0;
    let actionTimer = 0;
    let lastHandledAction = "idle";

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newW = entry.contentRect.width;
        const newH = entry.contentRect.height;
        if (newW > 0 && newH > 0 && renderer) {
          renderer.setSize(newW, newH);
          updateCameraFraming(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    function animate() {
      if (isDisposed) return;
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const sleepState = isSleepingRef.current;
      const stage = growthStageRef.current;
      const activeAct = currentActionRef.current;

      flowerGroup.visible = stage === "growing" || stage === "grown";
      crownGroup.visible = stage === "grown";

      const targetScale =
        stage === "grown" ? 1.08 : stage === "growing" ? 1.0 : 0.90;
      characterGroup.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.08,
      );

      if (activeAct !== lastHandledAction) {
        lastHandledAction = activeAct;
        actionTimer = 0;
      }

      // Smooth Lighting
      const targetAmbientIntensity = sleepState ? 0.45 : 0.95;
      ambientLight.intensity +=
        (targetAmbientIntensity - ambientLight.intensity) * 0.05;

      const targetKeyIntensity = sleepState ? 0.4 : 1.4;
      keyLight.intensity += (targetKeyIntensity - keyLight.intensity) * 0.05;

      if (sleepState) {
        ambientLight.color.lerp(new THREE.Color(0x755d82), 0.05);
      } else {
        ambientLight.color.lerp(new THREE.Color(0xfff6f0), 0.05);
      }

      // Natural Blinking with Randomized Intervals & Double-Blinking
      blinkTimer += delta;
      if (sleepState) {
        leftEyelid.rotation.x = 0;
        rightEyelid.rotation.x = 0;
      } else {
        if (!isBlinking && blinkTimer > nextBlinkTime) {
          isBlinking = true;
          blinkTimer = 0;
          isDoubleBlink = Math.random() < 0.25;
          nextBlinkTime = 2.6 + Math.random() * 3.4;
        }

        if (isBlinking) {
          if (!isDoubleBlink) {
            // Single natural blink
            if (blinkTimer < 0.12) {
              leftEyelid.rotation.x = 0;
              rightEyelid.rotation.x = 0;
            } else {
              leftEyelid.rotation.x = -Math.PI / 2;
              rightEyelid.rotation.x = -Math.PI / 2;
              isBlinking = false;
            }
          } else {
            // Natural double blink
            if (blinkTimer < 0.09) {
              leftEyelid.rotation.x = 0;
              rightEyelid.rotation.x = 0;
            } else if (blinkTimer < 0.16) {
              leftEyelid.rotation.x = -Math.PI / 2;
              rightEyelid.rotation.x = -Math.PI / 2;
            } else if (blinkTimer < 0.25) {
              leftEyelid.rotation.x = 0;
              rightEyelid.rotation.x = 0;
            } else {
              leftEyelid.rotation.x = -Math.PI / 2;
              rightEyelid.rotation.x = -Math.PI / 2;
              isBlinking = false;
            }
          }
        } else if (activeAct !== "pet_head" && activeAct !== "pet") {
          leftEyelid.rotation.x = -Math.PI / 2;
          rightEyelid.rotation.x = -Math.PI / 2;
        }
      }

      // Interactive Pointer Tracking vs Autonomous Curious Idle Gaze
      const timeSincePointer = elapsed - lastPointerTime;
      if (hasActivePointer && timeSincePointer < 1.8 && !sleepState) {
        // Looking curiously towards pointer
        targetHeadRotY = mousePos.x * 0.40;
        targetHeadRotX = -mousePos.y * 0.24;
        targetHeadRotZ = mousePos.x * 0.08;
      } else if (!sleepState) {
        // Autonomous Gentle Idle Gaze Shifts
        idleGazeTimer += delta;
        if (idleGazeTimer > nextIdleGazeTime) {
          idleGazeTimer = 0;
          nextIdleGazeTime = 3.2 + Math.random() * 3.0;
          idleGazeTargetY = (Math.random() - 0.5) * 0.28;
          idleGazeTargetX = (Math.random() - 0.4) * 0.12;
          idleGazeTargetZ = (Math.random() - 0.5) * 0.08;
        }
        targetHeadRotY = idleGazeTargetY;
        targetHeadRotX = idleGazeTargetX;
        targetHeadRotZ = idleGazeTargetZ;
      }

      // Smooth Head Rotation Damping
      headGroup.rotation.y += (targetHeadRotY - headGroup.rotation.y) * 0.07;
      headGroup.rotation.x += (targetHeadRotX - headGroup.rotation.x) * 0.07;
      if (activeAct === "idle") {
        headGroup.rotation.z += (targetHeadRotZ - headGroup.rotation.z) * 0.07;
      }

      // Tail Base Idle Animations
      if (petType === "kitten") {
        tailPivot.rotation.z = Math.sin(elapsed * 2.2) * 0.35;
      } else if (petType === "puppy") {
        tailPivot.rotation.y = Math.sin(elapsed * 6.5) * 0.42;
      } else if (petType === "fox") {
        tailPivot.rotation.z = -0.35 + Math.sin(elapsed * 1.8) * 0.18;
      }

      if (sleepState) {
        // Sleep Pose & Breathing
        bodyGroup.position.y = -0.08;
        headGroup.position.set(0, 0.90, 0.12);
        headGroup.rotation.x = 0.22;
        headGroup.rotation.z = 0.08;

        const sleepBreath = Math.sin(elapsed * 1.5) * 0.02;
        bodyMesh.scale.y = (petType === "capybara" ? 0.86 : 0.88) - sleepBreath * 0.5;

        // Animate floating 3D "Zzz" particles
        zParticles.forEach((zp) => {
          const cycle = 2.8;
          const t = (elapsed * 0.85 + zp.offset) % cycle;
          const p = t / cycle;
          zp.mesh.visible = true;
          zp.mesh.position.set(
            0.28 + Math.sin(p * 5.0) * 0.10 + zp.i * 0.06,
            0.92 + p * 0.85,
            0.45,
          );
          const zScale = Math.min(1.0, p * 3.0) * (1.0 - p * 0.45) * (0.8 + zp.i * 0.2);
          zp.mesh.scale.set(zScale, zScale, zScale);
          zp.mesh.quaternion.copy(camera.quaternion);
        });

        // Relaxed ear positions during sleep
        if (petType === "bunny") {
          leftEarPivot.rotation.x = -0.55;
          leftEarPivot.rotation.z = 0.45;
          rightEarPivot.rotation.x = -0.55;
          rightEarPivot.rotation.z = -0.45;
        } else if (petType === "capybara") {
          leftEarPivot.rotation.z = 0.20;
          rightEarPivot.rotation.z = -0.20;
          leftEarPivot.rotation.x = -0.20;
          rightEarPivot.rotation.x = -0.20;
        }

        snackGroup.visible = false;
        ballGroup.visible = false;
      } else {
        // Hide sleeping Zzz particles when awake
        zParticles.forEach((zp) => {
          zp.mesh.visible = false;
        });

        // Natural Breathing with Belly Expansion & Head Bob
        const breath = Math.sin(elapsed * 2.2) * 0.035;
        const capyBellyX = 1.10;
        const capyBellyY = 0.86;
        const capyBellyZ = 1.15;
        const baseBellyX = 0.95;
        const baseBellyY = 0.88;
        const baseBellyZ = 0.92;

        if (petType === "capybara") {
          bodyMesh.scale.x = capyBellyX + breath * 0.35;
          bodyMesh.scale.y = capyBellyY - breath * 0.22;
          bodyMesh.scale.z = capyBellyZ + breath * 0.35;
        } else {
          bodyMesh.scale.x = baseBellyX + breath * 0.35;
          bodyMesh.scale.y = baseBellyY - breath * 0.22;
          bodyMesh.scale.z = baseBellyZ + breath * 0.35;
        }
        bodyGroup.position.y = breath * 0.4;
        headGroup.position.y = 1.05 + breath * 0.55;

        // Species-specific ear & body idle behaviors with natural twitches
        if (petType === "bunny") {
          const earWobble = Math.sin(elapsed * 2.0) * 0.035;
          const noseTwitch =
            Math.sin(elapsed * 5.5) > 0.88
              ? Math.sin(elapsed * 26.0) * 0.018
              : 0;
          leftEarPivot.rotation.z = 0.15 + earWobble;
          rightEarPivot.rotation.z = -0.15 - earWobble;
          leftEarPivot.rotation.x = 0;
          rightEarPivot.rotation.x = 0;
          headMesh.position.z = noseTwitch;
        } else if (petType === "puppy") {
          const earFlap = Math.sin(elapsed * 3.0) * 0.07;
          leftEarPivot.rotation.z = 0.45 + earFlap;
          rightEarPivot.rotation.z = -0.45 - earFlap;
        } else if (petType === "kitten") {
          const earPerk = Math.sin(elapsed * 1.6) * 0.035;
          const earFlick =
            Math.sin(elapsed * 4.2) > 0.92
              ? Math.sin(elapsed * 22.0) * 0.08
              : 0;
          leftEarPivot.rotation.z = 0.35 + earPerk + earFlick;
          rightEarPivot.rotation.z = -0.35 - earPerk;
        } else if (petType === "fox") {
          const earAlert = Math.sin(elapsed * 1.4) * 0.04;
          leftEarPivot.rotation.z = 0.30 + earAlert;
          rightEarPivot.rotation.z = -0.30 - earAlert;
        } else if (petType === "capybara") {
          const capyTwitch = Math.sin(elapsed * 1.1) * 0.025;
          leftEarPivot.rotation.z = 0.32 + capyTwitch;
          rightEarPivot.rotation.z = -0.32 - capyTwitch;
        }

        actionTimer += delta;

        const isHeadPet = activeAct === "pet_head" || activeAct === "pet";
        const isBodyPet = activeAct === "pet_body";

        if (isHeadPet) {
          // HEAD PET: Leaning gently into the hand, chin tilted up, happy squinting eyes, glowing cheeks
          const leanProgress = Math.sin(Math.min(actionTimer / 1.6, 1.0) * Math.PI);
          headGroup.rotation.z = Math.sin(actionTimer * 5.0) * 0.14;
          headGroup.rotation.x = -0.12 - leanProgress * 0.08;
          headGroup.position.y = 1.05 + leanProgress * 0.06;

          // Happy closed/squinting crescent eyes
          leftEyelid.rotation.x = -0.30;
          rightEyelid.rotation.x = -0.30;
          cheekMat.opacity = 0.92;

          // Species specific ear joy for head pet
          if (petType === "bunny") {
            const earJoy = Math.sin(actionTimer * 16.0) * 0.16;
            leftEarPivot.rotation.z = 0.15 + earJoy;
            rightEarPivot.rotation.z = -0.15 - earJoy;
            leftEarPivot.rotation.x = -0.18;
            rightEarPivot.rotation.x = -0.18;
          } else if (petType === "kitten") {
            tailPivot.rotation.z = Math.sin(actionTimer * 12.0) * 0.55;
            leftEarPivot.rotation.x = -0.15;
            rightEarPivot.rotation.x = -0.15;
          } else if (petType === "puppy") {
            const earJoy = Math.sin(actionTimer * 14.0) * 0.20;
            leftEarPivot.rotation.z = 0.45 + earJoy;
            rightEarPivot.rotation.z = -0.45 - earJoy;
            tailPivot.rotation.y = Math.sin(actionTimer * 14.0) * 0.65;
          } else if (petType === "fox") {
            tailPivot.rotation.z = -0.35 + Math.sin(actionTimer * 8.0) * 0.35;
            leftEarPivot.rotation.x = -0.22;
            rightEarPivot.rotation.x = -0.22;
          } else if (petType === "capybara") {
            const capyEar = Math.sin(actionTimer * 8.0) * 0.09;
            leftEarPivot.rotation.z = 0.32 + capyEar;
            rightEarPivot.rotation.z = -0.32 - capyEar;
          }

          if (actionTimer > 1.6) {
            cheekMat.opacity = 0.55;
            leftEyelid.rotation.x = -Math.PI / 2;
            rightEyelid.rotation.x = -Math.PI / 2;
            headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, 0, 0.1);
          }
        } else if (isBodyPet) {
          // BODY / TUMMY PET: Joyful hop, tickle wiggle, paws flutter/lift, cheering tail
          const hop = Math.abs(Math.sin(actionTimer * 8.0)) * 0.12;
          characterGroup.position.y = -0.32 + hop;
          bodyGroup.rotation.z = Math.sin(actionTimer * 10.0) * 0.08;

          // Paws flutter playfully
          const pawFlutter = Math.sin(actionTimer * 12.0) * 0.05;
          leftFrontPaw.position.y = (petType === "capybara" ? 0.32 : 0.36) + pawFlutter;
          rightFrontPaw.position.y = (petType === "capybara" ? 0.32 : 0.36) - pawFlutter;

          cheekMat.opacity = 0.85;

          if (petType === "bunny") {
            tailPivot.rotation.z = Math.sin(actionTimer * 16.0) * 0.35;
          } else if (petType === "kitten") {
            tailPivot.rotation.z = Math.sin(actionTimer * 14.0) * 0.60;
          } else if (petType === "puppy") {
            tailPivot.rotation.y = Math.sin(actionTimer * 16.0) * 0.70;
          } else if (petType === "fox") {
            tailPivot.rotation.z = -0.35 + Math.sin(actionTimer * 10.0) * 0.45;
          } else if (petType === "capybara") {
            tailPivot.rotation.y = Math.sin(actionTimer * 8.0) * 0.25;
          }

          if (actionTimer > 1.6) {
            cheekMat.opacity = 0.55;
            characterGroup.position.y = -0.32;
            bodyGroup.rotation.z = 0;
            leftFrontPaw.position.y = petType === "capybara" ? 0.32 : 0.36;
            rightFrontPaw.position.y = petType === "capybara" ? 0.32 : 0.36;
          }
        } else if (activeAct === "feed") {
          // Feed Reaction: Strawberry rises in smooth arc, paws hold snack, chewing bob, strawberry shrinks
          snackGroup.visible = true;
          const eatProgress = Math.min(actionTimer / 1.6, 1.0);

          const strawberryY = 0.75 - Math.min(eatProgress * 1.2, 0.42);
          const strawberryZ = 0.65 - eatProgress * 0.20;
          snackGroup.position.set(0, strawberryY, strawberryZ);

          const chewBites = Math.sin(actionTimer * 14.0);
          headGroup.position.z = 0.08 + Math.max(0, chewBites * 0.035);
          headGroup.rotation.x = -0.05 + Math.abs(chewBites) * 0.06;

          leftFrontPaw.position.set(-0.16, 0.42, 0.52);
          rightFrontPaw.position.set(0.16, 0.42, 0.52);

          const remainingScale = Math.max(0.01, 1.0 - eatProgress * 0.95);
          snackGroup.scale.set(
            remainingScale,
            remainingScale,
            remainingScale,
          );

          if (actionTimer > 1.8) {
            snackGroup.visible = false;
            leftFrontPaw.position.set(-0.24, 0.36, 0.48);
            rightFrontPaw.position.set(0.24, 0.36, 0.48);
            headGroup.position.z = 0.08;
            headGroup.rotation.x = 0;
          }
        } else if (activeAct === "play") {
          // Play Reaction: Bouncing ball rolls across rug, pet turns head and bats with paw
          ballGroup.visible = true;
          const playProgress = actionTimer % 2.4;

          const bounceHeight = Math.abs(Math.sin(playProgress * 4.5)) * 0.42;
          const ballX = Math.sin(playProgress * 2.8) * 0.65;
          ballGroup.position.set(ballX, 0.12 + bounceHeight, 0.55);
          ballGroup.rotation.y += 0.05;
          ballGroup.rotation.z += 0.03;

          headGroup.rotation.y = ballX * 0.45;
          if (ballX > 0.1) {
            rightFrontPaw.position.set(0.28, 0.44, 0.58);
            leftFrontPaw.position.set(-0.24, 0.36, 0.48);
          } else if (ballX < -0.1) {
            leftFrontPaw.position.set(-0.28, 0.44, 0.58);
            rightFrontPaw.position.set(0.24, 0.36, 0.48);
          } else {
            leftFrontPaw.position.set(-0.24, 0.36, 0.48);
            rightFrontPaw.position.set(0.24, 0.36, 0.48);
          }

          if (actionTimer > 2.8) {
            ballGroup.visible = false;
            leftFrontPaw.position.set(-0.24, 0.36, 0.48);
            rightFrontPaw.position.set(0.24, 0.36, 0.48);
            headGroup.rotation.y = 0;
          }
        } else {
          snackGroup.visible = false;
          ballGroup.visible = false;
          characterGroup.position.y = -0.32;
        }

        // Floating Hearts & Golden Sparkles Update
        heartParticles.forEach((hp) => {
          if (hp.active) {
            hp.age += delta;
            hp.mesh.position.x += hp.vx + Math.sin(hp.age * 5.0) * 0.003;
            hp.mesh.position.y += hp.vy;
            hp.mesh.position.z += hp.vz;
            hp.mesh.rotation.y += hp.rotSpeed;
            hp.mesh.rotation.z += hp.rotSpeed * 0.5;
            const progress = hp.age / hp.maxAge;
            const pScale = Math.max(
              0.001,
              (1.0 - progress) * (progress < 0.2 ? progress * 5.0 : 1.0),
            );
            hp.mesh.scale.set(pScale, pScale, pScale);
            if (hp.age > hp.maxAge) {
              hp.active = false;
              hp.mesh.visible = false;
            }
          }
        });
      }

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      domElement.removeEventListener("mousemove", handlePointerMove);
      domElement.removeEventListener("mouseleave", handlePointerLeave);
      domElement.removeEventListener("touchmove", handlePointerMove);
      domElement.removeEventListener("touchend", handlePointerLeave);
      domElement.removeEventListener("click", handleCanvasClick);

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      shadowTex.dispose();
      zTex.dispose();

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, [prefersReducedMotion, webGLAvailable, petType]);

  // Distinct Handcrafted 2.5D SVG Fallbacks for all 5 animals
  if (prefersReducedMotion || !webGLAvailable) {
    function handleSvgClick(e) {
      if (!onPetClickRef.current) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const isHead = clickY < rect.height * 0.58;
      onPetClickRef.current(isHead ? "head" : "body");
    }

    return (
      <div
        className="relative flex items-center justify-center h-72 w-72 sm:h-80 sm:w-80 select-none mx-auto cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={handleSvgClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (onPetClickRef.current) onPetClickRef.current("head");
          }
        }}
        aria-label={`${petState.name || "Companion"} the plush ${petType} (${
          isSleeping ? "napping peacefully" : "awake and happy"
        }). Click to pet!`}
      >
        <svg
          viewBox="0 0 240 240"
          className="w-full h-full drop-shadow-md transition-transform duration-300"
          aria-hidden="true"
        >
          {/* Rug */}
          <ellipse cx="120" cy="205" rx="90" ry="22" fill="#F8EDF3" />
          <ellipse
            cx="120"
            cy="205"
            rx="80"
            ry="18"
            fill="none"
            stroke="#E9B7C8"
            strokeWidth="3"
            strokeDasharray="4 4"
          />

          {/* Animal Specific Body & Ears */}
          {petType === "bunny" && (
            <g>
              <ellipse cx="120" cy="155" rx="55" ry="46" fill="#F4E8F4" />
              <ellipse cx="120" cy="158" rx="36" ry="32" fill="#FFF7FB" />
              <path
                d="M 92 105 C 80 50, 95 30, 104 32 C 112 34, 114 60, 108 105 Z"
                fill="#F4E8F4"
              />
              <path
                d="M 95 98 C 87 60, 98 42, 103 44 C 107 46, 109 68, 105 98 Z"
                fill="#F5C4D8"
              />
              <path
                d="M 148 105 C 160 50, 145 30, 136 32 C 128 34, 126 60, 132 105 Z"
                fill="#F4E8F4"
              />
              <path
                d="M 145 98 C 153 60, 142 42, 137 44 C 133 46, 131 68, 135 98 Z"
                fill="#F5C4D8"
              />
            </g>
          )}

          {petType === "kitten" && (
            <g>
              <ellipse cx="120" cy="155" rx="55" ry="46" fill="#FDEEE2" />
              <ellipse cx="120" cy="158" rx="36" ry="32" fill="#FFF9F5" />
              {/* Cat Ears */}
              <polygon points="86,108 72,55 110,88" fill="#FDEEE2" />
              <polygon points="86,104 76,64 104,89" fill="#F7BDCE" />
              <polygon points="154,108 168,55 130,88" fill="#FDEEE2" />
              <polygon points="154,104 164,64 136,89" fill="#F7BDCE" />
              {/* Cat Tail */}
              <path
                d="M 160 170 Q 200 160 195 120"
                stroke="#FDEEE2"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}

          {petType === "puppy" && (
            <g>
              <ellipse cx="120" cy="155" rx="55" ry="46" fill="#EDCBB1" />
              <ellipse cx="120" cy="158" rx="36" ry="32" fill="#FFF8F0" />
              {/* Floppy Puppy Ears */}
              <ellipse
                cx="74"
                cy="115"
                rx="14"
                ry="28"
                fill="#B88863"
                transform="rotate(15 74 115)"
              />
              <ellipse
                cx="166"
                cy="115"
                rx="14"
                ry="28"
                fill="#B88863"
                transform="rotate(-15 166 115)"
              />
            </g>
          )}

          {petType === "fox" && (
            <g>
              <ellipse cx="120" cy="155" rx="55" ry="46" fill="#E57350" />
              <ellipse cx="120" cy="158" rx="36" ry="32" fill="#FFFFFF" />
              {/* Pointed Fox Ears */}
              <polygon points="85,110 68,48 108,85" fill="#E57350" />
              <polygon points="85,106 72,56 102,86" fill="#FFFFFF" />
              <polygon points="76,66 68,48 84,62" fill="#38241D" />
              <polygon points="155,110 172,48 132,85" fill="#E57350" />
              <polygon points="155,106 168,56 138,86" fill="#FFFFFF" />
              <polygon points="164,66 172,48 156,62" fill="#38241D" />
              {/* Big Bushy Tail */}
              <ellipse cx="180" cy="165" rx="28" ry="18" fill="#E57350" />
              <circle cx="200" cy="162" r="12" fill="#FFFFFF" />
            </g>
          )}

          {petType === "capybara" ? (
            /* Distinct Handcrafted Capybara Anatomical Illustration */
            <g>
              {/* Broad barrel body */}
              <ellipse cx="120" cy="156" rx="60" ry="44" fill="#8D5B4C" />
              <ellipse cx="120" cy="160" rx="40" ry="30" fill="#C29B75" />
              {/* Small shell ears set high and lateral */}
              <circle cx="78" cy="78" r="9" fill="#8D5B4C" />
              <circle cx="78" cy="78" r="5" fill="#764B3C" />
              <circle cx="162" cy="78" r="9" fill="#8D5B4C" />
              <circle cx="162" cy="78" r="5" fill="#764B3C" />
              {/* Yuzu Citrus on Head */}
              <circle cx="120" cy="62" r="11" fill="#FF9E1B" />
              <ellipse cx="125" cy="55" rx="5" ry="2.5" fill="#489D6E" transform="rotate(25 125 55)" />
              {/* Rounded slightly elongated head */}
              <rect x="74" y="74" width="92" height="74" rx="26" fill="#8D5B4C" />
              {/* Integrated broad lighter muzzle */}
              <rect x="84" y="102" width="72" height="42" rx="18" fill="#C29B75" />
              {/* Oval nostrils */}
              <ellipse cx="111" cy="116" rx="3.5" ry="4.5" fill="#38241D" />
              <ellipse cx="129" cy="116" rx="3.5" ry="4.5" fill="#38241D" />
              {/* Gentle subtle mouth */}
              <path d="M 115 127 Q 120 131 125 127" stroke="#5A3C2E" strokeWidth="2" strokeLinecap="round" fill="none" />
              {/* Soft blush */}
              <circle cx="86" cy="116" r="8" fill="#F2A8BE" opacity="0.6" />
              <circle cx="154" cy="116" r="8" fill="#F2A8BE" opacity="0.6" />
              {/* Lateral zen eyes */}
              {isSleeping ? (
                <g stroke="#38241D" strokeWidth="2.5" strokeLinecap="round" fill="none">
                  <path d="M 86 96 Q 92 100 98 96" />
                  <path d="M 142 96 Q 148 100 154 96" />
                </g>
              ) : (
                <g>
                  <circle cx="92" cy="94" r="6" fill="#1F1624" />
                  <circle cx="90" cy="92" r="2" fill="#FFFFFF" />
                  <circle cx="148" cy="94" r="6" fill="#1F1624" />
                  <circle cx="146" cy="92" r="2" fill="#FFFFFF" />
                </g>
              )}
              {/* Paws */}
              <ellipse cx="98" cy="166" rx="12" ry="12" fill="#784B3D" />
              <ellipse cx="142" cy="166" rx="12" ry="12" fill="#784B3D" />
            </g>
          ) : (
            /* Common Cute Plush Head for Bunny, Kitten, Puppy, Fox */
            <g>
              <ellipse cx="120" cy="112" rx="46" ry="40" fill="#F6EDF7" opacity="0.15" />
              <ellipse
                cx="120"
                cy="112"
                rx="45"
                ry="39"
                fill={
                  petType === "kitten"
                    ? "#FDEEE2"
                    : petType === "puppy"
                    ? "#EDCBB1"
                    : petType === "fox"
                    ? "#E57350"
                    : "#F6EDF7"
                }
              />

              {/* Cheeks & Blush */}
              <circle cx="95" cy="120" r="13" fill="#F2A8BE" opacity="0.6" />
              <circle cx="145" cy="120" r="13" fill="#F2A8BE" opacity="0.6" />

              {/* Nose */}
              <polygon
                points="116,112 124,112 120,117"
                fill={petType === "puppy" || petType === "fox" ? "#241A22" : "#DE84A0"}
              />

              {/* Smiling Mouth */}
              <path
                d="M 116 119 Q 120 124 124 119"
                fill="none"
                stroke="#79516F"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Eyes: Awake or Sleeping */}
              {isSleeping ? (
                <g stroke="#79516F" strokeWidth="2.5" strokeLinecap="round" fill="none">
                  <path d="M 94 108 Q 102 114 108 108" />
                  <path d="M 132 108 Q 138 114 146 108" />
                </g>
              ) : (
                <g>
                  <circle cx="100" cy="106" r="8" fill="#1F1624" />
                  <circle cx="98" cy="103" r="2.8" fill="#FFFFFF" />
                  <circle cx="103" cy="108" r="1.2" fill="#E8D5EA" />

                  <circle cx="140" cy="106" r="8" fill="#1F1624" />
                  <circle cx="138" cy="103" r="2.8" fill="#FFFFFF" />
                  <circle cx="143" cy="108" r="1.2" fill="#E8D5EA" />
                </g>
              )}

              {/* Paws */}
              <ellipse cx="102" cy="165" rx="12" ry="14" fill="#EFE3EB" />
              <ellipse cx="138" cy="165" rx="12" ry="14" fill="#EFE3EB" />
            </g>
          )}
        </svg>

        <span className="sr-only">
          {!webGLAvailable ? "2.5D SVG Graphic" : "Reduced Motion Display"}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (onPetClickRef.current) onPetClickRef.current();
        }
      }}
      className="relative w-full max-w-[360px] sm:max-w-[440px] h-80 sm:h-96 md:h-[400px] mx-auto cursor-pointer select-none touch-none focus:outline-hidden focus:ring-2 focus:ring-[#79516F] rounded-3xl"
      role="img"
      aria-label={`${petState.name || "Companion"} the 3D plush ${petType} (${
        isSleeping ? "napping peacefully" : "awake and interactive"
      }). Press Enter, Space, or tap to pet.`}
      title="Tap, click, or press Enter to pet your companion!"
    />
  );
}
