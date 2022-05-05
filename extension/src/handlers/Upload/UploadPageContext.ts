import { PolicyMode } from "../../Enums/PolicyMode";
import { PolicyHelper } from "../../Helpers/PolicyHelper";
import { GoogleDrivePage } from "./UploadPages/GoogleDrivePage";
import { UloztoPage } from "./UploadPages/UloztoPage";
import { UploadPage } from "./UploadPages/UploadPage";
import { UschovnaPage } from "./UploadPages/UschovnaPage";

type TabPageContenxtDictionary = {
    [tabId: number]: UploadPage;
}

export class UploadPageContext {
    private page: UploadPage;
    private uploadPolicy: PolicyMode;
    private safeStorages: string[];

    private pageContexts: TabPageContenxtDictionary;

    constructor() {
        this.page = { } as UploadPage;
        this.uploadPolicy = PolicyHelper.getStoragePolicy('upload');
        this.safeStorages = PolicyHelper.getSafeStorages();
        this.pageContexts = { };
    }

    public setUploadPage(tabId: number, page: string) {
        if (this.safeStorages.includes(page)) {
            console.log('This page is configured as a safe storage. Uploading will not be affected.');
            return;
        }
        if (!this.pageContexts[tabId]) {
            this.pageContexts[tabId] = this.getPageContext(page);
        }
        this.page = this.pageContexts[tabId];
    }

    public switchUploadPageContext(tabId: number) {
        try {
            this.page = this.pageContexts[tabId];
            console.log(`Page context switched to ${this.page.Name}`)
        }
        catch (e) {
            console.warn(`Could not swap page context. Context for tab ${tabId} does not exist.`);
        }
    }

    public removeUploadPageContext(tabId: number) {
        try {
            console.log(`Deleting page context for ${this.pageContexts[tabId].Name} in tab no. ${tabId}`)
            delete this.pageContexts[tabId];
        }
        catch (e) {
            console.warn(`Could not delete page context. Context for tab ${tabId} was never created.`);
        }
    }

    public containsFileUpload(detail: chrome.webRequest.WebRequestBodyDetails): boolean {
        return this.page.containsFileUpload(detail);
    }

    public executeAction(request: chrome.webRequest.WebRequestBodyDetails) {
        return this.page.processRequest(request, this.uploadPolicy);
    }

    private getPageContext(url: string): UploadPage {
        console.log(`Creating upload page context for ${url}`);
        if (url === 'uloz.to')
            return new UloztoPage();
        else if (url === 'www.uschovna.cz')
            return new UschovnaPage();
        else if (url === 'drive.google.com')
            return new GoogleDrivePage();
        else
            throw new Error(`Upload page handler for ${url} is not available`);
    }
}