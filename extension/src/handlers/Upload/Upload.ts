import { UploadPageContext } from "./UploadPageContext";
import { UloztoPage } from "./UploadPages/UloztoPage";
import { UschovnaPage } from "./UploadPages/UschovnaPage";

const supportedUploadPages = ['uloz.to', 'www.uschovna.cz'];

let requestProcessor = new UploadPageContext();

export function processWebRequest(
    detail: chrome.webRequest.WebRequestBodyDetails
): void | chrome.webRequest.BlockingResponse {
    try {
        if (requestProcessor.containsFileUpload(detail)) {
            console.dir(detail);
        }
    }
    catch(e) {}
}

export function setUploadPageContext(
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
): void {
    console.log(tabId);
    if (tab.status === 'complete') {
        let url = getTabUrl(tab.url);
        console.log(url);
        if (url && supportedUploadPages.includes(url)) {
            requestProcessor.setUploadPage(tabId, url);
        }
    }
}

export function setUploadPageContextOnTabChange(activeInfo: chrome.tabs.TabActiveInfo) {
    requestProcessor.switchUploadPageContext(activeInfo.tabId);
}

export function clearUploadPageContext(tabId: number, removeInfo: object) {
    requestProcessor.removeUploadPageContext(tabId);
}

/* function setUploadPage(tabId: number, url: string) {
    console.log('Setting upload page');
    if (url === 'uloz.to') {
        requestProcessor.setUploadPage(tabId, new UloztoPage());
    }
    else if (url === 'www.uschovna.cz') {
        requestProcessor.setUploadPage(tabId, new UschovnaPage());
    }
    else {
        console.error(`Unsupported upload page: ${url}`);
    }
} */

function getTabUrl(tabUrl: string | undefined) {

    // remove scheme and trailing slash
    let res = tabUrl?.match(/^\w*:\/\/(.*)\/$/m);
    return res ? res[1] : undefined;
}

// gdrive clients6.google.com/upload/drive PUT

// Chrome does not fully support request body
// https://bugs.chromium.org/p/chromium/issues/detail?id=813285#c12