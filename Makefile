# Synapse Framework Makefile
# Provides convenient commands for building and managing the framework

.PHONY: help build clean test lint format dev install uninstall

# Default target
help:
	@echo "Synapse Framework - Available commands:"
	@echo ""
	@echo "  build          - Build the entire framework (Rust + Node.js)"
	@echo "  build-rust     - Build only the Rust compiler"
	@echo "  build-node     - Build only the Node.js code"
	@echo "  clean          - Clean all build artifacts"
	@echo "  test           - Run all tests"
	@echo "  lint           - Lint the codebase"
	@echo "  format         - Format the codebase"
	@echo "  dev            - Start development server"
	@echo "  install        - Install the framework globally"
	@echo "  uninstall      - Uninstall the framework"
	@echo "  package        - Create distribution package"
	@echo "  publish        - Publish to npm"
	@echo ""

# Build everything
build: build-rust build-node
	@echo "✅ Complete build finished!"

# Build Rust compiler
build-rust:
	@echo "🔨 Building Rust compiler..."
	@chmod +x scripts/build-rust.sh
	@./scripts/build-rust.sh

# Build Node.js code
build-node:
	@echo "🔨 Building Node.js code..."
	@chmod +x scripts/build-node.sh
	@./scripts/build-node.sh

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf dist/
	@rm -rf build/
	@rm -rf node_modules/
	@rm -rf rust-compiler/target/
	@echo "✅ Clean completed!"

# Run tests
test:
	@echo "🧪 Running tests..."
	@npm test

# Lint code
lint:
	@echo "🔍 Linting code..."
	@npm run lint

# Format code
format:
	@echo "🎨 Formatting code..."
	@npm run format

# Start development server
dev:
	@echo "🚀 Starting development server..."
	@npm run dev

# Install globally
install: build
	@echo "📦 Installing globally..."
	@sudo ./dist/final/install.sh

# Uninstall
uninstall:
	@echo "🗑️  Uninstalling..."
	@sudo ./dist/final/uninstall.sh

# Create distribution package
package: build
	@echo "📦 Creating distribution package..."
	@chmod +x scripts/build-all.sh
	@./scripts/build-all.sh
	@echo "✅ Package created: dist/final/"

# Publish to npm
publish: package
	@echo "📤 Publishing to npm..."
	@cd dist/final && npm publish
	@echo "✅ Published to npm!"

# Comprehensive build and publish
publish-full:
	@echo "🚀 Running comprehensive build and publish..."
	@./scripts/publish.sh --publish
	@echo "✅ Full publish completed!"

# Build and test without publishing
build-test:
	@echo "🔨 Building and testing..."
	@./scripts/publish.sh
	@echo "✅ Build and test completed!"

# Development setup
setup:
	@echo "🔧 Setting up development environment..."
	@npm install
	@chmod +x scripts/*.sh
	@echo "✅ Development setup completed!"

# Check dependencies
check-deps:
	@echo "🔍 Checking dependencies..."
	@command -v node >/dev/null 2>&1 || { echo "❌ Node.js is not installed"; exit 1; }
	@command -v npm >/dev/null 2>&1 || { echo "❌ npm is not installed"; exit 1; }
	@command -v cargo >/dev/null 2>&1 || { echo "❌ Rust is not installed"; exit 1; }
	@echo "✅ All dependencies are installed!"

# Build for production
prod: clean build
	@echo "🏭 Production build completed!"

# Build for development
dev-build: build-node
	@echo "🔧 Development build completed!"

# Quick test
quick-test:
	@echo "⚡ Running quick tests..."
	@npm run test:quick

# Full test suite
full-test:
	@echo "🧪 Running full test suite..."
	@npm run test:full

# Performance test
perf-test:
	@echo "⚡ Running performance tests..."
	@npm run test:perf

# Security audit
audit:
	@echo "🔒 Running security audit..."
	@npm audit
	@cargo audit

# Update dependencies
update:
	@echo "🔄 Updating dependencies..."
	@npm update
	@cd rust-compiler && cargo update

# Show version
version:
	@echo "📋 Synapse Framework version:"
	@node -e "console.log(require('./package.json').version)"

# Show help
.DEFAULT_GOAL := help