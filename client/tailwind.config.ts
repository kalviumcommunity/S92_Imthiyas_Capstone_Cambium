import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Standard shadcn/ui CSS variable mappings
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
          hover: "var(--border-hover)",
          focus: "var(--border-focus)",
        },
        input: "var(--input)",
        ring: "var(--ring)",

        // Design System Colors from Vite
        surface: {
          base: "var(--color-surface-base)",
          raised: "var(--color-surface-raised)",
          sunken: "var(--color-surface-sunken)",
          inverse: "var(--color-surface-inverse)",
        },
        ink: {
          primary: "var(--color-ink-primary)",
          secondary: "var(--color-ink-secondary)",
          tertiary: "var(--color-ink-tertiary)",
          inverse: "var(--color-ink-inverse)",
        },
        edge: {
          default: "var(--color-edge-default)",
          strong: "var(--color-edge-strong)",
          hover: "var(--color-edge-hover)",
          focus: "var(--color-edge-focus)",
        },
        moss: {
          50: "var(--color-moss-050)",
          100: "var(--color-moss-100)",
          300: "var(--color-moss-300)",
          500: "var(--color-moss-500)",
          600: "var(--color-moss-600)",
          700: "var(--color-moss-700)",
        },
        semantic: {
          success: "var(--color-semantic-success)",
          warning: "var(--color-semantic-warning)",
          error: "var(--color-semantic-error)",
          info: "var(--color-semantic-info)",
        },

        // Legacy Cambium mappings (kept for backward compatibility with shadcn)
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          light: "var(--color-moss-050)",
          dark: "var(--color-moss-700)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        "background-alt": "var(--color-surface-raised)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Manrope", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Source Serif 4", "Georgia", "serif"],
      },
      borderRadius: {
        none: "0px",
        sm: "4px",
        DEFAULT: "8px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        full: "9999px",
      },
      boxShadow: {
        none: "none",
        elevation0: "var(--shadow-elevation-0)",
        elevation1: "var(--shadow-elevation-1)",
        elevation2: "var(--shadow-elevation-2)",
        elevation3: "var(--shadow-elevation-3)",
      },
      spacing: {
        "0.5": "2px",
        "1": "4px",
        "1.5": "6px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "7": "28px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
        "16": "64px",
        "20": "80px",
        "24": "96px",
      },
      fontSize: {
        "display-xl": ["64px", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-lg": ["48px", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
        "heading-1": ["32px", { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "700" }],
        "heading-2": ["24px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        "heading-3": ["18px", { lineHeight: "1.35", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-default": ["15px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["13px", { lineHeight: "1.5", fontWeight: "400" }],
        "label-meta": ["12px", { letterSpacing: "0.04em", fontWeight: "500" }],
      },
    },
  },
  plugins: [],
};

export default config;
