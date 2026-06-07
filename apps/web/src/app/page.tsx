"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { AuthModal } from "@/components/AuthModal";
import { ArrowRight, Menu, X, Plus, Minus, Check, Mail } from "lucide-react";
import { DeviceMobile, LayoutDashboard, Gauge, ClipboardText, Key, MapPin, Bell } from "@/lib/premiumIcons";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { hyperspeedPresets } from "@/components/effects/hyperspeedPresets";
import dynamic from "next/dynamic";

const Hyperspeed = dynamic(() => import("@/components/effects/Hyperspeed"), { ssr: false });
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { ThemeToggleSimple } from "@/components/ThemeToggleSimple";
import { LocaleToggle } from "@/components/LocaleToggle";
import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "next-themes";

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [annual, setAnnual] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get("auth") === "login"
  );
  const [authModalView, setAuthModalView] = useState<"login">("login");
  const [authAnchor, setAuthAnchor] = useState<"sign-in" | null>(
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get("auth") === "login" ? "sign-in" : null
  );
  const [scrolled, setScrolled] = useState(false);
  const signInBtnRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    setMounted(true);
    if (new URLSearchParams(window.location.search).get("auth") === "login") {
      setAuthModalOpen(true);
      setAuthModalView("login");
      setAuthAnchor("sign-in");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoVariant = mounted && resolvedTheme === "dark" ? "onDark" : "default";

  const handleGetStarted = (plan?: string) => {
    router.push(plan ? `/signup?plan=${plan}` : "/signup");
  };

  const handleRequestDemo = () => {
    router.push("/demo-request");
  };

  const handleContactSales = () => {
    router.push("/contact");
  };

  const navigation = [
    { name: t("landing.nav.services"), href: "#services" },
    { name: t("landing.nav.howItWorks"), href: "#how-it-works" },
    { name: t("landing.nav.pricing"), href: "#pricing" },
    { name: t("landing.nav.faq"), href: "#faq" },
  ];

  const footerSections = [
    {
      title: t("landing.footer.solutions"),
      idPrefix: "footer-solutions",
      links: [
        { name: t("landing.footer.linksValet"), href: "/services/key-management" },
        { name: t("landing.footer.linksAccess"), href: "/services/dashboard" },
        { name: t("landing.footer.linksReports"), href: "/services/mobile-checkin" },
        { name: t("landing.footer.linksApp"), href: "/services/reports" },
      ],
    },
    {
      title: t("landing.footer.support"),
      idPrefix: "footer-support",
      links: [
        { name: t("landing.footer.linksHelp"), href: "#faq" },
        { name: t("landing.footer.linksDocs"), href: "#pricing" },
        { name: t("landing.footer.linksApi"), href: "#pricing" },
        { name: t("landing.footer.linksStatus"), href: "#pricing" },
      ],
    },
    {
      title: t("landing.footer.company"),
      idPrefix: "footer-company",
      links: [
        { name: t("landing.footer.linksAbout"), href: "/about" },
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
        { name: t("landing.footer.linksCookies"), href: "/cookies" },
        { name: t("landing.footer.linksContact"), href: "/contact" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Navbar */}
      <div className="relative min-h-screen bg-gray-900 flex flex-col">
        <div className="absolute inset-0">
          <Hyperspeed effectOptions={hyperspeedPresets.four} />
          <div className="absolute inset-0 bg-gray-900/70 mix-blend-multiply" />
        </div>

        {/* Navbar */}
        <nav
          className="sticky top-0 z-50 transition-all duration-300"
          style={{
            backgroundColor: scrolled ? "rgba(17, 24, 39, 0.85)" : "transparent",
            backdropFilter: scrolled ? "blur(12px)" : "none",
            WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          }}
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
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
              <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-x-4">
                <div className="flex items-center gap-1">
                  <ThemeToggleSimple />
                  <LocaleToggle triggerClassName="!text-white/70 hover:!text-white" />
                </div>
                <button
                  ref={signInBtnRef}
                  onClick={() => { setAuthAnchor("sign-in"); setAuthModalView("login"); setAuthModalOpen(true); }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/80 hover:text-white hover:border-white/40 transition-all"
                >
                  {t("auth.signIn")}
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
                className="fixed inset-x-0 top-0 bg-surface p-6"
              >
                <div className="flex items-center justify-between">
                  <Logo variant={logoVariant} />
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-m-2.5 rounded-full p-2.5 text-text-secondary"
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
                        className="block text-base font-semibold leading-7 text-gray-900 dark:text-white hover:text-company-primary"
                      >
                        {item.name}
                      </a>
                    ))}
                    <div className="pt-4 space-y-3">
                      <button
                        onClick={() => { setAuthAnchor(null); setMobileMenuOpen(false); setAuthModalView("login"); setAuthModalOpen(true); }}
                        className="w-full rounded-full border border-white/30 px-5 py-3 text-base font-semibold text-text-primary hover:bg-surface-hover transition-all"
                      >
                        <span className="flex items-center justify-center gap-2">
                          {t("auth.signIn")}<ArrowRight className="h-4 w-4" />
                        </span>
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
              {t("landing.hero.title")}
              <br />
              <span>{t("landing.hero.subtitle")} </span>
              <TypewriterEffect
                words={t("landing.hero.typewriterWords").split(",").map((w) => ({ text: w.trim(), className: "text-company-primary" }))}
                className="text-company-primary"
                cursorClassName="bg-company-primary"
              />
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
              className="mt-12 flex flex-col sm:flex-row gap-8 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleGetStarted()}
                className="rounded-full bg-white px-8 py-4 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-100 transition-all"
              >
                {t("landing.hero.cta")}
              </motion.button>
              <button
                onClick={handleRequestDemo}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  {t("landing.hero.requestDemoLink")}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>

            </motion.div>

          </motion.div>
        </div>
      </div>

      {/* Services Section — Bizidea mirror */}
      <section id="services" className="bg-surface min-h-screen flex items-center">
        <div className="w-full mx-auto max-w-7xl px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h2 className="text-base/7 font-semibold text-company-primary tracking-wide uppercase">{t("landing.services.title")}</h2>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              {t("landing.services.heading")}
            </p>
            <p className="mt-4 text-base text-text-secondary leading-relaxed">
              {t("landing.services.description")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { href: "/services/key-management", Icon: Key, title: t("landing.services.item1Title"), desc: t("landing.services.item1Desc") },
              { href: "/services/dashboard", Icon: LayoutDashboard, title: t("landing.services.item2Title"), desc: t("landing.services.item2Desc") },
              { href: "/services/mobile-checkin", Icon: DeviceMobile, title: t("landing.services.item3Title"), desc: t("landing.services.item3Desc") },
              { href: "/services/reports", Icon: ClipboardText, title: t("landing.services.item4Title"), desc: t("landing.services.item4Desc") },
            ].map(({ href, Icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group relative flex flex-col rounded-xl bg-page-alt p-8 border border-border-color hover:shadow-lg hover:border-company-primary/20 hover:shadow-company-primary/5 transition-all overflow-hidden"
              >
                <div className="w-14 h-14 rounded-lg bg-company-primary/10 flex items-center justify-center mb-6 group-hover:bg-company-primary/20 transition-colors">
                  <Icon className="text-company-primary" width={28} height={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
                <p className="mt-3 text-sm text-text-secondary leading-relaxed">{desc}</p>
                <Link
                  href={href}
                  className="mt-auto pt-5 inline-flex items-center gap-2 text-sm font-semibold text-company-primary hover:underline group/btn"
                >
                  {t("landing.services.title") === "Services" ? "Read More" : "Leer más"}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mt-16"
          >
            <p className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              {t("landing.cta.heading")}
            </p>
            <p className="mt-3 text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
              {t("landing.ctaBanner.description")}
            </p>
            <button
              onClick={() => handleGetStarted()}
              className="mt-6 rounded-full bg-company-primary px-10 py-4 text-base font-semibold text-white shadow-sm hover:brightness-110 transition-all"
            >
              {t("landing.cta.button")}
            </button>
          </motion.div>
        </div>
      </section>

      {/* How It Works — OnePirate mirror */}
      <section id="how-it-works" className="bg-page-alt overflow-hidden relative min-h-screen">
        <BackgroundBeams />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative flex flex-col items-center pt-20 pb-32 z-10">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-28"
          >
            <h2 className="text-base/7 font-semibold text-company-primary tracking-wide uppercase">{t("landing.howItWorks.title")}</h2>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-text-primary sm:text-5xl">
              {t("landing.howItWorks.heading")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-full grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {[
              { num: "1", stepTitle: t("landing.howItWorks.step1Title"), stepDesc: t("landing.howItWorks.step1Desc"), Icon: DeviceMobile },
              { num: "2", stepTitle: t("landing.howItWorks.step2Title"), stepDesc: t("landing.howItWorks.step2Desc"), Icon: MapPin },
              { num: "3", stepTitle: t("landing.howItWorks.step3Title"), stepDesc: t("landing.howItWorks.step3Desc"), Icon: LayoutDashboard },
              { num: "4", stepTitle: t("landing.howItWorks.step4Title"), stepDesc: t("landing.howItWorks.step4Desc"), Icon: Key },
              { num: "5", stepTitle: t("landing.howItWorks.step5Title"), stepDesc: t("landing.howItWorks.step5Desc"), Icon: Bell },
              { num: "6", stepTitle: t("landing.howItWorks.step6Title"), stepDesc: t("landing.howItWorks.step6Desc"), Icon: Gauge },
            ].map(({ num, stepDesc, Icon }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
                className="flex flex-col items-center text-center px-10"
              >
                <span className="text-2xl font-bold text-company-primary">
                  {num}.
                </span>
                <Icon className="my-8 stroke-current text-text-primary" width={55} height={55} strokeWidth={1.5} />
                <p className="font-light text-text-primary leading-relaxed max-w-xs">
                  {stepDesc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-surface py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <h2 className="text-base/7 font-semibold text-company-primary tracking-wide uppercase">{t("landing.pricing.title")}</h2>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-text-primary sm:text-5xl lg:text-balance">
              {t("landing.pricing.heading")}
            </p>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-center text-lg/8 text-text-secondary"
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
              <div className="relative flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 w-60">
                <div
                  className={`absolute top-1 bottom-1 w-[calc(50%-2px)] rounded-full bg-white dark:bg-gray-700 shadow-md border border-gray-200 dark:border-gray-600 transition-all duration-300 ease-out ${
                    annual ? "left-[calc(50%+1px)]" : "left-1"
                  }`}
                />
                <label className="relative flex-1 cursor-pointer select-none text-center">
                  <input
                    type="radio"
                    name="frequency"
                    value="monthly"
                    checked={!annual}
                    onChange={() => setAnnual(false)}
                    className="sr-only"
                  />
                  <span
                    className={`relative z-10 flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200 ${
                      annual ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {t("landing.pricing.monthly")}
                  </span>
                </label>
                <label className="relative flex-1 cursor-pointer select-none text-center">
                  <input
                    type="radio"
                    name="frequency"
                    value="annually"
                    checked={annual}
                    onChange={() => setAnnual(true)}
                    className="sr-only"
                  />
                  <span
                    className={`relative z-10 flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200 ${
                      annual ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {t("landing.pricing.annual")}
                    {annual && (
                      <span className="ml-1.5 rounded-full bg-company-primary/10 px-2 py-0.5 text-[10px] font-semibold text-company-primary">
                        -16%
                      </span>
                    )}
                  </span>
                </label>
              </div>
            </fieldset>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3"
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
                  t("landing.pricing.plans.basic.feature6"),
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
                className={`relative rounded-2xl border ${
                  tier.featured
                    ? "border-company-primary/30 bg-gradient-to-b from-company-primary/5 to-transparent shadow-xl shadow-company-primary/5 scale-105"
                    : "border-border-color bg-surface hover:shadow-lg hover:border-company-primary/20"
                } transition-all duration-300`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex rounded-full bg-company-primary px-3 py-1 text-xs font-semibold text-white shadow-sm">
                      {t("landing.pricing.popular")}
                    </span>
                  </div>
                )}
                <div className="p-8">
                  <h3
                    id={`tier-${tier.name}`}
                    className={`text-lg font-semibold ${
                      tier.featured ? "text-text-primary" : "text-text-primary"
                    }`}
                  >
                    {tier.name}
                  </h3>
                  <p className={`mt-2 text-sm leading-relaxed ${tier.featured ? "text-text-secondary" : "text-text-secondary"}`}>
                    {tier.desc}
                  </p>
                  <p className="mt-6 flex items-baseline gap-1">
                    <span className={`text-4xl font-bold tracking-tight ${tier.featured ? "text-company-primary" : "text-text-primary"}`}>
                      {annual ? tier.annualPrice : tier.monthlyPrice}
                    </span>
                    <span className="text-sm font-medium text-text-muted">
                      /{annual ? t("landing.pricing.perYear") : t("landing.pricing.perMonth")}
                    </span>
                  </p>
                  <button
                    onClick={() => {
                      const plans = ["basic", "professional", "enterprise"];
                      handleGetStarted(plans[index]);
                    }}
                    className={`mt-6 w-full rounded-full py-2.5 text-sm font-semibold transition-all ${
                      tier.featured
                        ? "bg-company-primary text-white shadow-sm hover:brightness-110"
                        : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700"
                    }`}
                  >
                    {t("landing.pricing.subscribe")}
                  </button>
                </div>
                <div className="border-t border-border-color px-8 py-6">
                  <ul role="list" className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-3 text-sm text-text-secondary">
                        <Check className="h-5 w-5 shrink-0 text-company-primary mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-page-alt">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base/7 font-semibold text-company-primary tracking-wide uppercase">{t("landing.faq.label")}</h2>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              {t("landing.faq.title")}
            </p>
            <p className="mt-4 text-base text-text-secondary">
              {t("landing.faq.subtitle")}
            </p>
            <dl className="mt-12 space-y-6 divide-y divide-card-border">
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
                      className="flex w-full items-start justify-between text-left text-text-primary"
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
                        className="text-base leading-7 text-text-secondary"
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
              <p className="text-base leading-7 text-text-secondary">
                {t("landing.faq.bottomQuestion")}
              </p>
              <button
                onClick={handleContactSales}
                className="mt-2 font-semibold text-company-primary hover:text-company-primary/80"
              >
                {t("landing.faq.bottomContact")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">
          {t("landing.footer.footerLabel")}
        </h2>
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div>
              <Logo variant="onDark" />
              <p className="mt-6 max-w-sm text-sm leading-6 text-gray-400">
                {t("landing.footer.about")}
              </p>
              <div className="mt-8 flex gap-x-6">
                <a
                  href="#"
                  id="footer-social-instagram"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <span className="sr-only">{t("landing.footer.socialInstagram")}</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 0 1 1.772 1.153 4.902 4.902 0 0 1 1.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 0 1-1.153 1.772 4.902 4.902 0 0 1-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 0 1-1.772-1.153 4.902 4.902 0 0 1-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 0 1 1.153-1.772A4.902 4.902 0 0 1 6.38 2.525c.636-.247 1.363-.416 2.427-.465C8.552 2.013 8.907 2 11.38 2h.935zm.02 1.802h-.875c-2.36 0-2.598.009-3.526.051-1.023.047-1.58.21-1.951.348-.488.182-.875.399-1.258.782a3.17 3.17 0 0 0-.782 1.258c-.138.37-.301.928-.348 1.951-.042.928-.051 1.165-.051 3.526v.875c0 2.36.009 2.598.051 3.526.047 1.023.21 1.58.348 1.951.182.488.399.875.782 1.258a3.17 3.17 0 0 0 1.258.782c.37.138.928.301 1.951.348.928.042 1.165.051 3.526.051h.875c2.36 0 2.598-.009 3.526-.051 1.023-.047 1.58-.21 1.951-.348a3.17 3.17 0 0 0 1.258-.782 3.17 3.17 0 0 0 .782-1.258c.138-.37.301-.928.348-1.951.042-.928.051-1.165.051-3.526v-.875c0-2.36-.009-2.598-.051-3.526-.047-1.023-.21-1.58-.348-1.951a3.17 3.17 0 0 0-.782-1.258 3.17 3.17 0 0 0-1.258-.782c-.37-.138-.928-.301-1.951-.348-.928-.042-1.165-.051-3.526-.051zm0 1.802a6.398 6.398 0 1 0 0 12.796 6.398 6.398 0 0 0 0-12.796zm0 10.994a4.596 4.596 0 1 1 0-9.192 4.596 4.596 0 0 1 0 9.192zM17.164 4.85a1.496 1.496 0 1 0 0 2.992 1.496 1.496 0 0 0 0-2.992z" />
                  </svg>
                </a>
                <a
                  href="#"
                  id="footer-social-tiktok"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <span className="sr-only">{t("landing.footer.socialTikTok")}</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-sm leading-6 text-gray-400">
                &copy; {new Date().getFullYear()} Parkit. {t("landing.footer.rights")}
              </p>
              <p className="text-xs leading-5 text-gray-500">
                Powered by{" "}
                <a
                  href="https://triacr.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gray-400 transition-colors hover:text-white"
                >
                  Tria
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
      <AuthModal
        open={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          if (typeof window !== 'undefined' && window.location.search.includes('auth=')) {
            window.history.replaceState({}, '', '/');
          }
        }}
        buttonRef={authAnchor === "sign-in" ? signInBtnRef : undefined}
        initialView={authModalView}
      />
    </div>
  );
}
