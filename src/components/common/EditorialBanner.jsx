/**
 * Saheli Premium Editorial Banner Component
 * Curated editorial banners featuring serif headlines, supportive wellness narrative,
 * subtle botanical SVG watermarks, responsive layouts, and accessible CTAs.
 */

export function EditorialBanner({
  tag,
  title,
  description,
  badge,
  primaryAction,
  secondaryAction,
  variant = "wellness",
}) {
  // Variant accent styles
  const isWellness = variant === "wellness";
  const isLearn = variant === "learn";
  const isDoctor = variant === "doctor";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#EFE6EC] dark:border-[#3D2E47] bg-gradient-to-br from-[#FFF5F8] via-[#FAF5F0] to-white dark:from-[#2A1B28] dark:via-[#221827] dark:to-[#1B1522] p-6 sm:p-8 lg:p-10 shadow-xs transition-colors">
      {/* Decorative Subtle Botanical / Geometric Watermark (Aria Hidden) */}
      <div
        className="pointer-events-none absolute -right-6 -bottom-8 opacity-25 dark:opacity-15 select-none"
        aria-hidden="true"
      >
        {isWellness && (
          <svg
            width="220"
            height="220"
            viewBox="0 0 200 200"
            fill="none"
            className="text-[#E9B7C8] dark:text-[#D9A4C7]"
          >
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
            <path
              d="M100 20C110 50 150 90 180 100C150 110 110 150 100 180C90 150 50 110 20 100C50 90 90 50 100 20Z"
              fill="currentColor"
              fillOpacity="0.15"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="100" cy="100" r="16" fill="currentColor" fillOpacity="0.3" />
          </svg>
        )}

        {isLearn && (
          <svg
            width="220"
            height="220"
            viewBox="0 0 200 200"
            fill="none"
            className="text-[#A2C8A5] dark:text-[#C4E2C7]"
          >
            <rect x="30" y="30" width="140" height="140" rx="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5" />
            <path
              d="M50 140V60A10 10 0 0 1 60 50H140A10 10 0 0 1 150 60V140M60 140H140"
              stroke="currentColor"
              strokeWidth="2"
              fill="currentColor"
              fillOpacity="0.1"
            />
          </svg>
        )}

        {isDoctor && (
          <svg
            width="220"
            height="220"
            viewBox="0 0 200 200"
            fill="none"
            className="text-[#79516F] dark:text-[#D9A4C7]"
          >
            <path
              d="M100 180S160 140 160 80V40L100 20L40 40V80C40 140 100 180 100 180Z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="currentColor"
              fillOpacity="0.08"
            />
            <path d="M100 65V115M75 90H125" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        )}
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          {/* Top Tag & Optional Badge */}
          <div className="flex flex-wrap items-center gap-2.5">
            {tag && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E9B7C8]/40 dark:bg-[#442E3D] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#79516F] dark:text-[#E8A8BF] border border-[#E9B7C8]/50 dark:border-[#543F61]">
                {tag}
              </span>
            )}
            {badge && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF5F0] dark:bg-[#281F30] px-3 py-1 text-xs font-semibold text-[#6B6577] dark:text-[#BBA9BE] border border-[#DECED9] dark:border-[#42324C]">
                {badge}
              </span>
            )}
          </div>

          {/* Headline */}
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#292536] dark:text-[#F7EDF5] leading-tight">
            {title}
          </h1>

          {/* Narrative Supporting Text */}
          {description && (
            <p className="text-sm sm:text-base text-[#6B6577] dark:text-[#BBA9BE] leading-relaxed max-w-xl">
              {description}
            </p>
          )}
        </div>

        {/* Action Controls */}
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {secondaryAction && (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className="touch-target inline-flex items-center gap-2 rounded-2xl border border-[#DECED9] dark:border-[#543F61] bg-white dark:bg-[#281F30] px-5 py-3 text-xs sm:text-sm font-semibold text-[#292536] dark:text-[#F7EDF5] shadow-xs hover:bg-[#FAF5F0] dark:hover:bg-[#34263E] transition-all focus-visible:outline-2 focus-visible:outline-[#79516F]"
              >
                {secondaryAction.icon && <span aria-hidden="true">{secondaryAction.icon}</span>}
                <span>{secondaryAction.label}</span>
              </button>
            )}

            {primaryAction && (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className="touch-target inline-flex items-center gap-2.5 rounded-2xl bg-[#79516F] hover:bg-[#633E5A] dark:bg-[#8D5C82] dark:hover:bg-[#A06B95] px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:scale-102 active:scale-98 focus-visible:outline-2 focus-visible:outline-[#79516F]"
              >
                <span>{primaryAction.label}</span>
                {primaryAction.icon ? (
                  <span aria-hidden="true">{primaryAction.icon}</span>
                ) : (
                  <span aria-hidden="true">→</span>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
