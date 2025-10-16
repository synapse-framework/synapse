#!/bin/bash

# Complete build script for Synapse Framework
# This script builds both Rust and Node.js components

set -e

echo "🚀 Building Synapse Framework..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Create build directory
mkdir -p build

# Build Rust compiler first
echo "🔨 Building Rust compiler..."
./scripts/build-rust.sh

# Build Node.js code
echo "🔨 Building Node.js code..."
./scripts/build-node.sh

# Create final package
echo "📦 Creating final package..."
rm -rf dist/final
mkdir -p dist/final

# Copy all necessary files
cp -r dist/bin dist/final/
cp -r dist/*.js dist/final/ 2>/dev/null || true
cp -r dist/*.d.ts dist/final/ 2>/dev/null || true
cp -r dist/*.map dist/final/ 2>/dev/null || true

# Copy package files
cp package.json dist/final/
cp README.md dist/final/ 2>/dev/null || true
cp LICENSE dist/final/ 2>/dev/null || true
cp -r build/rust/* dist/final/bin/ 2>/dev/null || true

# Create installation script
cat > dist/final/install.sh << 'EOF'
#!/bin/bash

# Installation script for Synapse Framework

set -e

echo "🚀 Installing Synapse Framework..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   https://nodejs.org/"
    exit 1
fi

# Create global installation directory
INSTALL_DIR="/usr/local/lib/synapse"
BIN_DIR="/usr/local/bin"

# Create directories
sudo mkdir -p "$INSTALL_DIR"
sudo mkdir -p "$BIN_DIR"

# Copy files
sudo cp -r * "$INSTALL_DIR/"

# Create symlinks
sudo ln -sf "$INSTALL_DIR/bin/synapse" "$BIN_DIR/synapse"
sudo ln -sf "$INSTALL_DIR/bin/synapse-compiler" "$BIN_DIR/synapse-compiler"

# Make executables
sudo chmod +x "$INSTALL_DIR/bin/synapse"
sudo chmod +x "$INSTALL_DIR/bin/synapse-compiler"

echo "✅ Synapse Framework installed successfully!"
echo "   Installation directory: $INSTALL_DIR"
echo "   Binary location: $BIN_DIR/synapse"
echo ""
echo "You can now use 'synapse' command from anywhere!"
echo "Try: synapse --version"
EOF

chmod +x dist/final/install.sh

# Create uninstallation script
cat > dist/final/uninstall.sh << 'EOF'
#!/bin/bash

# Uninstallation script for Synapse Framework

set -e

echo "🗑️  Uninstalling Synapse Framework..."

# Remove symlinks
sudo rm -f /usr/local/bin/synapse
sudo rm -f /usr/local/bin/synapse-compiler

# Remove installation directory
sudo rm -rf /usr/local/lib/synapse

echo "✅ Synapse Framework uninstalled successfully!"
EOF

chmod +x dist/final/uninstall.sh

# Create README for final package
cat > dist/final/README.md << 'EOF'
# Synapse Framework

A zero-dependency, TypeScript-first fullstack web framework with strict enforcement of best practices, TDD, and design patterns.

## Installation

### Global Installation
```bash
sudo ./install.sh
```

### Local Installation
```bash
npm install -g .
```

## Usage

```bash
# Create new project
synapse init my-app

# Start development server
synapse dev

# Build for production
synapse build

# Run tests
synapse test

# Lint code
synapse lint

# Format code
synapse format
```

## Features

- 🚀 **Zero Dependencies**: Everything built from scratch in TypeScript
- 🔒 **Strict by Default**: Enforce best practices at every level
- 🧪 **TDD Mandatory**: No code without tests
- ⚡ **Multi-threaded**: Leverage all available CPU cores
- 🌐 **Universal**: Support any database, storage, hosting, protocol
- 🔌 **Extensible**: Plugin system with strict guidelines
- 🎯 **Type-Safe**: Full TypeScript support with strict type checking

## License

MIT
EOF

echo "✅ Complete build finished successfully!"
echo "   Final package: dist/final/"
echo "   Installation script: dist/final/install.sh"
echo "   Uninstallation script: dist/final/uninstall.sh"

# Show package size
echo ""
echo "📊 Package information:"
du -sh dist/final/
echo "   Files: $(find dist/final -type f | wc -l)"
echo "   Directories: $(find dist/final -type d | wc -l)"

echo ""
echo "🎉 Synapse Framework build completed successfully!"
echo "   Ready for distribution!"