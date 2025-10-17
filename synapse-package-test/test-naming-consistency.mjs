// Test naming consistency across packages
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

async function testNamingConsistency() {
  console.log('🔍 Testing naming consistency across packages...\n');
  
  try {
    // Test core package
    const core = await import('@snps/core');
    console.log('@snps/core exports:', Object.keys(core));
    
    // Test individual packages
    const testing = await import('@snps/testing');
    console.log('@snps/testing exports:', Object.keys(testing));
    
    const linting = await import('@snps/linting');
    console.log('@snps/linting exports:', Object.keys(linting));
    
    const router = await import('@snps/router');
    console.log('@snps/router exports:', Object.keys(router));
    
    const state = await import('@snps/state');
    console.log('@snps/state exports:', Object.keys(state));
    
    const plugins = await import('@snps/plugins');
    console.log('@snps/plugins exports:', Object.keys(plugins));
    
    console.log('\n📊 Naming Analysis:');
    console.log('Core package uses full names: SynapseTestingFramework, SynapseLintingSystem, etc.');
    console.log('Individual packages use short names: SynapseTesting, SynapseLinting, etc.');
    console.log('This creates confusion for developers!');
    
  } catch (error) {
    console.error('❌ Error testing naming consistency:', error.message);
  }
}

testNamingConsistency();
