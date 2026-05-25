// popup.js - JS logic for the Google Keep Sidebar Settings popup

document.addEventListener('DOMContentLoaded', () => {
  const btnZoomOut = document.getElementById('btn-zoom-out');
  const btnZoomIn = document.getElementById('btn-zoom-in');
  const zoomLabel = document.getElementById('zoom-label');
  const btnOpenSidebar = document.getElementById('btn-open-sidebar');

  const ZOOM_STEPS = [50, 60, 70, 75, 80, 85, 90, 95, 100, 110, 120, 130, 140, 150];
  const ZOOM_STORAGE_KEY = 'keep-sidebar-zoom';
  let currentZoom = 75;

  // 1. Fetch current zoom from storage (default to 75%)
  chrome.storage.local.get(ZOOM_STORAGE_KEY).then((result) => {
    currentZoom = result[ZOOM_STORAGE_KEY] || 75;
    updateZoomUI(currentZoom);
  });

  function updateZoomUI(zoomVal) {
    zoomLabel.innerText = `${zoomVal}%`;
  }

  function saveZoom(zoomVal) {
    currentZoom = zoomVal;
    updateZoomUI(zoomVal);
    chrome.storage.local.set({ [ZOOM_STORAGE_KEY]: zoomVal });
  }

  // 2. Zoom Button Listeners
  btnZoomOut.addEventListener('click', () => {
    const currentIndex = ZOOM_STEPS.indexOf(currentZoom);
    if (currentIndex > 0) {
      saveZoom(ZOOM_STEPS[currentIndex - 1]);
    } else if (currentIndex === -1) {
      const lowerSteps = ZOOM_STEPS.filter(step => step < currentZoom);
      if (lowerSteps.length > 0) {
        saveZoom(lowerSteps[lowerSteps.length - 1]);
      }
    }
  });

  btnZoomIn.addEventListener('click', () => {
    const currentIndex = ZOOM_STEPS.indexOf(currentZoom);
    if (currentIndex !== -1 && currentIndex < ZOOM_STEPS.length - 1) {
      saveZoom(ZOOM_STEPS[currentIndex + 1]);
    } else if (currentIndex === -1) {
      const higherSteps = ZOOM_STEPS.filter(step => step > currentZoom);
      if (higherSteps.length > 0) {
        saveZoom(higherSteps[0]);
      }
    }
  });

  // 3. Open Sidebar Action
  btnOpenSidebar.addEventListener('click', async () => {
    try {
      const currentWindow = await chrome.windows.getCurrent();
      if (currentWindow && currentWindow.id) {
        await chrome.sidePanel.open({ windowId: currentWindow.id });
        // Close the popup after triggering the sidebar
        window.close();
      }
    } catch (error) {
      console.error("Error opening side panel from popup:", error);
    }
  });
});
