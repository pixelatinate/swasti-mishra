import type { Metadata } from "next";
import Image from "next/image";
import PortfolioSection from "@/components/PortfolioSection";
import SlideDeck, { type Slide } from "@/components/SlideDeck";
import DiscoFishFrame from "@/components/DiscoFishFrame";

export const metadata: Metadata = {
  title: "Swasti Mishra | Projects",
};

const slideNotes: string[] = [
  "Hi, everyone! I'm Swasti. I'm a rising senior at the University of Tennessee - Knoxville studying Computer Science, but I've been based in Boston this summer. These past ten weeks, I've been working with the Support Operations team, and it's been really pleasant. I've loved the culture and how helpful everyone has been. Closer to the beginning of this project, I reached out to a few of you [SMEs] for help with documentation, and everyone responded with a lot of warmth, and I really appreciated that. So I'm looking forward to sharing what I worked on with you all.",
  "So, as I'm sure you all are aware, some people on the Support Team have been here for longer or know how to more effectively address certain problems than the rest of the team. My project this summer was focused on enabling these experienced members of the team, or Subject Matter Experts, to be able to write guides so that other support engineers could get to the expert level more quickly. Further, these guides were to be written in a way that encourages support engineers to practice their new skills as they were learning. This is why they're 'labs'. Basically, you have an activity to do alongside the material.",
  "In order to achieve this objective, Andy, my mentor, suggested creating a lab library that would contain all of our existing documentation in a standard format and include a structure for requesting and writing new documentation. Further, this format should encourage SMEs to include some method for support engineers to follow along.",
  "With those requirements outlined, step one of building this database was to read through existing labs and look for patterns. Generally, a lab requires a title, what the product in question is, the issue the lab addresses, an environment for replicating the problem, instructions on how to fix it, the desired result, optionally, a case study, and credits, as a thanks to the SME. Using these requirements, I released a template for lab documentation on Google Drive. One thing to note - in the content of this template, you'll find some instructions on how to write labs. It's important to remember that you should be writing for a pretty low familiarity level. I realize that I'm probably not the person you're writing for, seeing as I'm an intern, but it may help to imagine that you're writing for a person like me, just to be safe.",
  "Step two was going through existing resources and putting them into this format. The Support Team had a boot camp a few months ago, which was a GREAT opportunity for documentation. So I had all these awesome slides with the requisite images and video explanations, and for a couple weeks, I worked on translating existing documentation from videos into the doc format. Unfortunately, I very quickly realized that embedded links aren't clickable in GitHub's PDF viewer. So I started uploading both PDF and Markdown files that I converted by hand, by copying and pasting into an online converter. This process worked okay for a while — a little slow re-linking and resizing images, and reformatting to the Markdown style I liked — but it worked okay until I got to one particularly image-heavy overview presentation.",
  "That overview was a really good crash course on a complex internal system, and it included a lot of pictures, which is great because it helps you follow along. Unfortunately, manually linking all of those images was a nightmare when going from PDF to Markdown, especially because when Google Docs exports, it doesn't put images in any particular order. I didn't mind doing it by hand at the time — menial tasks are classic intern work — but I started thinking about it and realized no one was going to maintain consistency in this library if it was such a pain to convert from Google Docs into Markdown.",
  "So my unexpected third step was writing a tool that would convert this documentation into Markdown. Next, I'll walk you all through how to use it. I have the html2md converter tool set up as a git submodule in the lab library, so you can clone both, or just html2md depending on what you need.",
  "Check the README for detailed instructions. Once you're done with the documentation and you've gone through the proper review process, you export your documentation as a web page by going to File > Download > Web Page. You then unzip the file and move the resulting folder into your local html2md directory.",
  "Run one command to convert your file, and you're all done! A bunch of stuff prints out to the terminal telling you what happened — the file I wrote plugs your HTML document into an existing open-source HTML-to-Markdown converter, and then my code removes the header image and swaps it for a static Lab Documentation header, reformats the title and subtitle, resizes the product pictures, removes the footer, and fixes the links, which was an extremely annoying thing to get right.",
  "At this point, all you need to do is move your documentation folder into the lab library directory, which is easy if you cloned the lab library first and ran a submodule update to get the html2md tool. If you didn't, that's fine too — you can just clone the html2md repository on its own if you only want the tool and not all the existing documentation.",
  "With that, the lab library is operational, and we're at the end of my internship here! I really hope this is a useful tool for the team and that everyone's able to maintain and contribute to it. I know that maintaining knowledge bases at a distributed company is a challenge, but I hope this database grows.",
  "Thanks for your support the past few weeks!",
];

const slides: Slide[] = slideNotes.map((notes, i) => ({
  src: `/images/datastax/slide-${String(i + 1).padStart(2, "0")}.png`,
  width: 1500,
  height: 844,
  notes,
}));

export default function ProjectsPage() {
  return (
    <>
      <h1 data-text="Projects">Projects</h1>
      <p>
        This is an archive of some random development projects I&apos;ve worked on over the past few years!
      </p>

      <PortfolioSection
        title="Disco Fish: Spring 2024"
        description="A WebGL scene I built for a Graphics class in college. Drag the sliders to move the camera around, or switch between the inner and outer egg views."
      >
        <p style={{ marginTop: 0 }}>
          The fish uses a per-pixel Phong lighting model, meaning that ambient, diffuse, and specular lighting are all
          computed per-fragment. A tangent-space normal map is layered on top for the scales&apos; bumpy detail.
          The egg and the bubbles are both real-time reflection/refraction shaders, and a Fresnel term blends between the two based on viewing angle, sampling a
          skybox cube map as the environment. That same cube map, rendered onto an inside-out cube, is the
          background skybox itself.
        </p>
        <DiscoFishFrame />
      </PortfolioSection>

      <PortfolioSection
        title="html2md: Summer 2022"
        description="At my summer 2022 internship at Datastax, I built a lab documentation library and a Python tool that automated converting Google Docs into Markdown, saving the Support team from doing it by hand."
      >
        <p style={{ marginTop: 0 }}>
          I spent the summer with the DataStax&apos;s Support Operations team, facilitating the process of turning their knowledge into hands-on lab guides that newer support
          engineers could learn from. Initially, my intern project was only to convert a bunch of videos and writeups to documents. But after manually converting a backlog of existing training material into a
          consistent format — a process that got painfully tedious once image-heavy docs were involved — I wrote a
          Python tool, <code>html2md</code>, that automated the whole pipeline. I also wrote the documentation
          guidelines the team used to review and publish new labs going forward.
        </p>
        <p>
          Slide through my end-of-internship presentation below and read my speaker
          notes underneath each slide.
        </p>
        <SlideDeck slides={slides} />
      </PortfolioSection>

      <PortfolioSection
        title="Covid-19 & Cancer Consortium: Fall 2021 to Spring 2022"
        description="A multi-page site showcasing CCC-19's publications and their impact on COVID-19 research."
      >
        <p>
          I built the website for the{" "}
          <a href="https://ccc19.org/index.html" style={{ fontWeight: 700 }}>
            Covid-19 &amp; Cancer Consortium
          </a>
          , a multi-page site for a 120+ institution medical consortium. I used JSON and D3.js to visualize
          collaboration between the member institutions, and integrated the Altmetric API so visitors could gauge
          each publication&apos;s impact. I also evaluated and selected a hosting provider based on the
          consortium&apos;s needs and budget, then wrote documentation so the team could maintain the site
          independently going forward.
        </p>
        <a
          href="https://ccc19.org/index.html"
          style={{ display: "block", position: "relative", width: "100%", aspectRatio: "3 / 1", overflow: "hidden", borderRadius: 5, boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)", margin: 0, padding: 0 }}
        >
          <Image
            src="/images/projects/covid-coronavirus.jpg"
            alt="Magnified illustration of the coronavirus"
            fill
            style={{ objectFit: "cover", margin: 0 }}
          />
        </a>
      </PortfolioSection>

      <PortfolioSection
        title="CatalogVisualizer: Summer 2022 to Spring 2023"
        description="An interactive tool that helps UT Knoxville CoSci students plan which classes to take, and in what order."
      >
        <p>
          I supported a fellow student in building{" "} 
          <a href="https://github.com/jmandzak/CatalogVisualizer" style={{ fontWeight: 700 }}>
            CatalogVisualizer
          </a>,
          which helps University of Tennessee - Knoxville Computer Science students figure out which classes to take and
          in what order. A Python web scraper pulls the university&apos;s course catalog into a JSON file, which the
          site renders as nodes on a graph. It uses the LeaderLine library to draw connections between classes and
          their prerequisites or corequisites. This project was requested by multiple professors and advisors, since it turns
          a confusing set of degree requirements into something visual and easy to plan around.
        </p>
      </PortfolioSection>
    </>
  );
}
