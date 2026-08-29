"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/writing", label: "Writing" },
  { href: "/illustration", label: "Illustration & Design" },
  { href: "/about", label: "About & Contact" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="sidebar">
      <Link href="/" title="You are here!">
        <Image src="/images/avatar.png" alt="" width={111} height={133} priority />
      </Link>
      <h1 data-text="Swasti Mishra">Swasti Mishra</h1>
      <h2>Currently in Seattle, WA.<br/>Open to anywhere.</h2>
      <ul className="sidebar-links">
        {NAV_LINKS.map(({ href, label }) => (
          <Link key={href} href={href} className={pathname === href ? "active" : undefined}>
            <li>{label}</li>
          </Link>
        ))}
      </ul>
      <div className="social-links">
        <a
          className="link-linkedin"
          href="https://www.linkedin.com/in/swasti-mishra/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin />
        </a>
        <a className="link-github" href="https://github.com/pixelatinate" target="_blank" rel="noopener noreferrer">
          <FaGithub />
        </a>
        <a
          className="link-instagram"
          href="https://www.instagram.com/pixelatinate/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram />
        </a>
        <ThemeToggle />
      </div>
    </div>
  );
}
