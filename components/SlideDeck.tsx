"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./SlideDeck.module.css";

export type Slide = {
  src: string;
  width: number;
  height: number;
  notes: string;
};

export default function SlideDeck({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const current = slides[index];

  function goTo(next: number) {
    setIndex(((next % slides.length) + slides.length) % slides.length);
  }

  return (
    <div className={styles.deck}>
      <div className={styles.viewer}>
        <button
          type="button"
          className={`${styles.navButton} ${styles.prev}`}
          onClick={() => goTo(index - 1)}
          aria-label="Previous slide"
        >
          &#8249;
        </button>
        <Image
          key={current.src}
          src={current.src}
          alt={`Slide ${index + 1} of ${slides.length}`}
          width={current.width}
          height={current.height}
          className={styles.slideImage}
          priority={index === 0}
        />
        <button
          type="button"
          className={`${styles.navButton} ${styles.next}`}
          onClick={() => goTo(index + 1)}
          aria-label="Next slide"
        >
          &#8250;
        </button>
      </div>

      <div className={styles.counter}>
        {index + 1} / {slides.length}
      </div>

      <p key={index} className={styles.notes}>
        {current.notes}
      </p>
    </div>
  );
}
