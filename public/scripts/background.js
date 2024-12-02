let tabId = null;
let windowElement = null;

chrome.commands.onCommand.addListener((command) => {
  if (command === "send-selected-text") {
    // Query the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        tabId = tabs[0].id;
        console.log("Tab ID:", tabId);
        injectContentScript(tabId, send);
      }
    });
  }
});

function injectContentScript(tabId, callback) {
  chrome.scripting.executeScript(
    {
      target: { tabId: tabId },
      files: ["scripts/content-script.js"]
    },
    () => {
      if (chrome.runtime.lastError) {
        console.error("Error injecting content script:", chrome.runtime.lastError.message);
        return;
      }
      callback();
    }
  );
}

function send(prompt) {
  // Send a message to the content script to retrieve the selected text
  chrome.tabs.sendMessage(tabId, { action: "getSelectedText" }, async (response) => {
    if (chrome.runtime.lastError) {
      console.error("Error retrieving selected text:", chrome.runtime.lastError.message);
      return;
    }

    if (response && response.text) {
      if (windowElement && windowElement.id) {
        // Close the Angular application popup if it's already open
        try {
          await chrome.windows.remove(windowElement.id);
          console.log("Window removed successfully");
        } catch (error) {
          console.error("Error removing window:", error);
        }
        windowElement = null;
      }

      // Construct the URL for the Angular application popup
      let popupUrl =
        chrome.runtime.getURL("index.html#/") +
        "?input=" +
        encodeURIComponent(response.text);
      if (prompt) {
        popupUrl += "&prompt=" + encodeURIComponent(prompt);
        popupUrl += "&auto=true";
      }

      // Open the Angular application popup
      try {
        windowElement = await chrome.windows.create({
          url: popupUrl,
          type: "popup",
          width: 600,
          height: 580,
        });
        console.log("Window created with ID:", windowElement.id);
      } catch (error) {
        console.error("Error creating window:", error);
      }
    } else {
      console.error("No response or empty text received.");
    }
  });
}

chrome.runtime.onMessage.addListener((request) => {
  switch (request.action) {
    case "replaceSelectedText":
      chrome.tabs.sendMessage(tabId, { action: "replaceText", text: request.text });
      break;
    case "updatePrompts":
      updatePrompts();
      break;
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  tabId = tab.id;
  console.log("Tab ID:", tabId);
  const prompt = prompts[parseInt(info.menuItemId)];
  injectContentScript(tabId, () => send(prompt));
});

let prompts = [];

function updatePrompts() {
  console.log("Updating prompts...");
  const key = "prompts";
  chrome.contextMenus.removeAll();
  try {
    chrome.storage.local.get(key, (data) => {
      prompts = data[key] || [];
      for (let id = 0; id < prompts.length; id++) {
        chrome.contextMenus.create({
          id: id.toString(),
          title: prompts[id],
          contexts: ["selection"],
        });
      }
    });
  } catch (e) {
    console.error("Error updating prompts:", e);
  }
}

chrome.runtime.onInstalled.addListener(() => {
  updatePrompts();
});
