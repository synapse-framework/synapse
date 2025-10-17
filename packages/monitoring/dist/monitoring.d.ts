/**
 * Main Monitoring System
 *
 * Centralized monitoring and observability platform
 */
import { PerformanceMonitor } from './performance-monitor.js';
import { Profiler } from './profiler.js';
import { MetricsCollector } from './metrics.js';
import { ErrorTracker } from './error-tracker.js';
import { AlertSystem } from './alerts.js';
import { WebVitalsMonitor } from './web-vitals.js';
import { RealUserMonitoring } from './rum.js';
export interface MonitoringConfig {
    readonly enableProfiling: boolean;
    readonly enableMetrics: boolean;
    readonly enableErrorTracking: boolean;
    readonly enableAlerts: boolean;
    readonly enableWebVitals: boolean;
    readonly enableRUM: boolean;
    readonly sampleRate: number;
    readonly reportingInterval: number;
}
export declare class SynapseMonitoring {
    private readonly config;
    private readonly performanceMonitor;
    private readonly profiler;
    private readonly metricsCollector;
    private readonly errorTracker;
    private readonly alertSystem;
    private readonly webVitals;
    private readonly rum;
    private isRunning;
    constructor(config?: Partial<MonitoringConfig>);
    start(): void;
    stop(): void;
    getReport(): MonitoringReport;
    getPerformanceMonitor(): PerformanceMonitor;
    getProfiler(): Profiler;
    getMetricsCollector(): MetricsCollector;
    getErrorTracker(): ErrorTracker;
    getAlertSystem(): AlertSystem;
    getWebVitalsMonitor(): WebVitalsMonitor;
    getRUM(): RealUserMonitoring;
}
export interface MonitoringReport {
    readonly performance: unknown;
    readonly profiling: unknown;
    readonly metrics: unknown;
    readonly errors: unknown;
    readonly alerts: unknown;
    readonly webVitals: unknown;
    readonly rum: unknown;
}
//# sourceMappingURL=monitoring.d.ts.map