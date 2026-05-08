<div align="center">

<br/>

<img src="https://img.shields.io/badge/EcoSpark%20Hub-Community--Powered%20Sustainability-22c55e?style=for-the-badge&logo=leaf&logoColor=white" alt="EcoSpark Hub Banner" />

<br/>
<br/>

# 🌱 EcoSpark Hub

### *Where sustainability ideas spark real change.*

A full-stack, community-driven platform to **submit, vote, discuss, and collaborate** on eco-friendly innovations — built for a greener future.

<br/>

[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=flat-square&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white)](https://stripe.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

<br/>

[🚀 Live Demo](#) &nbsp;·&nbsp; [📖 API Docs](#) &nbsp;·&nbsp; [🐛 Report Bug](#) &nbsp;·&nbsp; [✨ Request Feature](#)

---

</div>

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#️-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Design System](#-design-system)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌍 Overview

**EcoSpark Hub** is a modern, full-stack sustainability platform where eco-enthusiasts can come together to drive real-world environmental impact.

> 💡 **Submit** creative sustainability ideas · 🗳️ **Vote** on the most impactful proposals · 💬 **Discuss** in threaded comments · 💳 **Purchase** premium expert reports · 🛡️ **Moderate** through an admin panel

Whether you're an individual contributor, a sustainability advocate, or an organization looking to crowdsource green innovation — EcoSpark Hub is your launchpad.

---

## 🚀 Key Features

### 🌐 Public

- Animated, dynamic landing page with count-up community statistics
- Browse, search, and filter ideas by category (clean energy, zero-waste, etc.)
- Showcase of top-voted community proposals
- Newsletter subscription
- Dark / Light mode toggle

### 🔐 Authenticated Users

- JWT-based Authentication with Login & Registration
- Google OAuth integration
- Personal dashboard with stats
- Submit, edit, and manage your own ideas
- Upvote / downvote on community ideas
- Threaded comments and discussion
- Purchase premium expert-curated idea reports via **Stripe**

### 🛡️ Admin Panel

- Review, approve, or reject submitted ideas
- Manage users and roles
- Create and manage idea categories (with icons & colours)
- View all transactions and order history

### 💅 UX & Design

- **Shadcn UI** component library with New York style
- **Framer Motion** micro-animations and page transitions
- Glassmorphism cards and blurred backgrounds
- Fully responsive across all screen sizes
- Smooth skeleton loading states
- Animated mobile sidebar

---

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) — App Router + Turbopack |
| **UI Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Components** | [Shadcn UI](https://ui.shadcn.com/) (New York style) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) |
| **Data Fetching** | [TanStack Query v5](https://tanstack.com/query/latest) |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **Payments** | [Stripe](https://stripe.com/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Notifications** | [React Hot Toast](https://react-hot-toast.com/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

```
ecospark-frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login & Register pages
│   │   ├── (main)/             # Public-facing pages
│   │   │   ├── page.tsx        # Landing page
│   │   │   └── ideas/          # Ideas listing & detail pages
│   │   └── (dashboard)/        # Protected dashboard (user + admin)
│   │       └── layout.tsx      # Animated sidebar layout
│   ├── components/
│   │   ├── ui/                 # Shadcn UI base components
│   │   ├── home/               # Landing page sections
│   │   ├── ideas/              # Idea card, skeleton, detail
│   │   ├── layout/             # Navbar, Footer
│   │   └── providers/          # Theme & Query providers
│   ├── lib/
│   │   ├── api.ts              # Axios API client config
│   │   └── utils.ts            # Utility helpers (cn, timeAgo, etc.)
│   ├── store/                  # Zustand global stores
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
├── vercel.json                 # Vercel deployment config
└── package.json
```

---

## ⚡ Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** `18.x` or later
- **npm** `9.x` or later
- A running instance of the [EcoSpark Backend API](https://github.com/)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/ecospark-frontend.git
cd ecospark-frontend
```

**2. Install dependencies**

```bash
npm install --legacy-peer-deps
```

**3. Configure environment variables**

```bash
cp .env.example .env
```

**4. Start the development server**

```bash
npm run dev
```

**5. Open your browser** and navigate to [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔐 Environment Variables

Fill in the following values in your `.env` file:

```env
# Backend API base URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Stripe publishable key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 🌐 Deployment

This project is optimised for **Vercel** deployment.

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy to production
vercel --prod
```

> Set all required environment variables in your [Vercel Project Settings](https://vercel.com/docs/environment-variables) before deploying.

---

## 🎨 Design System

EcoSpark Hub uses a custom design system built on top of **Tailwind CSS v4** and **Shadcn UI**.

| Token | Value |
|---|---|
| **Primary Colour** | `#22c55e` — Emerald Green |
| **Accent Colour** | `#10b981` — Teal |
| **Earth Colour** | `#eab308` — Golden Yellow |
| **Display Font** | [Syne](https://fonts.google.com/specimen/Syne) |
| **Body Font** | [DM Sans](https://fonts.google.com/specimen/DM+Sans) |
| **Border Radius** | `0.75rem` (cards) · `9999px` (pills) |

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how to get started:

1. **Fork** the repository
2. **Create** your feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes using [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat: add your feature description"
   ```
4. **Push** to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** and describe your changes clearly.

Please ensure your code is clean, typed, and follows the existing code style before submitting.

---

## 📄 License

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for full details.

---

<div align="center">

Built with 💚 for a greener planet.

**[⬆ Back to Top](#-ecospark-hub)**

</div>