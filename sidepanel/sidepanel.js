// JS logic for the Google Keep Sidebar sidepanel

document.addEventListener('DOMContentLoaded', () => {
  const iframe = document.getElementById('keep-iframe');
  const loadingOverlay = document.getElementById('loading-spinner');
  const btnRefresh = document.getElementById('btn-refresh');
  const btnPopout = document.getElementById('btn-popout');
  const btnTips = document.getElementById('btn-tips');
  const btnCloseTips = document.getElementById('btn-close-tips');
  const tipsPanel = document.getElementById('tips-panel');
  const btnZoomOut = document.getElementById('btn-zoom-out');
  const btnZoomIn = document.getElementById('btn-zoom-in');
  const zoomLabel = document.getElementById('zoom-label');
  const toast = document.getElementById('sidebar-toast');

  let toastTimeout;

  // Zoom management
  const ZOOM_STEPS = [50, 60, 70, 80, 85, 90, 95, 100, 110, 120, 130, 140, 150];
  const ZOOM_STORAGE_KEY = 'keep-sidebar-zoom';
  
  // Default to 85% as Keep is usually very zoomed in on mobile viewports
  let currentZoom = parseInt(localStorage.getItem(ZOOM_STORAGE_KEY)) || 85;

  function updateZoom(zoomVal) {
    currentZoom = zoomVal;
    iframe.style.zoom = `${zoomVal}%`;
    zoomLabel.innerText = `${zoomVal}%`;
    localStorage.setItem(ZOOM_STORAGE_KEY, zoomVal);
  }

  // Initial zoom application
  updateZoom(currentZoom);

  btnZoomOut.addEventListener('click', () => {
    // Find next lower step
    const currentIndex = ZOOM_STEPS.indexOf(currentZoom);
    if (currentIndex > 0) {
      updateZoom(ZOOM_STEPS[currentIndex - 1]);
    } else if (currentIndex === -1) {
      // Find closest lower step
      const lowerSteps = ZOOM_STEPS.filter(step => step < currentZoom);
      if (lowerSteps.length > 0) {
        updateZoom(lowerSteps[lowerSteps.length - 1]);
      }
    }
  });

  btnZoomIn.addEventListener('click', () => {
    // Find next higher step
    const currentIndex = ZOOM_STEPS.indexOf(currentZoom);
    if (currentIndex !== -1 && currentIndex < ZOOM_STEPS.length - 1) {
      updateZoom(ZOOM_STEPS[currentIndex + 1]);
    } else if (currentIndex === -1) {
      // Find closest higher step
      const higherSteps = ZOOM_STEPS.filter(step => step > currentZoom);
      if (higherSteps.length > 0) {
        updateZoom(higherSteps[0]);
      }
    }
  });

  // 1. Hide spinner once iframe loaded
  iframe.addEventListener('load', () => {
    loadingOverlay.classList.add('fade-out');
  });

  // 2. Control Button Handlers
  
  // Refresh iframe
  btnRefresh.addEventListener('click', () => {
    loadingOverlay.classList.remove('fade-out');
    // Reloading iframe by setting its source
    iframe.src = iframe.src;
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
      // Backup copy in the extension context
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
      // Show toast reminder
      showToast('Text Ready to Paste!', 'Paste the captured text into your Keep note.');
      // Clear the session storage so it doesn't prompt again on every reopen
      chrome.storage.session.remove('lastCopiedText');
    }
  });
});
