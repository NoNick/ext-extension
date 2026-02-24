// Service worker for background tasks
MAX_RETRIES = 3
TIMEOUT_SEARCH_SEC = 30
TIMEOUT_GRAB_MAGNET_SEC = 5

isError = true
currentFilename = ''

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function performSearch(filename) {
    currentFilename = filename

    searchUrl = 'https://ext.to/browse/?with_adult=1&contain_in=1&q='+encodeURIComponent(filename);

    browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
        browser.scripting.executeScript({
          target: {tabId: tabs[0].id},
          func: (url) => {
              window.location.href=url
          },
          args: [searchUrl]
      });
    });

   await sleep(TIMEOUT_SEARCH_SEC * 1000)

   isError = true;
   browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
       browser.scripting.executeScript({
           target: {tabId: tabs[0].id},
           func: () => {
               const div = document.querySelector('.magnet-result-ext-extension');
               if (div) {
                   browser.runtime.sendMessage({
                       action: "receiveMagnet",
                       content: div.textContent
                   });
               }
           }
       })
   });

   await sleep(TIMEOUT_GRAB_MAGNET_SEC * 1000)

   return isError;
}

async function traverse(json) {
    for (i = 0; i < json.items.length; i++) {
        bytes = json.items[i].size_bytes;
        filename = json.items[i].file;
        console.log(filename);
        isError = true;
        for (j = 0; j < MAX_RETRIES; j++) {
            isError = await performSearch(filename);
            if (!isError) {
                break;
            }
        }
        if (isError) {
            await showError();
            // todo print error in popup.js
        }
    }
}

async function showMagnet(magnet) {
    result = await browser.storage.local.get(['list', 'output']);
    
    console.log(magnet);
    browser.storage.local.set({
        output: result.output + magnet + '\n',
    });
    
//    browser.runtime.sendMessage({
//      action: "updatePopup"
//    });
}

async function showError() {
    result = await browser.storage.local.get(['error']);
    
    browser.storage.local.set({
        error: result.error + currentFilename + '\n',
    });
    
//    browser.runtime.sendMessage({
//      action: "updatePopup"
//    });
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received:', message);

  if (message.action === 'startTraversal') {
    traverse(message.content);
  } else if (message.action == 'receiveMagnet') {
    isError = false;
    showMagnet(message.content);
  } else if (message.action == 'magnetFailed') {
    isError = true;
    showError();
  }

  // Keep the message channel open for async responses
  return true;
});



// Optional: Log when extension loads
console.log('Background script loaded');
