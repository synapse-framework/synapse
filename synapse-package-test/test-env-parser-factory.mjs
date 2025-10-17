// Test EnvParser factory function
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { EnvParser } = require('@snps/env-parser-rust');

console.log('🧪 Testing EnvParser factory function...\n');

async function testEnvParserFactory() {
  try {
    console.log('1. Testing EnvParser.create()...');
    const envParser = EnvParser.create();
    console.log('✅ EnvParser created successfully!');
    
    console.log('\n2. Testing basic functionality...');
    envParser.loadFromString('TEST=value\nANOTHER=test');
    const value = envParser.get('TEST');
    console.log('✅ EnvParser working, TEST value:', value);
    
    const hasTest = envParser.has('TEST');
    console.log('✅ Has TEST key:', hasTest);
    
    const allVars = envParser.all();
    console.log('✅ All variables:', allVars);
    
    console.log('\n✅ EnvParser factory function is working!');
    
  } catch (error) {
    console.error('❌ Error testing EnvParser:', error.message);
    console.error('Stack:', error.stack);
  }
}

testEnvParserFactory();
