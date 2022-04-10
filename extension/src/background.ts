import { onMessageHandler } from './handlers/messaging';
import { PolicyHelper } from './helpers/policy_helper';
import { injectClipboardContentScript } from './helpers/script_injector';

// Fetch policy settings from storage
PolicyHelper.init();

// Storage handlers
chrome.storage.onChanged.addListener((_changes, areaName) => 
    areaName === 'managed' && PolicyHelper.updateSettings()
);

// Messaging handlers
chrome.runtime.onMessage.addListener(onMessageHandler);

//Injecting hadlers
chrome.tabs.onUpdated.addListener(injectClipboardContentScript);