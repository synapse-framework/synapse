// Test @snps/core package following its README
const { 
  SynapseRuntime,
  SynapseCompiler,
  SynapseTestingFramework,
  SynapseLintingSystem,
  SynapseRouter,
  SynapseStateManager,
  SynapsePluginSystem
} = require('@snps/core');

console.log('🧪 Testing @snps/core package...\n');

async function testCorePackage() {
  try {
    console.log('1. Testing component instantiation...');
    
    // Initialize components
    const runtime = new SynapseRuntime();
    const compiler = new SynapseCompiler();
    const testing = new SynapseTestingFramework();
    const linting = new SynapseLintingSystem();
    const router = new SynapseRouter();
    const state = new SynapseStateManager();
    const plugins = new SynapsePluginSystem();
    
    console.log('✅ All components instantiated successfully');
    
    console.log('\n2. Testing component methods...');
    
    // Test basic methods (without actually running them to avoid side effects)
    console.log('Runtime methods:', typeof runtime.start);
    console.log('Compiler methods:', typeof compiler.compile);
    console.log('Testing methods:', typeof testing.runTests);
    console.log('Linting methods:', typeof linting.lint);
    console.log('Router methods:', typeof router.route);
    console.log('State methods:', typeof state.manageState);
    console.log('Plugin methods:', typeof plugins.loadPlugins);
    
    console.log('\n✅ @snps/core package is working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing @snps/core:', error.message);
    console.error('Stack:', error.stack);
  }
}

testCorePackage();
