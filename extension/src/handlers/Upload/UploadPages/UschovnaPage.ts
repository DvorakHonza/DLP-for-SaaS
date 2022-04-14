import { AbstractUploadPage } from "./AbstractUploadPage";

export class UschovnaPage extends AbstractUploadPage {
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
}