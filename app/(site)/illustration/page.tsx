import type { Metadata } from "next";
import PortfolioGrid, { type PortfolioTile } from "@/components/PortfolioGrid";

export const metadata: Metadata = {
  title: "Swasti Mishra | Illustration & Design",
};

const items: PortfolioTile[] = [
  {
    type: "image",
    src: "/images/illustration/illo-01a-lissa-mari.jpg",
    alt: "Two girls sitting on a couch together, one applying lipstick",
    caption: "May 2024",
    width: 1336,
    height: 1815,
  },
  {
    type: "image",
    src: "/images/illustration/illo-02-dimitri.jpg",
    alt: "A man in a fur-trimmed cloak gently holding the chin of a woman with dark hair",
    caption: "September 2022",
    width: 2048,
    height: 1511,
  },
  {
    type: "image",
    src: "/images/illustration/illo-03-here-she-comes.jpg",
    alt: "An armored woman with lavender hair conjuring a glowing crescent of magic in front of a castle",
    caption: "August 2022",
    width: 1607,
    height: 2160,
  },
  {
    type: "imageGroup",
    caption: "August 2022",
    images: [
      {
        src: "/images/illustration/illo-11-elf-embrace.png",
        alt: "A green-haired elf embracing a dark-haired woman in a doorway",
        width: 747,
        height: 1075,
      },
      {
        src: "/images/illustration/illo-12-elf-closeup.png",
        alt: "Close-up of a green-haired elf grinning while holding a woman's chin",
        width: 747,
        height: 1075,
      },
      {
        src: "/images/illustration/illo-13-elf-overhead.png",
        alt: "Overhead view of the same two characters embracing on a stone slab",
        width: 747,
        height: 1075,
      },
    ],
  },
  {
    type: "image",
    src: "/images/illustration/illo-04-made-for-each-other.jpg",
    alt: "Sticker-style portrait of two women, one in silver armor and one with blue hair",
    caption: "June 2022",
    width: 2048,
    height: 1312,
  },
  {
    type: "image",
    src: "/images/illustration/illo-05-triangle.jpg",
    alt: "Three people in dark academy uniforms — a man looking on as two women sit together on the floor",
    caption: "June 2022",
    width: 2048,
    height: 1418,
  },
  {
    type: "image",
    src: "/images/illustration/illo-06-hello-again.jpg",
    alt: "A woman with curly hair and sunglasses wearing a graphic sweater and plaid skirt",
    caption: "January 2022",
    width: 769,
    height: 972,
  },
  {
    type: "image",
    src: "/images/illustration/illo-07-daughter-missing.jpg",
    alt: "A man running his hands through his messy hair with a startled expression",
    caption: "March 2021",
    width: 1462,
    height: 1089,
  },
  {
    type: "image",
    src: "/images/illustration/illo-08-bruce.jpg",
    alt: "A young man with braided blue hair sitting cross-legged in an ornate red and gold room",
    caption: "December 2020",
    width: 1244,
    height: 1466,
  },
  {
    type: "image",
    src: "/images/illustration/illo-09-i-miss-him.jpg",
    alt: "A young man sitting at a cluttered desk in a whimsical study, reading a letter",
    caption: "August 2020",
    width: 2021,
    height: 1221,
  },
  {
    type: "image",
    src: "/images/illustration/illo-10-millennium-festival.jpg",
    alt: "Four fantasy characters celebrating together at a nighttime festival with fireworks",
    caption: "January 2020",
    width: 1785,
    height: 1109,
  },
];

export default function IllustrationPage() {
  return (
    <>
      <h1 data-text="Illustration & Design">Illustration & Design</h1>
      <p>I draw a little! Here are some of my favorites.</p>
      <div style={{ width: "90%", marginLeft: "5%" }}>
        <PortfolioGrid items={items} />
      </div>
    </>
  );
}
