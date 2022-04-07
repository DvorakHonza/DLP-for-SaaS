chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("Received message");
        console.dir(request);
        return true;
    }
);

chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    try {
        if (changeInfo.status === 'complete') {
            console.log(`Injecting script to ${ tab.url }...`);
            await chrome.scripting.executeScript({
                files: ['./src/content_scripts/clipboard.js'],
                target: { tabId: tabId }
            });
            if (chrome.runtime.lastError)
                console.error(`Cannot inject content script: ${ chrome.runtime.lastError.message }`);
        }
    }
    catch (e) {
        console.error(`Error ocurred while injecting script to ${ tab.url }: ${ e }`);
    }
});