# CLAUDE.md

#Este archivo es exclusivo para la IA que programa (como Claude Code). Es una guía de ingeniería de software viva que le dice cómo escribir #código en este repositorio específico para no romper la arquitectura.

#¿Qué debe contener?

-El stack tecnológico exacto y los comandos de desarrollo (npm run dev, etc.).
-La estructura de carpetas y las reglas de dónde va cada cosa.
-Los patrones de arquitectura (como el flujo BFF y las cookies httpOnly que vimos).
-El sistema de diseño (tokens de color, tipografía).
-Las reglas de Git (Conventional Commits).
-Regla de oro: Es un archivo de normas técnicas de desarrollo. No cambia a menos que cambies la arquitectura del proyecto.

This file provides strict architectural guidelines and structural rules for Claude Code when working in this repository.

## Project Overview

- **Stack**: React 19 (UI) + Vite 8 (Bundler) + TypeScript 6 (Strict Typed) + React Router 7 (Routing) + Tailwind CSS v4 (Styling via @tailwindcss/vite) + Axios (HTTP Client)

- **Aesthetic**: Dark Cyberpunk — neon accents, glassmorphism, gradient typography
- **Architecture**: SPA with client-side route guards based on user role

## Commands

```bash
pnpm dev        # Dev server at http://localhost:5173
pnpm build      # tsc -b && vite build → dist/
pnpm lint       # ESLint
pnpm preview    # Preview production build
```

No test suite is configured.

---

## Folder Structure (strict)

New files must be placed according to this map — do not invent new top-level directories under `src/`:

```
src/
├── api/
│   ├── client.ts        # Axios instance (JWT interceptor)
│   └── index.ts         # All service objects (authApi, eventsApi, etc.)
├── components/
│   ├── ui/              # Primitive, reusable design system components
│   └── shared/          # Layout wrappers, Navbar, Footer, global components
├── context/             # React Context providers (AuthContext, etc.)
├── features/            # Domain-driven modules (one folder per feature)
│   └── [feature_name]/  # Co-located components, hooks, and state per feature
├── routes/              # Route guard wrappers only
│   ├── AuthGuard.tsx    # Redirects unauthenticated users to /login
│   └── AdminGuard.tsx   # Verifies user.role === 'ADMIN', redirects otherwise
├── pages/               # Top-level page components wired to routes in App.tsx
├── constants/           # App-wide constants and env fallbacks
├── types/               # TypeScript interfaces (index.ts)
└── index.css            # Global styles and Tailwind v4 @theme tokens
```

---

## 1. API Layer

All HTTP calls **must** go through the Axios instance in [src/api/client.ts](src/api/client.ts). Never write inline `axios` or `fetch` calls inside components or pages.

Every new endpoint must be declared as a method on a named service object in [src/api/index.ts](src/api/index.ts) (e.g., `adminApi.fetchReports()`). The JWT is read from `localStorage` and injected automatically as `Authorization: Bearer <token>`.

The Vite dev proxy rewrites `/api/*` → `http://localhost:3000/*`. The base URL is controlled by `VITE_API_URL`.

---

## 2. Authentication & Route Guards

[src/context/AuthContext.tsx](src/context/AuthContext.tsx) is the single source of truth for session state. Use `useAuth()` to access `{ user, token, login, register, logout, isAuthenticated, loading }`.

**JWT is stored in `localStorage` — this is an XSS risk.** To mitigate exposure, all protected UI must be gated by route guards, not by hiding routes:

- Pages requiring login → wrap with `<AuthGuard>`
- Pages requiring admin → wrap with `<AdminGuard>`

**`AdminGuard` must explicitly check `user.role === 'ADMIN'`** and redirect to `/` if the check fails. The obfuscated admin route (`VITE_ADMIN_ROUTE`) is a secondary deterrent, not a security boundary — never rely on it alone.

Route wiring lives entirely in [src/App.tsx](src/App.tsx). Do not define routes anywhere else.

---

## 3. Instagram OAuth Flow

When editing the Instagram integration, respect this exact sequence:

1. `Profile.tsx` opens a popup via `authApi.getInstagramAuthUrl()`
2. Meta redirects to `/social/callback?code=...` after authorization
3. `SocialCallback.tsx` posts the code to the backend via `socialApi.instagramCallback()`
4. The popup emits `postMessage` to the parent window, then closes
5. `Profile.tsx` catches the message and calls `socialApi.getStatus()` to refresh UI

Constraint: requires a **Business or Creator** Instagram account. In Meta Dev mode, the user must be added as a tester.

---

## 4. Design System

The app uses a dark cyberpunk palette defined in [src/index.css](src/index.css) via Tailwind v4's `@theme` block.

**Never hardcode hex values.** Always use custom theme utilities:

| Element | Custom Utility | Notes |
|---|---|---|
| Accent colors | `text-neon-cyan`, `bg-neon-purple`, `border-neon-pink` | Interactions, states, highlights |
| Page backgrounds | `bg-dark-900`, `bg-dark-800`, `bg-dark-700`, `bg-dark-600` | Section depth hierarchy |
| Glass container | `.glass` | `backdrop-blur` + semi-transparent border |
| Neon glow effects | `.glow-cyan`, `.glow-purple`, `.glow-pink` | Applied via `box-shadow` |
| Gradient text | `.text-gradient` | Cyan → Purple → Pink — use on headings |

### Component rules

- **Atomic design**: Compose from primitives in `src/components/ui/` (`GlassCard`, `GradientButton`, `FormInput`, `PasswordInput`, `LoadingSpinner`, `Toast`, `ErrorBanner`). Do not rewrite layout patterns inline.
- **Accessibility**: Every `<input>` must have an associated `<label>` or `aria-label`. Every `<button>` must declare `type="button"` or `type="submit"`.
- **Responsiveness**: Design mobile-first. Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`).

---

## 5. Admin Panel

The admin route and API prefix are obfuscated via environment variables with hardcoded fallbacks in [src/constants/admin.ts](src/constants/admin.ts). The Admin page is **lazy-loaded** in `App.tsx`.

The admin panel has its own credential-based login gate independent of `AuthContext`. Access is only granted when the authenticated user's `role` equals `'ADMIN'` — this check is the real security boundary.

---

## 6. Environment Variables

```env
VITE_API_URL=/api                          # Backend base proxy URL
VITE_ADMIN_ROUTE=/panel-g9k2x             # Client-side path for admin backoffice
VITE_ADMIN_API_PREFIX=control-panel-7f3a  # Endpoint prefix for admin API calls
```

---

## 7. Infraestructura y Servicios Externos

### Frontend — Vercel
El frontend se despliega automáticamente en Vercel desde `main`. Variable de entorno requerida: `VITE_API_URL` apuntando al backend en Render.

### Backend — Render (Free Tier)
El backend NestJS corre en Render. El tier gratuito incluye 750 horas/mes — con un solo servicio nunca se supera el límite.

**Problema conocido**: Render apaga el servidor tras 15 minutos de inactividad (cold start de 10-30 seg).

**Solución activa — Keep-Alive con cron-job.org**: Un cronjob pinga el backend cada 15 minutos para mantenerlo siempre despierto.
- Panel: https://console.cron-job.org/jobs
- URL pineada: `https://backend-evento.onrender.com/health`
- Frecuencia: cada 15 minutos
- Si el cronjob se desactiva, el cold start vuelve a aparecer en producción.

### Caché de eventos en el frontend
`src/api/eventsCache.ts` implementa stale-while-revalidate con localStorage (TTL 10 min). Los componentes `Home` y `UpcomingEventsCarousel` muestran datos cacheados al instante y refrescan en background. Si no hay caché, muestran skeleton cards (`EventCardSkeleton`) mientras carga la API.

---

## 8. Git Workflow

**Never commit directly to `main`.** All changes must go through a branch:

```bash
git checkout -b feature/<name>   # or fix/<name>, chore/<name>
# make changes + commits
git push origin feature/<name>
git checkout main && git merge --no-ff feature/<name>
git push origin main
```

Commit prefixes: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`. Deploy only happens from `main` after merge.
