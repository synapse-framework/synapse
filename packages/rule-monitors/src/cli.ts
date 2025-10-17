#!/usr/bin/env node

import { RuleMonitorSystem } from './index.js';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

interface CLIOptions {
  path?: string;
  config?: string;
  output?: string;
  format?: 'json' | 'html' | 'markdown';
  fix?: boolean;
  verbose?: boolean;
  watch?: boolean;
}

class RuleCLI {
  private system: RuleMonitorSystem;
  private options: CLIOptions;

  constructor(options: CLIOptions = {}) {
    this.system = new RuleMonitorSystem();
    this.options = {
      path: '.',
      config: 'rules.config.json',
      output: 'rules-report',
      format: 'markdown',
      fix: false,
      verbose: false,
      watch: false,
      ...options
    };
  }

  async run(): Promise<void> {
    try {
      console.log('🚀 Starting Synapse Rule Engine...');
      
      // Start the rule monitoring system
      await this.system.start();
      
      // Load configuration if exists
      await this.loadConfig();
      
      // Run rule checks
      const result = await this.checkCodebase();
      
      // Generate report
      await this.generateReport(result);
      
      // Auto-fix if requested
      if (this.options.fix) {
        await this.autoFix(result);
      }
      
      // Watch mode
      if (this.options.watch) {
        await this.watchMode();
      }
      
      console.log('✅ Rule checking completed!');
      
      // Exit with error code if there are critical violations
      if (result.summary.critical_count > 0 || result.summary.high_count > 0) {
        process.exit(1);
      }
      
    } catch (error) {
      console.error('❌ Error running rule engine:', error);
      process.exit(1);
    }
  }

  private async loadConfig(): Promise<void> {
    try {
      const configPath = resolve(this.options.config!);
      const configContent = readFileSync(configPath, 'utf-8');
      const config = JSON.parse(configContent);
      
      // Apply configuration
      for (const [monitorName, monitorConfig] of Object.entries(config.monitors || {})) {
        this.system.updateMonitorConfig(monitorName, monitorConfig as any);
      }
      
      console.log(`📋 Loaded configuration from ${configPath}`);
    } catch (error) {
      if (this.options.verbose) {
        console.warn(`⚠️  Could not load config file: ${(error as Error).message}`);
      }
    }
  }

  private async checkCodebase(): Promise<any> {
    const path = resolve(this.options.path!);
    console.log(`🔍 Checking codebase at: ${path}`);
    
    const result = await this.system.checkCodebase(path);
    
    console.log(`📊 Found ${result.summary.total_violations} violations:`);
    console.log(`   Critical: ${result.summary.critical_count}`);
    console.log(`   High: ${result.summary.high_count}`);
    console.log(`   Medium: ${result.summary.medium_count}`);
    console.log(`   Low: ${result.summary.low_count}`);
    console.log(`   Auto-fixable: ${result.summary.auto_fixable_count}`);
    
    return result;
  }

  private async generateReport(result: any): Promise<void> {
    const outputPath = resolve(`${this.options.output}.${this.options.format}`);
    
    switch (this.options.format) {
      case 'json':
        writeFileSync(outputPath, JSON.stringify(result, null, 2));
        break;
      case 'html':
        writeFileSync(outputPath, this.generateHTMLReport(result));
        break;
      case 'markdown':
      default:
        writeFileSync(outputPath, this.generateMarkdownReport(result));
        break;
    }
    
    console.log(`📄 Report generated: ${outputPath}`);
  }

  private generateMarkdownReport(result: any): string {
    let report = `# Synapse Rule Engine Report\n\n`;
    report += `**Generated:** ${new Date().toISOString()}\n`;
    report += `**Execution Time:** ${result.execution_time_ms}ms\n\n`;
    
    report += `## Summary\n\n`;
    report += `- **Total Violations:** ${result.summary.total_violations}\n`;
    report += `- **Critical:** ${result.summary.critical_count}\n`;
    report += `- **High:** ${result.summary.high_count}\n`;
    report += `- **Medium:** ${result.summary.medium_count}\n`;
    report += `- **Low:** ${result.summary.low_count}\n`;
    report += `- **Auto-fixable:** ${result.summary.auto_fixable_count}\n\n`;
    
    if (result.violations.length > 0) {
      report += `## Violations\n\n`;
      
      // Group by category
      const violationsByCategory = result.violations.reduce((acc: any, violation: any) => {
        if (!acc[violation.category]) {
          acc[violation.category] = [];
        }
        acc[violation.category].push(violation);
        return acc;
      }, {});
      
      for (const [category, violations] of Object.entries(violationsByCategory)) {
        report += `### ${category}\n\n`;
        
        for (const violation of violations as any[]) {
          report += `#### ${violation.message}\n\n`;
          report += `- **File:** ${violation.file_path}`;
          if (violation.line_number) {
            report += `:${violation.line_number}`;
          }
          report += `\n`;
          report += `- **Severity:** ${violation.severity}\n`;
          report += `- **Auto-fixable:** ${violation.auto_fixable ? 'Yes' : 'No'}\n`;
          
          if (violation.suggested_fix) {
            report += `- **Suggested Fix:** ${violation.suggested_fix}\n`;
          }
          
          report += `\n`;
        }
      }
    }
    
    return report;
  }

  private generateHTMLReport(result: any): string {
    return `<!DOCTYPE html>
<html>
<head>
    <title>Synapse Rule Engine Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; }
        .violation { border: 1px solid #ddd; margin: 10px 0; padding: 10px; border-radius: 5px; }
        .critical { border-left: 5px solid #d32f2f; }
        .high { border-left: 5px solid #f57c00; }
        .medium { border-left: 5px solid #fbc02d; }
        .low { border-left: 5px solid #388e3c; }
    </style>
</head>
<body>
    <h1>Synapse Rule Engine Report</h1>
    <div class="summary">
        <h2>Summary</h2>
        <p><strong>Total Violations:</strong> ${result.summary.total_violations}</p>
        <p><strong>Critical:</strong> ${result.summary.critical_count}</p>
        <p><strong>High:</strong> ${result.summary.high_count}</p>
        <p><strong>Medium:</strong> ${result.summary.medium_count}</p>
        <p><strong>Low:</strong> ${result.summary.low_count}</p>
        <p><strong>Auto-fixable:</strong> ${result.summary.auto_fixable_count}</p>
    </div>
    
    <h2>Violations</h2>
    ${result.violations.map((violation: any) => `
        <div class="violation ${violation.severity.toLowerCase()}">
            <h3>${violation.message}</h3>
            <p><strong>File:</strong> ${violation.file_path}${violation.line_number ? `:${violation.line_number}` : ''}</p>
            <p><strong>Severity:</strong> ${violation.severity}</p>
            <p><strong>Auto-fixable:</strong> ${violation.auto_fixable ? 'Yes' : 'No'}</p>
            ${violation.suggested_fix ? `<p><strong>Suggested Fix:</strong> ${violation.suggested_fix}</p>` : ''}
        </div>
    `).join('')}
</body>
</html>`;
  }

  private async autoFix(result: any): Promise<void> {
    const autoFixableViolations = result.violations.filter((v: any) => v.auto_fixable);
    
    if (autoFixableViolations.length === 0) {
      console.log('ℹ️  No auto-fixable violations found');
      return;
    }
    
    console.log(`🔧 Auto-fixing ${autoFixableViolations.length} violations...`);
    
    for (const violation of autoFixableViolations) {
      try {
        await this.fixViolation(violation);
        console.log(`✅ Fixed: ${violation.message}`);
      } catch (error) {
        console.error(`❌ Failed to fix: ${violation.message} - ${(error as Error).message}`);
      }
    }
  }

  private async fixViolation(violation: any): Promise<void> {
    // This would implement actual auto-fixing logic
    // For now, just log the suggested fix
    if (this.options.verbose) {
      console.log(`🔧 Would fix: ${violation.file_path} - ${violation.suggested_fix}`);
    }
  }

  private async watchMode(): Promise<void> {
    console.log('👀 Watching for file changes...');
    
    // This would implement file watching
    // For now, just log that watch mode is active
    console.log('Watch mode not yet implemented');
  }
}

// CLI argument parsing
function parseArgs(): CLIOptions {
  const args = process.argv.slice(2);
  const options: CLIOptions = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--path':
      case '-p':
        options.path = args[++i];
        break;
      case '--config':
      case '-c':
        options.config = args[++i];
        break;
      case '--output':
      case '-o':
        options.output = args[++i];
        break;
      case '--format':
      case '-f':
        options.format = args[++i] as 'json' | 'html' | 'markdown';
        break;
      case '--fix':
        options.fix = true;
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      case '--watch':
      case '-w':
        options.watch = true;
        break;
      case '--help':
      case '-h':
        console.log(`
Synapse Rule Engine CLI

Usage: synapse-rules [options]

Options:
  -p, --path <path>        Path to check (default: .)
  -c, --config <file>      Configuration file (default: rules.config.json)
  -o, --output <file>      Output file (default: rules-report)
  -f, --format <format>    Output format: json, html, markdown (default: markdown)
  --fix                    Auto-fix violations where possible
  -v, --verbose            Verbose output
  -w, --watch              Watch mode
  -h, --help               Show this help
        `);
        process.exit(0);
    }
  }

  return options;
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const options = parseArgs();
  const cli = new RuleCLI(options);
  cli.run().catch(console.error);
}

export { RuleCLI };