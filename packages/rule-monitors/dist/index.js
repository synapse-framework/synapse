import { RuleEngine } from '@snps/rule-engine-rust';
import { SecurityMonitor } from './monitors/security-monitor.js';
import { PerformanceMonitor } from './monitors/performance-monitor.js';
import { CodeQualityMonitor } from './monitors/code-quality-monitor.js';
import { AccessibilityMonitor } from './monitors/accessibility-monitor.js';
import { CompatibilityMonitor } from './monitors/compatibility-monitor.js';
import { TestingMonitor } from './monitors/testing-monitor.js';
export class RuleMonitorSystem {
    engine;
    monitors;
    config;
    updateInterval = null;
    constructor() {
        this.engine = new RuleEngine();
        this.monitors = new Map();
        this.config = new Map();
        this.initializeMonitors();
    }
    initializeMonitors() {
        // Initialize all monitors
        this.monitors.set('security', new SecurityMonitor());
        this.monitors.set('performance', new PerformanceMonitor());
        this.monitors.set('code-quality', new CodeQualityMonitor());
        this.monitors.set('accessibility', new AccessibilityMonitor());
        this.monitors.set('compatibility', new CompatibilityMonitor());
        this.monitors.set('testing', new TestingMonitor());
        // Set default configurations
        this.config.set('security', {
            enabled: true,
            updateInterval: 60, // 1 hour
            dataSources: ['github-advisories', 'cve-database', 'rust-security'],
            rules: ['security-001', 'security-002', 'security-003']
        });
        this.config.set('performance', {
            enabled: true,
            updateInterval: 120, // 2 hours
            dataSources: ['lighthouse', 'webpagetest', 'bundle-analyzer'],
            rules: ['perf-001', 'perf-002', 'perf-003']
        });
        this.config.set('code-quality', {
            enabled: true,
            updateInterval: 30, // 30 minutes
            dataSources: ['eslint-rules', 'prettier-config', 'typescript-config'],
            rules: ['quality-001', 'quality-002', 'quality-003']
        });
        this.config.set('accessibility', {
            enabled: true,
            updateInterval: 180, // 3 hours
            dataSources: ['wcag-guidelines', 'axe-core', 'accessibility-audit'],
            rules: ['a11y-001', 'a11y-002', 'a11y-003']
        });
        this.config.set('compatibility', {
            enabled: true,
            updateInterval: 240, // 4 hours
            dataSources: ['browser-support', 'node-versions', 'rust-editions'],
            rules: ['compat-001', 'compat-002', 'compat-003']
        });
        this.config.set('testing', {
            enabled: true,
            updateInterval: 60, // 1 hour
            dataSources: ['jest-config', 'coverage-standards', 'test-patterns'],
            rules: ['test-001', 'test-002', 'test-003']
        });
    }
    async start() {
        console.log('🚀 Starting Rule Monitor System...');
        // Load initial rules
        await this.loadInitialRules();
        // Start monitoring
        this.startMonitoring();
        console.log('✅ Rule Monitor System started successfully!');
    }
    async stop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        console.log('🛑 Rule Monitor System stopped');
    }
    async loadInitialRules() {
        try {
            // Load rules from each monitor
            for (const [name, monitor] of this.monitors) {
                const rules = await monitor.getRules();
                this.engine.addRules(rules);
                console.log(`📋 Loaded ${rules.length} rules from ${name} monitor`);
            }
        }
        catch (error) {
            console.error('❌ Error loading initial rules:', error);
        }
    }
    startMonitoring() {
        // Update rules every 6 hours
        this.updateInterval = setInterval(async () => {
            await this.updateAllRules();
        }, 6 * 60 * 60 * 1000);
        // Initial update
        this.updateAllRules();
    }
    async updateAllRules() {
        const results = [];
        for (const [name, monitor] of this.monitors) {
            const config = this.config.get(name);
            if (!config?.enabled)
                continue;
            try {
                const startTime = Date.now();
                const result = await monitor.updateRules();
                const executionTime = Date.now() - startTime;
                results.push({
                    monitor: name,
                    status: 'success',
                    message: `Updated ${result.rules.length} rules from ${result.source}`,
                    data: result,
                    timestamp: new Date().toISOString(),
                    executionTime
                });
                // Add new rules to engine
                this.engine.addRules(result.rules);
                console.log(`✅ Updated ${result.rules.length} rules from ${name} monitor`);
            }
            catch (error) {
                results.push({
                    monitor: name,
                    status: 'error',
                    message: `Failed to update rules: ${error}`,
                    data: { error: error.message },
                    timestamp: new Date().toISOString(),
                    executionTime: 0
                });
                console.error(`❌ Error updating ${name} monitor:`, error);
            }
        }
        return results;
    }
    async checkCodebase(path) {
        return this.engine.checkDirectory(path);
    }
    async checkFile(path) {
        return this.engine.checkFile(path);
    }
    getEngine() {
        return this.engine;
    }
    getMonitorStatus() {
        const status = new Map();
        for (const [name, monitor] of this.monitors) {
            status.set(name, {
                monitor: name,
                status: 'success',
                message: 'Monitor is running',
                data: { lastUpdate: new Date().toISOString() },
                timestamp: new Date().toISOString(),
                executionTime: 0
            });
        }
        return status;
    }
    updateMonitorConfig(monitorName, config) {
        this.config.set(monitorName, config);
    }
    getMonitorConfig(monitorName) {
        return this.config.get(monitorName);
    }
}
// Export individual monitors for direct use
export { SecurityMonitor } from './monitors/security-monitor.js';
export { PerformanceMonitor } from './monitors/performance-monitor.js';
export { CodeQualityMonitor } from './monitors/code-quality-monitor.js';
export { AccessibilityMonitor } from './monitors/accessibility-monitor.js';
export { CompatibilityMonitor } from './monitors/compatibility-monitor.js';
export { TestingMonitor } from './monitors/testing-monitor.js';
//# sourceMappingURL=index.js.map