import { JWT } from "google-auth-library";

// ---------------------------------------------------------------------------
// Fetches yesterday's numbers from the Google Analytics 4 Data API and turns
// them into an email. Used by app/api/cron/analytics-report/route.ts.
// ---------------------------------------------------------------------------

type GaRow = { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] };
type GaReport = { rows?: GaRow[] };

type Row = { dims: string[]; metrics: number[] };

export type Overview = { users: number; sessions: number; pageViews: number };

export type ReportData = {
  dateLabel: string; // e.g. "Mon, Oct 19"
  yesterday: Overview;
  previousDay: Overview;
  last7Days: Overview;
  today: Overview; // so far, may lag a few hours
  activeNow: number | null; // users in the last 30 minutes (null = realtime call failed)
  topPages: { path: string; views: number }[];
  sources: { source: string; sessions: number }[];
  countries: { country: string; users: number }[];
  events: { name: string; count: number }[];
  // null = the custom dimensions aren't registered in GA yet.
  linkClicks: { label: string; section: string; count: number }[] | null;
};

const CUSTOM_EVENTS = [
  "link_click",
  "image_open",
  "slide_nav",
  "theme_toggle",
  "contact_form_submit",
  "contact_form_error",
];

function toRows(report: GaReport | undefined): Row[] {
  return (report?.rows ?? []).map((row) => ({
    dims: (row.dimensionValues ?? []).map((d) => d.value),
    metrics: (row.metricValues ?? []).map((m) => Number(m.value)),
  }));
}

function getClient() {
  const raw = process.env.GA_SERVICE_ACCOUNT_JSON;
  const propertyId = process.env.GA_PROPERTY_ID;
  if (!raw || !propertyId) {
    throw new Error("GA_SERVICE_ACCOUNT_JSON and GA_PROPERTY_ID must both be set.");
  }
  const credentials = JSON.parse(raw) as { client_email: string; private_key: string };
  const client = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
  });
  return { client, propertyId };
}

export async function fetchReportData(): Promise<ReportData> {
  const { client, propertyId } = getClient();
  const base = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}`;
  const yesterdayRange = { startDate: "yesterday", endDate: "yesterday" };

  const batch = await client.request<{ reports: GaReport[] }>({
    url: `${base}:batchRunReports`,
    method: "POST",
    data: {
      requests: [
        {
          // No dimensions + several ranges: one row per range, in order.
          dateRanges: [yesterdayRange, { startDate: "2daysAgo", endDate: "2daysAgo" }, { startDate: "7daysAgo", endDate: "yesterday" }, { startDate: "today", endDate: "today" }],
          metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }],
        },
        {
          dateRanges: [yesterdayRange],
          dimensions: [{ name: "pagePath" }],
          metrics: [{ name: "screenPageViews" }],
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
          limit: 10,
        },
        {
          dateRanges: [yesterdayRange],
          dimensions: [{ name: "sessionSourceMedium" }],
          metrics: [{ name: "sessions" }],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
          limit: 8,
        },
        {
          dateRanges: [yesterdayRange],
          dimensions: [{ name: "country" }],
          metrics: [{ name: "activeUsers" }],
          orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
          limit: 5,
        },
        {
          dateRanges: [yesterdayRange],
          dimensions: [{ name: "eventName" }],
          metrics: [{ name: "eventCount" }],
          dimensionFilter: { filter: { fieldName: "eventName", inListFilter: { values: CUSTOM_EVENTS } } },
          orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
        },
      ],
    },
  });

  const [overviewRows, pageRows, sourceRows, countryRows, eventRows] = batch.data.reports.map(toRows);

  const overview = (i: number): Overview => {
    // Rows come back tagged date_range_0..3; match on that rather than position.
    const row = overviewRows.find((r) => r.dims[0] === `date_range_${i}`);
    return { users: row?.metrics[0] ?? 0, sessions: row?.metrics[1] ?? 0, pageViews: row?.metrics[2] ?? 0 };
  };

  // Separate request: it only works once the event parameters are registered
  // as custom dimensions in GA, and a failure here shouldn't sink the report.
  let linkClicks: ReportData["linkClicks"] = null;
  try {
    const clicks = await client.request<GaReport>({
      url: `${base}:runReport`,
      method: "POST",
      data: {
        dateRanges: [yesterdayRange],
        dimensions: [{ name: "customEvent:item" }, { name: "customEvent:link_text" }, { name: "customEvent:section" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: { filter: { fieldName: "eventName", stringFilter: { value: "link_click" } } },
        orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
        limit: 15,
      },
    });
    linkClicks = toRows(clicks.data).map((r) => {
      const [item, text, section] = r.dims.map((d) => (d === "(not set)" ? "" : d));
      return { label: item ? `${item} · ${text}` : text, section, count: r.metrics[0] };
    });
  } catch {
    linkClicks = null;
  }

  // Realtime = the last 30 minutes. Separate request so a failure here
  // (e.g. permissions) can't sink the rest of the report.
  let activeNow: number | null = null;
  try {
    const realtime = await client.request<GaReport>({
      url: `${base}:runRealtimeReport`,
      method: "POST",
      data: { metrics: [{ name: "activeUsers" }] },
    });
    activeNow = toRows(realtime.data)[0]?.metrics[0] ?? 0;
  } catch {
    activeNow = null;
  }

  const dateLabel = new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "America/Los_Angeles",
  });

  return {
    dateLabel,
    yesterday: overview(0),
    previousDay: overview(1),
    last7Days: overview(2),
    today: overview(3),
    activeNow,
    topPages: pageRows.map((r) => ({ path: r.dims[0], views: r.metrics[0] })),
    sources: sourceRows.map((r) => ({ source: r.dims[0], sessions: r.metrics[0] })),
    countries: countryRows.map((r) => ({ country: r.dims[0], users: r.metrics[0] })),
    events: eventRows.map((r) => ({ name: r.dims[0], count: r.metrics[0] })),
    linkClicks,
  };
}

// ----------------------------- rendering -----------------------------------

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function delta(now: number, before: number) {
  if (before === 0) return now === 0 ? "–" : "new";
  const pct = Math.round(((now - before) / before) * 100);
  return `${pct > 0 ? "+" : ""}${pct}%`;
}

export function buildSubject(d: ReportData) {
  const clicks = d.events.find((e) => e.name === "link_click")?.count ?? 0;
  return `Site report ${d.dateLabel}: ${d.yesterday.users} visitors, ${clicks} link clicks`;
}

export function renderReport(d: ReportData): { html: string; text: string } {
  const { yesterday: y, previousDay: p, last7Days: w } = d;
  const noClickData =
    "Link-click breakdown isn't available yet — in GA go to Admin → Custom definitions and register the event parameters item, link_text, link_domain and section.";

  const text = [
    `Site report for ${d.dateLabel}`,
    "",
    `Visitors:   ${y.users} (${delta(y.users, p.users)} vs day before)   7-day total: ${w.users}`,
    `Sessions:   ${y.sessions} (${delta(y.sessions, p.sessions)})   7-day total: ${w.sessions}`,
    `Page views: ${y.pageViews} (${delta(y.pageViews, p.pageViews)})   7-day total: ${w.pageViews}`,
    "",
    `Today so far: ${d.today.users} visitors, ${d.today.pageViews} page views (Google can lag a few hours)`,
    `Active in the last 30 minutes: ${d.activeNow ?? "unavailable"}`,
    "",
    "TOP PAGES",
    ...(d.topPages.length ? d.topPages.map((r) => `  ${r.views}  ${r.path}`) : ["  (none)"]),
    "",
    "WHERE VISITORS CAME FROM",
    ...(d.sources.length ? d.sources.map((r) => `  ${r.sessions}  ${r.source}`) : ["  (none)"]),
    "",
    "COUNTRIES",
    ...(d.countries.length ? d.countries.map((r) => `  ${r.users}  ${r.country}`) : ["  (none)"]),
    "",
    "INTERACTIONS",
    ...(d.events.length ? d.events.map((r) => `  ${r.count}  ${r.name}`) : ["  (none)"]),
    "",
    "MOST-CLICKED LINKS",
    ...(d.linkClicks === null
      ? [`  ${noClickData}`]
      : d.linkClicks.length
        ? d.linkClicks.map((r) => `  ${r.count}  ${r.label}${r.section ? ` (${r.section})` : ""}`)
        : ["  (none)"]),
    "",
    "Numbers come from Google Analytics and undercount visitors who use ad blockers.",
  ].join("\n");

  const table = (rows: string[][], empty = "None") =>
    rows.length
      ? `<table style="border-collapse:collapse;width:100%;font-size:14px">${rows
          .map(
            ([n, label, extra]) =>
              `<tr><td style="padding:4px 12px 4px 0;text-align:right;font-variant-numeric:tabular-nums;width:48px;color:#111"><b>${esc(n)}</b></td><td style="padding:4px 0;color:#333">${esc(label)}${
                extra ? ` <span style="color:#888">${esc(extra)}</span>` : ""
              }</td></tr>`,
          )
          .join("")}</table>`
      : `<p style="color:#888;font-size:14px;margin:0">${empty}</p>`;

  const stat = (label: string, now: number, before: number, total: number) =>
    `<td style="padding:12px 16px;background:#f5f5f5;border-radius:8px;vertical-align:top"><div style="font-size:12px;color:#666;text-transform:uppercase;letter-spacing:.04em">${label}</div><div style="font-size:28px;font-weight:700;color:#111">${now}</div><div style="font-size:12px;color:#666">${delta(now, before)} vs day before · ${total} in 7 days</div></td>`;

  const h = (t: string) => `<h3 style="margin:24px 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:#555">${t}</h3>`;

  const html = `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;color:#222">
<h2 style="margin:0 0 16px">Site report · ${esc(d.dateLabel)}</h2>
<table style="width:100%;border-spacing:8px 0;margin:0 -8px"><tr>${stat("Visitors", y.users, p.users, w.users)}${stat("Sessions", y.sessions, p.sessions, w.sessions)}${stat("Page views", y.pageViews, p.pageViews, w.pageViews)}</tr></table>
<p style="margin:14px 0 0;font-size:13px;color:#555">Today so far: <b>${d.today.users}</b> visitors, <b>${d.today.pageViews}</b> page views &nbsp;·&nbsp; Active in the last 30 min: <b>${d.activeNow ?? "n/a"}</b></p>
${h("Top pages")}${table(d.topPages.map((r) => [String(r.views), r.path]))}
${h("Where visitors came from")}${table(d.sources.map((r) => [String(r.sessions), r.source]))}
${h("Countries")}${table(d.countries.map((r) => [String(r.users), r.country]))}
${h("Interactions")}${table(d.events.map((r) => [String(r.count), r.name]))}
${h("Most-clicked links")}${
    d.linkClicks === null
      ? `<p style="color:#888;font-size:14px;margin:0">${esc(noClickData)}</p>`
      : table(d.linkClicks.map((r) => [String(r.count), r.label, r.section]))
  }
<p style="margin-top:28px;font-size:12px;color:#999">Numbers come from Google Analytics and undercount visitors who use ad blockers.</p>
</div>`;

  return { html, text };
}
