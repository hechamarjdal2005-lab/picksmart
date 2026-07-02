import type { Config } from "tailwindcss";

/** Wrap a CSS var as an HSL color that supports Tailwind opacity modifiers. */
const c = (v: string) => `hsl(var(${v}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "24px",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        /* ---- Stitch raw palette tokens ---- */
        surface: {
          DEFAULT: c("--surface"),
          dim: c("--surface-dim"),
          bright: c("--surface-bright"),
          variant: c("--surface-variant"),
          "container-lowest": c("--surface-container-lowest"),
          "container-low": c("--surface-container-low"),
          container: c("--surface-container"),
          "container-high": c("--surface-container-high"),
          "container-highest": c("--surface-container-highest"),
          tint: c("--surface-tint"),
        },
        "on-surface": {
          DEFAULT: c("--on-surface"),
          variant: c("--on-surface-variant"),
        },
        "inverse-surface": c("--inverse-surface"),
        "inverse-on-surface": c("--inverse-on-surface"),
        "inverse-primary": c("--inverse-primary"),
        outline: {
          DEFAULT: c("--outline"),
          variant: c("--outline-variant"),
        },
        "primary-container": c("--primary-container"),
        "on-primary": c("--on-primary"),
        "on-primary-container": c("--on-primary-container"),
        "primary-fixed": c("--primary-fixed"),
        "primary-fixed-dim": c("--primary-fixed-dim"),
        "on-primary-fixed": c("--on-primary-fixed"),
        "on-primary-fixed-variant": c("--on-primary-fixed-variant"),
        "secondary-container": c("--secondary-container"),
        "on-secondary": c("--on-secondary"),
        "on-secondary-container": c("--on-secondary-container"),
        "secondary-fixed": c("--secondary-fixed"),
        "secondary-fixed-dim": c("--secondary-fixed-dim"),
        "on-secondary-fixed": c("--on-secondary-fixed"),
        "on-secondary-fixed-variant": c("--on-secondary-fixed-variant"),
        tertiary: {
          DEFAULT: c("--tertiary"),
          container: c("--tertiary-container"),
          fixed: c("--tertiary-fixed"),
          "fixed-dim": c("--tertiary-fixed-dim"),
        },
        "on-tertiary": {
          DEFAULT: c("--on-tertiary"),
          container: c("--on-tertiary-container"),
          fixed: c("--on-tertiary-fixed"),
          "fixed-variant": c("--on-tertiary-fixed-variant"),
        },
        error: {
          DEFAULT: c("--error"),
          container: c("--error-container"),
        },
        "on-error": {
          DEFAULT: c("--on-error"),
          container: c("--on-error-container"),
        },
        "on-background": c("--on-background"),
        /* Functional */
        success: c("--success"),
        deal: c("--deal"),

        /* ---- shadcn/ui semantic aliases ---- */
        border: c("--border"),
        input: c("--input"),
        ring: c("--ring"),
        background: c("--background"),
        foreground: c("--foreground"),
        primary: {
          DEFAULT: c("--primary"),
          foreground: c("--primary-foreground"),
        },
        secondary: {
          DEFAULT: c("--secondary"),
          foreground: c("--secondary-foreground"),
        },
        destructive: {
          DEFAULT: c("--destructive"),
          foreground: c("--destructive-foreground"),
        },
        muted: {
          DEFAULT: c("--muted"),
          foreground: c("--muted-foreground"),
        },
        accent: {
          DEFAULT: c("--accent"),
          foreground: c("--accent-foreground"),
        },
        popover: {
          DEFAULT: c("--popover"),
          foreground: c("--popover-foreground"),
        },
        card: {
          DEFAULT: c("--card"),
          foreground: c("--card-foreground"),
        },
      },
      /* ---- Stitch spacing scale ---- */
      spacing: {
        base: "4px",
        xs: "8px",
        sm: "16px",
        md: "24px",
        lg: "48px",
        xl: "80px",
        gutter: "24px",
      },
      maxWidth: {
        "container-max": "1280px",
      },
      /* ---- Stitch type scale (display → label) + semantic h-aliases ---- */
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-lg-mobile": ["36px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-sm": ["20px", { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.7", letterSpacing: "0", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.7", letterSpacing: "0", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" }],
        "label-md": ["12px", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "600" }],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      },
      boxShadow: {
        /* ported from .product-card-glow / .glow-hover */
        glow: "0 0 15px rgba(255, 107, 0, 0.15)",
        "glow-lg": "0 0 20px rgba(255, 107, 0, 0.2)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(0.85)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
