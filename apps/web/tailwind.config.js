/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@tremor/react/dist/**/*.{js,mjs}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0066FF",
        secondary: "#F5A623",
        page: "var(--page-bg)",
        "page-alt": "var(--page-bg-alt)",
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
        card: "var(--card-bg)",
        "card-border": "var(--card-border)",
        "border-color": "var(--border-color)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "text-disabled": "var(--text-disabled)",
        "input-bg": "var(--input-bg)",
        "input-border": "var(--input-border)",
        overlay: "var(--overlay)",
        success: "var(--success)",
        "success-bg": "var(--success-bg)",
        warning: "var(--warning)",
        "warning-bg": "var(--warning-bg)",
        error: "var(--error)",
        "error-bg": "var(--error-bg)",
        info: "var(--info)",
        "info-bg": "var(--info-bg)",
        // Tremor theme colors
        "tremor-background": "var(--card-bg)",
        "dark-tremor-background": "var(--card-bg)",
        "tremor-content": "var(--text-secondary)",
        "dark-tremor-content": "var(--text-secondary)",
        "tremor-content-emphasis": "var(--text-primary)",
        "dark-tremor-content-emphasis": "var(--text-primary)",
        "tremor-content-strong": "var(--text-primary)",
        "dark-tremor-content-strong": "var(--text-primary)",
        "tremor-border": "var(--card-border)",
        "dark-tremor-border": "var(--card-border)",
        "tremor-ring": "var(--card-border)",
        "dark-tremor-ring": "var(--card-border)",
        "tremor-brand": "var(--company-primary)",
        "dark-tremor-brand": "var(--company-primary)",
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "slide-in": "slide-in 0.5s ease-out forwards",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      // Tremor theme tokens (v3 compatibility)
      borderRadius: {
        "tremor-default": "0.5rem",
        "tremor-full": "9999px",
      },
      fontSize: {
        "tremor-label": ["0.75rem", { lineHeight: "1rem" }],
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
        "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
      },
      boxShadow: {
        "tremor-card":
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        "dark-tremor-card":
          "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  safelist: [
    {
      pattern: /-tremor-/,
      variants: ["dark"],
    },
  ],
  plugins: [],
};
