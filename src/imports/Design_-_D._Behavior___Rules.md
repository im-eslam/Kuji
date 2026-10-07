| **Owns**            | How the menu responds to the customer, and the rules that compute prices and the order                     |
| ------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Does not own**    | Looks (Doc B), part dimensions (Doc C), screen layout (Doc A), the actual menu content and strings (Doc E) |
| **Depends on**      | A, B (timing values), C                                                                                    |
| **Reads data from** | E (option profiles, presets, prices). Data values only, never rules                                        |
| **Referenced by**   | E                                                                                                          |

Timing values come from Doc B §9.

---

## 1. Navigation and scroll-spy

1.1 **The pills mirror the page.** One pill per page section, same order. At any moment exactly one pill is active. The Pairings section counts as a spied section and has its own pill.

|#|Event|Result|
|---|---|---|
|1.2|Customer scrolls the page|The active pill becomes the last section whose top has reached within 32 px of the header's bottom edge|
|1.3|Page reaches the very bottom|The last pill becomes active|
|1.4|Active pill changes|The pill bar scrolls so the active pill is centered (smooth after first load)|
|1.5|Customer taps a pill|Page scrolls smoothly so the section title clears the header (section top plus 8 px). Signatures scrolls to the very top|
|1.6|While that scroll is animating|Spy updates pause, then resume 150 ms after scrolling stops, so the pill does not flicker through intermediate sections|
|1.7|Customer taps a row in the category sheet|Sheet closes, then the same scroll as a pill tap|
|1.8|Customer chooses a category in search|Search closes, then the same scroll as a pill tap|

## 2. Overlays

|#|Rule|Behavior|
|---|---|---|
|2.1|One at a time|Opening an overlay never leaves another open|
|2.2|Swap|The one exception: moving between the order sheet and an edit sheet replaces the content in place, with no slide animation and no scrim flicker (5.6)|
|2.3|Bottom sheet open|Slides up and the scrim fades in over duration-base|
|2.4|Bottom sheet close|Close button, scrim tap, Escape key, or dragging the handle down more than 96 px. Releasing under 96 px snaps it back. The sheet slides down and unmounts after the animation finishes|
|2.5|Double close|A second close request while closing is ignored|
|2.6|Scrim|Dims the page and the order bar; tapping it closes the sheet|
|2.7|Search overlay|Opens full screen with the input focused. Closes with the close button or Escape and clears the query|
|2.8|Order bar|Hidden whenever any overlay is open (and whenever the order is empty). Slides up over duration-base when it can show|
|2.9|After Add to Order|The sheet closes and the order bar appears or updates|
|2.10|After Update Order|The edit sheet swaps back to the order sheet (2.2). The order bar stays hidden|

## 3. Options

### 3.1 Option profiles

1. Every item has an **option profile** (data in Doc E §4) that says which options it offers:
    - Size: a list of sizes, or none
    - Add-ons: a set of add-ons, or none
    - Barista's Way: yes or no
2. Quantity and Often Ordered With are not part of the profile. Every item has them.
3. Every item's profile is read from data exactly as stored. The app has no built-in defaults and no code branches on "drink" or "food" to decide options. Any item can offer any combination of options, including none.
4. A block that the profile does not allow is absent, not disabled.
5. Which items offer which options is decided in the dashboard, not in this document.

### 3.2 Option rules

6. **Barista's Way** is a toggle that selects a fixed preset of add-ons (Doc E §7).
    1. Tapping it adds the preset add-ons that are not already selected.
    2. Tapping it again removes only the preset's add-ons; any other add-ons the customer chose stay.
    3. It shows as "on" whenever every preset add-on is selected, even if the customer ticked them one by one.
    4. It appears only on items whose profile enables it and that offer every add-on in the preset. Otherwise the block is absent.
7. **Size** is a single choice from the product's size list. The list comes from data and can have any number of entries. The first entry is the default and has no upcharge. Never hard-code the number of sizes. A list with one entry offers no choice, so the Size block is absent (assumption). See F-10, F-11.
8. **Add-ons** are multi-select, independent of one another. Each can be taken once. See F-16.
9. **Quantity** in a sheet: minimum 1, maximum 20 when adding. In edit mode the maximum is the line cap (5.4). The stepper's minus is disabled at 1.
10. **Opening with a preset.** A sheet can open with the Barista's Way already on (used for the review mockup). A normal tap opens with no options selected.
11. **Quick add** uses default options: the first size, no add-ons.

### 3.3 Offer sheets

12. **Options apply per product.** Each product in the pair has its own option state, shown as its own block per its profile. Each product's block shows exactly what its own profile allows. Two products with options give two independent sets, and a product with no options shows no block, whether it is a drink or a dessert.
13. One quantity applies to the whole bundle.
14. Each product's state is independent: changing the size of one never changes the other.

## 4. Price rules

All prices are whole numbers in EGP.

1. **Item unit price** = base price + size upcharge + sum of selected add-on prices. An item without options is just its base price.
2. **Line total** = unit price × quantity.
3. **Offer extras** = the sum of both products' size upcharges and selected add-on prices.
4. **Offer unit price** = bundle price (or the sum of both products if the offer has no bundle price) + offer extras.
5. **Offer regular price** = sum of both products' regular prices + the same offer extras. It is shown struck through only when the offer is discounted.
6. **Savings** = sum of regular prices minus the bundle price. Shown only when greater than zero. Extras never change the saving. See F-20.
7. **Price on selection.** An item with no price shows its label instead of a number, adds no amount to a line total or the subtotal, and its sheet footer says only "Add to Order". See F-35.
8. **Footer total** updates live as options and quantity change.
9. **Order subtotal** = sum of all line totals. When any line is on selection, the order sheet states that those items are excluded.
10. **Often Ordered display price** is the item's base price. Items priced on selection are not suggested.

## 5. The order

| #                                                                                                                           | Action                         | Rule                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5.1                                                                                                                         | Add to Order (sheet footer)    | Adds one line with the chosen quantity and options, then closes the sheet. A guard prevents adding twice from a double tap                                                                                                                                                        |
| 5.2                                                                                                                         | Line identity (item)           | Two lines are the same if item, title, size and add-ons match. A match increases the quantity; any difference creates a separate line                                                                                                                                             |
| 5.3                                                                                                                         | Line identity (bundle)         | Two bundle lines are the same if the offer matches and each product's size and add-ons match. Otherwise they are separate lines. See F-21                                                                                                                                         |
| 5.4                                                                                                                         | Quantity cap                   | 99 per line                                                                                                                                                                                                                                                                       |
| 5.5                                                                                                                         | Quick add (Often Ordered plus) | Adds one unit with default options (3.2, rule 11), keeps the sheet open, swaps the plus for a check for confirm-hold, and shows an "n added" badge counting quick adds from this sheet. Often Ordered cards have no other action                                                  |
| 5.6                                                                                                                         | Edit a line                    | Tapping an order line (not its stepper) opens the matching sheet in edit mode: the item sheet for an item line, the offer sheet for a bundle line. The sheet shows the line's options and quantity. The order sheet swaps out for it (2.2)                                        |
| 5.7                                                                                                                         | Update Order                   | Replaces the line with the new options and quantity. If the new configuration equals another line (5.2, 5.3), the two merge and quantities add, capped at 99. Then the sheet swaps back to the order sheet                                                                        |
| 5.8                                                                                                                         | Close without updating         | Changes nothing and swaps back to the order sheet                                                                                                                                                                                                                                 |
| 5.9                                                                                                                         | Edit mode content              | Often Ordered With is hidden. See F-50, F-51                                                                                                                                                                                                                                      |
| 5.10                                                                                                                        | Change quantity (order sheet)  | Plus and minus change the line. Minus at quantity 1 removes the line                                                                                                                                                                                                              |
| 5.11                                                                                                                        | Clear order                    | Tapping it shows the confirmation in the order footer (5.12). Nothing is removed yet                                                                                                                                                                                              |
| 5.12                                                                                                                        | Clear confirmation             | The footer shows a question, a Keep order button and a Clear order button. Keep order dismisses the confirmation. Clear order empties the order immediately and shows the empty state. The confirmation also dismisses on any quantity change, on edit, and when the sheet closes |
| 5.13                                                                                                                        | Item count                     | Sum of line quantities, shown on the order bar and the order sheet                                                                                                                                                                                                                |
| 5.14                                                                                                                        | Order bar count                | Plays the bump animation each time the count changes                                                                                                                                                                                                                              |
5.15 The order lives in memory for the session. There is no persistence and no way to send or pay for it. See F-30 to F-34.

## 6. Lists and carousels

1. **Category sort.** Each category list is sorted before display:
    1. Items with the New badge first.
    2. Then items with the Top Rated badge.
    3. Then all other items. Each group keeps menu order. The sort is derived at display time and never stored. It applies to category sections only: Signatures, Pairings and search results keep their own order.
2. **Show all.** A category with more than five items shows the first five of the sorted list and a Show all button. Tapping it expands that category in place, permanently for the session, and removes the button. Expansion state is per category.
3. **Carousels** scroll horizontally with a hidden scrollbar.
4. The Signatures carousel snaps card to card, and its dots follow the scroll position (distance scrolled from the start edge, divided by card width plus gap). This works the same in both directions.
5. Pairings scrolls freely without snapping.
6. Badge data: F-40, F-41.

## 7. Search

1. Matching ignores case. Three kinds of match:

|Kind|Matched against|
|---|---|
|Items|Item name and description combined, in both languages|
|Offers|Both product names of the pair, in both languages|
|Categories|Pill label and section title in both languages, including Signatures and Pairings|

Matching runs against English and Arabic text regardless of the current display language, so a customer can type in either language. Results display in the current language. Matching for Arabic ignores diacritics and treats common letter variants (such as أ / إ / ا) as equal (assumption). 2. Results appear as the customer types, in three groups in this order: Categories, Offers, Items. Empty groups are hidden. 3. With an empty query the prompt message shows; with no matches in any group the no-match message shows. 4. Choosing a category closes search, clears the query and scrolls as a pill tap does (1.5). 5. Choosing an offer closes search, clears the query and opens the offer sheet. 6. Choosing an item closes search, clears the query and opens the item sheet. 7. Open point: F-52.

## 8. Interaction feedback

|Interaction|Feedback|
|---|---|
|Press a card, row, order line or secondary button|Mist fill while pressed|
|Press a round button|Scale to press-small|
|Press a wide button|Scale to press-large|
|Order count changes|Bump|
|Quick add|Plus becomes a check for confirm-hold|
|Clear confirmation appears|Fade-in|
|Search groups appear|Fade-in|
|Disabled stepper button|40% opacity|

## 9. Accessibility

1. Every tappable card and order line responds to Enter and Space, not only touch.
2. Sheets are announced as modal dialogs with the item or sheet name as label.
3. The active pill and active category row are marked as current.
4. Stepper counts announce changes politely. Stepper buttons name what they change (for example, "Increase Latte").
5. The order line button is labelled "Edit {title}". After an update, focus returns to that line, and the change is announced politely.
6. When the clear confirmation opens, focus moves to Keep order. Escape dismisses the confirmation without closing the sheet.
7. Selected states always have a second cue beyond color (check, weight or ring).

## 10. Language and direction

1. The app supports English and Arabic. The language control (EN | ع) switches the whole app at once: all strings, item names, descriptions, section labels, add-on and size names, badges, and layout direction.
2. Arabic is right-to-left. The layout mirrors automatically because it uses start and end instead of left and right. Directional icons flip (Doc B §7.4).
3. The page opens in English by default. The customer's choice is kept for the session (assumption). Switching language keeps the open sheet, the order, the scroll position and the quantity and options already chosen.
4. The scroll-spy, pill centering, carousels and sheet drag behave the same in both directions.
5. Prices, quantities and the order work the same in both languages. Currency and numeral format per language: Doc E §2 and F-02.
6. Everything else about Arabic (real strings, typeface, brand lines): F-01 to F-06.