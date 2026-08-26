"use client";

import { useLayoutEffect, useRef, useState } from "react";

const DISCO_FISH_SRC = "/disco-fish/index.html";
const NATURAL_WIDTH = 1023;
const NATURAL_HEIGHT = 750;

export default function DiscoFishFrame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (frame) {
      frame.src = DISCO_FISH_SRC;
    }
    return () => {
      if (frame) {
        frame.src = "about:blank";
      }
    };
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function measure() {
      if (container) {
        setScale(container.getBoundingClientRect().width / NATURAL_WIDTH);
      }
    }

    // Measure synchronously on mount rather than waiting on ResizeObserver's
    // first (async) callback, so there's no flash at the wrong scale.
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    // Belt-and-suspenders: some browsers are inconsistent about firing
    // ResizeObserver promptly on every layout change, so also recompute on
    // window resize directly.
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: NATURAL_HEIGHT * scale,
        overflow: "hidden",
        position: "relative",
        borderRadius: 5,
        boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
      }}
    >
      <iframe
        ref={frameRef}
        title="Disco Fish"
        id="disco_fish"
        width={NATURAL_WIDTH}
        height={NATURAL_HEIGHT}
        style={{
          border: "none",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      />
    </div>
  );
}
