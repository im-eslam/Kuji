import { Button } from "react-aria-components";

interface LanguageToggleProps {
  label: string;
  ariaLabel: string;
  lang: string;
  onPress: () => void;
}

const styles = {
  button:
    "group animate-fade-in inline-flex min-h-12 min-w-12 items-center justify-center rounded-full p-1",
  label:
    "text-small inline-flex min-h-9 min-w-9 items-center justify-center rounded-full border border-white/70 bg-white/80 px-2 font-medium whitespace-nowrap transition group-data-hovered:bg-white group-data-pressed:scale-[0.98]",
};

export function LanguageToggle({
  label,
  ariaLabel,
  lang,
  onPress,
}: LanguageToggleProps) {
  return (
    <Button onPress={onPress} aria-label={ariaLabel} className={styles.button}>
      <span className={styles.label} lang={lang}>
        {label}
      </span>
    </Button>
  );
}
