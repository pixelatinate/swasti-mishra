"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./PortfolioGrid.module.css";

export type PortfolioTile =
  | { type: "image"; src: string; alt: string; caption?: string; href?: string; width: number; height: number }
  | { type: "video"; src: string; caption?: string; href?: string }
  | { type: "link"; href: string; label: string };

export default function PortfolioGrid({ items }: { items: PortfolioTile[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [openIndex]);

  const openItem =
    openIndex !== null && items[openIndex].type === "image"
      ? (items[openIndex] as Extract<PortfolioTile, { type: "image" }>)
      : null;

  return (
    <>
      <div className={styles.grid}>
        {items.map((item, i) => {
          if (item.type === "image" && item.href) {
            return (
              <a
                key={item.src}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.tile}
                aria-label={`View ${item.alt} on Instagram`}
              >
                <Image src={item.src} alt={item.alt} width={item.width} height={item.height} className={styles.tileImage} />
                {item.caption && <span className={styles.caption}>{item.caption}</span>}
              </a>
            );
          }
          if (item.type === "image") {
            return (
              <button
                key={item.src}
                type="button"
                className={styles.tile}
                onClick={() => setOpenIndex(i)}
                aria-label={`View ${item.alt}`}
              >
                <Image src={item.src} alt={item.alt} width={item.width} height={item.height} className={styles.tileImage} />
                {item.caption && <span className={styles.caption}>{item.caption}</span>}
              </button>
            );
          }
          if (item.type === "video") {
            return (
              <div key={item.src} className={styles.tile}>
                <video className={styles.tileVideo} controls>
                  <source src={item.src} type="video/mp4" />
                  Your browser does not support video playback.
                </video>
                {item.caption && item.href && (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className={styles.captionLink}>
                    {item.caption}
                  </a>
                )}
                {item.caption && !item.href && <span className={styles.caption}>{item.caption}</span>}
              </div>
            );
          }
          return (
            <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={`${styles.tile} ${styles.linkTile}`}>
              {item.label}
            </a>
          );
        })}
      </div>

      <div
        className={`${styles.overlay} ${openItem ? styles.overlayOpen : ""}`}
        onClick={() => setOpenIndex(null)}
        role={openItem ? "dialog" : undefined}
        aria-modal={openItem ? true : undefined}
      >
        {openItem && (
          <Image
            src={openItem.src}
            alt={openItem.alt}
            width={openItem.width}
            height={openItem.height}
            className={styles.fullImage}
          />
        )}
      </div>
    </>
  );
}
