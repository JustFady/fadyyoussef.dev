# Fady Youssef Portfolio

My personal site, built with plain HTML, CSS and JavaScript on Vite, with an interactive canvas background.

Live site: [fadyyoussef.dev](https://fadyyoussef.dev)

## Features

- Responsive layout for desktop and mobile
- Interactive particle background that reacts to the cursor
- One page: name, rotating role line and an icon row
- GitHub, LinkedIn, resume and email links
- Respects `prefers-reduced-motion`

## Tech Stack

- Vite
- HTML, CSS, JavaScript (no framework)
- GitHub Pages

## Run Locally

```bash
git clone https://github.com/JustFady/fadyyoussef.dev.git
cd fadyyoussef.dev
npm ci
npm run dev
```

The local dev server will print a URL in your terminal.

## Customize It

- `index.html`: page structure and the icon row
- `src/main.js`: rotating titles in `TITLES`, the particle background
- `src/style.css`: all styling, including the mobile rules

Static files live in `public/`:

- `favicon.svg` and `og.png`
- `robots.txt` and `sitemap.xml`
- `CNAME` for the custom domain

The Resume icon links to `/FYoussef_Resume.pdf`, so put that file in `public/` to serve it.

## Build

```bash
npm run build
```

## Deploy

This project deploys to GitHub Pages with:

```bash
npm run deploy
```

That command builds the site and publishes the `dist` folder to the `gh-pages` branch.

## Use This As A Starting Point

Feel free to fork this repo and adapt it for your own portfolio. If it helps you, a star is appreciated.
