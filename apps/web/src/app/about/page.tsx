"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { ParkingCircle } from "@/lib/premiumIcons";
import { ThemeToggleSimple } from "@/components/ThemeToggleSimple";
import { LocaleToggle } from "@/components/LocaleToggle";
import { useTranslation } from "@/hooks/useTranslation";

export default function AboutPage() {
  const { t } = useTranslation();
  const [aboutTab, setAboutTab] = useState<"mission" | "vision">("mission");

  return (
    <div className="min-h-screen bg-surface">
      <div className="fixed top-4 right-4 z-30 flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-company-primary hover:underline"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back to home
        </Link>
        <ThemeToggleSimple />
        <LocaleToggle />
      </div>

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="rounded-2xl bg-gradient-to-br from-company-primary/20 to-company-primary/5 p-8 flex items-center justify-center aspect-[4/3]">
                <ParkingCircle className="text-company-primary/30" width={180} height={180} strokeWidth={1} />
              </div>
            </div>

            <div id="about-content">
              <h2 className="text-base/7 font-semibold text-company-primary tracking-wide uppercase">{t("landing.about.title")}</h2>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
                {t("landing.about.heading")}
              </p>
              <p className="mt-5 text-base text-text-secondary leading-relaxed">
                {t("landing.about.description")}
              </p>

              <div className="mt-10">
                <div className="flex gap-8 border-b border-border-color">
                  <button
                    onClick={() => setAboutTab("mission")}
                    className={`pb-3 text-sm font-semibold tracking-wide transition-colors relative ${aboutTab === "mission" ? "text-company-primary" : "text-text-secondary hover:text-text-primary"}`}
                  >
                    {t("landing.about.missionTab")}
                    {aboutTab === "mission" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-company-primary" />}
                  </button>
                  <button
                    onClick={() => setAboutTab("vision")}
                    className={`pb-3 text-sm font-semibold tracking-wide transition-colors relative ${aboutTab === "vision" ? "text-company-primary" : "text-text-secondary hover:text-text-primary"}`}
                  >
                    {t("landing.about.visionTab")}
                    {aboutTab === "vision" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-company-primary" />}
                  </button>
                </div>

                {aboutTab === "mission" ? (
                  <div className="mt-6">
                    <p className="text-text-secondary leading-relaxed text-sm">
                      Our mission is to transform valet parking operations worldwide through innovative technology, eliminating manual processes and delivering real-time visibility.
                    </p>
                    <ul className="mt-5 space-y-3">
                      {[t("landing.about.missionItem1"), t("landing.about.missionItem2"), t("landing.about.missionItem3")].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-text-secondary">
                          <Check className="h-4 w-4 shrink-0 text-company-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="mt-6">
                    <p className="text-text-secondary leading-relaxed text-sm">
                      Our vision is to become the global standard in valet parking technology, empowering operators with AI-driven insights and seamless automation.
                    </p>
                    <ul className="mt-5 space-y-3">
                      {[t("landing.about.visionItem1"), t("landing.about.visionItem2"), t("landing.about.visionItem3")].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-text-secondary">
                          <Check className="h-4 w-4 shrink-0 text-company-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Link
                  href="/"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-company-primary hover:underline"
                >
                  {t("landing.about.seeMore")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-page-alt py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: t("landing.about.stat1Value"), label: t("landing.about.stat1") },
              { value: t("landing.about.stat2Value"), label: t("landing.about.stat2") },
              { value: t("landing.about.stat3Value"), label: t("landing.about.stat3") },
              { value: t("landing.about.stat4Value"), label: t("landing.about.stat4") },
            ].map((stat, i) => (
              <div key={i} className="text-center py-6">
                <p className="text-4xl font-bold text-company-primary">{stat.value}</p>
                <p className="mt-2 text-sm font-medium text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
