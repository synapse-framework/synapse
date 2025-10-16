/**
 * Main Advanced Testing System
 */

import { MutationTester } from './mutation.js';
import { PropertyTester } from './property.js';
import { ChaosEngine } from './chaos.js';
import { LoadTester } from './load.js';

export class AdvancedTesting {
  private readonly mutationTester: MutationTester;
  private readonly propertyTester: PropertyTester;
  private readonly chaosEngine: ChaosEngine;
  private readonly loadTester: LoadTester;

  public constructor() {
    this.mutationTester = new MutationTester({ threshold: 80 });
    this.propertyTester = new PropertyTester({ iterations: 100 });
    this.chaosEngine = new ChaosEngine({ enabled: true });
    this.loadTester = new LoadTester({ concurrency: 10, duration: 60000 });
  }

  public getMutationTester(): MutationTester {
    return this.mutationTester;
  }

  public getPropertyTester(): PropertyTester {
    return this.propertyTester;
  }

  public getChaosEngine(): ChaosEngine {
    return this.chaosEngine;
  }

  public getLoadTester(): LoadTester {
    return this.loadTester;
  }
}
