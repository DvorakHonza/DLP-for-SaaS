import { PolicyMode } from "../enums/PolicyMode";

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

    public static init(): void {
        console.log('Waiting for settings...');
        chrome.storage.managed.get(null, (items) => {
            this.policy = items as Policy;
            console.log('Policy settings set');
        });
    }

    public static getAllPolicies(): Policy | undefined {
        return this.policy;
    }

    public static getStoragePolicy(policy: keyof Policy["StoragePolicySettings"]): PolicyMode {
        return this.policy?.StoragePolicySettings
            ? this.policy.StoragePolicySettings[policy]
            : PolicyMode.Unknown;
    }

    public static getSafeStorages(): string[] {
        return this.policy?.SafeStorage
            ? this.policy.SafeStorage
            : [];
    }

    public static updateSettings() {
        chrome.storage.managed.get(null, (items) => {
            this.policy = items as Policy;
        });
        console.log('Policy settings updated')
    }
}