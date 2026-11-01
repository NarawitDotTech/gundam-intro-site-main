# Gundam intro site

Personal site for Narawit "Gundam" Aunsaen, built with Next.js and deployed to Cloudflare Workers.
The design system is described in `DESIGN.md`.

## Run locally

```bash
npm install
echo "ADMIN_PASSCODE=choose-a-passcode" > .env.local
npm run dev
```

The site runs at http://localhost:3000 and the editor at http://localhost:3000/admin.
Locally, projects are saved to `data/projects.json`.

## Cloudflare setup (one time)

The admin editor needs two things on the Worker `gundam-intro-site-main`:

1. **Passcode secret.** Workers → gundam-intro-site-main → Settings → Variables and Secrets →
   add a **Secret** named `ADMIN_PASSCODE`.
2. **Storage.** Storage & Databases → KV → create a namespace (for example `gundam-projects`).
   Then Workers → gundam-intro-site-main → Settings → Bindings → add a **KV namespace** binding
   with the variable name `PROJECTS` pointing to it.

Without the binding, the site still shows the projects from `data/projects.json`,
but saving in the admin editor shows a message explaining what's missing.
