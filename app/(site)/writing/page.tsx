import type { Metadata } from "next";
import { Fragment } from "react";
import Image from "next/image";
import { getWritingLinks, type WritingLink } from "@/lib/sanity/client";
import styles from "./writing.module.css";

export const metadata: Metadata = {
  title: "Swasti Mishra | Writing",
};

export const revalidate = 60;

// Set once a banner image is ready: { src: "/images/writing-hero.jpg", width: 2000, height: 500 }
const HERO_IMAGE: { src: string; width: number; height: number } | null = null;

// "R2026a" -> 4052, "R2025b" -> 4051, etc. — higher sorts more recent.
function releaseValue(release: string): number {
  const match = /^R(\d{4})([ab])$/.exec(release);
  if (!match) return 0;
  return Number(match[1]) * 2 + (match[2] === "b" ? 1 : 0);
}

function groupByRelease(notes: WritingLink[]): [string, WritingLink[]][] {
  const groups = new Map<string, WritingLink[]>();
  for (const note of notes) {
    const key = note.release ?? "Unknown";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(note);
  }
  for (const group of groups.values()) {
    group.sort((a, b) => a.title.localeCompare(b.title));
  }
  return Array.from(groups.entries()).sort((a, b) => releaseValue(b[0]) - releaseValue(a[0]));
}

export default async function WritingPage() {
  const links = await getWritingLinks();
  const pages = [...links.filter((link) => link.section === "Page")].sort(
    (a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title)
  );
  const releaseNotesByRelease = groupByRelease(links.filter((link) => link.section === "Release Note"));

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
        <>
          <h2 className={styles.sectionTitle}>Pages</h2>
          {pages.length === 0 ? (
            <p className={styles.empty}>Nothing here yet.</p>
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
                  {pages.map((link) => (
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

          <h2 className={styles.sectionTitle}>Release Notes</h2>
          <p className={styles.noteDisclaimer}>
            Descriptions below are written in my own words, not copied from MathWorks&apos; documentation — that
            text is theirs, not mine to republish. Follow the link on each note to read the original.
          </p>
          {releaseNotesByRelease.length === 0 ? (
            <p className={styles.empty}>Nothing here yet.</p>
          ) : (
            releaseNotesByRelease.map(([release, notes]) => (
              <section key={release} className={styles.releaseGroup}>
                <h3 className={styles.releaseHeading}>{release}</h3>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Live</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notes.map((note) => (
                        <Fragment key={note._id}>
                          <tr>
                            <td>
                              {note.title}
                              {note.changeType && <span className={styles.noteBadge}>{note.changeType}</span>}
                            </td>
                            <td>{note.url ? <a href={note.url}>Live</a> : "—"}</td>
                          </tr>
                          {note.summary && (
                            <tr>
                              <td colSpan={2} className={styles.noteSummary}>
                                {note.summary}
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))
          )}
        </>
      )}
    </>
  );
}
