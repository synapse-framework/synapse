/**
 * Test suite for @snps/ai-debug
 */

console.log('\n=== Testing @snps/ai-debug ===\n');

async function testAIDebug() {
  try {
    // Import the module
    const { SynapseAIDebug, ErrorCategory, ErrorSeverity } = await import('./packages/ai-debug/dist/index.js');

    console.log('✓ Module imported successfully');

    // Create instance
    const debug = new SynapseAIDebug();
    console.log('✓ Instance created');

    // Initialize
    await debug.initialize();
    console.log('✓ Initialized successfully');

    // Get info
    const info = debug.getInfo();
    console.log('✓ Info retrieved:', info.name, info.version);
    console.log('  Features:', info.features.length);

    // Test 1: Analyze undefined error
    console.log('\nTest 1: Analyze Undefined Error');
    const undefinedError = new Error("Cannot read property 'value' of undefined");
    undefinedError.stack = `Error: Cannot read property 'value' of undefined
    at processData (app.ts:10:5)
    at main (app.ts:20:3)`;

    const analysis1 = debug.analyzeError(undefinedError);
    console.log('✓ Error analyzed');
    console.log('  Category:', analysis1.category);
    console.log('  Severity:', analysis1.severity);
    console.log('  Root cause:', analysis1.rootCause);
    console.log('  Stack frames:', analysis1.stackTrace.length);
    console.log('  Suggestions:', analysis1.suggestions.length);

    // Test 2: Analyze type error
    console.log('\nTest 2: Analyze Type Error');
    const typeError = new TypeError('value.map is not a function');
    typeError.stack = `TypeError: value.map is not a function
    at transform (utils.ts:15:12)`;

    const analysis2 = debug.analyzeError(typeError);
    console.log('✓ Error analyzed');
    console.log('  Category:', analysis2.category);
    console.log('  Severity:', analysis2.severity);
    console.log('  Suggestions:', analysis2.suggestions.length);
    if (analysis2.suggestions.length > 0) {
      console.log('  Top suggestion:', analysis2.suggestions[0].title);
      console.log('  Confidence:', Math.round(analysis2.suggestions[0].confidence * 100) + '%');
    }

    // Test 3: Stack trace analysis
    console.log('\nTest 3: Stack Trace Analysis');
    const recursionError = new Error('Maximum call stack size exceeded');
    recursionError.stack = `Error: Maximum call stack size exceeded
    at factorial (math.ts:5:10)
    at factorial (math.ts:5:10)
    at factorial (math.ts:5:10)
    at factorial (math.ts:5:10)
    at factorial (math.ts:5:10)`;

    const analysis3 = debug.analyzeError(recursionError);
    const insights = debug.analyzeStackTrace(analysis3.stackTrace);
    console.log('✓ Stack trace analyzed');
    console.log('  Insights found:', insights.length);
    insights.forEach((insight, i) => {
      console.log(`  ${i + 1}. [${insight.type}] ${insight.title}`);
    });

    // Test 4: Generate code insights
    console.log('\nTest 4: Generate Code Insights');
    const problematicCode = `
      console.log('test');
      console.log('debug');
      console.log('info');

      try {
        doSomething();
      } catch (e) {
        // Silent error
      }

      var oldStyle = true;

      async function fetchData() {
        return await fetch(url);
      }
    `;

    const codeInsights = debug.generateInsights(problematicCode, 'problematic.ts');
    console.log('✓ Generated', codeInsights.length, 'insights');
    codeInsights.forEach((insight, i) => {
      console.log(`  ${i + 1}. [${insight.type}] ${insight.title}`);
      console.log(`     ${insight.description}`);
    });

    // Test 5: Quick diagnosis
    console.log('\nTest 5: Quick Diagnosis');
    const nullError = new Error('Cannot read property of null');
    const diagnosis = debug.diagnose(nullError);
    console.log('✓ Diagnosis generated');
    console.log(diagnosis.substring(0, 200) + '...');

    // All tests passed
    console.log('\n✅ All @snps/ai-debug tests passed!\n');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    return false;
  }
}

// Run tests
testAIDebug().then(success => {
  process.exit(success ? 0 : 1);
});
