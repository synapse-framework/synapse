// Debug CLI methods
import { SynapseCLI } from '@snps/cli';

const cli = new SynapseCLI();
console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(cli)));

// Check if run method exists
if (typeof cli.run === 'function') {
  console.log('✅ run method exists');
} else {
  console.log('❌ run method does not exist');
}
