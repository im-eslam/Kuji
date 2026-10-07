import blendedCoffee from "../../assets/categories/blended-coffee.jpg";
import cookies from "../../assets/categories/cookies.jpg";
import crunchShake from "../../assets/categories/crunch-shake.jpg";
import desserts from "../../assets/categories/desserts.jpg";
import hotChocolate from "../../assets/categories/hot-chocolate.jpg";
import hotCoffee from "../../assets/categories/hot-coffee.jpg";
import hotMatcha from "../../assets/categories/hot-matcha.jpg";
import icedCoffee from "../../assets/categories/iced-coffee.jpg";
import icedMatcha from "../../assets/categories/iced-matcha.jpg";
import mojitos from "../../assets/categories/mojitos.jpg";
import pourOver from "../../assets/categories/pour-over.jpg";
import smoothies from "../../assets/categories/smoothies.jpg";

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
