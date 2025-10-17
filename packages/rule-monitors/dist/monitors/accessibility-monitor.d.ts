import type { Rule } from '@snps/rule-engine-rust';
export declare class AccessibilityMonitor {
    private lastUpdate;
    private rules;
    getRules(): Promise<Rule[]>;
    updateRules(): Promise<{
        source: string;
        rules: Rule[];
        timestamp: string;
        version: string;
    }>;
    private fetchWCAGGuidelines;
    private fetchAxeRules;
    private fetchAccessibilityStandards;
    private createWCAGRules;
    private createAxeRules;
    private createAccessibilityRules;
    private getDefaultAccessibilityRules;
}
//# sourceMappingURL=accessibility-monitor.d.ts.map