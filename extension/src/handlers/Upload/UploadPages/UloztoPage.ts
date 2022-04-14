import { AbstractUploadPage } from "./AbstractUploadPage";

export class UloztoPage extends AbstractUploadPage {
    public readonly UploadUrls: string[] = ['upload.uloz.to'];
    public readonly UploadMethod: string = 'POST';
    public Name: string = 'uloz.to';
    
    public getContent(detail: chrome.webRequest.WebRequestBodyDetails): string {
        detail.requestBody?.raw?.forEach( value => value)
        return '';
    }
    
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
}