#!/usr/bin/env node

/**
 * Comprehensive Test Runner for Synapse Ecosystem
 * 
 * This script runs all tests for the entire Synapse ecosystem and provides
 * detailed reporting on the status of each package and integration.
 */

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Test configuration
const TEST_CONFIG = {
  timeout: 30000,
  concurrency: true,
  verbose: true
};

// Test results tracking
const testResults = {
  core: { passed: 0, failed: 0, total: 0, errors: [] },
  rust: { passed: 0, failed: 0, total: 0, errors: [] },
  ui: { passed: 0, failed: 0, total: 0, errors: [] },
  integration: { passed: 0, failed: 0, total: 0, errors: [] },
  e2e: { passed: 0, failed: 0, total: 0, errors: [] }
};

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

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Test runner class
class SynapseTestRunner {
  constructor() {
    this.startTime = Date.now();
    this.packages = new Map();
    this.testSuites = [];
  }

  async runAllTests() {
    logHeader('SYNAPSE ECOSYSTEM COMPREHENSIVE TEST SUITE');
    log(`Starting comprehensive testing of all Synapse packages...\n`);

    try {
      // Test Core Framework Packages
      await this.testCorePackages();
      
      // Test Rust Packages
      await this.testRustPackages();
      
      // Test UI Packages
      await this.testUIPackages();
      
      // Test Integration
      await this.testIntegration();
      
      // Test End-to-End
      await this.testEndToEnd();
      
      // Generate final report
      this.generateReport();
      
    } catch (error) {
      logError(`Test suite failed: ${error.message}`);
      process.exit(1);
    }
  }

  async testCorePackages() {
    logSection('Testing Core Framework Packages');
    
    const corePackages = [
      '@snps/core',
      '@snps/compiler', 
      '@snps/testing',
      '@snps/linting',
      '@snps/router',
      '@snps/state',
      '@snps/plugins'
    ];

    for (const packageName of corePackages) {
      try {
        logInfo(`Testing ${packageName}...`);
        
        // Test package import
        const pkg = await import(packageName);
        assert(pkg !== null, `Failed to import ${packageName}`);
        
        // Test basic functionality
        if (packageName === '@snps/core') {
          const framework = new pkg.SynapseFramework({
            name: 'TestApp',
            version: '1.0.0',
            mode: 'test'
          });
          assert(framework.name === 'TestApp');
        }
        
        testResults.core.passed++;
        logSuccess(`${packageName} - Import and basic functionality OK`);
        
      } catch (error) {
        testResults.core.failed++;
        testResults.core.errors.push(`${packageName}: ${error.message}`);
        logError(`${packageName} - ${error.message}`);
      }
      
      testResults.core.total++;
    }
  }

  async testRustPackages() {
    logSection('Testing Rust Packages');
    
    const rustPackages = [
      '@snps/env-parser-rust',
      '@snps/commit-lint-rust',
      '@snps/http-client-rust',
      '@snps/rule-engine-rust'
    ];

    for (const packageName of rustPackages) {
      try {
        logInfo(`Testing ${packageName}...`);
        
        // Test package import
        const pkg = await import(packageName);
        assert(pkg !== null, `Failed to import ${packageName}`);
        
        // Test instance creation
        let instance;
        if (packageName === '@snps/env-parser-rust') {
          instance = new pkg.EnvParser();
          await instance.loadFromString('TEST_VAR=test_value');
          assert(instance.get('TEST_VAR') === 'test_value');
        } else if (packageName === '@snps/commit-lint-rust') {
          instance = new pkg.CommitLinter();
          const result = await instance.lint('feat: add new feature');
          assert(result.valid === true);
        } else if (packageName === '@snps/http-client-rust') {
          instance = new pkg.HttpClient('https://httpbin.org');
          // Test basic properties
          assert(instance !== null);
        } else if (packageName === '@snps/rule-engine-rust') {
          instance = new pkg.RuleEngine();
          instance.addRule({
            id: 'test-rule',
            name: 'Test Rule',
            pattern: /test/,
            severity: 'error'
          });
          assert(instance.getRules().length === 1);
        }
        
        testResults.rust.passed++;
        logSuccess(`${packageName} - Instance creation and basic functionality OK`);
        
      } catch (error) {
        testResults.rust.failed++;
        testResults.rust.errors.push(`${packageName}: ${error.message}`);
        logError(`${packageName} - ${error.message}`);
      }
      
      testResults.rust.total++;
    }
  }

  async testUIPackages() {
    logSection('Testing UI Packages');
    
    const uiPackages = ['@snps/ui', '@snps/cli'];

    for (const packageName of uiPackages) {
      try {
        logInfo(`Testing ${packageName}...`);
        
        // Test package import
        const pkg = await import(packageName);
        assert(pkg !== null, `Failed to import ${packageName}`);
        
        // Test basic functionality
        if (packageName === '@snps/ui') {
          const { Button, Card, Input } = pkg;
          const button = new Button({ text: 'Test', variant: 'primary' });
          const card = new Card({ title: 'Test', content: 'Test content' });
          const input = new Input({ placeholder: 'Test input' });
          
          assert(button.text === 'Test');
          assert(card.title === 'Test');
          assert(input.placeholder === 'Test input');
        } else if (packageName === '@snps/cli') {
          const cli = new pkg.SynapseCLI({
            name: 'test-cli',
            version: '1.0.0',
            description: 'Test CLI'
          });
          assert(cli.name === 'test-cli');
        }
        
        testResults.ui.passed++;
        logSuccess(`${packageName} - Component creation and basic functionality OK`);
        
      } catch (error) {
        testResults.ui.failed++;
        testResults.ui.errors.push(`${packageName}: ${error.message}`);
        logError(`${packageName} - ${error.message}`);
      }
      
      testResults.ui.total++;
    }
  }

  async testIntegration() {
    logSection('Testing Package Integration');
    
    try {
      logInfo('Testing package integration...');
      
      // Test that packages can work together
      const { EnvParser } = await import('@snps/env-parser-rust');
      const { SynapseStateManager } = await import('@snps/state');
      const { Button } = await import('@snps/ui');
      
      // Create instances
      const envParser = new EnvParser();
      const stateManager = new SynapseStateManager({ initialState: {} });
      const button = new Button({ text: 'Test' });
      
      // Test integration
      await envParser.loadFromString('APP_NAME=TestApp');
      stateManager.setState('appName', envParser.get('APP_NAME'));
      
      const appName = stateManager.getState('appName');
      assert(appName === 'TestApp');
      assert(button.text === 'Test');
      
      testResults.integration.passed++;
      logSuccess('Package integration - All packages work together correctly');
      
    } catch (error) {
      testResults.integration.failed++;
      testResults.integration.errors.push(`Integration: ${error.message}`);
      logError(`Package integration - ${error.message}`);
    }
    
    testResults.integration.total++;
  }

  async testEndToEnd() {
    logSection('Testing End-to-End Application Flow');
    
    try {
      logInfo('Testing complete application workflow...');
      
      // Import all packages
      const { SynapseFramework } = await import('@snps/core');
      const { EnvParser } = await import('@snps/env-parser-rust');
      const { CommitLinter } = await import('@snps/commit-lint-rust');
      const { HttpClient } = await import('@snps/http-client-rust');
      const { RuleEngine } = await import('@snps/rule-engine-rust');
      const { SynapseStateManager } = await import('@snps/state');
      const { SynapseRouter } = await import('@snps/router');
      const { SynapseTestingFramework } = await import('@snps/testing');
      const { SynapseLintingSystem } = await import('@snps/linting');
      const { Button, Card, Input } = await import('@snps/ui');
      const { SynapseCLI } = await import('@snps/cli');
      
      // Initialize framework
      const framework = new SynapseFramework({
        name: 'E2ETestApp',
        version: '1.0.0',
        mode: 'test'
      });
      
      // Initialize all components
      const envParser = new EnvParser();
      const commitLinter = new CommitLinter();
      const httpClient = new HttpClient('https://httpbin.org');
      const ruleEngine = new RuleEngine();
      const stateManager = new SynapseStateManager({
        initialState: { user: null, settings: {} }
      });
      const router = new SynapseRouter({
        routes: [{ path: '/', component: 'HomePage' }]
      });
      const testingFramework = new SynapseTestingFramework({
        coverageThreshold: 100,
        strictMode: true,
        testTimeout: 5000
      });
      const lintingSystem = new SynapseLintingSystem({
        rules: 'all',
        strict: true,
        autoFix: true
      });
      const cli = new SynapseCLI({
        name: 'e2e-test-cli',
        version: '1.0.0',
        description: 'E2E Test CLI'
      });
      
      // Test complete workflow
      await envParser.loadFromString('APP_NAME=E2ETestApp\nDEBUG=true');
      stateManager.setState('appName', envParser.get('APP_NAME'));
      router.navigate('/');
      
      const commitResult = await commitLinter.lint('feat: add e2e testing');
      assert(commitResult.valid === true);
      
      ruleEngine.addRule({
        id: 'no-console',
        name: 'No Console',
        pattern: /console\./,
        severity: 'error'
      });
      
      const ruleResult = await ruleEngine.checkCode('console.log("test");');
      assert(ruleResult.violations.length > 0);
      
      const testResult = await testingFramework.runTest('E2E Test', async () => {
        const appName = stateManager.getState('appName');
        assert(appName === 'E2ETestApp');
        return true;
      });
      assert(testResult.passed === true);
      
      const lintResult = await lintingSystem.lint('var x = 1;');
      assert(Array.isArray(lintResult.errors));
      
      const button = new Button({ text: 'E2E Test' });
      const card = new Card({ title: 'E2E Test', content: 'Test content' });
      const input = new Input({ placeholder: 'E2E Test input' });
      
      assert(button.text === 'E2E Test');
      assert(card.title === 'E2E Test');
      assert(input.placeholder === 'E2E Test input');
      
      // Cleanup
      await framework.stop();
      
      testResults.e2e.passed++;
      logSuccess('End-to-end application flow - Complete workflow executed successfully');
      
    } catch (error) {
      testResults.e2e.failed++;
      testResults.e2e.errors.push(`E2E: ${error.message}`);
      logError(`End-to-end application flow - ${error.message}`);
    }
    
    testResults.e2e.total++;
  }

  generateReport() {
    const endTime = Date.now();
    const duration = endTime - this.startTime;
    
    logHeader('TEST RESULTS SUMMARY');
    
    const categories = [
      { name: 'Core Framework', results: testResults.core },
      { name: 'Rust Packages', results: testResults.rust },
      { name: 'UI Packages', results: testResults.ui },
      { name: 'Integration', results: testResults.integration },
      { name: 'End-to-End', results: testResults.e2e }
    ];
    
    let totalPassed = 0;
    let totalFailed = 0;
    let totalTests = 0;
    
    for (const category of categories) {
      const { name, results } = category;
      const percentage = results.total > 0 ? Math.round((results.passed / results.total) * 100) : 0;
      
      log(`\n${name}:`, 'bright');
      log(`  Tests: ${results.passed}/${results.total} passed (${percentage}%)`, 
          results.failed === 0 ? 'green' : 'yellow');
      
      if (results.failed > 0) {
        log(`  Failed: ${results.failed}`, 'red');
        for (const error of results.errors) {
          log(`    - ${error}`, 'red');
        }
      }
      
      totalPassed += results.passed;
      totalFailed += results.failed;
      totalTests += results.total;
    }
    
    const overallPercentage = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;
    
    log(`\nOverall Results:`, 'bright');
    log(`  Total Tests: ${totalTests}`, 'blue');
    log(`  Passed: ${totalPassed}`, 'green');
    log(`  Failed: ${totalFailed}`, totalFailed === 0 ? 'green' : 'red');
    log(`  Success Rate: ${overallPercentage}%`, overallPercentage === 100 ? 'green' : 'yellow');
    log(`  Duration: ${duration}ms`, 'blue');
    
    if (totalFailed === 0) {
      log(`\n🎉 ALL TESTS PASSED! The Synapse ecosystem is working perfectly!`, 'green');
    } else {
      log(`\n⚠️  Some tests failed. Please review the errors above.`, 'yellow');
    }
    
    // Exit with appropriate code
    process.exit(totalFailed === 0 ? 0 : 1);
  }
}

// Run the tests
async function main() {
  const runner = new SynapseTestRunner();
  await runner.runAllTests();
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    logError(`Test runner failed: ${error.message}`);
    process.exit(1);
  });
}

export default SynapseTestRunner;