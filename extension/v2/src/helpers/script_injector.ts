export async function injectClipboardContentScript(
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
) {
    try {
        if (changeInfo.status === 'complete') {
            console.log(`Injecting script to ${ tab.url }...`);
            chrome.tabs.executeScript(
                tabId,
                {
                    file: './content_scripts/clipboard.js',
                    runAt: 'document_start'
                }
            );
            if (chrome.runtime.lastError)
                console.error(`Cannot inject content script: ${ chrome.runtime.lastError.message }`);
            else
                console.log('Script sucessfully injected.')
        }
    }
    catch (e) {
        console.error(`Error ocurred while injecting script to ${ tab.url }: ${ e }`);
    }
}