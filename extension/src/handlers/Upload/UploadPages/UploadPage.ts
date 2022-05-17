import { MessageType } from "../../../Enums/MessageType";
import { OperationType } from "../../../Enums/OperationType";
import { PolicyMode } from "../../../Enums/PolicyMode";
import { Notifications } from "../../../Helpers/NotificationsHelper";
import { IDlpOperationHandler } from "../../IDlpOperationHandler"
import { Messenger } from "../../Messaging/NativeMessaging";

export type URLPattern = string | RegExp;

export abstract class UploadPage implements IDlpOperationHandler {
    abstract readonly UploadUrls: URLPattern[];
    abstract readonly UploadMethod: string;
    abstract readonly Name: string;

    protected CancelResponse: chrome.webRequest.BlockingResponse = { cancel: true };

    //#region Abstract methods
    /**
     * Retrieves available information from giver request
     * @param detail Request detail
     */
    public abstract getUploadData(detail: chrome.webRequest.WebRequestBodyDetails): any;
    //#endregion

    /**
     * Processes the request based on a current upload policy
     * @param request Request detail
     * @param mode Current upload policy
     * @returns BlockingRespone if the policy is set to block, nothing otherwise
     */
    public processRequest(request: chrome.webRequest.WebRequestBodyDetails, mode: PolicyMode): void | chrome.webRequest.BlockingResponse {
        switch(mode) {
            case PolicyMode.Block:
                return this.blockOperation(request);

            case PolicyMode.Notify:
                return this.notify(request);

            case PolicyMode.Log:
                return this.logOperation(request);

            case PolicyMode.Unknown:
                console.warn('Invalid upload policy value set. No action taken.');
        }
    }

    /**
     * Handles Block policy action
     * @param request Processed request
     * @returns Blocking response
     */
    public blockOperation(request: chrome.webRequest.WebRequestBodyDetails): chrome.webRequest.BlockingResponse {
        this.createNotification(PolicyMode.Block);
        this.sendLog(request);
        return this.CancelResponse;
    }
    
    /**
     * Handles Notify policy action
     * @param request Processed request
     */
    public notify(request: chrome.webRequest.WebRequestBodyDetails): void{
        this.createNotification(PolicyMode.Notify);
        this.sendLog(request);
    }
    
    /**
     * Handle Log policy action
     * @param request Processed request
     */
    public logOperation(request: chrome.webRequest.WebRequestBodyDetails): void {
        this.sendLog(request);
    }

    /**
     * Creates notification based on a policy mode
     * @param mode Current upload policy mode
     */
    protected createNotification(mode: PolicyMode): void {
        Notifications.showNotification(mode, OperationType.Upload);
    }

    /**
     * Retrieves data from a request and sends a log to database
     * @param request 
     */
    protected sendLog(request: chrome.webRequest.WebRequestBodyDetails) {
        console.log('Sending log about upload operation to database.')
        Messenger.sendNativeMessage({
            type: MessageType.DLP,
            operation: OperationType.Upload,
            url: request.url.slice(0, request.url.indexOf('?')),
            ...this.getUploadData(request),
        });
    }

    /**
     * Determines whether a request contains a file upload
     * @param detail Request detail
     * @returns true if request contains an upload, false otherwise
     */
    public containsFileUpload(detail: chrome.webRequest.WebRequestBodyDetails): boolean {
        return detail.method === this.UploadMethod &&
            this.UploadUrls.some( url => detail.url.match(url));
    }
}