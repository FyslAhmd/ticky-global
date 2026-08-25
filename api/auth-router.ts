import * as cookie from "cookie";
import * as bcrypt from "bcryptjs";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import * as schema from "@db/schema";
import { signSessionToken } from "./auth/session";
const credentialsInput = z.object({
  email: z.string().email().max(320),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});

const registerInput = credentialsInput.extend({
  name: z.string().min(1, "Name is required").max(255),
});

function setSessionCookie(ctx: { req: Request; resHeaders: Headers }, token: string) {
  const opts = getSessionCookieOptions(ctx.req.headers);
  ctx.resHeaders.append(
    "set-cookie",
    cookie.serialize(Session.cookieName, token, {
      httpOnly: opts.httpOnly,
      path: opts.path,
      sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
      secure: opts.secure,
      maxAge: Session.maxAgeMs / 1000,
    }),
  );
}

function publicUser(user: schema.User) {
  const { passwordHash: _omit, ...rest } = user;
  return rest;
}

/** Client portal accounts share the session cookie; their IDs are offset to avoid collision with staff IDs. */
import { CLIENT_ID_OFFSET } from "./auth/local";

export const authRouter = createRouter({
  me: authedQuery.query((opts) => publicUser(opts.ctx.user)),

  register: publicQuery.input(registerInput).mutation(async ({ ctx, input }) => {
    const email = input.email.toLowerCase().trim();
    const existing = await getDb()
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);
    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    await getDb().insert(schema.users).values({
      email,
      passwordHash,
      name: input.name.trim(),
      role: "user",
      lastSignInAt: new Date(),
    });

    const rows = await getDb()
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);
    const user = rows.at(0)!;

    const token = await signSessionToken({ userId: user.id, email: user.email });
    setSessionCookie(ctx, token);
    return publicUser(user);
  }),

  login: publicQuery.input(credentialsInput).mutation(async ({ ctx, input }) => {
    const email = input.email.toLowerCase().trim();
    const rows = await getDb()
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);
    const user = rows.at(0);

    // Compare against a dummy hash when the user doesn't exist so timing
    // doesn't reveal which emails are registered.
    const hash = user?.passwordHash ??
      "$2a$12$C6UzMDM.H6dfI/f/IKcEeO7ZBZKBHh5tQ3VvBQ5dF0z0o6c0c0c0c";
    const valid = await bcrypt.compare(input.password, hash);
    if (!user || !valid) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password.",
      });
    }

    await getDb()
      .update(schema.users)
      .set({ lastSignInAt: new Date() })
      .where(eq(schema.users.id, user.id));

    const token = await signSessionToken({ userId: user.id, email: user.email });
    setSessionCookie(ctx, token);
    return publicUser(user);
  }),

  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),

  /** Client portal sign-in — authenticates against client_users, sets the same session cookie. */
  clientLogin: publicQuery.input(credentialsInput).mutation(async ({ ctx, input }) => {
    const email = input.email.toLowerCase().trim();
    const rows = await getDb()
      .select()
      .from(schema.clientUsers)
      .where(eq(schema.clientUsers.email, email))
      .limit(1);
    const account = rows.at(0);

    const hash = account?.passwordHash ??
      "$2a$12$C6UzMDM.H6dfI/f/IKcEeO7ZBZKBHh5tQ3VvBQ5dF0z0o6c0c0c0c";
    const valid = await bcrypt.compare(input.password, hash);
    if (!account || !valid) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password.",
      });
    }

    await getDb()
      .update(schema.clientUsers)
      .set({ lastSignInAt: new Date() })
      .where(eq(schema.clientUsers.id, account.id));

    const token = await signSessionToken({
      userId: account.id + CLIENT_ID_OFFSET,
      email: account.email,
    });
    setSessionCookie(ctx, token);
    return { id: account.id, clientId: account.clientId, email: account.email, name: account.name };
  }),
});
