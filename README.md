# TeamFinder

AI-powered platform that helps university students find teammates, discover project ideas, and build balanced teams — available on **Web**, **Desktop**, and **Mobile**.

![React](https://img.shields.io/badge/React-19.2-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-green?logo=supabase)
![Tauri](https://img.shields.io/badge/Tauri-v2-orange?logo=tauri)
![Capacitor](https://img.shields.io/badge/Capacitor-v6-blue?logo=capacitor)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Features

| Feature | Description |
|---------|-------------|
| **AI Project Generator** | Generates tailored project ideas using Google Gemini based on your major and specialization |
| **Smart Teammate Matching** | Scores and ranks candidates by skill overlap, major, and specialization compatibility |
| **Skill Gap Analysis** | Compares your skills against project requirements and highlights what you need to learn |
| **Difficulty Assessment** | Interactive quiz that adjusts project difficulty rating to your experience level |
| **Team Composition Guide** | Recommends ideal team roles (Lead, Frontend, Backend, ML, DevOps, etc.) per project type |
| **Timeline Estimator** | Estimates project duration with milestones based on team size and difficulty |
| **Project Comparison** | Side-by-side comparison of up to 3 projects across difficulty, stack, and scope |
| **Skill Proficiency Editor** | Rate your confidence (Beginner/Intermediate/Expert) for each skill with verification |
| **Bookmarks** | Save and manage interesting projects — synced to Supabase |
| **Team Export & Sharing** | Export team composition as text, generate shareable links, and send messaging templates |

## Supported Majors

- **AI / Data Science** — ML Engineer, Data Engineer, Computer Vision, NLP, BI Analyst, MLOps, Research Scientist
- **CS / Cybersecurity** — SOC Analyst, Pentester, Cloud Security, Cryptography, Digital Forensics, Malware Analyst, DevSecOps
- **CIS / Business IT** — ERP Developer, Business Analyst, IT Consultant, Systems Admin, Database Admin, IT Auditor, Cloud Architect

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19.2, TypeScript 5.8, Tailwind CSS (CDN) |
| **Build** | Vite 6 |
| **AI** | Google Gemini via `@google/genai` |
| **Auth & Database** | Supabase (PostgreSQL, RLS, Auth, Realtime) |
| **Desktop** | Tauri v2 (Rust) — Windows, macOS, Linux |
| **Mobile** | Capacitor v6 — Android, iOS |
| **Platform Layer** | Unified abstraction (`lib/platform.ts`) for file save, haptics, share, storage |

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://rustup.rs/) (for desktop builds only)
- [Android Studio](https://developer.android.com/studio) (for Android builds only)

### Install & Run (Web)

```bash
git clone https://github.com/awshanaqtah/TeamFinder.git
cd TeamFinder
npm install
```

Create a `.env` file:

```env
VITE_GEMINI_API_KEY=your_google_gemini_api_key
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
npm run dev
```

Open `http://localhost:5173`

### Desktop (Tauri)

```bash
npm run tauri:dev      # Development
npm run tauri:build    # Production installer (.exe / .dmg / .AppImage)
```

### Mobile (Capacitor)

```bash
npm run mobile:build   # Build + sync
npm run cap:android    # Open in Android Studio
npm run cap:ios        # Open in Xcode (macOS only)
```

## Project Structure

```
TeamFinder/
├── src/
│   ├── App.tsx                    # Main application component
│   ├── index.tsx                  # Entry point
│   ├── index.css                  # Global styles
│   ├── types.ts                   # TypeScript type definitions
│   ├── constants.ts               # Majors, specializations, project data
│   ├── components/                # 30+ React components
│   │   ├── SignIn.tsx             # Auth (register/login)
│   │   ├── ProfileSection.tsx     # User profile setup
│   │   ├── ProjectFinder.tsx      # AI project generation
│   │   ├── ProjectCard.tsx        # Project display cards
│   │   ├── TeammateResults.tsx    # Teammate matching results
│   │   ├── SkillGapAnalysis.tsx   # Skill gap modal
│   │   ├── DifficultyAssessment.tsx # Difficulty quiz
│   │   ├── TeamCompositionGuide.tsx # Role recommendations
│   │   ├── TimelineEstimator.tsx  # Timeline visualization
│   │   └── ...
│   ├── services/                  # Business logic layer
│   │   ├── authService.ts         # Supabase auth
│   │   ├── geminiService.ts       # Google Gemini AI integration
│   │   ├── teammateService.ts     # Matching algorithm
│   │   ├── skillGapService.ts     # Skill analysis
│   │   ├── bookmarkService.ts     # Bookmark management
│   │   └── ...
│   ├── data/                      # Static data
│   │   ├── mockProfiles.ts        # Sample user profiles
│   │   └── skillDatabase.ts       # Skill catalog per major
│   └── lib/                       # Shared utilities
│       ├── supabase.ts            # Supabase client
│       └── platform.ts            # Cross-platform abstraction
├── src-tauri/                     # Tauri desktop shell (Rust)
├── android/                       # Capacitor Android project
├── database/
│   └── supabase-schema.sql        # Full PostgreSQL schema (15 tables)
├── tools/
│   └── code_checker/              # Python code quality tool (Ruff)
├── public/                        # Static assets (icons)
├── index.html                     # HTML entry point
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
└── capacitor.config.ts            # Capacitor configuration
```

## Database Schema

15 tables on Supabase with Row Level Security:

`majors` · `specializations` · `skills` · `projects` · `profiles` · `user_skills` · `skill_proficiencies` · `user_settings` · `teams` · `team_members` · `team_invites` · `bookmarks` · `shareable_links` · `assessment_results` · `match_scores`

Full schema: [`database/supabase-schema.sql`](database/supabase-schema.sql)

## Code Quality Tool

Built-in Python linter powered by [Ruff](https://docs.astral.sh/ruff/):

```bash
pip install ruff
python -m tools.code_checker path/to/file.py         # Analyze
python -m tools.code_checker path/ --fix              # Auto-fix
python -m tools.code_checker path/ --report report.json  # Save report
```

## License

[MIT](LICENSE)

## Authors

- **Aws Hanaqtah** — [@awshanaqtah](https://github.com/awshanaqtah)
