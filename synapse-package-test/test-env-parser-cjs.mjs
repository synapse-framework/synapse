// Test EnvParser with CommonJS import
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { EnvParser } = require('@snps/env-parser-rust');

console.log('🧪 Testing EnvParser with CommonJS import...\n');

async function testEnvParserCJS() {
  try {
    console.log('1. Testing EnvParser instantiation...');
    const envParser = new EnvParser();
    console.log('✅ EnvParser instantiated successfully!');
    
    console.log('\n2. Testing basic functionality...');
    envParser.loadFromString('TEST=value\nANOTHER=test');
    const value = envParser.get('TEST');
    console.log('✅ EnvParser working, TEST value:', value);
    
    console.log('\n✅ EnvParser is working with CommonJS import!');
    
  } catch (error) {
    console.error('❌ Error testing EnvParser:', error.message);
    console.error('Stack:', error.stack);
  }
}

testEnvParserCJS();
