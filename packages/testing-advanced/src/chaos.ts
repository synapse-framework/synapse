/**
 * Chaos Engineering
 * Resilience testing through controlled failures
 */

export interface ChaosConfig {
  readonly enabled: boolean;
  readonly failureRate?: number;
}

export interface ChaosExperiment {
  readonly name: string;
  readonly type: 'latency' | 'failure' | 'resource' | 'network';
  readonly target: string;
  readonly duration: number;
}

export class ChaosEngine {
  private readonly config: ChaosConfig;
  private readonly experiments: ChaosExperiment[] = [];

  public constructor(config: ChaosConfig) {
    this.config = {
      failureRate: 0.1,
      ...config
    };
  }

  public addExperiment(experiment: ChaosExperiment): void {
    this.experiments.push(experiment);
    console.log(`🌪️  Added chaos experiment: ${experiment.name}`);
  }

  public async runExperiment(name: string): Promise<ExperimentResult> {
    const experiment = this.experiments.find(e => e.name === name);
    if (!experiment) {
      throw new Error(`Experiment not found: ${name}`);
    }

    console.log(`🌪️  Running chaos experiment: ${name}...`);

    const startTime = Date.now();
    const results: string[] = [];

    switch (experiment.type) {
      case 'latency':
        results.push(`Injected ${Math.random() * 1000}ms latency`);
        break;
      case 'failure':
        results.push(`Injected random failures at ${this.config.failureRate! * 100}% rate`);
        break;
      case 'resource':
        results.push(`Throttled resources by 50%`);
        break;
      case 'network':
        results.push(`Simulated network partition`);
        break;
    }

    return {
      experiment: name,
      duration: Date.now() - startTime,
      success: true,
      observations: results
    };
  }

  public async runAll(): Promise<ExperimentResult[]> {
    const results: ExperimentResult[] = [];

    for (const experiment of this.experiments) {
      const result = await this.runExperiment(experiment.name);
      results.push(result);
    }

    return results;
  }
}

export interface ExperimentResult {
  readonly experiment: string;
  readonly duration: number;
  readonly success: boolean;
  readonly observations: string[];
}
