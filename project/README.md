# Regulars Coffee Bar — Premium Website

A cinematic, luxury café website for Regulars Coffee Bar (HRBR Layout, Kalyan Nagar, Bengaluru), built with vanilla HTML/CSS/JS, GSAP animations, Lenis smooth scroll, and Supabase for data.

## Features

- Cinematic preloader with brand reveal
- Full-screen parallax hero
- Editorial brand story, signature experience grid
- Interactive menu (6 categories, managed via admin)
- Asymmetrical masonry gallery with full-screen lightbox
- Customer reviews slider (auto-advancing)
- Google Maps integration with directions
- Instagram-inspired grid
- Custom cursor (desktop), magnetic buttons, scroll-triggered animations
- Fully responsive (mobile-first, no horizontal scroll)
- SEO: meta tags, Open Graph, structured data, sitemap, robots.txt
- Secure admin dashboard (Supabase auth):
  - Manage menu items (add, edit, delete, toggle availability/favourite)
  - Manage gallery images
  - Manage customer reviews
  - Update contact info, hours, map location

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript, Vite
- **Animations:** GSAP + ScrollTrigger, Lenis smooth scroll
- **Database/Auth:** Supabase (PostgreSQL)
- **Fonts:** Cormorant Garamond + DM Sans

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```

3. Run the dev server:
   ```
   npm run dev
   ```

4. Build for production:
   ```
   npm run build
   ```

## Admin Access

Visit `/admin.html` to access the dashboard. Create an admin user in Supabase,
set its trusted app metadata to `"role": "admin"`, then sign in.

## Creating an Admin Account

Since the admin dashboard uses Supabase authentication, you need to create an admin user:

1. Go to your Supabase project dashboard
2. Navigate to Authentication → Users
3. Click "Add user" and enter an email + password
4. Set the user's app metadata to `{"role":"admin"}`.
5. Use those credentials to sign in at `/admin.html`.

## Deployment (Cloudflare Pages)

This is a static, multi-page Vite site; it does not need a Worker, Wrangler deploy
command, or SPA catch-all rewrite. The repository stores the app in `project/`.

In Cloudflare Pages, connect the `vigneshsounderraj55-ux/regularsbarcafe`
GitHub repository and use:

- Production branch: `master`
- Root directory: `project`
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: `22.12.0` (also pinned in `.nvmrc`)

Add these build environment variables for both Production and Preview:

- `VITE_SUPABASE_URL`: the Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: the public publishable key, or legacy public anon key
- `NODE_VERSION`: `22.12.0`

The build stops with a clear error if either Supabase variable is missing or blank.
Vite embeds `VITE_` variables in browser code. Never use a service-role key,
secret API key, or database password here. Cloudflare Pages assigns a free
`*.pages.dev` address after the first successful deployment.

The site and admin are separate static pages: `/` and `/admin.html`.

## Supabase setup

Apply the SQL files in `supabase/migrations/` in filename order, or run them with
the Supabase CLI. The latest migration restricts all dashboard writes to users
whose trusted Supabase `app_metadata` contains `"role": "admin"`. In the
Supabase dashboard, set that claim for the admin user (Authentication → Users →
user → Edit app metadata), then sign out and back in to refresh the JWT. A
logged-in user without the claim cannot access admin UI or write through RLS.

For production, set the Pages URL as the Supabase Auth Site URL and add any
needed production auth redirect URLs in Supabase Auth → URL Configuration.

For local development, copy `.env.example` to `.env` and use the same two public
variables.

## Project Structure

```
├── index.html              # Main website
├── admin.html              # Admin dashboard
├── package.json
├── vite.config.js
├── public/
│   ├── robots.txt
│   └── sitemap.xml
└── src/
    ├── main.js             # App entry, animations, interactions
    ├── admin.js            # Admin dashboard logic
    ├── supabase.js         # Supabase client + data layer
    └── styles/
        ├── main.css        # Website design system
        └── admin.css       # Admin dashboard styles
```

## Notes

- Menu prices are intentionally left blank — the owner can set them via the admin dashboard.
- Opening hours, phone number, and exact address details can be configured in the admin Contact panel.
- Gallery uses licensed stock photography as placeholders. The owner can replace with genuine café photos via the admin.
- Reviews shown are the genuine customer feedback supplied for the project.

© 2026 Regulars Coffee Bar. All Rights Reserved.
