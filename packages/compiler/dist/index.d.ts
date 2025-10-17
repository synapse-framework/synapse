/**
 * @snps/compiler - Synapse Framework Compiler - High-performance TypeScript compilation with Rust backend
 */
export declare class SynapseCompiler {
    readonly name = "SynapseCompiler";
    readonly version = "0.1.0";
    constructor();
    initialize(): Promise<void>;
    getInfo(): {
        name: string;
        version: string;
        features: string[];
    };
}
export default SynapseCompiler;
//# sourceMappingURL=index.d.ts.map