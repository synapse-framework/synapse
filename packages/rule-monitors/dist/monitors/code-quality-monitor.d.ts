import type { Rule } from '@snps/rule-engine-rust';
export declare class CodeQualityMonitor {
    private lastUpdate;
    private rules;
    getRules(): Promise<Rule[]>;
    updateRules(): Promise<{
        source: string;
        rules: Rule[];
        timestamp: string;
        version: string;
    }>;
    private fetchESLintRules;
    private fetchPrettierConfig;
    private fetchTypeScriptConfig;
    private createESLintRules;
    private createPrettierRules;
    private createTypeScriptRules;
    private getDefaultCodeQualityRules;
}
//# sourceMappingURL=code-quality-monitor.d.ts.map