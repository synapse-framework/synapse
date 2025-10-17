// Test EnvParser static methods
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { EnvParser } = require('@snps/env-parser-rust');

console.log('🧪 Testing EnvParser static methods...\n');

async function testEnvParserStatic() {
  try {
    console.log('1. Testing EnvParser.parse...');
    const result = EnvParser.parse('TEST=value\nANOTHER=test');
    console.log('✅ Parse result:', result);
    
    console.log('\n2. Testing EnvParser.load...');
    const loadResult = EnvParser.load();
    console.log('✅ Load result (empty .env):', loadResult);
    
    console.log('\n✅ EnvParser static methods are working!');
    
  } catch (error) {
    console.error('❌ Error testing EnvParser:', error.message);
    console.error('Stack:', error.stack);
  }
}

testEnvParserStatic();
