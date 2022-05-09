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

    /**
     * Sets page handler based on page opened in active tab
     * @param tabId Id of active tab
     * @param page Host name of opened page in the tab with tabId
     * @returns nothing
     */
    public setUploadPage(tabId: number, page: string): void {
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

    /**
     * Changes existing upload pages based on active tab
     * @param tabId Id of the active tab
     */
    public switchUploadPageContext(tabId: number) {
        try {
            this.page = this.pageContexts[tabId];
            console.log(`Page context switched to ${this.page.Name} in tab ${tabId}.`)
        }
        catch (e) {
            console.warn(`Could not swap page context. Context for tab ${tabId} does not exist.`);
        }
    }

    /**
     * Removes upload page based on active tab
     * @param tabId Id of the active tab
     */
    public removeUploadPageContext(tabId: number) {
        try {
            console.log(`Deleting page context for ${this.pageContexts[tabId].Name} in tab no. ${tabId}`)
            delete this.pageContexts[tabId];
        }
        catch (e) {
            console.warn(`Could not delete page context. Context for tab ${tabId} was never created.`);
        }
    }

    /**
     * Determines whether an HTTP request contains file upload
     * @param detail An HTTP request detail
     * @returns true if request contains file upload, false otherwise
     */
    public containsFileUpload(detail: chrome.webRequest.WebRequestBodyDetails): boolean {
        return this.page.containsFileUpload(detail);
    }

    /**
     * Executes a corrective action based on a set policy
     * @param request Request detail
     * @returns BlockingRequest if policy is set Block, void otherwise
     */
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