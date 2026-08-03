# Handoff Guide — Transferring the Website to Collective Care

This guide walks through moving the Earth Sanctuary website from one personal
GitHub account into shared collective stewardship. The repository now lives at
**https://github.com/SoilAndSouls/EarthSanctuary**. Follow the phases in order.
Anything a non-technical steward can do is marked **(no code needed)**.

The website itself already works: it's a static site built with
[Eleventy](https://www.11ty.dev), edited through [Sveltia CMS](https://github.com/sveltia/sveltia-cms)
at `/admin`, and deployed on Cloudflare Pages. This document is only about the
**ownership and hosting handoff** — the account-level steps that need your login.

---

## Phase 0 — Security (do this first) 🔴

A GitHub access token had been embedded in the repository's remote URL. Before
sharing anything:

1. Go to **GitHub → Settings → Developer settings → Personal access tokens**.
2. Find the token starting with `ghp_FotsE…` and click **Revoke** (or Delete).
3. That's it — the local copy of the repo has already been cleaned to use a
   plain URL (`https://github.com/IAMOrigiNu/orderofsansau.git`).

Do not skip this. Until the token is revoked, anyone who sees the old URL can
push to the repository.

---

## Phase 1 — Create the collective's GitHub Organization **(no code needed)**

1. Sign in to GitHub with the account that currently owns the repo (`IAMOrigiNu`).
2. Go to **https://github.com/organizations/plan** and choose the **Free** plan.
3. Organization name: **`SoilAndSouls`** → this becomes `github.com/SoilAndSouls`.
4. Set the billing email and finish. You can skip inviting people for now.

> If you pick a different org name, update it in `src/admin/config.yml`
> (the `repo:` line) and in `src/admin/config.yml`'s `base_url` if the domain changes.

## Phase 2 — Transfer the repository into the Organization **(no code needed)**

1. Go to the repo: **https://github.com/IAMOrigiNu/orderofsansau**
2. **Settings → General → Danger Zone → Transfer ownership.**
3. Transfer to **`SoilAndSouls`**. The repo lives at
   `github.com/SoilAndSouls/EarthSanctuary`.
4. Update your local copy's remote (a technical steward runs this once):

   ```bash
   git remote set-url origin https://github.com/SoilAndSouls/EarthSanctuary.git
   ```

> This has already been done — the repository was imported to the org as
> **EarthSanctuary**, and the local remote now points there.

## Phase 3 — Invite the collective **(no code needed)**

1. In the org: **People → Invite member**. Everyone joins with their **own**
   GitHub account (they each make a free account if needed).
2. Create two **Teams** under **Teams → New team**:
   - **stewards** — role **Admin** (can manage settings, deploys, and members)
   - **editors** — role **Write** (can edit content and push changes)
3. Add each person to the right team. This is how "everyone edits from their own
   account" works — and every change is attributed to the person who made it.

---

## Phase 4 — Deploy on Cloudflare Pages **(no code needed to click through)**

1. Create a free account at **https://dash.cloudflare.com**.
2. **Workers & Pages → Create → Pages → Connect to Git.**
3. Authorize Cloudflare for the **SoilAndSouls** org and pick **EarthSanctuary**.
4. Build settings:
   - **Framework preset:** None
   - **Build command:** `npm run build`
   - **Build output directory:** `_site`
5. Click **Save and Deploy**. The first build runs Eleventy and publishes the site.

### Point the domain at Cloudflare

The site's custom domain is **earthsanctuary.net** (see the `CNAME` file).

1. In the Pages project: **Custom domains → Set up a custom domain →
   `earthsanctuary.net`** (and `www.earthsanctuary.net` if desired).
2. Cloudflare will show the DNS records to add. If the domain's DNS is managed
   elsewhere, add those records there; if you move the domain into Cloudflare,
   it's automatic.
3. Once the custom domain is verified and live, **remove the `CNAME` file** from
   the repo (it's only used by GitHub Pages) and turn off GitHub Pages under the
   repo's **Settings → Pages**. This avoids two hosts fighting over the domain.

---

## Phase 5 — Turn on CMS logins (GitHub OAuth) **(one technical setup)**

The visual editor at `/admin` lets people sign in with GitHub. That needs a
GitHub OAuth App plus two secrets in Cloudflare.

1. **Create the OAuth App:** GitHub → the **SoilAndSouls** org → **Settings →
   Developer settings → OAuth Apps → New OAuth App**.
   - **Application name:** Earth Sanctuary CMS
   - **Homepage URL:** `https://earthsanctuary.net`
   - **Authorization callback URL:** `https://earthsanctuary.net/callback`
   - Click **Register application**, then **Generate a new client secret**.
2. **Add the secrets to Cloudflare:** Pages project → **Settings → Environment
   variables → Production**, add:
   - `GITHUB_CLIENT_ID` = the OAuth App's Client ID
   - `GITHUB_CLIENT_SECRET` = the generated client secret
3. **Redeploy** (Deployments → Retry/redeploy) so the functions pick up the vars.
4. Visit **https://earthsanctuary.net/admin** → **Login with GitHub**. Anyone in
   the `editors` or `stewards` team can now edit content.

> The login broker itself lives in `/functions/auth.js` and `/functions/callback.js`
> in this repo — nothing extra to deploy.

---

## Done — what the collective now has

- **Shared ownership:** the site lives in the `SoilAndSouls` org, not one person.
- **Access from their own accounts:** members push code as themselves via teams.
- **Non-technical editing:** stewards edit content at `/admin` with no code.
- **Automatic publishing:** every saved change redeploys the site in ~1 minute.

See **STEWARDS.md** for day-to-day editing and development instructions.
