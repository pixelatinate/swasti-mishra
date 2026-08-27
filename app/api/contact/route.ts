import { NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_REGEX = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
const NAME_REGEX = /^[A-Za-z .'-]+$/;

const CONTACT_EMAIL = "swastiy2k1@gmail.com";

export async function POST(request: Request) {
  const { name, email, message } = await request.json();

  if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
    return NextResponse.json({ error: "There appears to be a problem with the form you submitted." }, { status: 400 });
  }

  const errors: string[] = [];
  if (!EMAIL_REGEX.test(email)) {
    errors.push("The email address you entered does not appear to be valid.");
  }
  if (!NAME_REGEX.test(name)) {
    errors.push("The name you entered does not appear to be valid.");
  }
  if (message.trim().length < 2) {
    errors.push("The message you entered does not appear to be valid.");
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set.");
    return NextResponse.json({ error: "The contact form isn't configured yet. Please reach out on LinkedIn instead." }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const fromAddress = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  const { error } = await resend.emails.send({
    from: `Swasti Mishra Website <${fromAddress}>`,
    to: CONTACT_EMAIL,
    replyTo: email,
    subject: "Hello!",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Something went wrong sending your message. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
