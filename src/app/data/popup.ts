import type { L10n } from "./types";

// Promo popup: the image that opens over the menu shortly after the page has loaded.
// This is the only file you need to edit to turn it on or off, or to change the picture.
export const POPUP: {
  /** false = the popup never shows (and its image is never fetched). */
  enabled: boolean;
  /**
   * Which picture to show. Either:
   *  - a file name inside src/assets/popup/, e.g. 'popup.webp' (drop the file in that folder), or
   *  - a full link ('https://...') or a path in /public ('/promo.jpg').
   * Change this one value (and/or replace the file) to change the picture.
   */
  image: string;
  /** Read out by screen readers. Arabic is DRAFT copy pending native review. */
  alt: L10n;
  /** Wait after the page has fully loaded, in milliseconds. */
  delayMs: number;
} = {
  enabled: true,
  image: "popup.webp",
  alt: { en: "Kuji special offer", ar: "عرض خاص من Kuji" },
  delayMs: 1000,
};

// Same drop-in idea as the category photos (see lib/images.ts), but in its own folder: Logo.tsx treats any image
// sitting directly in src/assets/ as the wordmark, so the popup picture must not go there.
const FILES = import.meta.glob(
  "../../assets/popup/*.{webp,jpg,jpeg,png,avif,gif,svg}",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
) as Record<string, string>;

/** The URL to show, or undefined when `POPUP.image` points at a file that is not in src/assets/popup/. */
export function popupImageUrl(): string | undefined {
  const img = POPUP.image.trim();
  if (!img) return undefined;
  if (/^(https?:)?\/\//.test(img) || img.startsWith("/")) return img;
  return Object.entries(FILES).find(([path]) => path.endsWith(`/${img}`))?.[1];
}
