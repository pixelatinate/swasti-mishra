"use client";

import { useEffect, useRef } from "react";

const DISCO_FISH_SRC = "/disco-fish/index.html";

export default function DiscoFishFrame() {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const frame = ref.current;
    if (frame) {
      frame.src = DISCO_FISH_SRC;
    }
    return () => {
      if (frame) {
        frame.src = "about:blank";
      }
    };
  }, []);

  return <iframe ref={ref} title="Disco Fish" id="disco_fish" />;
}
