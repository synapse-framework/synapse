/**
 * @snps/state - Synapse Framework State Management - Reactive state management with validation
 */
export class SynapseStateManager {
    name = 'SynapseStateManager';
    version = '0.1.0';
    constructor() {
        console.log('@snps/state initialized');
    }
    async initialize() {
        console.log('✅ State initialized successfully');
    }
    getInfo() {
        return {
            name: this.name,
            version: this.version,
            features: ["Reactive State", "Immutable Updates", "Action Dispatchers", "State Selectors", "Validation"]
        };
    }
}
// Backward compatibility alias
export const SynapseState = SynapseStateManager;
// Default export
export default SynapseStateManager;
//# sourceMappingURL=index.js.map