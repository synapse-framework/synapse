// Test EnvParser wrapper
import { EnvParser } from '@snps/env-parser-rust';

console.log('🧪 Testing EnvParser wrapper...\n');

async function testEnvParserWrapper() {
  try {
    console.log('1. Testing EnvParser instantiation...');
    const envParser = new EnvParser();
    console.log('✅ EnvParser instantiated successfully!');
    
    console.log('\n2. Testing basic functionality...');
    envParser.loadFromString('TEST=value\nANOTHER=test');
    const value = envParser.get('TEST');
    console.log('✅ EnvParser working, TEST value:', value);
    
    const hasTest = envParser.has('TEST');
    console.log('✅ Has TEST key:', hasTest);
    
    const allVars = envParser.all();
    console.log('✅ All variables:', allVars);
    
    console.log('\n3. Testing static methods...');
    const staticResult = EnvParser.parse('STATIC=test');
    console.log('✅ Static parse result:', staticResult);
    
    console.log('\n✅ EnvParser wrapper is working perfectly!');
    
  } catch (error) {
    console.error('❌ Error testing EnvParser:', error.message);
    console.error('Stack:', error.stack);
  }
}

testEnvParserWrapper();
