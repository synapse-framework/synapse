# @snps/core

Core Synapse Framework components including Runtime, Compiler, Testing, Linting, Router, State Management, and Plugin System.

## Installation

```bash
npm install @snps/core
```

## Usage

```typescript
import { 
  SynapseRuntime,
  SynapseCompiler,
  SynapseTestingFramework,
  SynapseLintingSystem,
  SynapseRouter,
  SynapseStateManager,
  SynapsePluginSystem
} from '@snps/core';

// Initialize components
const runtime = new SynapseRuntime();
const compiler = new SynapseCompiler();
const testing = new SynapseTestingFramework();
const linting = new SynapseLintingSystem();
const router = new SynapseRouter();
const state = new SynapseStateManager();
const plugins = new SynapsePluginSystem();

// Use components
await runtime.start();
await compiler.compile();
await testing.runTests();
await linting.lint();
await router.route();
await state.manageState();
await plugins.loadPlugins();
```

## Features

- **Runtime Engine**: Multi-threaded execution environment
- **Compiler**: High-performance TypeScript compilation
- **Testing Framework**: TDD enforcement with 100% coverage
- **Linting System**: 92 strict rules for code quality
- **Router**: Universal routing system
- **State Management**: Reactive state management
- **Plugin System**: Extensible architecture

## License

MIT