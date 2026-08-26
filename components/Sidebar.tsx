"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

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
        <Image src="/images/favicon.png" alt="" width={111} height={133} />
      </Link>
      <h1>Swasti Mishra</h1>
      <h2>Currently in Seattle, WA.<br/>Open to anywhere.</h2>
      <ul className="sidebar-links">
        {NAV_LINKS.map(({ href, label }) => (
          <Link key={href} href={href} className={pathname === href ? "active" : undefined}>
            <li>{label}</li>
          </Link>
        ))}
      </ul>
      <div className="social-links">
        <a href="https://www.linkedin.com/in/swasti-mishra/" target="_blank" rel="noopener noreferrer">
          <FaLinkedin />
        </a>
        <a href="https://github.com/pixelatinate" target="_blank" rel="noopener noreferrer">
          <FaGithub />
        </a>
        <a href="https://www.instagram.com/pixelatinate/?hl=en" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
      </div>
    </div>
  );
}
