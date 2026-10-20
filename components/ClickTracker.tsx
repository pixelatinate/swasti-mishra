"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

const clip = (text: string | null | undefined, max = 100) => (text ?? "").replace(/\s+/g, " ").trim().slice(0, max);

// Site-wide link click tracking via one delegated listener, so every page
// (sidebar, home slides, Writing tables, Projects, Illustration, About…) is
// covered without wiring up each link by hand.
export default function ClickTracker() {
  useEffect(() => {
    function handle(event: MouseEvent) {
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || !anchor.getAttribute("href")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      const linkType =
        url.protocol === "mailto:" ? "email" : url.origin === window.location.origin ? "internal" : "outbound";

      // Table rows (Writing page): the row's first cell is the page title.
      const row = anchor.closest("tr");
      const rowTitle = clip(row?.querySelector("td")?.textContent);
      // Nearest section heading (e.g. "Databricks", "R2026a") and, for topic
      // tables, the sub-heading right above the table (e.g. "Data Formats").
      const section = clip(anchor.closest("section")?.querySelector("h3")?.textContent);
      const above = anchor.closest("table")?.parentElement?.previousElementSibling;
      const subsection = above && /^H[3-4]$/.test(above.tagName) ? clip(above.textContent) : "";

      const linkText =
        clip(anchor.querySelector("h1")?.textContent) ||
        clip(anchor.textContent) ||
        clip(anchor.getAttribute("aria-label")) ||
        clip(anchor.getAttribute("title")) ||
        `(icon) ${url.hostname}`;

      trackEvent("link_click", {
        link_type: linkType,
        link_text: linkText,
        link_url: clip(url.href, 200),
        link_domain: url.hostname,
        ...(rowTitle && { item: rowTitle }),
        ...(section && { section }),
        ...(subsection && { subsection }),
      });
    }

    // "click" misses middle-click (open in new tab), which is common for
    // doc links, so listen for that too.
    const onAux = (e: MouseEvent) => e.button === 1 && handle(e);
    document.addEventListener("click", handle);
    document.addEventListener("auxclick", onAux);
    return () => {
      document.removeEventListener("click", handle);
      document.removeEventListener("auxclick", onAux);
    };
  }, []);

  return null;
}
