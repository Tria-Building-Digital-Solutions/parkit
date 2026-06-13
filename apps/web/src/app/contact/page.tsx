"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Mail, MessageCircle, MapPin, Headphones } from "lucide-react";
import { ThemeToggleSimple } from "@/components/ThemeToggleSimple";
import { LocaleToggle } from "@/components/LocaleToggle";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useTranslation } from "@/hooks/useTranslation";
import { INPUT_CLASSES, BUTTON_CLASSES, LABEL_CLASSES } from "@/lib/utils";

const contactItems = [
  {
    icon: Mail,
    labelKey: "emailLabel" as const,
    actionKey: "emailAction" as const,
    descKey: "emailDesc" as const,
    href: "mailto:contacto@triacr.com",
    gradient: "from-blue-500/20 to-blue-600/5",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: MessageCircle,
    labelKey: "phoneLabel" as const,
    actionKey: "phoneAction" as const,
    descKey: "phoneDesc" as const,
    href: "https://wa.me/50662164040",
    gradient: "from-emerald-500/20 to-emerald-600/5",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Headphones,
    labelKey: "supportLabel" as const,
    actionKey: "supportAction" as const,
    descKey: "supportDesc" as const,
    href: "mailto:support@triacr.com",
    gradient: "from-purple-500/20 to-purple-600/5",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: MapPin,
    labelKey: "officeLabel" as const,
    actionKey: "officeAction" as const,
    descKey: "officeDesc" as const,
    href: "https://maps.google.com/?q=Atenas+Alajuela+Costa+Rica",
    gradient: "from-amber-500/20 to-amber-600/5",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
];

const INPUT = INPUT_CLASSES;

export default function ContactPage() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError(t("landing.contact.formError"));
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-surface relative overflow-hidden">
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
                <li className="font-medium text-text-primary" aria-current="page">{t("landing.contact.title")}</li>
              </ol>
            </nav>
            <Link
              href="/"
              className="sm:hidden inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("landing.contact.title")}
            </Link>
            <div className="flex items-center gap-3">
              <ThemeToggleSimple />
              <LocaleToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="relative z-10 min-h-screen flex items-center pt-20 pb-16">
        <div className="w-full mx-auto max-w-7xl px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            {/* Left — Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-8 h-full"
            >
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary leading-[1.1]">
                  {t("landing.contact.title")}
                </h1>
                <p className="mt-4 text-base text-text-secondary leading-relaxed max-w-xs">
                  {t("landing.contact.subtitle")}
                </p>
              </div>

              {/* Premium contact cards */}
              <div className="space-y-3 flex-1">
                {contactItems.map((item, i) => (
                  <motion.a
                    key={item.labelKey}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                    className="group flex items-center gap-4 rounded-2xl border border-card-border bg-card-bg/80 backdrop-blur-sm p-4 transition-all duration-300 hover:border-company-primary/20 hover:shadow-lg hover:shadow-company-primary/5 hover:bg-white/90 dark:hover:bg-slate-800/80"
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                        {t(`landing.contact.${item.labelKey}`)}
                      </p>
                      <p className="text-sm font-semibold text-text-primary transition-colors group-hover:text-company-primary mt-0.5">
                        {t(`landing.contact.${item.actionKey}`)}
                      </p>
                      <p className="text-xs text-text-muted/80 mt-0.5">
                        {t(`landing.contact.${item.descKey}`)}
                      </p>
                    </div>
                    <div className="shrink-0 text-text-muted/40 transition-all duration-300 group-hover:text-company-primary/60 group-hover:translate-x-0.5">
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </div>
                    </motion.a>
                  ))}
                </div>

                {/* Social links */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider shrink-0">{t("landing.contact.socialTitle")}</span>
                  <div className="h-px flex-1 bg-border-color/50" />
                  <div className="flex items-center gap-4 shrink-0">
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted transition-colors hover:text-company-primary"
                    >
                      <span className="sr-only">{t("landing.footer.socialInstagram")}</span>
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 0 1 1.772 1.153 4.902 4.902 0 0 1 1.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 0 1-1.153 1.772 4.902 4.902 0 0 1-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 0 1-1.772-1.153 4.902 4.902 0 0 1-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 0 1 1.153-1.772A4.902 4.902 0 0 1 6.38 2.525c.636-.247 1.363-.416 2.427-.465C8.552 2.013 8.907 2 11.38 2h.935zm.02 1.802h-.875c-2.36 0-2.598.009-3.526.051-1.023.047-1.58.21-1.951.348-.488.182-.875.399-1.258.782a3.17 3.17 0 0 0-.782 1.258c-.138.37-.301.928-.348 1.951-.042.928-.051 1.165-.051 3.526v.875c0 2.36.009 2.598.051 3.526.047 1.023.21 1.58.348 1.951.182.488.399.875.782 1.258a3.17 3.17 0 0 0 1.258.782c.37.138.928.301 1.951.348.928.042 1.165.051 3.526.051h.875c2.36 0 2.598-.009 3.526-.051 1.023-.047 1.58-.21 1.951-.348a3.17 3.17 0 0 0 1.258-.782 3.17 3.17 0 0 0 .782-1.258c.138-.37.301-.928.348-1.951.042-.928.051-1.165.051-3.526v-.875c0-2.36-.009-2.598-.051-3.526-.047-1.023-.21-1.58-.348-1.951a3.17 3.17 0 0 0-.782-1.258 3.17 3.17 0 0 0-1.258-.782c-.37-.138-.928-.301-1.951-.348-.928-.042-1.165-.051-3.526-.051zm0 1.802a6.398 6.398 0 1 0 0 12.796 6.398 6.398 0 0 0 0-12.796zm0 10.994a4.596 4.596 0 1 1 0-9.192 4.596 4.596 0 0 1 0 9.192zM17.164 4.85a1.496 1.496 0 1 0 0 2.992 1.496 1.496 0 0 0 0-2.992z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted transition-colors hover:text-company-primary"
                    >
                      <span className="sr-only">{t("landing.footer.socialTikTok")}</span>
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted transition-colors hover:text-company-primary"
                    >
                      <span className="sr-only">{t("landing.footer.socialX")}</span>
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    <a
                      href="https://linkedin.com/company/triacr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted transition-colors hover:text-company-primary"
                    >
                      <span className="sr-only">{t("landing.footer.socialLinkedin")}</span>
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative rounded-3xl border border-card-border/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-8 md:p-12 shadow-xl shadow-company-primary/5 h-full">
                {/* Decorative gradient line */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-company-primary/30 to-transparent" />

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-6 ring-1 ring-emerald-500/20">
                      <Send className="w-9 h-9" />
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary">{t("landing.contact.formSuccess")}</h2>
                    <p className="mt-3 text-base text-text-secondary max-w-sm mx-auto">{t("landing.contact.formSuccessDesc")}</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="contact-name" className={LABEL_CLASSES}>
                        {t("landing.contact.formName")}
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        required
                        className={INPUT}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className={LABEL_CLASSES}>
                        {t("landing.contact.formEmail")}
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                        required
                        className={INPUT}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-company" className={LABEL_CLASSES}>
                        {t("landing.contact.formCompany")}
                      </label>
                      <input
                        id="contact-company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
                        required
                        className={INPUT}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-message" className={LABEL_CLASSES}>
                        {t("landing.contact.formMessage")}
                      </label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                        required
                        className={`${INPUT} resize-none min-h-[120px]`}
                      />
                    </div>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-red-500/15 bg-red-500/5 px-5 py-3.5 text-sm text-red-600 dark:text-red-400"
                        role="alert"
                      >
                        {error}
                      </motion.div>
                    )}
                    <button
                      type="submit"
                      className={`${BUTTON_CLASSES} group flex items-center justify-center gap-2`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {t("landing.contact.formSubmit")}
                        <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
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
