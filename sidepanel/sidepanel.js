// JS logic for the Google Keep Sidebar sidepanel

document.addEventListener('DOMContentLoaded', () => {
  const iframe = document.getElementById('keep-iframe');
  const loadingOverlay = document.getElementById('loading-spinner');
  const btnRefresh = document.getElementById('btn-refresh');
  const btnPopout = document.getElementById('btn-popout');
  const btnTips = document.getElementById('btn-tips');
  const btnCloseTips = document.getElementById('btn-close-tips');
  const tipsPanel = document.getElementById('tips-panel');
  const toast = document.getElementById('sidebar-toast');
  let toastTimeout;

  // Zoom management
  const ZOOM_STORAGE_KEY = 'keep-sidebar-zoom';
  
  function applyZoom(zoomVal) {
    iframe.style.zoom = `${zoomVal}%`;
  }

  // Load and apply initial zoom (default to 75%)
  chrome.storage.local.get(ZOOM_STORAGE_KEY).then((result) => {
    const savedZoom = result[ZOOM_STORAGE_KEY] || 75;
    applyZoom(savedZoom);
  });

  // Listen for zoom changes from the extension popup
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes[ZOOM_STORAGE_KEY]) {
      const newZoom = changes[ZOOM_STORAGE_KEY].newValue;
      if (newZoom !== undefined) {
        applyZoom(newZoom);
      }
    }
  });

  // 1. Hide spinner once iframe loaded
  iframe.addEventListener('load', () => {
    loadingOverlay.classList.add('fade-out');
  });

  // Start loading the iframe dynamically to avoid DOM load race conditions
  iframe.src = "https://keep.google.com/u/0/";

  // 2. Control Button Handlers
  
  // Refresh iframe
  btnRefresh.addEventListener('click', () => {
    loadingOverlay.classList.remove('fade-out');
    iframe.src = "https://keep.google.com/u/0/";
  });

  // Open Keep in new tab (useful for full page and Google login flow)
  btnPopout.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://keep.google.com/' });
  });

  // Toggle Tips Slide-Over
  btnTips.addEventListener('click', () => {
    tipsPanel.classList.toggle('hidden');
  });

  // Close Tips
  btnCloseTips.addEventListener('click', () => {
    tipsPanel.classList.add('hidden');
  });

  // 3. Show Toast Feedback
  function showToast(title, message) {
    if (toastTimeout) clearTimeout(toastTimeout);
    
    const toastTitle = toast.querySelector('.toast-title');
    const toastMsg = toast.querySelector('.toast-message');
    
    toastTitle.innerText = title;
    toastMsg.innerText = message;
    
    toast.classList.remove('hidden');

    toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 4500);
  }

  // 4. Listen for text selection messages from service worker
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'TEXT_COPIED' && message.text) {
      navigator.clipboard.writeText(message.text)
        .then(() => {
          showToast('Text Copied!', 'Select a Keep note and paste (Cmd+V).');
        })
        .catch((err) => {
          console.warn('Extension context clipboard write skipped, host tab already wrote to clipboard.', err);
          showToast('Text Copied!', 'Select a Keep note and paste (Cmd+V).');
        });
    }
  });

  // 5. Check if there was any text copied recently before opening the sidepanel
  chrome.storage.session.get('lastCopiedText').then((result) => {
    if (result.lastCopiedText) {
      showToast('Text Ready to Paste!', 'Paste the captured text into your Keep note.');
      chrome.storage.session.remove('lastCopiedText');
    }
  });
});
