# @snps/ai-debug

AI-assisted debugging and error resolution for the Synapse Framework. Analyze errors, get fix suggestions, and gain debugging insights.

## Features

- Error Analysis and Categorization
- Stack Trace Analysis
- Automatic Fix Suggestions
- Debugging Insights
- Root Cause Detection
- Smart Recommendations
- Zero External Dependencies

## Installation

```bash
npm install @snps/ai-debug
```

## Usage

### Basic Error Analysis

```typescript
import { SynapseAIDebug } from '@snps/ai-debug';

const debug = new SynapseAIDebug();
await debug.initialize();

try {
  // Your code that might throw
  const result = data.map(item => item.value);
} catch (error) {
  const analysis = debug.analyzeError(error as Error);

  console.log(`Category: ${analysis.category}`);
  console.log(`Severity: ${analysis.severity}`);
  console.log(`Root Cause: ${analysis.rootCause}`);
  console.log(`Explanation: ${analysis.explanation}`);
  console.log(`Impact: ${analysis.impact}`);

  // Get fix suggestions
  analysis.suggestions.forEach(suggestion => {
    console.log(`\n${suggestion.title} (${suggestion.confidence * 100}% confidence)`);
    console.log(suggestion.description);
    suggestion.steps.forEach((step, i) => {
      console.log(`  ${i + 1}. ${step}`);
    });
    if (suggestion.code) {
      console.log(`\nBefore:\n${suggestion.code.before}`);
      console.log(`\nAfter:\n${suggestion.code.after}`);
    }
  });
}
```

### Quick Diagnosis

```typescript
try {
  // Code that throws
} catch (error) {
  const diagnosis = debug.diagnose(error as Error);
  console.log(diagnosis);
}
```

### Stack Trace Analysis

```typescript
const analysis = debug.analyzeError(error);
const insights = debug.analyzeStackTrace(analysis.stackTrace);

insights.forEach(insight => {
  console.log(`[${insight.type}] ${insight.title}`);
  console.log(insight.description);
  if (insight.examples) {
    insight.examples.forEach(example => {
      console.log(`  - ${example}`);
    });
  }
});
```

### Code Insights

```typescript
const code = `
async function fetchData() {
  const response = await fetch(url);
  return response.json();
}
`;

const insights = debug.generateInsights(code, 'api.ts');
insights.forEach(insight => {
  console.log(`[${insight.type}] ${insight.title}`);
  console.log(insight.description);
});
```

### Error Context

```typescript
const analysis = debug.analyzeError(error);
const firstFrame = analysis.stackTrace[0];

if (firstFrame) {
  const codeLines = sourceCode.split('\n');
  const context = debug.getErrorContext(firstFrame, codeLines);
  console.log('Error context:\n', context);
}
```

## Error Categories

- **Syntax** - Syntax errors in code
- **Type** - Type-related errors
- **Runtime** - Runtime execution errors
- **Logic** - Logic errors (incorrect results)
- **Performance** - Performance issues
- **Security** - Security vulnerabilities
- **Memory** - Memory leaks and issues
- **Network** - Network-related errors

## Severity Levels

- **Critical** - Application cannot function
- **High** - Core functionality affected
- **Medium** - Some features not working
- **Low** - Minor issues
- **Info** - Informational only

## API Reference

### SynapseAIDebug

Main class for AI-assisted debugging.

#### Methods

- `initialize(): Promise<void>` - Initialize the debugger
- `analyzeError(error: Error): ErrorAnalysis` - Analyze error and get detailed information
- `analyzeStackTrace(stackTrace: StackFrame[]): DebuggingInsight[]` - Analyze stack trace patterns
- `generateInsights(code: string, filePath: string): DebuggingInsight[]` - Generate debugging insights
- `getErrorContext(frame: StackFrame, codeLines: string[]): string` - Get code context around error
- `diagnose(error: Error): string` - Quick error diagnosis

### ErrorAnalysis

Detailed error analysis result.

```typescript
interface ErrorAnalysis {
  error: Error;
  category: ErrorCategory;
  severity: ErrorSeverity;
  rootCause: string;
  explanation: string;
  impact: string;
  stackTrace: StackFrame[];
  suggestions: FixSuggestion[];
  relatedErrors: string[];
}
```

### FixSuggestion

Suggested fix for error.

```typescript
interface FixSuggestion {
  type: 'code' | 'configuration' | 'dependency' | 'architecture';
  title: string;
  description: string;
  confidence: number; // 0-1
  code?: {
    before: string;
    after: string;
  };
  steps: string[];
}
```

### DebuggingInsight

Debugging insight or tip.

```typescript
interface DebuggingInsight {
  type: 'warning' | 'tip' | 'pattern' | 'antipattern';
  title: string;
  description: string;
  location?: {
    file: string;
    line: number;
  };
  examples?: string[];
}
```

### StackFrame

Stack trace frame information.

```typescript
interface StackFrame {
  file: string;
  line: number;
  column: number;
  functionName: string;
  code?: string;
}
```

## Examples

### Handling Undefined Errors

```typescript
// Code that throws
const getValue = () => obj.nested.property;

// Analysis
try {
  getValue();
} catch (error) {
  const analysis = debug.analyzeError(error as Error);
  // Suggests: Use optional chaining (obj?.nested?.property)
}
```

### Detecting Recursion Issues

```typescript
// Problematic code
function factorial(n) {
  return n * factorial(n - 1); // Missing base case
}

try {
  factorial(5);
} catch (error) {
  const analysis = debug.analyzeError(error as Error);
  // Detects: Maximum call stack exceeded
  // Suggests: Add base case for recursion
}
```

### Finding Memory Leaks

```typescript
const code = `
element.addEventListener('click', handler);
// Missing removeEventListener
`;

const insights = debug.generateInsights(code, 'app.ts');
// Warns about missing cleanup
```

## Integration Examples

### Express Error Handler

```typescript
import { SynapseAIDebug } from '@snps/ai-debug';

const debugger = new SynapseAIDebug();

app.use((err, req, res, next) => {
  const analysis = debugger.analyzeError(err);

  console.error('Error Analysis:', {
    category: analysis.category,
    severity: analysis.severity,
    rootCause: analysis.rootCause,
  });

  res.status(500).json({
    error: 'Internal Server Error',
    suggestions: analysis.suggestions.map(s => s.title),
  });
});
```

### React Error Boundary

```typescript
import React from 'react';
import { SynapseAIDebug } from '@snps/ai-debug';

class ErrorBoundary extends React.Component {
  debugger = new SynapseAIDebug();

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const analysis = this.debugger.analyzeError(error);

    console.error('Component Error:', {
      component: errorInfo.componentStack,
      analysis: analysis,
    });
  }
}
```

### Test Framework Integration

```typescript
import { SynapseAIDebug } from '@snps/ai-debug';

const debugger = new SynapseAIDebug();

afterEach(() => {
  if (testFailed) {
    const analysis = debugger.analyzeError(testError);
    console.log('Test Failure Analysis:', analysis.suggestions);
  }
});
```

## Best Practices

1. **Always log errors** - Use the analyzer to get detailed insights
2. **Act on suggestions** - Follow the recommended fixes
3. **Monitor patterns** - Track common errors across your codebase
4. **Automate** - Integrate into CI/CD for continuous analysis
5. **Learn** - Use insights to improve code quality

## Advanced Usage

### Custom Error Handling

```typescript
class CustomErrorHandler {
  private debugger = new SynapseAIDebug();

  async handle(error: Error) {
    const analysis = await this.debugger.analyzeError(error);

    // Send to monitoring service
    await this.sendToMonitoring(analysis);

    // Log for debugging
    this.logError(analysis);

    // Notify team if critical
    if (analysis.severity === 'critical') {
      await this.notifyTeam(analysis);
    }

    return analysis.suggestions[0]; // Return top suggestion
  }
}
```

## License

MIT
