import { PolicyMode } from '../enums/policy_mode';
import { PolicyHelper } from '../helpers/policy_helper';

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