# Money Matters 💰

**Hinglish mein seekho, finance ko samjho** 🇮🇳

A modern financial literacy application designed for Indian youth aged 16-25. Learn personal finance concepts through interactive tools, story-based learning, and gamified experiences - all in relatable Hinglish!

## ✨ Features

### 🎓 Story-Based Learning
- Immersive narrative modules with chapters and dialogues
- Interactive choices that affect your learning journey
- XP rewards for completing lessons
- 11 comprehensive finance modules covering everything from basics to advanced investing

### 🛠️ 18+ Interactive Tools
- **SIP Calculator** - Plan your mutual fund investments
- **PPF Calculator** - Calculate Public Provident Fund returns
- **FD Calculator** - Fixed Deposit maturity calculator
- **RD Calculator** - Recurring Deposit calculator
- **NPS Calculator** - National Pension System planner
- **SSY Calculator** - Sukanya Samriddhi Yojana calculator
- **EPF Calculator** - Employee Provident Fund calculator
- **SCSS Calculator** - Senior Citizen Savings Scheme
- **TD Calculator** - Tax Saver Fixed Deposit
- **NSC Calculator** - National Savings Certificate
- **KVP Calculator** - Kisan Vikas Patra calculator
- **Budget Planner** - 50/30/20 rule based budgeting
- **Emergency Fund Calculator** - Plan your safety net
- **Inflation Calculator** - Understand purchasing power
- **Rule of 72 Calculator** - Quick doubling time estimates
- **Step-Up SIP Calculator** - Growing investment plans
- **SWP Calculator** - Systematic Withdrawal Plan
- **STP Calculator** - Systematic Transfer Plan

### 🎯 Financial GPS
- Track your financial journey with milestone-based progress
- Earn badges and achievements
- Visualize your path to financial freedom

### 📊 Dashboard
- Real-time portfolio tracking
- Expense analytics with beautiful charts
- Goal progress visualization
- Personalized insights

### 🎨 Beautiful UI
- Dark theme optimized for long reading sessions
- Smooth animations powered by Framer Motion
- Responsive design for all devices
- Accessible components using Radix UI

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd money-matters

# Install dependencies
npm install
# or
bun install

# Set up environment variables
cp .env.example .env.local
# Add your environment variables

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Start development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:reset` | Reset database and run migrations |

## 🏗️ Tech Stack

- **Framework**: Next.js 16
- **Language**: JavaScript/TypeScript
- **Styling**: Tailwind CSS 4, CSS Modules
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Database**: SQLite/PostgreSQL (via Prisma)
- **ORM**: Prisma
- **Forms**: React Hook Form, Zod validation
- **Tables**: TanStack Table
- **Internationalization**: next-intl
- **Theming**: next-themes
- **Authentication**: NextAuth.js

## 📁 Project Structure

```
money-matters/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/             # API routes
│   │   ├── auth/            # Authentication pages
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── profile/         # User profile pages
│   │   ├── strategy/        # Investment strategy pages
│   │   └── tools/           # Financial tools pages
│   ├── components/
│   │   ├── 2d/              # Landing page components
│   │   ├── layout/          # Layout components
│   │   ├── shared/          # Shared components
│   │   ├── strategies/      # Strategy components
│   │   └── ui/              # Base UI components
│   ├── lib/
│   │   ├── constants.js     # App constants
│   │   ├── data/            # Static data
│   │   ├── hooks/           # Custom hooks
│   │   ├── store/           # Zustand stores
│   │   ├── types/           # TypeScript types
│   │   ├── db.js            # Database connection
│   │   └── utils.js         # Utility functions
│   └── data/                # Additional data files
├── public/                  # Static assets
├── prisma/                  # Prisma schema
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## 🎯 Learning Modules

1. **Money Basics** - Understanding currency, value, and financial concepts
2. **Banking** - Accounts, UPI, digital payments in India
3. **Budgeting** - 50/30/20 rule, expense tracking
4. **Saving** - Emergency funds, goal-based saving
5. **Credit & Loans** - Credit cards, personal loans, EMI
6. **Insurance** - Term life, health, vehicle insurance
7. **Investing Basics** - Risk, return, compounding
8. **Stock Market** - Shares, mutual funds, SIPs
9. **Retirement Planning** - EPF, NPS, PPF
10. **Tax Planning** - Income tax, deductions, GST basics
11. **Advanced Investing** - Portfolio diversification, rebalancing

## 🏆 Gamification

- **XP System** - Earn experience points for learning
- **Badges** - Unlock achievements for milestones
- **Streaks** - Maintain daily learning streaks
- **Leaderboards** - Compete with friends
- **Levels** - Progress from Beginner to Financial Guru

## 🌟 Key Features Explained

### Hinglish Content
All educational content is presented in Hinglish (Hindi + English mix), making complex financial concepts relatable and easy to understand for young Indians.

### Interactive Calculators
Every financial tool provides real-time calculations with visual feedback, helping users make informed decisions.

### Personalized Journey
The app adapts to user's age, income, and goals to provide relevant recommendations and learning paths.

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
# Add other required variables here
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

Built with ❤️ for Indian youth to achieve financial literacy and independence.

## 🙏 Acknowledgments

- Built using [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Charts by [Recharts](https://recharts.org/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)

---

**Start your financial journey today!** 🚀

*Money Matters - Because your money matters!*
