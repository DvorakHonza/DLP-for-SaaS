import { PolicyMode } from "../../Enums/PolicyMode";
import { PolicyHelper } from "../../Helpers/PolicyHelper";
import { GoogleDrivePage } from "./UploadPages/GoogleDrivePage";
import { UloztoPage } from "./UploadPages/UloztoPage";
import { UploadPage } from "./UploadPages/UploadPage";
import { UschovnaPage } from "./UploadPages/UschovnaPage";

type TabPageContextDictionary = {
    [tabId: number]: UploadPage;
}

export class UploadPageContext {
    private page: UploadPage;
    private uploadPolicy: PolicyMode;
    private safeStorages: string[];

    private supportedUploadPages: Map<string, () => UploadPage> = new Map();

    private pageContexts: TabPageContextDictionary;

    constructor() {
        this.page = { } as UploadPage;
        this.uploadPolicy = PolicyHelper.getStoragePolicy('upload');
        this.safeStorages = PolicyHelper.getSafeStorages();
        this.pageContexts = { };

        this.initSupportedUploadPages();
    }

    public setUploadPage(tabId: number, page: string) {
        if (this.safeStorages.includes(page)) {
            console.log('This page is configured as a safe storage. Uploading will not be affected.');
            return;
        }
        if (!this.pageContexts[tabId] || this.pageContexts[tabId].Name !== page) {
            try {
                this.pageContexts[tabId] && this.removeUploadPageContext(tabId);
                this.pageContexts[tabId] = this.getNewPageContext(page);
            }
            catch (e) {
                console.warn(`Cannot create upload context for ${page}. Page '${page}' is not supported.`);
            }
        }
        this.page = this.pageContexts[tabId];
    }

    public switchUploadPageContext(tabId: number) {
        try {
            this.page = this.pageContexts[tabId];
            console.log(`Page context switched to ${this.page.Name} in tab ${tabId}.`)
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

    private getNewPageContext(url: string): UploadPage {
        let pageCreator: (() => UploadPage) | undefined = this.supportedUploadPages.get(url);
        if (pageCreator) {
            console.log(`Creating upload page context for ${url}`);
            return pageCreator();
        }
        else
            throw new Error(`Upload page handler for ${url} is not available`);
    }

    private initSupportedUploadPages() {
        this.supportedUploadPages.set('uloz.to', () => new UloztoPage());
        this.supportedUploadPages.set('www.uschovna.cz', () => new UschovnaPage());
        this.supportedUploadPages.set('drive.google.com', () => new GoogleDrivePage());
    }
}