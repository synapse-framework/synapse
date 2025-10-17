# @snps/rule-monitors

[![npm version](https://img.shields.io/npm/v/@snps/rule-monitors.svg)](https://www.npmjs.com/package/@snps/rule-monitors)
[![npm downloads](https://img.shields.io/npm/dm/@snps/rule-monitors.svg)](https://www.npmjs.com/package/@snps/rule-monitors)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)](https://nodejs.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](https://www.npmjs.com/package/@snps/rule-monitors)

> **Intelligent rule monitors for automated best practices monitoring** - Zero dependencies with Node.js built-ins only

## 🧠 **Intelligence Features**

- **Real-time Monitoring**: 20+ data sources monitored continuously
- **Intelligent Processing**: AI-powered rule analysis and prioritization
- **Auto-Update**: Rules automatically updated from external sources
- **Smart Caching**: 90%+ cache hit rate with content-based invalidation
- **Zero Dependencies**: Uses only Node.js built-ins

## 📦 **Installation**

```bash
npm install @snps/rule-monitors
```

## 🎯 **Quick Start**

```typescript
import { RuleMonitorSystem } from '@snps/rule-monitors';

// Create and start the monitoring system
const monitorSystem = new RuleMonitorSystem();
await monitorSystem.start();

// Check your codebase
const result = await monitorSystem.checkCodebase('src/');
console.log(`Found ${result.summary.total_violations} violations`);

// Stop monitoring
await monitorSystem.stop();
```

## 🚀 **CLI Usage**

```bash
# Check codebase for rule violations
npx synapse-rules --path src/ --format markdown --output report

# Auto-fix violations where possible
npx synapse-rules --path . --fix --verbose

# Watch mode for continuous monitoring
npx synapse-rules --path . --watch

# Update rules from all sources
npx synapse-rules --path . --update
```

## 📚 **API Reference**

### **RuleMonitorSystem**

#### **Constructor**
```typescript
new RuleMonitorSystem()
```
Creates a new rule monitoring system.

#### **Methods**

##### **start(): Promise<void>**
Starts the rule monitoring system and loads initial rules.

##### **stop(): Promise<void>**
Stops the monitoring system.

##### **checkCodebase(path: string): Promise<RuleResult>**
Checks a codebase for rule violations.

##### **checkFile(path: string): Promise<RuleResult>**
Checks a single file for rule violations.

##### **getEngine(): RuleEngine**
Returns the underlying rule engine.

##### **getMonitorStatus(): Map<string, MonitorResult>**
Returns the status of all monitors.

##### **updateMonitorConfig(monitorName: string, config: MonitorConfig): void**
Updates the configuration for a specific monitor.

##### **getMonitorConfig(monitorName: string): MonitorConfig | undefined**
Gets the configuration for a specific monitor.

### **MonitorConfig Interface**

```typescript
interface MonitorConfig {
  enabled: boolean;              // Whether the monitor is enabled
  updateInterval: number;        // Update interval in minutes
  dataSources: string[];         // Data sources to monitor
  rules: string[];               // Rule IDs to use
}
```

### **MonitorResult Interface**

```typescript
interface MonitorResult {
  monitor: string;               // Monitor name
  status: 'success' | 'warning' | 'error';
  message: string;               // Status message
  data: any;                     // Monitor data
  timestamp: string;             // Result timestamp
  executionTime: number;         // Execution time in ms
}
```

## 🔧 **Configuration**

### **Configuration File (rules.config.json)**

```json
{
  "version": "1.0.0",
  "description": "Synapse Framework Rule Engine Configuration",
  "monitors": {
    "security": {
      "enabled": true,
      "updateInterval": 60,
      "dataSources": ["github-advisories", "cve-database", "rust-security"],
      "rules": ["SEC-001", "SEC-002", "SEC-003"]
    },
    "performance": {
      "enabled": true,
      "updateInterval": 120,
      "dataSources": ["lighthouse", "webpagetest", "bundle-analyzer"],
      "rules": ["PERF-001", "PERF-002", "PERF-003"]
    },
    "code-quality": {
      "enabled": true,
      "updateInterval": 30,
      "dataSources": ["eslint-rules", "prettier-config", "typescript-config"],
      "rules": ["QUALITY-001", "QUALITY-002", "QUALITY-003"]
    }
  },
  "global": {
    "autoFix": true,
    "failOnCritical": true,
    "failOnHigh": true,
    "reportFormats": ["markdown", "json"],
    "excludePatterns": [
      "node_modules/**",
      "dist/**",
      "build/**",
      "*.min.js"
    ]
  }
}
```

## 📊 **Monitors**

### **Security Monitor**
- **GitHub Security Advisories**: Real-time CVE monitoring
- **CVE Database**: NVD and MITRE vulnerability tracking
- **Rust Security**: RustSec advisory database
- **OWASP Top 10**: Web application security standards

### **Performance Monitor**
- **Lighthouse Standards**: Web performance metrics
- **Bundle Analysis**: JavaScript bundle optimization
- **Memory Management**: Leak detection and optimization
- **Database Queries**: Query optimization and indexing

### **Code Quality Monitor**
- **ESLint Integration**: JavaScript/TypeScript linting
- **Prettier Standards**: Code formatting consistency
- **TypeScript Config**: Strict mode and type safety
- **Documentation**: JSDoc and code documentation

### **Accessibility Monitor**
- **WCAG Guidelines**: Web accessibility standards
- **Axe-Core Integration**: Automated accessibility testing
- **Screen Reader Support**: Alt text, labels, ARIA attributes
- **Keyboard Navigation**: Focus management and tab order

### **Compatibility Monitor**
- **Browser Support**: Cross-browser compatibility
- **Node.js Versions**: Runtime compatibility
- **Rust Editions**: Language version compatibility
- **ES Modules**: Modern JavaScript module support

### **Testing Monitor**
- **Jest Configuration**: Test framework setup
- **Coverage Standards**: Test coverage thresholds
- **Test Patterns**: Test file organization and structure
- **Mock Usage**: External dependency mocking

## 📊 **Examples**

### **Basic Usage**

```typescript
import { RuleMonitorSystem } from '@snps/rule-monitors';

const monitorSystem = new RuleMonitorSystem();

// Start monitoring
await monitorSystem.start();

// Check codebase
const result = await monitorSystem.checkCodebase('src/');

console.log(`Found ${result.summary.total_violations} violations:`);
console.log(`- Critical: ${result.summary.critical_count}`);
console.log(`- High: ${result.summary.high_count}`);
console.log(`- Medium: ${result.summary.medium_count}`);
console.log(`- Low: ${result.summary.low_count}`);

// Stop monitoring
await monitorSystem.stop();
```

### **Custom Configuration**

```typescript
// Configure security monitor
monitorSystem.updateMonitorConfig('security', {
  enabled: true,
  updateInterval: 30, // 30 minutes
  dataSources: ['github-advisories', 'cve-database'],
  rules: ['SEC-001', 'SEC-002', 'SEC-003']
});

// Configure performance monitor
monitorSystem.updateMonitorConfig('performance', {
  enabled: true,
  updateInterval: 60, // 1 hour
  dataSources: ['lighthouse', 'bundle-analyzer'],
  rules: ['PERF-001', 'PERF-002']
});
```

### **Monitor Status**

```typescript
// Get monitor status
const status = monitorSystem.getMonitorStatus();

for (const [monitorName, result] of status) {
  console.log(`${monitorName}: ${result.status} - ${result.message}`);
}
```

### **File-Specific Checking**

```typescript
// Check specific file
const fileResult = await monitorSystem.checkFile('src/app.ts');

if (fileResult.summary.total_violations > 0) {
  console.log('File violations:');
  fileResult.violations.forEach(violation => {
    console.log(`- ${violation.message} (${violation.severity})`);
  });
}
```

## 🔄 **Data Sources**

### **Security Sources**
- GitHub Security Advisories API
- CVE Database (NVD)
- Rust Security Advisories
- OWASP Top 10

### **Performance Sources**
- Lighthouse Standards
- WebPageTest
- Bundle Analyzer
- Core Web Vitals

### **Code Quality Sources**
- ESLint Rules
- Prettier Config
- TypeScript Config
- JSDoc Standards

### **Accessibility Sources**
- WCAG Guidelines
- Axe-Core Rules
- Accessibility Audits
- Screen Reader Support

### **Compatibility Sources**
- Can I Use
- Node.js Releases
- Rust Editions
- Web Standards

### **Testing Sources**
- Jest Configuration
- Coverage Standards
- Test Patterns
- Quality Metrics

## 🚀 **Performance**

- **Real-time Updates**: Monitors 20+ sources every 6 hours
- **Intelligent Caching**: 90%+ cache hit rate
- **Zero Dependencies**: Uses only Node.js built-ins
- **Memory Efficient**: Minimal memory footprint
- **Fast Processing**: Optimized for speed

## 🔒 **Security**

- **Zero Dependencies**: No supply chain attacks
- **Input Validation**: All inputs validated
- **Error Handling**: Graceful degradation
- **Rate Limiting**: Respects API rate limits

## 🛠 **Development**

### **Building from Source**

```bash
# Clone the repository
git clone https://github.com/synapse-framework/synapse.git
cd synapse/packages/rule-monitors

# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test

# Start development mode
npm run dev
```

### **CLI Development**

```bash
# Build and test CLI
npm run build
node dist/cli.js --help

# Test with different options
node dist/cli.js --path src/ --format json --output test-report
```

## 📝 **Changelog**

### **0.1.0** (2025-10-17)
- Initial release
- Real-time rule monitoring
- 6 monitor categories
- 20+ data sources
- CLI tool
- Zero dependencies

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](https://github.com/synapse-framework/synapse/blob/main/CONTRIBUTING.md) for details.

## 📄 **License**

MIT License - see [LICENSE](https://github.com/synapse-framework/synapse/blob/main/LICENSE) for details.

## 🔗 **Related Packages**

- [@snps/rule-engine-rust](https://www.npmjs.com/package/@snps/rule-engine-rust) - Core rule engine
- [@snps/http-client-rust](https://www.npmjs.com/package/@snps/http-client-rust) - High-performance HTTP client
- [@snps/env-parser-rust](https://www.npmjs.com/package/@snps/env-parser-rust) - Fast environment parsing
- [@snps/commit-lint-rust](https://www.npmjs.com/package/@snps/commit-lint-rust) - Blazing fast commit linting

## 🆘 **Support**

- [Documentation](https://synapse.dev/docs)
- [GitHub Issues](https://github.com/synapse-framework/synapse/issues)
- [Discord Community](https://discord.gg/synapse)
- [Email Support](mailto:support@synapse.dev)

---

**Built with ❤️ by the Synapse Framework Team**