# Ticky Global — Website Source Code

Full-stack marketing website + CMS for Ticky Global.
**Exported 13 August 2026 — includes: 10% price rise across all 5 countries with "starting from" labels, PPC Ads Specialist role, UK & US office contact details, collapsible mobile menu.**

## Stack
- **Frontend**: React 19 + TypeScript + Vite 7 + Tailwind CSS + shadcn/ui
- **Backend**: Hono + tRPC 11 (in `api/`)
- **Database**: MySQL via Drizzle ORM (`db/`)
- **Auth**: Email + password (bcrypt-hashed, database-backed). Admin account is created by the seed script.

## Project layout
| Path | What it is |
|---|---|
| `src/` | Frontend pages, sections, components, data |
| `api/` | Backend: tRPC routers, auth, DB queries |
| `db/` | Drizzle schema, migrations, seed script |
| `contracts/` | Types shared between frontend and backend |
| `public/images/` | Logos, hero images, review portraits |
| `dist/` | Production build output (generated) |

## Setup
```bash
npm install
cp .env.example .env   # fill in your own values (see below)
npm run db:push        # create database tables
npx tsx db/seed.ts     # optional: seed sample reviews/enquiries/pages
```

## Environment variables (.env)
```
DATABASE_URL=mysql://user:pass@host:3306/dbname
APP_SECRET=<long-random-string>          # signs session tokens
ADMIN_EMAIL=admin@yourdomain.com         # optional — seeded admin email
ADMIN_PASSWORD=<strong-password>         # optional — seeded admin password
VITE_GTM_ID=GTM-XXXXXXX                  # optional — activates tracking
PORT=3000
```

## Authentication
Email + password auth backed by the `users` table. Passwords are bcrypt-hashed
(cost factor 12) — plaintext passwords are never stored. Visitors register at
`/register` and sign in at `/login`; sessions are 30-day httpOnly cookies.

**Admin account:** running `npx tsx db/seed.ts` automatically creates the
admin account (default `admin@tickyglobal.com`, overridable via `ADMIN_EMAIL`
/ `ADMIN_PASSWORD` env vars). The seed is idempotent — safe to re-run.

## Commands
| Command | Purpose |
|---|---|
| `npm run dev` | Dev server with hot reload (port 3000) |
| `npm run build` | Production build → `dist/` |
| `npm start` | Run production server |
| `npm run check` | TypeScript type-check |
| `npm run db:push` | Sync schema to database |

## Deploying
A `Dockerfile` is included — the app is a single Node process serving
both the API and the built frontend on port 3000. Deploy to any
Node-capable host (Railway, Render, Fly.io, VPS), set the env vars,
and point your domain's DNS at it.

**Never commit `.env` publicly** — it contains database and session secrets.

## Full export contents (this package)
This zip is the **complete** export — nothing excluded:
- `db/ticky-global-database.sql` — full MySQL dump: schema + all data
  (reviews, enquiries, pages, analytics events, users). Import with:
  `mysql -u user -p your_db < db/ticky-global-database.sql`
- `.env` — **live environment secrets are included** so the app runs
  as-is on your host. Treat this package as confidential: do not commit
  it to a public repository or share it outside your team.
