// background.ts

chrome.action.onClicked.addListener(function (tab) {
  if (tab?.id) {
    chrome.scripting.executeScript({
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
        console.log("got data back, data:", data);
        sendResponse(data);
      })
      .catch((error) => {
        console.error(error);
      });
    return true;
  });
});
