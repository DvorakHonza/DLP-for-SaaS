import { onMessageHandler } from './handlers/Messaging/Messaging';
import {
    clearUploadPageContext,
    processWebRequest,
    setUploadPageContext,
    setUploadPageContextOnTabChange
} from './handlers/Upload/Upload';
import { PolicyHelper } from './helpers/PolicHelper';
import { injectToSafeStorageTab } from './helpers/ScriptInjector';

// Fetch policy settings from storage
PolicyHelper.init();

// Storage handlers
chrome.storage.onChanged.addListener((_changes, areaName) => 
    areaName === 'managed' && PolicyHelper.updateSettings()
);

// Messaging handlers
chrome.runtime.onMessage.addListener(onMessageHandler);

// Injecting hadlers    
chrome.tabs.onUpdated.addListener(injectToSafeStorageTab);

//Page context handlers
chrome.tabs.onUpdated.addListener(setUploadPageContext);
chrome.tabs.onActivated.addListener(setUploadPageContextOnTabChange);
chrome.tabs.onRemoved.addListener(clearUploadPageContext)

// WebRequest handlers
chrome.webRequest.onBeforeRequest.addListener(
    processWebRequest,
    { urls:  ['<all_urls>']},
    [ 'requestBody', 'blocking' ]
);