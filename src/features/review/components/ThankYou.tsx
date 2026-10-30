import { Button } from "react-aria-components";
import { Icon } from "@/shared/icons";

interface ThankYouProps {
  message: string;
  closeLabel: string;
  onClose: () => void;
}

const styles = {
  wrapper: "flex flex-col items-center gap-4 py-6 text-center",
  bubble: "flex size-14 items-center justify-center rounded-full bg-success text-white",
  icon: "size-7",
  message: "text-heading font-bold text-balance",
  button: "text-small mt-2 min-h-12 rounded-full bg-navy px-8 font-bold text-white transition data-hovered:bg-navy/90 data-pressed:scale-[0.98]",
};

export function ThankYou({ message, closeLabel, onClose }: ThankYouProps) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.bubble}>
        <Icon name="check" className={styles.icon} />
      </span>
      <p className={styles.message}>{message}</p>
      <Button onPress={onClose} className={styles.button}>
        {closeLabel}
      </Button>
    </div>
  );
}
