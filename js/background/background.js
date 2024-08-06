chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      chrome.storage.sync.get(['urls'], (result) => {
        const urls = result.urls || [];
        urls.forEach(item => {
          if (tab.url.includes(item.url)) {
            chrome.scripting.insertCSS({
              target: { tabId: tab.id },
              files: ['styles/tab/tab.css']
            }, () => {
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (color) => {
                  document.body.style.backgroundColor = color;
                },
                args: [item.color]
              });
            });
          }
        });
      });
    }
  });
  
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.urls) {
      const updatedUrls = changes.urls.newValue || [];
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          updatedUrls.forEach(item => {
            if (tab.url.includes(item.url)) {
              chrome.scripting.insertCSS({
                target: { tabId: tab.id },
                files: ['styles/tab/tab.css']
              }, () => {
                chrome.scripting.executeScript({
                  target: { tabId: tab.id },
                  func: (color) => {
                    document.body.style.backgroundColor = color;
                  },
                  args: [item.color]
                });
              });
            }
          });
        });
      });
    }
  });
  