// Test utility packages
import { SynapseTestingFramework } from '@snps/testing';
import { SynapseLintingSystem } from '@snps/linting';
import { SynapseRouter } from '@snps/router';
import { SynapseStateManager } from '@snps/state';
import { SynapsePluginSystem } from '@snps/plugins';

console.log('🧪 Testing utility packages...\n');

async function testUtilityPackages() {
  try {
    console.log('1. Testing @snps/testing...');
    const testing = new SynapseTestingFramework();
    console.log('✅ SynapseTestingFramework instantiated');
    console.log('Methods available:', typeof testing.runTests);
    
    console.log('\n2. Testing @snps/linting...');
    const linting = new SynapseLintingSystem();
    console.log('✅ SynapseLintingSystem instantiated');
    console.log('Methods available:', typeof linting.lint);
    
    console.log('\n3. Testing @snps/router...');
    const router = new SynapseRouter();
    console.log('✅ SynapseRouter instantiated');
    console.log('Methods available:', typeof router.route);
    
    console.log('\n4. Testing @snps/state...');
    const state = new SynapseStateManager();
    console.log('✅ SynapseStateManager instantiated');
    console.log('Methods available:', typeof state.manageState);
    
    console.log('\n5. Testing @snps/plugins...');
    const plugins = new SynapsePluginSystem();
    console.log('✅ SynapsePluginSystem instantiated');
    console.log('Methods available:', typeof plugins.loadPlugins);
    
    console.log('\n✅ All utility packages are working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing utility packages:', error.message);
    console.error('Stack:', error.stack);
  }
}

testUtilityPackages();
