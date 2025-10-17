import type { Rule } from '@snps/rule-engine-rust';
export declare class CompatibilityMonitor {
    private lastUpdate;
    private rules;
    getRules(): Promise<Rule[]>;
    updateRules(): Promise<{
        source: string;
        rules: Rule[];
        timestamp: string;
        version: string;
    }>;
    private fetchBrowserSupport;
    private fetchNodeVersions;
    private fetchRustEditions;
    private createBrowserRules;
    private createNodeRules;
    private createRustRules;
    private getDefaultCompatibilityRules;
}
//# sourceMappingURL=compatibility-monitor.d.ts.map