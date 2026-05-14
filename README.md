# lisbon.milizone.com

Static single-page postcard site. Deployed via GitHub Pages from the `main` branch root.

## Local preview

    python3 -m http.server 8000

Then open <http://localhost:8000/>.

## Deploy

GitHub Pages serves the repo root on push to `main`. The `CNAME` file pins the site to `lisbon.milizone.com`.

## DNS

At the DNS provider for `milizone.com`, point `lisbon` as a `CNAME` to `gcrofils.github.io`. HTTPS is enforced automatically by GitHub once the cert is provisioned.

## Updating assets

When swapping the postcard image or restyling `style.css`, bump the `?v=N` query string on every asset reference in `index.html` (find/replace `?v=N` → `?v=N+1`). That forces browsers and social-platform scrapers to refetch instead of serving a stale copy.

Sources for the postcard live in `src/` (gitignored). The site assets are:

- `assets/postcard-front.jpg` — front, ~1400px wide JPG
- `assets/postcard-back.jpg` — English back, ~1400px wide JPG
- `assets/postcard-back-fr.jpg` — French back, ~1400px wide JPG
- `assets/og-image.jpg` — front composed onto a 1200×630 paper background
- Favicons at site root (`favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`) plus `site.webmanifest`. Regenerate at <https://realfavicongenerator.net> only when the logo itself changes.
