import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Swasti Mishra | About & Contact",
};

export default function AboutPage() {
  return (
    <>
      <h1>About & Contact</h1>
      <div className="about">
        <Image
          src="/images/swasti.jpg"
          alt="Yes, this picture is mirrored. And yes, I like it better this way."
          width={932}
          height={1030}
        />
        <div className="about-description">
          <p>
            Hello! This is a picture of me!
            <br />
            <br />
            I graduated cum laude from the University of Tennessee, Knoxville&apos;s Tickle College of Engineering
            with a B.S. in Computer Science in May 2023. While there, I was involved in the Tennessee Speech and
            Debate Society, the Society of Women Engineers, and the Heath Integrated Business and Engineering
            Program.
            <br />
            <br />
            I started at MathWorks as a software engineer in the Engineering Development Group before progressing into a
            technical documentation role writing reference pages for MATLAB&apos;s interfaces to Python and C++,
            MATLAB Performance, and Foundation Architecture. My pages averaged about 1.85 million views a year.
            <br />
            <br />
            I'm currently working as a Technical Writer / Content Engineer at Databricks, where I document Lakeflow Connect, among other areas. 
            Lakeflow connect encompasses connectors like Google Analytics, Anthropic, TikTok Ads, Kafka, and RabbitMQ. I also helped
            lead a rework of how the release notes got published.
            <br />
            <br />
            I&apos;ve since moved to Seattle and am looking for what&apos;s next. Ideally, I'd love to be involved with projects that
            allow me to build stuff and write about it. If you&apos;d like to get in touch, please shoot me a
            message on <a href="https://www.linkedin.com/in/swasti-mishra/">LinkedIn</a>, or use the form below.
          </p>
          <ContactForm />
        </div>
      </div>
    </>
  );
}
