import { PolicyMode } from "../Enums/PolicyMode";

type Policy = {
    SafeStorage: string[];
    StoragePolicySettings: {
        clipboard: PolicyMode;
        upload: PolicyMode;
        screenCapture: PolicyMode;
        print: PolicyMode;
    }
}

export class PolicyHelper {

    private static policy: Policy | undefined;

    /**
     * Initializes policy settings when the extension is loaded in a new session.
     * @param onSettingsLoaded Callback called when the policy is loaded from storage. All components dependent on the loaded settings should be initiated here.
     */
    public static init(onSettingsLoaded: () => void): void {
        console.log('Loading settings...');
        chrome.storage.managed.get(null, (items) => {
            this.policy = items as Policy;
            onSettingsLoaded();
            console.log('Policy settings loaded');
        });
    }

    /**
     * Get current policy settings.
     * @returns Current policy settings
     */
    public static getAllPolicies(): Policy | undefined {
        return this.policy;
    }

    /**
     * Get current policy settings for a given operation.
     * @param operation Operation for which to get the settings
     * @returns Policy mode that is set for given operation.
     */
    public static getStoragePolicy(operation: keyof Policy["StoragePolicySettings"]): PolicyMode {
        return this.policy?.StoragePolicySettings
            ? this.policy.StoragePolicySettings[operation]
            : PolicyMode.Unknown;
    }

    /**
     * Get URLs of cloud storages configured as safe.
     * @returns Array of URLs
     */
    public static getSafeStorages(): string[] {
        return this.policy?.SafeStorage
            ? this.policy.SafeStorage
            : [];
    }

    /**
     * Reloads the settings from storage.
     */
    public static updateSettings() {
        chrome.storage.managed.get(null, (items) => {
            this.policy = items as Policy;
        });
        console.log('Policy settings updated')
    }
}