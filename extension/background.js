"use strict";
import { extensionMessageHandler } from "./src/handlers/messaging.js";
import { isTabSafeStorage, updateCurrentPolicy } from "./src/policyHelper.js";
import { logUrl } from "./src/handlers/upload.js";

chrome.storage.onChanged.addListener( function(changes, area) {
    if (area === 'managed') {
        updateCurrentPolicy();
        console.log("Changes: ", { ...changes });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    extensionMessageHandler(message, sender, sendResponse)
});

chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    try {
        if (changeInfo.status === 'complete' && await isTabSafeStorage(tab)) {
            console.log(`Injecting script to ${tab.url}...`)
            await chrome.scripting.executeScript({
                files: ['./src/content_scripts/clipboard.js'],
                target: { tabId: tabId }
            })
        }
    }
    catch (e) {
        console.error(`Error ocurred while injecting script to ${ tab.url }: ${ e }`);
    }
});

chrome.webRequest.onBeforeRequest.addListener(
    logUrl,
    { urls: ["<all_urls>"] },
    [ "requestBody", "extraHeaders" ]
)

console.dir(navigator);

/* navigator.clipboard.addEventListener('copy', function() {
    console.log("Caught copy event in worker");
}) */

/* chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(
    (info) => console.dir(info)
) */