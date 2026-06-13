"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ArrowRight } from "lucide-react";
import { ThemeToggleSimple } from "@/components/ThemeToggleSimple";
import { LocaleToggle } from "@/components/LocaleToggle";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useTranslation } from "@/hooks/useTranslation";
import type { ComponentType, SVGProps } from "react";
import { use, useState, useEffect } from "react";
import {
  IconKeyFilled,
  IconLayoutDashboardFilled,
  IconDeviceMobileFilled,
  IconClipboardTextFilled,
  IconBellFilled,
  IconPaletteFilled,
} from "@tabler/icons-react";

const SLUGS = ["key-management", "dashboard", "mobile-checkin", "reports", "notifications", "white-label"] as const;
type Slug = (typeof SLUGS)[number];

const ICON_COLOR = "text-company-primary dark:text-white/80";
const ICON_BG = "bg-company-primary/[0.08] dark:bg-white/[0.08]";

interface SlugConfig {
  i18n: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const SLUG_CONFIG: Record<Slug, SlugConfig> = {
  "key-management": { i18n: "keyManagement", Icon: IconKeyFilled },
  dashboard: { i18n: "dashboard", Icon: IconLayoutDashboardFilled },
  "mobile-checkin": { i18n: "mobileCheckin", Icon: IconDeviceMobileFilled },
  reports: { i18n: "reports", Icon: IconClipboardTextFilled },
  notifications: { i18n: "notifications", Icon: IconBellFilled },
  "white-label": { i18n: "whiteLabel", Icon: IconPaletteFilled },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

export default function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: raw } = use(params);
  const slug = raw as Slug;
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!SLUGS.includes(slug)) notFound();

  const cfg = SLUG_CONFIG[slug];
  const { i18n, Icon } = cfg;
  const prefix = `landing.servicePages.${i18n}`;

  const features = [
    t(`${prefix}.features.0`),
    t(`${prefix}.features.1`),
    t(`${prefix}.features.2`),
    t(`${prefix}.features.3`),
    t(`${prefix}.features.4`),
  ];

  return (
    <div className="min-h-screen bg-surface relative overflow-hidden">
      <BackgroundBeams />

      {/* ─── Navbar ─── */}
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
                <li className="font-medium text-text-primary" aria-current="page">{t(`${prefix}.title`)}</li>
              </ol>
            </nav>
            <Link
              href="/"
              className="sm:hidden inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t(`${prefix}.title`)}
            </Link>
            <div className="flex items-center gap-3">
              <ThemeToggleSimple />
              <LocaleToggle />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Hero + Features ─── */}
      <section className="min-h-dvh flex items-center pt-24 pb-16 sm:pt-28 sm:pb-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Title + CTA */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-text-primary leading-[1.08]">
                {t(`${prefix}.title`)}
              </h1>
              <p className="mt-5 text-lg text-text-secondary leading-relaxed max-w-lg">
                {t(`${prefix}.subtitle`)}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-full bg-company-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-company-primary/20 hover:brightness-110 transition-all"
                >
                  {t("landing.cta.button")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Right — Features */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
              className="space-y-3"
            >
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="flex items-start gap-4 rounded-2xl border border-card-border bg-card-bg backdrop-blur-sm p-4 sm:p-5 transition-all duration-300 hover:border-company-primary/20 hover:shadow-lg hover:shadow-company-primary/5"
                >
                  <div className={`w-9 h-9 rounded-lg ${ICON_BG} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Check className={`w-4 h-4 ${ICON_COLOR}`} strokeWidth={3} />
                  </div>
                  <span className="text-[15px] text-text-secondary leading-relaxed pt-1">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-20 sm:py-24 bg-page-alt border-t border-border-color/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="premium-label">{t("landing.howItWorks.title")}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary">
              {t(`${prefix}.subtitle`)}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {[
              { step: 1, title: t(`${prefix}.howItWorks.step1Title`), desc: t(`${prefix}.howItWorks.step1Desc`) },
              { step: 2, title: t(`${prefix}.howItWorks.step2Title`), desc: t(`${prefix}.howItWorks.step2Desc`) },
              { step: 3, title: t(`${prefix}.howItWorks.step3Title`), desc: t(`${prefix}.howItWorks.step3Desc`) },
            ].map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative text-center"
              >
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-border-color/60" />
                )}
                <div className={`w-16 h-16 rounded-2xl ${ICON_BG} flex items-center justify-center mx-auto mb-5`}>
                  <span className={`text-2xl font-bold ${ICON_COLOR}`}>{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-company-primary">
        <div className="px-6 py-20 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                {t("landing.cta.heading")}
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-base text-white/70 leading-relaxed">
                {t("landing.services.title") === "Services" ? "Join hundreds of businesses already using Parkit." : "Únete a cientos de negocios que ya usan Parkit."}
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/signup"
                  className="rounded-full bg-white px-8 py-4 text-base font-semibold text-company-primary shadow-sm hover:brightness-110 transition-all"
                >
                  {t("landing.cta.button")}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Related Services ─── */}
      <section className="py-20 sm:py-24 border-t border-border-color/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="premium-label">{t("landing.services.title") === "Services" ? "Explore more" : "Explora más"}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary">
              {t("landing.services.title") === "Services" ? "Other solutions" : "Otras soluciones"}
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-5 max-w-4xl mx-auto">
            {SLUGS.filter(s => s !== slug && s !== "reports").map((related, i) => {
              const r = SLUG_CONFIG[related];
              return (
                <motion.div
                  key={related}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Link
                    href={`/services/${related}`}
                    className="group block w-40 sm:w-44 rounded-2xl border border-border-color/40 bg-white/50 dark:bg-white/[0.02] p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className={`w-11 h-11 rounded-lg ${ICON_BG} flex items-center justify-center mb-4`}>
                      <r.Icon className={ICON_COLOR} width={22} height={22} />
                    </div>
                    <h3 className="text-[15px] font-semibold text-text-primary">
                      {t(`landing.servicePages.${r.i18n}.title`)}
                    </h3>
                    <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-company-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {t("landing.services.title") === "Services" ? "Read More" : "Leer más"}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
