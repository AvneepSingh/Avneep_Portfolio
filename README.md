# Avneep Singh — Personal Portfolio

An original, responsive personal portfolio with an Apple-inspired warm-white design and Bootstrap 5.3 responsive grid and navigation. Static HTML, CSS and JavaScript: no npm, build tools, server code, or Jekyll required.

## Preview
Open `index.html` locally in a browser. Bootstrap and Google Fonts are loaded from CDNs, so internet access is required for their styles/fonts (the underlying HTML and design content remain available).

## Deploy to GitHub Pages
1. Create a public GitHub repository called `portfolio` (or use your existing portfolio repository).
2. Upload **the contents of this folder** to the repository root, NOT the enclosing directory. Ensure `index.html` is in the repository root along with `styles.css`, `script.js`, `.nojekyll`, and `assets/profile.jpg`.
3. Go to repository Settings → Pages → Build and deployment → Deploy from a branch → main → /(root), then Save.
4. GitHub Pages publishes to `https://YOUR-GITHUB-USERNAME.github.io/portfolio/`.

For a root profile URL, make a repository called `YOUR-GITHUB-USERNAME.github.io` and upload the same files.

## Editing
- Update your project descriptions and bio in `index.html`.
- Update `portfolio-data.js` for Dottie’s CV knowledge. It loads before `script.js`; keep both files when deploying. Dottie matches supported topics locally and states when a detail is missing.
- Adjust color tokens at the beginning of `styles.css`.
- `assets/profile.jpg` is a 2:3 crop of your provided original photo, focusing on your face and shoulders. The website displays it inside a circular mask.
- Add verified links to projects once you have published repositories or demos.
- Layout and navbar responsiveness use Bootstrap 5.3, not hand-coded media queries. The only media query in `styles.css` concerns reduced-motion accessibility.
- Animation is IntersectionObserver based and deliberately subtle.

### Notes
The website has not been published to your GitHub account automatically. Use the steps above to go live.
