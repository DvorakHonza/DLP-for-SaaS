"use strict";

let clipboardPolicy;
(async function fetchClipboardSettings() {
    try {
        let policy = await chrome.storage.managed.get("StoragePolicySettings");
        clipboardPolicy = policy.StoragePolicySettings.clipboard;
    }
    catch (err) {
        console.error("Could not load settings from storage.");
    }
})()

document.addEventListener('copy', async (e) => {
    e.preventDefault();
    let message = {
        type: e.type,
        content: await navigator.clipboard.readText(),
    }
    chrome.runtime.sendMessage(message);
});