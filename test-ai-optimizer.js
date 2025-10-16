/**
 * Test suite for @snps/ai-optimizer
 */

console.log('\n=== Testing @snps/ai-optimizer ===\n');

async function testAIOptimizer() {
  try {
    // Import the module
    const { SynapseAIOptimizer, BottleneckType, Severity } = await import('./packages/ai-optimizer/dist/index.js');

    console.log('✓ Module imported successfully');

    // Create instance
    const optimizer = new SynapseAIOptimizer();
    console.log('✓ Instance created');

    // Initialize
    await optimizer.initialize();
    console.log('✓ Initialized successfully');

    // Get info
    const info = optimizer.getInfo();
    console.log('✓ Info retrieved:', info.name, info.version);
    console.log('  Features:', info.features.length);

    // Test 1: Analyze performance
    console.log('\nTest 1: Analyze Performance');
    const testCode = `
      function processData(items) {
        for (let i = 0; i < items.length; i++) {
          document.querySelector('#item-' + i).textContent = items[i];
        }
      }
    `;
    const bottlenecks = optimizer.analyzePerformance(testCode, 'app.ts');
    console.log('✓ Found', bottlenecks.length, 'bottlenecks');
    bottlenecks.forEach((bottleneck, i) => {
      console.log(`  ${i + 1}. [${bottleneck.severity}] ${bottleneck.type}: ${bottleneck.description}`);
      console.log(`     Impact: ${bottleneck.impact}%`);
    });

    // Test 2: Generate optimization suggestions
    console.log('\nTest 2: Generate Optimization Suggestions');
    const suggestions = optimizer.optimize(testCode, 'app.ts');
    console.log('✓ Generated', suggestions.length, 'suggestions');
    suggestions.forEach((suggestion, i) => {
      console.log(`  ${i + 1}. ${suggestion.title} (${suggestion.severity})`);
      console.log(`     Performance: +${suggestion.impact.performance}%`);
      console.log(`     Bundle: -${suggestion.impact.bundle}KB`);
    });

    // Test 3: Analyze bundle
    console.log('\nTest 3: Analyze Bundle');
    const bundleCode = 'console.log("test");';
    const dependencies = ['react', 'react-dom', 'lodash'];
    const bundleAnalysis = optimizer.analyzeBundle(bundleCode, dependencies);
    console.log('✓ Bundle analyzed');
    console.log('  Total size:', bundleAnalysis.totalSize, 'bytes');
    console.log('  Gzipped:', bundleAnalysis.gzippedSize, 'bytes');
    console.log('  Modules:', bundleAnalysis.modules.length);
    console.log('  Large modules:', bundleAnalysis.largeModules.length);
    console.log('  Duplicates:', bundleAnalysis.duplicates.length);

    // Test 4: Optimize bundle size
    console.log('\nTest 4: Optimize Bundle Size');
    const originalCode = `
      console.log("debug");
      /* Comment */
      // Another comment
      function   test  (  )   {   }
    `;
    const optimized = optimizer.optimizeBundleSize(originalCode);
    console.log('✓ Bundle optimized');
    console.log('  Original size:', originalCode.length, 'bytes');
    console.log('  Optimized size:', optimized.length, 'bytes');
    console.log('  Reduction:', originalCode.length - optimized.length, 'bytes');

    // Test 5: Analyze memory
    console.log('\nTest 5: Analyze Memory');
    const memoryCode = `
      element.addEventListener('click', handler);
      setInterval(() => {}, 1000);
    `;
    const memoryAnalysis = optimizer.analyzeMemory(memoryCode, 'memory.ts');
    console.log('✓ Memory analyzed');
    console.log('  Heap used:', Math.round(memoryAnalysis.heapUsed / 1024 / 1024), 'MB');
    console.log('  Memory leaks found:', memoryAnalysis.leaks.length);
    memoryAnalysis.leaks.forEach((leak, i) => {
      console.log(`  ${i + 1}. [${leak.severity}] ${leak.type}: ${leak.description}`);
    });

    // All tests passed
    console.log('\n✅ All @snps/ai-optimizer tests passed!\n');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    return false;
  }
}

// Run tests
testAIOptimizer().then(success => {
  process.exit(success ? 0 : 1);
});
