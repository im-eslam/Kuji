import type { CSSProperties } from "react";
import { Link } from "react-aria-components";
import { Icon, type IconName } from "@/shared/icons";

type ActionCardTone = "standard" | "featured" | "social";

interface ActionCardProps {
  href: string;
  icon: IconName;
  title: string;
  hint?: string;
  tone?: ActionCardTone;
  index?: number;
  target?: string;
  rel?: string;
  newTabLabel?: string;
}

const styles = {
  card: "group stagger animate-reveal-in flex min-h-16 w-full items-center gap-4 rounded-lg px-4 py-3 transition data-pressed:scale-[0.98]",
  bubble: "flex size-11 shrink-0 items-center justify-center rounded-full",
  icon: "size-6",
  text: "min-w-0 flex-1",
  title: "text-heading block font-bold text-balance",
  hint: "text-small block",
  arrow:
    "size-5 shrink-0 opacity-70 transition-transform group-data-hovered:translate-x-1 rtl:group-data-hovered:-translate-x-1",
  srOnly: "sr-only",
};

const tones: Record<
  ActionCardTone,
  { card: string; bubble: string; hint: string }
> = {
  standard: {
    card: "border border-white/70 bg-white/80 text-navy data-hovered:bg-white",
    bubble: "bg-arctic text-navy",
    hint: "text-navy/65",
  },
  featured: {
    card: "bg-navy text-white data-hovered:bg-navy/90",
    bubble: "bg-yellow text-navy",
    hint: "text-white/75",
  },
  social: {
    card: "border border-white/70 bg-white/80 text-navy data-hovered:bg-white",
    bubble: "bg-navy text-yellow",
    hint: "text-navy/65",
  },
};

export function ActionCard({
  href,
  icon,
  title,
  hint,
  tone = "standard",
  index = 0,
  target,
  rel,
  newTabLabel,
}: ActionCardProps) {
  const look = tones[tone];

  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      style={{ "--i": index } as CSSProperties}
      className={`${styles.card} ${look.card}`}
    >
      <span className={`${styles.bubble} ${look.bubble}`}>
        <Icon name={icon} className={styles.icon} />
      </span>
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        {hint ? <span className={`${styles.hint} ${look.hint}`}>{hint}</span> : null}
      </span>
      <Icon name="arrow" className={styles.arrow} />
      {newTabLabel ? <span className={styles.srOnly}>{newTabLabel}</span> : null}
    </Link>
  );
}
