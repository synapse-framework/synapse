#!/bin/bash

# Build script for Node.js TypeScript code
# This script compiles the TypeScript code and creates the necessary JavaScript files

set -e

echo "🔨 Building Node.js TypeScript code..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first:"
    echo "   https://www.npmjs.com/get-npm"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist
mkdir -p dist

# Compile TypeScript
echo "📝 Compiling TypeScript..."
npx tsc

# Copy package.json to dist
echo "📋 Copying package files..."
cp package.json dist/
cp README.md dist/
cp LICENSE dist/ 2>/dev/null || true

# Copy Rust binary to dist
echo "🔗 Copying Rust binary..."
mkdir -p dist/bin
if [ -f "build/rust/synapse-compiler" ]; then
    cp build/rust/synapse-compiler dist/bin/
    chmod +x dist/bin/synapse-compiler
else
    echo "⚠️  Rust binary not found. Please run build-rust.sh first."
fi

# Create the main executable
echo "🚀 Creating main executable..."
cat > dist/bin/synapse << 'EOF'
#!/usr/bin/env node

import { SynapseCLI } from '../index.js';

async function main() {
    const cli = new SynapseCLI();
    await cli.run(process.argv.slice(2));
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
EOF

chmod +x dist/bin/synapse

# Update package.json bin field
echo "📝 Updating package.json..."
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('dist/package.json', 'utf8'));
pkg.bin = {
    'synapse': './bin/synapse'
};
fs.writeFileSync('dist/package.json', JSON.stringify(pkg, null, 2));
"

echo "✅ Node.js build completed successfully!"
echo "   Output directory: dist/"
echo "   Main executable: dist/bin/synapse"
echo "   Rust binary: dist/bin/synapse-compiler"

# Test the build
echo "🧪 Testing Node.js build..."
if node dist/bin/synapse --version; then
    echo "✅ Node.js build test passed!"
else
    echo "❌ Node.js build test failed!"
    exit 1
fi

echo "🎉 Node.js build completed successfully!"