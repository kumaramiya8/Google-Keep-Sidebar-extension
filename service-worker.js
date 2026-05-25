// Service Worker for Google Keep Sidebar

// Initialize on extension installation
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu for text selection
  chrome.contextMenus.create({
    id: "send-to-keep",
    title: "Send to Google Keep",
    contexts: ["selection"]
  });
});

// Handle keyboard shortcuts (commands)
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "open-keep-sidebar") {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        await chrome.sidePanel.open({ windowId: tab.windowId });
      }
    } catch (error) {
      console.error("Error opening side panel via command:", error);
    }
  }
});


// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "send-to-keep" && tab && tab.id) {
    const selectedText = info.selectionText;
    if (!selectedText) return;

    try {
      // 1. Ensure the side panel is opened
      await chrome.sidePanel.open({ windowId: tab.windowId });

      // 2. Save the copied text in session storage so the side panel can access it
      await chrome.storage.session.set({ lastCopiedText: selectedText });

      // 3. Inject the clipboard copy and custom toast UI onto the active webpage
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: copyAndShowToastOnWebpage,
        args: [selectedText]
      });

      // 4. Notify the side panel if it's already open
      chrome.runtime.sendMessage({
        type: "TEXT_COPIED",
        text: selectedText
      }).catch(() => {
        // Suppress errors when the sidepanel is not open yet
      });

    } catch (error) {
      console.error("Error executing context menu action:", error);
    }
  }
});

// Function to copy text to clipboard and show a beautiful toast in the target tab context
function copyAndShowToastOnWebpage(text) {
  // Create a temporary input element to execute the copy command
  const textarea = document.createElement('textarea');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.width = '2em';
  textarea.style.height = '2em';
  textarea.style.padding = '0';
  textarea.style.border = 'none';
  textarea.style.outline = 'none';
  textarea.style.boxShadow = 'none';
  textarea.style.background = 'transparent';
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  let copySuccessful = false;
  try {
    copySuccessful = document.execCommand('copy');
  } catch (err) {
    console.error('Keep Sidebar: copy failed', err);
  }
  document.body.removeChild(textarea);

  if (!copySuccessful) return;

  // Create toast elements
  const toastId = 'keep-sidebar-toast-container';
  let toastContainer = document.getElementById(toastId);
  
  if (toastContainer) {
    toastContainer.remove(); // Remove previous to prevent overlaps
  }

  toastContainer = document.createElement('div');
  toastContainer.id = toastId;

  // Apply beautiful styles inline to isolate from page CSS
  toastContainer.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: rgba(33, 33, 33, 0.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: #ffffff;
    padding: 14px 20px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.15);
    z-index: 2147483647; /* Maximum possible z-index */
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    transform: translateY(30px) scale(0.95);
    opacity: 0;
    pointer-events: none;
    transition: all 0.35s cubic-bezier(0.19, 1, 0.22, 1);
  `;

  // Create SVG Lightbulb Icon (Google Keep Branding style)
  const iconDiv = document.createElement('div');
  iconDiv.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fbf0b5;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    box-shadow: 0 2px 6px rgba(251, 240, 181, 0.3);
  `;
  iconDiv.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 21H15C15 21.55 14.55 22 14 22H10C9.45 22 9 21.55 9 21ZM12 2C7.58 2 4 5.58 4 10C4 12.82 5.46 15.3 7.68 16.74C8.48 17.26 9 18.15 9 19H15C15 18.15 15.52 17.26 16.32 16.74C18.54 15.3 20 12.82 20 10C20 5.58 16.42 2 12 2Z" fill="#ffb300"/>
    </svg>
  `;

  const contentDiv = document.createElement('div');
  contentDiv.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 2px;
  `;

  const titleSpan = document.createElement('span');
  titleSpan.innerText = 'Copied to Keep Sidebar';
  titleSpan.style.cssText = `
    font-weight: 600;
    color: #ffffff;
  `;

  const messageSpan = document.createElement('span');
  messageSpan.innerText = 'Click inside Google Keep and press Cmd+V to paste.';
  messageSpan.style.cssText = `
    font-size: 11px;
    color: #b0b0b0;
  `;

  contentDiv.appendChild(titleSpan);
  contentDiv.appendChild(messageSpan);
  
  toastContainer.appendChild(iconDiv);
  toastContainer.appendChild(contentDiv);
  document.body.appendChild(toastContainer);

  // Trigger enter animation
  requestAnimationFrame(() => {
    toastContainer.style.transform = 'translateY(0) scale(1)';
    toastContainer.style.opacity = '1';
  });

  // Automatically dismiss after 4 seconds
  setTimeout(() => {
    if (toastContainer && toastContainer.parentNode) {
      toastContainer.style.transform = 'translateY(20px) scale(0.95)';
      toastContainer.style.opacity = '0';
      setTimeout(() => {
        if (toastContainer.parentNode) {
          toastContainer.remove();
        }
      }, 350);
    }
  }, 4000);
}
