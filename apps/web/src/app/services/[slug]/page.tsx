"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { ThemeToggleSimple } from "@/components/ThemeToggleSimple";
import { LocaleToggle } from "@/components/LocaleToggle";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useTranslation } from "@/hooks/useTranslation";
import { Key, LayoutDashboard, DeviceMobile, ClipboardText } from "@/lib/premiumIcons";
import type { ComponentType, SVGProps } from "react";

const SLUGS = ["key-management", "dashboard", "mobile-checkin", "reports"] as const;
type Slug = (typeof SLUGS)[number];

const SLUG_CONFIG: Record<Slug, { i18n: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }> = {
  "key-management": { i18n: "keyManagement", Icon: Key },
  dashboard: { i18n: "dashboard", Icon: LayoutDashboard },
  "mobile-checkin": { i18n: "mobileCheckin", Icon: DeviceMobile },
  reports: { i18n: "reports", Icon: ClipboardText },
};

export default function ServicePage({ params }: { params: { slug: string } }) {
  const { t } = useTranslation();
  const slug = params.slug as Slug;

  if (!SLUGS.includes(slug)) notFound();

  const { i18n, Icon } = SLUG_CONFIG[slug];
  const prefix = `landing.servicePages.${i18n}`;

  const features = [
    t(`${prefix}.features.0`),
    t(`${prefix}.features.1`),
    t(`${prefix}.features.2`),
    t(`${prefix}.features.3`),
    t(`${prefix}.features.4`),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-page via-page to-page-alt/50 relative overflow-hidden">
      <BackgroundBeams />

      <div className="fixed top-0 left-0 right-0 z-30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("landing.signup.backToHome")}
            </Link>
            <div className="flex items-center gap-3">
              <ThemeToggleSimple />
              <LocaleToggle />
            </div>
          </div>
        </div>
      </div>

      <section className="relative z-10 pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-company-primary/10 flex items-center justify-center mb-8">
                <Icon className="text-company-primary" width={32} height={32} strokeWidth={1.5} />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary leading-[1.1]">
                {t(`${prefix}.title`)}
              </h1>
              <p className="mt-4 text-lg text-text-secondary leading-relaxed">
                {t(`${prefix}.subtitle`)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-12 space-y-6"
            >
              <p className="text-base text-text-secondary leading-relaxed">
                {t(`${prefix}.description1`)}
              </p>
              <p className="text-base text-text-secondary leading-relaxed">
                {t(`${prefix}.description2`)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-12"
            >
              <h2 className="text-xl font-semibold text-text-primary mb-6">
                {t("landing.services.title") === "Services" ? "What's included" : "Características incluidas"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 rounded-xl border border-border-color/60 bg-white/50 dark:bg-white/5 px-4 py-3"
                  >
                    <Check className="w-5 h-5 shrink-0 text-company-primary mt-0.5" />
                    <span className="text-sm text-text-secondary">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 text-center"
            >
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-company-primary px-8 py-3 text-sm font-medium text-white shadow-sm hover:brightness-110 transition-all"
              >
                {t("landing.cta.button")}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
