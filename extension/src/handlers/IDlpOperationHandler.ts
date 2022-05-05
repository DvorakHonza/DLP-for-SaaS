import { PolicyMode } from "../Enums/PolicyMode";

export interface IDlpOperationHandler {
    blockOperation: (data: any, mode: PolicyMode) => any;
    
    notify: (data: any, mode: PolicyMode) => any;
    
    logOperation: (info: any, mode: PolicyMode) => void;
}