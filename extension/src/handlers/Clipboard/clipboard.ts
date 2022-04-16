import { MessageType } from '../../Enums/MessageType';
import { OperationType } from '../../Enums/OperationType';
import { PolicyMode } from '../../Enums/PolicyMode';
import { PolicyHelper } from '../../Helpers/PolicyHelper';
import { sendNativeMessage } from '../Messaging/NativeMessaging';

export async function onCopyHandler(
    request: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
): Promise<boolean> {
    let clipboardPolicy = PolicyHelper.getStoragePolicy('clipboard');
    let clipboardContent = getClipboardContent();
    console.log('Copying to clipboard detected');
    if (clipboardPolicy === PolicyMode.Block) {
        console.log('Blocking copy');
        setClipboardContent('Copy blocked');
    }

    chrome.identity.getProfileUserInfo(
        (userInfo: chrome.identity.UserInfo) => {
            sendNativeMessage({
                timestamp: new Date(),
                type: MessageType.DLP,
                operation: OperationType.ClipboardCopy,
                userEmail: userInfo.email,
                userId: userInfo.id,
                url: sender.url,
                data: clipboardContent
            });
        }
    );

    //TODO: Create notification

    return true;
}

// The getClipboardContent function is adapted from https://gist.github.com/srsudar/e9a41228f06f32f272a2
function getClipboardContent(): string {
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

export function setClipboardContent(text?: string): void {
    var textArea = document.getElementById('sandbox') as HTMLTextAreaElement;
    textArea.value = text ? text : '';
    textArea.focus();
    textArea.select();
    if (!document.execCommand('copy'))
        console.log('Could not set clipboard content')

}