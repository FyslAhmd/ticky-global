# Tracking & Conversion Setup — Ticky Global

This guide is for the PPC / paid-media specialist. It covers how GA4, Google
Tag Manager (GTM) and Google Ads conversion tracking are wired into the
website, and exactly what to configure in each tool.

---

## 1. Architecture at a glance

```
Website ──loads──▶ GTM container (one snippet, sitewide)
                      ├── GA4 config tag        (page views on every route)
                      ├── GA4 event tags        (enquiry_submitted, calculator_used, cta_click)
                      ├── Google Ads conversion tags (fire on the events above)
                      └── any future pixels     (Meta, LinkedIn — add in GTM, no code changes)
```

**Everything is managed in GTM.** The site code pushes well-named events to
the GTM `dataLayer`; all tags, triggers and conversions are configured in the
GTM web interface. Adding a new platform later requires **zero code changes**.

---

## 2. Activating the snippet (one-time, ~2 minutes)

The site ships with a placeholder container ID. To activate:

1. In GTM, create (or open) the web container for the site and copy its ID
   (`GTM-XXXXXXX` — top-right of the GTM workspace).
2. In the project `.env` file, set:

   ```
   VITE_GTM_ID=GTM-XXXXXXX
   ```

3. Rebuild and redeploy (`npm run build && npm start`, or redeploy the Docker
   image). Also update the placeholder `GTM-XXXXXXX` in the `<noscript>`
   iframe at the bottom of `index.html` (this only matters for visitors with
   JavaScript disabled).

Until `VITE_GTM_ID` is set, **nothing loads and no data is sent** — safe for
development and staging.

---

## 3. Events the website already fires

The site pushes these events to the `dataLayer` automatically:

| Event name | Fires when | Parameters included |
|---|---|---|
| `page_view` | Every route change (SPA-aware) | `page_path`, `page_title` |
| `enquiry_submitted` | Contact / discovery-call form submitted successfully | `role_interest`, `hours`, `page_path` |
| `calculator_used` | Visitor changes role / country / hours in the savings calculator (1.5s debounce) | `role_id`, `role_title`, `region`, `hours`, `annual_saving`, `currency` |
| `cta_click` | "Book a Discovery Call" / "Lock in this saving" / pricing CTA clicks | `cta_label`, `page_path` |

Internal note for developers: events are defined in `src/lib/tracking.ts`.

---

## 4. GTM setup (do this in the GTM web UI)

### 4.1 GA4 configuration tag
1. **Tags → New → Google Tag**
2. Tag ID: your GA4 Measurement ID (`G-XXXXXXX`)
3. Trigger: **Initialization – All Pages**
4. Because this is a single-page app, the site pushes a `page_view` event on
   every route change — create a second **Google Analytics: GA4 Event** tag
   named `page_view` firing on a **Custom Event trigger = `page_view`** if
   your GA4 tag doesn't pick up history changes automatically.

### 4.2 GA4 event tags (one per conversion)
For each of `enquiry_submitted`, `calculator_used`, `cta_click`:
1. **Tags → New → Google Analytics: GA4 Event**
2. Configuration tag: the GA4 tag from 4.1
3. Event name: exactly as in the table above (e.g. `enquiry_submitted`)
4. Event parameters: add the parameters listed (e.g. `role_interest` →
   `{{role_interest}}` dataLayer variable)
5. Trigger: **Custom Event** with the same event name
6. Create the matching **Data Layer Variables** under Variables → New
   (e.g. `role_interest`, `annual_saving`, `cta_label` …)

### 4.3 Mark conversions in GA4
In GA4: **Admin → Events** — toggle `enquiry_submitted` (and optionally
`calculator_used`) as **Key events**. They then flow into Google Ads when the
accounts are linked.

---

## 5. Google Ads conversion tracking

Two options — pick one:

**Option A (recommended): import GA4 key events**
1. Link GA4 ↔ Google Ads (GA4 Admin → Product links).
2. In Google Ads: **Goals → Conversions → New conversion action → Import →
   Google Analytics 4 → Web**, and import `enquiry_submitted` as a Primary
   "Submit lead form" conversion. Import `calculator_used` as a Secondary
   (observation) conversion.
3. GTM already carries the page_view data GA4 needs — no extra Ads tag
   required for imported conversions.

**Option B: native Google Ads tag in GTM**
1. **Tags → New → Google Ads Conversion Tracking**, enter your Conversion ID
   and Conversion label.
2. Trigger: **Custom Event = `enquiry_submitted`**.
3. Add a **Conversion Linker** tag firing on All Pages.

Suggested conversion setup:

| Conversion action | Event | Category | Count |
|---|---|---|---|
| Lead — enquiry form | `enquiry_submitted` | Submit lead form (Primary) | One |
| Engaged — calculator | `calculator_used` | Secondary / observation | One |
| CTA click | `cta_click` | Secondary / observation | Every |

---

## 6. Verifying it works

1. **GTM Preview mode** (Workspace → Preview): load the site, submit the
   enquiry form with test data, use the calculator — confirm the events appear
   in the Tag Assistant event stream and the right tags fire.
2. **GA4 DebugView**: with preview mode on, confirm `page_view`,
   `enquiry_submitted`, `calculator_used` and `cta_click` arrive with their
   parameters.
3. **Google Ads**: after the first real conversions, check Goals → Conversions
   shows "Recording conversions" (can take up to 24–48h).

---

## 7. Notes for the PPC specialist working on the site

- All ad accounts stay **yours** — the site only sends events; campaign and
  budget management happens in Google Ads / Meta / Amazon as normal.
- UTM parameters on inbound ad links are preserved by the browser and visible
  in GA4 as usual; the site's own internal analytics (admin dashboard) are
  separate and unaffected.
- New landing pages added via the CMS (`/p/:slug`) are tracked automatically —
  `page_view` fires on every route.
