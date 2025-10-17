/**
 * @snps/linting - Synapse Framework Linting - 92 strict rules for code quality and best practices
 */
export declare class SynapseLintingSystem {
    readonly name = "SynapseLintingSystem";
    readonly version = "0.1.0";
    constructor();
    initialize(): Promise<void>;
    getInfo(): {
        name: string;
        version: string;
        features: string[];
    };
}
export declare const SynapseLinting: typeof SynapseLintingSystem;
export default SynapseLintingSystem;
//# sourceMappingURL=index.d.ts.map