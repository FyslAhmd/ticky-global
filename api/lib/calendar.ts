/**
 * Google Calendar integration — creates an event on the manager's primary
 * calendar the moment a discovery call is booked.
 *
 * Setup (when real credentials are ready):
 *   1. Google Cloud Console → APIs & Services → Credentials → Create
 *      "Service account" → copy its email (…@….iam.gserviceaccount.com)
 *   2. Google Calendar (manager account) → Settings → Share with specific
 *      people → add the service-account email with "Make changes to events"
 *   3. Put these in .env (never committed, never exposed to the frontend):
 *        GOOGLE_CALENDAR_CLIENT_EMAIL=…@….iam.gserviceaccount.com
 *        GOOGLE_CALENDAR_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n…\n-----END PRIVATE KEY-----\n"
 *        GOOGLE_CALENDAR_ID=primary
 *   Until then the demo placeholder below stays in place and every booking
 *   is marked "skipped" — bookings never fail because of calendar sync.
 */
import { createSign } from "crypto";
import { getBookingSettings } from "../queries/portal";

const CLIENT_EMAIL = process.env.GOOGLE_CALENDAR_CLIENT_EMAIL ?? "";
const PRIVATE_KEY = (process.env.GOOGLE_CALENDAR_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID ?? "primary";

/** Sync runs only once real service-account credentials are configured. */
const CONFIGURED = Boolean(CLIENT_EMAIL) && PRIVATE_KEY.includes("BEGIN PRIVATE KEY");

type BookingLike = {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  roleInterest?: string;
  date: string; // YYYY-MM-DD (business timezone)
  time: string; // HH:MM (business timezone)
  clientTimezone?: string;
  notes?: string;
};

export type CalendarSyncResult = {
  status: "created" | "skipped" | "failed";
  eventId?: string;
  eventLink?: string;
  error?: string;
};

/* ------------------------- service-account auth ------------------------- */

function b64url(input: string | Buffer) {
  return Buffer.from(input).toString("base64url");
}

async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(
    JSON.stringify({
      iss: CLIENT_EMAIL,
      scope: "https://www.googleapis.com/auth/calendar.events",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  const signature = signer.sign(PRIVATE_KEY, "base64url");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claims}.${signature}`,
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Google auth failed (${res.status})`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

/* ------------------------------ event CRUD ------------------------------ */

function eventTimes(date: string, time: string, slotMinutes: number, tz: string) {
  const [h, m] = time.split(":").map(Number);
  const endTotal = h * 60 + m + slotMinutes;
  const end = `${String(Math.floor(endTotal / 60)).padStart(2, "0")}:${String(endTotal % 60).padStart(2, "0")}`;
  return {
    start: { dateTime: `${date}T${time}:00`, timeZone: tz },
    end: { dateTime: `${date}T${end}:00`, timeZone: tz },
  };
}

function eventDescription(b: BookingLike) {
  const lines = [
    `Discovery call booked via tickyglobal.com/book`,
    ``,
    `Client: ${b.name}${b.company ? ` (${b.company})` : ""}`,
    `Email: ${b.email}`,
    b.phone ? `Phone: ${b.phone}` : "",
    b.roleInterest ? `Interested in: ${b.roleInterest}` : "",
    b.clientTimezone ? `Client time zone: ${b.clientTimezone}` : "",
    ``,
    b.notes ? `Their notes:\n${b.notes}` : "",
  ];
  return lines.filter((l) => l !== "").join("\n");
}

async function insertEvent(b: BookingLike, token: string, slotMinutes: number, businessTz: string) {
  const { start, end } = eventTimes(b.date, b.time, slotMinutes, businessTz);
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        summary: `Discovery call — ${b.name}${b.company ? ` (${b.company})` : ""}`,
        description: eventDescription(b),
        start,
        end,
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 24 * 60 },
            { method: "popup", minutes: 30 },
          ],
        },
      }),
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Calendar insert failed (${res.status}): ${body.slice(0, 200)}`);
  }
  const ev = (await res.json()) as { id: string; htmlLink: string };
  return { eventId: ev.id, eventLink: ev.htmlLink };
}

async function deleteEvent(eventId: string, token: string) {
  await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events/${encodeURIComponent(eventId)}`,
    { method: "DELETE", headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(15000) },
  );
}

/* ------------------------------ public API ------------------------------ */

/** Called right after a booking row is created. Never throws. */
export async function syncBookingToCalendar(b: BookingLike): Promise<CalendarSyncResult> {
  if (!CONFIGURED) {
    return { status: "skipped", error: "Google Calendar credentials not configured" };
  }
  try {
    const settings = await getBookingSettings();
    const token = await getAccessToken();
    const { eventId, eventLink } = await insertEvent(b, token, settings.slotMinutes, settings.timezone);
    return { status: "created", eventId, eventLink };
  } catch (err) {
    console.error("[calendar] sync failed:", err);
    return { status: "failed", error: err instanceof Error ? err.message : String(err) };
  }
}

/** Called when a booking is cancelled in the admin panel. Never throws. */
export async function removeBookingFromCalendar(eventId: string): Promise<void> {
  if (!CONFIGURED) return;
  try {
    const token = await getAccessToken();
    await deleteEvent(eventId, token);
  } catch (err) {
    console.error("[calendar] event removal failed:", err);
  }
}
