import * as cookie from "cookie";
import { eq } from "drizzle-orm";
import { Session } from "@contracts/constants";
import { getDb } from "../queries/connection";
import * as schema from "@db/schema";
import { verifySessionToken } from "./session";

export const CLIENT_ID_OFFSET = 1_000_000_000;

export type SessionUser = schema.User | (schema.ClientUser & { kind: "client" });

/** Resolve the signed-in account (staff user or client portal user) from the session cookie. */
export async function authenticateRequest(headers: Headers): Promise<SessionUser | null> {
  const cookies = cookie.parse(headers.get("cookie") || "");
  const token = cookies[Session.cookieName];
  if (!token) return null;

  const claim = await verifySessionToken(token);
  if (!claim) return null;

  if (claim.userId >= CLIENT_ID_OFFSET) {
    const rows = await getDb()
      .select()
      .from(schema.clientUsers)
      .where(eq(schema.clientUsers.id, claim.userId - CLIENT_ID_OFFSET))
      .limit(1);
    const clientUser = rows.at(0);
    return clientUser ? { ...clientUser, kind: "client" } : null;
  }

  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, claim.userId))
    .limit(1);
  return rows.at(0) ?? null;
}
