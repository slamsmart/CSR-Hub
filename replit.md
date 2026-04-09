# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## CSR Hub Application

**Purpose**: Enterprise CSR marketplace platform connecting Indonesian corporations with NGOs.

**Roles**: super_admin, admin, verifikator, auditor, perusahaan, ngo, donor, public  
**Language**: Bahasa Indonesia | **Currency**: Rupiah (IDR)

### Demo Accounts
- admin@csrhub.id / 123  
- budi@pertamina.com / 123 (perusahaan)  
- ahmad@rumahzakat.org / 123 (ngo)  
- verifikator@csrhub.id / 123  
- auditor@csrhub.id / 123

### Pages & Routes
| Route | Page | Visibility |
|-------|------|-----------|
| `/` | Landing page (6 value props, AI showcase, leaderboard preview, GRI teaser) | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/dashboard` | Stats dashboard | Logged-in |
| `/proposals` | Proposal list | Public |
| `/proposals/new` | Submit proposal | ngo |
| `/proposals/:id` | Proposal detail | Public |
| `/organizations` | NGO/Company list | Public |
| `/projects` | Active projects | Public |
| `/cofunding` | Co-funding management | perusahaan/admin |
| `/leaderboard` | Company CSR rankings | Public |
| `/sustainability` | GRI 2021 report (auto-generated) | All |
| `/notifications` | User notifications | Logged-in |
| `/audit` | Audit log | admin/auditor |
| `/users` | User management | admin |

### Key API Endpoints
- `GET /api/dashboard/stats` — platform-wide stats
- `GET /api/dashboard/leaderboard` — top companies by CSR funding
- `GET /api/dashboard/sustainability-report/:orgId` — GRI 2021 report
- `GET /api/proposals` — paginated proposals (status, category filters)
- `POST /api/proposals` — create proposal
- `GET /api/organizations` — org list
- `POST /api/auth/login` — login (returns JWT)
- `POST /api/auth/register` — register new user

### Key Notes
- API returns camelCase (`budgetTotal`, `targetBeneficiaries`, `sdgGoals`, `progressPercent`)
- Always use fallback: `p.budgetTotal ?? p.budget_requested`
- `formatRupiah` is null-safe
- Auth token stored in `localStorage` key `csr_hub_token`
- Password hashing: HMAC-SHA256 with SECRET + "csr-hub-salt"
