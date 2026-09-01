"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "./PortfolioGrid.module.css";

type ImageLike = { src: string; alt: string; width: number; height: number };

export type PortfolioTile =
  | { type: "image"; src: string; alt: string; caption?: string; href?: string; width: number; height: number }
  // A set of images that share one grid tile (showing only the first as the
  // thumbnail) but can all be paged through once the lightbox is open.
  | { type: "imageGroup"; images: ImageLike[]; caption?: string }
  | { type: "video"; src: string; caption?: string; href?: string }
  | { type: "link"; href: string; label: string };

export default function PortfolioGrid({
  items,
  variant = "photo",
}: {
  items: PortfolioTile[];
  variant?: "photo" | "slide";
}) {
  // Lightbox navigation works over one flat list of every image across all
  // tiles (an imageGroup contributes all of its images, in order), so
  // "next"/"prev" pages through everything the same way whether it's moving
  // within one grouped piece or on to the next tile entirely.
  const flatImages = useMemo(() => {
    const flat: ImageLike[] = [];
    for (const item of items) {
      if (item.type === "image") flat.push(item);
      else if (item.type === "imageGroup") flat.push(...item.images);
    }
    return flat;
  }, [items]);

  const tileStartIndex = useMemo(() => {
    const starts: number[] = [];
    let cursor = 0;
    for (const item of items) {
      if (item.type === "image") {
        starts.push(cursor);
        cursor += 1;
      } else if (item.type === "imageGroup") {
        starts.push(cursor);
        cursor += item.images.length;
      } else {
        starts.push(-1);
      }
    }
    return starts;
  }, [items]);

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? i : (i - 1 + flatImages.length) % flatImages.length));
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : (i + 1) % flatImages.length));
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [openIndex, flatImages.length]);

  const openItem = openIndex !== null ? flatImages[openIndex] : null;
  const showNav = flatImages.length > 1;

  function showPrev() {
    setOpenIndex((i) => (i === null ? i : (i - 1 + flatImages.length) % flatImages.length));
  }
  function showNext() {
    setOpenIndex((i) => (i === null ? i : (i + 1) % flatImages.length));
  }

  const tileImageClassName = variant === "slide" ? `${styles.tileImage} ${styles.tileImageContain}` : styles.tileImage;

  return (
    <>
      <div className={variant === "slide" ? `${styles.grid} ${styles.gridSlide}` : styles.grid}>
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
                <Image src={item.src} alt={item.alt} width={item.width} height={item.height} className={tileImageClassName} />
                {item.caption && <span className={styles.caption}>{item.caption}</span>}
              </a>
            );
          }
          if (item.type === "image" || item.type === "imageGroup") {
            const thumb = item.type === "image" ? item : item.images[0];
            return (
              <button
                key={thumb.src}
                type="button"
                className={styles.tile}
                onClick={() => setOpenIndex(tileStartIndex[i])}
                aria-label={`View ${thumb.alt}`}
              >
                <Image src={thumb.src} alt={thumb.alt} width={thumb.width} height={thumb.height} className={tileImageClassName} />
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
        {openItem && showNav && (
          <>
            <button
              type="button"
              className={`${styles.navButton} ${styles.navButtonPrev}`}
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
            >
              <FaChevronLeft />
            </button>
            <button
              type="button"
              className={`${styles.navButton} ${styles.navButtonNext}`}
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
            >
              <FaChevronRight />
            </button>
          </>
        )}
      </div>
    </>
  );
}
