import { MessageType } from '../../Enums/MessageType';
import { OperationType } from '../../Enums/OperationType';
import { PolicyMode } from '../../Enums/PolicyMode';

const nativeHostName = 'com.dlp_for_saas.native_host';
Object.freeze(nativeHostName);

export type NativeMessage = {
    type: MessageType;
    operation: OperationType;
    actionTaken?: PolicyMode.Block | PolicyMode.Log;
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

export async function sendNativeMessage(message: NativeMessage) {
    if (!port)
        connectNativeHost();
    
    prepareAndSendMessage(message);
}


function onNativeMessage(message: any, port: chrome.runtime.Port) {
    console.log(`Received message from ${port.name}:`);
    console.dir(message);
}

function onPortDisconnect(port: chrome.runtime.Port) {
    chrome.runtime.lastError
    ? console.error(`Connection to crashed: ${chrome.runtime.lastError.message}`)
    : console.log(`Connection closed${port.name ?? ` by ${port.name}`}.`);
}

function prepareAndSendMessage(message: NativeMessage) {
    chrome.identity.getProfileUserInfo(
        (userInfo: chrome.identity.UserInfo) => {
            port?.postMessage({
                timestamp: new Date(),
                userEmail: userInfo.email,
                userId: userInfo.id,
                ...message,
            });
            console.log('Message sent');
        }
    );
}