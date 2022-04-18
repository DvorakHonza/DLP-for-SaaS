import { PolicyMode } from "../../../Enums/PolicyMode";
import { UploadPage } from "./UploadPage";

export class UloztoPage extends UploadPage {
    public readonly UploadUrls: string[] = ['upload.uloz.to'];
    public readonly UploadMethod: string = 'POST';
    public Name: string = 'uloz.to';

    private previousRequestBatchId: string = '';

    public blockOperation(request: chrome.webRequest.WebRequestBodyDetails, mode: PolicyMode): chrome.webRequest.BlockingResponse {
        let requestBatchId = this.getBatchId(request.url);
        if (this.previousRequestBatchId === requestBatchId) {
            console.log('Request is a part of previous request. Skipping.');
            return this.CancelResponse;
        }
        this.previousRequestBatchId = requestBatchId;
        return super.blockOperation(request, mode);
    }

    public getUploadData(detail: chrome.webRequest.WebRequestBodyDetails): string[] {
        let filePaths: string[] = [];
        detail.requestBody?.raw?.forEach(value => 
            value.file
            ? filePaths.push(value.file)
            : null
        );
        return filePaths;
    }

    private getBatchId(url: string): string {
        let matches = url.match(/batch_id=[a-z0-9-]*/);
        return matches ? matches[1] : '';
    }
}