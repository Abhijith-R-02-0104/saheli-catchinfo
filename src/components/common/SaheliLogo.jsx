import { useTranslation } from "../../hooks/useTranslation.js";

/**
 * Saheli Hidden-Heart Woman Silhouette Vector Emblem
 *
 * Geometric concept:
 * An elegant, continuous-contour woman in profile. Her gentle silhouette, flowing
 * hair, and curved collarbone converge seamlessly to reveal a hidden heart motif
 * at the center, symbolizing self-compassion, privacy, and holistic feminine care.
 */
export function SaheliHiddenHeartSymbol({
  className = "h-8 w-8",
  monochrome = false,
  inverted = false,
  ...props
}) {
  const primaryPlum = monochrome
    ? "currentColor"
    : inverted
      ? "#FBF7F3"
      : "#79516F";
  const accentBlush = monochrome
    ? "currentColor"
    : inverted
      ? "#E9B7C8"
      : "#E9B7C8";
  const warmRose = monochrome
    ? "currentColor"
    : inverted
      ? "#DECED9"
      : "#F2E8F0";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id="saheli-heart-grad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={primaryPlum} />
          <stop offset="100%" stopColor="#A06B95" />
        </linearGradient>
      </defs>

      {/* Gentle Soft Background Glow in Full Color Mode */}
      {!monochrome && (
        <circle
          cx="50"
          cy="50"
          r="44"
          fill={inverted ? "rgba(233, 183, 200, 0.12)" : "rgba(247, 227, 236, 0.45)"}
          className="transition-colors"
        />
      )}

      {/* 
        Silhouette of Woman in Profile forming the left lobe and outer contour of the hidden heart:
        - Starts at the top crown of hair (50, 16)
        - Sweeps back and down through hair wave (32, 28) -> (24, 46) -> (30, 68)
        - Bottom cusp of the heart (50, 84)
      */}
      <path
        d="M50 18C36 18 25 28 25 42C25 58 40 72 50 82C60 72 75 58 75 42C75 28 64 18 50 18Z"
        fill={monochrome ? "none" : warmRose}
        opacity={monochrome ? "0" : "0.5"}
      />

      {/* Outer Heart & Feminine Silhouette Contour */}
      <path
        d="M50 20C41 12 28 15 23 25C17 37 22 53 34 66C41 73 47 79 50 82C53 79 59 73 66 66C78 53 83 37 77 25C72 15 59 12 50 20Z"
        stroke={monochrome ? "currentColor" : "url(#saheli-heart-grad)"}
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 
        Inner Serene Woman Profile & Flowing Hair Curve:
        Graceful brow, nose, lips, and neck contour that nests within the heart lobe.
      */}
      <path
        d="M48 27C44 32 44 37 46 41C47.5 44 49 45 47 48C45.5 50 43 51 44 54C45.5 58 50 60 52 64"
        stroke={monochrome ? "currentColor" : accentBlush}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Cascading Hair Wave revealing the inner heart curve */}
      <path
        d="M52 27C58 31 62 38 61 46C60 54 55 60 50 67"
        stroke={monochrome ? "currentColor" : primaryPlum}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />

      {/* Heart Center Pearl / Dot of Mindfulness */}
      <circle
        cx="50"
        cy="40"
        r="2.5"
        fill={monochrome ? "currentColor" : accentBlush}
      />
    </svg>
  );
}

/**
 * Saheli Primary & Horizontal Logo System:
 * Provides standard, accessible branding variants across Desktop, Tablet, Mobile,
 * Dark Mode, and Discreet Mode.
 *
 * Variants:
 * - "horizontal": Symbol + "saheli" wordmark inline (Ideal for headers & navigation)
 * - "primary": Stacked symbol + prominent wordmark + optional tagline
 * - "icon": Compact symbol only (ideal for tight mobile headers & icons)
 * - "appIcon": Squircle container with symbol (ideal for app launcher / favicon)
 */
export function SaheliLogo({
  variant = "horizontal",
  monochrome = false,
  inverted = false,
  showTagline = false,
  className = "",
  size = "md",
  ...props
}) {
  const { t } = useTranslation();

  const brandTagline = showTagline
    ? t("common", "appTagline")
    : null;

  // Sizing definitions
  const symbolSizes = {
    xs: "h-5 w-5",
    sm: "h-6 w-6",
    md: "h-8 w-8 sm:h-9 sm:w-9",
    lg: "h-11 w-11 sm:h-12 sm:w-12",
    xl: "h-16 w-16",
  };

  const textSizes = {
    xs: "text-base",
    sm: "text-lg",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
    xl: "text-4xl",
  };

  const currentSymbolSize = symbolSizes[size] || symbolSizes.md;
  const currentTextSize = textSizes[size] || textSizes.md;

  if (variant === "icon") {
    return (
      <div className={`inline-flex items-center justify-center shrink-0 ${className}`} {...props}>
        <SaheliHiddenHeartSymbol
          className={currentSymbolSize}
          monochrome={monochrome}
          inverted={inverted}
        />
        <span className="sr-only">Saheli</span>
      </div>
    );
  }

  if (variant === "appIcon") {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl bg-[#FAF5F0] dark:bg-[#2D1F35] border border-[#DECED9] dark:border-[#543F61] p-2 shadow-xs transition-transform hover:scale-105 shrink-0 ${className}`}
        {...props}
      >
        <SaheliHiddenHeartSymbol
          className={currentSymbolSize}
          monochrome={monochrome}
          inverted={inverted}
        />
        <span className="sr-only">Saheli</span>
      </div>
    );
  }

  if (variant === "primary") {
    return (
      <div className={`flex flex-col items-center text-center gap-2 ${className}`} {...props}>
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#F7E3EC] dark:bg-[#3D2636] border border-[#E9B7C8]/70 text-[#79516F] dark:text-[#E8A8BF] shadow-sm">
          <SaheliHiddenHeartSymbol
            className="h-9 w-9"
            monochrome={monochrome}
            inverted={inverted}
          />
        </div>
        <div className="flex flex-col items-center">
          <span className={`font-serif ${currentTextSize} font-bold tracking-tight text-[var(--ink)] leading-tight`}>
            saheli
          </span>
          {showTagline && (
            <span className="text-xs text-[var(--muted)] font-medium tracking-wide pt-0.5">
              {brandTagline}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default: "horizontal"
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 text-left ${className}`} {...props}>
      <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-[#F7E3EC] dark:bg-[#3D2636] border border-[#E9B7C8]/70 text-[#79516F] dark:text-[#E8A8BF] shadow-2xs group-hover:scale-105 transition-transform shrink-0">
        <SaheliHiddenHeartSymbol
          className="h-5 w-5 sm:h-5.5 sm:w-5.5"
          monochrome={monochrome}
          inverted={inverted}
        />
      </div>
      <div className="flex flex-col">
        <span className={`font-serif ${currentTextSize} font-bold tracking-tight text-[var(--ink)] leading-none select-none`}>
          saheli
        </span>
        {showTagline && (
          <span className="text-[10px] text-[var(--muted)] font-medium tracking-wide hidden lg:block pt-0.5">
            {brandTagline}
          </span>
        )}
      </div>
    </div>
  );
}
