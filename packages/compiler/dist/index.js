/**
 * @snps/compiler - Synapse Framework Compiler - High-performance TypeScript compilation with Rust backend
 */
export class SynapseCompiler {
    name = 'SynapseCompiler';
    version = '0.1.0';
    constructor() {
        console.log('@snps/compiler initialized');
    }
    async initialize() {
        console.log('✅ Compiler initialized successfully');
    }
    getInfo() {
        return {
            name: this.name,
            version: this.version,
            features: ["TypeScript Compilation", "Rust Backend", "Parallel Processing", "Source Maps", "Minification"]
        };
    }
}
// Default export
export default SynapseCompiler;
//# sourceMappingURL=index.js.map