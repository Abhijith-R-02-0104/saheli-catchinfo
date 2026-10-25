import { useState, useEffect, useRef } from "react";

/**
 * Subtle Saheli Hidden-Heart Cursor Accent:
 * An elegant, miniature plum-and-blush hidden-heart motif that accompanies
 * the standard system pointer on fine-pointer desktop devices.
 *
 * Requirements & Constraints:
 * 1. Zero lag / zero gap: Synchronously locked to pointer client coordinates (no trailing lag).
 * 2. Unobtrusive: pointer-events: none ensures zero interference with clicks, selections, or hovers.
 * 3. Text Protection: Automatically hides when hovering over text inputs, textareas, and editable fields.
 * 4. Hardware/Accessibility Aware: Disabled on touchscreens (pointer: coarse) and reduced-motion modes.
 * 5. Standard Arrow & Hand Pointer: All native system cursors and cursor: pointer rules remain primary.
 */
export function SparkleCursor() {
  const [enabled] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return Boolean(hasFinePointer && !prefersReducedMotion);
  });

  const [visible, setVisible] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isOverInput, setIsOverInput] = useState(false);

  const domNode = useRef(null);
  const idleTimer = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    function onPointerMove(e) {
      // 1. Exact 1:1 Viewport Alignment (Zero offset - hotspot precisely aligned)
      const x = e.clientX;
      const y = e.clientY;

      if (domNode.current) {
        domNode.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      // 2. Hide immediately when over text inputs to prevent obscuring text or selection
      const target = e.target;
      const overInput = Boolean(
        target &&
          target.closest &&
          target.closest("input, textarea, select, [contenteditable='true'], [role='textbox']")
      );
      setIsOverInput(overInput);

      // 3. Detect interactive controls for delicate glow accent
      const clickable = Boolean(
        target &&
          target.closest &&
          target.closest("button, a, [role='button'], [role='tab'], label:has(input), summary")
      );
      setIsInteractive(clickable);

      setVisible(true);

      // 4. Gentle idle fadeout when pointer is stationary
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        setVisible(false);
      }, 2000);
    }

    function onPointerLeave() {
      setVisible(false);
    }

    function onWindowBlur() {
      setVisible(false);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);
    window.addEventListener("blur", onWindowBlur);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("blur", onWindowBlur);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  const showAccent = visible && !isOverInput;

  return (
    <div
      ref={domNode}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[99999] select-none will-change-transform transition-opacity duration-150 ease-out"
      style={{
        opacity: showAccent ? (isInteractive ? 0.95 : 0.6) : 0,
        transform: "translate3d(-100px, -100px, 0)",
      }}
    >
      {/* 
        Miniature Saheli Hidden-Heart Motif:
        Centered with -translate-x-1/2 -translate-y-1/2 so the motif's hotspot
        is locked to clientX, clientY with zero displacement.
      */}
      <div
        className={`-translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ease-out ${
          isInteractive ? "scale-125" : "scale-100"
        }`}
        style={{
          transformOrigin: "center center",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            filter: "drop-shadow(0 1px 2px rgba(121, 81, 111, 0.25))",
          }}
        >
          {/* Subtle Outer Plum Heart Contour */}
          <path
            d="M8 3.2C6.6 1.8 4.4 2.1 3.5 3.6C2.4 5.3 3.3 7.8 5.2 9.8C6.3 11 7.4 12 8 12.5C8.6 12 9.7 11 10.8 9.8C12.7 7.8 13.6 5.3 12.5 3.6C11.6 2.1 9.4 1.8 8 3.2Z"
            stroke="#79516F"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="dark:stroke-[#E8A8BF]"
            fill="rgba(247, 227, 236, 0.35)"
          />

          {/* Inner Silhouette Wave Curve */}
          <path
            d="M7.6 4.8C7.1 5.5 7.1 6.2 7.4 6.8C7.7 7.4 8.2 7.8 8 8.6"
            stroke="#E9B7C8"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="dark:stroke-[#F6DCE4]"
          />

          {/* Subtle Focal Center Dot */}
          <circle cx="8" cy="8" r="1.1" fill="#79516F" className="dark:fill-[#E8A8BF]" />
        </svg>
      </div>
    </div>
  );
}
