// background.ts

chrome.action.onClicked.addListener(async (tab) => {
  // Only inject the content script if the browser action has been clicked
  if (tab?.id) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    fetch("https://us-central1-quack-46516.cloudfunctions.net/analyzeText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: message,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        sendResponse(data);
      })
      .catch((error) => {
        console.error(error);
      });
    return true;
  });
});
