"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
import { ThemeToggleSimple } from "@/components/ThemeToggleSimple";
import { LocaleToggle } from "@/components/LocaleToggle";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useTranslation } from "@/hooks/useTranslation";
import { INPUT_CLASSES, BUTTON_CLASSES, LABEL_CLASSES } from "@/lib/utils";

const SIZES = [
  { value: "1-10", labelKey: "1-10" },
  { value: "11-50", labelKey: "11-50" },
  { value: "51-200", labelKey: "51-200" },
  { value: "200+", labelKey: "200+" },
];

export default function DemoRequestPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    size: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError(t("landing.demoRequest.formError"));
    }
  };

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
              {t("landing.demoRequest.backToHome")}
            </Link>
            <div className="flex items-center gap-3">
              <ThemeToggleSimple />
              <LocaleToggle />
            </div>
          </div>
        </div>
      </div>

      <section className="relative z-10 min-h-screen flex items-center pt-20 pb-16">
        <div className="w-full mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-stretch">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 flex flex-col gap-10"
            >
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
                  {t("landing.demoRequest.title")}
                </h1>
                <p className="mt-3 text-base text-text-secondary leading-relaxed">
                  {t("landing.demoRequest.subtitle")}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-3"
            >
              <div className="rounded-2xl border border-card-border bg-card-bg backdrop-blur-xl p-8 md:p-10 shadow-sm h-full">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-5">
                      <Send className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-semibold text-text-primary">{t("landing.demoRequest.formSuccess")}</h2>
                    <p className="mt-2 text-sm text-text-secondary">{t("landing.demoRequest.formSuccessDesc")}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="demo-name" className={LABEL_CLASSES}>
                        {t("landing.demoRequest.formName")}
                      </label>
                      <input
                        id="demo-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        required
                        placeholder={t("landing.demoRequest.formNamePlaceholder")}
                        className={INPUT_CLASSES}
                      />
                    </div>
                    <div>
                      <label htmlFor="demo-email" className={LABEL_CLASSES}>
                        {t("landing.demoRequest.formEmail")}
                      </label>
                      <input
                        id="demo-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                        required
                        placeholder={t("landing.demoRequest.formEmailPlaceholder")}
                        className={INPUT_CLASSES}
                      />
                    </div>
                    <div>
                      <label htmlFor="demo-company" className={LABEL_CLASSES}>
                        {t("landing.demoRequest.formCompany")}
                      </label>
                      <input
                        id="demo-company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
                        required
                        placeholder={t("landing.demoRequest.formCompanyPlaceholder")}
                        className={INPUT_CLASSES}
                      />
                    </div>
                    <div>
                      <label htmlFor="demo-phone" className={LABEL_CLASSES}>
                        {t("landing.demoRequest.formPhone")}
                      </label>
                      <input
                        id="demo-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                        placeholder={t("landing.demoRequest.formPhonePlaceholder")}
                        className={INPUT_CLASSES}
                      />
                    </div>
                    <div>
                      <label htmlFor="demo-size" className={LABEL_CLASSES}>
                        {t("landing.demoRequest.formSize")}
                      </label>
                      <select
                        id="demo-size"
                        value={formData.size}
                        onChange={(e) => setFormData((p) => ({ ...p, size: e.target.value }))}
                        className={INPUT_CLASSES}
                      >
                        <option value="">{t("landing.demoRequest.formSizePlaceholder")}</option>
                        {SIZES.map((s) => (
                          <option key={s.value} value={s.value}>{s.labelKey}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="demo-message" className={LABEL_CLASSES}>
                        {t("landing.demoRequest.formMessage")}
                      </label>
                      <textarea
                        id="demo-message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                        placeholder={t("landing.demoRequest.formMessagePlaceholder")}
                        className={`${INPUT_CLASSES} resize-none`}
                      />
                    </div>
                    {error && (
                      <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400" role="alert">
                        {error}
                      </div>
                    )}
                    <button
                      type="submit"
                      className={`${BUTTON_CLASSES} group flex items-center justify-center gap-2`}
                    >
                      {t("landing.demoRequest.formSubmit")}
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
