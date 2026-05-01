# Fady Youssef Portfolio

A personal portfolio site built with React, Vite, and a custom interactive canvas background.

Live site: [fadyyoussef.dev](https://fadyyoussef.dev)

## Features

- Responsive layout for desktop and mobile
- Interactive canvas particle background
- Home, About, and Projects tabs
- Social, resume, and email links
- Custom favicon and GitHub Pages deployment

## Tech Stack

- React
- Vite
- CSS
- GitHub Pages

## Run Locally

```bash
git clone https://github.com/JustFady/FY-Portfolio.git
cd FY-Portfolio
npm install
npm run dev
```
The local dev server will print a URL in your terminal.


## Customize It

Most of the content lives in `src/App.jsx`:

- Update rotating titles in `TITLES`
- Update project cards in `PROJECTS`
- Edit About copy in the `about` tab section
- Change social links in the home icon row

Main styling lives in `src/App.css`, including the responsive mobile rules and tab layout.

Static files live in `public/`:

- `resume.pdf`
- `favicon.svg`
- `CNAME` for the custom domain

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
