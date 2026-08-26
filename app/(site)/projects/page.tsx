import type { Metadata } from "next";
import PortfolioSection from "@/components/PortfolioSection";
import SlideDeck, { type Slide } from "@/components/SlideDeck";
import DiscoFishFrame from "@/components/DiscoFishFrame";

export const metadata: Metadata = {
  title: "Swasti Mishra | Projects",
};

const slideNotes: string[] = [
  "Hi, everyone! I'm Swasti- I'm a rising senior at the University of Tennessee - Knoxville studying Computer Science, but I've been based in Boston this summer. These past ten weeks, I've been working with the Support Operations team, and it's been really pleasant. I've loved the work culture here, and how helpful everyone has been. Closer to the beginning of this project, I reached out to a few of you for help with documentation, and everyone responded with a lot of warmth, and I really appreciated that. So I'm looking forward to sharing what I worked on with you all- and with that, I will take it away.",
  "So, as I'm sure you all are aware, some people on the Support Team have been here longer or know how to more effectively address certain problems than the rest of the team. My project this summer was essentially focused on enabling these experienced members of the team, or Subject Matter Experts, to be able to write guides so that other support engineers could get to that expert level more quickly. Further, these guides should be written in a way that encourages support engineers to practice these new skills they were learning as they were learning them. This is why they're labs- basically, you have an activity to do alongside the material.",
  "In order to achieve this objective, Andy, my mentor, suggested creating a lab library that would contain all of our existing documentation in a standard format, and include a structure for requesting and writing new documentation. Further, this format should encourage subject matter experts to include some method for support engineers to follow along.",
  "With those requirements outlined, step one of building this database was to read through existing labs and look for patterns. Generally, a lab requires a title, what the product in question is, the issue the lab addresses, an environment for replicating the problem, instructions on how to fix it, the desired result, optionally, a case study, and credits, as a thanks to the SME. Using these requirements, I released a template for lab documentation on Google Drive. One other thing to note- in the content of this template, you'll find some instructions on how to write labs. It's important to remember that you should be writing for a pretty low familiarity level. I realize that I'm probably not the person you're writing for, seeing as I'm an intern, but it may help to imagine that you're writing for a person like me, just to be safe.",
  "Step two was going through existing resources and putting them into this format. The Support Team had a boot camp a few months ago, which was a GREAT opportunity for documentation. So I had all these awesome slides with the requisite images and video explanations, and for a couple weeks, I worked on translating existing documentation from videos into the doc format. Unfortunately, I very quickly realized that embedded links aren't clickable in GitHub's PDF viewer. So I started uploading both PDF and Markdown files that I converted by hand, by copying and pasting into an online converter. This process worked okay for a while — a little slow re-linking and resizing images, and reformatting to the Markdown style I liked — but it worked okay until I got to one particularly image-heavy overview presentation.",
  "That overview was a really good crash course on a complex internal system, and it included a lot of pictures, which is great because it helps you follow along. Unfortunately, manually linking all of those images was a nightmare and a half when going from PDF to Markdown, especially because when Google Docs exports, it doesn't put images in any particular order. I didn't mind doing it by hand at the time — menial tasks are classic intern work — but I started thinking about it and realized no one was going to maintain consistency in this library if it was such a pain to convert from Google Docs into Markdown.",
  "So my unexpected third step was writing a tool that would convert this documentation into Markdown. I'm not going to do a live demo here because in my experience, that's the time the code decides to act up, but rest assured that this tool works perfectly. That being said, I'll walk you all through how to use it. Keep in mind, I have this html2md converter tool set up as a git submodule in the lab library, so you can clone both, or just html2md depending on what you want.",
  "Basically, you just follow the instructions on the README. Once you're done with the documentation, and you've gone through the proper review process, you export your documentation as a web page by going to File, then Download, then Web Page. You then unzip the file and move the resulting folder into your local html2md directory.",
  "Run one command to convert your file, and you're all done! A bunch of stuff prints out to the terminal telling you what happened — the file I wrote plugs your HTML document into an existing open-source HTML-to-Markdown converter, and then my code removes the header image and swaps it for a static Lab Documentation header, reformats the title and subtitle, resizes the product pictures, removes the footer, and fixes the links, which was an especially annoying thing to get right. I'm predominantly a C++ person, so patching someone else's Python for a few weeks of internship left was more practical than rewriting it outright.",
  "At this point, all you need to do is move your documentation folder into the lab library directory, which is easy if you cloned the lab library first and ran a submodule update to get the html2md tool. If you didn't, that's fine too — you can just clone the html2md repository on its own if you only want the tool and not all the existing documentation.",
  "And with that, the lab library is operational, and we're at the end of my ten weeks here! I really hope this is a useful tool for the team, and that everyone's able to maintain it comfortably, since maintaining knowledge bases at a distributed company is genuinely a challenge. I hope this database grows.",
  "With that, I'd like to thank everyone who helped these past few weeks, and I'd love to answer questions!",
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
      <h1>Projects</h1>
      <p>
        Most of my programming work can be found on my GitHub account:{" "}
        <a href="https://github.com/pixelatinate">https://github.com/pixelatinate</a>. A lot of my prior coursework
        is preserved there. The lack of recent commit activity is because nearly all of my day-to-day coding happens
        at work, which doesn&apos;t show up here.
      </p>

      <PortfolioSection
        title="Disco Fish"
        description="A WebGL scene I built for a Graphics class in college — drag the sliders to move the camera around, or switch between the inner and outer egg views."
      >
        <DiscoFishFrame />
      </PortfolioSection>

      <PortfolioSection
        title="DataStax"
        description="Summer 2022 Software Engineer internship — built a lab-documentation library and a Python tool that automated converting Google Docs into Markdown, saving the Support team from doing it by hand."
      >
        <p style={{ marginTop: 0 }}>
          I spent the summer with DataStax&apos;s Support Operations team, working on a way to let the
          team&apos;s subject-matter experts turn their knowledge into hands-on lab guides that newer support
          engineers could learn from. After manually converting a backlog of existing training material into a
          consistent format — a process that got painfully tedious once image-heavy docs were involved — I wrote a
          Python tool, <code>html2md</code>, that automated the whole pipeline. I also wrote the documentation
          guidelines the team used to review and publish new labs going forward.
        </p>
        <p>
          Slide through my end-of-internship presentation below (
          <a href="/documents/datastax-intern-presentation.pdf">download the original PDF</a>), or read my speaker
          notes underneath each slide.
        </p>
        <SlideDeck slides={slides} />
      </PortfolioSection>

      <PortfolioSection
        title="Covid-19 & Cancer Consortium"
        description="Nov 2021 – Apr 2022, Web Developer — a multi-page site showcasing CCC-19's publications and their impact on COVID-19 research."
      >
        <p>
          Built the website for the{" "}
          <a href="https://ccc19.org/index.html" style={{ fontWeight: 700 }}>
            Covid-19 &amp; Cancer Consortium
          </a>
          , a multi-page site for a 120+ institution medical consortium. Used JSON and D3.js to visualize
          collaboration between the member institutions, and integrated the Altmetric API so visitors could gauge
          each publication&apos;s impact. I also evaluated and selected a hosting provider based on the
          consortium&apos;s needs and budget, then wrote documentation so the team could maintain the site
          independently going forward.
        </p>
      </PortfolioSection>

      <PortfolioSection
        title="CatalogVisualizer"
        description="Aug 2022 – May 2023 — an interactive tool that helps UT Knoxville CS students plan which classes to take, and in what order."
      >
        <p>
          Built with a fellow student, <a href="https://github.com/jmandzak/CatalogVisualizer">CatalogVisualizer</a>{" "}
          helps University of Tennessee - Knoxville Computer Science students figure out which classes to take and
          in what order. A Python web scraper pulls the university&apos;s course catalog into a JSON file, which the
          site renders as nodes on a graph — using the LeaderLine library to draw connections between classes and
          their prerequisites or corequisites. It was requested by multiple professors and advisors, since it turns
          a confusing set of degree requirements into something visual and easy to plan around.
        </p>
      </PortfolioSection>
    </>
  );
}
