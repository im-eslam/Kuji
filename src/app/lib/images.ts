import blendedCoffee from "../../assets/categories/blended-coffee.webp";
import cookies from "../../assets/categories/cookies.webp";
import crunchShake from "../../assets/categories/crunch-shake.webp";
import desserts from "../../assets/categories/desserts.webp";
import hotChocolate from "../../assets/categories/hot-chocolate.webp";
import hotCoffee from "../../assets/categories/hot-coffee.webp";
import hotMatcha from "../../assets/categories/hot-matcha.webp";
import icedCoffee from "../../assets/categories/iced-coffee.webp";
import icedMatcha from "../../assets/categories/iced-matcha.webp";
import mojitos from "../../assets/categories/mojitos.webp";
import pourOver from "../../assets/categories/pour-over.webp";
import smoothies from "../../assets/categories/smoothies.webp";

const BY_CATEGORY = new Map<string, string>([
  ["iced-coffee", icedCoffee],
  ["iced-matcha", icedMatcha],
  ["hot-coffee", hotCoffee],
  ["blended-coffee", blendedCoffee],
  ["crunch-shake", crunchShake],
  ["mojitos", mojitos],
  ["smoothies", smoothies],
  ["hot-matcha", hotMatcha],
  ["hot-chocolate", hotChocolate],
  ["pour-over", pourOver],
  ["cookies", cookies],
  ["desserts", desserts],
]);

// URLs that have finished loading (or pre-loading) this session.
const loadedUrls = new Set<string>();
export const isLoaded = (url: string) => loadedUrls.has(url);
export const markLoaded = (url: string) => {
  loadedUrls.add(url);
};

export const categoryImageUrl = (categoryId: string): string | undefined =>
  BY_CATEGORY.get(categoryId);

/**
 * Starts fetching and decoding the category photos before React has rendered anything, so they are usually
 * already in memory when the first card paints. `first` are the categories visible on load (signature cards);
 * the rest follow when the browser is idle, so they never compete with the first paint.
 */
export function warmCategoryImages(first: string[]): void {
  const warm = (id: string) => {
    const url = BY_CATEGORY.get(id);
    if (!url) return;
    const img = new Image();
    img.decoding = "async";
    img.onload = () => markLoaded(url);
    img.src = url;
    img.decode?.().then(
      () => markLoaded(url),
      () => {},
    );
  };
  first.forEach(warm);
  const rest = [...BY_CATEGORY.keys()].filter((id) => !first.includes(id));
  const run = () => rest.forEach(warm);
  if ("requestIdleCallback" in window)
    (
      window as Window & { requestIdleCallback: (cb: () => void) => number }
    ).requestIdleCallback(run);
  else window.setTimeout(run, 300);
}
