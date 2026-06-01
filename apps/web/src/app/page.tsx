"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthModal } from "@/components/AuthModal";
import { ArrowRight, Menu, X, Mail, Phone, MapPin, Plus, Minus, Check, Smartphone, Activity, BarChart3, Key, Monitor, Building2, Palette, Cpu, UtensilsCrossed, Heart, ShoppingBag, Calendar, RefreshCw, Plane, Truck, Star, Zap } from "lucide-react";
import Hyperspeed from "@/components/effects/Hyperspeed";
import { hyperspeedPresets } from "@/components/effects/hyperspeedPresets";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { ThemeToggleSimple } from "@/components/ThemeToggleSimple";
import { LocaleToggle } from "@/components/LocaleToggle";
import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "next-themes";

function AnimatedStat({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const start = performance.now();
    let raf: number;
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * to));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [annual, setAnnual] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<"login" | "request-access">("login");
  const [authAnchor, setAuthAnchor] = useState<"sign-in" | "request-access" | null>(null);
  const signInBtnRef = useRef<HTMLButtonElement>(null);
  const requestAccessBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    const auth = params.get("auth");
    if (auth === "request-access") {
      setAuthAnchor(null);
      setAuthModalView("request-access");
      setAuthModalOpen(true);
    } else if (auth === "login") {
      setAuthAnchor(null);
      setAuthModalView("login");
      setAuthModalOpen(true);
    }
  }, []);

  const logoVariant = mounted && resolvedTheme === "dark" ? "onDark" : "default";

  const handleRequestDemo = () => {
    router.push("/demo-request");
  };

  const handleLearnMore = () => {
    const featuresSection = document.getElementById("features");
    featuresSection?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGetStarted = () => {
    router.push("/signup");
  };

  const handleContactSales = () => {
    router.push("/contact");
  };

  const navigation = [
    { name: t("landing.nav.features"), href: "#features" },
    { name: t("landing.nav.solutions"), href: "#solutions" },
    { name: t("landing.nav.pricing"), href: "#pricing" },
    { name: t("landing.nav.faq"), href: "#faq" },
  ];

  const footerSections = [
    {
      title: t("landing.footer.solutions"),
      idPrefix: "footer-solutions",
      links: [
        { name: t("landing.footer.linksValet"), href: "#features" },
        { name: t("landing.footer.linksAccess"), href: "#features" },
        { name: t("landing.footer.linksReports"), href: "#features" },
        { name: t("landing.footer.linksApp"), href: "#features" },
      ],
    },
    {
      title: t("landing.footer.support"),
      idPrefix: "footer-support",
      links: [
        { name: t("landing.footer.linksHelp"), href: "#faq" },
        { name: t("landing.footer.linksDocs"), href: "#features" },
        { name: t("landing.footer.linksApi"), href: "#features" },
        { name: t("landing.footer.linksStatus"), href: "#pricing" },
      ],
    },
    {
      title: t("landing.footer.company"),
      idPrefix: "footer-company",
      links: [
        { name: t("landing.footer.linksAbout"), href: "#features" },
        { name: t("landing.footer.linksBlog"), href: "#faq" },
        { name: t("landing.footer.linksJobs"), href: "#faq" },
        { name: t("landing.footer.linksPress"), href: "#faq" },
      ],
    },
    {
      title: t("landing.footer.legal"),
      idPrefix: "footer-legal",
      links: [
        { name: t("landing.footer.linksTerms"), href: "/terms" },
        { name: t("landing.footer.linksPrivacy"), href: "/privacy" },
        { name: t("landing.footer.linksCookies"), href: "/privacy" },
        { name: t("landing.footer.linksContact"), href: "#faq" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Navbar */}
      <div className="relative min-h-screen bg-gray-900 flex flex-col">
        {/* Hyperspeed Background */}
        <div className="absolute inset-0">
          <Hyperspeed effectOptions={hyperspeedPresets.four} />
          <div className="absolute inset-0 bg-gray-900/70 mix-blend-multiply" />
        </div>

        {/* Navbar */}
        <nav className="relative z-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-center justify-between py-5">
              <div className="flex lg:flex-1">
                <a href="#" className="-m-1.5 p-1.5">
                  <Logo variant="onDark" />
                </a>
              </div>
              <div className="flex lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="-m-2.5 inline-flex items-center justify-center rounded-full p-2.5 text-white"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>
              <div className="hidden lg:flex lg:gap-x-8">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-sm font-semibold leading-6 text-white/80 hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-x-3">
                <div className="flex items-center gap-1">
                  <ThemeToggleSimple />
                  <LocaleToggle triggerClassName="!text-white/70 hover:!text-white" />
                </div>
                <button
                  ref={signInBtnRef}
                  onClick={() => { setAuthAnchor("sign-in"); setAuthModalView("login"); setAuthModalOpen(true); }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/80 hover:text-white hover:border-white/40 transition-all"
                >
                  {t("auth.signIn")}<ArrowRight className="h-4 w-4" />
                </button>
                <button
                  ref={requestAccessBtnRef}
                  onClick={() => { setAuthAnchor("request-access"); setAuthModalView("request-access"); setAuthModalOpen(true); }}
                  className="text-sm font-medium text-white/60 hover:text-white transition-all"
                >
                  {t("auth.requestAccess")}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 lg:hidden"
            >
              <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed inset-x-0 top-0 bg-white dark:bg-gray-900 p-6"
              >
                <div className="flex items-center justify-between">
                  <Logo variant={logoVariant} />
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-m-2.5 rounded-full p-2.5 text-gray-700 dark:text-gray-300"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-6 flow-root">
                  <div className="space-y-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-base font-semibold leading-7 text-gray-900 dark:text-white hover:text-blue-600"
                      >
                        {item.name}
                      </a>
                    ))}
                    <div className="pt-4 space-y-3">
                      <button
                        onClick={() => { setAuthAnchor(null); setMobileMenuOpen(false); setAuthModalView("login"); setAuthModalOpen(true); }}
                        className="w-full rounded-full bg-white px-5 py-3 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-100 transition-all"
                      >
                        <span className="flex items-center justify-center gap-2">
                          {t("auth.signIn")}<ArrowRight className="h-4 w-4" />
                        </span>
                      </button>
                      <button
                        onClick={() => { setAuthAnchor(null); setMobileMenuOpen(false); setAuthModalView("request-access"); setAuthModalOpen(true); }}
                        className="w-full rounded-full border border-white/30 px-5 py-3 text-base font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                      >
                        {t("auth.requestAccess")}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Content */}
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 w-full flex-1 flex items-center justify-center">
          <motion.div
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12,
                  delayChildren: 0.3,
                },
              },
            }}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {/* Hero Title */}
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              {t("landing.hero.title").split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.95 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { type: "spring", stiffness: 120, damping: 14 },
                    },
                  }}
                  className="inline-block"
                >
                  {word}{'\u00A0'}
                </motion.span>
              ))}
              <br />
              <span className="text-blue-600 dark:text-blue-500">{t("landing.hero.subtitle")}</span>
            </h1>

            {/* Hero Subtitle */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
              }}
              className="mt-6 text-lg leading-8 text-gray-300 max-w-3xl mx-auto"
            >
              {t("landing.hero.description")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
              }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRequestDemo}
                className="rounded-full bg-white px-8 py-4 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-100 transition-all"
              >
                <span className="flex items-center gap-2">
                  {t("landing.hero.cta")}
                  <ArrowRight className="w-5 h-5" />
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLearnMore}
                className="rounded-full px-8 py-4 text-base font-semibold text-white border-2 border-white/30 hover:border-white/50 transition-all"
              >
                {t("landing.hero.learnMore")}
              </motion.button>
            </motion.div>

          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white dark:bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
            {[
              { label: t("landing.stats.vehicles"), value: 2, suffix: "M+" },
              { label: t("landing.stats.companies"), value: 500, suffix: "+" },
              { label: t("landing.stats.valets"), value: 10, suffix: "K+" },
              { label: t("landing.stats.coverage"), value: 15, suffix: "" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mx-auto flex max-w-xs flex-col gap-y-4"
              >
                <dt className="text-base/7 text-gray-600 dark:text-gray-400">{stat.label}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                  <AnimatedStat to={stat.value} suffix={stat.suffix} />
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 dark:bg-gray-800 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-lg font-semibold leading-8 tracking-tight text-blue-600">
              {t("landing.howItWorks.title")}
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {t("landing.howItWorks.heading")}
            </p>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("landing.howItWorks.description")}
            </p>
          </motion.div>

          <div className="relative mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Connecting line */}
            <div className="absolute left-1/2 top-16 hidden h-[calc(100%-8rem)] w-px bg-gradient-to-b from-blue-200 via-blue-400 to-blue-200 dark:from-blue-800 dark:via-blue-600 dark:to-blue-800 lg:block" />

            {[
              { step: "01", icon: Smartphone, title: t("landing.howItWorks.step1Title"), desc: t("landing.howItWorks.step1Desc") },
              { step: "02", icon: Activity, title: t("landing.howItWorks.step2Title"), desc: t("landing.howItWorks.step2Desc") },
              { step: "03", icon: BarChart3, title: t("landing.howItWorks.step3Title"), desc: t("landing.howItWorks.step3Desc") },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/20">
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="mt-4 text-sm font-semibold text-blue-600">{item.step}</span>
                <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400 max-w-xs">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white dark:bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-lg font-semibold leading-8 tracking-tight text-blue-600">
              {t("landing.whyFeatures.title")}
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {t("landing.whyFeatures.heading")}
            </p>
          </motion.div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-3">
            {[
              { icon: Key, title: t("landing.whyFeatures.item1Title"), desc: t("landing.whyFeatures.item1Desc") },
              { icon: Monitor, title: t("landing.whyFeatures.item2Title"), desc: t("landing.whyFeatures.item2Desc") },
              { icon: BarChart3, title: t("landing.whyFeatures.item3Title"), desc: t("landing.whyFeatures.item3Desc") },
              { icon: Building2, title: t("landing.whyFeatures.item4Title"), desc: t("landing.whyFeatures.item4Desc") },
              { icon: Palette, title: t("landing.whyFeatures.item5Title"), desc: t("landing.whyFeatures.item5Desc") },
              { icon: Cpu, title: t("landing.whyFeatures.item6Title"), desc: t("landing.whyFeatures.item6Desc") },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 dark:hover:shadow-blue-500/10"
              >
                <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="bg-gray-50 dark:bg-gray-800 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-lg font-semibold leading-8 tracking-tight text-blue-600">
              {t("landing.useCases.title")}
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {t("landing.useCases.heading")}
            </p>
          </motion.div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-4">
            {[
              { icon: Building2, title: t("landing.useCases.item1Title"), desc: t("landing.useCases.item1Desc") },
              { icon: UtensilsCrossed, title: t("landing.useCases.item2Title"), desc: t("landing.useCases.item2Desc") },
              { icon: Heart, title: t("landing.useCases.item3Title"), desc: t("landing.useCases.item3Desc") },
              { icon: ShoppingBag, title: t("landing.useCases.item4Title"), desc: t("landing.useCases.item4Desc") },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover:scale-110 group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-base font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================
          Services Layout 1 — Clanora mirror
      =========================== */}
      <section id="services" className="relative bg-gray-900 py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-950/30 to-gray-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-blue-400">
              {t("landing.servicesSection.subtitle")}
            </h2>
            <h3 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              {t("landing.servicesSection.heading")}
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Building2, title: t("landing.servicesSection.item1Title"), desc: t("landing.servicesSection.item1Desc") },
              { icon: Calendar, title: t("landing.servicesSection.item2Title"), desc: t("landing.servicesSection.item2Desc") },
              { icon: RefreshCw, title: t("landing.servicesSection.item3Title"), desc: t("landing.servicesSection.item3Desc") },
              { icon: Plane, title: t("landing.servicesSection.item4Title"), desc: t("landing.servicesSection.item4Desc") },
              { icon: Truck, title: t("landing.servicesSection.item5Title"), desc: t("landing.servicesSection.item5Desc") },
              { icon: Star, title: t("landing.servicesSection.item6Title"), desc: t("landing.servicesSection.item6Desc") },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Overlay image area */}
                <div className="relative h-48 bg-gradient-to-br from-blue-600/80 to-blue-900/80 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgM0wzNyA3bC00IDE3TDIwIDM3IDcgMjRsLTEtMTd6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvc3ZnPg==')] opacity-60" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-white group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="h-7 w-7" />
                  </div>
                </div>
                {/* Body */}
                <div className="p-7">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{item.title}</h4>
                  <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
                {/* Full width button */}
                <a
                  href="#contact"
                  className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 px-7 py-3.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group/btn"
                >
                  <span>{t("landing.hero.learnMore")}</span>
                  <span className="flex items-center justify-center w-8 h-8 rounded-full border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================
          Feature Layout 1 — Clanora mirror
      =========================== */}
      <section className="relative bg-gray-900 py-24 sm:py-32 overflow-hidden">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-gray-900 to-blue-950/80" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')]" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          {/* Heading row */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-blue-400">
                {t("landing.featuresSection.title")}
              </h2>
            </motion.div>
            <div className="mt-2 lg:grid lg:grid-cols-12 lg:gap-8 items-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-5"
              >
                <h3 className="text-3xl font-bold text-white sm:text-4xl">
                  {t("landing.featuresSection.heading")}
                </h3>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 lg:mt-0 lg:col-span-6 lg:col-start-7"
              >
                <p className="text-base font-semibold leading-7 text-gray-300">
                  {t("landing.featuresSection.description")}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    onClick={handleRequestDemo}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6 py-3 text-sm font-semibold transition-all"
                  >
                    <span>{t("landing.hero.cta")}</span>
                    <i className="icon-arrow-right"><ArrowRight className="h-4 w-4" /></i>
                  </button>
                  <button
                    onClick={handleContactSales}
                    className="inline-flex items-center gap-2 border-2 border-white/30 hover:border-white/50 text-white rounded-full px-6 py-3 text-sm font-semibold transition-all"
                  >
                    {t("landing.pricing.subscribe")}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Feature cards carousel/grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              { icon: Activity, title: t("landing.featuresSection.item1Title"), desc: t("landing.featuresSection.item1Desc") },
              { icon: Key, title: t("landing.featuresSection.item2Title"), desc: t("landing.featuresSection.item2Desc") },
              { icon: Zap, title: t("landing.featuresSection.item3Title"), desc: t("landing.featuresSection.item3Desc") },
              { icon: BarChart3, title: t("landing.featuresSection.item4Title"), desc: t("landing.featuresSection.item4Desc") },
              { icon: Smartphone, title: t("landing.featuresSection.item5Title"), desc: t("landing.featuresSection.item5Desc") },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col"
              >
                {/* Body */}
                <div className="p-7 flex-1 flex flex-col">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white">{item.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400 flex-1">{item.desc}</p>
                  <a
                    href="#contact"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors group/link"
                  >
                    <span>{t("landing.hero.learnMore")}</span>
                    <span className="flex items-center justify-center w-6 h-6 rounded-full border border-current group-hover/link:bg-blue-600 group-hover/link:text-white group-hover/link:border-blue-600 transition-all">
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </a>
                </div>
                {/* Image area */}
                <div className="h-40 bg-gradient-to-br from-blue-500/40 to-purple-600/40 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA2Ij48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSI0MCIvPjwvZz48L2c+PC9zdmc+')] bg-cover" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom row: rating + cta banner */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-start gap-4"
            >
              <div className="flex gap-1 text-yellow-400 shrink-0 mt-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm leading-6 text-gray-300">
                <span className="font-bold text-white">99.9% Customer Satisfaction</span> based on 750+ reviews from our beloved customers and 20,000 vehicles parked!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative rounded-lg overflow-hidden bg-gradient-to-r from-blue-700 to-blue-600 flex items-stretch min-h-[140px]"
            >
              <div className="w-1/3 bg-blue-800/50 flex items-center justify-center p-4">
                <Smartphone className="w-12 h-12 text-white/80" />
              </div>
              <div className="flex-1 p-6 flex flex-col justify-center">
                <h4 className="text-lg font-bold text-white">Parkit App</h4>
                <p className="mt-1 text-sm text-blue-100">Descarga nuestra app y gestiona tu estacionamiento desde cualquier lugar.</p>
                <button
                  onClick={handleRequestDemo}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-blue-200 transition-colors group/btn"
                >
                  <span>Explorar</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-white dark:bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <h2 className="text-base/7 font-semibold text-blue-600">{t("landing.pricing.title")}</h2>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 dark:text-white sm:text-5xl lg:text-balance">
              {t("landing.pricing.heading")}
            </p>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-center text-lg/8 text-gray-600 dark:text-gray-300"
          >
            {t("landing.pricing.description")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex justify-center"
          >
            <fieldset aria-label={t("landing.pricing.frequencyLabel")}>
              <div className="grid grid-cols-2 gap-x-1 rounded-full bg-gray-950/5 dark:bg-white/10 p-1 text-center text-xs/5 font-semibold text-gray-500 dark:text-gray-400">
                <label className="cursor-pointer rounded-full px-2.5 py-1 has-checked:bg-white dark:has-checked:bg-gray-600 has-checked:text-gray-900 dark:has-checked:text-white has-checked:shadow">
                  <input
                    type="radio"
                    name="frequency"
                    value="monthly"
                    checked={!annual}
                    onChange={() => setAnnual(false)}
                    className="sr-only"
                  />
                  <span>{t("landing.pricing.monthly")}</span>
                </label>
                <label className="cursor-pointer rounded-full px-2.5 py-1 has-checked:bg-white dark:has-checked:bg-gray-600 has-checked:text-gray-900 dark:has-checked:text-white has-checked:shadow">
                  <input
                    type="radio"
                    name="frequency"
                    value="annually"
                    checked={annual}
                    onChange={() => setAnnual(true)}
                    className="sr-only"
                  />
                  <span>{t("landing.pricing.annual")}</span>
                </label>
              </div>
            </fieldset>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3"
          >
            {[
              {
                name: t("landing.pricing.plans.basic.name"),
                desc: t("landing.pricing.plans.basic.desc"),
                monthlyPrice: t("landing.pricing.plans.basic.monthlyPrice"),
                annualPrice: t("landing.pricing.plans.basic.annualPrice"),
                features: [
                  t("landing.pricing.plans.basic.feature1"),
                  t("landing.pricing.plans.basic.feature2"),
                  t("landing.pricing.plans.basic.feature3"),
                  t("landing.pricing.plans.basic.feature4"),
                  t("landing.pricing.plans.basic.feature5"),
                ],
                featured: false,
              },
              {
                name: t("landing.pricing.plans.professional.name"),
                desc: t("landing.pricing.plans.professional.desc"),
                monthlyPrice: t("landing.pricing.plans.professional.monthlyPrice"),
                annualPrice: t("landing.pricing.plans.professional.annualPrice"),
                features: [
                  t("landing.pricing.plans.professional.feature1"),
                  t("landing.pricing.plans.professional.feature2"),
                  t("landing.pricing.plans.professional.feature3"),
                  t("landing.pricing.plans.professional.feature4"),
                  t("landing.pricing.plans.professional.feature5"),
                  t("landing.pricing.plans.professional.feature6"),
                  t("landing.pricing.plans.professional.feature7"),
                ],
                featured: true,
              },
              {
                name: t("landing.pricing.plans.enterprise.name"),
                desc: t("landing.pricing.plans.enterprise.desc"),
                monthlyPrice: t("landing.pricing.plans.enterprise.monthlyPrice"),
                annualPrice: t("landing.pricing.plans.enterprise.annualPrice"),
                features: [
                  t("landing.pricing.plans.enterprise.feature1"),
                  t("landing.pricing.plans.enterprise.feature2"),
                  t("landing.pricing.plans.enterprise.feature3"),
                  t("landing.pricing.plans.enterprise.feature4"),
                  t("landing.pricing.plans.enterprise.feature5"),
                  t("landing.pricing.plans.enterprise.feature6"),
                  t("landing.pricing.plans.enterprise.feature7"),
                  t("landing.pricing.plans.enterprise.feature8"),
                ],
                featured: false,
              },
            ].map((tier, index) => (
              <div
                key={index}
                className={`rounded-3xl p-8 ring-1 ${
                  tier.featured
                    ? "relative bg-gray-900 shadow-2xl ring-2 ring-blue-500/30"
                    : "bg-white dark:bg-gray-800 ring-gray-200 dark:ring-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3
                    id={`tier-${tier.name}`}
                    className={`text-lg/7 font-semibold ${
                      tier.featured ? "text-white" : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {tier.name}
                  </h3>
                  {tier.featured && (
                    <p className="rounded-full bg-blue-600 px-2.5 py-1 text-xs/5 font-semibold text-white">
                      {t("landing.pricing.popular")}
                    </p>
                  )}
                </div>
                <p
                  className={`mt-4 text-sm/6 ${
                    tier.featured ? "text-gray-300" : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {tier.desc}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span
                    className={`text-4xl font-semibold tracking-tight ${
                      tier.featured ? "text-white" : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {annual ? tier.annualPrice : tier.monthlyPrice}
                  </span>
                  <span
                    className={`text-sm/6 font-semibold ${
                      tier.featured ? "text-gray-300" : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    /{annual ? t("landing.pricing.perYear") : t("landing.pricing.perMonth")}
                  </span>
                </p>
                <a
                  href="#"
                  aria-describedby={`tier-${tier.name}`}
                  className={`mt-6 block rounded-full px-3 py-2 text-center text-sm/6 font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    tier.featured
                      ? "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600"
                      : "bg-gray-900 text-white hover:bg-gray-800 focus-visible:outline-gray-900 dark:bg-blue-600 dark:hover:bg-blue-500"
                  }`}
                >
                  {t("landing.pricing.subscribe")}
                </a>
                <ul
                  role="list"
                  className={`mt-8 space-y-3 text-sm/6 ${
                    tier.featured ? "text-gray-300" : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check
                        className={`h-6 w-5 flex-none ${
                          tier.featured ? "text-blue-400" : "text-blue-600"
                        }`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {t("landing.faq.title")}
            </h2>
            <p className="mt-4 text-center text-lg leading-8 text-gray-600 dark:text-gray-300">
              {t("landing.faq.subtitle")}
            </p>
            <dl className="mt-12 space-y-6 divide-y divide-gray-200 dark:divide-white/10">
              {[
                { q: t("landing.faq.q1"), a: t("landing.faq.a1") },
                { q: t("landing.faq.q2"), a: t("landing.faq.a2") },
                { q: t("landing.faq.q3"), a: t("landing.faq.a3") },
                { q: t("landing.faq.q4"), a: t("landing.faq.a4") },
                { q: t("landing.faq.q5"), a: t("landing.faq.a5") },
                { q: t("landing.faq.q6"), a: t("landing.faq.a6") },
                { q: t("landing.faq.q7"), a: t("landing.faq.a7") },
              ].map((faq, index) => (
                <div key={index} className="pt-6">
                  <dt>
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="flex w-full items-start justify-between text-left text-gray-900 dark:text-white"
                    >
                      <span className="text-base font-semibold leading-7">{faq.q}</span>
                      <span className="ml-6 flex h-7 items-center">
                        {openFaq === index ? (
                          <Minus className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Plus className="h-5 w-5 text-gray-400" />
                        )}
                      </span>
                    </button>
                  </dt>
                  {openFaq === index && (
                    <dd className="mt-2 pr-12">
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.2 }}
                        className="text-base leading-7 text-gray-600 dark:text-gray-300"
                      >
                        {faq.a}
                      </motion.div>
                    </dd>
                  )}
                </div>
              ))}
            </dl>

            {/* Bottom CTA */}
            <div className="mt-16 text-center">
              <p className="text-base leading-7 text-gray-600 dark:text-gray-300">
                {t("landing.faq.bottomQuestion")}
              </p>
              <button
                onClick={handleContactSales}
                className="mt-2 font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
              >
                {t("landing.faq.bottomContact")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white dark:bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {t("landing.contact.title")}
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
              {t("landing.contact.subtitle")}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-12 sm:grid-cols-3"
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-base font-semibold text-gray-900 dark:text-white">
                {t("landing.contact.emailLabel")}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {t("landing.contact.emailValue")}
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-base font-semibold text-gray-900 dark:text-white">
                {t("landing.contact.phoneLabel")}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {t("landing.contact.phoneValue")}
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-base font-semibold text-gray-900 dark:text-white">
                {t("landing.contact.officeLabel")}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {t("landing.contact.officeValue")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-black" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">
          {t("landing.footer.footerLabel")}
        </h2>
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <div className="border-b border-white/10 pb-16 sm:pb-20 lg:flex lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {t("landing.footer.heading")}
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                {t("landing.footer.description")}
              </p>
            </div>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row lg:mt-0 lg:flex-shrink-0">
              <button
                onClick={handleGetStarted}
                id="footer-cta-btn"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-950 shadow-sm transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {t("landing.footer.cta")}
              </button>
              <button
                onClick={handleRequestDemo}
                className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {t("landing.footer.ctaDemo")} <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-16 xl:grid xl:grid-cols-3 xl:gap-8">
            <div>
              <Logo variant="onDark" />
              <p className="mt-6 max-w-sm text-sm leading-6 text-gray-400">
                {t("landing.footer.about")}
              </p>
              <div className="mt-8 flex gap-x-6">
                <a
                  href="#"
                  id="footer-social-x"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <span className="sr-only">{t("landing.footer.socialX")}</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="#"
                  id="footer-social-linkedin"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <span className="sr-only">{t("landing.footer.socialLinkedin")}</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  id="footer-social-github"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <span className="sr-only">{t("landing.footer.socialGithub")}</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="#"
                  id="footer-social-email"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <span className="sr-only">{t("landing.footer.socialEmail")}</span>
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
              {footerSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold leading-6 text-white">
                    {section.title}
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {section.links.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          id={`${section.idPrefix}-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                          className="text-sm leading-6 text-gray-400 transition-colors hover:text-white"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
            <p className="text-sm leading-6 text-gray-400">
              &copy; {new Date().getFullYear()} Parkit. {t("landing.footer.rights")}
            </p>
          </div>
        </div>
      </footer>
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        buttonRef={authAnchor === "sign-in" ? signInBtnRef : authAnchor === "request-access" ? requestAccessBtnRef : undefined}
        initialView={authModalView}
      />
    </div>
  );
}
