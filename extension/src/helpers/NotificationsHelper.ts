import { OperationType } from "../Enums/OperationType";
import { PolicyMode } from "../Enums/PolicyMode";

export class NotificationHelper {

    private static operationNotifications: {[operation in OperationType]?: any} = {
        [OperationType.Upload]: {
            message: chrome.i18n.getMessage('uploadNotificationMessage'),
            iconUrl: './images/file_upload.svg'
        },
        [OperationType.Print]: {
            message: chrome.i18n.getMessage('printNotificationMessage'),
            iconUrl: './images/print.svg'
        }
    }

    private static modeNotifications: {[mode in PolicyMode]?: any} = {
        [PolicyMode.Block]: {
            title: '',
            type: 'basic',
        },
        [PolicyMode.Notify]: {
            title: chrome.i18n.getMessage('notifyNotificationTitle'),
            type: 'basic',
            buttons: [
                { title: 'Proceed' },
                { title: 'Cancel' }
            ],
            requireInteraction: true,
        }
    }

    public static showNotification(mode: PolicyMode, operation: OperationType) {
        let notificationOptions = {
            ...this.operationNotifications[operation],
            ...this.modeNotifications[mode]
        }
        chrome.notifications.create('', notificationOptions);
    }
}