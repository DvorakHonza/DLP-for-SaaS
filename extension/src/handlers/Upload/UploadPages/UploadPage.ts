export abstract class UploadPage implements IUploadPage {
    abstract readonly UploadUrls: string[];
    abstract readonly UploadMethod: string;
    abstract readonly Name: string;

    public blockUpload(): chrome.webRequest.BlockingResponse {
        console.log('Blocking request');
        return {
            cancel: true,
        }
    };

    public notify() {
        console.log('Creating notification');
    };
    
    public logUpload(info: any) {
        console.log('Creating log');
    };

    public containsFileUpload(detail: chrome.webRequest.WebRequestBodyDetails) {
        return detail.method === this.UploadMethod &&
            this.UploadUrls.some( url => detail.url.includes(url));
    };

    public abstract getUploadData(detail: chrome.webRequest.WebRequestBodyDetails): string;
}