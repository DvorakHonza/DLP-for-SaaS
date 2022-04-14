interface IUploadPage {
    readonly UploadUrls: string[];
    readonly UploadMethod: string;
    Name: string;
    
    blockUpload: () => chrome.webRequest.BlockingResponse;
    
    notify: () => void;
    
    logUpload: (info: any) => void;

    containsFileUpload: (detail: chrome.webRequest.WebRequestBodyDetails) => boolean;
}