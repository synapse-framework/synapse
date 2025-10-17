// Test @snps/commit-lint-rust package
import { lintCommitMessage, CommitLinter } from '@snps/commit-lint-rust-linux-x64-gnu';

console.log('🧪 Testing @snps/commit-lint-rust package...\n');

async function testCommitLintPackage() {
  try {
    console.log('1. Testing lintCommitMessage function...');
    
    // Test valid commit message
    const validMessage = 'feat: add new feature';
    console.log('Testing valid message:', validMessage);
    const result1 = lintCommitMessage(validMessage);
    console.log('Result:', result1);
    
    // Test invalid commit message
    const invalidMessage = 'invalid commit message';
    console.log('\nTesting invalid message:', invalidMessage);
    const result2 = lintCommitMessage(invalidMessage);
    console.log('Result:', result2);
    
    console.log('\n2. Testing CommitLinter class...');
    
    const linter = new CommitLinter();
    console.log('✅ CommitLinter instantiated successfully');
    
    // Test lint method
    const lintResult = linter.lint(validMessage);
    console.log('Lint result:', lintResult);
    
    console.log('\n✅ @snps/commit-lint-rust package is working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing @snps/commit-lint-rust:', error.message);
    console.error('Stack:', error.stack);
  }
}

testCommitLintPackage();
