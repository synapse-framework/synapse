# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Synapse is a zero-dependency, TypeScript-first fullstack web framework with strict enforcement of best practices and TDD. It combines a Rust-based high-performance compiler/bundler with a Node.js TypeScript runtime for developer experience.

**Key Philosophy**: Strict by default with no escape hatches. TDD is mandatory and enforced at build time. The framework aims to provide universal support for any database, storage, hosting, and protocol.

## Build Commands

### Complete Framework Build
```bash
make build              # Build both Rust compiler and Node.js code
make build-rust         # Build only Rust compiler
make build-node         # Build only Node.js/TypeScript code
```

### Development
```bash
make dev                # Start development mode with watch
npm run dev             # TypeScript watch mode only
```

### Testing & Quality
```bash
make test               # Run all tests
npm test                # Currently placeholder
```

### Installation
```bash
make install            # Install framework globally (requires build first)
make uninstall          # Uninstall framework
```

### Packaging & Distribution
```bash
make package            # Create distribution package in dist/final/
make publish            # Publish to npm (runs package first)
make clean              # Clean all build artifacts
```

### Utilities
```bash
make setup              # Setup development environment (install deps, make scripts executable)
make check-deps         # Verify Node.js, npm, and Rust/cargo are installed
```

## Running Tests

### Single Test File
```bash
node test-simple.js                    # Run basic tests
node test-core-components.js           # Test core framework components
node test-cli-tool.js                  # Test CLI functionality
node test-npm-publishing.js            # Test npm publishing
node test-performance.js               # Performance tests
node test-project-generation.js        # Project scaffolding tests
node test-quality-assurance.js         # Quality checks
node test-security.js                  # Security tests
node test-ui-components.js             # UI component tests
node test-universal-support.js         # Universal adapter tests
node demo.js                           # Run demo/example code
```

### Complete Test Suite
```bash
node COMPLETE_TEST.js                  # Run all tests
```

### Rust Tests
```bash
cd rust-compiler && cargo test         # Test Rust compiler
cd packages/cli && cargo test          # Test Rust CLI
```

## Architecture

### Monorepo Structure

The project is a monorepo with packages under `packages/`:
- **@snps/core**: Core framework (runtime, compiler bridge, testing, linting, router, state, plugins)
- **@snps/cli**: Command-line interface with extensive features (v0.3.0 published)
- **@snps/compiler**: TypeScript compiler bridge to Rust
- **@snps/testing**: Testing framework
- **@snps/linting**: Linting system
- **@snps/router**: Universal routing
- **@snps/state**: State management
- **@snps/plugins**: Plugin system
- **@snps/ui**: UI component library with animations and accessibility (v0.5.0 published)
- **@snps/mobile**: Mobile development support for React Native and Flutter (local only)

### Dual-Language Architecture

**Rust Layer** (`rust-compiler/`):
- High-performance TypeScript compiler using SWC
- Parallel compilation with rayon
- Bundler with tree-shaking and code-splitting
- Multi-threaded processing
- Caching system with intelligent invalidation
- Source map generation
- Minification engine

**TypeScript Layer** (`src/`, `packages/`):
- CLI interface and command handlers
- Developer-facing APIs
- Project scaffolding and code generation
- Runtime engine and framework APIs
- Node.js bridge to Rust binary

### Key Components

**Rust Compiler** (`rust-compiler/src/`):
- `lib.rs`: Main compiler interface with `SynapseCompiler` struct
- `config.rs`: Compiler configuration
- `errors.rs`: Error handling types
- Supports TypeScript, JSX/TSX, and multiple module formats (ESNext, CommonJS, AMD, UMD, SystemJS)
- Async compilation with caching layer

**CLI System** (`packages/cli/src/`):
- Main CLI entry point: `index.ts` or `synapse-cli.ts`
- Rust CLI implementation: `main.rs` (extensive feature set)
- Command modules for deployment, monitoring, security, database, documentation, i18n, analytics, caching, team collaboration, AI assistance, etc.

**Core Framework** (`packages/core/src/index.ts`):
- `SynapseFramework`: Main framework class
- `SynapseRuntime`: Multi-threaded runtime engine
- `SynapseCompiler`: Compiler interface
- `SynapseTestingFramework`: TDD enforcement
- `SynapseLintingSystem`: Strict linting
- `SynapseRouter`: File-based and programmatic routing
- `SynapseStateManager`: Reactive state with immutability
- `SynapsePluginSystem`: Plugin loader and validator

### Build Pipeline

The build system has two stages:

1. **Rust Compilation** (`scripts/build-rust.sh`):
   - Builds Rust compiler with all features enabled
   - Creates `synapse-compiler` binary
   - Compiles Node.js addon (cdylib) if configured
   - Outputs to `build/rust/` and copies to `node_modules/.bin/`

2. **Node.js Compilation** (`scripts/build-node.sh`):
   - Runs `tsc` to compile TypeScript
   - Copies package files and Rust binary to `dist/`
   - Creates executable wrapper script
   - Updates package.json bin field

## TypeScript Configuration

The project uses **extremely strict** TypeScript settings (`tsconfig.json`):
- All strict mode flags enabled
- `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, etc.
- `noUncheckedIndexedAccess`: true
- `noPropertyAccessFromIndexSignature`: true
- `verbatimModuleSyntax`: true (explicit imports/exports)
- ES2022 target with ESNext modules

When writing TypeScript:
- Always provide explicit types
- Use `const` over `let` (immutability enforced)
- Provide return types for all functions
- Use explicit access modifiers in classes

## Development Patterns

### TDD Enforcement
The framework enforces Test-Driven Development:
- All production code must have accompanying tests
- Build fails if code lacks tests
- 100% coverage threshold by default
- Use `@synapse/testing` framework for all tests

### Strict Linting
Custom linting rules enforce:
- No unused variables
- No mutable variables (prefer const)
- Explicit return types
- Explicit access modifiers
- No implicit any

### Plugin System
Plugins must implement the `Plugin` interface:
```typescript
interface Plugin {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly dependencies: string[];
  readonly hooks: Hook[];
  readonly commands: Command[];
  readonly middleware: Middleware[];
  readonly components: Component[];
  install(context: PluginContext): Promise<void>;
  uninstall(context: PluginContext): Promise<void>;
}
```

### Compiler Integration
The TypeScript code calls the Rust compiler via:
- Spawning the `synapse-compiler` binary
- Node.js native addon (if built as cdylib)
- Configuration passed via config files or CLI args

## Important Notes

### Module System
- Package type is `"module"` (ES modules)
- Use `import`/`export`, not `require()`
- Top-level `await` is supported
- File extensions required in imports (`.js` for compiled `.ts` files)

### Rust Compiler Features
The Rust compiler is built with these features:
- `parallel`: Multi-threaded compilation
- `typescript`: TypeScript support
- `bundling`: Bundler functionality
- `minification`: Code minification
- `source-maps`: Source map generation
- `incremental`: Incremental compilation
- `watch`: File watching for hot reload

### Caching Strategy
The Rust compiler implements intelligent caching:
- File-level caching with content hashing
- Cache invalidation on file changes
- Cache directory: configurable via `CompilerConfig`
- Cache hits/misses tracked in stats

### Error Handling
- Rust code uses `anyhow::Result<T>` for error propagation
- TypeScript code should use try-catch with proper error types
- All CLI commands should exit with proper status codes
- Errors should include context (file, line, column) when applicable

### Performance Considerations
- Rust compiler uses Rayon for parallel processing
- File compilation is parallelized by default
- Bundling supports code-splitting
- Tree-shaking enabled for production builds
- Minification only in production mode

## Common Development Tasks

### Adding a New CLI Command
1. Add command handler to `packages/cli/src/` or Rust `main.rs`
2. Register command in CLI parser
3. Add tests for the command
4. Update help text and documentation

### Creating a New Package
1. Create directory in `packages/`
2. Add `package.json` with `@snps/` scope
3. Add `tsconfig.json` extending root config
4. Implement package exports
5. Add tests
6. Update root build scripts if needed

### Modifying the Rust Compiler
1. Edit source in `rust-compiler/src/`
2. Run `make build-rust` to rebuild
3. Test with `cargo test` in rust-compiler/
4. Ensure Node.js wrapper still works

### Working with Multiple Module Formats
The compiler supports transformation between:
- TypeScript → JavaScript
- ESNext → ES2015, CommonJS, AMD, UMD, SystemJS
- JSX/TSX → JavaScript (React transform)

Configure via `CompilerConfig`:
```rust
CompilerConfig {
    target_language: TargetLanguage::JavaScript,
    module_format: ModuleFormat::CommonJS,
    react: true,
    minify: true,
    // ...
}
```

## Known Issues & TODOs

See `TODO.md` for comprehensive list. Key items:
- TypeScript compilation fixed but ongoing improvements needed
- Many Rust CLI features implemented but need TypeScript wrappers
- Testing framework needs expansion
- Documentation generation incomplete
- Deployment adapters need implementation
- Database adapters need implementation

## CLI Commands (User-Facing)

Once installed via `make install`, users can run:
```bash
synapse init <name>              # Initialize new project
synapse dev                      # Start dev server
synapse build                    # Build for production
synapse test                     # Run tests
synapse lint                     # Lint code
synapse format                   # Format code
synapse generate <type> <name>   # Code generation
synapse deploy                   # Deploy app
synapse plugin:install <name>    # Install plugin
synapse db:migrate               # Run migrations
synapse monitor                  # Monitor app
```

## Dependencies

### Rust Dependencies
- SWC (TypeScript parser, transforms, codegen)
- Tokio (async runtime)
- Rayon (parallel processing)
- Serde (serialization)
- Anyhow/Thiserror (error handling)
- See `rust-compiler/Cargo.toml` for full list

### Node.js Dependencies
**Runtime**:
- None (zero-dependency goal)

**Dev Dependencies**:
- TypeScript 5.9+
- @types/node
- Commander (for CLI parsing in some modules)

## Project Goals

1. **Zero Dependencies**: Everything built from scratch
2. **Strict Enforcement**: No escape hatches from best practices
3. **TDD Mandatory**: No code without tests
4. **High Performance**: Rust for speed-critical paths
5. **Universal Support**: Any DB, storage, protocol, hosting
6. **Developer Experience**: Comprehensive CLI with all workflows

## Community & Ecosystem

### Community Directory Structure
- **community/discord-bot**: Discord bot for community support and engagement
- **community/newsletter**: Newsletter system for community updates
- **community/plugin-marketplace**: Plugin marketplace with 50+ plugins across 6 categories
- **community/template-gallery**: Template gallery with 25+ templates across 4 categories

### Website
- **website/**: Professional marketing website with live demos and interactive playground
  - Built with modern web technologies
  - Features live code playground for trying Synapse
  - Component showcase with interactive examples
  - Theme switching (dark/light mode)
  - Responsive and accessible design

### GitHub Structure
The project includes comprehensive GitHub workflows and templates:
- **CI/CD Pipeline** (`.github/workflows/ci.yml`): Complete CI/CD with lint, test, build, security, performance
- **Publishing** (`.github/workflows/publish.yml`): Automated npm publishing
- **Release** (`.github/workflows/release.yml`): Automated releases
- **Issue Templates**: Bug reports, feature requests, questions
- **PR Templates**: Standardized pull request format
- **Security Policy**: Security reporting and disclosure
- **Support Guide**: Community support resources

## NPM Publishing

### Published Packages (npm registry)
```bash
# Currently published to npm:
@snps/cli@0.3.0           # Main CLI framework
@snps/core@0.3.0          # Core framework
@snps/compiler@0.3.0      # Compiler
@snps/testing@0.3.0       # Testing framework
@snps/linting@0.3.0       # Linting system
@snps/router@0.3.0        # Router
@snps/state@0.3.0         # State management
@snps/plugins@0.3.0       # Plugin system
@snps/ui@0.5.0            # UI component library

# Local only (not yet published):
@snps/mobile@0.1.0        # Mobile development support
```

### Publishing Workflow
```bash
# Set NPM token (required for publishing)
export NPM_TOKEN="your_npm_token_here"

# Publish all packages
make publish              # Uses scripts/publish.sh

# Or publish individually
cd packages/cli && npm publish
cd packages/ui && npm publish
```

## References

- Main README: `README.md` (comprehensive user documentation)
- TODO List: `TODO.md` (development roadmap with 200+ items)
- Build Scripts: `scripts/` directory (build-rust.sh, build-node.sh, build-all.sh, publish.sh)
- Test Files: `test-*.js` files in root
- Summary Docs: `COMPLETE_ECOSYSTEM_SUMMARY.md`, `ANIMATIONS_AND_STORYBOOK_SUMMARY.md`, etc.
