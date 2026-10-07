| **Owns**          | What is on each screen, in what order, and which element opens which screen                                                |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Does not own**  | How anything looks (Doc B), element specs (Doc C), how anything behaves or is computed (Doc D), the words and data (Doc E) |
| **Depends on**    | B, C (component names)                                                                                                     |
| **Referenced by** | D, E                                                                                                                       |


---

## 1. Surfaces

The menu is one scrolling page plus five overlays that slide over it. There are no other pages. A customer taps an NFC tag, lands on the page, browses, opens an overlay to customize, and reviews the order in an overlay.

|Surface|Type|Opened by|
|---|---|---|
|Main menu page|Page|NFC / QR landing|
|Item sheet|Overlay (bottom sheet)|A signature card, a list card, a search result (item), an order line (edit mode)|
|Offer sheet|Overlay (bottom sheet)|A Perfect Pairings card, a search result (offer), an order line of a bundle (edit mode)|
|Category sheet|Overlay (bottom sheet)|The hamburger button|
|Order sheet|Overlay (bottom sheet)|The order bar|
|Search overlay|Overlay (full screen)|The search icon|

## 2. Main page wireframe

```
+--------------------------------------+
| (logo) kuji              [Q]  EN|AR  |  Header, tier 1
| [=]  Signatures  Pairings  Iced Cof> |  Header, tier 2 (pills scroll sideways,
+--------------------------------------+   fade at their start edge, no divider)
| The Signatures                       |
| Romanticize your coffee.             |
| +-----------+ +-----------+          |
| |   badge   | |           |  swipe ->|
| |  [image]  | |  [image]  |          |
| | Title     | |           |          |
| | EGP 150 > | |           |          |
| +-----------+ +-----------+          |
|            o o o o o                 |  carousel dots
+======================================+  section divider
| Perfect Pairings                     |
| Pair a drink with a treat...         |
| +------------+ +-----------+         |
| | [img]+[img]| |           | swipe ->|
| | Save chip  | |           |         |
| | Drink+Treat| |           |         |
| | EGP 150  > | |           |         |
| +------------+ +-----------+         |
+======================================+
| Iced Coffee                          |
| +----------------------------------+ |
| | [img] Title              badge   | |
| |       Description (2 lines)      | |  list card
| |       EGP 110                  > | |  (badged items first)
| +----------------------------------+ |
| ... (5 cards)                        |
| [ Show all Iced Coffee (9)  v ]      |
+======================================+
| Iced Matcha ... Hot Coffee ...       |  same pattern, repeated
| ... Desserts                         |
|        (space for the order bar)     |
+--------------------------------------+
|  (n)  View Order          EGP 000    |  Order bar, floats at the bottom,
+--------------------------------------+  only after something is added
```

**Arabic mode.** The language switch changes the whole page to Arabic and right-to-left. The wireframe mirrors: logo and switch swap sides, the hamburger moves to the right with pills running leftward, carousels start from the right, chevrons point left, and sheet content aligns right. The order of elements inside each card and sheet does not change.

## 3. Main page sections in order

|#|Section|Contains, in order|
|---|---|---|
|3.1|**Header** (fixed)|Tier 1: logo and wordmark · search button · language switch (EN|
|3.2|**The Signatures**|Section title · brand tagline line · horizontal carousel of signature cards · carousel dots|
|3.3|**Perfect Pairings**|Section title · one-line description · horizontal carousel of offer cards|
|3.4|**Category sections**, one per category|Section title · vertical list of item cards (first five after sorting) · "Show all" button when the category has more than five|
|3.5|**End spacer**|Empty room so the order bar never covers the last card|
|3.6|**Order bar** (floating)|Item count · "View Order" label · subtotal|

1. **Category order after Pairings:** Iced Coffee, Iced Matcha, Hot Coffee, Blended Coffee, Crunch Shake, Mojitos, Smoothies, Hot Matcha, Hot Chocolate, Pour Over, Cookies, Desserts.
2. **Pill order in the header:** Signatures, Pairings, then the twelve categories above, in the same order as the page. The pills are a map of the page: one pill per section, same sequence.
3. **Item order inside a category:** badged items first (New, then Top Rated), then the rest in menu order. The sort rule is in Doc D §6. Signatures and Pairings keep their curated order.

## 4. Cards

|Card|Used in|Elements, in order|Tapping it|
|---|---|---|---|
|**Signature card**|The Signatures|Badge (optional) · image · title · price · chevron|Opens the item sheet|
|**Offer card**|Perfect Pairings|Two images joined by a plus · savings chip (when discounted) · title ("Drink + Treat") · bundle price · regular price struck through (when discounted) · chevron|Opens the offer sheet|
|**List card**|Category sections|Image (left) · title · description · price · badge (optional, corner) · chevron (right)|Opens the item sheet|
|**Often Ordered card**|Inside the item sheet|Image · name · base price · quick-add plus|The card is not tappable. The plus adds one unit with default options and the sheet stays open|
|**Order line**|Order sheet|Thumbnail · title · detail rows · line price · quantity stepper|The line opens its edit sheet. The stepper changes quantity only|

## 5. Overlays

Every bottom sheet has the same frame: a drag handle at the top, scrollable content, and an optional pinned footer. Only the content differs.

### 5.1 Item sheet

```
+--------------------------------------+
|              ---- handle             |
| [   wide image 16:9           (X)  ] |
| Title                        badge   |
| Description                          |
| EGP 130                              |
| [* Make it the Barista's Way      ]  |
| Size        [ Regular | Large +15 ]  |
| Quantity                  [ - 1 + ]  |
| Add-ons                              |
|  [ ] Oat Milk                +35     |
|  [ ] Vanilla                 +20     |
|  [ ] Extra Coffee Shot       +35     |
|  [ ] Caramel                 +20     |
|  [ ] Hazelnut                +25     |
| Often Ordered With                   |
| +------+ +------+ +------+  swipe -> |
| |[img] | |[img] | |[img] |           |
| |name  | |name  | |name  |           |
| |70  + | |75  + | |120 + |           |
| +------+ +------+ +------+           |
+--------------------------------------+
| [   Add to Order . EGP 185        ]  |  pinned footer
+--------------------------------------+
```

1. **Option profiles.** Which option blocks a product shows depends only on its profile (Doc E §4, rules in Doc D §3), never on whether it is a drink or a dessert. Any item can have any combination.

|Block|Shown when|
|---|---|
|Image with close button|Always|
|Title, badge, description, price|Always|
|Barista's Way|Profile enables it and the item offers all preset add-ons|
|Size|Profile has two or more sizes|
|Quantity|Always|
|Add-ons|Profile has at least one add-on|
|Often Ordered With|Always, except in edit mode|
|Footer|Add to Order (Update Order in edit mode)|

2. A block that the profile does not allow is absent, not disabled.
3. **Often Ordered With** cards show image, name and base price. Only the plus is tappable; there is no detail view.
4. **Edit mode.** Opened from an order line. The sheet shows the line's current options and quantity, hides Often Ordered With, and the footer reads "Update Order · EGP {total}".

### 5.2 Offer sheet

```
+--------------------------------------+
|              ---- handle             |
| [ img A ]+[ img B ]           (X)    |
| [Offer . Save EGP 30]                |
| Iced Latte + Oreo Cookies            |
| EGP 150   EGP 180                    |
| [img] Iced Latte        EGP 110      |
|       description                    |
| [img] Oreo Cookies      EGP 70       |
|       description                    |
| -- Iced Latte ---------------------- |
| [* Make it the Barista's Way      ]  |
| Size        [ Regular | Large +15 ]  |
| Add-ons ...                          |
| -- Oreo Cookies (only if options) -- |
| Quantity                  [ - 1 + ]  |
+--------------------------------------+
| [   Add to Order . EGP 150        ]  |
+--------------------------------------+
```

1. Two-image header with close button · savings chip (when discounted) · title · bundle price and regular price · list of the included products (thumbnail, name, description, regular price).
2. **Each product has its own option block**, under the list, showing only the options its profile allows. Each product with options gets its own independent block. A product with no options gets none, whatever its category.
3. One Quantity row applies to the whole bundle.
4. Pinned footer: Add to Order with the total. In edit mode: "Update Order · EGP {total}".

### 5.3 Category sheet

Title and close button · one row per section (Signatures, Pairings, then the twelve categories), each with its item count. No footer.

### 5.4 Order sheet

```
+--------------------------------------+
|              ---- handle             |
| Your Order                     (X)   |
| 3 items                              |
| [img] Latte                    >     |
|       Size  [Large]                  |
|       Add-ons [Oat Milk] [Vanilla]   |
|       EGP 185           [ - 1 + ]    |
| [img] Iced Latte + Oreo Cookies >    |
|       Includes ...                   |
|       EGP 150  EGP 180  [ - 1 + ]    |
+--------------------------------------+  footer: shadow, no line
| Subtotal                    EGP 335  |
| Excludes items priced on selection.  |
| [ Clear order ]                      |
+--------------------------------------+
```

1. Title and close button · item count · list of order lines · pinned footer: subtotal, note about unpriced items (only when relevant), Clear order button. No line above the subtotal.
2. Each **order line** contains: thumbnail · title · detail rows (Includes, Size, Add-ons; only the ones that apply) · line price (old price struck through when discounted) · quantity stepper. A bundle line lists its options per product.
3. Tapping the line (not the stepper) opens its edit sheet.
4. **Clear confirmation.** After tapping Clear order, the footer shows a question, a Keep order button and a Clear order button in place of the single button. The list stays visible.
5. **Empty state:** message "Your order is empty." and a Browse the menu button. No footer.

### 5.5 Search overlay

Full screen. Top bar with a text input and a close button · result rows below, in three groups in this order:

|Group|Row contains|Choosing it|
|---|---|---|
|Categories|Name, item count|Closes search and scrolls to the section|
|Offers|Two thumbnails, pair title, bundle price|Opens the offer sheet|
|Items|Thumbnail, name, one-line description, price|Opens the item sheet|
|Empty groups are hidden. Two helper messages: the prompt before typing, and the no-match message. Matching rules are in Doc D §7.|||

## 6. Navigation map

```
Main page
 |-- search button ------------> Search overlay
 |                                |-- category result --> scrolls page to section
 |                                |-- offer result -----> Offer sheet
 |                                '-- item result ------> Item sheet
 |-- hamburger button ---------> Category sheet --(row)--> scrolls page to section
 |-- category pill ------------> scrolls page to section
 |-- signature / list card ----> Item sheet
 |-- offer card ---------------> Offer sheet
 |-- order bar ----------------> Order sheet
 |
 Item sheet
   |-- Often Ordered plus -------> adds one unit, stays open
   |-- Add to Order -------------> closes, adds to order
 Offer sheet
   |-- Add to Order -------------> closes, adds to order
 |
 Order sheet
   |-- order line ---------------> Item sheet or Offer sheet (edit mode)
   |                                |-- Update Order / close --> back to Order sheet
   |-- Clear order --------------> confirmation in the footer
```

1. Only one overlay is open at a time.
2. The order bar is hidden while any overlay is open.
3. Every overlay can be dismissed back to the main page, except an edit sheet, which returns to the order sheet.

## 7. Element reuse map

Elements that appear on more than one surface. These are the shared components in Doc C.

|Element|Appears in|
|---|---|
|Badge|Signature card, list card, item sheet|
|Chevron|Signature card, offer card, list card|
|Plus button|Often Ordered card|
|Quantity stepper|Item sheet, offer sheet, order lines|
|Option block (Barista's Way, Size, Add-ons)|Item sheet; offer sheet (once per product)|
|Price and struck-through price|All cards, both sheets, order lines, search results|
|Close button|Every overlay that has a header or image|
|Image|Every card, both sheets' headers, order lines, search results|
|Pill|Header, nothing else|