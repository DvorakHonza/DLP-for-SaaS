import { MessageType } from "../../../Enums/MessageType";
import { OperationType } from "../../../Enums/OperationType";
import { PolicyMode } from "../../../Enums/PolicyMode";
import { NotificationsHelper } from "../../../Helpers/NotificationsHelper";
import { IDlpOperationHandler } from "../../IDlpOperationHandler"
import { sendNativeMessage } from "../../Messaging/NativeMessaging";

export abstract class UploadPage implements IDlpOperationHandler {
    abstract readonly UploadUrls: string[];
    abstract readonly UploadMethod: string;
    abstract readonly Name: string;

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
        this.createNotification(mode);
        this.sendLog(request);
        return this.CancelResponse;
    }
    
    public notify(request: chrome.webRequest.WebRequestBodyDetails, mode: PolicyMode): void | chrome.webRequest.BlockingResponse {
        this.createNotification(mode);
        this.sendLog(request);
    }
    
    public logOperation(request: chrome.webRequest.WebRequestBodyDetails, mode: PolicyMode): void {
        this.sendLog(request);
    }

    protected createNotification(mode: PolicyMode) {
        NotificationsHelper.showNotification(mode, OperationType.Upload);
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