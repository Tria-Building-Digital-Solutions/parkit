"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuthStore, useDashboardStore } from "@/lib/store";
import { isSuperAdmin, isAdmin } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { getIndustryIcon } from "@/lib/companyIcons";
import { apiClient } from "@/lib/api";
import { useTranslation } from "@/hooks/useTranslation";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Key,
  Car,
  ParkingCircle,
  CalendarEvent,
  TicketCheck,
  Bell,
  Settings,
  SidebarCollapse,
  SidebarExpand,
  ChevronRight,
  ChevronDown,
  Building,
} from "@/lib/premiumIcons";

function SidebarTooltip({
  show,
  label,
  children,
}: {
  show: boolean;
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPosition({
        top: rect.top + rect.height / 2,
        left: rect.right + 10,
      });
    }
  };

  const handleMouseEnter = () => {
    if (show && label) {
      updatePosition();
      setVisible(true);
    }
  };

  const handleMouseLeave = () => setVisible(false);

  const tooltipEl =
    visible &&
    show &&
    label &&
    typeof document !== "undefined" &&
    createPortal(
      <div
        className="fixed z-[99999] px-3 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-700 rounded-lg shadow-xl border border-slate-700/50 dark:border-slate-600/50 whitespace-nowrap pointer-events-none transition-opacity duration-150"
        style={{
          left: position.left,
          top: position.top,
          transform: "translateY(-50%)",
        }}
      >
        {label}
        <span
          className="absolute top-1/2 w-0 h-0 -translate-y-1/2 border-[6px] border-transparent border-r-slate-800 dark:border-r-slate-700"
          style={{ right: "100%" }}
          aria-hidden
        />
      </div>,
      document.body
    );

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-full"
    >
      {children}
      {tooltipEl}
    </div>
  );
}

function CompanySelector({
  companies,
  selectedCompanyId,
  selectedCompanyName,
  onSelect,
  placeholder,
  allCompaniesLabel,
  emptyLabel,
  isDark = false,
  logoImageUrl,
  hideAvatar = false,
  highContrast = false,
  companyColors,
}: {
  companies: { id: string; commercialName?: string; legalName?: string; requiresCustomerApp?: boolean }[];
  selectedCompanyId: string | null;
  selectedCompanyName: string | null;
  onSelect: (id: string, name: string, requiresCustomerApp?: boolean) => void;
  placeholder: string;
  allCompaniesLabel: string;
  emptyLabel: string;
  isDark?: boolean;
  logoImageUrl?: string | null;
  hideAvatar?: boolean;
  highContrast?: boolean;
  companyColors?: { primary: string };
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top?: number; bottom?: number; left: number; width: number }>({ left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = typeof window !== "undefined" ? window.innerHeight - rect.bottom - 24 : 200;
      const openUp = spaceBelow < 180;
      setPosition({
        top: openUp ? undefined : rect.bottom + 4,
        bottom: openUp && typeof window !== "undefined" ? window.innerHeight - rect.top + 4 : undefined,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (!open) return;
    const onScrollOrResize = () => updatePosition();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!triggerRef.current?.contains(target) && !target.closest("[data-company-dropdown]")) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const companyInitials = (name: string) => {
    const n = (name || "").trim();
    const parts = n.split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[1]) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    if (n.length >= 2) return n.slice(0, 2).toUpperCase();
    if (n.length === 1) return n[0].toUpperCase();
    return "?";
  };

  const dropdownStyles: React.CSSProperties = {
    background: isDark
      ? "linear-gradient(145deg, rgba(30,41,59,0.95) 0%, rgba(15,23,42,0.98) 100%)"
      : "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.99) 100%)",
    boxShadow: isDark
      ? "0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05), 0 10px 20px -5px rgba(0,0,0,0.4)"
      : "0 25px 50px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.8) inset, 0 10px 20px -5px rgba(0,0,0,0.1)",
    backdropFilter: "blur(24px) saturate(180%)",
  };

  const dropdown = open && typeof document !== "undefined" && createPortal(
    <div
      data-company-dropdown
      className="fixed z-[99999] flex flex-col rounded-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      style={{
        ...dropdownStyles,
        top: position.top,
        bottom: position.bottom,
        left: position.left,
        minWidth: 160,
        maxHeight: "min(70vh, 420px)",
      }}
    >
      <div className="p-1.5 overflow-y-auto overscroll-contain min-h-0 flex-1 space-y-0.5">
        {companies.map((c) => {
          const name = c.commercialName || c.legalName || c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => { onSelect(c.id, name, c.requiresCustomerApp); setOpen(false); }}
              className={`group w-full px-3 py-2.5 text-left text-sm transition-all duration-200 rounded-lg truncate flex items-center gap-3 ${
                selectedCompanyId === c.id
                  ? "bg-company-primary/10 dark:bg-company-primary/20 text-slate-800 dark:text-white font-medium"
                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
              }`}
            >
              {selectedCompanyId === c.id && (
                <span className="w-1.5 h-1.5 rounded-full bg-company-primary shrink-0" />
              )}
              <span className="truncate font-medium">{name}</span>
            </button>
          );
        })}
        {companies.length === 0 && (
          <p className="px-3 py-3 text-sm text-slate-400 text-center">{emptyLabel}</p>
        )}
      </div>
      <div className="border-t border-slate-200/60 dark:border-slate-700/60 pt-1 mt-1 px-1.5 pb-1.5">
        <Link
          href="/dashboard/companies"
          onClick={() => setOpen(false)}
          className="block px-3 py-2.5 text-left text-sm text-company-primary hover:bg-company-primary/10 dark:hover:bg-company-primary/20 transition-all rounded-lg font-medium"
        >
          {allCompaniesLabel}
        </Link>
      </div>
    </div>,
    document.body
  );

  const selectedName = selectedCompanyName || "";
  const selectedInitials = companyInitials(selectedName);

  return (
    <>
      <div className="relative flex items-center gap-3">
        {!hideAvatar && (
          <div
            className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold overflow-hidden"
            style={{
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              border: '3px solid var(--card-border)',
              boxShadow: `0 8px 32px -8px ${companyColors?.primary ? companyColors.primary + '40' : 'rgba(0,0,0,0.1)'}`,
            }}
          >
            {logoImageUrl?.trim() ? (
              <Image
                src={logoImageUrl}
                alt=""
                width={128}
                height={128}
                className="w-full h-full object-cover object-center"
              />
            ) : selectedInitials ? (
              <span className="text-xs font-semibold">{selectedInitials}</span>
            ) : (
              <Building className={`w-[18px] h-[18px] ${isDark ? "text-white/60" : "text-slate-500"}`} />
            )}
          </div>
        )}
        <div className={hideAvatar ? "absolute -right-2 top-1/2 -translate-y-1/2" : "flex-1"}>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => { if (!open) updatePosition(); setOpen((o) => !o); }}
            className={`flex items-center min-w-0 ${hideAvatar ? "pl-4" : "pl-3"} ${hideAvatar ? "pr-8" : "pr-9"} ${hideAvatar ? "py-1.5" : "py-2.5"} rounded-lg text-left text-sm transition-all duration-300 ease-out ${
              hideAvatar
                ? `px-3 py-1.5 rounded-lg backdrop-blur-md hover:scale-[1.02]`
                : highContrast
                  ? `bg-white/25 hover:bg-white/35 ${isDark ? "text-white" : "text-slate-800"} border border-white/30 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08),0_1px_2px_rgba(255,255,255,0.3)_inset] backdrop-blur-xl hover:shadow-[0_6px_20px_-4px_rgba(0,0,0,0.1)] hover:border-white/50 hover:scale-[1.02]`
                    : isDark
                      ? "bg-white/10 hover:bg-white/20 text-white border border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.2)] backdrop-blur-sm hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
                      : "bg-white/25 text-slate-800 border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06),0_1px_2px_rgba(255,255,255,0.4)_inset,0_8px_16px_rgba(255,255,255,0.1)_inset] backdrop-blur-2xl hover:shadow-[0_8px_32px_rgba(0,0,0,0.1),0_1px_2px_rgba(255,255,255,0.5)_inset] hover:bg-white/35 hover:border-white/90"
            } ${open ? "ring-2 ring-company-primary/40 shadow-[0_0_20px_rgba(var(--company-primary-rgb),0.2)]" : ""} ${highContrast ? "max-w-[220px] justify-center text-center" : ""}`}
            style={hideAvatar ? {
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.9)" : "rgba(255, 255, 255, 0.9)",
              boxShadow: isDark ? "0 2px 8px -2px rgba(0, 0, 0, 0.3)" : "0 2px 8px -2px rgba(0, 0, 0, 0.1)",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.05)",
            } : undefined}
          >
            <span className={`truncate flex-1 ${hideAvatar ? "text-xs font-medium" : "font-medium"}`} style={hideAvatar ? { color: 'var(--text-primary)' } : undefined}>
              {selectedCompanyName || (
                <span className={highContrast ? "text-slate-500" : isDark ? "text-white/60" : "text-slate-500"}>
                  {placeholder}
                </span>
              )}
            </span>
          </button>
          <ChevronDown
            className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ease-out ${
              open ? "rotate-180" : ""
            } ${hideAvatar ? "w-3 h-3" : "w-4 h-4"} ${hideAvatar ? (isDark ? "text-white/50" : "text-slate-400") : (highContrast ? "text-slate-500" : isDark ? "text-white/70" : "text-slate-500")}`}
          />
        </div>
      </div>
      {dropdown}
    </>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const {
    selectedCompanyId,
    selectedCompanyName,
    setSelectedCompany,
    sidebarCollapsed: collapsed,
    setSidebarCollapsed,
    sidebarOpen,
    toggleSidebar,
    companiesVersion,
    parkingsVersion,
    companyBranding,
  } = useDashboardStore();
  const [companies, setCompanies] = useState<{ id: string; commercialName?: string; legalName?: string; requiresCustomerApp?: boolean }[]>([]);
  const [adminCompanyName, setAdminCompanyName] = useState<string | null>(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [hasBookableParkings, setHasBookableParkings] = useState(false);
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});
  const initializedGroups = useRef(false);

  const toggleGroup = (index: number) => {
    setOpenGroups((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const superAdmin = isSuperAdmin(user);
  const admin = isAdmin(user);
  const hasCompanies = superAdmin
    ? companies.length > 0 || Boolean(selectedCompanyId)
    : Boolean(adminCompanyName) || Boolean(user?.id);
  const shouldShowLoading = isLoadingCompany && !hasCompanies;
  const isDark = resolvedTheme === "dark";

  const getThemeDefaultColors = (dark: boolean) => ({
    primary: dark ? "#3b82f6" : "#2563eb",
    secondary: dark ? "#8b5cf6" : "#7c3aed",
    tertiary: dark ? "#06b6d4" : "#0891b2",
  });
  const defaults = getThemeDefaultColors(isDark);
  const primary =
    (isDark
      ? (companyBranding?.primaryColorDark?.trim() || companyBranding?.primaryColor?.trim())
      : companyBranding?.primaryColor?.trim()) || defaults.primary;
  const secondary =
    (isDark
      ? (companyBranding?.secondaryColorDark?.trim() || companyBranding?.secondaryColor?.trim())
      : companyBranding?.secondaryColor?.trim()) || defaults.secondary;
  const tertiary =
    (isDark
      ? (companyBranding?.tertiaryColorDark?.trim() || companyBranding?.tertiaryColor?.trim())
      : companyBranding?.tertiaryColor?.trim()) || defaults.tertiary;
  const companyColors = { primary, secondary, tertiary };
  const IndustryIcon = getIndustryIcon(companyBranding?.businessActivity);

  useEffect(() => {
    if (!superAdmin) return;
    setIsLoadingCompany(true);
    apiClient
      .get<{ id: string; commercialName?: string; legalName?: string }[]>("/companies")
      .then((data) => setCompanies(Array.isArray(data) ? data : []))
      .catch(() => setCompanies([]))
      .finally(() => setIsLoadingCompany(false));
  }, [superAdmin, companiesVersion]);

  useEffect(() => {
    if (!superAdmin || companies.length === 0) return;
    const currentId = useDashboardStore.getState().selectedCompanyId;
    const currentExists = currentId && companies.some((c) => c.id === currentId);
    if (currentExists) return;
    const first = companies[0];
    if (!first) return;
    const name = first.commercialName || first.legalName || first.id;
    setSelectedCompany(first.id, name, first.requiresCustomerApp);
  }, [superAdmin, companies, setSelectedCompany]);

  useEffect(() => {
    if (!user || superAdmin) return;
    setIsLoadingCompany(true);
    apiClient
      .get<{ id?: string; commercialName?: string; legalName?: string; email?: string; requiresCustomerApp?: boolean }>("/companies/me")
      .then((company) => {
        const name = company?.commercialName || company?.legalName || null;
        setAdminCompanyName(name ?? null);
        if (company?.id && name) {
          setSelectedCompany(company.id, name, company.requiresCustomerApp);
        }
      })
      .catch(() => {
        setAdminCompanyName(null);
      })
      .finally(() => setIsLoadingCompany(false));
  }, [user?.id, superAdmin, setSelectedCompany, user]);

  useEffect(() => {
    if (!user?.id) return;
    apiClient
      .get<{ count: number }>(`/notifications/user/${user.id}/unread-count`)
      .then((data) => setUnreadNotificationsCount(data?.count ?? 0))
      .catch(() => setUnreadNotificationsCount(0));
  }, [user?.id]);

  useEffect(() => {
    const hasCompanyContext = superAdmin ? Boolean(selectedCompanyId) : Boolean(user?.id);
    if (!hasCompanyContext) {
      setHasBookableParkings(false);
      return;
    }
    apiClient
      .get<{ hasBookable?: boolean }>("/parkings/has-bookable")
      .then((data) => setHasBookableParkings(Boolean(data?.hasBookable)))
      .catch(() => setHasBookableParkings(false));
  }, [superAdmin, selectedCompanyId, user?.id, companiesVersion, parkingsVersion]);

  const toggleCollapsed = () => setSidebarCollapsed(!collapsed);

  const handleNavClick = () => {
    if (sidebarOpen) {
      toggleSidebar();
    }
  };

  const handleSelectCompany = (id: string, name: string, requiresCustomerApp?: boolean) => {
    setSelectedCompany(id, name, requiresCustomerApp);
    if (pathname !== "/dashboard") {
      router.push("/dashboard");
    }
  };

  const navGroups = useMemo(() => {
    const mainItems = [
      { label: t("sidebar.overview"), href: "/dashboard", icon: LayoutDashboard },
      { label: t("sidebar.parkings"), href: "/dashboard/parkings", icon: ParkingCircle },
      ...(hasBookableParkings ? [{ label: t("sidebar.bookings"), href: "/dashboard/bookings", icon: CalendarEvent }] : []),
      { label: t("sidebar.tickets"), href: "/dashboard/tickets", icon: TicketCheck },
    ];

    const teamItems = [
      ...(admin ? [{ label: t("sidebar.employees"), href: "/dashboard/users", icon: UserCircle }] : []),
      ...(superAdmin ? [{ label: t("sidebar.valets"), href: "/dashboard/valets", icon: Key }] : []),
    ];

    const clientsItems = [
      { label: t("sidebar.customers"), href: "/dashboard/customers", icon: Users },
      { label: t("sidebar.vehicles"), href: "/dashboard/vehicles", icon: Car },
    ];

    return [
      {
        label: t("sidebar.main"),
        items: mainItems,
      },
      {
        label: t("sidebar.team"),
        items: teamItems,
      },
      {
        label: t("sidebar.clients"),
        items: clientsItems,
      },
      {
        label: t("sidebar.account"),
        items: [
          { label: t("sidebar.notifications"), href: "/dashboard/notifications", icon: Bell },
          { label: t("sidebar.settings"), href: "/dashboard/settings", icon: Settings },
        ],
      },
    ];
  }, [t, hasBookableParkings, admin, superAdmin]);

  // Initialize all groups as open on first render
  useEffect(() => {
    if (navGroups.length > 0 && !initializedGroups.current) {
      initializedGroups.current = true;
      setOpenGroups(Object.fromEntries(navGroups.map((_, i) => [i, true])));
    }
  }, [navGroups.length]);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[20000] bg-black/50 md:hidden"
          aria-hidden
          onClick={toggleSidebar}
        />
      )}
      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-[20001] md:z-30
          h-screen md:h-full flex flex-col overflow-hidden
          bg-gradient-to-b from-page via-page to-page/95
          backdrop-blur-2xl rounded-2xl
          transition-[width,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shrink-0
          w-[260px] ${collapsed ? "md:w-[76px]" : "md:w-[272px]"}
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{ 
          boxShadow: isDark 
            ? "0 8px 32px -8px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03) inset" 
            : "0 8px 32px -8px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.5) inset",
        }}
      >
      {/* Logo / brand */}
      <div
        className={`flex flex-col border-b border-card-border/25 dark:border-white/[0.04] shrink-0 ${
          collapsed ? "items-center justify-center py-4 px-2" : "px-5 pt-5 pb-4"
        }`}
      >
        {collapsed ? (
          <SidebarTooltip show label={t("sidebar.expand")}>
            <button
              onClick={toggleCollapsed}
              className="p-2.5 rounded-lg text-text-muted hover:text-company-primary hover:bg-company-primary/10 transition-all duration-300 ease-out w-full flex justify-center group"
              aria-label="Expand sidebar"
            >
              <SidebarExpand className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            </button>
          </SidebarTooltip>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link href="/dashboard" className="flex items-center overflow-hidden">
                  <Logo variant={isDark ? "onDark" : "default"} accentColor={primary} className="text-3xl truncate" />
                </Link>
                <a
                  href="https://triacr.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-0.5 text-[8px] font-medium text-text-muted/40 hover:text-company-primary/60 transition-colors duration-200 tracking-wide"
                >
                  Powered by Tria
                </a>
              </div>
              <button
                onClick={toggleCollapsed}
                className="hidden md:flex p-2 rounded-lg text-text-muted hover:text-company-primary hover:bg-company-primary/10 transition-all duration-300 ease-out shrink-0 group mt-1"
                aria-label="Collapse sidebar"
              >
                <SidebarCollapse className="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-90" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Company section */}
      {hasCompanies ? (
        <div className="border-b border-card-border/25 dark:border-white/[0.04] shrink-0">
          <div className={`flex items-center gap-3 px-4 py-3 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            collapsed ? 'justify-center' : ''
          }`}>
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 flex items-center justify-center ring-2 ring-company-primary/20 ring-offset-2 ring-offset-page transition-all duration-300"
              style={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                boxShadow: `0 4px 16px -4px ${companyColors?.primary ? companyColors.primary + '30' : 'rgba(0,0,0,0.08)'}`,
              }}
            >
              {companyBranding?.logoImageUrl?.trim() ? (
                <Image
                  src={companyBranding.logoImageUrl}
                  alt=""
                  width={512}
                  height={512}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <IndustryIcon className="w-[18px] h-[18px]" strokeWidth={2} style={{ color: companyColors?.primary }} />
              )}
            </div>
            <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              collapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'
            }`}>
              <div className="flex-1 min-w-0 whitespace-nowrap">
                {superAdmin ? (
                  <CompanySelector
                    companies={companies}
                    selectedCompanyId={selectedCompanyId}
                    selectedCompanyName={selectedCompanyName}
                    onSelect={handleSelectCompany}
                    placeholder={t("sidebar.selectCompany")}
                    allCompaniesLabel={t("sidebar.allCompanies")}
                    emptyLabel={t("companies.noCompanies")}
                    isDark={isDark}
                    logoImageUrl={companyBranding?.logoImageUrl}
                    hideAvatar
                    highContrast
                    companyColors={defaults}
                  />
                ) : (
                  <p className="text-sm font-medium truncate text-text-primary">
                    {adminCompanyName || selectedCompanyName || "Company"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : shouldShowLoading ? (
        <div className="border-b border-card-border/25 dark:border-white/[0.04] px-3 py-3 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 text-text-muted">
            <div className="w-5 h-5 border-2 border-company-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">{t("common.loading")}</span>
          </div>
        </div>
      ) : (
        <div className="border-b border-card-border/25 dark:border-white/[0.04] px-3 py-3 shrink-0">
          <Link
            href="/dashboard/companies/new?first=1"
            className="group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-text-muted hover:bg-input-bg hover:text-text-secondary"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0 transition-all duration-200 bg-company-primary/10 text-company-primary group-hover:bg-company-primary/15">
              <Building className="w-5 h-5" />
            </span>
            <span className="font-medium truncate">
              {t("companies.createCompany")}
            </span>
          </Link>
        </div>
      )}

      {/* Nav groups */}
      {hasCompanies ? (
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-3 space-y-1">
          {navGroups.map((group, index) => {
            const isGroupOpen = openGroups[index] !== false;
            return (
              <div key={group.label}>
                {!collapsed && (
                  <button
                    type="button"
                    onClick={() => toggleGroup(index)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary/70 hover:text-company-primary transition-all duration-200 group/header"
                  >
                    <span className="flex-1 text-left">{group.label}</span>
                    <ChevronDown
                      className={`w-3 h-3 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                        isGroupOpen ? "rotate-0 opacity-50" : "-rotate-90 opacity-30"
                      } group-hover/header:opacity-70`}
                    />
                  </button>
                )}
                <div
                  className={`grid transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    isGroupOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <ul className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        const linkContent = (
                          <>
                            <span
                              className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full bg-gradient-to-b from-company-primary to-company-primary/70 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_0_12px_rgba(var(--company-primary-rgb),0.4)] ${
                                isActive ? "opacity-100 h-7" : "opacity-0 h-0"
                              }`}
                            />
                            <span className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 transition-all duration-300 ease-out ${
                                isActive 
                                  ? "bg-company-primary/10 shadow-[0_2px_8px_-2px_rgba(var(--company-primary-rgb),0.2)]" 
                                  : "group-hover:bg-input-bg/50"
                              }`}>
                              <Icon
                                className={`w-[18px] h-[18px] transition-all duration-300 ${
                                  isActive ? "text-company-primary scale-105" : "text-text-secondary group-hover:text-company-primary group-hover:scale-105"
                                }`}
                              />
                            </span>
                            {!collapsed && (
                              <>
                                <span
                                  className={`font-medium truncate transition-colors duration-300 ${
                                    isActive ? "text-text-primary font-semibold" : "text-text-secondary group-hover:text-company-primary"
                                  }`}
                                >
                                  {item.label}
                                </span>
                                {item.href === "/dashboard/notifications" && unreadNotificationsCount > 0 && (
                                  <span className="min-w-[22px] h-[22px] px-1.5 flex items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white text-[11px] font-bold shrink-0 ml-auto shadow-lg shadow-red-500/25">
                                    {unreadNotificationsCount > 99 ? "99+" : unreadNotificationsCount}
                                  </span>
                                )}
                                {isActive && (
                                  <ChevronRight className="w-4 h-4 text-company-primary shrink-0 ml-auto opacity-70" />
                                )}
                              </>
                            )}
                            {collapsed && item.href === "/dashboard/notifications" && unreadNotificationsCount > 0 && (
                              <span
                                className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-red-500 to-red-600 ring-[2.5px] ring-page shadow-sm"
                                aria-label={`${unreadNotificationsCount} sin leer`}
                              />
                            )}
                          </>
                        );
                        return (
                          <li key={item.href}>
                            <SidebarTooltip show={collapsed} label={item.label}>
                              <Link
                                href={item.href}
                                onClick={() => {
                                  handleNavClick();
                                }}
                                className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                                  collapsed ? "justify-center mx-1" : "mx-1"
                                } ${
                                  isActive
                                    ? "bg-company-primary/5 text-text-primary shadow-[0_1px_3px_-1px_rgba(0,0,0,0.05)]"
                                    : "text-text-secondary hover:bg-input-bg/80 hover:text-company-primary"
                                }`}
                              >
                                {linkContent}
                              </Link>
                            </SidebarTooltip>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      ) : (
        <div className="flex-1" />
      )}
    </aside>
    </>
  );
}
