"use client";

import { useEffect, useRef, useState } from "react";

const DISCO_FISH_SRC = "/disco-fish/index.html";
const NATURAL_WIDTH = 1023;
const NATURAL_HEIGHT = 750;

export default function DiscoFishFrame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) {
        setScale(width / NATURAL_WIDTH);
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="iframe-wrapper"
      style={{
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
