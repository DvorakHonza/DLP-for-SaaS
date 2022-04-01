"use strict";

let currentPolicy = { };

export async function isTabSafeStorage(tab) {
    let SafeStorage = currentPolicy?.SafeStorage;
    if (!("SafeStorage" in currentPolicy)) {
        currentPolicy = await getPolicy();
        SafeStorage = currentPolicy.SafeStorage
    }
    return SafeStorage?.map( url => tab.url.includes(url)).some( value => value === true);
}

export async function getSettings(module) {
    if (!("StoragePolicySettings" in currentPolicy))
        currentPolicy = await getPolicy();
    if (module in currentPolicy?.StoragePolicySettings)
        return currentPolicy.StoragePolicySettings[module];
    return currentPolicy.StoragePolicySettings;
}

export async function getSafeStorages() {
    if (!('SafeStorage' in currentPolicy)) {
        currentPolicy = await getPolicy();
    }
    return currentPolicy.SafeStorage;
}

export async function updateCurrentPolicy() {
    currentPolicy = await getPolicy();
}

async function getPolicy() {
    try {
        console.log("Fetching policy...");
        currentPolicy = await chrome.storage.managed.get(null);
        return currentPolicy;
    } catch (e) {
        currentPolicy = defaultPolicy;
        console.error("Unable to fetch current policy from settings. Using default values...");
    }
}

const defaultPolicy = {
    SafeStorage: [],
    StoragePolicySettings: {
        clipboard: 'deny',
        screenCapture: 'deny',
        print: 'deny',
        upload: 'deny'
    }
}