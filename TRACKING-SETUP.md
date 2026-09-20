# Tracking & Conversion Setup — Ticky Global

This guide is for the PPC / paid-media specialist.

> **Latest:** tracking is now managed from the admin panel — no code changes
> or deployments needed. Log in to the admin portal and go to
> **Marketing → Integrations** to enter your GA4, GTM and Google Ads IDs,
> toggle tracking on/off, and watch recent website events.
> The IDs below (VITE_GTM_ID etc.) are now just optional build-time fallbacks.

---

## 1. Admin panel (the easy way)

**Admin → Marketing → Integrations** gives you:

- **GA4 Measurement ID** (`G-XXXXXXXXXX`) — page views + events flow to GA4.
- **GTM Container ID** (`GTM-XXXXXXX`, optional) — if set, the GTM container
  loads instead and manages all tags centrally.
- **Google Ads Conversion ID** (`AW-XXXXXXXXX`) + per-event **conversion
  labels** — fires Google Ads conversions directly (direct mode only).
- **Master on/off switch** — changes apply to the live site immediately.
- **Recent website events** — the site's own event log so you can confirm
  data is flowing before checking Google.

### Two ways to run it

| Mode | When to use | How conversions fire |
|---|---|---|
| **GTM mode** (Container ID set) | You prefer managing tags/triggers in GTM | You build GA4 + Ads tags inside GTM against the dataLayer events below |
| **Direct mode** (GTM blank) | Quickest setup, no GTM knowledge needed | gtag.js loads with your GA4 + Ads IDs; paste each conversion action's label in the panel |

Don't set conversion labels *and* map the same events in GTM — that would
double-count conversions.

---

## 2. Events the website fires

All events are pushed to the `dataLayer` (GTM) and/or `gtag` (direct mode):

| Event | Fires when | Parameters |
|---|---|---|
| `page_view` | Every route change (SPA-aware) | `page_path`, `page_title` |
| `enquiry_submitted` | Contact form submitted successfully | `page_path`, `role_interest`, `hours` |
| `calculator_used` | Savings calculator produces an estimate | `role_id`, `role_title`, `region`, `hours`, `annual_saving`, `currency` |
| `cta_click` | "Book a Discovery Call" / pricing CTAs clicked | `cta_label`, `page_path` |

## 3. One-time setup inside Google

1. **GA4 → Admin → Product links → Google Ads links** — link the Ads account.
2. **GA4 → Admin → Events** — mark `enquiry_submitted` as a key event.
3. **Google Ads → Goals → Conversions → New → Import → GA4 (Web)** — import
   the key event, *or* create a conversion action with a label and paste the
   label into Admin → Integrations (direct mode).
4. Confirm the conversion status shows "Recording conversions" after a test
   enquiry (use the **Send test event** button in the panel, or submit the
   contact form yourself).

## 4. Build-time fallback (developers)

`VITE_GTM_ID` in `.env` still works: if no config is saved in the admin panel
and `VITE_GTM_ID` is set, that container loads. Once anything is saved and
enabled in the admin panel, the database config wins.
