"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, animate } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Check } from "@/lib/premiumIcons";
import parkingImg from "@/assets/parking.svg";
import { ThemeToggleSimple } from "@/components/ThemeToggleSimple";
import { LocaleToggle } from "@/components/LocaleToggle";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useTranslation } from "@/hooks/useTranslation";
function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");
  const numeric = parseInt(value.replace(/[^0-9]/g, ""));
  const hasPlus = value.includes("+");

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, numeric, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v).toString()),
    });
    return () => controls.stop();
  }, [isInView, numeric]);

  return (
    <span ref={ref}>
      {display}{hasPlus ? "+" : ""}{suffix}
    </span>
  );
}

export default function AboutPage() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [aboutTab, setAboutTab] = useState<"mission" | "vision">("mission");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-surface relative overflow-hidden">
      <BackgroundBeams />

      {/* Header */}
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
                <li className="font-medium text-text-primary" aria-current="page">{t("landing.about.title")}</li>
              </ol>
            </nav>
            <Link
              href="/"
              className="sm:hidden inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("landing.about.title")}
            </Link>
            <div className="flex items-center gap-3">
              <ThemeToggleSimple />
              <LocaleToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="relative z-10 w-full mx-auto max-w-7xl px-6 lg:px-8 pt-24 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-2xl bg-gradient-to-br from-company-primary/15 to-transparent">
                <div className="rounded-2xl bg-surface/80 backdrop-blur-sm flex items-center justify-center">
                  <img src={parkingImg.src} alt="Parking" className="w-full max-h-[500px] object-contain p-2" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <h2 className="text-base/7 font-semibold text-company-primary tracking-wide uppercase">{t("landing.about.title")}</h2>
              <p className="mt-3 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
                {t("landing.about.heading")}
              </p>
              <p className="mt-5 text-base text-text-secondary leading-relaxed max-w-lg">
                {t("landing.about.description")}
              </p>

              <div className="mt-10">
                <div className="flex gap-6">
                  <button
                    onClick={() => setAboutTab("mission")}
                    className={`relative px-1 pb-3 text-sm font-semibold transition-colors ${
                      aboutTab === "mission" ? "text-company-primary" : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {t("landing.about.missionTab")}
                    {aboutTab === "mission" && (
                      <motion.span layoutId="about-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-company-primary rounded-full" />
                    )}
                  </button>
                  <button
                    onClick={() => setAboutTab("vision")}
                    className={`relative px-1 pb-3 text-sm font-semibold transition-colors ${
                      aboutTab === "vision" ? "text-company-primary" : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {t("landing.about.visionTab")}
                    {aboutTab === "vision" && (
                      <motion.span layoutId="about-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-company-primary rounded-full" />
                    )}
                  </button>
                </div>

                <motion.div
                  key={aboutTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6"
                >
                  <p className="text-text-secondary leading-relaxed text-sm">
                    {aboutTab === "mission" ? t("landing.about.missionDesc") : t("landing.about.visionDesc")}
                  </p>
                  <ul className="mt-5 space-y-3">
                    {(aboutTab === "mission"
                      ? [t("landing.about.missionItem1"), t("landing.about.missionItem2"), t("landing.about.missionItem3")]
                      : [t("landing.about.visionItem1"), t("landing.about.visionItem2"), t("landing.about.visionItem3")]
                    ).map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                        <Check className="h-4 w-4 shrink-0 text-company-primary mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
