browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
        console.log("loaded");
        browser.scripting.executeScript({
            target: {tabId: tab.id},
            func: () => {
                magnet = document.querySelector('.btn.btn-primary.detail-download-link.copy-magnet-btn');
                console.log(magnet)
                if (magnet != null) {
                    // magnet page
                    window.wrappedJSObject.handleCopyMagnetLink(magnet);
                    return;
                }

                // search page
                torrents=document.querySelectorAll('.torrent-name-link');
                if (torrents == null) {
                    console.log("not found");
                } else if (torrents.length > 1) {
                    console.log("found more than one");
                } else {
                    window.location.href=torrents[0].href;
                }
            },
            args: []
        });
    }
  });
  
function reloadFields() {
  browser.storage.local.get(['list', 'error', 'output']).then(result => {
    inputField.value = JSON.stringify(result.list);
    if (result.error) {
      errorOutput.value = result.error;
    }
    if (result.output) {
      generalOutput.value = result.output;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const inputField = document.getElementById('inputField');
  const errorOutput = document.getElementById('errorOutput');
  const generalOutput = document.getElementById('generalOutput');
  const sendButton = document.getElementById('sendButton');

  reloadFields(); 

  // Listen for messages from background script
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updatePopup') {
      reloadFields();
    }
  });

  sendButton.addEventListener('click', async () => {
    const inputValue = inputField.value.trim();

    if (!inputValue) {
      logError('Input is empty!');
      return;
    }

    const json = JSON.parse(inputValue);
    browser.storage.local.set({
        list: json,
        error: '',
        output: ''
    });
    reloadFields();
    
    browser.runtime.sendMessage({
      action: "startTraversal",
      content: json
    });
  });
});
