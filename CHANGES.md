# Performance pass + category photos

The `src/` changes are already in your project. This drop adds `index.html` and `src/index.css` (fonts). No new dependencies.
(I could not run Vite, tsc or a browser here; every file passes a syntax check, but please run `npm run build` once.)

## Category photos: the 12 file names
Put these in `src/assets/categories/`. One photo per category, used for every product in it.
Name them exactly like this (lowercase, `.webp`):

| File | Category |
|---|---|
| `iced-coffee.webp` | Iced Coffee |
| `iced-matcha.webp` | Iced Matcha |
| `hot-coffee.webp` | Hot Coffee |
| `blended-coffee.webp` | Blended Coffee |
| `crunch-shake.webp` | Crunch Shake |
| `mojitos.webp` | Mojitos |
| `smoothies.webp` | Smoothies |
| `hot-matcha.webp` | Hot Matcha |
| `hot-chocolate.webp` | Hot Chocolate |
| `pour-over.webp` | Pour Over |
| `cookies.webp` | Cookies |
| `desserts.webp` | Desserts |

Export each at **1200 x 900 px, WebP, quality about 75, under 80 KB**, with the subject centred. The same file shows as a
square (signature cards), a 4:3 banner (item sheet) and an 80px thumbnail, so keep the subject inside the middle square.
`.jpg`, `.png` and `.avif` also work if you name them the same way. A missing file just keeps the gradient placeholder.
Pairings and the order sheet use the photo of each product's category, so they need nothing extra.

## What changed, and why it is faster
- **One request per category, not per product.** Before, every product asked for `/images/<product>.jpg|webp|png`, probing up
  to three extensions (404s) each. Now the 12 category files are bundled by Vite with hashed names, so they are cached
  forever, there are no 404 probes, and 60 cards share 12 downloads.
- **Photos are warmed before React renders.** `main.tsx` starts fetching the signature cards' photos immediately, then the
  other categories when the browser is idle, so sheets and search rows open with photos already in memory.
- **No flash or re-fade.** A photo already loaded this session shows instantly; only a first load fades in.
- **Lighter placeholder.** The per-image "k" logo with its contrast filter and blend mode (repainted on every card) is gone;
  the placeholder is a plain gradient.
- **Scrolling no longer re-renders the menu.** The scroll-spy used to re-render all cards each time the active pill changed.
  The menu body is now a memoised `Sections` component, so only the header updates.
- **Cards are memoised and the open-sheet callbacks are stable**, so opening or closing a sheet no longer re-renders every card.
- **Half the cards mount after first paint.** The cards hidden behind "Show all" mount when the browser is idle (and always
  by the time you tap), so the first render builds far fewer nodes.
- **Search is instant.** Search text is normalised once at load instead of on every keystroke, and the result list is deferred
  so typing never waits on rendering rows.
- **Font weight 400 dropped** from the Google Fonts request (nothing uses it).

## Two things I did not do on purpose
- `content-visibility: auto` on sections: it would make jumping to a far category land off-target while its height is still an estimate.
- Lazy-loading the sheets: the whole app is small, and a first-tap delay costs more than the few KB saved.

## Fonts (done in this drop)
`index.html` now preconnects to Google Fonts and requests the fonts from the HTML, and the `@import` line is gone from
`src/index.css`, so the fonts download in parallel with the JS instead of after the CSS. It also paints the page colour
before any JS arrives (no white flash). Replace both `index.html` and `src/index.css` together.
Self-hosting the two fonts (e.g. `@fontsource`) would remove the third-party request entirely.

## Server settings that matter as much as the code
- Serve `/assets/*` with `Cache-Control: public, max-age=31536000, immutable` (the hashed files are safe to cache forever).
- Turn on Brotli or gzip, and HTTP/2 or HTTP/3 (most hosts like Netlify, Vercel and Cloudflare do this by default).

---

# Pass 2 + 3: compact cards, floating close + scroll bar, add-to-order footer, rolling digits, order rows

The `src/` changes are already in your project. This drop adds `index.html` and `src/index.css` (fonts). No new dependencies.

## Cards
- **List card**: height now comes only from content (no minimum). Title up to 2 lines, description always 1 line, price and arrow on one row, padding space-3 at every width. A short title gives a shorter card, never a gap. Photo is 80px wide and stretches (72px floor).
- **Pairing card**: the savings chip moved to the photo's end corner, the same spot as the badge on a signature card.
- **Pairings rail**: 4px of room under the cards so the rail no longer shaves their bottom corners (section bottom padding is 4px smaller, so spacing is unchanged).

## Sheets
- **No bar at rest.** The close button floats over the content (inset on the photo for item/offer sheets, level with the heading for order/categories), 32px to the eye with the full 48px tap target. As the in-content title scrolls up, a 48px bar (title + close) fades in, driven by the scroll position itself, and the close button glides into it. The title seems to travel into the bar instead of switching on. The bar only takes touches once it is mostly visible.
- **Swipe down to close**, anywhere on the sheet: on the bar/footer always, on the content only when it is scrolled to the top (so scrolling still works). Past 96px, or a quick flick, closes; otherwise it springs back. Mouse can drag the bar.
- `SheetTitle` marks the heading each sheet shows in the bar (item, offer, order, categories).
- **Footer**: quantity stepper and the button share one row. Label is now "Add Item" (Arabic: "أضف الصنف", draft copy). The Quantity row is gone.
- **Item sheet order**: Size, Barista's Way, Add-ons (Barista's Way is a preset of add-ons, so it sits right above them). The price under the title is gone (the button has it). Only items priced on selection still show "Price on Selection".
- **Offer sheet**: same footer and option order; the price row is gone too, the savings chip stays.

## Order sheet rows
- Photo on the start side, one column beside it: title (+ size/add-on chips when there are any), then a footer with this line's total on the start and the stepper on the end. With no chips the title and footer add up to the photo's height, so a cookie is a short row (about 88px); chips only make it taller.
- The row shows the line total (unit x quantity), so the rows add up to the subtotal. Bundles show the struck-through regular total next to it.
- Stepper in rows is 36px to the eye with a 48px tap target. The "Size / Add-ons / Includes" labels are gone; chips sit in one wrapping line.

## Motion
- **Rolling digits** replace the old fade/rise. Text with numbers (prices, counts, "3 items") slides only the digits that changed, on a strip, in 300ms. Rapid taps just retarget the slide. Plain-text for screen readers. Menu prices that never change stay plain (no extra DOM).
- **Order bar** now waits for the sheet to finish closing, then rolls the count, pops the circle (1.22x with a little spring) and pulses the whole button (1.035x). The first item still just slides the bar in.
- Icon swaps (plus to check, minus to bin) use a quick scale-in (`Swap`).

## Please check on a real phone (I could not run Vite or a browser here)
1. Swipe-down on the item sheet while scrolled to the top, and confirm normal scrolling still works.
2. Footer at 320 and 360px wide with a 3-digit price and in Arabic: "Add Item · EGP 140" must stay on one line.
3. The title appearing in the bar as you scroll, on a sheet with a one-line and a two-line title.
4. Pairing cards' bottom corners, and list cards with long Arabic names.

## Decisions for you
1. Descriptions on list cards are now cut to one line. If you would rather show 2 lines when the title is one line, that brings back variable heights.
2. Offer sheet no longer shows the struck-through regular price; the "Offer · Save X" chip is the only discount cue there.
