# @snps/ai-codegen

AI-powered code generation and suggestions for the Synapse Framework. Zero external dependencies, template-based generation with intelligent pattern recognition.

## Features

- AI-Powered Code Generation
- Template-Based Generation
- Context-Aware Suggestions
- Multiple Programming Patterns
- Code Completion
- Smart Refactoring
- Zero External Dependencies

## Installation

```bash
npm install @snps/ai-codegen
```

## Usage

### Basic Code Generation

```typescript
import { SynapseAICodegen, CodePattern, Language } from '@snps/ai-codegen';

const codegen = new SynapseAICodegen();
await codegen.initialize();

// Generate a React component
const result = codegen.generate({
  pattern: CodePattern.Component,
  language: Language.TSX,
  name: 'UserProfile',
  description: 'User profile component',
});

console.log(result.code);
console.log(`Generated ${result.metadata.linesOfCode} lines of code`);
console.log(`Complexity: ${result.metadata.complexity}`);
```

### Code Suggestions

```typescript
const code = `
function getData() {
  let result = null;
  return Promise.resolve(result);
}
`;

const suggestions = codegen.suggest(code);
suggestions.forEach(suggestion => {
  console.log(`${suggestion.type}: ${suggestion.description}`);
  console.log(`Confidence: ${suggestion.confidence * 100}%`);
});
```

### Code Completion

```typescript
const partial = 'class UserService ';
const completions = codegen.complete(partial);
console.log('Suggested completions:', completions);
```

### Custom Templates

```typescript
codegen.registerTemplate(
  CodePattern.Service,
  Language.TypeScript,
  `export class {{name}} {
    private readonly config: Config;

    constructor(config: Config) {
      this.config = config;
    }
  }`
);
```

## Supported Patterns

- `Component` - React/UI components
- `Service` - Service classes
- `Controller` - Controller classes
- `Model` - Data models
- `Utility` - Utility functions
- `Test` - Test cases
- `Interface` - TypeScript interfaces
- `Class` - TypeScript classes
- `Function` - Functions
- `Hook` - React hooks

## Supported Languages

- TypeScript
- JavaScript
- JSX
- TSX

## API Reference

### SynapseAICodegen

Main class for AI code generation.

#### Methods

- `initialize(): Promise<void>` - Initialize the code generation engine
- `generate(context: CodeGenerationContext): GeneratedCode` - Generate code from context
- `suggest(code: string, context?: Partial<CodeGenerationContext>): CodeSuggestion[]` - Get code suggestions
- `complete(partial: string, context?: Partial<CodeGenerationContext>): string[]` - Get code completions
- `registerTemplate(pattern: CodePattern, language: Language, template: string): void` - Register custom template

### CodeGenerationContext

Configuration for code generation.

```typescript
interface CodeGenerationContext {
  pattern: CodePattern;
  language: Language;
  name: string;
  description?: string;
  imports?: string[];
  exports?: string[];
  props?: Record<string, string>;
  methods?: string[];
  styles?: boolean;
  tests?: boolean;
}
```

### GeneratedCode

Result of code generation.

```typescript
interface GeneratedCode {
  code: string;
  imports: string[];
  exports: string[];
  metadata: {
    pattern: CodePattern;
    language: Language;
    linesOfCode: number;
    complexity: number;
  };
}
```

### CodeSuggestion

Code improvement suggestion.

```typescript
interface CodeSuggestion {
  type: 'completion' | 'refactor' | 'optimization' | 'fix';
  code: string;
  description: string;
  confidence: number;
  location?: {
    line: number;
    column: number;
  };
}
```

## Examples

### Generate TypeScript Service

```typescript
const service = codegen.generate({
  pattern: CodePattern.Service,
  language: Language.TypeScript,
  name: 'DataService',
  description: 'Service for data operations',
});
```

### Generate React Component with Props

```typescript
const component = codegen.generate({
  pattern: CodePattern.Component,
  language: Language.TSX,
  name: 'Button',
  props: {
    label: 'string',
    onClick: '() => void',
    disabled: 'boolean',
  },
});
```

### Generate Test Suite

```typescript
const test = codegen.generate({
  pattern: CodePattern.Test,
  language: Language.TypeScript,
  name: 'UserService',
});
```

## License

MIT
