import { UploadPageContext } from "./UploadPageContext";

const supportedUploadPages = ['uloz.to', 'www.uschovna.cz', 'drive.google.com'];

let requestProcessor: UploadPageContext;

export function initRequestProcessor() {
    requestProcessor = new UploadPageContext();
}

export function processWebRequest(
    detail: chrome.webRequest.WebRequestBodyDetails
): void | chrome.webRequest.BlockingResponse {
    try {
        if (requestProcessor.containsFileUpload(detail)) {
            return requestProcessor.executeAction(detail);
        }
    }
    catch(e) {
        console.error(e);
    }
}

export function setUploadPageContext(
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
): void {
    if (tab.status === 'complete') {
        let url = getTabUrl(tab.url);
        if (url && supportedUploadPages.includes(url))
            requestProcessor.setUploadPage(tabId, url);
    }
}

export function setUploadPageContextOnTabChange(activeInfo: chrome.tabs.TabActiveInfo) {
    requestProcessor.switchUploadPageContext(activeInfo.tabId);
}

export function clearUploadPageContext(tabId: number, removeInfo: object) {
    requestProcessor.removeUploadPageContext(tabId);
}

function getTabUrl(tabUrl: string | undefined) {
    // remove scheme and everything after first slash
    let res = tabUrl?.match(/^\w*:\/\/((\w|\.)*)\/?.*$/m);
    return res ? res[1] : undefined;
}

// Chrome does not fully support request body
// https://bugs.chromium.org/p/chromium/issues/detail?id=813285#c12