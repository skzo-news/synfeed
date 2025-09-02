# SynFeed — branded build with auto-update (Electron + React + Tailwind)

A dark, cyber‑noir desktop app for Tech/AI/Sec feeds with in‑app video and a local, explainable bias meter. This build adds **auto‑updates** via GitHub Releases using `electron-updater`.

## Quick start (local)
```bash
npm install
npm run dev
# later
npm run build
```

## Auto-update (GitHub Releases)
1. In `package.json > build.publish[0]`, set your **owner** and **repo**.
2. Push this repo to GitHub and add a repo secret **GH_TOKEN** (classic token with `repo` scope).
3. Create a tag like `v0.2.0` and push it. The workflow builds installers and drafts a release.
4. Users who run SynFeed will auto‑check for updates at startup; when a new release is published, they’ll be prompted to install.

## Icons/Branding
- Put your icons in `buildResources/` (e.g., `icon.png` ≥512×512). For best results, include `icon.ico` (Windows) and `icon.icns` (macOS).

## Notes
- Renderer has Node disabled; safe preload bridge; external links open in browser; CSP applied.
- Feeds are plain RSS/Atom—no API keys required.
