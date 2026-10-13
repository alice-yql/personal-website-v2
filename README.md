# personal-website-v2
complete revamping!

## Personal website

This is a static site published with GitHub Pages. The public repository is `alice-yql/personal-website-v2`.

Page styles are in `styles.css`, linked from `index.html`.

## Publish the site

The GitHub Actions workflow in `.github/workflows/deploy-pages.yml` publishes the site whenever changes are pushed to `main`. It also supports manual runs from the repository's **Actions** tab. If GitHub Pages has not been enabled for the repository yet, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**.

After the first successful deployment, the project site is available at:

`https://alice-yql.github.io/personal-website-v2/`

The repository is public, so files included in a published deployment—including the resume PDF—are available to anyone.

## Visitor counter

The centered header counter uses Visitor Badge's public image endpoint and counts views for this GitHub Pages URL. It requires no account, API key, or browser extension. The count is hosted by a third party and can be affected by automated requests or repeated visits.

## Update the resume

Replace `assets/Alice_Liang_Resume.pdf` with the updated PDF and keep the same filename. Commit and push the update to `main`; the workflow republishes the site and resume together. If you rename the PDF, change the Resume button link in `index.html` to match.
