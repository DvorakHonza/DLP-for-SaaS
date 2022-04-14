import { MessageType } from '../../Enums/MessageType';
import { OperationType } from '../../Enums/OperationType'
import { onCopyHandler } from '../Clipboard/Clipboard';

type Message = {
    script: string;
    type: MessageType;
    operation?: OperationType
}

type MessageHandlers = {
    [key: string]: (
        request: Message,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response?: any) => void
    ) => boolean | Promise<boolean>;
}

export function onMessageHandler(
    request: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
) {
    console.log(`Received message${sender.url ? ` from content script ${request.script}` : ''}`);
    let handler = handlers[request.script];
    handler(request, sender, sendResponse);
    console.log('Message handler finished');
}

const handlers: MessageHandlers = {
    'clipboard.js': onCopyHandler,
}