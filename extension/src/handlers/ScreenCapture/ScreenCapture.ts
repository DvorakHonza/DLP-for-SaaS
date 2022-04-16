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

    chrome.identity.getProfileUserInfo(
        (userInfo: chrome.identity.UserInfo) => {
            sendNativeMessage({
                timestamp: new Date(),
                type: MessageType.DLP,
                operation: OperationType.ScreenCapture,
                userEmail: userInfo.email,
                userId: userInfo.id,
                url: sender.url,
            });
        }
    );

    return true;
}