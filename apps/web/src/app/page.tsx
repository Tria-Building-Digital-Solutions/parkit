"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthModal } from "@/components/AuthModal";
import { ArrowRight, Menu, X, Plus, Minus, Check, Mail } from "lucide-react";
import { DeviceMobile, LayoutDashboard, Gauge, Briefcase, CalendarEvent, Receipt, Award, ParkingCircle, CarGarage, TrendingUp } from "@/lib/premiumIcons";
import Hyperspeed from "@/components/effects/Hyperspeed";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { hyperspeedPresets } from "@/components/effects/hyperspeedPresets";
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
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<"login" | "request-access">("login");
  const [authAnchor, setAuthAnchor] = useState<"sign-in" | "request-access" | null>(null);
  const [aboutTab, setAboutTab] = useState<"mission" | "vision">("mission");
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

  const handleContactSales = () => {
    router.push("/contact");
  };

  const navigation = [
    { name: t("landing.nav.features"), href: "#about" },
    { name: t("landing.nav.solutions"), href: "#services" },
    { name: t("landing.nav.pricing"), href: "#pricing" },
    { name: t("landing.nav.faq"), href: "#faq" },
  ];

  const footerSections = [
    {
      title: t("landing.footer.solutions"),
      idPrefix: "footer-solutions",
      links: [
        { name: t("landing.footer.linksValet"), href: "#pricing" },
        { name: t("landing.footer.linksAccess"), href: "#pricing" },
        { name: t("landing.footer.linksReports"), href: "#pricing" },
        { name: t("landing.footer.linksApp"), href: "#pricing" },
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
        { name: t("landing.footer.linksAbout"), href: "#pricing" },
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
                        className="w-full rounded-full bg-white px-5 py-3 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-100 transition-all"
                      >
                        <span className="flex items-center justify-center gap-2">
                          {t("auth.signIn")}<ArrowRight className="h-4 w-4" />
                        </span>
                      </button>
                      <button
                        onClick={() => { setAuthAnchor(null); setMobileMenuOpen(false); setAuthModalView("request-access"); setAuthModalOpen(true); }}
                        className="w-full rounded-full border border-white/30 px-5 py-3 text-base font-semibold text-text-primary hover:bg-surface-hover transition-all"
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
              <span className="text-company-primary">{t("landing.hero.subtitle")}</span>
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

            </motion.div>

          </motion.div>
        </div>
      </div>

      {/* About Section — Bizidea mirror */}
      <section id="about" className="bg-surface py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left — Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-2xl bg-gradient-to-br from-company-primary/20 to-company-primary/5 p-8 flex items-center justify-center aspect-[4/3]">
                <ParkingCircle className="text-company-primary/30" width={180} height={180} strokeWidth={1} />
              </div>
            </motion.div>

            {/* Right — Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-base/7 font-semibold text-company-primary tracking-wide uppercase">{t("landing.about.title")}</h2>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
                {t("landing.about.heading")}
              </p>
              <p className="mt-5 text-base text-text-secondary leading-relaxed">
                {t("landing.about.description")}
              </p>

              {/* Tabs */}
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

                <AnimatePresence mode="wait">
                  <motion.div
                    key={aboutTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mt-6"
                  >
                    <p className="text-text-secondary leading-relaxed text-sm">
                      {aboutTab === "mission"
                        ? "Our mission is to transform valet parking operations worldwide through innovative technology, eliminating manual processes and delivering real-time visibility."
                        : "Our vision is to become the global standard in valet parking technology, empowering operators with AI-driven insights and seamless automation."}
                    </p>
                    <ul className="mt-5 space-y-3">
                      {(aboutTab === "mission"
                        ? [t("landing.about.missionItem1"), t("landing.about.missionItem2"), t("landing.about.missionItem3")]
                        : [t("landing.about.visionItem1"), t("landing.about.visionItem2"), t("landing.about.visionItem3")]
                      ).map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-text-secondary">
                          <Check className="h-4 w-4 shrink-0 text-company-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={handleRequestDemo}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-company-primary hover:underline"
                    >
                      {t("landing.about.seeMore")}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section — Bizidea mirror */}
      <section className="bg-page-alt py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: t("landing.about.stat1Value"), label: t("landing.about.stat1") },
              { value: t("landing.about.stat2Value"), label: t("landing.about.stat2") },
              { value: t("landing.about.stat3Value"), label: t("landing.about.stat3") },
              { value: t("landing.about.stat4Value"), label: t("landing.about.stat4") },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="text-center py-6"
              >
                <p className="text-4xl font-bold text-company-primary">{stat.value}</p>
                <p className="mt-2 text-sm font-medium text-text-secondary">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section — Bizidea mirror */}
      <section id="services" className="bg-surface py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-base/7 font-semibold text-company-primary tracking-wide uppercase">{t("landing.services.title")}</h2>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              {t("landing.services.heading")}
            </p>
            <p className="mt-4 text-base text-text-secondary leading-relaxed">
              {t("landing.services.description")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { Icon: Briefcase, title: t("landing.services.item1Title"), desc: t("landing.services.item1Desc") },
              { Icon: CalendarEvent, title: t("landing.services.item2Title"), desc: t("landing.services.item2Desc") },
              { Icon: Receipt, title: t("landing.services.item3Title"), desc: t("landing.services.item3Desc") },
              { Icon: Award, title: t("landing.services.item4Title"), desc: t("landing.services.item4Desc") },
            ].map(({ Icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group rounded-xl bg-page-alt p-8 border border-border-color hover:shadow-lg hover:border-company-primary/20 transition-all"
              >
                <div className="w-14 h-14 rounded-lg bg-company-primary/10 flex items-center justify-center mb-6 group-hover:bg-company-primary/20 transition-colors">
                  <Icon className="text-company-primary" width={28} height={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
                <p className="mt-3 text-sm text-text-secondary leading-relaxed">{desc}</p>
                <button className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-company-primary hover:underline group/btn">
                  {t("landing.services.title") === "Services" ? "Read More" : "Leer más"}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — OnePirate mirror */}
      <section id="how-it-works" className="bg-page-alt overflow-hidden relative">
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
              { num: "2", stepTitle: t("landing.howItWorks.step2Title"), stepDesc: t("landing.howItWorks.step2Desc"), Icon: LayoutDashboard },
              { num: "3", stepTitle: t("landing.howItWorks.step3Title"), stepDesc: t("landing.howItWorks.step3Desc"), Icon: Gauge },
            ].map(({ num, stepTitle, stepDesc, Icon }, i) => (
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
              <div className="grid grid-cols-2 gap-x-1 rounded-full bg-gray-950/5 dark:bg-white/10 p-1 text-center text-xs/5 font-semibold text-text-muted">
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
                    ? "relative bg-gray-900 shadow-2xl ring-2 ring-company-primary/30"
                    : "bg-surface ring-gray-200 dark:ring-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3
                    id={`tier-${tier.name}`}
                    className={`text-lg/7 font-semibold ${
                      tier.featured ? "text-white" : "text-text-primary"
                    }`}
                  >
                    {tier.name}
                  </h3>
                  {tier.featured && (
                    <p className="rounded-full bg-company-primary px-2.5 py-1 text-xs/5 font-semibold text-white">
                      {t("landing.pricing.popular")}
                    </p>
                  )}
                </div>
                <p
                  className={`mt-4 text-sm/6 ${
                    tier.featured ? "text-gray-300" : "text-text-secondary"
                  }`}
                >
                  {tier.desc}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span
                    className={`text-4xl font-semibold tracking-tight ${
                      tier.featured ? "text-white" : "text-text-primary"
                    }`}
                  >
                    {annual ? tier.annualPrice : tier.monthlyPrice}
                  </span>
                  <span
                    className={`text-sm/6 font-semibold ${
                      tier.featured ? "text-gray-300" : "text-text-secondary"
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
                      ? "bg-company-primary text-white hover:brightness-110 focus-visible:outline-company-primary"
                      : "bg-gray-900 text-white hover:bg-gray-800 focus-visible:outline-gray-900 dark:bg-company-primary dark:hover:brightness-110"
                  }`}
                >
                  {t("landing.pricing.subscribe")}
                </a>
                <ul
                  role="list"
                  className={`mt-8 space-y-3 text-sm/6 ${
                    tier.featured ? "text-gray-300" : "text-text-secondary"
                  }`}
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check
                        className={`h-6 w-5 flex-none ${
                          tier.featured ? "text-company-primary" : "text-company-primary"
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

      {/* CTA Section — Bizidea mirror */}
      <section className="bg-page-alt py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              {t("landing.cta.heading")}
            </p>
            <p className="mt-6 text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
              {t("landing.ctaBanner.description")}
            </p>
            <button
              onClick={handleRequestDemo}
              className="mt-10 rounded-full bg-company-primary px-10 py-4 text-base font-semibold text-white shadow-sm hover:brightness-110 transition-all"
            >
              {t("landing.cta.button")}
            </button>
          </motion.div>
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
