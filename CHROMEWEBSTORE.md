# Chrome Web Store Listing — Google Keep Sidebar

> Last Updated: 2026-05-22

## Store Listing

**Extension Name**
Google Keep Sidebar

**Short Description**
Brings Google Keep as a native side panel on any website, enabling quick capture and easy notes management.

**Detailed Description**
Access Google Keep alongside any webpage with a native side panel to organize thoughts, snap notes, and drag-and-drop text as you browse.

Google Keep Sidebar integrates your notes into a side-by-side view, so you never have to switch tabs to capture thoughts, list tasks, or write down recipes. Simply click the extension icon or press Alt+Shift+K to toggle the sidebar.

Features:
- Access Google Keep alongside your browsing window in a native Chrome Side Panel.
- Highlight text on any website, right-click, and choose "Send to Google Keep" to copy it instantly.
- Drag-and-drop text natively from any website directly into the Google Keep note editor.
- Minimalist, premium UI container with light and dark mode support matching your system preferences.
- Quick refresh, pop-out to full screen, and on-screen toast confirmations.

How to use it:
1. Click the extension icon in your toolbar, or press Alt+Shift+K to open the Google Keep side panel.
2. Select any text on a webpage, right-click, and select "Send to Google Keep" to copy it.
3. Click inside Keep and press Cmd+V (Ctrl+V on Windows) to paste it into a note.
4. Drag text directly into your Keep note editor for a seamless flow.
5. If you see a login screen, click the "Open in new tab" icon to sign in to Google, then click "Refresh" in the sidebar.

Privacy & Permissions:
This extension respects your privacy. All notes remain private between you and Google Keep. No data is stored, collected, or transmitted by the developer.

Support & Feedback:
For questions or issues, please visit our GitHub support page or contact us at developer@example.com.

**Category**
Productivity

**Single Purpose**
Integrates Google Keep as a native side panel in the browser.

**Primary Language**
English

## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon | 128×128 PNG | ✅ Ready (SVG) | `icons/icon-128.svg` |
| Screenshot 1 | 1280×800 or 640×400 | ⬜ Not created | |
| Screenshot 2 | 1280×800 or 640×400 | ⬜ Not created | |
| Small Promo Tile | 440×280 | ⬜ Not created | |

### Screenshot Notes
- **Screenshot 1**: Showing a web page (e.g. Wikipedia) on the left and the Google Keep side panel open on the right, displaying notes.
- **Screenshot 2**: Showing the text selection and right-click context menu "Send to Google Keep" option.
- **Screenshot 3**: Showing the toast notification confirming text was sent.

## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| `sidePanel` | permissions | Required to host the Google Keep web application in the browser's native side panel. |
| `declarativeNetRequest` | permissions | Required to strip the `X-Frame-Options` and `Content-Security-Policy` headers from `keep.google.com` response traffic, enabling it to be rendered in an iframe inside the side panel. |
| `contextMenus` | permissions | Required to create the "Send to Google Keep" context menu item when selecting text. |
| `activeTab` | permissions | Temporarily grants tab access when the user clicks the context menu to copy the selection and display the confirmation toast. |
| `scripting` | permissions | Required to execute the clipboard copy script and toast overlay inside the active tab. |
| `*://*.keep.google.com/*` | host_permissions | Allows header modification (via declarativeNetRequest) specifically for Google Keep requests. |
| `*://keep.google.com/*` | host_permissions | Allows header modification (via declarativeNetRequest) specifically for Google Keep requests. |

## Privacy & Data Use

### Data Collection

**Does the extension collect user data?** No

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes

## Privacy Policy

**Privacy Policy URL**
https://github.com/developer/keep-sidebar-extension/blob/main/PRIVACY.md

## Distribution

**Visibility**: Public
**Regions**: All regions
**Pricing**: Free

## Developer Info

**Publisher Name**
Google Keep Sidebar Developer

**Contact Email**
developer@example.com

**Support URL / Email**
https://github.com/developer/keep-sidebar-extension/issues

**Homepage URL**
https://github.com/developer/keep-sidebar-extension

## Version History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 1.0.0 | 2026-05-22 | Initial release featuring side panel integration, context menu capture, and keyboard command toggle. | Draft |

## Review Notes

### Known Issues / Limitations
- If a user is not logged into Google Keep, they will see a sign-in screen. Since the sign-in screen cannot be embedded due to accounts.google.com security policies, they must open a normal tab to log in, and then refresh the sidebar. A help indicator is provided for this.

---

## Chrome Web Store Developer Console - Privacy Practices copy-paste justifications

Below are the exact text blocks you can copy and paste into the **Privacy practices** tab in the Chrome Web Store developer console to resolve all the warnings:

### 1. Single Purpose Description
**Field:** *Single purpose description*
> Integrates Google Keep as a native side panel in the browser, allowing users to view, manage, and capture notes alongside their active browsing tab.

### 2. Permission Justifications
**Field:** *Justification for permissions*

* **`sidePanel` Justification:**
  > Required to render the Google Keep interface in a persistent side panel layout next to the active webpage for side-by-side multitasking.

* **`declarativeNetRequest` Justification:**
  > Required to strip CSP and X-Frame-Options response headers from keep.google.com, which allows it to be embedded inside the extension's side panel iframe.

* **`contextMenus` Justification:**
  > Required to add the 'Send to Google Keep' option to the browser's right-click context menu when selecting text on a webpage.

* **`activeTab` Justification:**
  > Required to temporarily access the active webpage context when the user clicks the context menu, in order to programmatically copy selected text and display a confirmation toast.

* **`scripting` Justification:**
  > Required to inject and run the clipboard-copy helper and show the feedback toast on the active tab when the context menu action is triggered.

* **`storage` Justification:**
  > Required to temporarily store selection text in session storage so it can be passed from the background service worker to the side panel script when it opens.

### 3. Host Permission Justification
**Field:** *Justification for host permissions* (for `*://*.keep.google.com/*` and `*://keep.google.com/*`)
> Required to modify network headers specifically for Google Keep requests via declarativeNetRequest to enable iframe embedding, and to set the mobile User-Agent for mobile page rendering.

### 4. Remote Code Justification
**Question:** *Does your extension use remote code?*
- Select **No, this extension does not use remote code** (or similar option).
- If a text box is provided for justification, paste:
  > The extension is fully self-contained. All styling, script files, and logic are bundled and packaged locally within the extension directory. No external libraries or remote scripts are loaded at runtime.

### 5. Data Usage Compliance
- In the **Data usage** section, check the box confirming that you certify that your data usage complies with Developer Program Policies.
- Declare that you are **not** collecting any user data (select "No" to data collection).
