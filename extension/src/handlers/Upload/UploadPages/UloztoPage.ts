import { UploadPage } from "./UploadPage";

export class UloztoPage extends UploadPage {
    public readonly UploadUrls: string[] = ['upload.uloz.to'];
    public readonly UploadMethod: string = 'POST';
    public Name: string = 'uloz.to';
    
    public getUploadData(detail: chrome.webRequest.WebRequestBodyDetails): string {
        detail.requestBody?.raw?.forEach( value => value)
        return '';
    }
}