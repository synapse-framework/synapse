/**
 * @snps/state - Synapse Framework State Management - Reactive state management with validation
 */
export declare class SynapseStateManager {
    readonly name = "SynapseStateManager";
    readonly version = "0.1.0";
    constructor();
    initialize(): Promise<void>;
    getInfo(): {
        name: string;
        version: string;
        features: string[];
    };
}
export declare const SynapseState: typeof SynapseStateManager;
export default SynapseStateManager;
//# sourceMappingURL=index.d.ts.map