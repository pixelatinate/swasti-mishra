import type { Metadata } from "next";
import PortfolioSection from "@/components/PortfolioSection";
import PortfolioGrid, { type PortfolioTile } from "@/components/PortfolioGrid";

export const metadata: Metadata = {
  title: "Swasti Mishra | Graphic Design",
};

const edvoItems: PortfolioTile[] = [
  { type: "image", src: "/images/pay-attention.png", alt: "Edvo social post: Pay Attention", href: "https://www.instagram.com/p/CJkLbRjBmbS/", width: 1194, height: 1194 },
  { type: "image", src: "/images/cure-to-cancer.png", alt: "Edvo social post: Cure to Cancer", href: "https://www.instagram.com/p/CCKSaTRFcE_/", width: 1112, height: 1110 },
  { type: "image", src: "/images/9-to-5.png", alt: "Edvo social post: 9 to 5", href: "https://www.instagram.com/p/CCM3MXZq_vD/", width: 860, height: 860 },
  { type: "image", src: "/images/this-you.png", alt: "Edvo social post: This You", href: "https://www.instagram.com/p/CCbq0NdAwxw/", width: 1148, height: 1146 },
  { type: "video", src: "/images/thor-ragnarok.mp4", caption: "View on Instagram Reels", href: "https://www.instagram.com/reel/CDo5G8zjh98/" },
  { type: "image", src: "/images/competence.jpg", alt: "Edvo social post", href: "https://www.instagram.com/p/CE79F6-glqz/", width: 750, height: 745 },
];

const shirtItems: PortfolioTile[] = [
  { type: "image", src: "/images/shirt-concept.webp", alt: "T-shirt concept sketch", caption: "The concept...", width: 1188, height: 750 },
  { type: "image", src: "/images/shirt-clean.webp", alt: "Cleaned up t-shirt design", caption: "...the cleaned up design...", width: 1460, height: 1017 },
  { type: "image", src: "/images/shirt-complete.jpg", alt: "Finished t-shirt", caption: "...the finished shirt.", width: 1702, height: 1075 },
];

const awardsItems: PortfolioTile[] = [
  { type: "image", src: "/images/awards-screen.webp", alt: "Awards certificate design on screen", caption: "From the design...", width: 1540, height: 1018 },
  { type: "image", src: "/images/awards-framed.webp", alt: "Awards certificate framed", caption: "...to being framed and signed...", width: 1205, height: 904 },
  { type: "image", src: "/images/awards-held.webp", alt: "Awards certificate held by recipient", caption: "...to the recipients.", width: 685, height: 473 },
];

const buttonsItems: PortfolioTile[] = [
  { type: "image", src: "/images/buttons-transparent.webp", alt: "Election button design", caption: "The vision...", width: 750, height: 750 },
  { type: "image", src: "/images/buttons-physical.webp", alt: "Physical election buttons", caption: "...realized!", width: 1166, height: 904 },
];

const nplItems: PortfolioTile[] = [
  { type: "image", src: "/images/npl-covers.webp", alt: "Book cover poster design", caption: "The covers,", width: 701, height: 944 },
  { type: "image", src: "/images/npl-edited.webp", alt: "Edited book poster design", caption: "the books,", width: 617, height: 830 },
  { type: "image", src: "/images/herring.webp", alt: "Library display poster", caption: "and a display.", width: 1648, height: 830 },
];

export default function GraphicDesignPage() {
  return (
    <>
      <h1>Graphic Design</h1>

      <PortfolioSection
        title="Edvo"
        description="June 2021 — insightful content creation for Edvo's social media channels."
      >
        <PortfolioGrid items={edvoItems} />
      </PortfolioSection>

      <PortfolioSection
        title="Tennessee Speech and Debate"
        description="March 2021 – February 2020 — designed the t-shirts and awards certificates for the Tennessee Speech and Debate Society's Vol Classic Tournament."
      >
        <PortfolioGrid items={[...shirtItems, ...awardsItems]} />
      </PortfolioSection>

      <PortfolioSection
        title="Youth in Government Election Buttons"
        description="November 2018 — designed pins for a commissioner's election campaign, to their specifications."
      >
        <PortfolioGrid items={buttonsItems} />
      </PortfolioSection>

      <PortfolioSection
        title="The Nashville Public Library"
        description="July 2018 — encouraged patrons to participate in The Great American Read through the use of posters."
      >
        <PortfolioGrid items={nplItems} />
      </PortfolioSection>
    </>
  );
}
