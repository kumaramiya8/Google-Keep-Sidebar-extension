// inject/keep-main-world.js
// This script runs in the page's MAIN world context to officially override navigator properties,
// bypassing CSP and Trusted Types restrictions which block standard inline script injection.

(function() {
  // Simple and bulletproof check: if we are in an iframe, we are inside the extension sidebar
  let isInsideExtension = false;
  try {
    isInsideExtension = window.top !== window.self;
  } catch (e) {
    isInsideExtension = true; // Cross-origin error means it is in the iframe
  }

  // If we are not inside the extension side panel iframe, do not override anything!
  if (!isInsideExtension) {
    return;
  }

  const mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1';
  
  try {
    // Override navigator.userAgent
    Object.defineProperty(navigator, 'userAgent', {
      get: () => mobileUA,
      configurable: true
    });
    
    // Override navigator.userAgentData if present
    if (navigator.userAgentData) {
      Object.defineProperty(navigator, 'userAgentData', {
        get: () => ({
          brands: [],
          mobile: true,
          platform: 'iOS',
          getHighEntropyValues: (hints) => Promise.resolve({
            platform: 'iOS',
            platformVersion: '16.6',
            architecture: '',
            model: 'iPhone',
            uaFullVersion: '16.6'
          })
        }),
        configurable: true
      });
    }

    // Override navigator.platform
    Object.defineProperty(navigator, 'platform', {
      get: () => 'iPhone',
      configurable: true
    });
    
    // Override navigator.maxTouchPoints to emulate touch capability
    Object.defineProperty(navigator, 'maxTouchPoints', {
      get: () => 5,
      configurable: true
    });

    // Override navigator.vendor for iOS Safari
    Object.defineProperty(navigator, 'vendor', {
      get: () => 'Apple Computer, Inc.',
      configurable: true
    });

    // Emulate touch support in window
    if (!('ontouchstart' in window)) {
      try {
        Object.defineProperty(window, 'ontouchstart', {
          value: null,
          writable: true,
          configurable: true
        });
      } catch (err) {}
    }
    
    console.log('Keep Sidebar: Spoofed mobile iPhone user agent & touch support in main world officially');


  } catch (e) {
    console.error('Keep Sidebar: Failed to spoof user agent in main world', e);
  }
})();
