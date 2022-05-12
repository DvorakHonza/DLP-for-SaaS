import { MessageType } from '../../Enums/MessageType';
import { OperationType } from '../../Enums/OperationType';
import { PolicyMode } from '../../Enums/PolicyMode';
import { Notifications } from '../../Helpers/NotificationsHelper';
import { PolicyHelper } from '../../Helpers/PolicyHelper';
import { Messenger } from '../Messaging/NativeMessaging';

/**
 * chrome.runtime.onMessage handler for a message from clipboard.js content script
 * @param request Received message
 * @param sender Sender of the message
 * @param sendResponse Callback for sending a response to Sender
 */
export function onCopyHandler(
    request: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
): boolean | undefined {
    let clipboardPolicy = PolicyHelper.getStoragePolicy('clipboard');
    let clipboardContent = getClipboardContent();
    console.log('Copying to clipboard detected');
    
    if (clipboardPolicy === PolicyMode.Unknown)
        return true;

    if (clipboardPolicy === PolicyMode.Block) {
        console.log('Blocking copy');
        setClipboardContent('Copy blocked');
    }

    if (clipboardPolicy === PolicyMode.Block || clipboardPolicy === PolicyMode.Notify)
        Notifications.showNotification(clipboardPolicy, OperationType.ClipboardCopy);
    
    Messenger.sendNativeMessage({
        type: MessageType.DLP,
        operation: OperationType.ClipboardCopy,
        url: sender.url,
        data: clipboardContent
    });

    return true;
}

// The getClipboardContent and setClipboard functions are adapted from https://gist.github.com/srsudar/e9a41228f06f32f272a2
/**
 * Retrieves contents of the clipboard
 * @returns Content of the clipboard
 */
export function getClipboardContent(): string {
    var result = '';
    var textArea = document.getElementById('sandbox') as HTMLTextAreaElement;
    if (textArea) {
        textArea.value = '';
        textArea.select();
        if (document.execCommand('paste'))
            result = textArea.value;
        textArea.value = '';
    }
    return result;
}

/**
 * Sets contents of the clipboard
 * @param text Content to set to the clipboard
 */
export function setClipboardContent(text?: string): void {
    var textArea = document.getElementById('sandbox') as HTMLTextAreaElement;
    textArea.value = text ? text : '';
    textArea.focus();
    textArea.select();
    if (!document.execCommand('copy'))
        console.log('Could not set clipboard content')

}