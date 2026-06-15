VOLTEK ENERGY VENDOR — PWA PACKAGE (for PWABuilder / GitHub Pages)
==================================================================
Relative paths — works at a domain root OR a subfolder (GitHub Pages project sites).
This build includes the Phase-1 refactor (generic photo handlers + centralized
constants); behavior is identical to the previous build, verified by unit tests.

GITHUB PAGES
------------
1) Replace ALL files in your repo with the contents of this folder (keep .nojekyll), push.
2) Wait ~1 min, open your site, hard-refresh (Ctrl+F5).
3) PWABuilder: enter your exact URL incl. trailing slash, e.g.
   https://voltekenergy.github.io/voltekvendor.github.io/
4) Package for Stores → Android.

OTHER HOSTS: Netlify (app.netlify.com/drop), Vercel, Firebase. HTTPS required.
Same Supabase cloud as the Android app — data stays in sync.
