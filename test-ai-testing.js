/**
 * Test suite for @snps/ai-testing
 */

console.log('\n=== Testing @snps/ai-testing ===\n');

async function testAITesting() {
  try {
    // Import the module
    const { SynapseAITesting, TestType, Priority } = await import('./packages/ai-testing/dist/index.js');

    console.log('✓ Module imported successfully');

    // Create instance
    const aiTesting = new SynapseAITesting();
    console.log('✓ Instance created');

    // Initialize
    await aiTesting.initialize();
    console.log('✓ Initialized successfully');

    // Get info
    const info = aiTesting.getInfo();
    console.log('✓ Info retrieved:', info.name, info.version);
    console.log('  Features:', info.features.length);

    // Test 1: Generate tests from simple function
    console.log('\nTest 1: Generate Tests from Simple Function');
    const simpleCode = `
      export function calculateSum(a: number, b: number): number {
        return a + b;
      }
    `;

    const tests1 = aiTesting.generateTests(simpleCode, 'calculator.ts');
    console.log('✓ Generated', tests1.length, 'tests');
    tests1.forEach((test, i) => {
      console.log(`  ${i + 1}. ${test.name} (${test.type}, ${test.priority})`);
      console.log(`     Tags: ${test.tags.join(', ')}`);
    });

    // Test 2: Generate tests from async function
    console.log('\nTest 2: Generate Tests from Async Function');
    const asyncCode = `
      export async function fetchUser(id: string): Promise<User> {
        if (!id) {
          throw new Error('ID required');
        }
        return await api.getUser(id);
      }
    `;

    const tests2 = aiTesting.generateTests(asyncCode, 'user-service.ts');
    console.log('✓ Generated', tests2.length, 'tests');
    console.log('  Includes error handling tests:', tests2.some(t => t.tags.includes('error-handling')));
    console.log('  Includes edge case tests:', tests2.some(t => t.tags.includes('edge-case')));

    // Test 3: Generate complete test suite
    console.log('\nTest 3: Generate Complete Test Suite');
    const classCode = `
      export class DataProcessor {
        constructor() {}

        public process(data: any[]): Result {
          return { status: 'success' };
        }

        public async processAsync(data: any[]): Promise<Result> {
          return { status: 'success' };
        }
      }
    `;

    const suite = aiTesting.generateTestSuite(classCode, 'DataProcessor.ts');
    console.log('✓ Test suite generated');
    console.log('  Suite name:', suite.name);
    console.log('  Description:', suite.description);
    console.log('  Total tests:', suite.tests.length);
    console.log('  Has setup:', !!suite.setup);
    console.log('  Has teardown:', !!suite.teardown);

    // Test 4: Detect edge cases
    console.log('\nTest 4: Detect Edge Cases');
    const edgeCaseCode = `
      function processArray(items: string[]): string {
        return items.map(x => x.toUpperCase()).join(',');
      }
    `;

    const edgeCases = aiTesting.detectEdgeCases(edgeCaseCode, 'processArray');
    console.log('✓ Detected', edgeCases.length, 'edge cases');
    edgeCases.forEach((edgeCase, i) => {
      console.log(`  ${i + 1}. ${edgeCase.scenario} (${edgeCase.priority})`);
      console.log(`     ${edgeCase.description}`);
    });

    // Test 5: Analyze coverage
    console.log('\nTest 5: Analyze Coverage');
    const coverageCode = `
      function add(a, b) { return a + b; }
      function subtract(a, b) { return a - b; }
      function multiply(a, b) { return a * b; }
      function divide(a, b) { return a / b; }
    `;

    const tests5 = aiTesting.generateTests(coverageCode, 'math.ts');
    const coverage = aiTesting.analyzeCoverage(coverageCode, tests5);
    console.log('✓ Coverage analyzed');
    console.log('  Total lines:', coverage.totalLines);
    console.log('  Covered lines:', coverage.coveredLines);
    console.log('  Coverage percentage:', coverage.percentage.toFixed(2) + '%');
    console.log('  Uncovered functions:', coverage.uncoveredFunctions.length);
    console.log('  Suggestions:', coverage.suggestions.length);

    // Test 6: Generate mutation testing suggestions
    console.log('\nTest 6: Generate Mutation Testing Suggestions');
    const mutationCode = `
      function isValid(value) {
        if (value === null) {
          return false;
        }
        return value + 10 > 20;
      }
    `;

    const mutations = aiTesting.generateMutations(mutationCode);
    console.log('✓ Generated', mutations.length, 'mutation suggestions');
    mutations.forEach((mutation, i) => {
      console.log(`  ${i + 1}. ${mutation.type}: ${mutation.original} → ${mutation.mutated}`);
      console.log(`     ${mutation.description}`);
      console.log(`     Test needed: ${mutation.testNeeded}`);
    });

    // All tests passed
    console.log('\n✅ All @snps/ai-testing tests passed!\n');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    return false;
  }
}

// Run tests
testAITesting().then(success => {
  process.exit(success ? 0 : 1);
});
