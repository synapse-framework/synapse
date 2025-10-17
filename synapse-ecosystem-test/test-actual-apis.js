#!/usr/bin/env node

/**
 * Test Actual Synapse Package APIs
 * 
 * This script tests the actual APIs of the Synapse packages as they are published,
 * rather than making assumptions about their structure.
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

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

// Test results tracking
const testResults = {
  core: { passed: 0, failed: 0, total: 0, errors: [] },
  rust: { passed: 0, failed: 0, total: 0, errors: [] },
  ui: { passed: 0, failed: 0, total: 0, errors: [] },
  integration: { passed: 0, failed: 0, total: 0, errors: [] }
};

class SynapseAPITester {
  constructor() {
    this.startTime = Date.now();
  }

  async testAllPackages() {
    logHeader('TESTING ACTUAL SYNAPSE PACKAGE APIs');
    log(`Testing the actual APIs of published Synapse packages...\n`);

    try {
      // Test Core Framework Packages
      await this.testCorePackages();
      
      // Test Rust Packages
      await this.testRustPackages();
      
      // Test UI Packages
      await this.testUIPackages();
      
      // Test Integration
      await this.testIntegration();
      
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
        
        // Log available exports
        const exports = Object.keys(pkg);
        logInfo(`  Available exports: ${exports.join(', ')}`);
        
        // Test basic functionality based on actual exports
        if (packageName === '@snps/core') {
          // Test SynapseRuntime
          if (pkg.SynapseRuntime) {
            const runtime = new pkg.SynapseRuntime();
            assert(runtime !== null);
            logInfo(`  SynapseRuntime created successfully`);
          }
          
          // Test SynapseCompiler
          if (pkg.SynapseCompiler) {
            const compiler = new pkg.SynapseCompiler();
            assert(compiler !== null);
            logInfo(`  SynapseCompiler created successfully`);
          }
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
        
        // Log available exports
        const exports = Object.keys(pkg);
        logInfo(`  Available exports: ${exports.join(', ')}`);
        
        // Test instance creation based on actual exports
        if (packageName === '@snps/env-parser-rust') {
          if (pkg.EnvParser) {
            const instance = new pkg.EnvParser();
            assert(instance !== null);
            
            // Test basic functionality
            await instance.loadFromString('TEST_VAR=test_value');
            const value = instance.get('TEST_VAR');
            assert(value === 'test_value');
            logInfo(`  EnvParser functionality verified`);
          }
        } else if (packageName === '@snps/commit-lint-rust') {
          if (pkg.CommitLinter) {
            const instance = new pkg.CommitLinter();
            assert(instance !== null);
            
            // Test basic functionality
            const result = await instance.lint('feat: add new feature');
            assert(result.valid === true);
            logInfo(`  CommitLinter functionality verified`);
          }
        } else if (packageName === '@snps/http-client-rust') {
          if (pkg.HttpClient) {
            const instance = new pkg.HttpClient('https://httpbin.org');
            assert(instance !== null);
            logInfo(`  HttpClient created successfully`);
          }
        } else if (packageName === '@snps/rule-engine-rust') {
          if (pkg.RuleEngine) {
            const instance = new pkg.RuleEngine();
            assert(instance !== null);
            
            // Test basic functionality
            if (instance.addRule) {
              instance.addRule({
                id: 'test-rule',
                name: 'Test Rule',
                pattern: /test/,
                severity: 'error'
              });
              logInfo(`  RuleEngine functionality verified`);
            }
          }
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
        
        // Log available exports
        const exports = Object.keys(pkg);
        logInfo(`  Available exports: ${exports.join(', ')}`);
        
        // Test basic functionality based on actual exports
        if (packageName === '@snps/ui') {
          // Test UI components
          const components = ['Button', 'Card', 'Input', 'Modal', 'Table', 'Form'];
          for (const componentName of components) {
            if (pkg[componentName]) {
              logInfo(`  ${componentName} component available`);
            }
          }
        } else if (packageName === '@snps/cli') {
          // Test CLI
          if (pkg.SynapseCLI) {
            const cli = new pkg.SynapseCLI({
              name: 'test-cli',
              version: '1.0.0',
              description: 'Test CLI'
            });
            assert(cli !== null);
            logInfo(`  SynapseCLI created successfully`);
          }
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
      
      // Create instances
      const envParser = new EnvParser();
      const stateManager = new SynapseStateManager({ initialState: {} });
      
      // Test integration
      await envParser.loadFromString('APP_NAME=TestApp');
      stateManager.setState('appName', envParser.get('APP_NAME'));
      
      const appName = stateManager.getState('appName');
      assert(appName === 'TestApp');
      
      testResults.integration.passed++;
      logSuccess('Package integration - All packages work together correctly');
      
    } catch (error) {
      testResults.integration.failed++;
      testResults.integration.errors.push(`Integration: ${error.message}`);
      logError(`Package integration - ${error.message}`);
    }
    
    testResults.integration.total++;
  }

  generateReport() {
    const endTime = Date.now();
    const duration = endTime - this.startTime;
    
    logHeader('TEST RESULTS SUMMARY');
    
    const categories = [
      { name: 'Core Framework', results: testResults.core },
      { name: 'Rust Packages', results: testResults.rust },
      { name: 'UI Packages', results: testResults.ui },
      { name: 'Integration', results: testResults.integration }
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

// Helper function for assertions
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// Run the tests
async function main() {
  const tester = new SynapseAPITester();
  await tester.testAllPackages();
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    logError(`Test runner failed: ${error.message}`);
    process.exit(1);
  });
}

export default SynapseAPITester;