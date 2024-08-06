chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      chrome.storage.sync.get(['urls'], (result) => {
        const urls = result.urls || [];
        for (const item of urls) {
          if (tab.url.startsWith(item.url)) {
            chrome.scripting.insertCSS({
              target: { tabId: tab.id },
              css: `body { background-color: ${item.color} !important; }`
            });
            break;
          }
        }
      });
    }
  });
  
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.urls) {
      const updatedUrls = changes.urls.newValue || [];
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          for (const item of updatedUrls) {
            if (tab.url.startsWith(item.url)) {
              chrome.scripting.insertCSS({
                target: { tabId: tab.id },
                css: `body { background-color: ${item.color} !important; }`
              });
              break;
            }
          }
        });
      });
    }
  });
  