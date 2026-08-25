import { ErrorMessages } from "@contracts/constants";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const createRouter = t.router;
export const publicQuery = t.procedure;

const requireAuth = t.middleware(async (opts) => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: ErrorMessages.unauthenticated,
    });
  }

  return next({ ctx: { ...ctx, user: ctx.user } });
});

function requireRole(role: string) {
  return t.middleware(async (opts) => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== role) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: ErrorMessages.insufficientRole,
      });
    }

    return next({ ctx: { ...ctx, user: ctx.user } });
  });
}

export const authedQuery = t.procedure.use(requireAuth);
export const adminQuery = authedQuery.use(requireRole("admin"));

/** Available permission keys for staff users (admins always have all). */
export const PERMISSION_KEYS = [
  "dashboard",
  "enquiries",
  "crm",
  "clients",
  "marketing",
  "reviews",
  "pages",
  "analytics",
  "users",
] as const;
export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export function hasPermission(user: { role: string; permissions?: string | null }, key: PermissionKey) {
  if (user.role === "admin") return true;
  return (user.permissions ?? "").split(",").map((p) => p.trim()).includes(key);
}

/** authed procedure restricted to users holding the given permission (or admin) */
export function permQuery(key: PermissionKey) {
  return authedQuery.use(
    t.middleware(async ({ ctx, next }) => {
      const user = ctx.user as { role: string; permissions?: string | null } | undefined;
      if (!user || !hasPermission(user, key)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: ErrorMessages.insufficientRole,
        });
      }
      return next({ ctx });
    }),
  );
}
