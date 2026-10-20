import { track } from "@vercel/analytics";

type Params = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// One call, two destinations: Google Analytics 4 (the gtag snippet in
// app/layout.tsx) and Vercel Web Analytics. Both silently no-op if their
// script hasn't loaded or is blocked (ad blockers), so this never throws.
export function trackEvent(name: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  const payload = { ...params, page_path: window.location.pathname };
  try {
    window.gtag?.("event", name, payload);
    track(name, payload);
  } catch {
    // Analytics must never break the page.
  }
}
