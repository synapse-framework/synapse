/**
 * Anomaly Detector - Detect anomalies in metric data
 */
export type AnomalyType = 'spike' | 'drop' | 'trend_change' | 'outlier';
export interface AnomalyConfig {
    readonly sensitivity: number;
    readonly minDataPoints: number;
    readonly stdDevThreshold: number;
    readonly enableSpike: boolean;
    readonly enableDrop: boolean;
    readonly enableTrendChange: boolean;
    readonly enableOutlier: boolean;
}
export interface Anomaly {
    readonly type: AnomalyType;
    readonly timestamp: number;
    readonly value: number;
    readonly expectedValue: number;
    readonly deviation: number;
    readonly confidence: number;
    readonly description: string;
}
export declare class AnomalyDetector {
    private readonly config;
    private dataHistory;
    constructor(config?: Partial<AnomalyConfig>);
    detect(metric: string, value: number, timestamp: number): Anomaly[];
    private detectSpike;
    private detectDrop;
    private detectOutlier;
    private detectTrendChange;
    private calculateStats;
    private calculateSlope;
    reset(): void;
    resetMetric(metric: string): void;
    getConfig(): Readonly<AnomalyConfig>;
}
//# sourceMappingURL=anomaly-detector.d.ts.map