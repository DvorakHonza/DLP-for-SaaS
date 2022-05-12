import { OperationType } from "../Enums/OperationType";
import { PolicyMode } from "../Enums/PolicyMode";

export class Notifications {

    /**
     * Creates a notification containig information based on policy and operation
     * @param mode Policy set for given operation
     * @param operation Operation that triggered showing notification
     */
    public static showNotification(mode: PolicyMode, operation: OperationType) {
        console.log('Showing notification');
        let notificationOptions: chrome.notifications.NotificationOptions<true> = {
            ...this.operationNotifications[operation],
            ...this.modeNotifications[mode]
        }
        chrome.notifications.create(
            notificationOptions, 
        );
    }

    /**
     * Contains notification properties for specific for each operation
     */
    private static operationNotifications: {[operation in OperationType]?: chrome.notifications.NotificationOptions} = {
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
    
    /**
     * Contains notification properties for specific for each policy mode
     */
    private static modeNotifications: {[mode in PolicyMode]?: any} = {
        [PolicyMode.Block]: {
            title: 'Operation was blocked in accordance with security policy.',
            type: 'basic',
        },
        [PolicyMode.Notify]: {
            title: chrome.i18n.getMessage('notifyNotificationTitle'),
            type: 'basic',
            buttons: [
                // { title: chrome.i18n.getMessage('proceedButtonTitle') },
                // { title: chrome.i18n.getMessage('cancelButtonTitle') }
            ],
            // requireInteraction: true,
        }
    }
}
