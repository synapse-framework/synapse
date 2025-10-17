#!/usr/bin/env node

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
import { Button, Card, Input, Modal } from '@snps/ui';

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

class SynapseEcosystemDemo {
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
  }

  async initialize() {
    console.log('🚀 Initializing Synapse Ecosystem Demo...\n');

    try {
      // Initialize Core Framework
      await this.initializeCoreFramework();
      
      // Initialize Rust Packages
      await this.initializeRustPackages();
      
      // Initialize State Management
      await this.initializeStateManagement();
      
      // Initialize Routing
      await this.initializeRouting();
      
      // Initialize Testing Framework
      await this.initializeTestingFramework();
      
      // Initialize Linting System
      await this.initializeLintingSystem();
      
      // Initialize Plugin System
      await this.initializePluginSystem();
      
      // Initialize Additional Services
      await this.initializeAdditionalServices();
      
      // Initialize CLI
      await this.initializeCLI();
      
      console.log('✅ Synapse Ecosystem Demo initialized successfully!\n');
      
    } catch (error) {
      console.error('❌ Failed to initialize Synapse Ecosystem Demo:', error);
      throw error;
    }
  }

  async initializeCoreFramework() {
    console.log('📦 Initializing Core Framework...');
    
    this.framework = new SynapseFramework({
      name: 'SynapseEcosystemDemo',
      version: '1.0.0',
      mode: 'development'
    });

    this.compiler = new SynapseCompiler({
      target: 'es2022',
      module: 'esnext',
      strict: true
    });

    console.log('✅ Core Framework initialized');
  }

  async initializeRustPackages() {
    console.log('🦀 Initializing Rust Packages...');
    
    // Environment Parser
    this.envParser = new EnvParser();
    await this.envParser.loadFromString(`
      APP_NAME=Synapse Ecosystem Demo
      APP_VERSION=1.0.0
      API_URL=https://api.example.com
      DEBUG=true
      PORT=3000
    `);

    // HTTP Client
    this.httpClient = new HttpClient('https://httpbin.org');
    
    // Rule Engine
    this.ruleEngine = new RuleEngine();
    
    // Commit Linter
    this.commitLinter = new CommitLinter();

    console.log('✅ Rust Packages initialized');
  }

  async initializeStateManagement() {
    console.log('🔄 Initializing State Management...');
    
    this.stateManager = new SynapseStateManager({
      initialState: {
        user: null,
        settings: {},
        notifications: [],
        theme: 'light'
      }
    });

    console.log('✅ State Management initialized');
  }

  async initializeRouting() {
    console.log('🛣️ Initializing Routing...');
    
    this.router = new SynapseRouter({
      routes: [
        { path: '/', component: 'HomePage' },
        { path: '/dashboard', component: 'DashboardPage' },
        { path: '/settings', component: 'SettingsPage' },
        { path: '/api/*', handler: 'apiHandler' }
      ]
    });

    console.log('✅ Routing initialized');
  }

  async initializeTestingFramework() {
    console.log('🧪 Initializing Testing Framework...');
    
    this.testingFramework = new SynapseTestingFramework({
      coverageThreshold: 100,
      strictMode: true,
      testTimeout: 5000
    });

    console.log('✅ Testing Framework initialized');
  }

  async initializeLintingSystem() {
    console.log('🔍 Initializing Linting System...');
    
    this.lintingSystem = new SynapseLintingSystem({
      rules: 'all',
      strict: true,
      autoFix: true
    });

    console.log('✅ Linting System initialized');
  }

  async initializePluginSystem() {
    console.log('🔌 Initializing Plugin System...');
    
    this.pluginSystem = new SynapsePluginSystem({
      plugins: [],
      autoLoad: true
    });

    console.log('✅ Plugin System initialized');
  }

  async initializeAdditionalServices() {
    console.log('📧 Initializing Additional Services...');
    
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

    console.log('✅ Additional Services initialized');
  }

  async initializeCLI() {
    console.log('⚡ Initializing CLI...');
    
    this.cli = new SynapseCLI({
      name: 'synapse-demo',
      version: '1.0.0',
      description: 'Synapse Ecosystem Demo CLI'
    });

    console.log('✅ CLI initialized');
  }

  async runDemo() {
    console.log('🎯 Running Synapse Ecosystem Demo...\n');

    // Demo 1: Environment Parser
    await this.demoEnvironmentParser();
    
    // Demo 2: HTTP Client
    await this.demoHttpClient();
    
    // Demo 3: Rule Engine
    await this.demoRuleEngine();
    
    // Demo 4: Commit Linter
    await this.demoCommitLinter();
    
    // Demo 5: State Management
    await this.demoStateManagement();
    
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

    console.log('\n🎉 Synapse Ecosystem Demo completed successfully!');
  }

  async demoEnvironmentParser() {
    console.log('📝 Demo: Environment Parser');
    
    const appName = this.envParser.get('APP_NAME', 'Unknown');
    const appVersion = this.envParser.get('APP_VERSION', '0.0.0');
    const debug = this.envParser.getBoolean('DEBUG', false);
    const port = this.envParser.getNumber('PORT', 3000);
    
    console.log(`  App Name: ${appName}`);
    console.log(`  App Version: ${appVersion}`);
    console.log(`  Debug Mode: ${debug}`);
    console.log(`  Port: ${port}`);
    
    // Test validation
    const validationResult = this.envParser.validate({
      APP_NAME: { required: true, type: 'string' },
      APP_VERSION: { required: true, type: 'string' },
      DEBUG: { required: false, type: 'boolean' },
      PORT: { required: false, type: 'number' }
    });
    
    console.log(`  Validation: ${validationResult.valid ? '✅ Valid' : '❌ Invalid'}`);
    console.log('');
  }

  async demoHttpClient() {
    console.log('🌐 Demo: HTTP Client');
    
    try {
      const response = await this.httpClient.get('/get');
      console.log(`  Status: ${response.status}`);
      console.log(`  Response received: ${response.data ? 'Yes' : 'No'}`);
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
    
    console.log('');
  }

  async demoRuleEngine() {
    console.log('⚖️ Demo: Rule Engine');
    
    // Add some sample rules
    const rule1 = {
      id: 'no-console',
      name: 'No Console Statements',
      description: 'Disallow console statements in production code',
      pattern: /console\.(log|warn|error|info)/,
      severity: 'error'
    };
    
    this.ruleEngine.addRule(rule1);
    
    // Test with sample code
    const sampleCode = `
      function test() {
        console.log('This should trigger a rule violation');
        return 'test';
      }
    `;
    
    const result = await this.ruleEngine.checkCode(sampleCode);
    console.log(`  Rules loaded: ${this.ruleEngine.getRules().length}`);
    console.log(`  Violations found: ${result.violations.length}`);
    
    if (result.violations.length > 0) {
      console.log(`  First violation: ${result.violations[0].message}`);
    }
    
    console.log('');
  }

  async demoCommitLinter() {
    console.log('📝 Demo: Commit Linter');
    
    const testCommits = [
      'feat: add new feature',
      'fix: resolve bug in authentication',
      'docs: update README',
      'invalid commit message',
      'chore: update dependencies'
    ];
    
    for (const commit of testCommits) {
      const result = await this.commitLinter.lint(commit);
      console.log(`  "${commit}" -> ${result.valid ? '✅ Valid' : '❌ Invalid'}`);
      if (!result.valid && result.errors.length > 0) {
        console.log(`    Error: ${result.errors[0]}`);
      }
    }
    
    console.log('');
  }

  async demoStateManagement() {
    console.log('🔄 Demo: State Management');
    
    // Set some state
    this.stateManager.setState('user', { name: 'John Doe', email: 'john@example.com' });
    this.stateManager.setState('theme', 'dark');
    this.stateManager.setState('settings', { notifications: true, autoSave: true });
    
    // Get state
    const user = this.stateManager.getState('user');
    const theme = this.stateManager.getState('theme');
    const settings = this.stateManager.getState('settings');
    
    console.log(`  User: ${user.name} (${user.email})`);
    console.log(`  Theme: ${theme}`);
    console.log(`  Settings: ${JSON.stringify(settings)}`);
    
    // Subscribe to changes
    this.stateManager.subscribe('theme', (newTheme) => {
      console.log(`  Theme changed to: ${newTheme}`);
    });
    
    console.log('');
  }

  async demoTestingFramework() {
    console.log('🧪 Demo: Testing Framework');
    
    // Create a simple test
    const testResult = await this.testingFramework.runTest('Sample Test', async () => {
      const result = 2 + 2;
      if (result !== 4) {
        throw new Error('Math is broken!');
      }
      return result;
    });
    
    console.log(`  Test passed: ${testResult.passed ? '✅ Yes' : '❌ No'}`);
    console.log(`  Test duration: ${testResult.duration}ms`);
    
    console.log('');
  }

  async demoLintingSystem() {
    console.log('🔍 Demo: Linting System');
    
    const sampleCode = `
      function test() {
        var unused = 'this should trigger a linting error';
        console.log('Hello World');
        return true;
      }
    `;
    
    const lintResult = await this.lintingSystem.lint(sampleCode);
    console.log(`  Linting errors: ${lintResult.errors.length}`);
    console.log(`  Linting warnings: ${lintResult.warnings.length}`);
    
    if (lintResult.errors.length > 0) {
      console.log(`  First error: ${lintResult.errors[0].message}`);
    }
    
    console.log('');
  }

  async demoUIComponents() {
    console.log('🎨 Demo: UI Components');
    
    // Simulate UI component usage
    const button = new Button({ text: 'Click me', variant: 'primary' });
    const card = new Card({ title: 'Sample Card', content: 'This is a sample card' });
    const input = new Input({ placeholder: 'Enter text...', type: 'text' });
    const modal = new Modal({ title: 'Sample Modal', content: 'This is a sample modal' });
    
    console.log(`  Button created: ${button.text}`);
    console.log(`  Card created: ${card.title}`);
    console.log(`  Input created: ${input.placeholder}`);
    console.log(`  Modal created: ${modal.title}`);
    
    console.log('');
  }

  async demoAdditionalServices() {
    console.log('📧 Demo: Additional Services');
    
    // Demo stakeholder reporting
    console.log('  Stakeholder Reporter: Ready');
    
    // Demo email service
    console.log('  Email Service: Ready');
    
    // Demo notification service
    console.log('  Notification Service: Ready');
    
    // Demo GraphQL service
    console.log('  GraphQL Service: Ready');
    
    console.log('');
  }

  async demoCLI() {
    console.log('⚡ Demo: CLI');
    
    console.log('  CLI initialized and ready');
    console.log('  Available commands:');
    console.log('    - synapse-demo init');
    console.log('    - synapse-demo build');
    console.log('    - synapse-demo test');
    console.log('    - synapse-demo lint');
    console.log('    - synapse-demo deploy');
    
    console.log('');
  }
}

// Main execution
async function main() {
  const demo = new SynapseEcosystemDemo();
  
  try {
    await demo.initialize();
    await demo.runDemo();
  } catch (error) {
    console.error('❌ Demo failed:', error);
    process.exit(1);
  }
}

// Run the demo
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default SynapseEcosystemDemo;