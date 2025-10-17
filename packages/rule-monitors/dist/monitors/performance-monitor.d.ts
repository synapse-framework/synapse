import type { Rule } from '@snps/rule-engine-rust';
export declare class PerformanceMonitor {
    private lastUpdate;
    private rules;
    getRules(): Promise<Rule[]>;
    updateRules(): Promise<{
        source: string;
        rules: Rule[];
        timestamp: string;
        version: string;
    }>;
    private fetchLighthouseStandards;
    private fetchBundleAnalysisData;
    private fetchPerformanceStandards;
    private createLighthouseRules;
    private createBundleRules;
    private createPerformanceRules;
    private getDefaultPerformanceRules;
}
//# sourceMappingURL=performance-monitor.d.ts.map