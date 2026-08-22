import * as cookie from "cookie";
import { eq } from "drizzle-orm";
import { Session } from "@contracts/constants";
import { getDb } from "../queries/connection";
import * as schema from "@db/schema";
import { verifySessionToken } from "./session";

/** Resolve the signed-in user from the session cookie, or return null. */
export async function authenticateRequest(headers: Headers) {
  const cookies = cookie.parse(headers.get("cookie") || "");
  const token = cookies[Session.cookieName];
  if (!token) return null;

  const claim = await verifySessionToken(token);
  if (!claim) return null;

  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, claim.userId))
    .limit(1);
  return rows.at(0) ?? null;
}
