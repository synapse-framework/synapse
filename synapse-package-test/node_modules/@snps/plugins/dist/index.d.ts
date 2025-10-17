/**
 * @snps/plugins - Synapse Framework Plugin System - Extensible architecture with strict guidelines
 */
export declare class SynapsePluginSystem {
    readonly name = "SynapsePluginSystem";
    readonly version = "0.1.0";
    constructor();
    initialize(): Promise<void>;
    getInfo(): {
        name: string;
        version: string;
        features: string[];
    };
}
export declare const SynapsePlugins: typeof SynapsePluginSystem;
export default SynapsePluginSystem;
//# sourceMappingURL=index.d.ts.map