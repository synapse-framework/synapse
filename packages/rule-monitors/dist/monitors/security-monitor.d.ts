import type { Rule } from '@snps/rule-engine-rust';
export declare class SecurityMonitor {
    private lastUpdate;
    private rules;
    getRules(): Promise<Rule[]>;
    updateRules(): Promise<{
        source: string;
        rules: Rule[];
        timestamp: string;
        version: string;
    }>;
    private fetchGitHubAdvisories;
    private fetchCVEData;
    private fetchRustSecurity;
    private createGitHubRules;
    private createCVERules;
    private createRustSecurityRules;
    private getDefaultSecurityRules;
}
//# sourceMappingURL=security-monitor.d.ts.map