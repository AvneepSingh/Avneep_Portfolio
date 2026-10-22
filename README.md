# Avneep Singh — Personal Portfolio

Minimal, responsive personal and academic portfolio. Inspired by the clear academic information architecture of al-folio and the restrained visual language of Apple's website. This is an original static site, **not** a Jekyll theme or a copy of al-folio.

## Preview
Open `index.html` in your browser. No installation or build step is necessary.

## Add your photo
Place a square or portrait image named `profile.jpg` in `assets/`. It is cropped into a perfect circle using CSS (`object-fit: cover`). Until then, the site shows an `AS` monogram placeholder. Adjust the `object-position` in `styles.css` if desired.

## Customize
- `index.html`: bio, project descriptions, work history, and navigation. Replace generic project descriptions with verified outcomes and public links when available.
- `styles.css`: colours are defined in `:root` near the top. Animation styles are near the bottom.
- `script.js`: scroll reveal animations, mobile navigation and year.
- The LinkedIn link is currently set to `https://www.linkedin.com/in/avneep10`. Verify it before publishing.
- The project cards are intentionally **not clickable** until you add real repository, write-up or demo URLs.

## Deploy to GitHub Pages
1. Create a public GitHub repository (e.g. `portfolio`).
2. Upload the **contents** of this folder to the root of the repository; keep `index.html`, `styles.css`, `script.js`, `.nojekyll` and `assets/` at those paths.
3. Go to repository **Settings → Pages**.
4. Under **Build and deployment**, set **Source: Deploy from a branch**, choose **main** and **/(root)**, then save.
5. Once deployed, open `https://YOUR-USERNAME.github.io/portfolio/`.

For a root-level URL `https://YOUR-USERNAME.github.io/`, name the repo exactly `YOUR-USERNAME.github.io`.

## Accessibility
Semantic sections and navigation, focus outlines, image alternative text, responsive layout and reduced-motion preferences.
