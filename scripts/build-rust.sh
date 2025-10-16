#!/bin/bash

# Build script for Rust compiler
# This script compiles the Rust compiler and creates the necessary binaries

set -e

echo "🔨 Building Rust compiler..."

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust is not installed. Please install Rust first:"
    echo "   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "rust-compiler/Cargo.toml" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Create build directory
mkdir -p build/rust

# Build the Rust compiler
echo "📦 Compiling Rust compiler..."
cd rust-compiler

# Build in release mode for performance
cargo build --release

# Copy the binary to the build directory
cp target/release/synapse-compiler ../build/rust/

# Build the Node.js addon (if needed)
echo "🔗 Building Node.js addon..."
if [ -f "Cargo.toml" ] && grep -q "cdylib" Cargo.toml; then
    cargo build --release --lib
    cp target/release/libsynapse_compiler.* ../build/rust/ 2>/dev/null || true
fi

cd ..

# Create the binary directory in node_modules
mkdir -p node_modules/.bin

# Copy the binary to node_modules/.bin for easy access
cp build/rust/synapse-compiler node_modules/.bin/

# Make it executable
chmod +x node_modules/.bin/synapse-compiler

echo "✅ Rust compiler built successfully!"
echo "   Binary location: build/rust/synapse-compiler"
echo "   Node.js binary: node_modules/.bin/synapse-compiler"

# Test the binary
echo "🧪 Testing Rust compiler..."
if ./build/rust/synapse-compiler --version; then
    echo "✅ Rust compiler test passed!"
else
    echo "❌ Rust compiler test failed!"
    exit 1
fi

echo "🎉 Rust compiler build completed successfully!"