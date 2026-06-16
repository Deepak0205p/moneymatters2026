# Task: style-2/feat-2 — WelcomeOnboarding & BadgeGallery Components

## Summary
Created two new shared components and integrated them into the app:

### 1. WelcomeOnboarding (`/src/components/shared/WelcomeOnboarding.tsx`)
- Full-screen overlay with dark semi-transparent backdrop + gold coin particle animations
- 3-step onboarding flow with Framer Motion slide transitions:
  - Step 0: Welcome screen with "RUPAIYA 101" gold gradient branding, tagline, and 10-coin bonus info
  - Step 1: Name input ("Tumhara naam kya hai?") with dark input + gold border on focus
  - Step 2: Strategy picker showing 3 priority strategies (Zindagi Ka Safar, Kya Hota Agar, Budget Khel)
- "Shuru Karein!" button with gold (#f59e0b) background
- Skip option on Step 0
- Step indicator dots at bottom
- Store integration: saves userName, adds 10 coins, adds 'first-login' badge on completion
- Only shows when userName is empty (persisted Zustand store check)

### 2. BadgeGallery (`/src/components/shared/BadgeGallery.tsx`)
- Bottom sheet modal that slides up with Framer Motion
- 12 badge definitions with icons, names, descriptions, and colors
- Grid layout (2-4 columns responsive)
- Earned badges: full color with icon, name, description, subtle glow animation
- Unearned badges: grayed out with Lock icon, "???" name, hidden description
- Progress bar showing earned/total ratio
- Counter at top: "X/12 Badges Earned"
- Close button and backdrop click to dismiss
- Uses DynamicIcon component for rendering Lucide icons by name string

### 3. Updated page.tsx
- Added WelcomeOnboarding import and rendered it as overlay before Navbar
- Component self-manages visibility via userName check

### Lint & Build
- ESLint passes with zero errors
- Dev server compiles successfully (200 status)
- Fixed conditional hook call issue (moved all useState above early return)
