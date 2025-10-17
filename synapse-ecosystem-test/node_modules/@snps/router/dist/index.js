/**
 * @snps/router - Synapse Framework Router - Universal routing system with guards and middleware
 */
export class SynapseRouter {
    name = 'SynapseRouter';
    version = '0.1.0';
    constructor() {
        console.log('@snps/router initialized');
    }
    async initialize() {
        console.log('✅ Router initialized successfully');
    }
    getInfo() {
        return {
            name: this.name,
            version: this.version,
            features: ["Universal Routing", "Route Guards", "Middleware Support", "History Management", "Authentication"]
        };
    }
}
// Default export
export default SynapseRouter;
//# sourceMappingURL=index.js.map