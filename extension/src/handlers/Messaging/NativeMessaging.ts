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

export class Messenger {
    private static port: chrome.runtime.Port | undefined = undefined;

    private static connectNativeHost() {
        console.log('Connecting to native host...');
        try {
            Messenger.port = chrome.runtime.connectNative(nativeHostName);
            Messenger.port.name = 'NativeHostLogger';
            Messenger.port.onMessage.addListener(this.onNativeMessage);
            Messenger.port.onDisconnect.addListener(this.onPortDisconnect);
            console.log('Connecting successful');
        }
        catch (e) {
            console.error(`An error occured while creating a port: ${e}`);
        }
    }
    
    public static async sendNativeMessage(message: NativeMessage) {
        if (! Messenger.port)
            this.connectNativeHost();
        
        this.prepareAndSendMessage(message);
    }
    
    private static onNativeMessage(message: ResponseMessage, port: chrome.runtime.Port) {
        if (message.Successful)
            console.log('Log was succesfully saved to database.');
        else
            console.error(`Log was not saved due to an error: ${message.ErrorMessage}`)
    }
    
    private static onPortDisconnect(port: chrome.runtime.Port) {
        chrome.runtime.lastError
        ? console.error(`Connection to ${Messenger.port?.name} crashed: ${chrome.runtime.lastError.message}`)
        : console.log(`Connection closed${Messenger.port?.name ?? ` by ${Messenger.port?.name}`}.`);
        Messenger.port = undefined;
    }
    
    private static prepareAndSendMessage(message: NativeMessage) {
        chrome.identity.getProfileUserInfo(
            { accountStatus: chrome.identity.AccountStatus.ANY },
            (userInfo: chrome.identity.UserInfo) => {
                Messenger.port?.postMessage({
                    timestamp: new Date().toISOString(),
                    userEmail: userInfo.email,
                    userId: userInfo.id,
                    ...message,
                });
                console.log('Message sent');
            }
        );
    }
}

