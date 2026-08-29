"use client";

import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
  // Starts null (rendering an empty placeholder) so the very first client
  // render matches the server exactly, then swaps to the real icon right
  // after mount once it's safe to read the DOM.
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    // The theme was already set on <html data-theme="..."> by the blocking
    // script in app/layout.tsx, before hydration — SSR has no way to know
    // that value, so it can't be derived during render without causing the
    // exact hydration mismatch this effect avoids.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // localStorage can throw in private browsing; the toggle still works
      // for the rest of the session via the DOM attribute.
    }
  }

  if (!theme) {
    return <button className="theme-toggle" aria-label="Toggle theme" />;
  }

  return (
    <button className="theme-toggle" onClick={toggle} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
      {theme === "dark" ? <FaSun /> : <FaMoon />}
    </button>
  );
}
