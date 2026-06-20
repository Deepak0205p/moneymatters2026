import { Inter, Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap"
});
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap"
});
export const metadata = {
  title: "Money Matters — Paisa Samjho, Future Secure Karo",
  description: "India ke youth ke liye premium financial literacy app. Interactive modules, AI advisor, gamified learning — sab Hinglish mein. Seekho, bachao, badhao!",
  keywords: ["financial literacy", "India", "youth", "SIP", "budgeting", "investing", "Hinglish", "finance education"],
  authors: [{
    name: "Money Matters"
  }],
  icons: {
    icon: "/logo.ico",
    apple: "/logo.png"
  }
};
export const viewport = {
  themeColor: "#0B1220",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};
import { AnimationProvider } from "@/components/AnimationProvider";
import { TranslationProvider } from "@/components/TranslationProvider";

export default function RootLayout({
  children
}) {
  return /*#__PURE__*/_jsx("html", {
    lang: "en",
    className: "dark",
    suppressHydrationWarning: true,
    children: /*#__PURE__*/_jsx("body", {
      className: `${inter.variable} ${poppins.variable} antialiased min-h-screen font-sans`,
      children: /*#__PURE__*/_jsxs(ThemeProvider, {
        attribute: "class",
        defaultTheme: "dark",
        enableSystem: false,
        children: [
          /*#__PURE__*/_jsx(TranslationProvider, {
            children: /*#__PURE__*/_jsx(AnimationProvider, { children })
          }),
          /*#__PURE__*/_jsx(Toaster, {})
        ]
      })
    })
  });
}