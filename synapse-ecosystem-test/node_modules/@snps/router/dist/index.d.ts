/**
 * @snps/router - Synapse Framework Router - Universal routing system with guards and middleware
 */
export declare class SynapseRouter {
    readonly name = "SynapseRouter";
    readonly version = "0.1.0";
    constructor();
    initialize(): Promise<void>;
    getInfo(): {
        name: string;
        version: string;
        features: string[];
    };
}
export default SynapseRouter;
//# sourceMappingURL=index.d.ts.map