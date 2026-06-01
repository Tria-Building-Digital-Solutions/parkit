"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { apiClient, getApiErrorMessage, getTranslatedApiErrorMessage } from "@/lib/api";
import { useAuthStore, useLocaleStore, useDashboardStore } from "@/lib/store";
import { isSuperAdmin } from "@/lib/auth";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowRight, Eye, EyeOff, GoogleIcon, FacebookIcon, MicrosoftIcon, ArrowLeft, CheckCircle, Mail, Building2, User } from "@/lib/premiumIcons";
import { LoadingSpinner } from "@/components/LoadingSpinner";

type AuthView = "login" | "forgot-password" | "request-access";
type AuthAnchorRef = React.RefObject<HTMLElement | null>;

export function AuthModal({ open, onClose, buttonRef, initialView }: { open: boolean; onClose: () => void; buttonRef?: AuthAnchorRef; initialView?: AuthView }) {
  return open && typeof document !== "undefined"
    ? createPortal(<AuthModalInner onClose={onClose} buttonRef={buttonRef} initialView={initialView} />, document.body)
    : null;
}

function AuthModalInner({ onClose, buttonRef, initialView }: { onClose: () => void; buttonRef?: AuthAnchorRef; initialView?: AuthView }) {
  const [view, setView] = useState<AuthView>(initialView ?? "login");
  const [pos, setPos] = useState<{ top: number; left: number; width: number; anchorLeft: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setView(initialView ?? "login");
  }, [initialView]);

  useEffect(() => {
    const updatePos = () => {
      const viewportWidth = window.innerWidth;
      const mobile = viewportWidth < 768;
      setIsMobile(mobile);

      if (!mobile && buttonRef?.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const gutter = 16;
        const preferredWidth = view === "request-access" ? 460 : 420;
        const width = Math.min(preferredWidth, viewportWidth - gutter * 2);
        const anchorCenter = rect.left + rect.width / 2;
        const left = Math.min(
          Math.max(anchorCenter - width / 2, gutter),
          viewportWidth - width - gutter,
        );
        setPos({
          top: rect.bottom + 12,
          left,
          width,
          anchorLeft: anchorCenter - left,
        });
      } else {
        setPos(null);
      }
    };
    updatePos();
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    return () => {
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [buttonRef, view]);

  const anchored = !isMobile && Boolean(pos);

  return (
    <div className="fixed inset-0 z-[99999]" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]" onClick={onClose} />
      <div
        className={anchored ? "absolute" : "absolute inset-0 flex items-center justify-center p-4"}
        style={anchored && pos ? { top: pos.top, left: pos.left, width: pos.width } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {anchored && pos && (
          <span
            className="absolute -top-2 h-4 w-4 rotate-45 rounded-[3px] border-l border-t border-white/70 bg-white dark:border-slate-700 dark:bg-slate-900"
            style={{ left: pos.anchorLeft - 8 }}
            aria-hidden
          />
        )}
        <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/70 dark:border-slate-700 shadow-[0_24px_80px_rgba(15,23,42,0.24),0_8px_24px_rgba(15,23,42,0.12)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.55)] w-full max-w-[calc(100vw-2rem)] max-h-[min(82vh,720px)] overflow-y-auto">
          <div className="relative p-6 md:p-8">
            <button type="button" onClick={onClose} className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                {view === "login" && <LoginView onSwitch={setView} />}
                {view === "forgot-password" && <ForgotPasswordView onSwitch={setView} />}
                {view === "request-access" && <RequestAccessView onSwitch={setView} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginView({ onSwitch }: { onSwitch: (v: AuthView) => void }) {
  const { setTheme } = useTheme();
  const { t } = useTranslation();
  const { login, setError, error } = useAuthStore();
  const setLocale = useLocaleStore((s) => s.setLocale);
  const setCompanyBranding = useDashboardStore((s) => s.setCompanyBranding);
  const setBrandingInCache = useDashboardStore((s) => s.setBrandingInCache);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/auth/${provider}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await apiClient.post<{
        user: {
          id: string;
          email: string;
          firstName: string;
          lastName: string;
          systemRole: "SUPER_ADMIN" | "ADMIN" | "STAFF" | "CUSTOMER";
          companyId?: string;
          appPreferences?: { theme?: "light" | "dark"; locale?: "es" | "en" };
        };
        token: string;
      }>("/auth/login", formData);
      if (response) {
        login(response.user, response.token);
        apiClient.setToken(response.token);
        const prefs = response.user.appPreferences;
        const detectDeviceTheme = (): "light" | "dark" => {
          if (typeof window !== "undefined" && "matchMedia" in window) {
            try { return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; } catch { /* ignore */ }
          }
          const rt = undefined;
          return rt === "dark" ? "dark" : "light";
        };
        const detectDeviceLocale = (): "es" | "en" => {
          if (typeof navigator !== "undefined") {
            const lang = (navigator.language || navigator.languages?.[0] || "es").toLowerCase();
            if (lang.startsWith("en")) return "en";
          }
          return "es";
        };
        const finalTheme: "light" | "dark" = prefs?.theme ?? detectDeviceTheme();
        const finalLocale: "es" | "en" = prefs?.locale ?? detectDeviceLocale();
        setTheme(finalTheme);
        setLocale(finalLocale);
        apiClient.patch("/users/me", { appPreferences: { theme: finalTheme, locale: finalLocale } }).catch(() => {});
        const superAdminUser = isSuperAdmin(response.user);
        const selectedId = typeof window !== "undefined" ? localStorage.getItem("parkit_selected_company_id") : null;
        let hasCompanies = true;
        if (superAdminUser && !selectedId) {
          try { const companiesData = await apiClient.get<{ id: string }[]>("/companies"); hasCompanies = Array.isArray(companiesData) && companiesData.length > 0; } catch { hasCompanies = true; }
        }
        try {
          if (superAdminUser && selectedId) {
            const data = await apiClient.get<{ brandingConfig?: Record<string, string | null | undefined> | null }>(`/companies/${selectedId}/branding`);
            const bc = data?.brandingConfig && typeof data.brandingConfig === "object" ? data.brandingConfig : null;
            const branding = bc ? {
              bannerImageUrl: bc.bannerImageUrl ?? null, logoImageUrl: bc.logoImageUrl ?? null,
              primaryColor: bc.primaryColor ?? null, primaryColorDark: bc.primaryColorDark ?? null,
              secondaryColor: bc.secondaryColor ?? null, secondaryColorDark: bc.secondaryColorDark ?? null,
              tertiaryColor: bc.tertiaryColor ?? null, tertiaryColorDark: bc.tertiaryColorDark ?? null,
              businessActivity: bc.businessActivity ?? null,
            } : null;
            setCompanyBranding(branding);
            if (branding) setBrandingInCache(selectedId, branding);
          } else if (!superAdminUser) {
            const data = await apiClient.get<{ brandingConfig?: Record<string, string | null | undefined> | null }>("/companies/me/branding");
            const bc = data?.brandingConfig && typeof data.brandingConfig === "object" ? data.brandingConfig : null;
            const branding = bc ? {
              bannerImageUrl: bc.bannerImageUrl ?? null, logoImageUrl: bc.logoImageUrl ?? null,
              primaryColor: bc.primaryColor ?? null, primaryColorDark: bc.primaryColorDark ?? null,
              secondaryColor: bc.secondaryColor ?? null, secondaryColorDark: bc.secondaryColorDark ?? null,
              tertiaryColor: bc.tertiaryColor ?? null, tertiaryColorDark: bc.tertiaryColorDark ?? null,
              businessActivity: bc.businessActivity ?? null,
            } : null;
            setCompanyBranding(branding);
          } else { setCompanyBranding(null); }
        } catch { setCompanyBranding(null); }
        if (superAdminUser && !selectedId && !hasCompanies) {
          window.location.href = "/no-companies";
        } else {
          window.location.href = "/dashboard";
        }
        return;
      }
    } catch (err: unknown) {
      const raw = getApiErrorMessage(err);
      if (raw === "USER_INACTIVE") { setError(t("auth.errorUserInactive")); }
      else if (raw === "COMPANY_INACTIVE") { setError(t("auth.errorCompanyInactive")); }
      else { setError(getTranslatedApiErrorMessage(err, t)); }
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <div className="flex flex-col items-center mb-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">{t("auth.signInToContinue")}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="modal-email" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t("auth.email")}</label>
          <input id="modal-email" name="email" type="email" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} required autoComplete="email" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white text-sm transition-all duration-200 ease-out focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:ring-inset placeholder:text-slate-400 dark:placeholder:text-slate-500" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="modal-password" className="block text-sm font-medium text-slate-600 dark:text-slate-400">{t("auth.password")}</label>
            <button type="button" onClick={() => onSwitch("forgot-password")} className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">{t("auth.forgotPassword")}</button>
          </div>
          <div className="relative">
            <input id="modal-password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))} required autoComplete="current-password" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-4 pr-10 text-slate-900 dark:text-white text-sm transition-all duration-200 ease-out focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:ring-inset placeholder:text-slate-400 dark:placeholder:text-slate-500" />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={isSubmitting} className="group w-full flex items-center justify-center gap-2 rounded-full bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none transition-all">
          {isSubmitting ? <LoadingSpinner size="sm" variant="white" /> : <>{t("auth.signIn")}<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></>}
        </button>
        {error && <p className="text-xs text-red-600 dark:text-red-400 text-center">{error}</p>}
      </form>
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700" /></div>
        <div className="relative flex justify-center text-xs"><span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">{t("auth.orContinueWith")}</span></div>
      </div>
      <div className="flex items-center justify-center gap-3">
        <button type="button" onClick={() => handleOAuthLogin("google")} className="flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all h-10 w-10" title={t("auth.continueWithGoogle")}><GoogleIcon className="h-5 w-5 text-red-500" /></button>
        <button type="button" onClick={() => handleOAuthLogin("microsoft")} className="flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all h-10 w-10" title={t("auth.continueWithMicrosoft")}><MicrosoftIcon className="h-5 w-5 text-blue-600" /></button>
        <button type="button" onClick={() => handleOAuthLogin("facebook")} className="flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all h-10 w-10" title={t("auth.continueWithFacebook")}><FacebookIcon className="h-5 w-5 text-blue-600" /></button>
      </div>
      <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">{t("auth.dontHaveAccount")} <button type="button" onClick={() => onSwitch("request-access")} className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline-offset-2 hover:underline transition-colors">{t("auth.requestAccess")}</button></p>
      </div>
    </div>
  );
}

function ForgotPasswordView({ onSwitch }: { onSwitch: (v: AuthView) => void }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) return;
    setIsSubmitting(true);
    try { await apiClient.post("/auth/forgot-password", { email: email.trim() }); setSubmitted(true); }
    catch (err: unknown) { setError(getTranslatedApiErrorMessage(err, t) || t("apiErrors.requestFailed")); }
    setIsSubmitting(false);
  };

  return (
    <div>
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{t("auth.resetPasswordTitle")}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 text-center">{submitted ? t("auth.resetSubmittedMessage").replace("{{email}}", email) : t("auth.resetPasswordDescription")}</p>
      </div>
      {submitted ? (
        <div className="flex justify-center">
          <button type="button" onClick={() => onSwitch("login")} className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            <ArrowLeft className="h-4 w-4" />{t("auth.backToSignIn")}
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="modal-fp-email" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t("auth.email")}</label>
              <input id="modal-fp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white text-sm transition-all duration-200 ease-out focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:ring-inset placeholder:text-slate-400 dark:placeholder:text-slate-500" />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 rounded-full bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none transition-all">
              {isSubmitting ? <LoadingSpinner size="sm" variant="white" /> : t("auth.sendResetLink")}
            </button>
            {error && <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400" role="alert">{error}</div>}
          </form>
          <button type="button" onClick={() => onSwitch("login")} className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors mx-auto">
            <ArrowLeft className="h-4 w-4" />{t("auth.backToSignIn")}
          </button>
        </>
      )}
    </div>
  );
}

function RequestAccessView({ onSwitch }: { onSwitch: (v: AuthView) => void }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!formData.name.trim() || !formData.email.trim() || !formData.company.trim()) { setError(t("auth.requiredFields")); return; }
    setIsSubmitting(true);
    try { await fetch("/api/request-access", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) }); setSuccess(true); }
    catch { setError(t("common.error")); }
    finally { setIsSubmitting(false); }
  };

  if (success) {
    return (
      <div className="text-center">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4"><CheckCircle className="w-7 h-7" /></span>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t("auth.requestAccessSuccess")}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{t("auth.requestAccessSuccessDescription")}</p>
        <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`} className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"><Mail className="w-4 h-4" />{t("auth.contactSupport")}</a>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center mb-6">
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">{t("auth.requestAccessDescription")}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="modal-ra-name" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t("auth.name")}</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input id="modal-ra-name" name="name" type="text" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} required className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm transition-all duration-200 ease-out focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:ring-inset placeholder:text-slate-400 dark:placeholder:text-slate-500" placeholder={t("auth.namePlaceholder")} />
          </div>
        </div>
        <div>
          <label htmlFor="modal-ra-email" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t("auth.email")}</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input id="modal-ra-email" name="email" type="email" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} required className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm transition-all duration-200 ease-out focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:ring-inset placeholder:text-slate-400 dark:placeholder:text-slate-500" placeholder={t("auth.emailPlaceholder")} />
          </div>
        </div>
        <div>
          <label htmlFor="modal-ra-company" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t("auth.company")}</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input id="modal-ra-company" name="company" type="text" value={formData.company} onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))} required className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm transition-all duration-200 ease-out focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:ring-inset placeholder:text-slate-400 dark:placeholder:text-slate-500" placeholder={t("auth.companyPlaceholder")} />
          </div>
        </div>
        <div>
          <label htmlFor="modal-ra-message" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t("auth.message")}</label>
          <textarea id="modal-ra-message" name="message" value={formData.message} onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm transition-all duration-200 ease-out focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:ring-inset placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none" placeholder={t("auth.messagePlaceholder")} />
        </div>
        <button type="submit" disabled={isSubmitting} className="group w-full flex items-center justify-center gap-2 rounded-full bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none transition-all">
          {isSubmitting ? <LoadingSpinner size="sm" variant="white" /> : <>{t("auth.sendRequest")}<ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" /></>}
        </button>
        {error && <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400" role="alert">{error}</div>}
        <p className="text-center">
          <button type="button" onClick={() => onSwitch("login")} className="group text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1">
            {t("auth.backToSignIn")}<ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </p>
      </form>
    </div>
  );
}
