import { Button } from "react-aria-components";
import { Icon, type IconName } from "@/shared/icons";

interface ChoiceCardProps {
  icon: IconName;
  title: string;
  hint: string;
  onPress: () => void;
}

const styles = {
  card: "group flex w-full items-center gap-4 rounded-lg border border-white/70 bg-white/80 px-4 py-4 text-start transition data-hovered:bg-white data-pressed:scale-[0.98]",
  bubble: "flex size-12 shrink-0 items-center justify-center rounded-full bg-yellow text-navy",
  icon: "size-6",
  text: "min-w-0 flex-1",
  title: "text-heading block font-bold text-balance",
  hint: "text-small block text-balance text-navy/65",
  arrow: "size-5 shrink-0 opacity-70 transition-transform group-data-hovered:translate-x-1 rtl:group-data-hovered:-translate-x-1",
};

export function ChoiceCard({ icon, title, hint, onPress }: ChoiceCardProps) {
  return (
    <Button onPress={onPress} className={styles.card}>
      <span className={styles.bubble}>
        <Icon name={icon} className={styles.icon} />
      </span>
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        <span className={styles.hint}>{hint}</span>
      </span>
      <Icon name="arrow" className={styles.arrow} />
    </Button>
  );
}
