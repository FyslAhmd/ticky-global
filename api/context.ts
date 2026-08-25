import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import { authenticateRequest } from "./auth/local";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  /** Staff user (from users table). Absent for client portal sessions. */
  user?: User;
  /** Client portal account (from client_users table). Absent for staff sessions. */
  clientUser?: { id: number; clientId: number; email: string; name: string | null };
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };
  const account = await authenticateRequest(opts.req.headers);
  if (account && "kind" in account && account.kind === "client") {
    ctx.clientUser = {
      id: account.id,
      clientId: account.clientId,
      email: account.email,
      name: account.name,
    };
  } else if (account && "role" in account) {
    ctx.user = account;
  }
  return ctx;
}
