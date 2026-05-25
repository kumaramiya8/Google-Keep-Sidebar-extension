// Dynamic script to override and clean up the Google Keep mobile interface

(function() {
  // Helper to dynamically style interactive elements in the top header
  function styleHeader() {
    const header = document.querySelector('header') || document.querySelector('div[role="banner"]');
    if (!header) return;

    // Find all buttons, links, and divs inside the header
    const elements = Array.from(header.querySelectorAll('button, a, div[role="button"], div[role="image"]'));
    
    elements.forEach((el, index) => {
      const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase();
      const href = (el.getAttribute('href') || '').toLowerCase();
      const role = (el.getAttribute('role') || '').toLowerCase();

      // 1. Keep Hamburger Menu Button
      if (ariaLabel.includes('menu') || ariaLabel.includes('main menu') || (index === 0 && role === 'button')) {
        el.classList.add('keep-sidebar-menu-btn');
        return;
      }

      // 2. Hide User Profile Avatar (save space)
      if (href.includes('accounts.google.com') || ariaLabel.includes('google account') || ariaLabel.includes('profile')) {
        el.style.setProperty('display', 'none', 'important');
        return;
      }

      // 3. Hide Keep Logo/Title
      if (href.includes('keep.google.com') || el.textContent.includes('Keep')) {
        el.style.setProperty('display', 'none', 'important');
        return;
      }

      // 4. Also hide text containers next to hamburger (Google logo/Keep title)
      if (el.tagName === 'SPAN' || (el.tagName === 'DIV' && el.textContent.includes('Keep'))) {
        el.style.setProperty('display', 'none', 'important');
        return;
      }
    });

    // Style sibling text containers/images of the hamburger button to be hidden
    const menuBtn = header.querySelector('.keep-sidebar-menu-btn');
    if (menuBtn) {
      let sibling = menuBtn.nextElementSibling;
      while (sibling) {
        // If it's a title, branding text, or logo container, hide it
        if (!sibling.querySelector('input') && !sibling.querySelector('button') && 
            !sibling.getAttribute('aria-label')?.toLowerCase().includes('search') &&
            !sibling.getAttribute('aria-label')?.toLowerCase().includes('view')) {
          sibling.style.setProperty('display', 'none', 'important');
        }
        sibling = sibling.nextElementSibling;
      }
    }
  }

  // Helper to hide "Get the Keep app" installer banners or mobile promos
  function hidePromos() {
    const selectors = [
      'div[role="dialog"]',
      'div[style*="position: fixed;"]',
      'div[style*="position:fixed;"]'
    ];

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        const text = (el.textContent || '');
        if (text.includes('Get the Keep app') || 
            text.includes('Get the app') || 
            text.includes('Open in the Keep app') || 
            text.includes('Install Google Keep') ||
            el.querySelector('a[href*="play.google.com"]') ||
            el.querySelector('a[href*="itunes.apple.com"]')) {
          el.style.setProperty('display', 'none', 'important');
        }
      });
    });
  }

  // Detect and notify background color of Keep to the extension parent
  let lastColor = '';
  function syncBackgroundColor() {
    const bgColor = window.getComputedStyle(document.body).backgroundColor;
    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== lastColor) {
      lastColor = bgColor;
      chrome.runtime.sendMessage({ type: 'KEEP_BG_COLOR', color: bgColor });
    }
  }

  // Setup observer and runtime loop
  function initialize() {
    styleHeader();
    hidePromos();
    syncBackgroundColor();

    // Observe changes to style headers dynamically as the Single Page Application loads views
    const observer = new MutationObserver(() => {
      styleHeader();
      hidePromos();
      syncBackgroundColor();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    // Periodic safety check in case mutations don't capture everything
    setInterval(() => {
      styleHeader();
      hidePromos();
      syncBackgroundColor();
    }, 1500);
  }

  // Start script on load
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initialize();
  } else {
    window.addEventListener('DOMContentLoaded', initialize);
  }
})();
