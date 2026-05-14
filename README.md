# lisbon.milizone.com

Static single-page postcard site. Deployed via GitHub Pages from the `main` branch root.

## Local preview

    python3 -m http.server 8000

Then open <http://localhost:8000/>.

## Deploy

GitHub Pages serves the repo root on push to `main`. The `CNAME` file pins the site to `lisbon.milizone.com`.

## DNS

At the DNS provider for `milizone.com`, point `lisbon` as a `CNAME` to `gcrofils.github.io`. HTTPS is enforced automatically by GitHub once the cert is provisioned.
