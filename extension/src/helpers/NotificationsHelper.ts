import { OperationType } from "../Enums/OperationType";
import { PolicyMode } from "../Enums/PolicyMode";

export class Notification {

    private requestId: string;
    private operationBlockedCallback: () => void;
    private operationAllowedCallback: () => void;

    constructor(
        requestId: string,
        operationBlockedCallback: () => void,
        operationAllowedCallback: () => void
    ) {
        this.requestId = requestId;
        this.operationBlockedCallback = operationBlockedCallback;
        this.operationAllowedCallback = operationAllowedCallback;
        chrome.notifications.onButtonClicked.addListener(this.onButtonClicked);
    }

    public showNotification(mode: PolicyMode, operation: OperationType, requestId: string) {
        console.log('Showing notification');
        let notificationOptions: chrome.notifications.NotificationOptions<true> = {
            ...NotificationsHelper.operationNotifications[operation],
            ...NotificationsHelper.modeNotifications[mode]
        }
        chrome.notifications.create(
            `${requestId}`,
            notificationOptions, 
            (notificationId: string ) => {
                console.log('Notification created.');
                if (mode === PolicyMode.Notify) {
                    setTimeout(
                        () => chrome.notifications.clear(
                            notificationId,
                            (wasCleared: boolean) => {
                                if (wasCleared) {
                                    this.operationBlockedCallback();
                                    console.log('Notification was cleared after 5 seconds and operation was blocked.');
                                }
                        }),
                        5000
                    );
                }
            }
        );
    }

    private onButtonClicked = (notificationId: string, buttonIndex: number) => {
        if (notificationId !== this.requestId) return;

        if (buttonIndex === 0)
            this.operationAllowedCallback();
        else
            this.operationBlockedCallback();

        chrome.notifications.clear(notificationId);
        chrome.notifications.onButtonClicked.removeListener(this.onButtonClicked);
    }
}

class NotificationsHelper {
    public static operationNotifications: {[operation in OperationType]?: chrome.notifications.NotificationOptions} = {
        [OperationType.Upload]: {
            message: chrome.i18n.getMessage('uploadNotificationMessage'),
            iconUrl: './images/icons/file_upload.svg'
        },
        [OperationType.Print]: {
            message: chrome.i18n.getMessage('printNotificationMessage'),
            iconUrl: './images/icons/print.svg'
        },
        [OperationType.ClipboardCopy]: {
            message: chrome.i18n.getMessage('clipboardNotificationMessage'),
            iconUrl: './images/icons/clipboard.svg'
        },
        [OperationType.ScreenCapture]: {
            message: chrome.i18n.getMessage('screenCaptureNotificationMessage'),
            iconUrl: './images/icons/screen_capture.svg'
        }
    }

    public static modeNotifications: {[mode in PolicyMode]?: any} = {
        [PolicyMode.Block]: {
            title: 'Operation was blocked in accordance with security policy.',
            type: 'basic',
        },
        [PolicyMode.Notify]: {
            title: chrome.i18n.getMessage('notifyNotificationTitle'),
            type: 'basic',
            buttons: [
                { title: chrome.i18n.getMessage('proceedButtonTitle') },
                { title: chrome.i18n.getMessage('cancelButtonTitle') }
            ],
            requireInteraction: true,
        }
    }
}