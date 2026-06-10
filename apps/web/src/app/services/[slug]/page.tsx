"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { ThemeToggleSimple } from "@/components/ThemeToggleSimple";
import { LocaleToggle } from "@/components/LocaleToggle";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useTranslation } from "@/hooks/useTranslation";
import type { ComponentType, SVGProps } from "react";
import { use } from "react";
import { IconKeyFilled, IconLayoutDashboardFilled, IconDeviceMobileFilled, IconClipboardTextFilled } from "@tabler/icons-react";

const SLUGS = ["key-management", "dashboard", "mobile-checkin", "reports"] as const;
type Slug = (typeof SLUGS)[number];

const SLUG_CONFIG: Record<Slug, { i18n: string; Icon: ComponentType<SVGProps<SVGSVGElement>>; iconColor: string; iconBg: string }> = {
  "key-management": { i18n: "keyManagement", Icon: IconKeyFilled, iconColor: "text-amber-500", iconBg: "bg-amber-500/10" },
  dashboard: { i18n: "dashboard", Icon: IconLayoutDashboardFilled, iconColor: "text-sky-500", iconBg: "bg-sky-500/10" },
  "mobile-checkin": { i18n: "mobileCheckin", Icon: IconDeviceMobileFilled, iconColor: "text-emerald-500", iconBg: "bg-emerald-500/10" },
  reports: { i18n: "reports", Icon: IconClipboardTextFilled, iconColor: "text-violet-500", iconBg: "bg-violet-500/10" },
};

export default function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: raw } = use(params);
  const slug = raw as Slug;
  const { t } = useTranslation();
  if (!SLUGS.includes(slug)) notFound();

  const { i18n, Icon, iconColor, iconBg } = SLUG_CONFIG[slug];
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className={`w-16 h-16 rounded-2xl ${iconBg} flex items-center justify-center mb-8`}>
                <Icon className={iconColor} width={32} height={32} />
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
      </section>
    </div>
  );
}
