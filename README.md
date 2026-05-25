# Google Keep Sidebar Chrome Extension

A premium, modern Manifest V3 Chrome Extension that brings Google Keep as a native side panel on any website. Organize thoughts, capture selections, and manage your notes side-by-side as you browse.

---

## Key Features

- 📱 **Native Sidebar Panel**: Renders Google Keep as a native side panel next to any open tab (`chrome.sidePanel`) for seamless side-by-side multitasking.
- 🎨 **Sleek Custom Redesign**: Relocates extension controls to a bottom glassmorphic status footer, putting Google Keep's native search and navigation at the top where they belong—preventing header clutter.
- 🚀 **DOM Cleanup & Style Injection**: Dynamically hides Google branding/logos, account profiles, and app installer promos while resizing margins and note cards to fit perfectly in a narrow view.
- 🎨 **Theme Background Auto-Sync**: Monitors and automatically synchronizes the background and footer colors of the side panel to Google Keep's active theme (light or dark mode) for a unified UI.
- 🔍 **Dynamic Zoom Controller**: Adjust the scale of Google Keep from **50% to 150%** (defaults to a comfortable **85%** to fit mobile layouts perfectly on desktop monitors). Your preference is saved automatically via `localStorage`.
- 📋 **Quick Note Capture**: Select text on any webpage, right-click, and select **"Send to Google Keep"** to copy it instantly. A toast notification slides in on the page to confirm the capture.
- 🖱️ **Drag-and-Drop support**: Select text on any webpage and drag it directly into your Keep notes.
- 🌗 **System Theme Sync**: The footer container uses modern glassmorphism styling and syncs automatically with system and application light or dark mode preferences.
- ⌨️ **Keyboard Shortcut**: Press **`Alt+Shift+K`** (or `Option+Shift+K` on macOS) to toggle the sidebar open instantly.

---

## Directory Structure

```bash
keep-sidebar-extension/
├── manifest.json         # Extension Manifest V3 configuration and permissions
├── rules.json            # declarativeNetRequest rules for framing & User-Agent spoofing
├── service-worker.js     # Background worker handling commands, menus, and scripting
├── generate_icons.py     # Python script to generate PNG assets
├── CHROMEWEBSTORE.md     # Store listing metadata and copy-paste justifications
├── .gitignore            # Git exclusion rules
├── icons/                # Extension toolbar and store logo assets
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
├── inject/               # Google Keep iframe styling & script injections
│   ├── keep-override.css
│   └── keep-override.js
└── sidepanel/            # Sidebar UI components
    ├── sidepanel.html
    ├── sidepanel.css
    └── sidepanel.js
```

---

## Installation Instructions

To load and use this extension in Google Chrome locally:

1. Open **Google Chrome** on your computer.
2. Navigate to the extensions page by typing **`chrome://extensions/`** in the address bar.
3. In the top-right corner, toggle the **Developer mode** switch to **ON**.
4. Click the **Load unpacked** button in the top-left.
5. Select the project directory:
   `/Users/kumaramiya/.gemini/antigravity/scratch/keep-sidebar-extension`
6. The extension is now installed! Pin it to your Chrome toolbar for easy access.

---

## Usage Guide

### 1. Opening the Sidebar
- Click the Google Keep icon in your Chrome toolbar.
- Or use the keyboard shortcut: **`Alt+Shift+K`** (or `Option+Shift+K` on Mac).

### 2. Signing In (First Time Setup)
Google Accounts (`accounts.google.com`) enforces strict security policies to prevent framing. If you are not signed in:
1. Click the **Popout** button (square with arrow) in the sidebar header to open Google Keep in a new browser tab.
2. Sign in to your Google Account there.
3. Return to your active tab and click the **Refresh** button (rotating arrow) in the sidebar header. Google Keep will load your notes instantly!

### 3. Capture & Easy Paste
- Select text on any webpage -> Right-click -> select **"Send to Google Keep"**.
- A notification will confirm that the text was copied.
- Click inside your Google Keep sidebar and press **`Cmd+V`** (or `Ctrl+V` on Windows) to paste the captured text.

---

## Security & Privacy
- **Self-Contained**: The extension is completely self-contained, using zero remote script files (complying with the Chrome Web Store Developer Program Policies).
- **Data Protection**: All notes remain private between your browser and Google Keep's secure servers. No user data is collected, stored, or transmitted by the developer.

---

## Contributors

- **Kumar Amiya** ([@kumaramiya8](https://github.com/kumaramiya8))
