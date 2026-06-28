# 🚀 DevPort — Developer Portfolio Builder

DevPort is a premium, open-source portfolio builder designed specifically for software engineers. In just 15 seconds, developers can import their profile from GitHub, LinkedIn, or a PDF resume, and get a stunning, high-contrast, fully responsive portfolio live under their own subpath handle.

---

## ✨ Features

- **⚡ Instant 15-Second Sync**: Auto-builds portfolios from your GitHub username, LeetCode progress, or PDF resumes.
- **🎨 Curated Modern Themes**:
  - **Light Minimalist**: Clean, zinc-inspired light slate design with optimal text contrast.
  - **Cyberpunk Green**: Tech-focused terminal style with custom neon accents and glowing UI highlights.
- **📱 Responsive Split Layout**:
  - **Left Sidebar**: A locked, sticky sidebar display housing the user's details, quick statistics, core stack, and socials.
  - **Right Main Stream**: A smooth-scrolling timeline containing projects, code statistics, skills, competitive programming charts, and contact forms.
- **🔒 Secure Subpath Isolation**: Perfect multi-user routing without handle overlaps or collisions.
- **📬 Dynamic Contact Form**: Seamless contact inbox delivering visitor messages directly to developer emails.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16+ (App Router, dynamic API routes)
- **Styling**: Tailwind CSS (CSS variables, high-contrast typography)
- **Database / Auth**: Supabase (PostgreSQL JSONB, row-level security policies)
- **Icons**: Lucide React
- **Animations**: Framer Motion

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Sparkyyy45/portfolio-maker.git
cd portfolio-maker
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
REVALIDATION_SECRET=your-custom-revalidation-secret
```

### 3. Run Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view it.
