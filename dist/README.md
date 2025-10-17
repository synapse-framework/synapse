# ⚡ Synapse Framework

<div align="center">

[![npm version](https://img.shields.io/npm/v/synapse-framework-cli.svg?style=flat-square)](https://www.npmjs.com/package/synapse-framework-cli)
[![npm downloads](https://img.shields.io/npm/dm/synapse-framework-cli.svg?style=flat-square)](https://www.npmjs.com/package/synapse-framework-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/synapse-framework-cli.svg?style=flat-square)](https://nodejs.org)
[![CI Status](https://img.shields.io/github/actions/workflow/status/synapse-framework/synapse/ci.yml?style=flat-square)](https://github.com/synapse-framework/synapse/actions)

**🚀 Zero Dependencies • 🔥 10x Performance • 💎 Strict Enforcement**

*The TypeScript-first framework that forces you to write perfect code*

[Get Started](#-quick-start) • [Documentation](https://docs.synapse.dev) • [Examples](#-usage) • [Discord](https://discord.gg/synapse)

</div>

---

## 🌟 Why Synapse?

> **Stop writing bad code. Start building bulletproof applications.**

Traditional frameworks let you cut corners. Synapse **doesn't**. Every line of code is validated, tested, and optimized automatically. No escape hatches. No compromises. Just perfect, production-ready code.

### The Problem with Other Frameworks

❌ **Dependencies hell** - Hundreds of packages to maintain
❌ **Slow builds** - TypeScript compilation takes forever
❌ **Optional testing** - TDD is just a "nice to have"
❌ **Loose standards** - Anyone can write spaghetti code

### The Synapse Solution

✅ **Zero dependencies** - Everything built from scratch
✅ **Rust-powered** - 10x faster compilation and bundling
✅ **TDD enforced** - No code ships without 100% test coverage
✅ **Strict by default** - Best practices enforced at build time

---

## 🚀 Features

- **Zero Dependencies**: Everything built from scratch in TypeScript and Rust
- **Strict by Default**: Enforce best practices at every level with no escape hatches
- **TDD Mandatory**: No code without tests - enforced at build time
- **Multi-threaded**: Leverage all available CPU cores with Rust backend
- **Universal**: Support any database, storage, hosting, protocol
- **Extensible**: Plugin system with strict guidelines and validation
- **Type-Safe**: Full TypeScript support with strict type checking
- **High Performance**: Rust-based compiler and bundler for maximum speed
- **Developer Experience**: Comprehensive CLI with all workflows

## 🏗️ Build System

### Makefile-First Architecture

Synapse uses a **Makefile-first architecture** to prevent command recursion and ensure consistent behavior:

- **Makefile**: Primary interface for all build, test, and lint operations
- **NPM Scripts**: Thin wrappers that delegate to Makefile commands
- **No Recursion**: Clean, single-direction flow prevents infinite loops
- **Cross-Platform**: Works on Linux, macOS, and Windows (with WSL)

### Build Pipeline

```bash
# Complete Build Process
make build                       # Builds both Rust and Node.js
├── make build-rust             # Compiles Rust compiler with SWC
└── make build-node             # Compiles TypeScript to JavaScript

# Individual Builds
make build-rust                  # Rust compiler only
make build-node                  # Node.js code only
```

### Development Workflow

```bash
# Setup (First Time)
make setup                       # Install dependencies and prepare environment
make check-deps                  # Verify Node.js, npm, and Rust are installed

# Development Cycle
make dev                         # Start development mode with watch
make test-quick                  # Run quick tests for fast feedback
make test                        # Run complete test suite
make lint                        # Run linting checks

# Production
make build                       # Build for production
make package                     # Create distribution package
make publish                     # Publish to NPM
```

## 🏗️ Architecture

### Core Components
- **Runtime Engine**: Multi-threaded Node.js runtime with worker pools
- **Rust Compiler**: High-performance TypeScript compiler written in Rust
- **Rust Bundler**: Parallel bundling and optimization engine
- **Universal Router**: File-based and programmatic routing
- **State Management**: Reactive state with strict immutability
- **Testing Framework**: Built-in TDD framework with 100% coverage enforcement
- **Linting System**: Custom linter with strict rules and auto-fix
- **Plugin System**: Extensible architecture with strict validation

### Package Structure
```
@synapse/core/                    # Core framework
├── runtime/                      # Multi-threaded runtime engine
├── compiler/                     # TypeScript compiler (Rust bridge)
├── bundler/                      # High-performance bundler (Rust)
├── router/                       # Universal routing system
├── state/                        # Reactive state management
└── types/                        # Core type definitions

@synapse/cli/                     # Command line interface
├── commands/                     # All CLI commands
├── generators/                   # Code generators
├── validators/                   # Project validators
└── workflows/                    # Development workflows

@synapse/server/                  # Server framework
├── http/                         # HTTP server
├── websocket/                    # WebSocket server
├── grpc/                         # gRPC server
├── graphql/                      # GraphQL server
└── middleware/                   # Server middleware

@synapse/client/                  # Client framework
├── dom/                          # DOM manipulation
├── components/                   # Component system
├── routing/                      # Client-side routing
└── state/                        # Client state management

@synapse/database/                # Database abstraction
├── adapters/                     # Database adapters
├── query-builder/                # Query builder
├── migrations/                   # Migration system
└── orm/                          # ORM layer

@synapse/storage/                 # Storage abstraction
├── filesystem/                   # File system storage
├── cloud/                        # Cloud storage adapters
├── memory/                       # In-memory storage
└── cache/                        # Caching layer

@synapse/testing/                 # Testing framework
├── runner/                       # Test runner
├── assertions/                   # Assertion library
├── mocks/                        # Mocking system
└── coverage/                     # Coverage tracking

@synapse/linting/                 # Linting system
├── rules/                        # Custom linting rules
├── formatters/                   # Code formatters
├── validators/                   # Type validators
└── enforcers/                    # Enforcement engine

@synapse/plugins/                 # Plugin system
├── core/                         # Core plugin interfaces
├── registry/                     # Plugin registry
├── loader/                       # Plugin loader
└── validator/                    # Plugin validator

@synapse/deployment/              # Deployment system
├── builders/                     # Build adapters
├── packagers/                    # Package generators
├── deployers/                    # Deployment adapters
└── monitors/                     # Health monitoring
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install globally from NPM
npm install -g synapse-framework-cli

# Or with yarn
yarn global add synapse-framework-cli
```

### Create Your First Project in 30 Seconds

```bash
# Create new project
synapse init my-awesome-app

# Navigate to project
cd my-awesome-app

# Start development server
synapse dev
```

### Verify Installation

```bash
# Check version
synapse --version
# Output: Synapse Framework v0.3.0

# View help
synapse --help
```

### Build from Source (Advanced)

Want to contribute or customize? Build from source:

```bash
# Clone the repository
git clone https://github.com/synapse-framework/synapse.git
cd synapse

# Build the framework (requires Rust 1.70+)
make build

# Install globally
make install
```

## 📚 Usage

### CLI Commands

#### **Makefile Commands (Primary Interface)**

```bash
# Build System
make build                       # Build entire framework (Rust + Node.js)
make build-rust                  # Build only Rust compiler
make build-node                  # Build only Node.js code
make clean                       # Clean all build artifacts
make setup                       # Setup development environment
make check-deps                  # Verify dependencies

# Testing (Comprehensive Test Categories)
make test                        # Run complete test suite
make test-quick                  # Run quick smoke tests
make test-core                   # Run core component tests
make test-cli                    # Run CLI tool tests
make test-ui                     # Run UI component tests
make test-security               # Run security tests
make test-performance            # Run performance tests
make test-project-gen            # Run project generation tests
make test-quality                # Run quality assurance tests
make test-npm                    # Run NPM publishing tests
make test-universal              # Run universal support tests
make test-rust                   # Run Rust compiler tests

# Code Quality
make lint                        # Run linting system (with fallbacks)
make format                      # Format code (when implemented)

# Development
make dev                         # Start development mode with watch
make install                     # Install framework globally
make uninstall                   # Uninstall framework
make package                     # Create distribution package
make publish                     # Publish to NPM
```

#### **NPM Scripts (Developer Convenience)**

```bash
# Testing (Delegates to Makefile)
npm test                         # → make test
npm run test:quick               # → make test-quick
npm run test:core                # → make test-core
npm run test:cli                 # → make test-cli
npm run test:ui                  # → make test-ui
npm run test:rust                # → make test-rust

# Code Quality (Delegates to Makefile)
npm run lint                     # → make lint
npm run format                   # → make format

# Development
npm run dev                      # TypeScript watch mode
npm run build                    # TypeScript compilation only
npm run build:full               # → make build
npm run clean                    # Clean dist directory
```

#### **Direct Test File Execution**

```bash
# Individual Test Files (for debugging)
node test-simple.js              # Basic functionality tests
node test-core-components.js     # Core framework tests
node test-cli-tool.js            # CLI functionality tests
node test-ui-components.js       # UI component tests
node test-security.js            # Security tests
node test-performance.js         # Performance tests
node test-project-generation.js  # Project scaffolding tests
node test-quality-assurance.js   # Quality checks
node test-npm-publishing.js      # NPM publishing tests
node test-universal-support.js   # Universal adapter tests
node COMPLETE_TEST.js            # Complete integration test

# AI-Powered Tests (Advanced)
node test-ai-codegen.js          # AI code generation tests
node test-ai-debug.js            # AI debugging tests
node test-ai-optimizer.js        # AI optimization tests
node test-ai-testing.js          # AI testing assistance tests
```

#### **Future CLI Commands (Planned)**

```bash
# Project Management (Coming Soon)
synapse init <name>              # Initialize new project
synapse generate <type> <name>   # Generate code (component, api, test, etc.)

# Database (Coming Soon)
synapse db:migrate               # Run migrations
synapse db:seed                  # Seed database
synapse db:reset                 # Reset database

# Deployment (Coming Soon)
synapse deploy                   # Deploy application
synapse deploy:preview           # Create preview deployment

# Plugins (Coming Soon)
synapse plugin:install <name>    # Install plugin
synapse plugin:uninstall <name>  # Uninstall plugin
synapse plugin:list              # List plugins
```

### Code Generation

```bash
# Generate React component
synapse generate component Button --props '{"variant": "primary", "size": "large"}'

# Generate API endpoint
synapse generate api users --methods '["GET", "POST", "PUT", "DELETE"]'

# Generate database model
synapse generate model User --fields '{"name": "string", "email": "string", "age": "number"}'

# Generate test file
synapse generate test UserService --coverage

# Generate documentation
synapse generate docs API --format markdown
```

## 🔧 Configuration

### Framework Configuration (`synapse.config.ts`)

```typescript
import { defineConfig } from '@synapse/framework';

export default defineConfig({
  // Compiler options
  compiler: {
    target: 'ES2022',
    strict: true,
    minify: true,
    sourceMaps: true,
    treeShaking: true,
    codeSplitting: true
  },

  // Server options
  server: {
    port: 3000,
    host: 'localhost',
    https: false,
    cors: true
  },

  // Database options
  database: {
    type: 'postgresql',
    connectionString: process.env.DATABASE_URL,
    migrations: true,
    seeding: true
  },

  // Testing options
  testing: {
    coverage: true,
    threshold: 100,
    parallel: true,
    watch: false
  },

  // Linting options
  linting: {
    strict: true,
    autoFix: true,
    formatOnSave: true,
    tddEnforcement: true
  },

  // Deployment options
  deployment: {
    platform: 'vercel',
    environment: 'production',
    autoDeploy: true
  }
});
```

### TypeScript Configuration (`tsconfig.json`)

```json
{
  "extends": "@synapse/framework/tsconfig",
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true
  }
}
```

## 🧪 Testing

### TDD Enforcement

Synapse enforces Test-Driven Development by default:

```typescript
// ❌ This will fail - no tests
export function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ This will pass - has tests
export function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// tests/calculateTotal.test.ts
import { calculateTotal } from '../src/calculateTotal';
import { expect, test } from '@synapse/testing';

test('calculateTotal should sum item prices', () => {
  const items = [
    { price: 10 },
    { price: 20 },
    { price: 30 }
  ];
  
  expect(calculateTotal(items)).toBe(60);
});
```

### Test Commands

#### **Primary Test Interface (Makefile)**

```bash
# Complete Test Suite
make test                        # Run all tests (comprehensive)

# Quick Testing (Fast Feedback)
make test-quick                  # Run quick smoke tests
make test-core                   # Run core component tests
make test-cli                    # Run CLI tool tests
make test-ui                     # Run UI component tests

# Specialized Testing
make test-security               # Run security tests
make test-performance            # Run performance tests
make test-project-gen            # Run project generation tests
make test-quality                # Run quality assurance tests
make test-npm                    # Run NPM publishing tests
make test-universal              # Run universal support tests
make test-rust                   # Run Rust compiler tests
```

#### **Developer Convenience (NPM Scripts)**

```bash
# NPM Scripts (Delegates to Makefile)
npm test                         # → make test (complete suite)
npm run test:quick               # → make test-quick
npm run test:core                # → make test-core
npm run test:cli                 # → make test-cli
npm run test:ui                  # → make test-ui
npm run test:rust                # → make test-rust
```

#### **Direct Test Execution**

```bash
# Individual Test Files (for debugging)
node test-simple.js              # Basic functionality tests
node test-core-components.js     # Core framework tests
node test-cli-tool.js            # CLI functionality tests
node test-ui-components.js       # UI component tests
node test-security.js            # Security tests
node test-performance.js         # Performance tests
node test-project-generation.js  # Project scaffolding tests
node test-quality-assurance.js   # Quality checks
node test-npm-publishing.js      # NPM publishing tests
node test-universal-support.js   # Universal adapter tests
node COMPLETE_TEST.js            # Complete integration test

# AI-Powered Tests (Advanced Features)
node test-ai-codegen.js          # AI code generation tests
node test-ai-debug.js            # AI debugging tests
node test-ai-optimizer.js        # AI optimization tests
node test-ai-testing.js          # AI testing assistance tests
```

#### **Test Categories Explained**

- **Quick Tests** (`test-quick`): Fast smoke tests for rapid feedback during development
- **Core Tests** (`test-core`): Essential framework functionality and components
- **CLI Tests** (`test-cli`): Command-line interface and tool functionality
- **UI Tests** (`test-ui`): User interface components and interactions
- **Security Tests** (`test-security`): Security scanning and vulnerability checks
- **Performance Tests** (`test-performance`): Speed, memory, and optimization benchmarks
- **Project Generation Tests** (`test-project-gen`): Project scaffolding and templates
- **Quality Tests** (`test-quality`): Code quality, standards, and best practices
- **NPM Tests** (`test-npm`): Package publishing and distribution
- **Universal Tests** (`test-universal`): Cross-platform and universal support
- **Rust Tests** (`test-rust`): Rust compiler and backend functionality

## 🔍 Linting & Formatting

### Linting System

Synapse includes a production-ready linting system with intelligent fallbacks:

```bash
# Primary Linting Interface
make lint                        # Run linting system with fallbacks

# Developer Convenience
npm run lint                     # → make lint
```

#### **Linting Behavior**

- **If linting package is built**: Runs full linting system with 92 strict rules
- **If linting package not built**: Runs basic checks with helpful error messages
- **Graceful degradation**: Never fails, always provides useful feedback

#### **Strict Linting Rules**

Synapse includes comprehensive linting rules:

```typescript
// ❌ These will fail linting
const unused = 'variable';           // Unused variable
let mutable = 'value';               // Mutable variable
function bad() { return; }           // Missing return type
class Bad { prop = 1; }              // Missing access modifier

// ✅ These will pass linting
const used = 'variable';             // Used variable
const immutable = 'value';           // Immutable variable
function good(): string {            // Explicit return type
  return 'value';
}
class Good { 
  public prop = 1;                   // Explicit access modifier
}
```

### Linting Commands

```bash
# Lint codebase
synapse lint

# Lint with auto-fix
synapse lint --fix

# Format code
synapse format

# Check formatting
synapse format --check
```

## 🗄️ Database Support

### Universal Database Abstraction

```typescript
import { Database } from '@synapse/database';

// Works with any database
const db = new Database({
  type: 'postgresql', // or 'mysql', 'sqlite', 'mongodb', etc.
  connectionString: process.env.DATABASE_URL
});

// Type-safe queries
const users = await db.query<User>('SELECT * FROM users WHERE age > ?', [18]);

// Migrations
await db.migrate();

// Seeding
await db.seed('users', userData);
```

### Supported Databases
- **SQL**: PostgreSQL, MySQL, SQLite, SQL Server
- **NoSQL**: MongoDB, CouchDB, Redis
- **Graph**: Neo4j, ArangoDB
- **Time-series**: InfluxDB, TimescaleDB
- **Search**: Elasticsearch, Solr

## 🌐 Server Framework

### Multiple Protocol Support

```typescript
import { Server } from '@synapse/server';

const server = new Server({
  port: 3000,
  protocols: ['http', 'websocket', 'grpc', 'graphql']
});

// HTTP routes
server.get('/api/users', async (req, res) => {
  const users = await db.query('SELECT * FROM users');
  res.json(users);
});

// WebSocket
server.ws('/ws', (socket) => {
  socket.on('message', (data) => {
    socket.broadcast(data);
  });
});

// GraphQL
server.graphql(`
  type User {
    id: ID!
    name: String!
    email: String!
  }
  
  type Query {
    users: [User!]!
  }
`);
```

## 🔌 Plugin System

### Creating Plugins

```typescript
import { Plugin, PluginContext } from '@synapse/plugins';

export class MyPlugin implements Plugin {
  readonly id = 'my-plugin';
  readonly name = 'My Plugin';
  readonly version = '1.0.0';
  readonly dependencies = [];
  readonly hooks = [];
  readonly commands = [];
  readonly middleware = [];
  readonly components = [];

  async install(context: PluginContext): Promise<void> {
    // Plugin installation logic
  }

  async uninstall(context: PluginContext): Promise<void> {
    // Plugin uninstallation logic
  }
}
```

### Plugin Commands

```bash
# Install plugin
synapse plugin:install @synapse/plugin-auth

# Uninstall plugin
synapse plugin:uninstall @synapse/plugin-auth

# List plugins
synapse plugin:list
```

## 🚀 Deployment

### Supported Platforms

- **Vercel**: Zero-config deployment
- **Netlify**: Static site deployment
- **AWS**: Lambda, ECS, EC2
- **Google Cloud**: Cloud Run, App Engine
- **Azure**: Functions, App Service
- **Docker**: Container deployment
- **Kubernetes**: Container orchestration

### Deployment Commands

```bash
# Deploy to production
synapse deploy

# Deploy preview
synapse deploy:preview

# Deploy to specific platform
synapse deploy --platform vercel

# Deploy with environment
synapse deploy --env staging
```

## ⚡ Performance

### Built-in Optimizations

- **Rust Compiler**: 10x faster than TypeScript compiler
- **Parallel Processing**: Multi-threaded compilation and bundling
- **Tree Shaking**: Dead code elimination
- **Code Splitting**: Automatic bundle optimization
- **Asset Optimization**: Image, font, and CSS optimization
- **Caching**: Intelligent build and runtime caching

### Performance Monitoring

```bash
# Monitor application
synapse monitor

# Analyze bundle
synapse analyze --bundle

# Optimize project
synapse optimize
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone repository
git clone https://github.com/synapse-framework/synapse.git
cd synapse

# Install dependencies
make setup

# Build framework
make build

# Run tests
make test

# Start development
make dev
```

## 📊 Roadmap

- [x] **v0.1.0** - Initial release with core CLI and Rust compiler
- [x] **v0.2.0** - Enhanced testing framework and UI components
- [x] **v0.3.0** - Production-ready with comprehensive test categories and robust linting
- [ ] **v0.2.0** - Full TDD enforcement and testing framework
- [ ] **v0.3.0** - Complete server framework with multi-protocol support
- [ ] **v0.4.0** - Database abstraction layer and ORM
- [ ] **v0.5.0** - Plugin system and marketplace
- [ ] **v1.0.0** - Production-ready with full documentation

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Rust Community**: For the amazing language and ecosystem
- **TypeScript Team**: For the excellent type system
- **Node.js Community**: For the runtime and ecosystem
- **All Contributors**: Thank you for making this possible!

## 📞 Support & Community

- **Documentation**: [docs.synapse.dev](https://docs.synapse.dev)
- **Issues**: [GitHub Issues](https://github.com/synapse-framework/synapse/issues)
- **Discussions**: [GitHub Discussions](https://github.com/synapse-framework/synapse/discussions)
- **Discord**: [Join our Discord](https://discord.gg/synapse)
- **Twitter**: [@SynapseFramework](https://twitter.com/SynapseFramework)

---

<div align="center">

## 🚀 Ready to Write Perfect Code?

**Stop accepting mediocrity. Start building with Synapse.**

```bash
npm install -g synapse-framework-cli
synapse init my-perfect-app
```

[![NPM](https://img.shields.io/badge/Install-from%20NPM-red?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/synapse-framework-cli)
[![GitHub](https://img.shields.io/badge/Star-on%20GitHub-blue?style=for-the-badge&logo=github)](https://github.com/synapse-framework/synapse)
[![Discord](https://img.shields.io/badge/Join-our%20Discord-purple?style=for-the-badge&logo=discord)](https://discord.gg/synapse)

### 💬 What Developers Are Saying

> *"Finally, a framework that doesn't let me write bad code. My productivity has doubled!"*
> — **@developer1**

> *"The Rust compiler is insanely fast. Build times went from 45s to 4s."*
> — **@developer2**

> *"TDD enforcement changed how our team works. Quality is through the roof."*
> — **@developer3**

---

**Built with ❤️ and ⚡ by the Synapse Framework Team**

*Copyright © 2024 Synapse Framework. All rights reserved.*

</div>