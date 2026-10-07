import type { L10n } from "./types";
import popupImage from "../../assets/popup/popup.webp";

// Promo popup: the image that opens over the menu shortly after the page has loaded.
// This is the only file you need to edit to turn it on or off, or to change the picture.
export const POPUP: {
  /** false = the popup never shows (and its image is never fetched). */
  enabled: boolean;
  /**
   * Which picture to show. Either:
   *  - the manually imported popup image, or
   *  - a full link ('https://...') or a public asset path ('/promo.jpg').
   * Change this one value (and/or replace the file) to change the picture.
   */
  image: string;
  /** Read out by screen readers. Arabic is DRAFT copy pending native review. */
  alt: L10n;
  /** Wait after the page has fully loaded, in milliseconds. */
  delayMs: number;
} = {
  enabled: true,
  image: popupImage,
  alt: { en: "Kuji special offer", ar: "عرض خاص من Kuji" },
  delayMs: 1000,
};

/** Returns the imported image URL or passes through a public/remote URL. */
export function popupImageUrl(): string | undefined {
  const img = POPUP.image.trim();
  if (!img) return undefined;
  if (/^(https?:)?\/\//.test(img) || img.startsWith("/")) return img;
  return img;
}
