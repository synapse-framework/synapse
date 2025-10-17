// Test updated naming consistency
async function testNamingConsistencyUpdated() {
  console.log('🔍 Testing updated naming consistency...\n');
  
  try {
    // Test individual packages with updated names
    const testing = await import('@snps/testing');
    console.log('@snps/testing exports:', Object.keys(testing));
    
    const linting = await import('@snps/linting');
    console.log('@snps/linting exports:', Object.keys(linting));
    
    const state = await import('@snps/state');
    console.log('@snps/state exports:', Object.keys(state));
    
    const plugins = await import('@snps/plugins');
    console.log('@snps/plugins exports:', Object.keys(plugins));
    
    console.log('\n✅ Testing both naming conventions:');
    
    // Test new standardized names
    const TestingFramework = new testing.SynapseTestingFramework();
    console.log('✅ SynapseTestingFramework:', TestingFramework.name);
    
    const LintingSystem = new linting.SynapseLintingSystem();
    console.log('✅ SynapseLintingSystem:', LintingSystem.name);
    
    const StateManager = new state.SynapseStateManager();
    console.log('✅ SynapseStateManager:', StateManager.name);
    
    const PluginSystem = new plugins.SynapsePluginSystem();
    console.log('✅ SynapsePluginSystem:', PluginSystem.name);
    
    // Test backward compatibility aliases
    const TestingAlias = new testing.SynapseTesting();
    console.log('✅ SynapseTesting (alias):', TestingAlias.name);
    
    const LintingAlias = new linting.SynapseLinting();
    console.log('✅ SynapseLinting (alias):', LintingAlias.name);
    
    const StateAlias = new state.SynapseState();
    console.log('✅ SynapseState (alias):', StateAlias.name);
    
    const PluginsAlias = new plugins.SynapsePlugins();
    console.log('✅ SynapsePlugins (alias):', PluginsAlias.name);
    
    console.log('\n🎉 Naming consistency achieved! Both full names and aliases work!');
    
  } catch (error) {
    console.error('❌ Error testing naming consistency:', error.message);
  }
}

testNamingConsistencyUpdated();
