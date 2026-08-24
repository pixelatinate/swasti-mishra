import type { Metadata } from "next";
import DiscoFishFrame from "@/components/DiscoFishFrame";

export const metadata: Metadata = {
  title: "Swasti Mishra | Coding",
};

export default function CodingPage() {
  return (
    <>
      <h1>Coding Work</h1>
      <p>
        Most of my programming work can be found on my GitHub account:{" "}
        <a href="https://github.com/pixelatinate">https://github.com/pixelatinate</a>. A lot of my prior coursework
        is preserved there. The lack of recent commit activity is because nearly all of my day-to-day coding happens at
        work, which doesn&apos;t show up here.
        <br />
        <br />
        In addition to the projects you can view there, you can also check out the website I built for the{" "}
        <a href="https://ccc19.org/index.html" style={{ fontWeight: 700 }}>
          Covid-19 &amp; Cancer Consortium
        </a>
        , a multi-page site for a 120+ institution medical consortium that used the Altmetric API.
        <br />
        <br />
        I also collaborated on{" "}
        <a href="https://github.com/jmandzak/CatalogVisualizer">CatalogVisualizer</a>, a course catalog data
        visualization tool built with jQuery and webpack.
        <br />
        <br />
        And here is a neat little project I did for a Graphics class in college: <br />
      </p>
      <DiscoFishFrame />
    </>
  );
}
