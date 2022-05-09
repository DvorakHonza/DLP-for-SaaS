import { UploadPageContext } from "./UploadPageContext";

let requestProcessor: UploadPageContext;

/**
 * Initiates request processor, needs to be called after the policy is read
 */
export function initRequestProcessor() {
    requestProcessor = new UploadPageContext();
}

/**
 * Processes an HTTP request containing file upload via request processor 
 * based on currently open page and set policy
 * @param detail HTTP request detail
 * @returns Blocking response when the upload policy is set to block, void otherwise
 */
export function processWebRequest(
    detail: chrome.webRequest.WebRequestBodyDetails
): void | chrome.webRequest.BlockingResponse {
    try {
        if (requestProcessor.containsFileUpload(detail)) {
            return requestProcessor.executeAction(detail);
        }
    }
    catch(e) {
        if (!(e instanceof TypeError))
            console.error(e);
    }
}

/**
 * chrome.tabs.onUpdated event handler, creates an upload page when the page is loaded 
 * @param tabId Id of the updated tab
 * @param changeInfo Changed info
 * @param tab Updated tab
 */
export function setUploadPageContext(
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
): void {
    if (tab.status === 'complete') {
        let url = getTabUrl(tab.url);
        if (url)
            requestProcessor.setUploadPage(tabId, url);
    }
}

/**
 * chrome.tabs.onActivated events handler, changes upload page to for current tab
 * @param activeInfo info of activated tab
 */
export function setUploadPageContextOnTabChange(activeInfo: chrome.tabs.TabActiveInfo) {
    requestProcessor.switchUploadPageContext(activeInfo.tabId);
}

/**
 * chrome.tabs.onRemoved handler, removes upload page created for tab with tabId
 * @param tabId Id of closed tab
 * @param removeInfo Info about closed page
 */
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