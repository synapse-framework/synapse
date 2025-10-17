/**
 * Main Advanced Testing System
 */
import { MutationTester } from './mutation.js';
import { PropertyTester } from './property.js';
import { ChaosEngine } from './chaos.js';
import { LoadTester } from './load.js';
export declare class AdvancedTesting {
    private readonly mutationTester;
    private readonly propertyTester;
    private readonly chaosEngine;
    private readonly loadTester;
    constructor();
    getMutationTester(): MutationTester;
    getPropertyTester(): PropertyTester;
    getChaosEngine(): ChaosEngine;
    getLoadTester(): LoadTester;
}
//# sourceMappingURL=advanced-testing.d.ts.map