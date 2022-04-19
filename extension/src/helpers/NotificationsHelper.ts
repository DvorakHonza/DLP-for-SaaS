import { OperationType } from "../Enums/OperationType";
import { PolicyMode } from "../Enums/PolicyMode";

export class NotificationsHelper {

    private operationNotifications: {[operation in OperationType]?: any} = {
        [OperationType.Upload]: {
            message: chrome.i18n.getMessage('uploadNotificationMessage'),
            iconUrl: './images/icons/file_upload.svg'
        },
        [OperationType.Print]: {
            message: chrome.i18n.getMessage('printNotificationMessage'),
            iconUrl: './images/icons/print.svg'
        }
    }

    private modeNotifications: {[mode in PolicyMode]?: any} = {
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

    public showNotification(mode: PolicyMode, operation: OperationType) {
        console.log('Showing notification');
        let notificationOptions = {
            ...this.operationNotifications[operation],
            ...this.modeNotifications[mode]
        }
        chrome.notifications.create('a', notificationOptions);
    }
}