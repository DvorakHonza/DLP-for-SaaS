import { MessageType } from "../../../Enums/MessageType";
import { OperationType } from "../../../Enums/OperationType";
import { PolicyMode } from "../../../Enums/PolicyMode";
import { Notification } from "../../../Helpers/NotificationsHelper";
import { IDlpOperationHandler } from "../../IDlpOperationHandler"
import { sendNativeMessage } from "../../Messaging/NativeMessaging";

export abstract class UploadPage implements IDlpOperationHandler {
    abstract readonly UploadUrls: string[];
    abstract readonly UploadMethod: string;
    abstract readonly Name: string;

    private notificationAction: void | chrome.webRequest.BlockingResponse = undefined;

    protected CancelResponse: chrome.webRequest.BlockingResponse = { cancel: true };

    //#region Abstract methods
    public abstract getUploadData(detail: chrome.webRequest.WebRequestBodyDetails): string[];
    //#endregion

    public processRequest(request: chrome.webRequest.WebRequestBodyDetails, mode: PolicyMode): void | chrome.webRequest.BlockingResponse {
        switch(mode) {
            case PolicyMode.Block:
                return this.blockOperation(request, mode);

            case PolicyMode.Notify:
                return this.notify(request, mode);

            case PolicyMode.Log:
                return this.logOperation(request, mode);

            case PolicyMode.Unknown:
                console.warn('Invalid upload policy value set. No action taken.');
        }
    }

    public blockOperation(request: chrome.webRequest.WebRequestBodyDetails, mode: PolicyMode): chrome.webRequest.BlockingResponse {
        console.log('Blocking request');
        this.createNotification(mode, request.requestId);
        this.sendLog(request);
        return this.CancelResponse;
    }
    
    public notify(request: chrome.webRequest.WebRequestBodyDetails, mode: PolicyMode): void | chrome.webRequest.BlockingResponse {
        this.createNotification(mode, request.requestId);
        console.log('createNotitication finished');
        this.sendLog(request);
        return this.notificationAction;
    }
    
    public logOperation(request: chrome.webRequest.WebRequestBodyDetails, mode: PolicyMode): void {
        this.sendLog(request);
    }

    protected async createNotification(mode: PolicyMode, requestId: string) {
        let notificationUserAction: void | chrome.webRequest.BlockingResponse = undefined;
        let notificationClicked = false;
        let notification = new Notification(
            requestId,
            () => {
                console.log('cancel clicked');
                notificationUserAction = this.CancelResponse;
                notificationClicked = true;
            },
            () => {
                console.log('proceed clicked');
                notificationUserAction = undefined;
                notificationClicked = true;
            }
        );
        notification.showNotification(mode, OperationType.Upload, requestId);
        await waitUntil(() => notificationClicked === true, 5000);
        console.log('after waiting');
        this.notificationAction = notificationUserAction;
    }

    protected sendLog(request: chrome.webRequest.WebRequestBodyDetails) {
        console.log('Sending log about upload operation to database.')
         sendNativeMessage({
            type: MessageType.DLP,
            operation: OperationType.Upload,
            url: request.url,
            data: this.getUploadData(request),
        });
    }

    public containsFileUpload(detail: chrome.webRequest.WebRequestBodyDetails) {
        return detail.method === this.UploadMethod &&
            this.UploadUrls.some( url => detail.url.match(url));
    }
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
async function waitUntil(predicate: () => boolean, duration: number) {
    let timer = 0;
    while (timer < duration) {
        if (predicate())
            break;
        timer += 100;
        await delay(100);
    }
    console.log('waiting finished');
}