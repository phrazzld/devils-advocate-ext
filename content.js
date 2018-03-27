// quack
// content.js


// Listen for browser_action_button clicks
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "clicked_browser_action") {
            handleBrowserAction()
        }
    }
)


// Challenge highlighted text or Google query
function handleBrowserAction () {
    var newTabs = []
    var highlightedText = window.getSelection().toString()

    // If text is highlighted, treat it as a claim and challenge it
    // Else, assume user is making a Google query and challenge that
    if (highlightedText) {
        // Challenge highlightedText claim
        var baseUrl = "https://duckduckgo.com/?q="
        newTabs.push(baseUrl + invertSentiment(highlightedText))
        newTabs.push("https://scholar.google.com/scholar?q=" + invertSentiment(highlightedText))
        newTabs.push(baseUrl + "studies refuting " + highlightedText)
        newTabs.push(baseUrl + "criticisms of " + highlightedText)
    } else if (window.location.href.includes("youtube.")) {
        // Search for opposing YouTube videos
        newTabs.push("https://www.youtube.com/results?search_query=" + invertSentiment(document.title.replace(" - YouTube", "")))
    } else {
        // Fall back on search engine behaviors
        var activeUrl = window.location.href
        var query = pullQueryFromSearchEngine(activeUrl)
        if (query) {
            var searchUrl = "http://duckduckgo.com/?q=" + invertSentiment(query)
            newTabs.push(searchUrl)
        }
    }

    // Open each challenging sentiment in a new tab
    newTabs.forEach(function (tab) {
        chrome.runtime.sendMessage({ "message": "open_new_tab", "url": tab })
    })
}


// Handle different search engines
function pullQueryFromSearchEngine (activeUrl) {
    var query = ""

    if (activeUrl.includes("google.")) {
        // Google
        query = document.title.replace(" - Google Search", "")
    } else if (activeUrl.includes("bing.")) {
        // Bing
        query = document.title.replace(" - Bing", "")
    } else if (activeUrl.includes("duckduckgo.")) {
        // DuckDuckGo
        query = document.title.replace(" at DuckDuckGo", "")
    } else if (activeUrl.includes("yahoo.")) {
        // Yahoo
        query = document.title.replace(" - Yahoo Search Results", "")
    } else {
        // Unsupported search engine or page
        console.log("Quack does not support challenging queries made on this page yet.")
    }

    return query
}


// Anti-echo chamber function
function invertSentiment (original) {
    /*
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
    */
    var inverted = window.nlp(original).sentences(0).toNegative().out()
    return inverted
}
