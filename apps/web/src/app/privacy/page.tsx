"use client";
import Link from "next/link";
import { ArrowLeft, ArrowUp } from "@/lib/premiumIcons";
import { ThemeToggleSimple } from "@/components/ThemeToggleSimple";
import { LocaleToggle } from "@/components/LocaleToggle";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useTranslation } from "@/hooks/useTranslation";

export default function PrivacyPage() {
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
              {t("privacy.backToHome")}
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
              <h1 className="text-[2rem] md:text-[2.25rem] leading-tight font-bold tracking-tight text-text-primary mb-2">
                {t("privacy.title")}
              </h1>
              {updatedAt && (
                <p className="premium-subtitle text-sm">
                  {t("privacy.updatedAt")}: {updatedAt}
                </p>
              )}
            </div>

            {/* Introduction */}
            <div className="mb-8 p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                {t("privacy.intro")}
              </p>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <section>
                <h2 className="text-lg premium-section-title mb-3">
                  {t("privacy.section1Title")}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm mb-3">
                  {t("privacy.section1Intro")}
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "privacy.companyDataTitle",
                      items: ["privacy.companyDataItem1", "privacy.companyDataItem2", "privacy.companyDataItem3", "privacy.companyDataItem4"],
                    },
                    {
                      title: "privacy.vehicleDataTitle",
                      items: ["privacy.vehicleDataItem1", "privacy.vehicleDataItem2", "privacy.vehicleDataItem3", "privacy.vehicleDataItem4"],
                    },
                    {
                      title: "privacy.userDataTitle",
                      items: ["privacy.userDataItem1", "privacy.userDataItem2", "privacy.userDataItem3", "privacy.userDataItem4"],
                    },
                    {
                      title: "privacy.operationalDataTitle",
                      items: ["privacy.operationalDataItem1", "privacy.operationalDataItem2", "privacy.operationalDataItem3", "privacy.operationalDataItem4"],
                    },
                  ].map(({ title, items }) => (
                    <div
                      key={title}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                    >
                      <h3 className="font-medium text-slate-800 dark:text-white mb-2 text-sm">
                        {t(title)}
                      </h3>
                      <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-xs">
                        {items.map((item) => (
                          <li key={item}>• {t(item)}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-lg premium-section-title mb-3">
                  {t("privacy.section2Title")}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm mb-3">
                  {t("privacy.section2Intro")}
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 text-sm">
                  {["section2Item1","section2Item2","section2Item3","section2Item4","section2Item5","section2Item6","section2Item7","section2Item8"].map((k) => (
                    <li key={k}>{t(`privacy.${k}`)}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-lg premium-section-title mb-3">
                  {t("privacy.section3Title")}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm mb-3">
                  {t("privacy.section3Intro")}
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 text-sm">
                  {["section3Item1","section3Item2","section3Item3","section3Item4","section3Item5","section3Item6","section3Item7"].map((k) => (
                    <li key={k}>{t(`privacy.${k}`)}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-lg premium-section-title mb-3">
                  {t("privacy.section4Title")}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm mb-3">
                  {t("privacy.section4Intro")}
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { title: "privacy.rightAccess", desc: "privacy.rightAccessDesc" },
                    { title: "privacy.rightRectify", desc: "privacy.rightRectifyDesc" },
                    { title: "privacy.rightExport", desc: "privacy.rightExportDesc" },
                    { title: "privacy.rightDelete", desc: "privacy.rightDeleteDesc" },
                  ].map(({ title, desc }) => (
                    <div
                      key={title}
                      className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                    >
                      <div className="w-2 h-2 rounded-full bg-company-primary mt-2 shrink-0" />
                      <div>
                        <h4 className="font-medium text-slate-800 dark:text-white text-sm">
                          {t(title)}
                        </h4>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">{t(desc)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-lg premium-section-title mb-3">
                  {t("privacy.section5Title")}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                  {t("privacy.section5Content")}
                </p>
              </section>

              <section>
                <h2 className="text-lg premium-section-title mb-3">
                  {t("privacy.section6Title")}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm mb-3">
                  {t("privacy.section6Intro")}
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 text-sm">
                  {["section6Item1","section6Item2","section6Item3","section6Item4","section6Item5"].map((k) => (
                    <li key={k}>{t(`privacy.${k}`)}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-lg premium-section-title mb-3">
                  {t("privacy.section7Title")}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                  {t("privacy.section7Content")}
                </p>
              </section>

              <section>
                <h2 className="text-lg premium-section-title mb-3">
                  {t("privacy.section8Title")}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                  {t("privacy.section8Content")}
                  {t("privacy.contactEmail") && (
                    <>
                      {" "}
                      <a
                        href={`mailto:${t("privacy.contactEmail")}`}
                        className="text-company-primary hover:underline"
                      >
                        {t("privacy.contactEmail")}
                      </a>
                    </>
                  )}
                  {t("privacy.section8Address") && (
                    <>{" "}{t("privacy.section8Address")}</>
                  )}
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center gap-2 text-company-primary hover:text-company-primary/80 text-sm font-medium transition-colors">
                <ArrowUp className="w-4 h-4" />
                {t("privacy.backToTop")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}