"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Eye, EyeOff } from "lucide-react";
import { ThemeToggleSimple } from "@/components/ThemeToggleSimple";
import { LocaleToggle } from "@/components/LocaleToggle";
import PricingCarousel from "@/components/ui/carousel";
import { MicrosoftIcon, FacebookIcon } from "@/lib/premiumIcons";
import { useTranslation } from "@/hooks/useTranslation";
import { INPUT_CLASSES, BUTTON_CLASSES, LABEL_CLASSES } from "@/lib/utils";

const BackgroundBeams = dynamic(() => import("@/components/ui/background-beams").then((m) => m.BackgroundBeams), { ssr: false });

const PLANS = ["basic", "professional", "enterprise"] as const;
type Plan = (typeof PLANS)[number];

const PLAN_FEATURES: Record<Plan, number> = { basic: 6, professional: 7, enterprise: 8 };

const getPlanData = (plan: Plan, t: (key: string) => string, annual: boolean) => ({
  name: plan === "basic" ? t("landing.pricing.plans.basic.name") : plan === "professional" ? t("landing.pricing.plans.professional.name") : t("landing.pricing.plans.enterprise.name"),
  price: plan === "basic" ? (annual ? t("landing.pricing.plans.basic.annualPrice") : t("landing.pricing.plans.basic.monthlyPrice")) : plan === "professional" ? (annual ? t("landing.pricing.plans.professional.annualPrice") : t("landing.pricing.plans.professional.monthlyPrice")) : (annual ? t("landing.pricing.plans.enterprise.annualPrice") : t("landing.pricing.plans.enterprise.monthlyPrice")),
  features: Array.from({ length: PLAN_FEATURES[plan] }, (_, i) =>
    t(`landing.pricing.plans.${plan}.feature${i + 1}`)
  ),
  featured: plan === "professional",
});

const INPUT = INPUT_CLASSES;

const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function SignupForm() {
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const preselectedPlan = searchParams.get("plan") as Plan | null;
  const validPlan = preselectedPlan && PLANS.includes(preselectedPlan) ? preselectedPlan : null;

  const [formData, setFormData] = useState({ name: "", company: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(validPlan);
  const [annual, setAnnual] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/auth/${provider}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, plan: selectedPlan }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface relative overflow-hidden flex items-center justify-center">
        <BackgroundBeams />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-5">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary">{t("landing.signup.formSuccess")}</h2>
          <p className="mt-2 text-sm text-text-secondary">{t("landing.signup.formSuccessDesc")}</p>
        </motion.div>
      </div>
    );
  }

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

      <section className="relative z-10 min-h-dvh flex pt-24">
        <div className="w-full mx-auto max-w-7xl px-4 lg:px-6 flex-1 min-h-0 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left — Value Proposition + Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-company-primary/10 dark:bg-company-primary/5 blur-3xl pointer-events-none" />
              <div className="absolute top-40 -right-10 w-48 h-48 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl pointer-events-none" />

              <div className="relative pt-6 md:pt-8">
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary leading-[1.1]">
                    {t("landing.signup.title")}
                  </h1>
                  <p className="mt-3 text-lg text-text-secondary leading-relaxed max-w-sm">
                    {t("landing.signup.subtitle")}
                  </p>
                </div>

                <div className="mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-semibold text-text-primary">{t("landing.signup.planLabel")}</p>
                      <div className="flex rounded-xl border border-border-color/60 p-0.5 bg-white/50 dark:bg-white/5">
                        <button
                          onClick={() => setAnnual(false)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                            !annual
                              ? "bg-white dark:bg-white/10 shadow-sm text-text-primary"
                              : "text-text-muted hover:text-text-secondary"
                          }`}
                        >
                          {t("landing.signup.monthly")}
                        </button>
                        <button
                          onClick={() => setAnnual(true)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-1 ${
                            annual
                              ? "bg-white dark:bg-white/10 shadow-sm text-text-primary"
                              : "text-text-muted hover:text-text-secondary"
                          }`}
                        >
                          {t("landing.signup.annual")}
                          {annual && (
                            <span className="rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-1 py-0.5 text-[8px] font-bold">
                              -20%
                            </span>
                          )}
                        </button>
                      </div>
                    </div>

                    <PricingCarousel
                      slides={PLANS.map((plan) => ({
                        name: getPlanData(plan, t, annual).name,
                        monthlyPrice: getPlanData(plan, t, false).price,
                        annualPrice: getPlanData(plan, t, true).price,
                        features: getPlanData(plan, t, annual).features,
                        featured: plan === "professional",
                      }))}
                      selectedIndex={selectedPlan ? PLANS.indexOf(selectedPlan) : null}
                      onSelect={(i) => setSelectedPlan(PLANS[i] ?? null)}
                      annual={annual}
                      saveLabel={t("landing.signup.savePercent")}
                      selectLabel={t("landing.signup.select")}
                      selectedLabel={t("landing.signup.selected")}
                    />
                    {selectedPlan ? (
                      <div className="mt-4 flex items-center gap-2 rounded-xl bg-company-primary/5 border border-company-primary/15 px-4 py-2.5 text-sm">
                        <Check className="w-4 h-4 text-company-primary shrink-0" />
                        <span className="text-text-secondary">
                          {t("landing.signup.planLabel")}:{" "}
                          <span className="font-semibold text-text-primary">
                            {getPlanData(selectedPlan, t, annual).name}
                          </span>
                          <span className="text-text-muted mx-1">&middot;</span>
                          <span className="font-medium text-company-primary">
                            {getPlanData(selectedPlan, t, annual).price}
                            <span className="text-text-muted text-xs">/{annual ? "yr" : "mo"}</span>
                          </span>
                        </span>
                      </div>
                    ) : (
                      <div className="mt-4 rounded-xl border border-dashed border-border-color/50 px-4 py-3 text-center text-sm text-text-muted">
                        {t("landing.signup.selectPlanHint")}
                      </div>
                    )}
                  </div>

              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="rounded-2xl border border-card-border/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-8 md:p-10 shadow-xl shadow-company-primary/[0.02]">

                <motion.form
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <motion.div variants={staggerItem}>
                    <label htmlFor="signup-name" className={LABEL_CLASSES}>
                      {t("landing.signup.formName")}
                    </label>
                    <input
                      id="signup-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      required
                      autoComplete="name"
                      placeholder={t("landing.signup.formNamePlaceholder")}
                      className={INPUT}
                    />
                  </motion.div>
                  <motion.div variants={staggerItem}>
                    <label htmlFor="signup-company" className={LABEL_CLASSES}>
                      {t("landing.signup.formCompany")}
                    </label>
                    <input
                      id="signup-company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
                      required
                      autoComplete="organization"
                      placeholder={t("landing.signup.formCompanyPlaceholder")}
                      className={INPUT}
                    />
                  </motion.div>
                  <motion.div variants={staggerItem}>
                    <label htmlFor="signup-email" className={LABEL_CLASSES}>
                      {t("landing.signup.formEmail")}
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                      required
                      autoComplete="email"
                      className={INPUT}
                    />
                  </motion.div>
                  <motion.div variants={staggerItem}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="signup-password" className="text-sm font-medium text-text-primary">
                        {t("landing.signup.formPassword")}
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                        required
                        minLength={8}
                        autoComplete="new-password"
                        className={`${INPUT} pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted/60 hover:text-text-secondary transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </motion.div>
                  {error && (
                    <motion.div variants={staggerItem}>
                      <div className="rounded-xl border border-red-500/15 bg-red-500/5 px-4 py-3 text-sm text-red-600 dark:text-red-400" role="alert">
                        {error}
                      </div>
                    </motion.div>
                  )}
                  <motion.button
                    variants={staggerItem}
                    type="submit"
                    className={`${BUTTON_CLASSES} group flex items-center justify-center`}
                  >
                    {t("landing.signup.formSubmit")}
                  </motion.button>
                </motion.form>

                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border-color/50" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white/60 dark:bg-slate-900/60 px-2 text-text-muted">
                      {t("landing.signup.or")}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleOAuthLogin("google")}
                    className="flex items-center justify-center gap-2.5 w-full rounded-xl border border-border-color/60 bg-white/80 dark:bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-text-primary transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 backdrop-blur-sm"
                  >
                    <GoogleIcon className="w-5 h-5" />
                    {t("landing.signup.continueWithGoogle")}
                  </button>
                  <button
                    onClick={() => handleOAuthLogin("microsoft")}
                    className="flex items-center justify-center gap-2.5 w-full rounded-xl border border-border-color/60 bg-white/80 dark:bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-text-primary transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 backdrop-blur-sm"
                  >
                    <MicrosoftIcon className="w-5 h-5" />
                    {t("landing.signup.continueWithMicrosoft")}
                  </button>
                  <button
                    onClick={() => handleOAuthLogin("facebook")}
                    className="flex items-center justify-center gap-2.5 w-full rounded-xl border border-border-color/60 bg-white/80 dark:bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-text-primary transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 backdrop-blur-sm"
                  >
                    <FacebookIcon className="w-5 h-5" />
                    {t("landing.signup.continueWithFacebook")}
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-border-color/50 text-center">
                  <p className="text-sm text-text-secondary">
                    {t("landing.signup.alreadyAccount")}{" "}
                    <Link
                      href="/?auth=login"
                      className="font-semibold text-company-primary hover:text-company-primary/80 transition-colors"
                    >
                      {t("landing.signup.signIn")}
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
