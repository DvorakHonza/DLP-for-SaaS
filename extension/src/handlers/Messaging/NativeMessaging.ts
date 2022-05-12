import { MessageType } from '../../Enums/MessageType';
import { OperationType } from '../../Enums/OperationType';
import { PolicyMode } from '../../Enums/PolicyMode';

/**
 * Represents a message sent to native host
 */
export type NativeMessage = {
    type: MessageType;
    operation: OperationType;
    actionTaken?: PolicyMode.Block | PolicyMode.Log;
    url?: string;
    data?: any;
    filename?: string;
}

/**
 * Represents a message received from native host
 */
type ResponseMessage = {
    Successful: boolean;
    ErrorMessage?: string;
}

export class Messenger {
    private static port: chrome.runtime.Port | undefined = undefined;
    private static readonly nativeHostName = 'com.dlp_for_saas.native_host';

    /**
     * Initilizes port and connects to a native host
     */
    private static connectNativeHost() {
        console.log('Connecting to native host...');
        try {
            Messenger.port = chrome.runtime.connectNative(this.nativeHostName);
            Messenger.port.name = 'NativeHostLogger';
            Messenger.port.onMessage.addListener(this.onNativeMessage);
            Messenger.port.onDisconnect.addListener(this.onPortDisconnect);
            console.log('Connecting successful');
        }
        catch (e) {
            console.error(`An error occured while creating a port: ${e}`);
        }
    }
    
    /**
     * Sends a message to a native host 
     * @param message Message to be sent
     */
    public static sendNativeMessage(message: NativeMessage) {
        if (! Messenger.port)
            this.connectNativeHost();
        
        this.prepareAndSendMessage(message);
    }
    
    /**
     * Handler used for reading received messages from native host
     * @param message Received message
     * @param port Port that received the message
     */
    private static onNativeMessage(message: ResponseMessage, port: chrome.runtime.Port) {
        if (message.Successful)
            console.log('Log was succesfully saved to database.');
        else
            console.error(`Log was not saved due to an error: ${message.ErrorMessage}`)
    }
    
    /**
     * Handler used for processing port disconnecting
     * @param port Port that was disconnected
     */
    private static onPortDisconnect(port: chrome.runtime.Port) {
        chrome.runtime.lastError
        ? console.error(`Connection to ${Messenger.port?.name} crashed: ${chrome.runtime.lastError.message}`)
        : console.log(`Connection closed${Messenger.port?.name ?? ` by ${Messenger.port?.name}`}.`);
        Messenger.port = undefined;
    }
    
    /**
     * Retrieves information about a user logged into chrome and sends a message to native host
     * @param message Message to be sent
     */
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

