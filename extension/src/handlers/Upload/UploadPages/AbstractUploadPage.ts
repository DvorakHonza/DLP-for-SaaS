export abstract class AbstractUploadPage implements IUploadPage {
    abstract readonly UploadUrls: string[];
    abstract readonly UploadMethod: string;
    abstract readonly Name: string;

    public blockUpload(): chrome.webRequest.BlockingResponse {
        return {
            cancel: true,
        }
    };
    public notify() {
        throw new Error('Not implemented');
    };
    public logUpload(info: any) {
        throw new Error('Not implemented');
    };

    containsFileUpload(detail: chrome.webRequest.WebRequestBodyDetails) {
        return detail.method === this.UploadMethod &&
            this.UploadUrls.some( url => detail.url.includes(url));
    };
}