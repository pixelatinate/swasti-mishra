import { NextResponse } from "next/server";
import { Resend } from "resend";
import { buildSubject, fetchReportData, renderReport } from "@/lib/analytics-report";

// Triggered once a day by Vercel Cron (see vercel.json). Vercel sends
// "Authorization: Bearer $CRON_SECRET" automatically when CRON_SECRET is set
// in the project's env vars; requiring it keeps strangers from triggering
// emails or poking at your analytics.
export const dynamic = "force-dynamic";

const REPORT_EMAIL = "swastiy2k1@gmail.com";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET is not set." }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let data;
  try {
    data = await fetchReportData();
  } catch (error) {
    console.error("Analytics report: GA fetch failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "GA fetch failed" }, { status: 502 });
  }

  const { html, text } = renderReport(data);
  const subject = buildSubject(data);

  // ?dry=1 returns the report in the response instead of emailing it —
  // handy for checking the setup without waiting for the cron.
  if (new URL(request.url).searchParams.get("dry") === "1") {
    return NextResponse.json({ subject, text, data });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY is not set." }, { status: 500 });
  }

  const fromAddress = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const { error } = await new Resend(apiKey).emails.send({
    from: `Swasti Mishra Website <${fromAddress}>`,
    to: REPORT_EMAIL,
    subject,
    html,
    text,
  });

  if (error) {
    console.error("Analytics report: Resend error", error);
    return NextResponse.json({ error: "Failed to send email." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, subject });
}
