"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUp } from "@/lib/premiumIcons";
import { ThemeToggleSimple } from "@/components/ThemeToggleSimple";
import { LocaleToggle } from "@/components/LocaleToggle";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useTranslation } from "@/hooks/useTranslation";

export default function TermsPage() {
  const { t, locale } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-surface relative overflow-hidden">
      <BackgroundBeams />

      {/* Top bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "var(--surface)" : "transparent",
          borderBottom: scrolled ? "1px solid var(--card-border)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <nav aria-label="Breadcrumb" className="hidden sm:block">
              <ol role="list" className="flex items-center gap-2 text-sm text-text-secondary">
                <li><Link href="/" className="transition hover:text-text-primary">Home</Link></li>
                <li className="text-text-disabled">/</li>
                <li className="font-medium text-text-primary" aria-current="page">{t("terms.title")}</li>
              </ol>
            </nav>
            <Link
              href="/"
              className="sm:hidden inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("terms.title")}
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
          {/* Glass Card Container */}
          <div className="bg-white/90 dark:bg-slate-900/70 backdrop-blur-2xl rounded-3xl border border-card-border/80 shadow-xl shadow-company-primary/[0.02] p-8 md:p-12">
            {/* Header */}
            <div className="mb-10 border-b border-slate-200 dark:border-slate-700 pb-8">
              <h1 className="text-[2rem] md:text-[2.25rem] leading-tight font-bold tracking-tight text-text-primary mb-2">{t("terms.title")}</h1>
              <p className="premium-subtitle text-sm">{t("terms.updatedAt")}: {new Date().toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            {/* Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-lg premium-section-title mb-3">{t("terms.section1Title")}</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                  {t("terms.section1Content")}
                </p>
              </section>

              <section>
                <h2 className="text-lg premium-section-title mb-3">{t("terms.section2Title")}</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm mb-3">
                  {t("terms.section2Intro")}
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 text-sm">
                  <li>{t("terms.section2Item1")}</li>
                  <li>{t("terms.section2Item2")}</li>
                  <li>{t("terms.section2Item3")}</li>
                  <li>{t("terms.section2Item4")}</li>
                  <li>{t("terms.section2Item5")}</li>
                  <li>{t("terms.section2Item6")}</li>
                  <li>{t("terms.section2Item7")}</li>
                  <li>{t("terms.section2Item8")}</li>
                  <li>{t("terms.section2Item9")}</li>
                  <li>{t("terms.section2Item10")}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg premium-section-title mb-3">{t("terms.section3Title")}</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                  {t("terms.section3Content")}
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 text-sm mt-3">
                  <li>{t("terms.section3Item1")}</li>
                  <li>{t("terms.section3Item2")}</li>
                  <li>{t("terms.section3Item3")}</li>
                  <li>{t("terms.section3Item4")}</li>
                  <li>{t("terms.section3Item5")}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg premium-section-title mb-3">{t("terms.section4Title")}</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm mb-3">
                  {t("terms.section4Content")}
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 text-sm">
                  <li>{t("terms.section4Item1")}</li>
                  <li>{t("terms.section4Item2")}</li>
                  <li>{t("terms.section4Item3")}</li>
                  <li>{t("terms.section4Item4")}</li>
                  <li>{t("terms.section4Item5")}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg premium-section-title mb-3">{t("terms.section5Title")}</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm mb-3">
                  {t("terms.section5Content")}
                </p>
              </section>

              <section>
                <h2 className="text-lg premium-section-title mb-3">{t("terms.section6Title")}</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                  {t("terms.section6Content")}
                </p>
              </section>

              <section>
                <h2 className="text-lg premium-section-title mb-3">{t("terms.section7Title")}</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                  {t("terms.section7Content")}
                </p>
              </section>

              <section>
                <h2 className="text-lg premium-section-title mb-3">{t("terms.section8Title")}</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                  {t("terms.section8Content")}
                </p>
              </section>

              <section>
                <h2 className="text-lg premium-section-title mb-3">{t("terms.section9Title")}</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                  {t("terms.section9Content")}
                </p>
              </section>

              <section>
                <h2 className="text-lg premium-section-title mb-3">{t("terms.section10Title")}</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                  {t("terms.section10Content")}
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center gap-2 text-company-primary hover:text-company-primary/80 text-sm font-medium transition-colors">
                <ArrowUp className="w-4 h-4" />
                {t("terms.backToTop")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
