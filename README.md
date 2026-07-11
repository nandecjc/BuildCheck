# BuildCheck

Professional local-first compliance inspector UI and mock services.

## Overview
BuildCheck is a Vite + React 19 + TypeScript application designed as a lightweight, offline-friendly inspection and compliance dashboard. It includes a local mock authentication and database (no external setup required) for rapid demos and development.

Key features
- Modern React 19 app using Vite
- Local mock auth and DB for quick development (`mockAuth`, `mockDb`)
- Pages: Dashboard, Inspection Detail, Regulations, Reports, Auth
- Developer-friendly tooling: TypeScript, Tailwind, Lucide icons, Motion

## Repository Structure
- `buildcheck_-automated-building-complience/src/` – main app source
	- `components/` – UI components
	- `pages/` – page routes (`Auth`, `Dashboard`, `InspectionDetail`, `Regulations`, `Reports`)
	- `services/` – `localService.ts` mock DB + auth, `analysisService.ts`
	- `context/` – app contexts (theme)
	- `lib/` – utilities
- `types.ts` – shared types used across root and nested app
- `tsconfig.json`, `vite.config.ts`, `package.json` – project config

## Quick Setup (macOS / Linux / Windows WSL)
Requirements
- Node.js LTS (recommended >= 18)
- npm (or pnpm/yarn) installed

Install dependencies:

```bash
cd /path/to/BuildCheck
npm install
```

Run development server:

```bash
npm run dev
# Open http://localhost:5173
```

Build for production:

```bash
npm run build
# Preview build
npm run preview
```

Type-check (lint):

```bash
npm run lint
# (runs `tsc --noEmit`)
```

## Environment variables
`vite.config.ts` reads `ANALYSIS_ENGINE_KEY` (used by `analysisService`). For local development you can leave it empty; to configure a real analysis engine, create a `.env` file at the repo root:

```
ANALYSIS_ENGINE_KEY=your_key_here
```

## Mock Services (no external setup)
- `buildcheck_-automated-building-complience/src/services/localService.ts`
	- `mockAuth` exposes `signIn`, `signUp`, `signOut`, `onAuthStateChanged`, and `currentUser` stored in `localStorage`.
	- `mockDb` exposes `getInspections`, `saveInspection`, `getRegulations`, `getReports`, `saveReport`, `deleteReport` and stores data in `localStorage` keys for persistence in the browser.

Reset mock data in the browser by clearing the `localStorage` keys:

```js
localStorage.removeItem('buildcheck_inspections')
localStorage.removeItem('buildcheck_current_user')
localStorage.removeItem('buildcheck_reports')
// etc.
```

## Scripts (package.json)
- `npm run dev` — start Vite dev server
- `npm run build` — produce production build
- `npm run preview` — preview built app
- `npm run lint` — run `tsc --noEmit` to type-check

## Development Notes & Troubleshooting
- TypeScript and Vite configuration use modern module settings. If you see module resolution complaints, ensure your local `node`/`npm` versions are up to date.
- If TypeScript complains about JSX or default imports, ensure `tsconfig.json` contains `jsx: "react-jsx"` and `esModuleInterop: true`.
- If you ever need to re-generate initial demo inspections/regulations, delete the corresponding `localStorage` keys and reload the app.

## Important Files
- [buildcheck_-automated-building-complience/src/pages/Auth.tsx](buildcheck_-automated-building-complience/src/pages/Auth.tsx)
- [buildcheck_-automated-building-complience/src/services/localService.ts](buildcheck_-automated-building-complience/src/services/localService.ts)
- [types.ts](types.ts)
- [tsconfig.json](tsconfig.json)
- [vite.config.ts](vite.config.ts)

## Commit & Code Style
- Keep type-safety: run `npm run lint` before committing.
- Use small, focused commits; descriptive commit messages are recommended.

## Contact / Next Steps
If you'd like I can:
- Start the dev server and open the app in a browser
- Add a CI workflow to run `npm run lint` and `npm run build` automatically on push
- Add end-to-end tests or Storybook for components

---
Generated on 2026-07-11 — if you'd like the README tailored with screenshots or more architecture diagrams, tell me where you'd like them included.
