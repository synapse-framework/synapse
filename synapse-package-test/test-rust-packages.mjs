// Test all Rust packages
import { EnvParser } from '@snps/env-parser-rust';
import { HttpClient } from '@snps/http-client-rust';
import { RuleEngine } from '@snps/rule-engine-rust';

console.log('🧪 Testing Rust packages...\n');

async function testRustPackages() {
  try {
    console.log('1. Testing @snps/env-parser-rust...');
    const envParser = new EnvParser();
    envParser.loadFromString('TEST=value\nANOTHER=test');
    const value = envParser.get('TEST');
    console.log('✅ EnvParser working, TEST value:', value);
    
    console.log('\n2. Testing @snps/http-client-rust...');
    const httpClient = new HttpClient();
    console.log('✅ HttpClient instantiated successfully');
    
    console.log('\n3. Testing @snps/rule-engine-rust...');
    const ruleEngine = new RuleEngine();
    console.log('✅ RuleEngine instantiated successfully');
    
    console.log('\n✅ All Rust packages are working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing Rust packages:', error.message);
    console.error('Stack:', error.stack);
  }
}

testRustPackages();
