import { UploadPage } from "./UploadPage";

export class UschovnaPage extends UploadPage {
    UploadUrls: string[] = ['uschovna.cz/ajax/ajax_upload/'];
    UploadMethod: string = 'POST';
    Name: string = 'uschovna.cz';

    public getUploadData(detail: chrome.webRequest.WebRequestBodyDetails): string {
        return '';
    }
}