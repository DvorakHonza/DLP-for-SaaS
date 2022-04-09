import { PolicyMode } from "../enums/policy_mode";

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

    private policy: Policy | undefined;
    private static instance: PolicyHelper | undefined;

    private constructor() {
        chrome.storage.managed.get(null, (items) => {
            this.policy = items as Policy;
        });
    }

    public static getInstance(): PolicyHelper {
        if (!this.instance) {
            this.instance = new PolicyHelper(); 
            console.log('Creating new PolicyHelper instance');
        }
        return this.instance;
    }

    public getAllPolicies(): Policy | undefined {
        return this.policy;
    }

    public getStoragePolicy(policy: keyof Policy["StoragePolicySettings"]): PolicyMode {
        return this.policy?.StoragePolicySettings
            ? this.policy.StoragePolicySettings[policy]
            : PolicyMode.Unknown;
    }

    public updateSettings() {
        chrome.storage.managed.get(null, (items) => {
            this.policy = items as Policy;
        });
        console.log('Policy settings updated')
    }

}
