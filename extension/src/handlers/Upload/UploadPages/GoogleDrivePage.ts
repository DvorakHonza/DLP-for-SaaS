import { PolicyMode } from '../../../Enums/PolicyMode';
import { UploadPage, URLPattern } from './UploadPage';
import { Buffer } from 'buffer';

export class GoogleDrivePage extends UploadPage {
    UploadUrls: URLPattern[] = [new RegExp(/clients\d\.google\.com\/upload\/drive/)];
    UploadMethod: string = 'PUT';
    Name: string = 'Google Drive';

    private requestFinished: boolean = true;

    public blockOperation(request: chrome.webRequest.WebRequestBodyDetails, mode: PolicyMode): chrome.webRequest.BlockingResponse {

        // File upload is performed through PUT request which is repeated couple times if the previous request is blocked
        // After couple repeated requests a POST request containing error for the server is sent
        // Only the first PUT request is logged
        if (request.method === 'POST') {
            this.requestFinished = true;
            return { };
        }
        if (request.method === 'PUT' && !this.requestFinished) {
            return this.CancelResponse;
        }
        this.requestFinished = false;
        console.log(this.parseRequest(request));
        return super.blockOperation(request, mode);
    }

    public getUploadData(detail: chrome.webRequest.WebRequestBodyDetails) {
        let payload = this.parseRequest(detail);
        let data = this.getFileInfo(payload);
        return data?.fileContent.toString('ascii');
    }

    public containsFileUpload(detail: chrome.webRequest.WebRequestBodyDetails): boolean {
        return (
            super.containsFileUpload(detail)
            || detail.url.includes('https://drive.google.com/drive/jserror')
        );
    }

    private parseRequest(detail: chrome.webRequest.WebRequestBodyDetails): string {
        let decoder = new TextDecoder('utf-8');
        let data = detail.requestBody?.raw ?? [];
        return decoder.decode(data[0].bytes);
    }

    private getBoundary(request: string): string | undefined {
        let matches = request.match(/(?<=boundary=")\w*/);
        return matches ? matches[0] : undefined;
    }

    private getFileInfo(request: string) {
        let payload = this.getRequestPayload(request);
        if (payload) {
            let [encoding, type, ,fileContent] = payload.split('\r\n');
            return {
                encoding: encoding.slice(encoding.indexOf(' ') + 1),
                type: type.slice(type.indexOf(' ') + 1),
                fileContent: Buffer.from(fileContent, 'base64'),
            }
        }
    }

    private getRequestPayload(request: string): string | undefined {
        let boundary = this.getBoundary(request);
        if (boundary) {
            let re = new RegExp(`(?<=.\\r\\n--${boundary}\\r\\n)([\\w\\s:\\=\\-\\/\\+]*)(?=--${boundary}--)`, 'mg');
            let matches = request.match(re);
            return matches ? matches[0] : undefined;
        }
    }
}