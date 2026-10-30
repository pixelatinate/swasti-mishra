import Link from "next/link";
import Image from "next/image";

// Cards render at ~72% of the viewport on desktop and ~95% on mobile; without
// this hint next/image fetches the 3840px variant.
const CARD_SIZES = "(max-width: 825px) 95vw, 72vw";

export default function Home() {
  return (
    <>
      <Link href="/projects#disco_fish">
        <div className="slides">
          <video
            src="/images/graphics-proj.mp4"
            poster="/images/graphics-proj-poster.jpg"
            width={1992}
            height={1190}
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="description">
            <h1>Projects</h1>
            <p>Check out the development projects I&apos;m noodling on.</p>
          </div>
        </div>
      </Link>
      <Link href="/writing">
        <div className="slides">
          <Image src="/images/mathworks-doc.png" alt="" width={1917} height={969} sizes={CARD_SIZES} />
          <div className="description" style={{ color: "#2289db" }}>
            <h1 style={{ color: "#f48c0a" }}>Writing</h1>
            <p style={{ color: "#2289db" }}>Some articles I&apos;ve written for work and/or pleasure.</p>
          </div>
        </div>
      </Link>
      <Link href="/illustration">
        <div className="slides">
          <Image src="/images/illustrations-card.jpg" alt="" width={1222} height={699} sizes={CARD_SIZES} />
          <div className="description">
            <h1>Illustration</h1>
            <p>I like to draw, too :)</p>
          </div>
        </div>
      </Link>
    </>
  );
}
