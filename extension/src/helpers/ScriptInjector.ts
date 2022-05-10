import { PolicyHelper } from "./PolicyHelper";

const safeStorageScripts = ['clipboard.js', 'screenCapture.js'];
var safeStorages: string[] = [];

export function setSafeStoragesForScriptInjector() {
    safeStorages = PolicyHelper.getSafeStorages();
}

export async function injectToSafeStorageTab(
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
) {
    try {
        if (shouldInject(changeInfo, tab)) {
            safeStorageScripts.forEach(
                script => injectScript(script, tabId, tab)
            );
        }
    }
    catch (e) {
        console.error(`Error ocurred while injecting script to ${ tab.url }: ${ e }`);
    }
}

function injectScript(script: string, tabId: number, tab: chrome.tabs.Tab,) {
    console.log(`Injecting script to ${ tab.url }...`);
    chrome.tabs.executeScript(
        tabId,
        {
            file: `./content_scripts/${ script }`,
            runAt: 'document_start'
        }
    );
    if (chrome.runtime.lastError)
        console.error(`Cannot inject content script: ${ chrome.runtime.lastError.message }`);
    else
        console.log('Script sucessfully injected.')
}

function shouldInject(changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab): boolean {
    let isSafeStorage = safeStorages
        .map(value => tab.url?.includes(value))
        .some(value => value);

    return changeInfo.status === 'complete' && isSafeStorage;
}