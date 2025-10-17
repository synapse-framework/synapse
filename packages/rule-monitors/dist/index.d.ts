import { RuleEngine } from '@snps/rule-engine-rust';
export interface MonitorConfig {
    enabled: boolean;
    updateInterval: number;
    dataSources: string[];
    rules: string[];
}
export interface MonitorResult {
    monitor: string;
    status: 'success' | 'warning' | 'error';
    message: string;
    data: any;
    timestamp: string;
    executionTime: number;
}
export interface RuleUpdate {
    source: string;
    rules: any[];
    timestamp: string;
    version: string;
}
export declare class RuleMonitorSystem {
    private engine;
    private monitors;
    private config;
    private updateInterval;
    constructor();
    private initializeMonitors;
    start(): Promise<void>;
    stop(): Promise<void>;
    private loadInitialRules;
    private startMonitoring;
    updateAllRules(): Promise<MonitorResult[]>;
    checkCodebase(path: string): Promise<any>;
    checkFile(path: string): Promise<any>;
    getEngine(): RuleEngine;
    getMonitorStatus(): Map<string, MonitorResult>;
    updateMonitorConfig(monitorName: string, config: MonitorConfig): void;
    getMonitorConfig(monitorName: string): MonitorConfig | undefined;
}
export { SecurityMonitor } from './monitors/security-monitor.js';
export { PerformanceMonitor } from './monitors/performance-monitor.js';
export { CodeQualityMonitor } from './monitors/code-quality-monitor.js';
export { AccessibilityMonitor } from './monitors/accessibility-monitor.js';
export { CompatibilityMonitor } from './monitors/compatibility-monitor.js';
export { TestingMonitor } from './monitors/testing-monitor.js';
//# sourceMappingURL=index.d.ts.map