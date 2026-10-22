import { authRouter } from "./auth-router";
import { publicRouter, staffRouter } from "./cms-router";
import {
  usersRouter,
  crmRouter,
  marketingRouter,
  clientsRouter,
  portalRouter,
  marketingPublicRouter,
  integrationsRouter,
  mediaRouter,
  bookingRouter,
} from "./portal-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  public: publicRouter,
  staff: staffRouter,
  users: usersRouter,
  crm: crmRouter,
  marketing: marketingRouter,
  clients: clientsRouter,
  portal: portalRouter,
  marketingPublic: marketingPublicRouter,
  integrations: integrationsRouter,
  media: mediaRouter,
  booking: bookingRouter,
});

export type AppRouter = typeof appRouter;
