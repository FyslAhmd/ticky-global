import { authRouter } from "./auth-router";
import { publicRouter, staffRouter } from "./cms-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  public: publicRouter,
  staff: staffRouter,
});

export type AppRouter = typeof appRouter;
