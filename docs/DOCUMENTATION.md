# TeamFinder Documentation

Complete technical documentation for the TeamFinder platform.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Authentication](#authentication)
3. [AI Integration (Gemini)](#ai-integration-gemini)
4. [Teammate Matching Algorithm](#teammate-matching-algorithm)
5. [Feature Reference](#feature-reference)
6. [Database Schema](#database-schema)
7. [Services API Reference](#services-api-reference)
8. [Platform Abstraction](#platform-abstraction)
9. [Desktop Build (Tauri)](#desktop-build-tauri)
10. [Mobile Build (Capacitor)](#mobile-build-capacitor)
11. [Environment Variables](#environment-variables)
12. [Code Quality Tool](#code-quality-tool)
13. [Pull Request Guide](#pull-request-guide)
14. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                    Frontend                      │
│    React 19.2 + TypeScript 5.8 + Tailwind CSS   │
├─────────────────────────────────────────────────┤
│              Service Layer (src/services/)       │
│  authService · geminiService · teammateService   │
│  bookmarkService · skillGapService · etc.        │
├──────────────┬──────────────┬───────────────────┤
│  Supabase    │  Google      │  Platform Layer   │
│  Auth + DB   │  Gemini AI   │  (lib/platform)   │
├──────────────┼──────────────┼───────────────────┤
│  PostgreSQL  │  REST API    │  Tauri │ Cap │ Web │
└──────────────┴──────────────┴───────────────────┘
```

**Data flow:**
1. User creates profile (major, specialization, skills)
2. Gemini AI generates tailored project ideas
3. Teammate matching scores candidates against user profile
4. Team composition, timeline, and skill gap tools help plan execution
5. All user data persists in Supabase with Row Level Security

---

## Authentication

**Provider:** Supabase Auth (email + password)

**Flow:**
1. **Register** — `authService.registerUser(username, email, password)`
   - Calls `supabase.auth.signUp()` with username in metadata
   - Supabase trigger `handle_new_user()` auto-creates a `profiles` row
   - Confirmation email sent via configured SMTP (Gmail)
   - User must verify email before signing in

2. **Sign In** — `authService.loginUser(identifier, password)`
   - Looks up email by username from `profiles` table
   - Calls `supabase.auth.signInWithPassword()`
   - Returns session JWT stored in browser

3. **Sign Out** — `authService.logoutUser()`
   - Calls `supabase.auth.signOut()`
   - Clears local session

4. **Session Persistence** — `authService.getCurrentUser()`
   - Calls `supabase.auth.getUser()` to validate stored JWT
   - Auto-refreshes expired tokens

**Files:**
- `src/services/authService.ts` — auth logic
- `src/components/SignIn.tsx` — login/register UI
- `src/lib/supabase.ts` — Supabase client initialization

---

## AI Integration (Gemini)

**Provider:** Google Gemini via `@google/genai`

**How it works:**
1. User selects a major and specialization
2. `geminiService.generateProjectIdeas()` sends a structured prompt to Gemini
3. The prompt includes the major, specialization, and requested difficulty range
4. Gemini returns 3-5 project ideas as JSON
5. Each project includes: `title`, `description`, `scope`, `suggestedStack`, `difficulty`

**Prompt structure:**
```
Generate {count} project ideas for a {major} student
specializing in {specialization}.
Each project should include:
- title, description, scope, suggestedStack, difficulty
Return as a JSON array.
```

**Error handling:**
- Network failures return a fallback set of hardcoded projects from `constants.ts`
- Rate limiting is handled with exponential backoff
- Invalid JSON responses are caught and re-requested

**File:** `src/services/geminiService.ts`

---

## Teammate Matching Algorithm

**File:** `src/services/teammateService.ts`

**Scoring formula:**

```
Total Score = majorScore + specializationScore + skillScore
```

| Factor | Points | Condition |
|--------|--------|-----------|
| Major match | +40 | Same major |
| Specialization match | +20 | Same specialization |
| Shared skills | +8 per skill | Each overlapping skill (max 40) |

**Process:**
1. Load all candidate profiles from `data/mockProfiles.ts`
2. Filter by availability (`isAvailable === true`)
3. Calculate score for each candidate against the user's profile
4. Sort by score descending
5. Return top N results with match details

**Match details returned:**
```typescript
{
  score: number;          // 0-100
  matchDetails: {
    majorMatch: boolean;
    specializationMatch: boolean;
    sharedSkills: string[];
  }
}
```

---

## Feature Reference

### 1. AI Project Generator
- **Component:** `ProjectFinder.tsx`
- **Service:** `geminiService.ts`
- User selects major + specialization, clicks "Find Projects"
- Gemini generates tailored project ideas
- Results displayed as cards with title, description, difficulty badge, and suggested stack

### 2. Smart Teammate Matching
- **Component:** `TeammateResults.tsx`, `TeammateCard.tsx`
- **Service:** `teammateService.ts`
- After selecting a project, matching runs automatically
- Candidates scored and ranked with compatibility badges
- Confetti animation triggers when team reaches 3+ members

### 3. Skill Gap Analysis
- **Component:** `SkillGapAnalysis.tsx`
- **Service:** `skillGapService.ts`
- Compares user skills against `project.suggestedStack`
- Categorizes skills into: Have, Missing, Partial Match
- Provides learning priority recommendations

### 4. Difficulty Assessment
- **Component:** `DifficultyAssessment.tsx`
- **Service:** `difficultyAssessmentService.ts`
- Generates a 5-question quiz based on project tech stack
- Adjusts the project's difficulty rating based on answers
- Uses numeric rank comparison: Beginner=1, Intermediate=2, Advanced=3
- Provides personalized recommendations

### 5. Team Composition Guide
- **Component:** `TeamCompositionGuide.tsx`
- **Service:** `teamCompositionService.ts`
- Analyzes project title keywords to determine type
- Maps to templates: ML, Web Dev, Security, BI, Data Engineering, General
- Recommends specific roles with ideal and minimum counts

### 6. Timeline Estimator
- **Component:** `TimelineEstimator.tsx`, `TimelineChart.tsx`
- **Service:** `timelineService.ts`
- Calculates project duration in weeks based on:
  - Base difficulty weeks (Beginner: 4, Intermediate: 8, Advanced: 14)
  - Team size factor (fewer people = longer timeline)
  - Adjusted buffer range
- Generates milestone breakdown with percentage allocations

### 7. Project Comparison
- **Component:** `ProjectComparisonModal.tsx`
- **Service:** `projectComparisonService.ts`
- Select 2-3 projects via checkboxes
- Side-by-side comparison table: difficulty, stack, scope, skill overlap
- Highlights best match based on user's current skills

### 8. Skill Proficiency Editor
- **Component:** `SkillProficiencyEditor.tsx`, `SkillConfidenceSelector.tsx`
- **Service:** `proficiencyService.ts`
- Rate each skill: Beginner / Intermediate / Expert
- Verification prompts for self-reported expert skills
- Stored locally and synced to Supabase `skill_proficiencies` table

### 9. Bookmarks
- **Component:** `BookmarkButton.tsx`, `BookmarksList.tsx`
- **Service:** `bookmarkService.ts`, `supabaseBookmarkService.ts`
- Toggle bookmark on any project card
- Bookmarks stored in both localStorage (offline) and Supabase (synced)
- View all bookmarked projects in a dedicated panel

### 10. Team Export & Sharing
- **Component:** `TeamExport.tsx`, `TeamContactModal.tsx`
- **Service:** `exportService.ts`, `contactService.ts`
- Export team as formatted text or JSON
- Generate base64-encoded shareable links
- Pre-built messaging templates for contacting teammates
- Copy to clipboard functionality

---

## Database Schema

**Provider:** Supabase (PostgreSQL)

15 tables with Row Level Security enabled on all user-facing tables.

### Tables

| Table | Purpose | RLS |
|-------|---------|-----|
| `majors` | Lookup: major names | Public read |
| `specializations` | Lookup: specialization per major | Public read |
| `skills` | Lookup: skill catalog | Public read |
| `projects` | Lookup: project ideas | Public read |
| `profiles` | User profiles (extends auth.users) | Own data only |
| `user_skills` | Many-to-many user↔skill | Own data only |
| `skill_proficiencies` | Skill confidence levels | Own data only |
| `user_settings` | Last major/specialization selected | Own data only |
| `teams` | Team instances | Owner + members |
| `team_members` | Team membership join table | Own + team owner |
| `team_invites` | Pending/accepted/declined invites | Inviter + invitee |
| `bookmarks` | Saved projects (JSONB) | Own data only |
| `shareable_links` | Token-based team sharing | Public read, owner write |
| `assessment_results` | Difficulty quiz results | Own data only |
| `match_scores` | Cached teammate match scores | Own data only |

### Key Relationships

```
auth.users (Supabase Auth)
  └── profiles (1:1, auto-created via trigger)
        ├── user_skills (many-to-many → skills)
        ├── skill_proficiencies (1:many)
        ├── user_settings (1:1)
        ├── bookmarks (1:many)
        ├── teams (1:many, as owner)
        │     ├── team_members (many-to-many → profiles)
        │     ├── team_invites (1:many)
        │     └── shareable_links (1:many)
        ├── assessment_results (1:many → projects)
        └── match_scores (1:many)

majors
  ├── specializations (1:many)
  └── skills (1:many, nullable)

specializations
  └── projects (1:many)
```

### Auto-Profile Creation Trigger

When a user registers via Supabase Auth, this trigger automatically creates their profile:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        NEW.email
    ) ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

Full schema: [`database/supabase-schema.sql`](../database/supabase-schema.sql)

---

## Services API Reference

### authService.ts

```typescript
registerUser(username: string, email: string, password: string): Promise<AuthResult>
loginUser(identifier: string, password: string): Promise<AuthResult>
logoutUser(): Promise<void>
getCurrentUser(): Promise<User | null>
```

### geminiService.ts

```typescript
generateProjectIdeas(major: Major, specialization: string, count?: number): Promise<ProjectIdea[]>
```

### teammateService.ts

```typescript
findTeammates(profile: Profile, allProfiles: Profile[]): ScoredProfile[]
getMaxProjectsToCompare(): number
```

### skillGapService.ts

```typescript
parseProjectSkills(project: ProjectIdea): string[]
analyzeSkillGap(userSkills: string[], projectSkills: string[]): SkillGapResult
```

### difficultyAssessmentService.ts

```typescript
generateAssessmentQuiz(projectTitle: string, techStack: string[]): AssessmentQuiz
calculateAssessmentResult(quiz: AssessmentQuiz, answers: number[]): AssessmentResult
getDifficultyRecommendations(result: AssessmentResult): string[]
```

### teamCompositionService.ts

```typescript
getRecommendedComposition(projectTitle: string): RoleRequirement[]
```

### timelineService.ts

```typescript
estimateTimeline(project: ProjectIdea, teamSize: number): TimelineEstimate
```

### projectComparisonService.ts

```typescript
compareProjects(projects: ProjectIdea[], userSkills: string[]): ComparisonResult
```

### bookmarkService.ts

```typescript
getBookmarks(): ProjectIdea[]
addBookmark(project: ProjectIdea): void
removeBookmark(projectTitle: string): void
isBookmarked(projectTitle: string): boolean
```

### contactService.ts

```typescript
generateShareableLink(teamData: ShareableTeamData): string
parseShareableLink(url: string): ShareableTeamData | null
generateMessagingTemplate(type: string, context: TemplateContext): string
```

### exportService.ts

```typescript
exportTeamAsText(team: TeamMember[], project: ProjectIdea): string
exportTeamAsJSON(team: TeamMember[], project: ProjectIdea): string
copyToClipboard(text: string): Promise<boolean>
```

---

## Platform Abstraction

**File:** `src/lib/platform.ts`

A unified API that works identically across Web, Desktop (Tauri), and Mobile (Capacitor):

```typescript
detectPlatform(): 'tauri' | 'capacitor' | 'web'

// File operations
saveTextFile(filename: string, content: string): Promise<void>
  // Tauri: native file dialog via @tauri-apps/plugin-dialog
  // Capacitor: writes to app Documents directory
  // Web: triggers browser download

// Haptic feedback
hapticFeedback(): Promise<void>
  // Tauri: no-op
  // Capacitor: @capacitor/haptics light impact
  // Web: no-op

// Native share sheet
nativeShare(title: string, text: string, url?: string): Promise<void>
  // Tauri: clipboard copy
  // Capacitor: @capacitor/share native sheet
  // Web: navigator.share() or clipboard fallback

// Key-value storage
storageGet(key: string): Promise<string | null>
storageSet(key: string, value: string): Promise<void>
  // Tauri: @tauri-apps/plugin-store
  // Capacitor: @capacitor/preferences
  // Web: localStorage
```

---

## Desktop Build (Tauri)

**Prerequisite:** [Rust](https://rustup.rs/) installed

### Development

```bash
npm run tauri:dev
```

Starts Vite dev server on port 5173, opens a native window pointing to it.

### Production Build

```bash
npm run tauri:build
```

**Output locations:**
| Platform | Installer Path |
|----------|---------------|
| Windows | `src-tauri/target/release/bundle/nsis/TeamFinder_x.x.x_x64-setup.exe` |
| Windows | `src-tauri/target/release/bundle/msi/TeamFinder_x.x.x_x64_en-US.msi` |
| macOS | `src-tauri/target/release/bundle/dmg/TeamFinder_x.x.x_aarch64.dmg` |
| Linux | `src-tauri/target/release/bundle/appimage/TeamFinder_x.x.x_amd64.AppImage` |
| Linux | `src-tauri/target/release/bundle/deb/team-finder_x.x.x_amd64.deb` |

### Tauri Features

- System tray with quick actions
- Native file save dialogs
- Global keyboard shortcuts
- Auto-updater ready
- ~5MB installer size (vs 150MB+ Electron)

### Configuration

- `src-tauri/tauri.conf.json` — app name, window size, permissions
- `src-tauri/capabilities/default.json` — plugin permissions (fs, dialog, store)
- `src-tauri/src/lib.rs` — Rust backend commands and tray setup

---

## Mobile Build (Capacitor)

### Setup

```bash
npx cap add android    # One-time setup
npx cap add ios        # macOS only, one-time
```

### Build & Run

```bash
npm run build          # Build Vite
npx cap sync           # Copy dist/ to native projects
npm run cap:android    # Open Android Studio
npm run cap:ios        # Open Xcode
```

Or combined:

```bash
npm run mobile:build   # build + cap sync
```

### Android APK

In Android Studio:
1. **Build** > **Generate Signed Bundle / APK**
2. Select **APK**
3. Create or select a keystore
4. Build Release

### Configuration

- `capacitor.config.ts` — app ID (`com.teamfinder.app`), web dir, splash screen
- `android/` — full Android project (Gradle)
- Native plugins: Filesystem, Haptics, Preferences, Share, Splash Screen

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Required
VITE_GEMINI_API_KEY=your_google_gemini_api_key

# Required for auth & data sync
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GEMINI_API_KEY` | Yes | Google Gemini API key for project generation |
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase publishable anon key |

**Security note:** These are baked into the client bundle at build time via Vite's `define` config. The Supabase anon key is safe to expose (RLS protects data). The Gemini key should ideally go through a backend proxy in production.

---

## Code Quality Tool

A standalone Python CLI for linting Python files, located in `tools/code_checker/`.

**Powered by:** [Ruff](https://docs.astral.sh/ruff/) — 10-100x faster than pylint, written in Rust.

### Install

```bash
pip install ruff
```

### Usage

```bash
# Basic analysis
python -m tools.code_checker path/to/file.py

# Analyze a folder
python -m tools.code_checker path/to/folder/

# Auto-fix issues
python -m tools.code_checker path/ --fix

# Save report as JSON
python -m tools.code_checker path/ --report report.json

# Save report as text
python -m tools.code_checker path/ --report report.txt

# Disable colors
python -m tools.code_checker path/ --no-color
```

### Output

Issues are grouped by severity with color-coded terminal output:

| Severity | Color | Rule Prefixes |
|----------|-------|---------------|
| **Errors** | Red | E (style), F (pyflakes), S (security) |
| **Warnings** | Yellow | W, B (bugbear), T, UP (upgrade), RUF |
| **Conventions** | Blue | C, N (naming), I (isort), D (docstring), ANN |

### Score

```
Score = max(0.0, 10.0 - errors*0.5 - warnings*0.2 - conventions*0.05)
```

A score of 10.0 means no issues found.

---

## Pull Request Guide

Full PR standards, templates, and review process are documented in a dedicated file:

**[PULL_REQUESTS.md](PULL_REQUESTS.md)**

Covers:
- **Branch naming** — `feat/`, `fix/`, `refactor/`, `docs/`, `chore/`, `hotfix/`
- **Commit message format** — `<type>: <imperative summary>`
- **PR template** — copy-paste template with summary, changes, test plan, checklist
- **PR checklist** — code quality, security, React best practices, services, database
- **Review process** — author responsibilities, reviewer guidelines, merge rules
- **Labels** — `feature`, `bug`, `refactor`, `docs`, `ui`, `security`, `breaking`
- **Real examples** — feature PR, bug fix PR, refactor PR with full bodies

---

## Troubleshooting

### "VITE_GEMINI_API_KEY is not defined"
Create a `.env` file in the project root with your API key. Restart the dev server after creating it.

### "Email rate limit exceeded" on registration
Supabase free tier limits to 2 emails/hour. Configure custom SMTP in Supabase → Authentication → Settings → SMTP. Gmail with an App Password works well.

### "For security purposes, you can only request this after X seconds"
Supabase auth rate limiter. Wait the indicated time and try again.

### Tauri build fails with "icon not found"
Run `npx tauri icon public/Icon.png` to generate all required icon sizes in `src-tauri/icons/`.

### Port 5173 already in use
Another Vite instance is running. Kill it with `npx kill-port 5173` or change the port in `vite.config.ts`.

### Android build fails on Capacitor sync
Make sure you've run `npx cap add android` first, and that `dist/` exists (run `npm run build` before sync).

### Supabase connection fails
Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in `.env` and the dev server was restarted after adding them.
