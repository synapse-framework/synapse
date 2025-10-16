/**
 * Test suite for @snps/ai-codegen
 */

console.log('\n=== Testing @snps/ai-codegen ===\n');

async function testAICodegen() {
  try {
    // Import the module
    const { SynapseAICodegen, CodePattern, Language } = await import('./packages/ai-codegen/dist/index.js');

    console.log('✓ Module imported successfully');

    // Create instance
    const codegen = new SynapseAICodegen();
    console.log('✓ Instance created');

    // Initialize
    await codegen.initialize();
    console.log('✓ Initialized successfully');

    // Get info
    const info = codegen.getInfo();
    console.log('✓ Info retrieved:', info.name, info.version);
    console.log('  Features:', info.features.length);

    // Test 1: Generate React component
    console.log('\nTest 1: Generate React Component');
    const componentResult = codegen.generate({
      pattern: CodePattern.Component,
      language: Language.TSX,
      name: 'UserProfile',
      description: 'User profile component',
    });
    console.log('✓ Generated component');
    console.log('  Lines of code:', componentResult.metadata.linesOfCode);
    console.log('  Complexity:', componentResult.metadata.complexity);
    console.log('  Code preview:', componentResult.code.substring(0, 100) + '...');

    // Test 2: Generate TypeScript class
    console.log('\nTest 2: Generate TypeScript Class');
    const classResult = codegen.generate({
      pattern: CodePattern.Class,
      language: Language.TypeScript,
      name: 'DataService',
    });
    console.log('✓ Generated class');
    console.log('  Lines of code:', classResult.metadata.linesOfCode);

    // Test 3: Generate suggestions
    console.log('\nTest 3: Generate Code Suggestions');
    const testCode = `
      function getData() {
        let result = null;
        return Promise.resolve(result);
      }
    `;
    const suggestions = codegen.suggest(testCode);
    console.log('✓ Generated', suggestions.length, 'suggestions');
    suggestions.forEach((suggestion, i) => {
      console.log(`  ${i + 1}. ${suggestion.type}: ${suggestion.description} (${Math.round(suggestion.confidence * 100)}%)`);
    });

    // Test 4: Generate completions
    console.log('\nTest 4: Generate Code Completions');
    const completions = codegen.complete('class UserService ');
    console.log('✓ Generated', completions.length, 'completions');
    completions.forEach((completion, i) => {
      console.log(`  ${i + 1}. ${completion}`);
    });

    // Test 5: Custom template
    console.log('\nTest 5: Register Custom Template');
    codegen.registerTemplate(
      CodePattern.Service,
      Language.TypeScript,
      'export class {{name}} { /* custom */ }'
    );
    console.log('✓ Custom template registered');

    // All tests passed
    console.log('\n✅ All @snps/ai-codegen tests passed!\n');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    return false;
  }
}

// Run tests
testAICodegen().then(success => {
  process.exit(success ? 0 : 1);
});
