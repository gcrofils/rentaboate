# Lisbon Postcard Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Single-page static site showing both sides of a postcard with a 3D flip on click, deployed to `lisbon.milizone.com` via GitHub Pages.

**Architecture:** One `index.html` + one `style.css` + inline `<script>`. Tailwind via Play CDN. Mobile-first. No build step. Asset images pre-processed once with ImageMagick.

**Tech Stack:** HTML5, TailwindCSS (Play CDN), vanilla JS, ImageMagick (asset prep only), Playwright MCP (verification only — no test files in repo), GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-05-14-lisbon-postcard-design.md`

**A note on testing:** This is a one-page static site with minimal logic. Traditional unit-test scaffolding (Jest, Vitest, etc.) is not justified. Verification at each task uses Playwright MCP to drive a real browser — the executor opens the page over a local HTTP server, exercises the behavior, takes a snapshot, and confirms the expected state. No test files are committed to the repo.

---

## File structure

```
/
├── index.html                                 # Created in Task 3
├── style.css                                  # Created in Task 5
├── CNAME                                      # Created in Task 1
├── README.md                                  # Created in Task 1, expanded in Task 7
├── .gitignore                                 # Created in Task 1
├── assets/                                    # Created in Task 2
│   ├── postcard-front.jpg                     # 1400px wide JPG
│   ├── postcard-back.jpg                      # 1400px wide JPG
│   ├── og-image.jpg                           # 1200×630 JPG
│   └── favicon.jpg                            # 256×256 JPG
└── docs/superpowers/
    ├── specs/2026-05-14-lisbon-postcard-design.md   # already committed
    └── plans/2026-05-14-lisbon-postcard.md          # this file
```

**Source images (outside the repo, do not move or modify):**
- Front: `/Volumes/Orchard/Documents/Projects/lisbon.milizone.com/postcard_v05.png` (1445×1089, 2.4 MB)
- Back: `/Volumes/Orchard/Documents/Projects/lisbon.milizone.com/back01.png` (1448×1086, 2.4 MB)

---

## Task 1: Repo skeleton — `.gitignore`, `README.md`, `CNAME`

**Files:**
- Create: `/Volumes/Orchard/Workspaces/rentaboate/.gitignore`
- Create: `/Volumes/Orchard/Workspaces/rentaboate/README.md`
- Create: `/Volumes/Orchard/Workspaces/rentaboate/CNAME`

- [ ] **Step 1: Create `.gitignore`**

Contents:

```gitignore
.DS_Store
*.log
.remember/
```

- [ ] **Step 2: Create `CNAME`**

Contents (single line, no trailing newline necessary but harmless):

```
lisbon.milizone.com
```

- [ ] **Step 3: Create `README.md`**

Contents:

```markdown
# lisbon.milizone.com

Static single-page postcard site. Deployed via GitHub Pages from the `main` branch root.

## Local preview

    python3 -m http.server 8000

Then open <http://localhost:8000/>.

## Deploy

GitHub Pages serves the repo root on push to `main`. The `CNAME` file pins the site to `lisbon.milizone.com`.

## DNS

At the DNS provider for `milizone.com`, point `lisbon` as a `CNAME` to `gcrofils.github.io`. HTTPS is enforced automatically by GitHub once the cert is provisioned.
```

- [ ] **Step 4: Commit**

```bash
git add .gitignore CNAME README.md
git commit -m "Add repo skeleton (gitignore, CNAME, README)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

Expected: one new commit, three files staged and committed.

---

## Task 2: Prepare image assets

**Files:**
- Create: `/Volumes/Orchard/Workspaces/rentaboate/assets/postcard-front.jpg`
- Create: `/Volumes/Orchard/Workspaces/rentaboate/assets/postcard-back.jpg`
- Create: `/Volumes/Orchard/Workspaces/rentaboate/assets/og-image.jpg`
- Create: `/Volumes/Orchard/Workspaces/rentaboate/assets/favicon.jpg`

ImageMagick is required. The path on this machine is `/opt/homebrew/bin/magick`. If `magick` is not on PATH (`which magick` returns nothing), install with `brew install imagemagick`.

- [ ] **Step 1: Create the assets directory**

```bash
mkdir -p /Volumes/Orchard/Workspaces/rentaboate/assets
```

- [ ] **Step 2: Resize front to 1400px wide JPG, quality 85**

```bash
magick /Volumes/Orchard/Documents/Projects/lisbon.milizone.com/postcard_v05.png \
  -resize 1400x \
  -quality 85 \
  -strip \
  /Volumes/Orchard/Workspaces/rentaboate/assets/postcard-front.jpg
```

- [ ] **Step 3: Resize back to 1400px wide JPG, quality 85**

```bash
magick /Volumes/Orchard/Documents/Projects/lisbon.milizone.com/back01.png \
  -resize 1400x \
  -quality 85 \
  -strip \
  /Volumes/Orchard/Workspaces/rentaboate/assets/postcard-back.jpg
```

- [ ] **Step 4: Build the OG image (1200×630, front centered on off-white)**

The postcard is ~4:3 (1.33:1) and OG is 1.91:1. Resize the front to fit within 1200×630 (height-constrained gives ~840×630), then pad with `#f5f0e6` to reach 1200×630.

```bash
magick /Volumes/Orchard/Documents/Projects/lisbon.milizone.com/postcard_v05.png \
  -resize x630 \
  -background "#f5f0e6" \
  -gravity center \
  -extent 1200x630 \
  -quality 85 \
  -strip \
  /Volumes/Orchard/Workspaces/rentaboate/assets/og-image.jpg
```

- [ ] **Step 5: Build the favicon (256×256 center crop of the front)**

Take a square center crop of the front, then resize to 256×256.

```bash
magick /Volumes/Orchard/Documents/Projects/lisbon.milizone.com/postcard_v05.png \
  -gravity center \
  -crop 1089x1089+0+0 +repage \
  -resize 256x256 \
  -quality 85 \
  -strip \
  /Volumes/Orchard/Workspaces/rentaboate/assets/favicon.jpg
```

- [ ] **Step 6: Verify dimensions and sizes**

```bash
magick identify -format "%f: %wx%h  %B bytes\n" \
  /Volumes/Orchard/Workspaces/rentaboate/assets/postcard-front.jpg \
  /Volumes/Orchard/Workspaces/rentaboate/assets/postcard-back.jpg \
  /Volumes/Orchard/Workspaces/rentaboate/assets/og-image.jpg \
  /Volumes/Orchard/Workspaces/rentaboate/assets/favicon.jpg
```

Expected (approximate — quality 85 sizes will vary by a few KB):
- `postcard-front.jpg: 1400x1055  <500000 bytes`
- `postcard-back.jpg: 1400x1050  <500000 bytes`
- `og-image.jpg: 1200x630  <250000 bytes`
- `favicon.jpg: 256x256  <30000 bytes`

If any file exceeds the expected ceiling by more than 25%, lower quality to 80 and re-run that step.

- [ ] **Step 7: Commit**

```bash
git add assets/
git commit -m "Add postcard image assets (front, back, OG, favicon)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 3: HTML skeleton with `<head>` (title, meta, OG, Tailwind CDN)

**Files:**
- Create: `/Volumes/Orchard/Workspaces/rentaboate/index.html`

- [ ] **Step 1: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>Lisbon, this summer — a place to stay</title>
  <meta name="description" content="Bright, lived-in flat in Santos. Available 2 July to 13 August. Friends and friends of friends.">

  <link rel="icon" href="/assets/favicon.jpg">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="A place to stay in Lisbon — this summer">
  <meta property="og:description" content="Bright, lived-in flat in Santos. Available 2 July to 13 August. Friends and friends of friends.">
  <meta property="og:url" content="https://lisbon.milizone.com/">
  <meta property="og:image" content="https://lisbon.milizone.com/assets/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Lisbon postcard — A place to stay in Lisbon">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="A place to stay in Lisbon — this summer">
  <meta name="twitter:description" content="Bright, lived-in flat in Santos. Available 2 July to 13 August. Friends and friends of friends.">
  <meta name="twitter:image" content="https://lisbon.milizone.com/assets/og-image.jpg">
  <meta name="twitter:image:alt" content="Lisbon postcard — A place to stay in Lisbon">

  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            paper: '#f5f0e6',
          },
        },
      },
    };
  </script>
</head>
<body class="bg-paper min-h-[100dvh]">
  <!-- Card and hint button added in later tasks -->
</body>
</html>
```

- [ ] **Step 2: Serve locally and verify head renders**

```bash
cd /Volumes/Orchard/Workspaces/rentaboate
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s http://localhost:8000/ | grep -E '(og:|twitter:|<title>)' | head -20
kill $SERVER_PID
```

Expected output: the `<title>` line plus all `og:*` and `twitter:*` meta tags from above, in order.

- [ ] **Step 3: Browser verification with Playwright MCP**

Start the local server, then drive a browser:

```bash
cd /Volumes/Orchard/Workspaces/rentaboate
python3 -m http.server 8000 &
echo $! > /tmp/lisbon-server.pid
sleep 1
```

Then via Playwright MCP:
- `browser_navigate` to `http://localhost:8000/`
- `browser_evaluate` with the JS expression `document.title` — expect `Lisbon, this summer — a place to stay`
- `browser_evaluate` with `document.querySelector('meta[property="og:image"]').content` — expect `https://lisbon.milizone.com/assets/og-image.jpg`
- `browser_evaluate` with `getComputedStyle(document.body).backgroundColor` — expect `rgb(245, 240, 230)` (the paper color)
- `browser_close`

Then:

```bash
kill "$(cat /tmp/lisbon-server.pid)" 2>/dev/null
rm -f /tmp/lisbon-server.pid
```

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Add HTML skeleton with title, meta, OG, Twitter card, Tailwind CDN

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 4: Card structure and mobile-first Tailwind layout

**Files:**
- Modify: `/Volumes/Orchard/Workspaces/rentaboate/index.html`

Goal: the page renders the front of the postcard in a centered card, with a subtle shadow and rounded corners. Mobile fills 92vw; desktop caps at 800px. Aspect ratio is locked so there's no layout shift while images load.

- [ ] **Step 1: Replace the body contents**

Replace the line `<!-- Card and hint button added in later tasks -->` and the empty body with this `<main>` block (everything inside `<body class="bg-paper min-h-[100dvh]">`):

```html
<body class="bg-paper min-h-[100dvh]">
  <main class="min-h-[100dvh] grid place-items-center px-4 py-8">
    <button
      id="card"
      type="button"
      aria-pressed="false"
      aria-label="Show back of postcard"
      class="card group block w-[min(92vw,800px)] aspect-[1400/1055] rounded-lg shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
    >
      <div class="card-inner relative w-full h-full">
        <img
          class="card-face card-face--front absolute inset-0 w-full h-full object-cover rounded-lg"
          src="/assets/postcard-front.jpg"
          alt='Postcard front — collage of Lisbon scenes with the title "A place to stay in Lisbon, this summer."'
        >
        <img
          class="card-face card-face--back absolute inset-0 w-full h-full object-cover rounded-lg"
          src="/assets/postcard-back.jpg"
          alt="Postcard back — handwritten note describing a Santos flat available 2 July to 13 August, 2 bedrooms, 700 euros per week."
        >
      </div>
    </button>
  </main>
</body>
```

The `card`, `card-inner`, `card-face`, and `card-face--front/back` classes are styled in `style.css` in Task 5 — at this stage both faces are stacked at `inset: 0` so only the back image (the second one in DOM order) is visible. That's expected.

- [ ] **Step 2: Verify with Playwright MCP at mobile and desktop**

```bash
cd /Volumes/Orchard/Workspaces/rentaboate
python3 -m http.server 8000 &
echo $! > /tmp/lisbon-server.pid
sleep 1
```

- `browser_resize` to 390×844 (iPhone 13 / SE width)
- `browser_navigate` to `http://localhost:8000/`
- `browser_take_screenshot` — confirm the postcard fills most of the screen width with paper background around it
- `browser_evaluate` with `document.getElementById('card').getBoundingClientRect().width` — expect approximately `358` (92% of 390)
- `browser_resize` to 1440×900
- `browser_take_screenshot` — confirm the card is centered and not wider than 800px
- `browser_evaluate` with `document.getElementById('card').getBoundingClientRect().width` — expect `800`
- `browser_close`

```bash
kill "$(cat /tmp/lisbon-server.pid)" 2>/dev/null
rm -f /tmp/lisbon-server.pid
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Add postcard card layout with mobile-first Tailwind styling

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 5: 3D flip — `style.css`, transform CSS, click handler

**Files:**
- Create: `/Volumes/Orchard/Workspaces/rentaboate/style.css`
- Modify: `/Volumes/Orchard/Workspaces/rentaboate/index.html`

- [ ] **Step 1: Create `style.css`**

```css
.card {
  perspective: 1400px;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
}

.card-inner {
  transform-style: preserve-3d;
  transition: transform 700ms cubic-bezier(0.4, 0, 0.2, 1);
}

.card.is-flipped .card-inner {
  transform: rotateY(180deg);
}

.card-face {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-face--back {
  transform: rotateY(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .card-inner {
    transition: none;
  }
}
```

- [ ] **Step 2: Link `style.css` from `index.html`**

In `index.html`, add this line inside `<head>`, immediately after the `<link rel="icon" ...>` line:

```html
  <link rel="stylesheet" href="/style.css">
```

- [ ] **Step 3: Add the click handler script**

In `index.html`, immediately before `</body>`, add:

```html
  <script>
    (() => {
      const card = document.getElementById('card');
      card.addEventListener('click', () => {
        const flipped = card.classList.toggle('is-flipped');
        card.setAttribute('aria-pressed', flipped ? 'true' : 'false');
        card.setAttribute(
          'aria-label',
          flipped ? 'Show front of postcard' : 'Show back of postcard'
        );
      });
    })();
  </script>
```

The `<button>` already gives us Space and Enter activation for free — no extra `keydown` listener needed.

- [ ] **Step 4: Verify flip with Playwright MCP**

```bash
cd /Volumes/Orchard/Workspaces/rentaboate
python3 -m http.server 8000 &
echo $! > /tmp/lisbon-server.pid
sleep 1
```

- `browser_navigate` to `http://localhost:8000/`
- `browser_evaluate` with `document.getElementById('card').classList.contains('is-flipped')` — expect `false`
- `browser_evaluate` with `document.getElementById('card').getAttribute('aria-pressed')` — expect `"false"`
- `browser_take_screenshot` — front visible
- `browser_click` on the card (use `ref` from `browser_snapshot` for the card button)
- Wait 800ms (use `browser_wait_for` with `time: 1`)
- `browser_evaluate` with `document.getElementById('card').classList.contains('is-flipped')` — expect `true`
- `browser_evaluate` with `document.getElementById('card').getAttribute('aria-pressed')` — expect `"true"`
- `browser_evaluate` with `document.getElementById('card').getAttribute('aria-label')` — expect `"Show front of postcard"`
- `browser_take_screenshot` — back visible
- `browser_click` on the card again
- Wait 800ms
- `browser_evaluate` with `document.getElementById('card').classList.contains('is-flipped')` — expect `false`
- `browser_take_screenshot` — front visible again
- `browser_close`

```bash
kill "$(cat /tmp/lisbon-server.pid)" 2>/dev/null
rm -f /tmp/lisbon-server.pid
```

- [ ] **Step 5: Verify keyboard activation**

Re-launch server (as in Step 4), then via Playwright MCP:

- `browser_navigate` to `http://localhost:8000/`
- `browser_evaluate` with `document.getElementById('card').focus()`
- `browser_press_key` with key `Enter`
- Wait 800ms
- `browser_evaluate` with `document.getElementById('card').classList.contains('is-flipped')` — expect `true`
- `browser_press_key` with key ` ` (single space) — the Space key
- Wait 800ms
- `browser_evaluate` with `document.getElementById('card').classList.contains('is-flipped')` — expect `false`
- `browser_close`

Kill the server.

- [ ] **Step 6: Commit**

```bash
git add style.css index.html
git commit -m "Add 3D flip on card click with reduced-motion support

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 6: Idle hint button — 4s timer, fade-in, cancel on interaction

**Files:**
- Modify: `/Volumes/Orchard/Workspaces/rentaboate/index.html`
- Modify: `/Volumes/Orchard/Workspaces/rentaboate/style.css`

- [ ] **Step 1: Add the hint button to the layout**

In `index.html`, inside `<main>`, change the body of `<main>` from:

```html
  <main class="min-h-[100dvh] grid place-items-center px-4 py-8">
    <button
      id="card"
      ...
    >
      ...
    </button>
  </main>
```

to:

```html
  <main class="min-h-[100dvh] grid place-items-center px-4 py-8">
    <div class="flex flex-col items-center gap-6">
      <button
        id="card"
        type="button"
        aria-pressed="false"
        aria-label="Show back of postcard"
        class="card group block w-[min(92vw,800px)] aspect-[1400/1055] rounded-lg shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
      >
        <div class="card-inner relative w-full h-full">
          <img
            class="card-face card-face--front absolute inset-0 w-full h-full object-cover rounded-lg"
            src="/assets/postcard-front.jpg"
            alt='Postcard front — collage of Lisbon scenes with the title "A place to stay in Lisbon, this summer."'
          >
          <img
            class="card-face card-face--back absolute inset-0 w-full h-full object-cover rounded-lg"
            src="/assets/postcard-back.jpg"
            alt="Postcard back — handwritten note describing a Santos flat available 2 July to 13 August, 2 bedrooms, 700 euros per week."
          >
        </div>
      </button>
      <button
        id="hint"
        type="button"
        hidden
        class="hint inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-4 py-2 text-sm text-slate-700 shadow ring-1 ring-slate-300/60 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
      >
        <span aria-hidden="true">↻</span> Flip it
      </button>
    </div>
  </main>
```

Note: the only changes are wrapping the existing `<button id="card">` in a `<div class="flex flex-col items-center gap-6">` and adding the `<button id="hint">` after it. The card markup itself is unchanged.

- [ ] **Step 2: Add fade-in styles to `style.css`**

Append to `style.css`:

```css
.hint {
  opacity: 0;
  transition: opacity 300ms ease-out;
}

.hint.is-visible {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .hint {
    transition: none;
  }
}
```

- [ ] **Step 3: Replace the inline `<script>` with the full interaction logic**

In `index.html`, replace the entire existing `<script>` block (the one immediately before `</body>` from Task 5) with:

```html
  <script>
    (() => {
      const card = document.getElementById('card');
      const hint = document.getElementById('hint');
      const IDLE_MS = 4000;

      let hasInteracted = false;
      let idleTimer = window.setTimeout(showHint, IDLE_MS);

      function flip() {
        const flipped = card.classList.toggle('is-flipped');
        card.setAttribute('aria-pressed', flipped ? 'true' : 'false');
        card.setAttribute(
          'aria-label',
          flipped ? 'Show front of postcard' : 'Show back of postcard'
        );
      }

      function markInteracted() {
        if (hasInteracted) return;
        hasInteracted = true;
        window.clearTimeout(idleTimer);
        hideHint();
      }

      function showHint() {
        if (hasInteracted) return;
        hint.hidden = false;
        // Force a frame so the opacity transition runs from 0 → 1.
        requestAnimationFrame(() => hint.classList.add('is-visible'));
      }

      function hideHint() {
        hint.classList.remove('is-visible');
        hint.hidden = true;
      }

      card.addEventListener('click', () => {
        markInteracted();
        flip();
      });

      hint.addEventListener('click', () => {
        markInteracted();
        flip();
      });

      // Any other interaction also cancels the timer (without flipping).
      ['keydown', 'pointerdown', 'touchstart'].forEach((evt) => {
        document.addEventListener(evt, (e) => {
          if (card.contains(e.target) || hint.contains(e.target)) {
            return; // already handled by the dedicated listeners above
          }
          markInteracted();
        }, { passive: true });
      });
    })();
  </script>
```

- [ ] **Step 4: Verify the idle hint appears after 4s**

```bash
cd /Volumes/Orchard/Workspaces/rentaboate
python3 -m http.server 8000 &
echo $! > /tmp/lisbon-server.pid
sleep 1
```

Via Playwright MCP:

- `browser_navigate` to `http://localhost:8000/`
- `browser_evaluate` with `document.getElementById('hint').hidden` — expect `true`
- Wait via `browser_wait_for` with `time: 5` (5 seconds — past the 4s threshold)
- `browser_evaluate` with `document.getElementById('hint').hidden` — expect `false`
- `browser_evaluate` with `document.getElementById('hint').classList.contains('is-visible')` — expect `true`
- `browser_take_screenshot` — front still visible, hint button shown below
- `browser_close`

Kill the server.

- [ ] **Step 5: Verify the hint is cancelled by an early flip**

Re-launch server. Via Playwright MCP:

- `browser_navigate` to `http://localhost:8000/`
- `browser_click` on the card immediately (within the first second)
- Wait via `browser_wait_for` with `time: 6` (6 seconds, well past the 4s threshold)
- `browser_evaluate` with `document.getElementById('hint').hidden` — expect `true`
- `browser_evaluate` with `document.getElementById('card').classList.contains('is-flipped')` — expect `true`
- `browser_close`

Kill the server.

- [ ] **Step 6: Verify clicking the hint flips the card and hides the hint**

Re-launch server. Via Playwright MCP:

- `browser_navigate` to `http://localhost:8000/`
- Wait via `browser_wait_for` with `time: 5`
- `browser_evaluate` with `document.getElementById('hint').hidden` — expect `false`
- `browser_click` on the hint button (use `browser_snapshot` to find its `ref`)
- Wait 800ms via `browser_wait_for` with `time: 1`
- `browser_evaluate` with `document.getElementById('card').classList.contains('is-flipped')` — expect `true`
- `browser_evaluate` with `document.getElementById('hint').hidden` — expect `true`
- `browser_close`

Kill the server.

- [ ] **Step 7: Commit**

```bash
git add index.html style.css
git commit -m "Add idle hint button after 4s with cancel-on-interaction

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 7: Final polish, deploy notes, push

**Files:**
- Modify: `/Volumes/Orchard/Workspaces/rentaboate/README.md`

- [ ] **Step 1: Final cross-size visual check**

```bash
cd /Volumes/Orchard/Workspaces/rentaboate
python3 -m http.server 8000 &
echo $! > /tmp/lisbon-server.pid
sleep 1
```

Via Playwright MCP, for each of these widths, navigate fresh and take a full screenshot:

- 360×780 (small Android)
- 390×844 (iPhone 13 / SE)
- 768×1024 (iPad portrait)
- 1024×768 (iPad landscape)
- 1440×900 (desktop)

For each: confirm the card is centered, no horizontal scrollbar, image is sharp (not visibly upscaled or blurry), and the hint appears after a 5s wait at one of the widths.

- `browser_close` between each width if needed (resize alone is also fine).

Kill the server.

- [ ] **Step 2: Verify total page weight**

```bash
cd /Volumes/Orchard/Workspaces/rentaboate
du -sh index.html style.css assets/postcard-front.jpg assets/postcard-back.jpg
du -ch index.html style.css assets/postcard-front.jpg assets/postcard-back.jpg | tail -1
```

Expected: the total (excluding the OG image and favicon, which aren't loaded by the main page) is under 1 MB. If it's over, raise the JPG compression in Task 2 (`-quality 80` or `75`) and re-run from there.

- [ ] **Step 3: Append a deploy checklist to `README.md`**

Append this section to `README.md`:

```markdown

## Deploy checklist

1. Push `main` to `origin`.
2. In GitHub repo settings → Pages, set source to `Deploy from a branch`, branch `main`, folder `/ (root)`. Save.
3. Confirm GitHub Pages picks up `CNAME` and shows `lisbon.milizone.com` as the configured custom domain.
4. At the milizone.com DNS provider, create a `CNAME` record: name `lisbon`, target `gcrofils.github.io`. TTL 3600 is fine.
5. Wait for HTTPS to provision (a few minutes to a few hours). Tick "Enforce HTTPS" in the Pages settings once it's available.
6. Open <https://lisbon.milizone.com/>. Hard-refresh. Verify the card loads, flips on click, and the hint appears after 4 seconds.
7. Paste the URL into the Facebook Sharing Debugger (<https://developers.facebook.com/tools/debug/>) and Twitter Card Validator to confirm the OG image and copy render correctly.
```

- [ ] **Step 4: Commit and push**

```bash
git add README.md
git commit -m "Add deploy and verification checklist to README

Co-Authored-By: Claude <noreply@anthropic.com>"
git push -u origin main
```

After push, the GitHub Pages configuration must be done manually in the repo settings (Step 3 of the checklist). That part is outside this plan's scope.
