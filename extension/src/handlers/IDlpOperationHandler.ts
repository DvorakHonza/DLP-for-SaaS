import { PolicyMode } from "../Enums/PolicyMode";

export interface IDlpOperationHandler {
    blockOperation: (data: any, mode: PolicyMode) => any;
    
    notify: (data: any, mode: PolicyMode) => void;
    
    logOperation: (info: any, mode: PolicyMode) => void;
}