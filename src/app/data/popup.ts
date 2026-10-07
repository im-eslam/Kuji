import type { L10n } from "./types";

// Promo popup: the image that opens over the menu shortly after the page has loaded.
// This is the only file you need to edit to turn it on or off, or to change the picture.
export const POPUP: {
  /** false = the popup never shows (and its image is never fetched). */
  enabled: boolean;
  /**
   * Which picture to show. Either:
   *  - a file name inside public/assest/popup/, e.g. 'popup.jpg', or
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
  image: "/assest/popup/popup.jpg",
  alt: { en: "Kuji special offer", ar: "عرض خاص من Kuji" },
  delayMs: 1000,
};

/** Resolves a popup filename in public/assest/popup/ or passes through a public/remote URL. */
export function popupImageUrl(): string | undefined {
  const img = POPUP.image.trim();
  if (!img) return undefined;
  if (/^(https?:)?\/\//.test(img) || img.startsWith("/")) return img;
  return `/assest/popup/${img}`;
}
