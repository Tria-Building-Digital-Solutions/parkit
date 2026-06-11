"use client";

import { LOGO_LETTER_SPACING_EM } from "@parkit/shared";
import localFont from "next/font/local";

const calSans = localFont({
  src: "../fonts/CalSans.ttf",
  display: "swap",
});

type LogoVariant = "default" | "onDark" | "mark" | "markOnDark" | "mono" | "monoOnDark";

export function Logo({
  className = "",
  variant = "default",
  accentColor,
}: {
  className?: string;
  /** "onDark" = full logo on dark bg. "mark" = solo "p." (fondo claro). "markOnDark" = solo "p." en fondo oscuro. */
  variant?: LogoVariant;
  /** Override the "it." color (e.g. company primary color). Falls back to blue-600 if not set. */
  accentColor?: string;
}) {
  const isOnDark = variant === "onDark" || variant === "markOnDark" || variant === "monoOnDark";
  const isMark = variant === "mark" || variant === "markOnDark";
  const isMono = variant === "mono" || variant === "monoOnDark";

  return (
    <div
      style={{
        ...calSans.style,
        letterSpacing: `${LOGO_LETTER_SPACING_EM}em`,
      }}
      className={`font-bold flex items-center ${isMark ? "text-xl" : "text-4xl"} ${className}`}
    >
      <span
        className={
          isOnDark
            ? "text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.12)] transition-colors duration-300"
            : "text-slate-900 dark:text-white transition-colors duration-300"
        }
      >
        {isMark ? "p" : "park"}
      </span>
      {isMono ? (
        <span
          className={
            isOnDark
              ? "text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.12)] transition-colors duration-300"
              : "text-slate-900 dark:text-white transition-colors duration-300"
          }
        >
          {isMark ? "." : "it."}
        </span>
      ) : accentColor ? (
        <span style={{ color: accentColor }} className="transition-colors duration-300">
          {isMark ? "." : "it."}
        </span>
      ) : (
        <span className="text-blue-600 dark:text-blue-500 transition-colors duration-300">
          {isMark ? "." : "it."}
        </span>
      )}
    </div>
  );
}
