# Mage Sight — iOS PWA bundle

This folder is a complete, installable Progressive Web App version of Mage Sight.
Once hosted over HTTPS, iPhone/iPad users can add it to their Home Screen from
Safari and run it like a native app, fully offline.

## Files
- `index.html` — the app, wired for PWA install + offline
- `manifest.webmanifest` — app metadata (name, icons, colors, standalone display)
- `service-worker.js` — caches the app for offline use
- `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` — app icons
- `apple-touch-icon.png` — iOS Home Screen icon (180×180)
- `Mage-Sight-iOS-Install-Instructions.png` — share this with end users

## How to host (free option)
A PWA must be served over **HTTPS**. The simplest free path is **GitHub Pages**,
which you already use for the privacy policy:

1. Create (or reuse) a GitHub repo and upload **all files in this folder** to it,
   keeping them together at the same path (e.g. the repo root).
2. In the repo: **Settings → Pages → Deploy from branch → main → /(root)**.
3. After it deploys, your install URL is the Pages URL, e.g.
   `https://<your-user>.github.io/<repo>/` (it serves `index.html`).
4. Open that URL on an iPhone/iPad **in Safari** and follow the install steps
   in `Mage-Sight-iOS-Install-Instructions.png`.

All files must live at the **same origin/path** so the service worker and icons
resolve correctly (paths are relative).

## Notes
- **Offline:** the entire app is self-contained in `index.html`, so once the
  service worker precaches it (on first load) the app runs fully offline. The app
  also requests **persistent storage** on launch, which (when granted) exempts the
  cache from automatic eviction — giving the longest possible offline life between
  connections. In the rare case iOS still evicts after a very long idle period, the
  next launch with any connection silently re-caches it.
- **Fonts / privacy:** all fonts (IBM Plex Sans, IBM Plex Mono, Bebas Neue) are
  embedded directly in `index.html` as base64. The app makes **zero external/auto
  network requests** — nothing loads from Google or any CDN. The only outbound
  connections are the optional, user-tapped Ko-fi and privacy-policy links.
- **Updates:** to publish a new version, replace the files and bump `CACHE_VERSION`
  in `service-worker.js` so installed users pick up the change.
