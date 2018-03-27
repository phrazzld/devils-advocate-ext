// quack
// content.js

// Unchanging base URLs
var DUCKDUCKGO = "https://duckduckgo.com/?q="
var GOOGLESCHOLAR = "https://scholar.google.com/scholar?q="
var YOUTUBE = "https://www.youtube.com/results?search_query="

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
    var newTabs
    var highlightedText = window.getSelection().toString()
    var activeUrl = window.location.href

    if (highlightedText) {
        // Challenge highlightedText claim
        newTabs = challengeHighlightedText(highlightedText)
    } else if (activeUrl.includes("youtube.")) {
        // Search for opposing YouTube videos
        newTabs = challengeYouTubeSearch()
    } else {
        // Fall back on search engine behaviors
        newTabs = challengeSearchQuery(activeUrl)
    }

    // Open each challenging sentiment in a new tab
    newTabs.forEach(function (tab) {
        chrome.runtime.sendMessage({ "message": "open_new_tab", "url": tab })
    })
}


// Returns array of tabs to open
function challengeHighlightedText (highlightedText) {
    var tabs = []
    tabs.push(DUCKDUCKGO + invertSentiment(highlightedText))
    tabs.push(DUCKDUCKGO + "studies opposing " + highlightedText)
    tabs.push(GOOGLESCHOLAR + invertSentiment(highlightedText))
    return tabs
}


// Returns YouTube search URL for opposing videos, as array with length 1
function challengeYouTubeSearch () {
    var tabs = []
    var youtubeQuery = document.title.replace(" - YouTube", "")
    tabs.push(YOUTUBE + invertSentiment(youtubeQuery))
    return tabs
}


// Returns array of 1 DuckDuckGo URL with opposing query
function challengeSearchQuery (activeUrl) {
    var tabs = []
    var searchQuery = pullQueryFromSearchEngine(activeUrl)
    if (searchQuery) {
        tabs.push(DUCKDUCKGO + invertSentiment(searchQuery))
    }
    return tabs
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
    var inverted

    // Swap "good" and "bad"
    if (original.includes("good")) {
        inverted = original.replace("good", "bad")
    } else if (original.includes("bad")) {
        inverted = original.replace("bad", "good")
    }
    // Swap "for" and "against"
    else if (original.includes("for")) {
        inverted = original.replace("for", "against")
    } else if (original.includes("against")) {
        inverted = original.replace("against", "for")
    }
    // Swap "pro" and "anti"
    else if (original.includes("pro")) {
        inverted = original.replace("pro", "anti")
    } else if (original.includes("anti")) {
        inverted = original.replace("anti", "pro")
    }
    // Swap "true" and "false"
    else if (original.includes("true")) {
        inverted = original.replace("true", "false")
    } else if (original.includes("false")) {
        inverted = original.replace("false", "true")
    }
    // Swap "supporting" and "opposing"
    else if (original.includes("supporting")) {
        inverted = original.replace("supporting", "opposing")
    } else if (original.includes("opposing")) {
        inverted = original.replace("opposing", "supporting")
    }
    // Swap "stupid" and "smart"
    else if (original.includes("stupid")) {
        inverted = original.replace("stupid", "smart")
    } else if (original.includes("smart")) {
        inverted = original.replace("smart", "stupid")
    }
    // Swap "dumb" and "smart"
    else if (original.includes("dumb")) {
        inverted = original.replace("dumb", "smart")
    } else if (original.includes("smart")) {
        inverted = original.replace("smart", "dumb")
    }
    // Swap "fake" and "real"
    else if (original.includes("fake")) {
        inverted = original.replace("fake", "real")
    } else if (original.includes("real")) {
        inverted = original.replace("real", "fake")
    }
    // Swap "evil" and "good"
    else if (original.includes("evil")) {
        inverted = original.replace("evil", "good")
    } else if (original.includes("good")) {
        inverted = original.replace("good", "evil")
    }

    // If not captured by any of the above, run compromise negation
    else {
        inverted = window.nlp(original).sentences(0).toNegative().out()
    }

    return inverted
}
