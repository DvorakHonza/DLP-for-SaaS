import { MessageType } from "../../Enums/MessageType";
import { OperationType } from "../../Enums/OperationType";

const nativeHostName = 'com.dlp_for_saas.native_host';
Object.freeze(nativeHostName);

export type NativeMessage = {
    timestamp: Date;
    type: MessageType;
    operation: OperationType;
    userEmail: string;
    userId: string;
    actionTaken?: void;
    url?: string;
    data?: any;
}

var port: chrome.runtime.Port | undefined;

function connectNativeHost() {
    console.log('Connecting to native host...');
    try {
        port = chrome.runtime.connectNative(nativeHostName);
        port.onMessage.addListener(onNativeMessage);
        port.onDisconnect.addListener(onPortDisconnect);
        console.log('Connecting successful');
    }
    catch (e) {
        console.error(`An error occured while creating a port: ${e}`);
    }
}

export function sendNativeMessage(message: NativeMessage) {
    if (!port)
        connectNativeHost();
    console.log('Sending message:');
    console.dir(message);
    port?.postMessage(message);
}


function onNativeMessage(message: any, port: chrome.runtime.Port) {
    console.log(`Received message from ${port.name}:`);
    console.dir(message);
}

function onPortDisconnect(port: chrome.runtime.Port) {
    chrome.runtime.lastError
    ? console.error(`Connection to crashed: ${chrome.runtime.lastError.message}`)
    : console.log(`Connection closed by ${port.name}`);
}