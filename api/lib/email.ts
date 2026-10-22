import nodemailer from "nodemailer";
import { getEmailSettings, type EmailSettings } from "../queries/portal";

function transport(s: EmailSettings) {
  return nodemailer.createTransport({
    host: s.host,
    port: s.port,
    secure: s.secure,
    auth: s.user ? { user: s.user, pass: s.password } : undefined,
  });
}

function branded(body: string) {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <div style="background:#0f172a;border-radius:16px 16px 0 0;padding:20px 28px">
      <span style="color:#fff;font-size:20px;font-weight:bold">Ticky <span style="color:#60a5fa">Global</span></span>
    </div>
    <div style="background:#fff;padding:28px;border-radius:0 0 16px 16px;color:#334155;font-size:14px;line-height:1.6">
      ${body}
      <p style="margin:24px 0 0;color:#94a3b8;font-size:12px">
        Ticky Global Ltd · hello@tickyglobal.com · UK: 0808 175 3413
      </p>
    </div>
  </div>
</body></html>`;
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:6px 12px 6px 0;color:#64748b;white-space:nowrap;vertical-align:top">${label}</td>
    <td style="padding:6px 0;font-weight:bold;color:#0f172a">${value}</td>
  </tr>`;
}

export type BookingDetails = {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  roleInterest?: string;
  date: string;
  time: string;
  notes?: string;
};

function prettyDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

/** Notification to the manager when a new discovery call is booked. */
export async function sendManagerBookingNotification(b: BookingDetails) {
  const s = await getEmailSettings();
  if (!s.enabled || !s.notifyManagerOnBooking || !s.host) return { sent: false, reason: "disabled" };

  const html = branded(`
    <h2 style="margin:0 0 16px;color:#0f172a;font-size:18px">📅 New discovery call booked</h2>
    <table style="border-collapse:collapse">${[
      row("When", `${prettyDate(b.date)} at ${b.time}`),
      row("Name", b.name),
      row("Email", `<a href="mailto:${b.email}" style="color:#1d4ed8">${b.email}</a>`),
      b.company ? row("Company", b.company) : "",
      b.phone ? row("Phone", b.phone) : "",
      b.roleInterest ? row("Interested in", b.roleInterest) : "",
    ].join("")}</table>
    ${b.notes ? `<p style="margin:16px 0 0;padding:12px;background:#f8fafc;border-radius:8px"><strong>Their notes:</strong><br>${b.notes}</p>` : ""}
    <p style="margin:20px 0 0">View it in the <a href="https://tickyglobal.com/admin/bookings" style="color:#1d4ed8;font-weight:bold">admin portal → Bookings</a>.</p>
  `);

  await transport(s).sendMail({
    from: `"${s.fromName}" <${s.fromEmail}>`,
    to: s.managerEmail,
    subject: `New discovery call: ${b.name} — ${prettyDate(b.date)} at ${b.time}`,
    html,
  });
  return { sent: true };
}

/** Confirmation email to the client after booking. */
export async function sendClientBookingConfirmation(b: BookingDetails) {
  const s = await getEmailSettings();
  if (!s.enabled || !s.confirmToClient || !s.host) return { sent: false, reason: "disabled" };

  const html = branded(`
    <h2 style="margin:0 0 8px;color:#0f172a;font-size:18px">You're booked in, ${b.name.split(" ")[0]}! 🎉</h2>
    <p style="margin:0 0 16px">Thanks for booking a discovery call with Ticky Global. Here are your details:</p>
    <div style="background:#eff6ff;border-radius:12px;padding:16px 20px;margin:0 0 16px">
      <p style="margin:0;font-size:16px;font-weight:bold;color:#1e40af">${prettyDate(b.date)}</p>
      <p style="margin:4px 0 0;font-size:16px;font-weight:bold;color:#1e40af">${b.time} (UK time)</p>
    </div>
    <p style="margin:0 0 12px"><strong>What happens next:</strong></p>
    <ul style="margin:0;padding-left:20px">
      <li>We'll send a video call link to this email address before the call.</li>
      <li>The call takes about 30 minutes — a relaxed chat about the role you're thinking about.</li>
      <li>You'll get an exact monthly price in your currency, with no obligation.</li>
    </ul>
    <p style="margin:16px 0 0">Need to change your time? Just reply to this email or call us on <strong>0808 175 3413</strong>.</p>
    <p style="margin:16px 0 0">Speak soon,<br><strong>The Ticky Global team</strong></p>
  `);

  await transport(s).sendMail({
    from: `"${s.fromName}" <${s.fromEmail}>`,
    to: b.email,
    subject: `Your discovery call is confirmed — ${prettyDate(b.date)} at ${b.time}`,
    html,
  });
  return { sent: true };
}

/** Fire-and-forget wrapper so email failures never block a booking. */
export function sendBookingEmails(b: BookingDetails) {
  void Promise.allSettled([
    sendManagerBookingNotification(b),
    sendClientBookingConfirmation(b),
  ]).then((results) => {
    for (const r of results) {
      if (r.status === "rejected") console.error("[email] booking email failed:", r.reason);
    }
  });
}
