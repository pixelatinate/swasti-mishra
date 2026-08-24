import type { Metadata } from "next";
import { getWritingLinks } from "@/lib/sanity/client";

export const metadata: Metadata = {
  title: "Swasti Mishra | Writing",
};

export const revalidate = 60;

export default async function WritingPage() {
  const links = await getWritingLinks();
  const wrote = links.filter((l) => l.category === "Wrote");
  const contributed = links.filter((l) => l.category === "Contributed");

  if (links.length === 0) {
    return (
      <>
        <h1>Writing</h1>
        <p>
          Nothing here yet — the writing list is pulled live from Sanity and hasn&apos;t been configured/seeded in
          this environment.
        </p>
      </>
    );
  }

  return (
    <>
      <h1>Writing</h1>
      {wrote.length > 0 && (
        <>
          <p>Here are some pages I wrote for the MATLAB documentation:</p>
          <ul>
            {wrote.map((link) => (
              <li key={link._id}>
                <a href={link.url}>{link.title}</a>
                {link.release && <> ({link.release})</>}
              </li>
            ))}
          </ul>
        </>
      )}
      {contributed.length > 0 && (
        <>
          <p>
            <br />
            Here are some pages I contributed to in the MATLAB documentation:
          </p>
          <ul>
            {contributed.map((link) => (
              <li key={link._id}>
                <a href={link.url}>{link.title}</a>
                {link.release && <> ({link.release})</>}
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
