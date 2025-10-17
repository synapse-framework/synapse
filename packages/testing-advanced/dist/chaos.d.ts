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
export declare class ChaosEngine {
    private readonly config;
    private readonly experiments;
    constructor(config: ChaosConfig);
    addExperiment(experiment: ChaosExperiment): void;
    runExperiment(name: string): Promise<ExperimentResult>;
    runAll(): Promise<ExperimentResult[]>;
}
export interface ExperimentResult {
    readonly experiment: string;
    readonly duration: number;
    readonly success: boolean;
    readonly observations: string[];
}
//# sourceMappingURL=chaos.d.ts.map