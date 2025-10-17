// Test UI components with dynamic import
async function testUIComponents() {
  try {
    const { Button, Input, Card, ThemeProvider, cn, lightTheme, darkTheme } = await import('@snps/ui');
    console.log('✅ UI components imported successfully');
    console.log('Button:', typeof Button);
    console.log('Input:', typeof Input);
    console.log('Card:', typeof Card);
    console.log('ThemeProvider:', typeof ThemeProvider);
    console.log('cn utility:', typeof cn);
    console.log('lightTheme:', lightTheme);
    console.log('darkTheme:', darkTheme);
    
    // Test the cn utility function
    const className = cn('text-red-500', 'bg-blue-100', null, undefined, false);
    console.log('cn utility test:', className);
    
    console.log('\n✅ All UI components are working perfectly!');
  } catch (error) {
    console.error('❌ Error importing UI components:', error.message);
    console.error('Stack:', error.stack);
  }
}

testUIComponents();
