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
    filename?: string;
}

type ResponseMessage = {
    Successful: boolean;
    ErrorMessage?: string;
}

var port: chrome.runtime.Port | undefined;

function connectNativeHost() {
    console.log('Connecting to native host...');
    try {
        port = chrome.runtime.connectNative(nativeHostName);
        port.name = 'NativeHostLogger';
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


function onNativeMessage(message: ResponseMessage, port: chrome.runtime.Port) {
    if (message.Successful)
        console.log('Log was succesfully saved to database.');
    else
        console.error(`Log was not saved due to an error: ${message.ErrorMessage}`)
}

function onPortDisconnect(port: chrome.runtime.Port) {
    chrome.runtime.lastError
    ? console.error(`Connection to ${port.name} crashed: ${chrome.runtime.lastError.message}`)
    : console.log(`Connection closed${port.name ?? ` by ${port.name}`}.`);
    console.log(port);
}

function prepareAndSendMessage(message: NativeMessage) {
    chrome.identity.getProfileUserInfo(
        { accountStatus: chrome.identity.AccountStatus.ANY },
        (userInfo: chrome.identity.UserInfo) => {
            port?.postMessage({
                timestamp: new Date().toISOString(),
                userEmail: userInfo.email,
                userId: userInfo.id,
                ...message,
            });
            console.log('Message sent');
        }
    );
}