import {
  Button,
  Form,
  Input,
  Label,
  Text,
  TextArea,
  TextField,
} from "react-aria-components";

export interface ReviewFormValues {
  message: string;
  name: string;
  contact: string;
  website: string;
}

interface ReviewFormProps {
  values: ReviewFormValues;
  onChange: (field: keyof ReviewFormValues, value: string) => void;
  onSubmit: () => void;
  limits: { note: number; name: number; contact: number };
  labels: {
    note: string;
    name: string;
    contact: string;
    submit: string;
  };
  noteHint?: string;
  canSubmit: boolean;
  error: string | null;
}

const styles = {
  form: "flex flex-col gap-4 pb-2",
  field: "flex flex-col gap-1.5",
  label: "text-small font-bold",
  control:
    "text-body w-full rounded-lg border border-navy/15 bg-white px-4 py-3 placeholder:text-navy/40 outline-none focus:border-navy",
  textarea: "min-h-32 resize-y",
  hint: "text-caption text-navy/65",
  error:
    "text-small rounded-lg border border-error/30 bg-error/10 px-4 py-3 font-bold text-error",
  submit:
    "text-small mt-1 min-h-12 rounded-full bg-navy px-6 font-bold text-white transition data-hovered:bg-navy/90 data-pressed:scale-[0.98] data-disabled:opacity-40",
  honeypot: "sr-only",
};

export function ReviewForm({
  values,
  onChange,
  onSubmit,
  limits,
  labels,
  noteHint,
  canSubmit,
  error,
}: ReviewFormProps) {
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className={styles.form}
    >
      <TextField
        value={values.message}
        onChange={(v) => onChange("message", v)}
        isRequired
        className={styles.field}
      >
        <Label className={styles.label}>{labels.note}</Label>
        <TextArea
          maxLength={limits.note}
          rows={5}
          dir="auto"
          className={`${styles.control} ${styles.textarea}`}
        />
        {noteHint && (
          <Text slot="description" className={styles.hint}>
            {noteHint}
          </Text>
        )}
      </TextField>

      <TextField
        value={values.name}
        onChange={(v) => onChange("name", v)}
        className={styles.field}
      >
        <Label className={styles.label}>{labels.name}</Label>
        <Input
          maxLength={limits.name}
          autoComplete="name"
          dir="auto"
          className={styles.control}
        />
      </TextField>

      <TextField
        value={values.contact}
        onChange={(v) => onChange("contact", v)}
        className={styles.field}
      >
        <Label className={styles.label}>{labels.contact}</Label>
        <Input
          maxLength={limits.contact}
          dir="auto"
          className={styles.control}
        />
      </TextField>

      <input
        type="text"
        name="website"
        value={values.website}
        onChange={(e) => onChange("website", e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className={styles.honeypot}
      />

      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      <Button type="submit" isDisabled={!canSubmit} className={styles.submit}>
        {labels.submit}
      </Button>
    </Form>
  );
}
