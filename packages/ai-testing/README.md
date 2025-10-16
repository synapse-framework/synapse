# @snps/ai-testing

AI-generated test cases and scenarios for the Synapse Framework. Automatically generate comprehensive tests with edge case detection and coverage analysis.

## Features

- AI Test Generation from Code
- Edge Case Detection
- Coverage Analysis
- Mutation Testing Suggestions
- Test Suite Generation
- Smart Test Recommendations
- Zero External Dependencies

## Installation

```bash
npm install @snps/ai-testing
```

## Usage

### Generate Tests from Code

```typescript
import { SynapseAITesting } from '@snps/ai-testing';

const aiTesting = new SynapseAITesting();
await aiTesting.initialize();

const code = `
export function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
`;

const tests = aiTesting.generateTests(code, 'calculator.ts');

tests.forEach(test => {
  console.log(`Test: ${test.name}`);
  console.log(`Type: ${test.type}`);
  console.log(`Priority: ${test.priority}`);
  console.log('Code:');
  console.log(test.code);
});
```

### Generate Complete Test Suite

```typescript
const suite = aiTesting.generateTestSuite(code, 'calculator.ts');

console.log(`Suite: ${suite.name}`);
console.log(`Description: ${suite.description}`);
console.log(`Tests: ${suite.tests.length}`);

// Write to file
const testFile = `
${suite.setup || ''}

${suite.tests.map(t => t.code).join('\n\n')}

${suite.teardown || ''}
`;
```

### Detect Edge Cases

```typescript
const edgeCases = aiTesting.detectEdgeCases(code, 'calculateTotal');

edgeCases.forEach(edgeCase => {
  console.log(`Scenario: ${edgeCase.scenario}`);
  console.log(`Priority: ${edgeCase.priority}`);
  console.log(`Description: ${edgeCase.description}`);
  console.log(`Input: ${JSON.stringify(edgeCase.input)}`);
  console.log(`Expected: ${edgeCase.expectedOutput}`);
});
```

### Analyze Coverage

```typescript
const tests = aiTesting.generateTests(code, 'app.ts');
const coverage = aiTesting.analyzeCoverage(code, tests);

console.log(`Coverage: ${coverage.percentage.toFixed(2)}%`);
console.log(`Total lines: ${coverage.totalLines}`);
console.log(`Covered lines: ${coverage.coveredLines}`);
console.log(`Uncovered functions: ${coverage.uncoveredFunctions.join(', ')}`);

// Get suggestions for improving coverage
coverage.suggestions.forEach(suggestion => {
  console.log(`${suggestion.type}: ${suggestion.description}`);
  if (suggestion.generatedTest) {
    console.log('Generated test:', suggestion.generatedTest.code);
  }
});
```

### Mutation Testing

```typescript
const mutations = aiTesting.generateMutations(code);

mutations.forEach(mutation => {
  console.log(`Mutation type: ${mutation.type}`);
  console.log(`Original: ${mutation.original}`);
  console.log(`Mutated: ${mutation.mutated}`);
  console.log(`Description: ${mutation.description}`);
  console.log(`Test needed: ${mutation.testNeeded}`);
});
```

## Test Types

- **Unit** - Unit tests for individual functions
- **Integration** - Integration tests for multiple components
- **E2E** - End-to-end tests
- **Performance** - Performance benchmarks
- **Security** - Security tests
- **Snapshot** - Snapshot tests for UI

## Priority Levels

- **Critical** - Must have tests
- **High** - Should have tests
- **Medium** - Nice to have tests
- **Low** - Optional tests

## API Reference

### SynapseAITesting

Main class for AI-powered test generation.

#### Methods

- `initialize(): Promise<void>` - Initialize the testing engine
- `generateTests(code: string, fileName: string): GeneratedTestCase[]` - Generate test cases
- `generateTestSuite(code: string, fileName: string): TestSuite` - Generate complete test suite
- `detectEdgeCases(code: string, functionName: string): EdgeCase[]` - Detect edge cases
- `analyzeCoverage(code: string, tests: GeneratedTestCase[]): CoverageAnalysis` - Analyze coverage
- `generateMutations(code: string): MutationSuggestion[]` - Generate mutation suggestions

### GeneratedTestCase

Generated test case.

```typescript
interface GeneratedTestCase {
  name: string;
  type: TestType;
  priority: Priority;
  description: string;
  code: string;
  setup?: string;
  teardown?: string;
  assertions: string[];
  tags: string[];
}
```

### TestSuite

Complete test suite.

```typescript
interface TestSuite {
  name: string;
  description: string;
  tests: GeneratedTestCase[];
  setup?: string;
  teardown?: string;
}
```

### EdgeCase

Edge case scenario.

```typescript
interface EdgeCase {
  scenario: string;
  input: unknown;
  expectedOutput: unknown;
  description: string;
  priority: Priority;
}
```

### CoverageAnalysis

Coverage analysis result.

```typescript
interface CoverageAnalysis {
  totalLines: number;
  coveredLines: number;
  percentage: number;
  uncoveredLines: number[];
  uncoveredFunctions: string[];
  suggestions: CoverageSuggestion[];
}
```

### MutationSuggestion

Mutation testing suggestion.

```typescript
interface MutationSuggestion {
  type: 'operator' | 'constant' | 'condition' | 'statement';
  original: string;
  mutated: string;
  location: {
    file: string;
    line: number;
  };
  description: string;
  testNeeded: boolean;
}
```

## Examples

### Generate Tests for Class

```typescript
const classCode = `
export class UserService {
  async getUser(id: string): Promise<User> {
    if (!id) {
      throw new Error('ID required');
    }
    return await fetchUser(id);
  }
}
`;

const tests = aiTesting.generateTests(classCode, 'UserService.ts');
// Generates:
// - Basic test for getUser
// - Test with null/undefined ID
// - Error handling test
```

### Generate Tests for React Component

```typescript
const componentCode = `
export const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
};
`;

const tests = aiTesting.generateTests(componentCode, 'Button.tsx');
// Generates:
// - Render test
// - Click handler test
// - Props test
```

### Improve Coverage

```typescript
const code = `
export function processData(data: Data[]): Result {
  if (!data || data.length === 0) {
    return { status: 'empty' };
  }

  const processed = data.map(item => transform(item));
  return { status: 'success', data: processed };
}
`;

const tests = aiTesting.generateTests(code, 'processor.ts');
const coverage = aiTesting.analyzeCoverage(code, tests);

if (coverage.percentage < 100) {
  console.log('Missing coverage for:');
  coverage.suggestions.forEach(suggestion => {
    console.log(`- ${suggestion.description}`);
  });
}
```

## Integration Examples

### Jest Integration

```typescript
import { SynapseAITesting } from '@snps/ai-testing';
import fs from 'fs';

const aiTesting = new SynapseAITesting();

// Generate tests for file
const sourceCode = fs.readFileSync('src/app.ts', 'utf-8');
const suite = aiTesting.generateTestSuite(sourceCode, 'app.ts');

// Write test file
const testContent = `
import { describe, it, expect } from '@jest/globals';
import { ${suite.name} } from '../src/app';

${suite.tests.map(t => t.code).join('\n\n')}
`;

fs.writeFileSync('tests/app.test.ts', testContent);
```

### CI/CD Integration

```typescript
import { SynapseAITesting } from '@snps/ai-testing';

// In CI pipeline
const aiTesting = new SynapseAITesting();
const code = getSourceCode();
const tests = getExistingTests();

const coverage = aiTesting.analyzeCoverage(code, tests);

if (coverage.percentage < 80) {
  console.error(`Coverage too low: ${coverage.percentage}%`);
  process.exit(1);
}

// Generate missing tests
const missingTests = coverage.suggestions
  .filter(s => s.generatedTest)
  .map(s => s.generatedTest);

if (missingTests.length > 0) {
  console.log('Generated missing tests:');
  missingTests.forEach(test => console.log(test.name));
}
```

### Watch Mode

```typescript
import { watch } from 'fs';
import { SynapseAITesting } from '@snps/ai-testing';

const aiTesting = new SynapseAITesting();

watch('src/', { recursive: true }, (event, filename) => {
  if (filename?.endsWith('.ts')) {
    const code = fs.readFileSync(`src/${filename}`, 'utf-8');
    const tests = aiTesting.generateTests(code, filename);

    console.log(`Generated ${tests.length} tests for ${filename}`);
  }
});
```

## Best Practices

1. **Review generated tests** - AI-generated tests are a starting point
2. **Add custom assertions** - Enhance with specific business logic checks
3. **Run regularly** - Generate tests during development
4. **Track coverage** - Monitor coverage trends over time
5. **Use mutation testing** - Verify test quality

## Advanced Features

### Custom Test Templates

```typescript
// Extend the test generator with custom patterns
const customTests = aiTesting.generateTests(code, 'custom.ts');

// Customize test format
const customSuite = {
  ...aiTesting.generateTestSuite(code, 'custom.ts'),
  tests: customTests.map(test => ({
    ...test,
    code: formatTestCode(test.code),
  })),
};
```

### Coverage Tracking

```typescript
// Track coverage over time
const history: CoverageAnalysis[] = [];

setInterval(() => {
  const current = aiTesting.analyzeCoverage(code, tests);
  history.push(current);

  const trend = current.percentage - history[0].percentage;
  console.log(`Coverage trend: ${trend > 0 ? '+' : ''}${trend.toFixed(2)}%`);
}, 3600000); // Hourly
```

## License

MIT
