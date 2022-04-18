import { MessageType } from "../../Enums/MessageType";
import { OperationType } from "../../Enums/OperationType";
import { PolicyMode } from "../../Enums/PolicyMode";
import { PolicyHelper } from "../../Helpers/PolicyHelper";
import { setClipboardContent } from "../Clipboard/Clipboard";
import { sendNativeMessage } from "../Messaging/NativeMessaging";

export function screenCaptureHandler(
    request: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
): boolean | Promise<boolean> {
    let clipboardPolicy = PolicyHelper.getStoragePolicy('screenCapture');
    console.log('Taking clipboard detected');
    
    if (clipboardPolicy === PolicyMode.Block) {
        console.log('Taking screenshot blocked');
        setClipboardContent();
    }

    sendNativeMessage({
        type: MessageType.DLP,
        operation: OperationType.ScreenCapture,
        url: sender.url,
    });

    return true;
}