# lisbon.milizone.com

Single landing page for the Santos flat, built with Eleventy and deployed to GitHub Pages by `.github/workflows/deploy.yml` on push to `main`.

## Local preview

    npm install
    npm run serve

Then open <http://localhost:8080/>.

## Updating the page

Everything that changes between seasons is in `site/_data/settings.yml`: season, dates, sleeps, minimum stay, rent, the hero photo and the photo list. Each text has `en`, `fr` and `ru` versions.

- Photos go in `site/assets/photos/` and are referenced by file name.
- Order in `photos:` is the order on the page (column by column: the first column fills top to bottom, then the next).
- `paused: true` hides a photo without removing it.
- The link preview image is `site/assets/og.jpg` (1200×630), cropped from the hero photo. Regenerate it when the hero changes.

The rest of the copy is in `site/index.njk`. It builds one page per language: `/` (English), `/fr/` and `/ru/`, each with its own title and link preview text.

`src/` (gitignored) is a scratch handoff folder, not the Eleventy input.

## DNS

At the DNS provider for `milizone.com`, point `lisbon` as a `CNAME` to `gcrofils.github.io`. The `site/CNAME` file pins the custom domain.

Favicons and `site.webmanifest` live in `site/`. Regenerate at <https://realfavicongenerator.net> only when the logo changes.
