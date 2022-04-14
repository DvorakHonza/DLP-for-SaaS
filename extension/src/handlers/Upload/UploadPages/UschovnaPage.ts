export class UschovnaPage implements IUploadPage {
    UploadUrls: string[] = ['uschovna.cz/ajax/ajax_upload/'];
    UploadMethod: string = 'POST';
    Name: string = 'uschovna.cz';

    blockUpload = () => {
        throw new Error('Not implemented');
    };

    notify = () => {
        throw new Error('Not implemented');
    };

    logUpload = (info: any) => {
        throw new Error('Not implemented');
    };

    containsFileUpload = (detail: chrome.webRequest.WebRequestBodyDetails) => {
        return detail.method === this.UploadMethod &&
            this.UploadUrls.some( url => detail.url.includes(url));
    };

}