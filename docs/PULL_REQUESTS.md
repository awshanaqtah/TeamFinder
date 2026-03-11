# Pull Request Guide

Standards and templates for contributing to TeamFinder via pull requests.

---

## Table of Contents

1. [Branch Naming](#branch-naming)
2. [Commit Message Format](#commit-message-format)
3. [PR Template](#pr-template)
4. [PR Checklist](#pr-checklist)
5. [Review Process](#review-process)
6. [PR Types & Labels](#pr-types--labels)
7. [Examples](#examples)

---

## Branch Naming

Use this format:

```
<type>/<short-description>
```

| Type | Use for |
|------|---------|
| `feat/` | New features — `feat/skill-gap-modal` |
| `fix/` | Bug fixes — `fix/svg-path-corruption` |
| `refactor/` | Code restructuring — `refactor/src-layout` |
| `docs/` | Documentation only — `docs/add-api-reference` |
| `style/` | UI/CSS changes — `style/dark-mode-tweaks` |
| `chore/` | Tooling, deps, config — `chore/update-vite-6` |
| `test/` | Adding tests — `test/teammate-matching` |
| `hotfix/` | Urgent production fix — `hotfix/auth-crash` |

**Rules:**
- Always branch from `main`
- Use lowercase with hyphens (no underscores or spaces)
- Keep it under 40 characters

---

## Commit Message Format

```
<type>: <short summary in imperative mood>

<optional body — explain WHY, not what>

Co-Authored-By: Name <email>
```

**Types:** `feat`, `fix`, `refactor`, `docs`, `style`, `chore`, `test`, `perf`

**Good examples:**
```
feat: add skill gap analysis modal
fix: resolve SVG path corruption in ProjectCard
refactor: move all source files into src/ directory
docs: add full API reference to documentation
chore: update Supabase SDK to v2.99
```

**Bad examples:**
```
updated stuff          # vague
Fixed the bug          # past tense, no type
feat: Add a new feature that allows users to...  # too long
```

---

## PR Template

Copy this when creating a pull request:

```markdown
## Summary

<!-- 1-3 bullet points describing what this PR does -->

-

## Changes

<!-- List the specific files/areas changed -->

-

## Motivation

<!-- Why is this change needed? Link to issue if applicable -->

Closes #

## Screenshots

<!-- If UI changes, add before/after screenshots -->

| Before | After |
|--------|-------|
|        |       |

## Test Plan

<!-- How was this tested? -->

- [ ] Ran `npm run dev` and verified in browser
- [ ] Tested on desktop (Tauri) if applicable
- [ ] Tested on mobile (Capacitor) if applicable
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No console errors in browser dev tools

## Checklist

- [ ] Code follows project conventions (TypeScript strict, no `any`)
- [ ] No secrets or API keys committed
- [ ] New services have corresponding type definitions in `types.ts`
- [ ] Component props are typed (no inline `any` or `object`)
- [ ] No unused imports or dead code
- [ ] Supabase RLS policies cover new tables (if applicable)
```

---

## PR Checklist

Every PR must pass these checks before merge:

### Code Quality
- [ ] No `any` types — use proper generics or specific types
- [ ] No `as any` casts — use `as SpecificType`
- [ ] No unused imports or variables
- [ ] No `console.log` left in (use `console.error` for actual errors only)
- [ ] SVG paths are valid (not garbled/merged)

### Security
- [ ] No API keys or secrets in code (use `.env`)
- [ ] `.env` is in `.gitignore`
- [ ] Supabase queries use RLS (no `service_role` key in frontend)
- [ ] User input is validated before use (especially `JSON.parse`, `atob`)
- [ ] No `dangerouslySetInnerHTML` without sanitization

### React Best Practices
- [ ] `useEffect` cleanup functions for timers, subscriptions, event listeners
- [ ] `useState` has proper generic types: `useState<Type | null>(null)`
- [ ] No state updates on unmounted components
- [ ] Keys on list items are stable and unique (not array index)
- [ ] Event handlers don't recreate on every render (use `useCallback` if needed)

### Services
- [ ] Service functions are pure (no side effects beyond their stated purpose)
- [ ] Error handling with `try/catch` on external calls (Supabase, Gemini)
- [ ] Functions return proper types (not `Promise<any>`)

### Database (if schema changes)
- [ ] Migration SQL is in `database/`
- [ ] RLS policies are defined for new tables
- [ ] Indexes are added for foreign keys and frequently queried columns
- [ ] `ON DELETE CASCADE` or `SET NULL` is set appropriately

---

## Review Process

### For Authors

1. **Self-review first** — read your own diff before requesting review
2. **Keep PRs small** — under 400 lines changed when possible
3. **One concern per PR** — don't mix features with refactors
4. **Write a clear summary** — reviewers shouldn't have to guess what changed
5. **Link the issue** — use `Closes #123` to auto-close related issues

### For Reviewers

1. **Check the PR type** — bug fix? feature? refactor? Review accordingly
2. **Run it locally** — `git checkout <branch>` and `npm run dev`
3. **Focus on:**
   - Logic errors and edge cases
   - Security vulnerabilities (injection, XSS, exposed secrets)
   - Type safety (no `any`, proper null checks)
   - Performance (unnecessary re-renders, missing cleanup)
4. **Be specific** — point to the exact line and suggest a fix
5. **Approve or request changes** — don't leave PRs in limbo

### Merge Rules

| Condition | Action |
|-----------|--------|
| 1 approval + all checks pass | Merge allowed |
| Changes requested | Must address before re-review |
| Conflicts with main | Author must rebase |
| Failing build | Do not merge |

---

## PR Types & Labels

Apply these labels to categorize PRs:

| Label | Color | Description |
|-------|-------|-------------|
| `feature` | `#0E8A16` green | New functionality |
| `bug` | `#D73A4A` red | Bug fix |
| `refactor` | `#6F42C1` purple | Code restructuring (no behavior change) |
| `docs` | `#0075CA` blue | Documentation updates |
| `ui` | `#E4E669` yellow | Visual/styling changes |
| `security` | `#B60205` dark red | Security fix |
| `dependencies` | `#EDEDED` gray | Dependency updates |
| `breaking` | `#FF0000` red | Breaking changes |
| `good first issue` | `#7057FF` purple | Good for new contributors |

---

## Examples

### Example 1: Feature PR

**Branch:** `feat/skill-proficiency-editor`

**Title:** `feat: add skill proficiency editor with verification`

**Body:**
```markdown
## Summary

- Add SkillProficiencyEditor component for rating skills (Beginner/Intermediate/Expert)
- Add verification prompts for self-reported expert skills
- Persist proficiencies to Supabase `skill_proficiencies` table

## Changes

- `src/components/SkillProficiencyEditor.tsx` — new component
- `src/components/SkillConfidenceSelector.tsx` — new sub-component
- `src/services/proficiencyService.ts` — CRUD operations
- `src/types.ts` — added `SkillProficiency` interface
- `src/App.tsx` — wired up state and handlers

## Test Plan

- [x] Rate skills at all 3 levels
- [x] Verify expert prompt appears
- [x] Data persists on page reload (Supabase)
- [x] No TS errors
```

---

### Example 2: Bug Fix PR

**Branch:** `fix/team-composition-always-ml`

**Title:** `fix: team composition always returning ML template`

**Body:**
```markdown
## Summary

- Fix getRecommendedComposition() always matching the first template
- Root cause: OR conditions in loop weren't scoped per-template

## Changes

- `src/services/teamCompositionService.ts` — rewrote with keyword→template dictionary

## Motivation

Every project was getting ML team roles regardless of project type.
The loop iterated all templates but the OR conditions matched on the
first iteration every time.

Closes #42

## Test Plan

- [x] "Build a web app" → returns Web Development template
- [x] "ML prediction model" → returns Machine Learning template
- [x] "Security audit tool" → returns Security template
- [x] "Unknown topic" → returns General template
```

---

### Example 3: Refactor PR

**Branch:** `refactor/src-layout`

**Title:** `refactor: restructure project into src/ layout`

**Body:**
```markdown
## Summary

- Move all source files into src/ (components, services, data, lib)
- Update Vite alias, tsconfig paths, and index.html entry point
- Remove duplicate pylint_app, junk files (test.txt, metadata.json)

## Changes

- 50+ files moved from root → src/
- `vite.config.ts` — alias `@` points to `./src`
- `tsconfig.json` — paths updated to `./src/*`
- `index.html` — entry point updated to `/src/index.tsx`

## Motivation

Flat project structure was making the codebase hard to navigate.
Standard React/Vite convention uses src/ for source files.

## Test Plan

- [x] `npm run dev` starts without errors
- [x] All imports resolve correctly
- [x] `npm run build` produces working dist/
```
