# Lisbon Postcard Site — Design

A single-page static site that displays both sides of a postcard with a flip
interaction. Deployed via GitHub Pages on `lisbon.milizone.com`.

## Goals

- Show the postcard front by default; let the visitor flip to the back.
- Look good on phones first, scale up to desktop.
- Render rich previews when shared on social platforms (Open Graph / Twitter
  Card).
- Zero build step. Commit, push, ship.

## Non-goals

- No analytics, cookie banner, contact form, or booking flow.
- No dark mode.
- No translations.
- No JavaScript framework or bundler.

## Stack

- Hand-written `index.html`, `style.css` (only for the flip mechanic that
  Tailwind can't express ergonomically).
- TailwindCSS via the Play CDN (`<script src="https://cdn.tailwindcss.com">`),
  with inline config for the off-white card background.
- One small inline `<script>` for the flip toggle and idle hint.
- Mobile-first: base styles target small screens, Tailwind `sm:` / `md:`
  breakpoints scale up.

## File layout

```
/
├── index.html
├── style.css                # 3D flip rules (perspective, backface-visibility)
├── CNAME                    # lisbon.milizone.com
├── README.md                # one-paragraph deploy note (DNS hint)
├── .gitignore
├── docs/superpowers/specs/  # this spec
└── assets/
    ├── postcard-front.jpg   # ~1600px wide, JPG
    ├── postcard-back.jpg    # ~1600px wide, JPG
    ├── og-image.jpg         # 1200×630, front centered on off-white
    └── favicon.jpg          # small crop of the front
```

Source images live outside the repo at
`/Volumes/Orchard/Documents/Projects/lisbon.milizone.com/postcard_v05.png`
(front) and `back01.png` (back). The implementation step converts these into
the `assets/` files above (resize, JPG encode, OG composition).

## Flip mechanic

- A `.card` wrapper with CSS `perspective`.
- A `.card-inner` inside it that rotates `rotateY(180deg)` when the wrapper has
  `.is-flipped`.
- Two child elements `.card-face--front` and `.card-face--back`, both with
  `backface-visibility: hidden`. The back face is pre-rotated 180° so it shows
  correctly once the flip happens.
- The outer card is a `<button type="button">` so it's keyboard- and screen
  reader-friendly. Click, Space, and Enter all toggle.
- `aria-pressed` reflects current side. `aria-label` swaps between
  `"Show back of postcard"` and `"Show front of postcard"` as state changes.
- Transition: `transform 700ms cubic-bezier(0.4, 0, 0.2, 1)`.

The flip CSS lives in `style.css` rather than Tailwind utilities because
`backface-visibility`, `transform-style: preserve-3d`, and the paired face
rotation are awkward to express as utility classes and benefit from being
named.

## Idle hint button

- On page load, start a 4-second timer.
- The timer is cancelled on the first user interaction (`click`, `keydown`,
  `touchstart`, `pointerdown` anywhere on the document).
- If the timer fires without interaction, a button fades in below the card:
  `↻ Flip it`. The fade-in is a 300ms opacity transition.
- Clicking the button flips the card and hides itself.
- Once the user has flipped the card by any means, the button never reappears.

## Layout

- Page background: off-white (`#f5f0e6` — sampled to feel like postcard paper).
- Card sized as `width: min(92vw, 800px)`, aspect ratio matched to the source
  postcard (~4:3, set explicitly with `aspect-ratio` to avoid layout shift).
- Card centered vertically and horizontally; on very tall viewports it sits in
  the upper-middle, never touching screen edges.
- Faint drop shadow under the card to suggest it's resting on a surface.
- Body has `min-height: 100dvh` (dynamic viewport unit) so it works on mobile
  with browser chrome.
- No horizontal scroll at any width.

## OG / SEO

`<head>` contains:

- `<title>Lisbon, this summer — a place to stay</title>`
- `<meta name="description" content="Bright, lived-in flat in Santos.
  Available 2 July to 13 August. Friends and friends of friends.">`
- `<html lang="en">`
- Open Graph:
  - `og:type = website`
  - `og:title = A place to stay in Lisbon — this summer`
  - `og:description = Bright, lived-in flat in Santos. Available 2 July to
    13 August. Friends and friends of friends.`
  - `og:url = https://lisbon.milizone.com/`
  - `og:image = https://lisbon.milizone.com/assets/og-image.jpg`
  - `og:image:width = 1200`, `og:image:height = 630`
  - `og:image:alt = Lisbon postcard — A place to stay in Lisbon`
- Twitter Card mirror: `summary_large_image`, same title/description/image.
- Favicon: `<link rel="icon" href="/assets/favicon.jpg">`.

## Accessibility

- Card is a real `<button>`. Focus visible.
- Faces have descriptive `alt` text on the `<img>`:
  - Front: `Postcard front — collage of Lisbon scenes with the title
    "A place to stay in Lisbon, this summer."`
  - Back: `Postcard back — handwritten note describing a Santos flat
    available 2 July to 13 August, 2 bedrooms, 700 euros per week.`
- `prefers-reduced-motion: reduce` disables the flip animation (instant swap)
  and the idle-hint fade-in.
- Hint button is a real `<button>` rendered with the `hidden` HTML attribute
  until the idle timer fires (avoids `aria-hidden` on a focusable element).
  When shown, `hidden` is removed and the opacity transition runs.

## Deploy

- GitHub Pages, source = `main` branch, root.
- `CNAME` file at repo root contains `lisbon.milizone.com`.
- `README.md` contains a short note: at the DNS provider for milizone.com,
  point `lisbon` as a `CNAME` to `gcrofils.github.io`.

## Risks / open questions

- The Play CDN shows a console warning ("not for production"). At a single
  page with two images, the warning is the only cost; functionally fine.
- Source PNGs are 2-3 MB each. The resize/encode step is what makes the page
  fast; the implementation plan must include verifying the final JPG sizes
  (target: each under 500 KB).
- 4-second idle threshold is a guess. Easy to tune in implementation if it
  feels too short or too long during testing.
