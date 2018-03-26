// quack
// background.js

// MVP: run Quack when user clicks browser action
chrome.browserAction.onClicked.addListener(function (tab) {
    // Send a message to the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0]
        chrome.tabs.sendMessage(activeTab.id, { "message": "clicked_browser_action" })
    })
})

// Listen for open_new_tab event from content.js, trigger query for opposing opinions
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "open_new_tab") {
            chrome.tabs.create({ "url": request.url })
        }
    }
)
