# Vela Intelligence OS

Vela is a premium, AI-driven Work Intelligence OS designed for high-performance individuals. It centralizes tasks, notes, decisions, and reflections into a unified, high-fidelity experience with a focus on minimalist design and intelligent context linking.

![Vela UI](https://github.com/Illumintrix/workos/raw/main/src/assets/hero.png)

## ✨ Features

- **🧠 Intelligent Extraction**: Chat naturally with Vela to capture tasks, notes, and decisions. Our AI engine automatically extracts structured data from your conversation.
- **✅ Unified Task Management**: A powerful Kanban and List view for managing your work, integrated with project contexts.
- **📝 Contextual Notes**: Capture insights and link them directly to projects, tasks, or decisions.
- **⚖️ Decision Journal**: Preserve your reasoning and tradeoffs for every critical decision you make.
- **🔄 Smart Reflections**: Weekly and daily reflection wizards that summarize your achievements and provide actionable adjustments.
- **💼 Portfolio Engine**: Automatically generate project highlights and impact statements for your professional portfolio.
- **📥 Review Inbox**: A staging area for AI-extracted items, giving you full control over what enters your OS.

## 🎨 Design Philosophy

Vela is built with a **Premium Minimalist** aesthetic:
- **Glassmorphism**: Subtle transparency and backdrop blurs for a modern, sophisticated feel.
- **HSL-Based Theme**: A curated, harmonious dark theme optimized for focus.
- **Micro-animations**: Smooth transitions and hover effects using Framer Motion and Tailwind CSS.
- **Responsive Layout**: Seamless experience across mobile, tablet, and desktop.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Backend**: [Supabase](https://supabase.com/) (Auth, Database, Real-time)
- **AI Integration**: Custom LLM orchestration for extraction and summarization.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Illumintrix/workos.git
   cd workos
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 📄 License

Proprietary. All rights reserved by Illumintrix.
