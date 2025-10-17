// Test all Rust packages
import envParserModule from '@snps/env-parser-rust';
import httpClientModule from '@snps/http-client-rust';
import ruleEngineModule from '@snps/rule-engine-rust';

console.log('🧪 Testing Rust packages...\n');

async function testRustPackages() {
  try {
    console.log('1. Testing @snps/env-parser-rust...');
    console.log('Available exports:', Object.keys(envParserModule));
    
    // Try different ways to instantiate
    try {
      const envParser1 = new envParserModule.EnvParser();
      console.log('✅ EnvParser instantiated via .EnvParser');
    } catch (e) {
      console.log('❌ Failed via .EnvParser:', e.message);
    }
    
    try {
      const envParser2 = new envParserModule.default.EnvParser();
      console.log('✅ EnvParser instantiated via .default.EnvParser');
    } catch (e) {
      console.log('❌ Failed via .default.EnvParser:', e.message);
    }
    
    console.log('\n2. Testing @snps/http-client-rust...');
    console.log('Available exports:', Object.keys(httpClientModule));
    
    try {
      const httpClient = new httpClientModule.HttpClient();
      console.log('✅ HttpClient instantiated successfully');
    } catch (e) {
      console.log('❌ Failed to instantiate HttpClient:', e.message);
    }
    
    console.log('\n3. Testing @snps/rule-engine-rust...');
    console.log('Available exports:', Object.keys(ruleEngineModule));
    
    try {
      const ruleEngine = new ruleEngineModule.RuleEngine();
      console.log('✅ RuleEngine instantiated successfully');
    } catch (e) {
      console.log('❌ Failed to instantiate RuleEngine:', e.message);
    }
    
    console.log('\n✅ Rust packages testing completed!');
    
  } catch (error) {
    console.error('❌ Error testing Rust packages:', error.message);
    console.error('Stack:', error.stack);
  }
}

testRustPackages();
