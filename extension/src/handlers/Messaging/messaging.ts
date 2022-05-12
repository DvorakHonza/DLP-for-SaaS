import { MessageType } from '../../Enums/MessageType';
import { OperationType } from '../../Enums/OperationType'
import { onCopyHandler } from '../Clipboard/Clipboard';
import { screenCaptureHandler } from '../ScreenCapture/ScreenCapture';

/**
 * Represents message received from content script
 */
type Message = {
    script: string;
    type: MessageType;
    operation?: OperationType
}

/**
 * Represents an object whose property names are equal to content scipt names
 * and its values are functions that handle messages from corresponding scripts
 */
type MessageHandlers = {
    [key: string]: (
        request: Message,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response?: any) => void
    ) => boolean | undefined;
}

/**
 * chrome.runtime.onMessage handler, evokes a handler based on a sender script
 * @param request Received message
 * @param sender Sender of the message
 * @param sendResponse Callback for sending a response to Sender
 */
export function onMessageHandler(
    request: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
) {
    console.log(`Received message${sender.url ? ` from content script ${request.script}` : ''}`);
    let handler = handlers[request.script];
    handler(request, sender, sendResponse);
}

const handlers: MessageHandlers = {
    'clipboard.js': onCopyHandler,
    'screenCapture.js': screenCaptureHandler
}