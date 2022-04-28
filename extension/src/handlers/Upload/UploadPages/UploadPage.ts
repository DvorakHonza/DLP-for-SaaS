import { MessageType } from "../../../Enums/MessageType";
import { OperationType } from "../../../Enums/OperationType";
import { PolicyMode } from "../../../Enums/PolicyMode";
import { IDlpOperationHandler } from "../../IDlpOperationHandler"
import { sendNativeMessage } from "../../Messaging/NativeMessaging";

export type URLPattern = string | RegExp;

export abstract class UploadPage implements IDlpOperationHandler {
    abstract readonly UploadUrls: URLPattern[];
    abstract readonly UploadMethod: string;
    abstract readonly Name: string;

    protected CancelResponse: chrome.webRequest.BlockingResponse = { cancel: true };
    
    //#region Abstract methods
    public abstract getUploadData(detail: chrome.webRequest.WebRequestBodyDetails): any;
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
        this.createNotification();
        this.sendLog(request);
        return this.CancelResponse;
    }
    
    public notify(request: chrome.webRequest.WebRequestBodyDetails, mode: PolicyMode): void | chrome.webRequest.BlockingResponse {
        this.createNotification();
        this.sendLog(request);
    }
    
    public logOperation(request: chrome.webRequest.WebRequestBodyDetails, mode: PolicyMode): void {
        this.sendLog(request);
    }

    protected createNotification() {
        console.log('Creating notification.');
    }

    protected sendLog(request: chrome.webRequest.WebRequestBodyDetails) {
        console.log('Sending log about upload operation to database.')
        sendNativeMessage({
            type: MessageType.DLP,
            operation: OperationType.Upload,
            url: request.url,
            ...this.getUploadData(request),
        });
    }

    public containsFileUpload(detail: chrome.webRequest.WebRequestBodyDetails) {
        return detail.method === this.UploadMethod &&
            this.UploadUrls.some( url => detail.url.match(url));
    }
}