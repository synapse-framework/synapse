// Test CLI with debug output
import { SynapseCLI } from '@snps/cli';

async function testCLI() {
  console.log('🔍 Testing CLI with debug...');
  
  const cli = new SynapseCLI();
  
  // Override the run method to add debug output
  const originalRun = cli.run.bind(cli);
  cli.run = async function() {
    console.log('🔍 CLI run method called');
    console.log('Arguments:', process.argv);
    return originalRun();
  };
  
  // Set up process.argv to simulate 'synapse init test-project'
  process.argv = ['node', 'synapse', 'init', 'test-project-debug'];
  
  try {
    await cli.run();
    console.log('✅ CLI run completed');
  } catch (error) {
    console.error('❌ CLI run failed:', error.message);
  }
}

testCLI();
