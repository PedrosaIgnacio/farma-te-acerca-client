# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

FarmaTeAcerca is the frontend for a thesis project (Analista de Sistemas) built for Farmacity's
People Analytics area. The system manages branch-relocation requests ("solicitudes de
relocalización") submitted by store employees, and gives HR and store managers tools to act on
them. It implements the functional analysis approved by the thesis director: three roles, each
with one dedicated screen, sharing a common login/session layer.

This repo currently contains **frontend only**, with all data mocked in `src/data/mockData.ts`.
There is no backend integration yet — see "Known gaps / design decisions" below.

## Commands

```bash
yarn install    # install deps (nodeLinker is node-modules, not PnP — see .yarnrc.yml)
yarn dev        # start Vite dev server (default port 5173)
yarn build      # tsc -b (typecheck) && vite build — treat TS errors as build failures
yarn preview    # preview the production build locally
yarn lint       # oxlint
```

There is no test suite configured in this repo yet.

## Language policy

Everything programmatic — identifiers (types, variables, functions, files/folders), code
comments, commit messages, and this CLAUDE.md itself — is written in **English**, for consistency
and because it's the shared language a wider set of contributors/tools can work with.

**User-facing text stays in Spanish.** Labels, button copy, page titles, form placeholders, and
any string literal a store employee or HR/DT user actually reads on screen (including the domain
value strings `"Activa"`, `"En curso"`, `"Mudanza"`, branch names, etc.) is intentionally Spanish
— this is the language of the actual product (Farmacity, Argentina). Don't translate those when
touching nearby code; only the surrounding identifiers/comments follow the English rule.

Route paths (`/colaborador`, `/capital-humano`) are treated as part of that Spanish product
surface, not as internal identifiers, and are left as-is.

## Domain model and roles

Three roles, each mapped 1:1 to a route and a screen:

- **`collaborator`** (`/colaborador`, `HistoryPage` + `NewRequestPage`, wrapped by
  `RequestsProvider`) — a store employee. Loads their current branch, desired branch, a reason
  (`Reason`), and an optional description to submit a relocation request. The screen also shows
  the employee's own request history and blocks submitting a duplicate active/in-progress request
  to the same branch.
- **`hc`** (`/capital-humano`, `HumanCapitalPage`) — Capital Humano (HR). Looks up relocation
  requests *for* a given branch (i.e. filtered by the branch employees want to move **to**,
  `desiredBranch`), inspects a request's detail in a side sheet, and has an Analytics tab
  (KPIs + charts by region/status) with a report-download action.
- **`dt`** (`/dt`, `DTPage`) — a branch manager (Director Técnico). Looks up nearby employees
  who could cover contingencies at their branch.

`RequestStatus` values (`Activa`, `En curso`, `Cancelada`, `Finalizada` — kept in Spanish per the
language policy above, since they're rendered directly in the UI) and their badge colors are
defined once in `src/data/mockData.ts` (`STATUS_STYLES`) and consumed by
`components/shared/StatusBadge.tsx` — add new states there, not inline in pages.

## Architecture

**Auth/session** (`src/context/AuthContext.tsx`): a single `Session { user, role }` held in
React context and mirrored to `sessionStorage` (key `farma-te-acerca:session`) so a page refresh
mid-demo doesn't drop the user back to `/login`. Login is fully mocked: any username/legajo with
password `demo` succeeds; the role is chosen via a selector on the login screen (stands in for
what a real backend would resolve from the authenticated user). There is no real password
validation, lockout persistence, or SSO — the login screen only simulates the attempt-counter and
Microsoft 365 button described in the functional spec.

**Routing / RBAC** (`src/App.tsx` + `src/routes/guards.tsx`): route protection is composed from
three small guards rather than one monolithic check:
- `RequireAuth` — redirects to `/login` if there's no session, otherwise renders `AppShell`
  (header + role-scoped sidebar) with an `<Outlet />`.
- `RequireRole({ allow })` — nested inside `RequireAuth`'s subtree; redirects to the caller's own
  role home if their role isn't in `allow`, instead of showing a 403.
- `RootRedirect` — sends `/` to the current role's home, or to `/login`.

`src/config/navigation.ts` is the single source of truth mapping `Role` → home path (`ROLE_HOME`),
display label (`ROLE_LABEL`), and sidebar nav items (`NAV`). Both the router and `AppShell`'s
sidebar read from it, so adding a route for a role means updating this file, not duplicating path
strings in multiple components.

**UI primitives** (`src/components/ui/`): shadcn/ui components (Button, Card, Badge, Input,
Label, Textarea, Tabs, Select, Dialog, Sheet) hand-ported from the original design artifact —
this project does not use the `shadcn` CLI, so if more primitives are needed later, port them the
same way (Radix primitive + `cva` variants + the `cn()` helper from `src/lib/utils.ts`) rather
than introducing a different component convention. `Sheet` is built on the same
`@radix-ui/react-dialog` primitive as `Dialog`, just with side-slide variants via `cva`.

**Styling**: Tailwind v4, configured CSS-first in `src/index.css` (no `tailwind.config.js`) via
`@theme inline` mapping shadcn's CSS-variable tokens (`--background`, `--primary`, etc.) to
Tailwind utilities. Brand green (`#1F7A4D`) and neutral `stone-*`/`sky-*`/`amber-*`/`emerald-*`
Tailwind palette colors are used directly in page components rather than added as theme tokens —
follow that existing pattern for consistency rather than mixing in new arbitrary hex values.

**Data layer** (`src/data/mockData.ts`, `src/types/index.ts`): all branches, requests, and nearby
employees are static arrays with no fetching/caching layer. When a real backend is introduced,
these are the shapes to replace/wrap; nothing else in the app currently assumes an async data
source (no loading/error states exist yet).

## Known gaps / design decisions

- The original design artifact's `HumanCapitalPage` filtered requests with
  `s.currentBranch === branch || true`, which ignored the selected branch entirely. The
  functional spec calls for filtering by the branch employees are requesting to move **to**, so
  `HCRequest` gained a `desiredBranch` field and the filter was corrected to use it. Keep this
  in mind if reconciling against the original artifact — the field is new, not a port.
- Report "download" (`HumanCapitalPage`) and "Contactar"/"Solicitar cobertura" actions
  (`HumanCapitalPage`, `DTPage`) are non-functional buttons — no email or file-export
  implementation exists yet.
- `yarn lint` currently reports four `react-refresh/only-export-components` warnings (in
  `button.tsx`, `badge.tsx`, `AuthContext.tsx`, `RequestsContext.tsx`) from co-locating `cva`
  variants / the `useAuth`/`useRequests` hooks with their components. This is expected with the
  shadcn convention used here and is not a regression to chase.
- The codebase was brought in line with the English-only rule under "Language policy" in one pass
  (types, mock data, contexts, pages, and this file were renamed/translated together). If you find
  a stray Spanish identifier or comment outside of UI-facing strings, treat it as drift to fix,
  not as an exception to preserve.
