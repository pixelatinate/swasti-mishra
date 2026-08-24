import type { ReactNode } from "react";
import styles from "./PortfolioSection.module.css";

type PortfolioSectionProps = {
  title: string;
  date: string;
  description: string;
  children: ReactNode;
};

export default function PortfolioSection({ title, date, description, children }: PortfolioSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <span className={styles.date}>{date}</span>
      </div>
      <p className={styles.description}>{description}</p>
      {children}
    </section>
  );
}
