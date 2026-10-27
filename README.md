# Kencana Industries Website

Static website for Kencana Industries Sdn Bhd (plain HTML, CSS and JavaScript, no build step).

Live site: https://limj0525.github.io/kencana-industries/

## Structure

| Path | Contents |
|---|---|
| `index.html`, `about-us.html`, `contact-us.html` | Main pages |
| `products/` | Product pages: `product-home.html` (overview), `bonfiglioli.html`, `couplings.html` (Coupling and Elements), `industrial-parts.html` |
| `css/style.css` | Shared styles (header, nav, footer, slider, floating contact) |
| `css/*.css` | Page-specific styles |
| `js/main.js` | All site scripts (menu, slider, galleries, image modal, contact form) |
| `images/` | Photos, logos and video |

The header, nav menu, footer and floating contact block are repeated in every page. When changing one, update all 7 HTML files (pages in `products/` use `../` paths).

## Previewing locally

Open `index.html` in a browser, or run a local server from this folder:

```
python -m http.server 8000
```

then visit http://localhost:8000.

## Deploying (GitHub Pages)

The site is published by GitHub Pages from the `main` branch of
`https://github.com/limj0525/kencana-industries`. Pushing to `main` updates the live site
within a minute or two.

```
git add -A
git commit -m "Describe the change"
git push
```

### Cache busting

CSS, JS and some images are linked with a version number, e.g. `css/product.css?v=25`.
Browsers cache these files, so **when you change a CSS/JS file (or replace an image under the
same name), increase its `?v=` number in every HTML file that links to it**, otherwise visitors
may keep seeing the old version.

## Contact form

The enquiry form on `contact-us.html` sends submissions through [Web3Forms](https://web3forms.com)
(access key in the hidden `access_key` field) with hCaptcha.
