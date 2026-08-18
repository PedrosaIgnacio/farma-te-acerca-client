# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

FarmaTeAcerca is the frontend for a thesis project (Analista de Sistemas) built for Farmacity's
People Analytics area. The system manages branch-relocation requests ("solicitudes de
relocalización") submitted by store employees, and gives HR and store managers tools to act on
them. It implements the functional analysis approved by the thesis director: three roles, each
with one dedicated screen, sharing a common login/session layer.

This repo is the frontend only; it talks to `farma-te-acerca-api` (a sibling repo, run separately)
over HTTP. `FRONTEND_INTEGRATION.md` in that repo is the source of truth for every endpoint shape —
consult it before changing request/response handling. The handful of static domain constants that
aren't fetched from the API (`Reason` options, status badge colors) live in `src/data/constants.ts`.

## Commands

```bash
yarn install    # install deps (nodeLinker is node-modules, not PnP — see .yarnrc.yml)
yarn dev        # start Vite dev server (default port 5173)
yarn build      # tsc -b (typecheck) && vite build — treat TS errors as build failures
yarn preview    # preview the production build locally
yarn lint       # oxlint
```

There is no test suite configured in this repo yet. Running the app end-to-end requires the API
(`yarn start:dev` in `farma-te-acerca-api/`) up at the URL in `VITE_API_BASE_URL` (`.env`, defaults
to `http://localhost:3000`), with its `CORS_ORIGIN` allowing this app's dev-server origin.

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
defined once in `src/data/constants.ts` (`STATUS_STYLES`) and consumed by
`components/shared/StatusBadge.tsx` — add new states there, not inline in pages. The status strings
themselves come back from the API pre-translated; nothing on the frontend maps them.

## Architecture

**Auth/session** (`src/context/AuthContext.tsx`): a `Session { user, role, accessToken }` held in
React context and mirrored to `sessionStorage` (key `farma-te-acerca:session`, read/written via
`src/lib/session.ts` so the plain-function API client can reach it without importing React context)
so a page refresh mid-demo doesn't drop the user back to `/login`. `login(legajo, password)` is
async and calls `POST /auth/login`; the role comes back from the server, not from a UI selector.
Password lockout (`Profile.failedAttempts`) and reset codes are owned by the API — the frontend
only surfaces whatever `message` a 401/400 body contains. The "Iniciar sesión con Microsoft 365"
button is still a stub (real Azure AD SSO needs Farmacity's tenant credentials, not available yet).
There is no refresh-token flow: `accessToken` is good for `expiresIn` (1h), and `src/lib/api.ts`
bounces to `/login` on the next 401 once it expires — enough for a thesis demo session.

**API client** (`src/lib/api.ts`): `apiFetch`/`apiJson`/`apiBlob` inject `Authorization: Bearer
<accessToken>` (via `src/lib/session.ts`) and `VITE_API_BASE_URL` (`.env`) on every call. A 401
while a session exists is treated as an expired/invalid token — the session is cleared and the
browser is redirected to `/login`; a 401 with no session (e.g. bad login credentials) is left for
the caller to surface inline. `ApiError` carries `status` + the parsed JSON error `body`, so
call sites needing more than the message (e.g. the 409 duplicate-request conflict) can read it.

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

**Data layer** (`src/types/index.ts`): branches, requests, HC requests, nearby employees, and
analytics all come from the API — nothing is fetched-and-cached beyond simple `useEffect`/`useState`
per page (`useBranches` in `src/hooks/`, ad hoc fetches in `RequestsContext` and the HC/DT pages).
Every fetch has a `loading`/`error` state; there's no shared query cache (React Query et al.) since
the app's data needs are simple enough that one wasn't justified. `RequestsContext` still owns the
collaborator's request history client-side (fetched on mount via `GET /requests`), but the
duplicate-active-request check and id/date generation that used to live there moved server-side —
`POST /requests` returns 409 on a conflict and the frontend just renders that response's `message`.

## Known gaps / design decisions

- The original design artifact's `HumanCapitalPage` filtered requests with
  `s.currentBranch === branch || true`, which ignored the selected branch entirely. The
  functional spec calls for filtering by the branch employees are requesting to move **to**, so
  `HCRequest` gained a `desiredBranch` field and the filter was corrected to use it (now via the
  API's `GET /hc/requests?desiredBranchId=` query param). Keep this in mind if reconciling against
  the original artifact — the field is new, not a port.
- "Contactar" (`HumanCapitalPage`) and "Solicitar cobertura" (`DTPage`) are plain `mailto:` links
  using the `email` field already on `HCRequest`/`NearbyEmployee` — there is no server-sent email,
  per the case de uso's literal wording ("se abre un mail"). If a real templated server-sent email
  is wanted later, that's new backend scope, not a frontend change.
- The new solicitud's initial `status` is whatever `POST /requests` returns (`"Activa"` as of this
  writing) — this had been unresolved with the thesis director at integration time; don't hardcode
  UI copy that assumes a specific initial status without re-checking the API.
- Azure/365 SSO ("Iniciar sesión con Microsoft 365") is a stub — it shows an inline message instead
  of attempting OAuth, since exercising it needs Farmacity's real Azure AD tenant credentials.
- `NewRequestPage`'s "sucursal actual" select is pre-filled and locked to the collaborator's
  assigned branch — `GET /auth/me` now returns `currentBranchId`/`currentBranch` (the active
  `ColabSucursal` row, resolved server-side in `AuthService.me`), fetched once by
  `RequestsProvider` and exposed via `useRequests()`. Only "sucursal deseada" is user-editable.
  If a collaborator has no active branch assignment, the select shows "Sin sucursal asignada" and
  the submit button stays disabled — this shouldn't happen with real HR-managed data but the seed
  should keep every demo `collaborator` account assigned to one.
- `yarn lint` currently reports four `react-refresh/only-export-components` warnings (in
  `button.tsx`, `badge.tsx`, `AuthContext.tsx`, `RequestsContext.tsx`) from co-locating `cva`
  variants / the `useAuth`/`useRequests` hooks with their components. This is expected with the
  shadcn convention used here and is not a regression to chase.
- The codebase was brought in line with the English-only rule under "Language policy" in one pass
  (types, mock data, contexts, pages, and this file were renamed/translated together). If you find
  a stray Spanish identifier or comment outside of UI-facing strings, treat it as drift to fix,
  not as an exception to preserve.
