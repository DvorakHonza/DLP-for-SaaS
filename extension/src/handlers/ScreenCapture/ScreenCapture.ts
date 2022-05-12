import { MessageType } from "../../Enums/MessageType";
import { OperationType } from "../../Enums/OperationType";
import { PolicyMode } from "../../Enums/PolicyMode";
import { Notifications } from "../../Helpers/NotificationsHelper";
import { PolicyHelper } from "../../Helpers/PolicyHelper";
import { setClipboardContent } from "../Clipboard/Clipboard";
import { Messenger } from "../Messaging/NativeMessaging";

/**
 * chrome.runtime.onMessage handler for a message from screenCapture.js content script
 * @param request Received message
 * @param sender Sender of the message
 * @param sendResponse Callback for sending a response to Sender
 */
export function screenCaptureHandler(
    request: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
): boolean | undefined {
    let clipboardPolicy = PolicyHelper.getStoragePolicy('screenCapture');
    console.log('Taking screenshot detected');
    
    if (clipboardPolicy === PolicyMode.Unknown)
        return true;

    if (clipboardPolicy === PolicyMode.Block) {
        console.log('Taking screenshot blocked');
        setClipboardContent();
    }

    if (clipboardPolicy === PolicyMode.Block || clipboardPolicy === PolicyMode.Notify)
        Notifications.showNotification(clipboardPolicy, OperationType.ScreenCapture);

    Messenger.sendNativeMessage({
        type: MessageType.DLP,
        operation: OperationType.ScreenCapture,
        url: sender.url,
    });

    return true;
}