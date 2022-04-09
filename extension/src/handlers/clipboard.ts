import { MessageType } from '../enums/message_type';
import { OperationType } from '../enums/operation_type';
import { PolicyMode } from '../enums/policy_mode';
import { PolicyHelper } from '../helpers/policy_helper';
import { sendNativeMessage } from './nativeMessaging';

export async function onCopyHandler(
    request: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
) {
    let clipboardPolicy = PolicyHelper.getInstance().getStoragePolicy('clipboard');
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
                data: getClipboardContent()
            });
        }
    );

    //TODO: Send message to native host

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

function setClipboardContent(text?: string): void {
    var textArea = document.getElementById('sandbox') as HTMLTextAreaElement;
    textArea.value = text ? text : '';
    textArea.focus();
    textArea.select();
    var successful = document.execCommand('copy');
    console.log(`Clipboard content${successful ? ' ' : 'not '}set`)
}