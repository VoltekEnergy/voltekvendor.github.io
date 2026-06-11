VOLTEK ENERGY VENDOR — PWA PACKAGE (for PWABuilder)
====================================================
This build uses RELATIVE paths, so it works hosted at a domain root
OR under a subfolder (e.g. GitHub Pages project sites).

GITHUB PAGES (your setup)
-------------------------
1) Replace ALL files in your repo with the contents of this folder
   (keep the .nojekyll file — it matters!), commit, push.
2) Wait ~1 minute for Pages to redeploy.
3) Open your site URL and hard-refresh (Ctrl+F5). You should see the app.
4) Go to https://www.pwabuilder.com and enter your EXACT site URL, e.g.
      https://voltekenergy.github.io/voltekvendor.github.io/
   (include the trailing slash). Name, icons, manifest and service worker
   will now be detected.
5) Package for Stores → Android → download the .aab/.apk.

TIP — CLEANER URL (optional)
----------------------------
Repo named  <org>.github.io  serves at the ROOT:
  - Renaming your repo from "voltekvendor.github.io" to
    "VoltekEnergy.github.io" makes the site https://voltekenergy.github.io/
  - This build works either way.

OTHER HOSTS
-----------
Netlify (drag-drop at app.netlify.com/drop), Vercel, Firebase — all work.
HTTPS is required for the service worker + install prompt.

NOTES
-----
- Same Supabase cloud as the Android app — data stays in sync.
- Web fallbacks active in PWA: camera via picker, browser GPS,
  browser notifications, photo-based QR decode, browser downloads.
- To update the app later: redeploy these files; clients auto-update.
