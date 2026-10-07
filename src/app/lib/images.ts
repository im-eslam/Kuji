// Category photos live in public/assest/categories as <category-id>.jpg.
const CATEGORY_IDS = [
  "iced-coffee",
  "iced-matcha",
  "hot-coffee",
  "blended-coffee",
  "crunch-shake",
  "mojitos",
  "smoothies",
  "hot-matcha",
  "hot-chocolate",
  "pour-over",
  "cookies",
  "desserts",
] as const;

const BY_CATEGORY = new Map(
  CATEGORY_IDS.map((id) => [id, `/assest/categories/${id}.jpg`]),
);

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
