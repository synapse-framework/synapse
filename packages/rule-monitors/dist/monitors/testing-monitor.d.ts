import type { Rule } from '@snps/rule-engine-rust';
export declare class TestingMonitor {
    private lastUpdate;
    private rules;
    getRules(): Promise<Rule[]>;
    updateRules(): Promise<{
        source: string;
        rules: Rule[];
        timestamp: string;
        version: string;
    }>;
    private fetchJestConfig;
    private fetchCoverageStandards;
    private fetchTestPatterns;
    private createJestRules;
    private createCoverageRules;
    private createTestPatternRules;
    private getDefaultTestingRules;
}
//# sourceMappingURL=testing-monitor.d.ts.map