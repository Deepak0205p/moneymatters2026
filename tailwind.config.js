import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // mvpppp/ excluded — it's a backup folder, not part of the app
  theme: {
    extend: {
      colors: {
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
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        // ── Brand Palette: Midnight Wealth + Emerald Growth ──
        midnight: {
          DEFAULT: "#0B1220",
          soft: "#111A2E",
          deep: "#070D18",
        },
        emerald: {
          DEFAULT: "#10B981",
          soft: "#34D399",
          deep: "#047857",
        },
        ai: {
          DEFAULT: "#8B5CF6",
          soft: "#A78BFA",
          deep: "#6D28D9",
        },
        gold: {
          DEFAULT: "#F59E0B",
          soft: "#FBBF24",
          deep: "#D97706",
        },
        ink: {
          DEFAULT: "#F8FAFC",
          muted: "#94A3B8",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Premium SaaS typography scale
        "display-sm": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "800" }],
        "display": ["3.5rem", { lineHeight: "1.05", letterSpacing: "-0.035em", fontWeight: "800" }],
        "display-lg": ["4.5rem", { lineHeight: "1.0", letterSpacing: "-0.04em", fontWeight: "800" }],
      },
      boxShadow: {
        "glow-emerald": "0 0 20px rgba(16, 185, 129, 0.30), 0 0 60px rgba(16, 185, 129, 0.10)",
        "glow-gold": "0 0 20px rgba(245, 158, 11, 0.30), 0 0 60px rgba(245, 158, 11, 0.10)",
        "glow-purple": "0 0 20px rgba(139, 92, 246, 0.30), 0 0 60px rgba(139, 92, 246, 0.10)",
        "glass": "0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 32px rgba(0, 0, 0, 0.28)",
        "premium": "0 12px 40px rgba(0, 0, 0, 0.36), 0 0 0 1px rgba(16, 185, 129, 0.05)",
        "card-hover": "0 16px 48px rgba(0, 0, 0, 0.44)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #34D399, #10B981 45%, #8B5CF6)",
        "gold-gradient": "linear-gradient(135deg, #FBBF24, #F59E0B, #D97706)",
        "emerald-gradient": "linear-gradient(135deg, #34D399, #10B981 60%, #047857)",
        "midnight-radial":
          "radial-gradient(60rem 60rem at 80% -10%, rgba(16,185,129,0.10), transparent 60%), radial-gradient(50rem 50rem at -10% 110%, rgba(139,92,246,0.08), transparent 60%)",
      },
      transitionTimingFunction: {
        "premium": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      animation: {
        "shimmer": "shimmer 2.5s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
