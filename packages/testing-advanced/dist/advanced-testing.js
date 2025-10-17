/**
 * Main Advanced Testing System
 */
import { MutationTester } from './mutation.js';
import { PropertyTester } from './property.js';
import { ChaosEngine } from './chaos.js';
import { LoadTester } from './load.js';
export class AdvancedTesting {
    mutationTester;
    propertyTester;
    chaosEngine;
    loadTester;
    constructor() {
        this.mutationTester = new MutationTester({ threshold: 80 });
        this.propertyTester = new PropertyTester({ iterations: 100 });
        this.chaosEngine = new ChaosEngine({ enabled: true });
        this.loadTester = new LoadTester({ concurrency: 10, duration: 60000 });
    }
    getMutationTester() {
        return this.mutationTester;
    }
    getPropertyTester() {
        return this.propertyTester;
    }
    getChaosEngine() {
        return this.chaosEngine;
    }
    getLoadTester() {
        return this.loadTester;
    }
}
//# sourceMappingURL=advanced-testing.js.map