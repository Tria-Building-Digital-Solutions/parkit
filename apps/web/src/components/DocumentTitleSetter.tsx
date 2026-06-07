"use client";

import { useLocaleStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { useEffect } from "react";

export function DocumentTitleSetter() {
  const locale = useLocaleStore((s) => s.locale);

  useEffect(() => {
    document.title = t(locale, "site.title");
  }, [locale]);

  return null;
}
