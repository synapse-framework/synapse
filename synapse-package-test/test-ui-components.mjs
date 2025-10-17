// Test UI components
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Test that we can import the components
try {
  const { Button, Input, Card, ThemeProvider } = require('@snps/ui');
  console.log('✅ UI components imported successfully');
  console.log('Button:', typeof Button);
  console.log('Input:', typeof Input);
  console.log('Card:', typeof Card);
  console.log('ThemeProvider:', typeof ThemeProvider);
} catch (error) {
  console.error('❌ Error importing UI components:', error.message);
}
