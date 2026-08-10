# Ticky Global - Developer Handbook

Greetings! I'm a Senior Full-Stack Developer from Google. I've thoroughly analyzed the `ticky-global` repository to provide you with this comprehensive technical overview. Whether you are an AI agent or a human engineer, this guide will serve as your map to understanding the full flow, architecture, and core modules of the project.

---

## 🏗️ 1. Architecture & Tech Stack

This project is a **monolith** setup where both the frontend and the backend are bundled and served together.

### The Stack:
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS (v3.4), `shadcn/ui` for UI components.
- **Backend:** Node.js, Hono (web server), tRPC (type-safe APIs).
- **Database:** MariaDB, Drizzle ORM.
- **Authentication:** External OAuth via Kimi Auth (`auth.kimi.com`).
- **Deployment:** The app is built into a unified Node.js runtime environment using `esbuild` for the backend and Vite for the frontend.

---

## 📂 2. Directory Structure

Understanding the layout is crucial for navigating the codebase efficiently:

- `/api` - The **Backend Server**. Contains Hono setup, tRPC routers, and backend middleware.
- `/src` - The **Frontend Client**. Contains all React components, pages, hooks, and styles.
- `/db` - The **Database Layer**. Contains Drizzle schemas (`schema.ts`), migrations, and seed scripts.
- `/contracts` - **Shared Definitions**. Types, constants, and enums shared between the frontend and backend to enforce type safety.
- `/public` - Static assets served directly by the browser (images, favicons, etc.).

---

## 🖥️ 3. Frontend Workflow (`/src`)

The frontend is a Single Page Application (SPA) utilizing **React Router** (`v7.6`) and **React Query** (`@tanstack/react-query`). 

### Core Files:
- `src/App.tsx`: The heart of the frontend routing. It divides the app into two main areas:
  - **Public Marketing Site:** Routes like `/`, `/pricing`, `/sectors`, `/roles`, `/contact`, and dynamic pages (`/p/:slug`). Wrapped in a public `Layout`.
  - **Staff Admin Dashboard:** Routes under `/admin/*` protected by sign-in requirements. Wrapped in an `AdminLayout`.
- `src/main.tsx`: The React entry point which hooks up the UI to the DOM and wraps the app with necessary providers (tRPC, React Query, Theme).
- `src/pages/`: Contains the top-level route components for each URL.
- `src/sections/`: Contains major UI blocks used within pages (e.g., `Hero`, `CtaSection`, `Testimonials`).
- `src/components/`: Houses reusable, generic UI components (heavily utilizing `shadcn/ui` Radix primitives).

### Styling:
Tailwind CSS handles utility-class styling, combined with `clsx` and `tailwind-merge` for dynamic class resolution. Global styles and CSS variables are found in `src/index.css`.

---

## ⚙️ 4. Backend Workflow (`/api`)

The server is built with **Hono** acting as the HTTP web framework that forwards API requests to **tRPC**. 

### Core Files:
- `api/boot.ts`: The primary server entry point. It configures the Hono app, sets up the OAuth callback (`/api/oauth/callback`), and delegates `/api/trpc/*` routes to the tRPC handler. In production, it also serves the Vite static files.
- `api/router.ts`: The root tRPC router that combines all sub-routers (`auth`, `public`, `staff`).
- `api/cms-router.ts`: The workhorse router containing core business logic. It handles:
  - **Public queries:** Submitting enquiries, fetching published reviews, fetching dynamic pages, and tracking analytics.
  - **Staff queries:** Managing CRM enquiries (update status), CMS page creation/editing, and managing testimonials.
- `api/middleware.ts`: Implements tRPC middleware for context creation, error handling, and authorization (`publicQuery`, `authedQuery`, `adminQuery`).

---

## 🗄️ 5. Database Schema (`/db`)

We use **MariaDB** managed via **Drizzle ORM**. The schema (`db/schema.ts`) dictates the application's data models:

1. **`users`**: Stores user profiles. Role-based access control is determined here (`user` vs `admin`).
2. **`enquiries`**: CRM leads captured from the frontend contact form. Statuses include `new`, `contacted`, `qualified`, `won`, `lost`.
3. **`reviews`**: Client testimonials with attributes like rating, hires, and calculated savings. Staff can toggle them between `draft`, `published`, and `archived`.
4. **`pages`**: Dynamic CMS pages that are rendered at `/p/:slug`. Allows non-technical staff to publish new content.
5. **`analytics_events`**: A telemetry table tracking `pageview` and `enquiry_submit` events to populate the admin analytics dashboard.

---

## 🔐 6. Authentication Flow

Authentication is handled via **Kimi Auth**.
1. When a user logs in, they are redirected to Kimi's OAuth portal.
2. Upon success, they are sent to the callback URL (`/api/oauth/callback`) defined in `api/boot.ts`.
3. The server sets an `httpOnly` cookie (`kimi_sid`) as defined in `contracts/constants.ts`.
4. Subsequent tRPC requests read this cookie in the `createContext` function (`api/context.ts`) to authenticate the user and authorize access to `authedQuery` and `adminQuery` procedures.

---

## 🚀 7. Build & Deployment

- **Development:** Running `npm run dev` boots the Vite dev server with HMR. Hono provides the API layer.
- **Production Build:** `npm run build` performs two steps:
  1. Vite bundles the React frontend into static assets in `/dist`.
  2. `esbuild` compiles the Node.js backend (`api/boot.ts`) into `dist/boot.js`.
- **Start:** `npm run start` launches the Node process (`node dist/boot.js`), which serves both the API and the static React files on a single port.

---

### Final Thoughts 💡
This project is an elegantly structured full-stack application. It successfully merges modern frontend paradigms (React 19, Tailwind) with a type-safe backend (tRPC, Drizzle). When modifying or debugging, always trace the flow from the **React Component (`/src`)** → **tRPC Router (`/api`)** → **Database Schema (`/db`)**.

Happy coding! 🚀
