
let tabId = null;
let windowElement = null;
chrome.commands.onCommand.addListener((command) => {
  if (command === "send-selected-text") {
    // Query the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        tabId = tabs[0].id;
        // Send a message to the content script to retrieve the selected text
        chrome.tabs.sendMessage(tabId, { action: "getSelectedText" }, async (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error retrieving selected text:", chrome.runtime.lastError.message);
            return;
          }

          if (response && response.text) {
            if(windowElement && windowElement.id) {
              // Close the Angular application popup if it's already open
              chrome.windows.remove(windowElement.id);
              windowElement = null;
            }

            // Construct the URL for the Angular application popup
            const popupUrl =
              chrome.runtime.getURL("index.html#/") +
              "?input=" +
              encodeURIComponent(response.text);

            // Open the Angular application popup
            windowElement = await chrome.windows.create({
              url: popupUrl,
              type: "popup",
              width: 600,
              height: 580,
            });
          } else {
            console.error("No response or empty text received.");
          }
        });
      }
    });
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "replaceSelectedText") {
    chrome.tabs.sendMessage(tabId, { action: "replaceText", text: request.text });
  }
});
