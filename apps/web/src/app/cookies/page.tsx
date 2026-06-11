"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUp } from "@/lib/premiumIcons";
import { ThemeToggleSimple } from "@/components/ThemeToggleSimple";
import { LocaleToggle } from "@/components/LocaleToggle";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useTranslation } from "@/hooks/useTranslation";

export default function CookiesPage() {
  const { t, locale } = useTranslation();
  const updatedAt = new Date().toLocaleDateString(
    locale === "es" ? "es-ES" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="min-h-screen bg-surface relative overflow-hidden">
      <BackgroundBeams />

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("cookies.backToHome")}
            </Link>
            <div className="flex items-center gap-3">
              <ThemeToggleSimple />
              <LocaleToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 pt-20 pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/90 dark:bg-slate-900/70 backdrop-blur-2xl rounded-3xl border border-card-border/80 shadow-xl shadow-company-primary/[0.02] p-8 md:p-12">
            {/* Header */}
            <div className="mb-10 border-b border-slate-200 dark:border-slate-700 pb-8">
              <h1 className="text-[2rem] md:text-[2.25rem] leading-tight font-bold tracking-tight text-text-primary mb-2">{t("cookies.title")}</h1>
              <p className="premium-subtitle text-sm">{t("cookies.updatedAt")}: {updatedAt}</p>
            </div>

            {/* Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
              <section>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                  {t("cookies.intro")}
                </p>
              </section>

              <section>
                <h2 className="text-lg premium-section-title mb-3">{t("cookies.section1Title")}</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                  {t("cookies.section1Content")}
                </p>
              </section>

              <section>
                <h2 className="text-lg premium-section-title mb-3">{t("cookies.section2Title")}</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm mb-3">
                  {t("cookies.section2Intro")}
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 text-sm">
                  <li>{t("cookies.section2Essential")}</li>
                  <li>{t("cookies.section2Functional")}</li>
                  <li>{t("cookies.section2Analytics")}</li>
                  <li>{t("cookies.section2Advertising")}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg premium-section-title mb-3">{t("cookies.section3Title")}</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                  {t("cookies.section3Content")}
                </p>
              </section>

              <section>
                <h2 className="text-lg premium-section-title mb-3">{t("cookies.section4Title")}</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                  {t("cookies.section4Content")}
                </p>
              </section>

              <section>
                <h2 className="text-lg premium-section-title mb-3">{t("cookies.section5Title")}</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                  {t("cookies.section5Content")}
                </p>
              </section>

              <section>
                <h2 className="text-lg premium-section-title mb-3">{t("cookies.section6Title")}</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                  {t("cookies.section6Content")}
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center gap-2 text-company-primary hover:text-company-primary/80 text-sm font-medium transition-colors">
                <ArrowUp className="w-4 h-4" />
                {t("cookies.backToTop")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
