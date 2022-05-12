import { PolicyHelper } from "./PolicyHelper";

const safeStorageScripts = ['clipboard.js', 'screenCapture.js'];
var injectedTabs: Map<number, string> = new Map();
var safeStorages: string[] = [];

/**
 * Reads set safe storages and inializes safeStorages variable
 */
export function setSafeStoragesForScriptInjector(): void {
    safeStorages = PolicyHelper.getSafeStorages();
}

/**
 * chrome.tabs.onUpdated event handler. Injects content scripts to pages which are considered as a safe storage
 * @param tabId id of the updated tab
 * @param changeInfo changed tab info after tab update
 * @param tab object representing updated tab
 */
export async function injectToSafeStorageTab(
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
): Promise<void> {
    try {
        if (shouldInject(changeInfo, tab)) {
            safeStorageScripts.forEach(
                script => injectScript(script, tabId, tab)
            );
            tab.url && injectedTabs.set(tabId, tab.url);
        }
        else {

        }
    }
    catch (e) {
        console.error(`Error ocurred while injecting script to ${ tab.url }: ${ e }`);
    }
}

/**
 * Injects a script to tab
 * @param script name of the content script
 * @param tabId id of the tab
 * @param tab injected tab
 */
function injectScript(script: string, tabId: number, tab: chrome.tabs.Tab,): void {
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
        console.log(`Script ${ script } sucessfully injected.`);
}

/**
 * Determines whether the tab contains a page considered as a safe storage
 * @param changeInfo changed tab info after tab update
 * @param tab object representing updated tab
 * @returns true if content scripts should be injected, false otherwise
 */
function shouldInject(changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab): boolean {
    if (changeInfo.status !== 'complete')
        return false;

    // Checks whether the content scripts were alreadty injected
    if (tab.id && injectedTabs.has(tab.id)) {
        if (injectedTabs.get(tab.id) !== tab.url)
            injectedTabs.delete(tab.id);

        return false;
    }

    let isSafeStorage = safeStorages
        .map(value => tab.url?.includes(value))
        .some(value => value);

    return isSafeStorage;
}

/**
 * chrome.tabs.onRemoved handler, adjusts information about injected tabs
 * @param tabId Id of removed tab
 * @param removeInfo Info about removed tab
 */
export function removeInjectedInfo(tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) {
    if (injectedTabs.has(tabId))
        injectedTabs.delete(tabId);
}