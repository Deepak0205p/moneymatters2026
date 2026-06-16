import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-emerald": "0 0 20px rgba(16, 185, 129, 0.30), 0 0 60px rgba(16, 185, 129, 0.10)",
        "glow-gold": "0 0 20px rgba(245, 158, 11, 0.30), 0 0 60px rgba(245, 158, 11, 0.10)",
        "glow-purple": "0 0 20px rgba(139, 92, 246, 0.30), 0 0 60px rgba(139, 92, 246, 0.10)",
        "glass": "0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px rgba(0, 0, 0, 0.30)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #34D399, #10B981 40%, #8B5CF6)",
        "gold-gradient": "linear-gradient(135deg, #FBBF24, #F59E0B, #D97706)",
        "midnight-radial":
          "radial-gradient(60rem 60rem at 80% -10%, rgba(16,185,129,0.10), transparent 60%), radial-gradient(50rem 50rem at -10% 110%, rgba(139,92,246,0.08), transparent 60%)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
