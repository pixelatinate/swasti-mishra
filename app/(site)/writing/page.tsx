import type { Metadata } from "next";
import Image from "next/image";
import { getWritingLinks } from "@/lib/sanity/client";
import styles from "./writing.module.css";

export const metadata: Metadata = {
  title: "Swasti Mishra | Writing",
};

export const revalidate = 60;

// Set once a banner image is ready: { src: "/images/writing-hero.jpg", width: 2000, height: 500 }
const HERO_IMAGE: { src: string; width: number; height: number } | null = null;

export default async function WritingPage() {
  const links = await getWritingLinks();

  return (
    <>
      <h1 data-text="Writing">Writing</h1>
      <p>
        A collection of pages I&apos;ve written or contributed to, plus older writing samples I&apos;m slowly
        cataloging. Included is a live link, an online archived copy in case the original ever disappears, and
        sometimes a downloadable PDF backup.
      </p>

      {HERO_IMAGE && (
        <div className={styles.hero}>
          <Image src={HERO_IMAGE.src} alt="" width={HERO_IMAGE.width} height={HERO_IMAGE.height} priority />
        </div>
      )}

      {links.length === 0 ? (
        <p className={styles.empty}>
          Nothing here yet — the writing list is pulled live from Sanity and hasn&apos;t been configured/seeded in
          this environment.
        </p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Live</th>
                <th>Archived</th>
                <th>PDF</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link._id}>
                  <td>
                    {link.title}
                    {link.release && <span className={styles.release}> ({link.release})</span>}
                  </td>
                  <td>{link.category}</td>
                  <td>{link.url ? <a href={link.url}>Live</a> : "—"}</td>
                  <td>{link.archiveUrl ? <a href={link.archiveUrl}>Wayback</a> : "—"}</td>
                  <td>{link.driveUrl ? <a href={link.driveUrl}>PDF</a> : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
