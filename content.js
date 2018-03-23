// quack
// content.js

// Listen for browser_action_button clicks
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "clicked_browser_action") {
            var sentiment = document.title.replace(" - Google Search", "")
            var opposingOpinion = invertSentiment(sentiment)
            var searchUrl = "http://google.com/search?q=" + opposingOpinion
            chrome.runtime.sendMessage({ "message": "open_new_tab", "url": searchUrl })
        }
    }
)

// Anti-echo chamber function
// TODO: Make this an actually sophisticated algorithm, possibly with some real NLP
function invertSentiment (original) {
    var isAgainst = original.includes("bad") ||
        original.includes("against") ||
        original.includes("anti")
    var inverted
    if (isAgainst) {
        inverted = original.replace("bad", "good")
        inverted = inverted.replace("against", "for")
        inverted = inverted.replace("anti", "")
    } else {
        inverted = "arguments against " + original
    }
    return inverted
}
