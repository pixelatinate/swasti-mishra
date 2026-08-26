import type { ReactNode } from "react";
import styles from "./PortfolioSection.module.css";

type PortfolioSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function PortfolioSection({ title, description, children }: PortfolioSectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      {children}
    </section>
  );
}
