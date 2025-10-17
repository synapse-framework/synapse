#!/usr/bin/env node
interface CLIOptions {
    path?: string;
    config?: string;
    output?: string;
    format?: 'json' | 'html' | 'markdown';
    fix?: boolean;
    verbose?: boolean;
    watch?: boolean;
}
declare class RuleCLI {
    private system;
    private options;
    constructor(options?: CLIOptions);
    run(): Promise<void>;
    private loadConfig;
    private checkCodebase;
    private generateReport;
    private generateMarkdownReport;
    private generateHTMLReport;
    private autoFix;
    private fixViolation;
    private watchMode;
}
export { RuleCLI };
//# sourceMappingURL=cli.d.ts.map