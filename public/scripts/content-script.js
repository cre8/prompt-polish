// Function to get selected text
function getSelectedText() {
  return window.getSelection().toString();
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSelectedText") {
    const selection = window.getSelection();
    sendResponse({ text: selection.toString() });
  }

  if (request.action === "replaceText") {
    const activeElement = document.activeElement; // Currently focused element
    const replacementText = request.text;

    if (activeElement && (activeElement.tagName === "TEXTAREA" || activeElement.tagName === "INPUT")) {
      // Replace text inside input or textarea
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;

      const originalText = activeElement.value;
      activeElement.value =
        originalText.slice(0, start) +
        replacementText +
        originalText.slice(end);

      // Reset cursor position
      activeElement.selectionStart = activeElement.selectionEnd = start + replacementText.length;

      sendResponse({ success: true });
    } else {
      // Replace text in non-input/textarea context
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents(); // Remove selected text
        range.insertNode(document.createTextNode(replacementText)); // Insert replacement text

        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: "No text selected." });
      }
    }
  }

  return true; // Required for asynchronous sendResponse
});
