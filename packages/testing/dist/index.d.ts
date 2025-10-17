/**
 * @snps/testing - Synapse Framework Testing - TDD enforcement with 100% coverage requirement
 */
export declare class SynapseTestingFramework {
    readonly name = "SynapseTestingFramework";
    readonly version = "0.1.0";
    constructor();
    initialize(): Promise<void>;
    getInfo(): {
        name: string;
        version: string;
        features: string[];
    };
}
export declare const SynapseTesting: typeof SynapseTestingFramework;
export default SynapseTestingFramework;
//# sourceMappingURL=index.d.ts.map