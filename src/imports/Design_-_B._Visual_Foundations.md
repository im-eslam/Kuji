| **Owns**          | Raw visual values: color, type, spacing, shape, depth, icons, imagery, motion timing                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------- |
| **Does not own**  | Which element uses a value (Doc C), where elements sit (Doc A), when things happen (Doc D), the words (Doc E) |
| **Depends on**    | Nothing. This is the base of the chain                                                                        |
| **Referenced by** | C, A, D, E                                                                                                    |


Components cite these values by name. The system is deliberately small: five colors, five text styles, six spacing steps, four radii.

---

## 1. Quick reference

|Need|Value|
|---|---|
|Font|Montserrat 500, 600, 700 for Latin text (400 only for the brand tagline); a matching Arabic typeface at the same weights for Arabic text (F-03)|
|Wordmark and "k" mark|Images only (custom lettering, not a font)|
|Text|navy `#0C1B27`|
|Action and selection|yellow `#E8E87A`|
|Borders, handles, soft fills|arctic `#C4D7DE`|
|Dividers, pressed|mist `#F3F7F8`|
|Background|white `#FFFFFF`|
|Grid|8-point|
|Motion|150 ms press and colour, 250 ms height, 260 ms sheets in and 200 ms out; one curve in, one curve out|
|Edge fade|16 px, white to transparent|

## 2. Color

### 2.1 Core tokens

|Token|Hex|Brand name|Role|
|---|---|---|---|
|navy|`#0C1B27`|Oxford Navy|All text and icons, dark fills, scrim|
|yellow|`#E8E87A`|Luminance|Where to act, and what is selected (see 2.5)|
|arctic|`#C4D7DE`|Arctic Blue|Borders, soft fills, handles, inactive dots, Top Rated badge|
|mist|`#F3F7F8`|(UI neutral)|Dividers, pressed state, quiet fills|
|white|`#FFFFFF`||Page and surfaces|

### 2.2 Reserved colors

Not part of the app system today. No screen uses them. Add them to 2.1 and 2.4, with contrast checks, only when a screen needs one (for example an error under a form field).

|Token|Hex|Intended use|
|---|---|---|
|teal|`#2B7C80`|Success|
|clay|`#A8412C`|Error|

### 2.3 Opacity variants

Never new colors.

|Variant|Use|
|---|---|
|navy 65%|Secondary text, inactive controls, chevrons|
|navy 55%|Scrim behind sheets|
|navy 20%|Placeholder "k" mark (placeholder only)|
|yellow 40%|End of placeholder gradient (placeholder only)|

### 2.4 Contrast

Approximate WCAG ratios.

|Pair|Ratio|Verdict|
|---|---|---|
|navy on white|16 : 1|Pass|
|navy 65% on white|5.4 : 1|Pass (12 px and up)|
|navy 65% on mist|5.1 : 1|Pass|
|navy on yellow|13 : 1|Pass|
|navy on arctic|12 : 1|Pass|
|white on navy|17 : 1|Pass|
|yellow on white|1.3 : 1|**Fail**|

### 2.5 Rules

1. **Yellow means one thing: act here, or this is selected.** It appears only on:
    1. the primary button,
    2. the plus (quick add) button,
    3. the active category pill, the active category row,
    4. selected states (checked checkbox, Barista's Way on). It is never decorative, never on a badge, never on a chevron, and never text.
2. Yellow is never a lone shape on white. It always carries navy content.
3. Never rely on color alone for state. Pair it with a shape change, weight change or icon.
4. No new colors without adding them to the tables above. Brand colors not used in the app: Dark Champagne `#CFCBAE` (print and signage).
5. The brand gradient (yellow to white to teal) is for imagery and hero moments only, never behind text or on buttons.

### 2.6 Tokens in code

```css
@theme {
  --color-navy: #0c1b27;
  --color-yellow: #e8e87a;
  --color-arctic: #c4d7de;
  --color-mist: #f3f7f8;
}
```

## 3. Typography

1. Montserrat for all Latin interface text, and one Arabic typeface (chosen in F-03) for all Arabic interface text. Both use only weights 500, 600 and 700 (400 for the brand tagline). The brand family also has Light and Black; do not use them in the app.
2. UI text uses weights 500, 600 and 700. Weight 400 is only for the brand tagline.
3. The wordmark "kuji" is custom-drawn lettering, not a font. It is always placed as an image and never retyped in any font (see 8.2).
4. Prices are always bold (700). Secondary text is caption in navy 65%.
5. Text wraps and never truncates, except descriptions, which clamp at two lines.
6. The brand tagline is set regular (400) with its last word bold.
7. No text below 12 px.
8. Arabic text uses the same five text styles and sizes. Arabic glyphs may need more line height than Latin, so check each style's line height with the chosen Arabic typeface. The wordmark and "k" mark are images and never change with language. See F-03.

|Style|Size / line|Weights|Used for|
|---|---|---|---|
|title|20 to 24 (22 at about 390 px wide) / 1.3|700|Sheet titles, section titles|
|heading|17 to 19 (18 at about 390 px wide) / 1.33|700|Card titles, primary button label|
|body|16 / 1.5|500; strong 600 or 700|Item names, labels, option headings|
|small|14 / 1.43|500, 600, 700|Buttons, prices on cards, pills|
|caption|12 / 1.34|500, 600|Descriptions, helper text, chips, badges|

Sizes are in rem, so they follow the user's font-size setting. Title and heading flex with the screen between 320 and 480 px wide (`clamp()` with a rem part, a 1.2x range, so browser zoom still reaches 200%). Body, small and caption do not flex. Line heights are unitless. Arabic uses taller lines (title and heading 1.5, body 1.7, small 1.6, caption 1.5), set once on `[lang='ar']`.

## 4. Spacing

1. Strict 8-point grid. Every margin, padding and gap is a multiple of 4 or 8.
2. Component dimensions (40, 48, 56, 88, 104 and so on) are not spacing tokens. They are defined per component in Doc C.
3. The minimum touch target is 48 × 48 px for every tappable element.
4. Six steps only. Do not add one-off values; use the nearest step.

| Token                                                                                                                                                                                | px  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- |
| space-1                                                                                                                                                                              | 4   |
| space-2                                                                                                                                                                              | 8   |
| space-3                                                                                                                                                                              | 12  |
| space-4                                                                                                                                                                              | 16  |
| space-6                                                                                                                                                                              | 24  |
| space-8                                                                                                                                                                              | 32  |
Standard values: screen gutter space-4; gap between cards space-4; section padding space-8 top and bottom; sheet bottom padding space-6; empty order state vertical padding space-8.
## 5. Shape

|Token|px|Typical use|
|---|---|---|
|radius-md|12|Thumbnails, list rows|
|radius-lg|16|Cards, large images|
|radius-sheet|24, top corners|Bottom sheets|
|radius-full|9999|Anything interactive and pill-shaped: buttons, pills, chips, badges, steppers|

## 6. Borders, depth and layers

1. Borders over shadows. Surfaces are outlined with a 1 px arctic border. Internal dividers are 1 px mist.
2. One shadow only, for the pinned sheet footer: `0 -8px 24px rgba(12,27,39,0.08)`.
3. **Separation without lines.** Two places use no line: beside the hamburger button, and above the order subtotal. The pill row separates from the hamburger with the edge fade (6.4). The order footer separates from the list with the footer shadow (6.2). Do not add hairlines in these two places.
4. **Edge fade.** A 16 px gradient from white to transparent, placed over the start edge of a horizontally scrolling row so content dissolves instead of being cut. "Start" follows the reading direction: left in English, right in Arabic. Defined here as a value; Doc C says where it is used. It introduces no new color.
5. Layers:

|Layer|z-index|
|---|---|
|Sticky header|30|
|Order bar|35|
|Scrim|40|
|Search overlay|45|
|Bottom sheet|50|

## 7. Iconography

1. Inline SVG, 24 × 24 viewBox, 2 px stroke, round caps and joins, drawn in `currentColor`. Shown at 16, 20 or 24 px.
2. Current set: search, plus, minus, x, check, arrow-right, trash, menu, chevron-down, sparkle, and a filled star. Only the star is filled.
3. New icons match this style.
4. Directional icons (arrow-right, chevrons that point sideways) mirror in RTL. Non-directional icons (search, plus, minus, x, check, trash, menu, sparkle, star) never mirror.

## 8. Imagery

### 8.1 Aspect ratios

|Aspect ratio|Use|
|---|---|
|1:1|Cards, thumbnails, order lines|
|16:9|Item sheet header|
|Two squares side by side|Offer sheet header|

### 8.2 Brand marks (images, not type)

|Asset|What it is|Rules|
|---|---|---|
|Wordmark "kuji"|Custom-drawn lettering, supplied as an image|Never retyped in a font. Navy on light surfaces, white on navy. Keep its proportions; never stretch, outline or add effects. Alt text "Kuji"|
|"k" mark|The brush-drawn k glyph, supplied as an image|Same color rules as the wordmark. Used for the avatar, the image placeholder and brand moments. Decorative when beside the wordmark|
|Logo avatar|Circular image of the "k" mark|Hidden if its file fails to load (Doc C)|

1. Prefer vector files (SVG) with a transparent background for the wordmark and "k" mark. The avatar is a raster image today; swap it for the vector "k" mark when the file is available.
2. Header sizes are set in Doc C.

### 8.3 Placeholder

An item without a photo shows a 135° gradient from arctic to yellow at 40%, with the "k" mark image centered at half the container width, navy at 20%. The mark is the brand's drawn "k", not a typed letter.

### 8.4 Other

1. Photo direction: see F-42.
2. Brand graphics (the brush-stroke graphic and similar) are not part of the app today and are ignored for the MVP. If used later, they may serve as graphic accents and coffee indicators (for example, marking drink types), never behind text. Any new use must follow §2.5 and be added to this document first. See F-43.

## 9. Motion

Only values live here. What triggers them is in Doc D.

|Token|Value|
|---|---|
|duration-base|300 ms|
|easing|ease-out|
|press-small|scale 0.9 (round buttons)|
|press-large|scale 0.98 (wide buttons)|
|bump|scale 1 → 1.3 → 1 over 300 ms|
|confirm-hold|1.2 s|
|fade-in|opacity 0 → 1 over duration-base, ease-out|

1. Fade-in is the only entrance for elements that appear without sliding (the clear-order confirmation, search result groups, the search overlay).
2. **Code values** (`index.css`). Press and colour changes 150 ms. Height changes 250 ms. Sheets 260 ms in, 200 ms out (about 25% shorter, and accelerating). In: `--ease-smooth`. Out: `--ease-exit`. Any transition with no curve of its own uses `--ease-smooth`.
3. **Things that move together share a duration and a curve.** The category pill label changes colour over 250 ms because the yellow thumb under it slides over 250 ms. The segmented control label uses the thumb's 220 ms. The scrim fades in over 260 ms, the same as the sheet.
4. **Sequences.** Stagger is 40 ms per item, at most 6 steps, entrance only, and only after a user action (Show all), never on page load. A part that must be gone before something else arrives leaves faster than the rest (the Show all button fades over 120 ms while its row closes over 250 ms; a removed order line fades over 140 ms while its row closes over 220 ms). A count that bumps while its container is still sliding in waits for the container to land (order bar, 220 ms).
5. **No motion for its own sake.** A card answers a press with scale and tint only; its arrow does not also move. A photo the browser already has appears at once; only a photo that had to load fades in.
6. Reduced motion: every duration and delay drops to 1 ms.

## 10. Fluid sizing

1. Card widths are a share of their rail, clamped, so the next card peeks on every phone: Signature card `clamp(14rem, 78%, 22rem)`, Offer card `clamp(13rem, 70%, 18rem)` (tokens `--card-signature`, `--card-offer`).
2. One breakpoint: `xs` at 24 rem (384 px). Below it, cards use space-3 padding so the content keeps its width; from `xs` up they use space-4. Padding still comes only from the six spacing steps.
3. Heights that hold text are minimums (`min-h-*`, or `lh` units for "n lines"), never fixed, so a larger font size or Arabic's taller lines make a card grow instead of clipping.
4. Anything that offsets content by the header's height measures the header, because the header is sized in rem.
5. Bottom-pinned surfaces (order bar, sheet footer) pad by `max(space-4, device safe area)`.