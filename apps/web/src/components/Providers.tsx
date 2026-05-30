"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { CompanyThemeSync } from "@/components/CompanyThemeSync";
import { Toaster } from "@/components/Toaster";
import { LocaleInit } from "@/components/LocaleInit";
import { DocumentTitleSetter } from "@/components/DocumentTitleSetter";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="parkit_theme"
      disableTransitionOnChange={false}
    >
      <CompanyThemeSync />
      <LocaleInit>
        <DocumentTitleSetter />
        {children}
      </LocaleInit>
      <Toaster />
    </NextThemesProvider>
  );
}
