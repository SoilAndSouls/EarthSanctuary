# Stewards Guide — Caring for the Earth Sanctuary Website

Welcome, steward. This guide explains how the website is built and how to make
changes — whether you're comfortable with code or not.

**Live site:** https://earthsanctuary.net
**Content editor:** https://earthsanctuary.net/admin

---

## Two ways to make changes

### 1. The visual editor (no code) — recommended for most edits

Go to **https://earthsanctuary.net/admin** and **Login with GitHub**.

You'll see two sections:

- **Site Settings** — the safest place to edit. Change the menu, footer contact
  info (phone, email, YouTube), partner logos, and the copyright year. These
  appear on **every page**, so you only edit them once.
- **Pages** — edit the words and content of each page (Home, About, Practices,
  Sacred Land, Events, Resources, Support & Invest, Contact). You can fix typos,
  update text, and swap images.

When you click **Save** (publish), your change becomes a commit and the live site
updates automatically in about a minute.

> **A note on Pages:** the page content contains some layout formatting (HTML).
> Editing the words is safe. If you need to change the *layout or design* of a
> page, ask a technical steward to do it in code (see below) — that keeps the
> design from breaking.

### 2. Editing the code (for technical stewards)

The site is an [Eleventy](https://www.11ty.dev) static site. You edit source
files in `src/`, and Eleventy builds the final website into `_site/`.

```bash
# One-time setup
npm install

# Live preview at http://localhost:8080 while you edit
npm run dev

# Produce the final site in _site/
npm run build
```

Push to the `main` branch (or open a Pull Request) and Cloudflare Pages
redeploys automatically.

---

## How the project is organized

```
src/
├── _data/site.json      ← global content (menu, footer, contact, partners)
├── _includes/
│   ├── base.njk         ← the page shell (head, header, footer, scripts)
│   ├── header.njk       ← the top navigation (built from site.json)
│   ├── footer.njk       ← the standard footer (built from site.json)
│   ├── footer-invest.njk← the richer footer used only on Support & Invest
│   └── support-styles.njk← extra CSS used only on the Support & Invest page
├── index.njk            ← Home page content
├── about.njk            ← About page content
├── practices.njk        ├─ …one file per page. Front matter (between the ---
├── sacred-land.njk      │   lines) sets the title and settings; everything
├── events.njk           │   below is the page's content.
├── resources.njk        │
├── support.njk          │
├── contact.njk          ┘
├── css/  js/  images/   ← styling, scripts, and pictures (copied as-is)
├── admin/               ← the Sveltia CMS visual editor (/admin)
└── CNAME                ← custom-domain marker (used by GitHub Pages only)

functions/               ← Cloudflare login broker for the CMS (/auth, /callback)
```

### The big win: edit the header/footer once

Previously the menu and footer were copy-pasted into all 8 pages. Now they live
in **one place** — `src/_data/site.json` — and are inserted into every page
automatically. Change the phone number once, and it updates everywhere.

---

## Common tasks

| I want to… | Where to do it |
| --- | --- |
| Change the phone number, email, or YouTube link | Site Settings → Contact Information |
| Add or rename a menu item | Site Settings → Navigation Menu |
| Update a partner logo | Site Settings → Partners |
| Fix a typo on a page | Pages → (that page) → Page Content |
| Change a page's layout/design | Edit that page's `.njk` file in code |
| Add a new page | Create a new `.njk` file in `src/` (technical) |

---

## Good habits for collective care

- **Small, clear changes.** Save one edit at a time with a short description.
- **Preview before publishing** big changes with `npm run dev` if you can.
- **Use Pull Requests** for larger code changes so another steward can review.
- **Never paste passwords or tokens** into files. Secrets live only in
  Cloudflare's environment variables (see HANDOFF.md).
