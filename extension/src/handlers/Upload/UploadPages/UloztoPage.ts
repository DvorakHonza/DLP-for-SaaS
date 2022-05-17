import { PolicyMode } from "../../../Enums/PolicyMode";
import { UploadPage } from "./UploadPage";

export class UloztoPage extends UploadPage {
    public readonly UploadUrls: string[] = ['upload.uloz.to'];
    public readonly UploadMethod: string = 'POST';
    public Name: string = 'uloz.to';

    private previousRequestBatchId: string = '';
    private previousFileName: string = '';

    public blockOperation(request: chrome.webRequest.WebRequestBodyDetails): chrome.webRequest.BlockingResponse {
        let requestBatchId = this.getBatchId(request.url);
        let { filename } = this.getUploadData(request);
        if (this.previousRequestBatchId === requestBatchId && filename === this.previousFileName) {
            console.log('Request is a part of previous request. Skipping.');
            return this.CancelResponse;
        }
        this.previousRequestBatchId = requestBatchId;
        this.previousFileName = filename;
        return super.blockOperation(request);
    }

    public getUploadData(detail: chrome.webRequest.WebRequestBodyDetails) {
        let filePaths: string[] = [];
        detail.requestBody?.raw?.forEach(value => 
            value.file
            ? filePaths.push(value.file)
            : null
        );
        return { data: '', filename: filePaths.join(',') };
    }

    private getBatchId(url: string): string {
        let matches = url.match(/batch_id=[a-z0-9-]*/);
        return matches ? matches[1] : '';
    }
}