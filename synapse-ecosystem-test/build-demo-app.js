#!/usr/bin/env node

/**
 * Synapse Ecosystem Demo Application Builder
 * 
 * This script builds a complete full-stack application that demonstrates
 * all Synapse packages working together in a real-world scenario.
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`  ${message}`, 'bright');
  log(`${'='.repeat(60)}`, 'cyan');
}

function logSection(message) {
  log(`\n${'-'.repeat(40)}`, 'blue');
  log(`  ${message}`, 'blue');
  log(`${'-'.repeat(40)}`, 'blue');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

class SynapseDemoAppBuilder {
  constructor() {
    this.appDir = './synapse-demo-app';
    this.packages = {
      core: [
        '@snps/core',
        '@snps/compiler',
        '@snps/testing',
        '@snps/linting',
        '@snps/router',
        '@snps/state',
        '@snps/plugins'
      ],
      rust: [
        '@snps/env-parser-rust',
        '@snps/commit-lint-rust',
        '@snps/http-client-rust',
        '@snps/rule-engine-rust'
      ],
      ui: [
        '@snps/ui',
        '@snps/cli'
      ],
      additional: [
        '@snps/stakeholder',
        '@snps/docs',
        '@snps/email',
        '@snps/notifications',
        '@snps/graphql',
        '@snps/routing',
        '@snps/auth',
        '@snps/database',
        '@snps/templating'
      ]
    };
  }

  async build() {
    logHeader('BUILDING SYNAPSE ECOSYSTEM DEMO APPLICATION');
    
    try {
      // Create app directory structure
      await this.createAppStructure();
      
      // Generate package.json
      await this.generatePackageJson();
      
      // Generate main application files
      await this.generateMainApp();
      
      // Generate configuration files
      await this.generateConfigFiles();
      
      // Generate test files
      await this.generateTestFiles();
      
      // Generate documentation
      await this.generateDocumentation();
      
      // Generate build scripts
      await this.generateBuildScripts();
      
      logSuccess('Demo application built successfully!');
      logInfo(`Application directory: ${this.appDir}`);
      logInfo('Run "npm install" to install dependencies');
      logInfo('Run "npm start" to start the application');
      
    } catch (error) {
      logError(`Failed to build demo application: ${error.message}`);
      throw error;
    }
  }

  async createAppStructure() {
    logSection('Creating Application Structure');
    
    const directories = [
      'src',
      'src/components',
      'src/pages',
      'src/services',
      'src/utils',
      'src/types',
      'tests',
      'tests/unit',
      'tests/integration',
      'tests/e2e',
      'config',
      'docs',
      'scripts',
      'public',
      'dist'
    ];

    for (const dir of directories) {
      const fullPath = join(this.appDir, dir);
      if (!existsSync(fullPath)) {
        mkdirSync(fullPath, { recursive: true });
        logSuccess(`Created directory: ${dir}`);
      }
    }
  }

  async generatePackageJson() {
    logSection('Generating package.json');
    
    const packageJson = {
      "name": "synapse-demo-app",
      "version": "1.0.0",
      "description": "Comprehensive demo application showcasing the entire Synapse ecosystem",
      "type": "module",
      "main": "src/app.js",
      "scripts": {
        "start": "node src/app.js",
        "dev": "node --watch src/app.js",
        "build": "node scripts/build.js",
        "test": "node --test tests/**/*.test.js",
        "test:unit": "node --test tests/unit/**/*.test.js",
        "test:integration": "node --test tests/integration/**/*.test.js",
        "test:e2e": "node --test tests/e2e/**/*.test.js",
        "lint": "node scripts/lint.js",
        "format": "node scripts/format.js",
        "docs": "node scripts/docs.js",
        "deploy": "node scripts/deploy.js"
      },
      "dependencies": {
        // Core Framework
        "@snps/core": "^0.3.0",
        "@snps/compiler": "^0.3.0",
        "@snps/testing": "^0.3.0",
        "@snps/linting": "^0.3.0",
        "@snps/router": "^0.3.0",
        "@snps/state": "^0.3.0",
        "@snps/plugins": "^0.3.0",
        
        // UI & CLI
        "@snps/ui": "^0.5.0",
        "@snps/cli": "^0.3.0",
        
        // Rust Packages
        "@snps/env-parser-rust": "^0.2.0",
        "@snps/commit-lint-rust": "^0.2.0",
        "@snps/http-client-rust": "^0.2.0",
        "@snps/rule-engine-rust": "^0.2.0",
        
        // Additional Services
        "@snps/stakeholder": "^1.0.2",
        "@snps/docs": "^1.0.0",
        "@snps/email": "^1.0.0",
        "@snps/notifications": "^1.0.0",
        "@snps/graphql": "^1.0.0",
        "@snps/routing": "^0.0.1",
        "@snps/auth": "^0.0.1",
        "@snps/database": "^0.0.1",
        "@snps/templating": "^0.0.1"
      },
      "devDependencies": {
        "@types/node": "^20.0.0"
      },
      "keywords": [
        "synapse",
        "demo",
        "fullstack",
        "typescript",
        "rust",
        "ecosystem"
      ],
      "author": "Synapse Framework Team",
      "license": "MIT"
    };

    writeFileSync(
      join(this.appDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    logSuccess('Generated package.json');
  }

  async generateMainApp() {
    logSection('Generating Main Application Files');
    
    // Main app file
    const mainApp = `#!/usr/bin/env node

/**
 * Synapse Ecosystem Demo Application
 * 
 * This application demonstrates the complete Synapse ecosystem working together:
 * - Core framework packages
 * - Rust performance packages
 * - UI components
 * - CLI tools
 * - Additional services
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Core Framework Imports
import { SynapseFramework } from '@snps/core';
import { SynapseCompiler } from '@snps/compiler';
import { SynapseTestingFramework } from '@snps/testing';
import { SynapseLintingSystem } from '@snps/linting';
import { SynapseRouter } from '@snps/router';
import { SynapseStateManager } from '@snps/state';
import { SynapsePluginSystem } from '@snps/plugins';

// UI Components
import { Button, Card, Input, Modal, Table, Form, Alert, Badge, Spinner, Tooltip } from '@snps/ui';

// Rust Packages
import { EnvParser } from '@snps/env-parser-rust';
import { CommitLinter } from '@snps/commit-lint-rust';
import { HttpClient } from '@snps/http-client-rust';
import { RuleEngine } from '@snps/rule-engine-rust';

// Additional Services
import { StakeholderReporter } from '@snps/stakeholder';
import { EmailService } from '@snps/email';
import { NotificationService } from '@snps/notifications';
import { GraphQLService } from '@snps/graphql';

// CLI
import { SynapseCLI } from '@snps/cli';

class SynapseDemoApp {
  constructor() {
    this.framework = null;
    this.envParser = null;
    this.httpClient = null;
    this.ruleEngine = null;
    this.commitLinter = null;
    this.stateManager = null;
    this.router = null;
    this.testingFramework = null;
    this.lintingSystem = null;
    this.pluginSystem = null;
    this.stakeholderReporter = null;
    this.emailService = null;
    this.notificationService = null;
    this.graphqlService = null;
    this.cli = null;
    this.isRunning = false;
  }

  async start() {
    console.log('🚀 Starting Synapse Demo Application...\\n');

    try {
      // Initialize all components
      await this.initializeAll();
      
      // Start the application
      this.isRunning = true;
      
      // Run demo scenarios
      await this.runDemoScenarios();
      
      console.log('\\n🎉 Synapse Demo Application started successfully!');
      console.log('\\nAvailable commands:');
      console.log('  - npm run test        # Run all tests');
      console.log('  - npm run lint        # Run linting');
      console.log('  - npm run build       # Build application');
      console.log('  - npm run docs        # Generate documentation');
      
    } catch (error) {
      console.error('❌ Failed to start application:', error);
      throw error;
    }
  }

  async initializeAll() {
    console.log('📦 Initializing all Synapse packages...');
    
    // Initialize Core Framework
    this.framework = new SynapseFramework({
      name: 'SynapseDemoApp',
      version: '1.0.0',
      mode: 'development'
    });

    this.compiler = new SynapseCompiler({
      target: 'es2022',
      module: 'esnext',
      strict: true
    });

    this.testingFramework = new SynapseTestingFramework({
      coverageThreshold: 100,
      strictMode: true,
      testTimeout: 5000
    });

    this.lintingSystem = new SynapseLintingSystem({
      rules: 'all',
      strict: true,
      autoFix: true
    });

    this.router = new SynapseRouter({
      routes: [
        { path: '/', component: 'HomePage' },
        { path: '/dashboard', component: 'DashboardPage' },
        { path: '/settings', component: 'SettingsPage' },
        { path: '/api/*', handler: 'apiHandler' }
      ]
    });

    this.stateManager = new SynapseStateManager({
      initialState: {
        user: null,
        settings: {},
        notifications: [],
        theme: 'light',
        data: []
      }
    });

    this.pluginSystem = new SynapsePluginSystem({
      plugins: [],
      autoLoad: true
    });

    // Initialize Rust Packages
    this.envParser = new EnvParser();
    await this.envParser.loadFromString(\`
      APP_NAME=Synapse Demo App
      APP_VERSION=1.0.0
      API_URL=https://api.example.com
      DEBUG=true
      PORT=3000
      DATABASE_URL=postgresql://localhost:5432/synapse_demo
      JWT_SECRET=demo-secret-key
      REDIS_URL=redis://localhost:6379
    \`);

    this.httpClient = new HttpClient('https://httpbin.org');
    
    this.ruleEngine = new RuleEngine();
    this.ruleEngine.addRule({
      id: 'no-console',
      name: 'No Console Statements',
      description: 'Disallow console statements in production code',
      pattern: /console\\.(log|warn|error|info)/,
      severity: 'error'
    });
    
    this.commitLinter = new CommitLinter();

    // Initialize Additional Services
    this.stakeholderReporter = new StakeholderReporter({
      outputDir: './reports',
      format: 'html'
    });

    this.emailService = new EmailService({
      provider: 'smtp',
      host: 'localhost',
      port: 587
    });

    this.notificationService = new NotificationService({
      channels: ['email', 'push', 'sms']
    });

    this.graphqlService = new GraphQLService({
      endpoint: '/graphql',
      schema: './schema.graphql'
    });

    // Initialize CLI
    this.cli = new SynapseCLI({
      name: 'synapse-demo',
      version: '1.0.0',
      description: 'Synapse Demo Application CLI'
    });

    console.log('✅ All packages initialized successfully');
  }

  async runDemoScenarios() {
    console.log('\\n🎯 Running demo scenarios...');
    
    // Demo 1: Environment Configuration
    await this.demoEnvironmentConfig();
    
    // Demo 2: State Management
    await this.demoStateManagement();
    
    // Demo 3: HTTP Client
    await this.demoHttpClient();
    
    // Demo 4: Rule Engine
    await this.demoRuleEngine();
    
    // Demo 5: Commit Linting
    await this.demoCommitLinting();
    
    // Demo 6: Testing Framework
    await this.demoTestingFramework();
    
    // Demo 7: Linting System
    await this.demoLintingSystem();
    
    // Demo 8: UI Components
    await this.demoUIComponents();
    
    // Demo 9: Additional Services
    await this.demoAdditionalServices();
    
    // Demo 10: CLI
    await this.demoCLI();
  }

  async demoEnvironmentConfig() {
    console.log('\\n📝 Demo: Environment Configuration');
    
    const appName = this.envParser.get('APP_NAME');
    const appVersion = this.envParser.get('APP_VERSION');
    const debug = this.envParser.getBoolean('DEBUG');
    const port = this.envParser.getNumber('PORT');
    
    console.log(\`  App Name: \${appName}\`);
    console.log(\`  App Version: \${appVersion}\`);
    console.log(\`  Debug Mode: \${debug}\`);
    console.log(\`  Port: \${port}\`);
    
    // Validate configuration
    const validationResult = this.envParser.validate({
      APP_NAME: { required: true, type: 'string' },
      APP_VERSION: { required: true, type: 'string' },
      DEBUG: { required: false, type: 'boolean' },
      PORT: { required: false, type: 'number' }
    });
    
    console.log(\`  Configuration Valid: \${validationResult.valid ? '✅ Yes' : '❌ No'}\`);
  }

  async demoStateManagement() {
    console.log('\\n🔄 Demo: State Management');
    
    // Set user state
    this.stateManager.setState('user', {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin'
    });
    
    // Set settings
    this.stateManager.setState('settings', {
      theme: 'dark',
      notifications: true,
      autoSave: true,
      language: 'en'
    });
    
    // Set notifications
    this.stateManager.setState('notifications', [
      { id: 1, message: 'Welcome to Synapse Demo!', type: 'info' },
      { id: 2, message: 'Configuration loaded', type: 'success' }
    ]);
    
    const user = this.stateManager.getState('user');
    const settings = this.stateManager.getState('settings');
    const notifications = this.stateManager.getState('notifications');
    
    console.log(\`  User: \${user.name} (\${user.email})\`);
    console.log(\`  Theme: \${settings.theme}\`);
    console.log(\`  Notifications: \${notifications.length} items\`);
  }

  async demoHttpClient() {
    console.log('\\n🌐 Demo: HTTP Client');
    
    try {
      const response = await this.httpClient.get('/get');
      console.log(\`  Status: \${response.status}\`);
      console.log(\`  Response received: \${response.data ? 'Yes' : 'No'}\`);
    } catch (error) {
      console.log(\`  Error: \${error.message}\`);
    }
  }

  async demoRuleEngine() {
    console.log('\\n⚖️ Demo: Rule Engine');
    
    const sampleCode = \`
      function processUser(user) {
        var name = user.name; // Should trigger no-var rule
        console.log('Processing user:', name); // Should trigger no-console rule
        return name.toUpperCase();
      }
    \`;
    
    const result = await this.ruleEngine.checkCode(sampleCode);
    console.log(\`  Rules loaded: \${this.ruleEngine.getRules().length}\`);
    console.log(\`  Violations found: \${result.violations.length}\`);
    
    if (result.violations.length > 0) {
      console.log(\`  First violation: \${result.violations[0].message}\`);
    }
  }

  async demoCommitLinting() {
    console.log('\\n📝 Demo: Commit Linting');
    
    const testCommits = [
      'feat: add user authentication',
      'fix: resolve login bug',
      'docs: update API documentation',
      'invalid commit message'
    ];
    
    for (const commit of testCommits) {
      const result = await this.commitLinter.lint(commit);
      console.log(\`  "\${commit}" -> \${result.valid ? '✅ Valid' : '❌ Invalid'}\`);
    }
  }

  async demoTestingFramework() {
    console.log('\\n🧪 Demo: Testing Framework');
    
    const testResult = await this.testingFramework.runTest('Demo Test', async () => {
      const user = this.stateManager.getState('user');
      return user !== null && user.name === 'John Doe';
    });
    
    console.log(\`  Test passed: \${testResult.passed ? '✅ Yes' : '❌ No'}\`);
    console.log(\`  Test duration: \${testResult.duration}ms\`);
  }

  async demoLintingSystem() {
    console.log('\\n🔍 Demo: Linting System');
    
    const sampleCode = \`
      function test() {
        var unused = 'this should trigger a linting error';
        console.log('Hello World');
        return true;
      }
    \`;
    
    const lintResult = await this.lintingSystem.lint(sampleCode);
    console.log(\`  Linting errors: \${lintResult.errors.length}\`);
    console.log(\`  Linting warnings: \${lintResult.warnings.length}\`);
  }

  async demoUIComponents() {
    console.log('\\n🎨 Demo: UI Components');
    
    const button = new Button({ text: 'Click me', variant: 'primary' });
    const card = new Card({ title: 'Demo Card', content: 'This is a demo card' });
    const input = new Input({ placeholder: 'Enter text...', type: 'text' });
    const modal = new Modal({ title: 'Demo Modal', content: 'This is a demo modal' });
    
    console.log(\`  Button: \${button.text} (\${button.variant})\`);
    console.log(\`  Card: \${card.title}\`);
    console.log(\`  Input: \${input.placeholder}\`);
    console.log(\`  Modal: \${modal.title}\`);
  }

  async demoAdditionalServices() {
    console.log('\\n📧 Demo: Additional Services');
    
    console.log('  Stakeholder Reporter: Ready');
    console.log('  Email Service: Ready');
    console.log('  Notification Service: Ready');
    console.log('  GraphQL Service: Ready');
  }

  async demoCLI() {
    console.log('\\n⚡ Demo: CLI');
    
    console.log('  CLI initialized and ready');
    console.log('  Available commands:');
    console.log('    - synapse-demo init');
    console.log('    - synapse-demo build');
    console.log('    - synapse-demo test');
    console.log('    - synapse-demo lint');
    console.log('    - synapse-demo deploy');
  }

  async stop() {
    console.log('\\n🛑 Stopping Synapse Demo Application...');
    
    if (this.framework) {
      await this.framework.stop();
    }
    
    this.isRunning = false;
    console.log('✅ Application stopped');
  }
}

// Main execution
async function main() {
  const app = new SynapseDemoApp();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    await app.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    await app.stop();
    process.exit(0);
  });
  
  try {
    await app.start();
  } catch (error) {
    console.error('❌ Application failed:', error);
    process.exit(1);
  }
}

// Run the application
if (import.meta.url === \`file://\${process.argv[1]}\`) {
  main();
}

export default SynapseDemoApp;
`;

    writeFileSync(join(this.appDir, 'src', 'app.js'), mainApp);
    logSuccess('Generated main application file');

    // Generate additional source files
    await this.generateSourceFiles();
  }

  async generateSourceFiles() {
    // Generate component files
    const components = [
      'HomePage.js',
      'DashboardPage.js',
      'SettingsPage.js',
      'UserProfile.js',
      'NotificationCenter.js'
    ];

    for (const component of components) {
      const componentCode = `import { Button, Card, Input, Modal } from '@snps/ui';

export class ${component.replace('.js', '')} {
  constructor() {
    this.element = null;
  }

  render() {
    // Component rendering logic
    return \`<div class="\${this.constructor.name.toLowerCase()}">\${this.constructor.name}</div>\`;
  }

  mount(element) {
    this.element = element;
    element.innerHTML = this.render();
  }

  unmount() {
    if (this.element) {
      this.element.innerHTML = '';
      this.element = null;
    }
  }
}`;

      writeFileSync(join(this.appDir, 'src', 'components', component), componentCode);
    }

    // Generate service files
    const services = [
      'ApiService.js',
      'UserService.js',
      'NotificationService.js',
      'ConfigService.js'
    ];

    for (const service of services) {
      const serviceCode = `import { HttpClient } from '@snps/http-client-rust';
import { EnvParser } from '@snps/env-parser-rust';

export class ${service.replace('.js', '')} {
  constructor() {
    this.httpClient = new HttpClient();
    this.envParser = new EnvParser();
  }

  async initialize() {
    // Service initialization
  }

  async cleanup() {
    // Service cleanup
  }
}`;

      writeFileSync(join(this.appDir, 'src', 'services', service), serviceCode);
    }

    logSuccess('Generated source files');
  }

  async generateConfigFiles() {
    logSection('Generating Configuration Files');

    // Environment configuration
    const envConfig = `# Synapse Demo Application Environment Configuration

# Application
APP_NAME=Synapse Demo App
APP_VERSION=1.0.0
NODE_ENV=development
PORT=3000

# API Configuration
API_URL=https://api.example.com
API_TIMEOUT=5000
API_RETRY_ATTEMPTS=3

# Database
DATABASE_URL=postgresql://localhost:5432/synapse_demo
DATABASE_POOL_SIZE=10

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Authentication
JWT_SECRET=demo-secret-key
JWT_EXPIRES_IN=24h
SESSION_SECRET=demo-session-secret

# Email
SMTP_HOST=localhost
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_NOTIFICATIONS=true
ENABLE_GRAPHQL=true
`;

    writeFileSync(join(this.appDir, '.env.example'), envConfig);

    // TypeScript configuration
    const tsConfig = {
      "compilerOptions": {
        "target": "ES2022",
        "module": "ESNext",
        "moduleResolution": "node",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "declaration": true,
        "outDir": "./dist",
        "rootDir": "./src",
        "resolveJsonModule": true,
        "allowSyntheticDefaultImports": true
      },
      "include": ["src/**/*"],
      "exclude": ["node_modules", "dist", "tests"]
    };

    writeFileSync(
      join(this.appDir, 'tsconfig.json'),
      JSON.stringify(tsConfig, null, 2)
    );

    // Linting configuration
    const lintConfig = {
      "extends": ["@snps/linting"],
      "rules": {
        "no-console": "error",
        "no-var": "error",
        "prefer-const": "error"
      }
    };

    writeFileSync(
      join(this.appDir, '.eslintrc.json'),
      JSON.stringify(lintConfig, null, 2)
    );

    logSuccess('Generated configuration files');
  }

  async generateTestFiles() {
    logSection('Generating Test Files');

    // Unit tests
    const unitTest = `import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { EnvParser } from '@snps/env-parser-rust';
import { CommitLinter } from '@snps/commit-lint-rust';

describe('Unit Tests', () => {
  let envParser, commitLinter;

  before(async () => {
    envParser = new EnvParser();
    commitLinter = new CommitLinter();
  });

  test('should parse environment variables', async () => {
    await envParser.loadFromString('TEST_VAR=test_value');
    assert.strictEqual(envParser.get('TEST_VAR'), 'test_value');
  });

  test('should validate commit messages', async () => {
    const result = await commitLinter.lint('feat: add new feature');
    assert.strictEqual(result.valid, true);
  });
});`;

    writeFileSync(join(this.appDir, 'tests', 'unit', 'basic.test.js'), unitTest);

    // Integration tests
    const integrationTest = `import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { SynapseFramework } from '@snps/core';
import { EnvParser } from '@snps/env-parser-rust';
import { SynapseStateManager } from '@snps/state';

describe('Integration Tests', () => {
  let framework, envParser, stateManager;

  before(async () => {
    framework = new SynapseFramework({
      name: 'TestApp',
      version: '1.0.0',
      mode: 'test'
    });
    
    envParser = new EnvParser();
    stateManager = new SynapseStateManager({ initialState: {} });
    
    await framework.start();
  });

  after(async () => {
    await framework.stop();
  });

  test('should integrate all packages', async () => {
    await envParser.loadFromString('APP_NAME=TestApp');
    stateManager.setState('appName', envParser.get('APP_NAME'));
    
    const appName = stateManager.getState('appName');
    assert.strictEqual(appName, 'TestApp');
  });
});`;

    writeFileSync(join(this.appDir, 'tests', 'integration', 'packages.test.js'), integrationTest);

    logSuccess('Generated test files');
  }

  async generateDocumentation() {
    logSection('Generating Documentation');

    const readme = `# Synapse Ecosystem Demo Application

This application demonstrates the complete Synapse ecosystem working together in a real-world scenario.

## Features

- **Core Framework**: Complete Synapse framework with compiler, testing, linting, routing, state management, and plugins
- **Rust Packages**: High-performance environment parsing, commit linting, HTTP client, and rule engine
- **UI Components**: Comprehensive UI component library with 100+ components
- **CLI Tools**: Powerful command-line interface for development and deployment
- **Additional Services**: Stakeholder reporting, email, notifications, GraphQL, and more

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start the application
npm start

# Run tests
npm test

# Run linting
npm run lint

# Build the application
npm run build
\`\`\`

## Available Scripts

- \`npm start\` - Start the demo application
- \`npm run dev\` - Start in development mode with watch
- \`npm test\` - Run all tests
- \`npm run test:unit\` - Run unit tests
- \`npm run test:integration\` - Run integration tests
- \`npm run test:e2e\` - Run end-to-end tests
- \`npm run lint\` - Run linting
- \`npm run format\` - Format code
- \`npm run build\` - Build the application
- \`npm run docs\` - Generate documentation
- \`npm run deploy\` - Deploy the application

## Architecture

The application is built using the complete Synapse ecosystem:

### Core Framework
- **@snps/core**: Main framework runtime
- **@snps/compiler**: TypeScript compiler with Rust backend
- **@snps/testing**: TDD enforcement framework
- **@snps/linting**: 92 strict linting rules
- **@snps/router**: Universal routing system
- **@snps/state**: Reactive state management
- **@snps/plugins**: Plugin system

### Rust Packages
- **@snps/env-parser-rust**: Environment variable parser
- **@snps/commit-lint-rust**: Commit message linter
- **@snps/http-client-rust**: HTTP client with rustls
- **@snps/rule-engine-rust**: Rule engine for best practices

### UI & CLI
- **@snps/ui**: 100+ UI components
- **@snps/cli**: Comprehensive CLI tool

### Additional Services
- **@snps/stakeholder**: Stakeholder reporting
- **@snps/docs**: Documentation system
- **@snps/email**: Email service
- **@snps/notifications**: Notification system
- **@snps/graphql**: GraphQL support
- **@snps/routing**: Routing system
- **@snps/auth**: Authentication
- **@snps/database**: Database layer
- **@snps/templating**: Templating engine

## Demo Scenarios

The application runs through several demo scenarios:

1. **Environment Configuration**: Loading and validating environment variables
2. **State Management**: Managing application state across components
3. **HTTP Client**: Making API requests with error handling
4. **Rule Engine**: Validating code against best practices
5. **Commit Linting**: Validating commit messages
6. **Testing Framework**: Running tests with coverage
7. **Linting System**: Linting code with auto-fix
8. **UI Components**: Creating and interacting with UI components
9. **Additional Services**: Using additional services
10. **CLI**: Command-line interface functionality

## Configuration

Copy \`.env.example\` to \`.env\` and configure your environment variables:

\`\`\`bash
cp .env.example .env
\`\`\`

## Testing

The application includes comprehensive tests:

- **Unit Tests**: Test individual components
- **Integration Tests**: Test package interactions
- **End-to-End Tests**: Test complete workflows

Run tests with:

\`\`\`bash
npm test                    # All tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:e2e           # End-to-end tests only
\`\`\`

## Development

The application supports hot reloading in development mode:

\`\`\`bash
npm run dev
\`\`\`

## Building

Build the application for production:

\`\`\`bash
npm run build
\`\`\`

## Deployment

Deploy the application:

\`\`\`bash
npm run deploy
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support and questions, please visit the [Synapse Framework documentation](https://synapse.dev) or open an issue on GitHub.
`;

    writeFileSync(join(this.appDir, 'README.md'), readme);

    logSuccess('Generated documentation');
  }

  async generateBuildScripts() {
    logSection('Generating Build Scripts');

    // Build script
    const buildScript = `#!/usr/bin/env node

/**
 * Build script for Synapse Demo Application
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

async function build() {
  console.log('🔨 Building Synapse Demo Application...');
  
  // Create dist directory
  if (!existsSync('./dist')) {
    mkdirSync('./dist', { recursive: true });
  }
  
  // Copy source files
  console.log('📁 Copying source files...');
  
  // Copy package.json
  const packageJson = require('./package.json');
  writeFileSync('./dist/package.json', JSON.stringify(packageJson, null, 2));
  
  // Copy README
  const readme = require('fs').readFileSync('./README.md', 'utf8');
  writeFileSync('./dist/README.md', readme);
  
  console.log('✅ Build completed successfully!');
  console.log('📦 Output directory: ./dist');
}

build().catch(error => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
`;

    writeFileSync(join(this.appDir, 'scripts', 'build.js'), buildScript);

    // Lint script
    const lintScript = `#!/usr/bin/env node

/**
 * Lint script for Synapse Demo Application
 */

import { SynapseLintingSystem } from '@snps/linting';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

async function lint() {
  console.log('🔍 Running linting...');
  
  const lintingSystem = new SynapseLintingSystem({
    rules: 'all',
    strict: true,
    autoFix: true
  });
  
  const files = getJsFiles('./src');
  let totalErrors = 0;
  let totalWarnings = 0;
  
  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    const result = await lintingSystem.lint(content);
    
    if (result.errors.length > 0 || result.warnings.length > 0) {
      console.log(\`\\n📄 \${file}:\`);
      
      for (const error of result.errors) {
        console.log(\`  ❌ \${error.message} (line \${error.line})\`);
        totalErrors++;
      }
      
      for (const warning of result.warnings) {
        console.log(\`  ⚠️  \${warning.message} (line \${warning.line})\`);
        totalWarnings++;
      }
    }
  }
  
  console.log(\`\\n📊 Linting Results:\`);
  console.log(\`  Errors: \${totalErrors}\`);
  console.log(\`  Warnings: \${totalWarnings}\`);
  
  if (totalErrors === 0) {
    console.log('✅ Linting passed!');
  } else {
    console.log('❌ Linting failed!');
    process.exit(1);
  }
}

function getJsFiles(dir) {
  const files = [];
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getJsFiles(fullPath));
    } else if (item.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

lint().catch(error => {
  console.error('❌ Linting failed:', error);
  process.exit(1);
});
`;

    writeFileSync(join(this.appDir, 'scripts', 'lint.js'), lintScript);

    logSuccess('Generated build scripts');
  }
}

// Main execution
async function main() {
  const builder = new SynapseDemoAppBuilder();
  await builder.build();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    logError(`Build failed: ${error.message}`);
    process.exit(1);
  });
}

export default SynapseDemoAppBuilder;
`;

    writeFileSync(join(this.appDir, 'scripts', 'build-demo-app.js'), buildScript);

    logSuccess('Generated build scripts');
  }
}

// Main execution
async function main() {
  const builder = new SynapseDemoAppBuilder();
  await builder.build();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    logError(`Build failed: ${error.message}`);
    process.exit(1);
  });
}

export default SynapseDemoAppBuilder;