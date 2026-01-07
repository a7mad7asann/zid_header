# Header Component — Project Files

This README documents the header-related files in this workspace and their purpose.

**Files Overview**

- **header.jinja**: Main header template. Assembles the header UI, includes search, wishlist, cart components, and the theme toggle script.

- **assets/header.js**: Shared header JavaScript. Exposes `Header` and `Wishlist` helpers on `window`:
  - `Header.toggleSearchOverlay(force)` — toggles the search overlay and focuses the input when opened.
  - `Wishlist.open()` / `Wishlist.close()` — show/hide the wishlist modal.
  - `Wishlist.loadItems()` — loads wishlist items via `zid.account.wishlists()` and renders the product template.

- **assets/R-header.css**: Styles for the header and search overlay (search box, overlay transitions, autocomplete items, buttons).

- **assets/R-wishlist.css**: Styles for the wishlist modal and its product cards (layout, modal transitions, remove button styles).

**components/header/**

- **cart.jinja**: Cart icon markup. Includes a badge element for cart count and links to the cart page.

- **search.jinja**: Search button, overlay markup, and input with autocomplete container. Loads `assets/header.js` at the end.

- **wishlist.jinja**: Wishlist button markup (shows different markup for guest vs logged-in users), includes the wishlist modal and product template, and contains small inline scripts that open/close the modal and attach listeners. Also loads `assets/header.js`.

- **wishlist_modal.jinja**: Modal structure for the wishlist (container element with `id="wishlistModal"` and `id="wishlistItems"` for the content).

- **wishlist_template.jinja**: `<template id="productCardTemplate">` used by `Wishlist.loadItems()` to clone and render wishlist products. Also defines `window.WISHLIST_STRINGS` for localized strings and loads `assets/header.js`.

**Notes & Usage**

- The main template `header.jinja` includes the component templates. The search and wishlist components each include `header.js` — this file exposes the JS helpers used by those components.

- The wishlist flow relies on a global `zid` object with `zid.account` and `zid.cart` APIs. `Wishlist.loadItems()` calls `zid.account.wishlists()` and uses the results to populate the product list.

- Modal behavior: the wishlist modal has `id="wishlistModal"`. Use `Wishlist.open()` or the `.wishlist-btn` click handlers to open it; `Wishlist.close()` to close it.

- Styling: import or build `assets/R-header.css` and `assets/R-wishlist.css` with your site styles so the overlay and modal render correctly.

- Theme toggle: `header.jinja` contains a small script that toggles `document.documentElement` classes `dark`/`light` and persists choice to `localStorage` under `theme-mode`.

**Where to look next**

- If you need to change wishlist rendering, edit `components/header/wishlist_template.jinja` and `assets/header.js` (the `Wishlist.loadItems` logic).
- To adjust search behavior or autocomplete UI, update `components/header/search.jinja` and `assets/R-header.css`.

---

File created by tooling to document header component files.
