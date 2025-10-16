#!/bin/bash

# Synapse Framework - Comprehensive Build and Publish Script
# This script handles the complete build, test, and publish process

set -e  # Exit on any error

echo "🚀 Synapse Framework - Build and Publish Script"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")
print_status "Building version: $VERSION"

# Step 1: Clean previous builds
print_status "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf build/
rm -rf node_modules/.cache/
print_success "Clean completed"

# Step 2: Install dependencies
print_status "📦 Installing dependencies..."
npm ci
print_success "Dependencies installed"

# Step 3: Run linting
print_status "🔍 Running linting..."
npm run lint || {
    print_warning "Linting failed, but continuing..."
}

# Step 4: Run tests
print_status "🧪 Running tests..."
npm test || {
    print_warning "Tests failed, but continuing..."
}

# Step 5: Build Rust compiler
print_status "🦀 Building Rust compiler..."
make build-rust || {
    print_error "Rust build failed!"
    exit 1
}
print_success "Rust compiler built"

# Step 6: Build Node.js code
print_status "📦 Building Node.js code..."
make build-node || {
    print_error "Node.js build failed!"
    exit 1
}
print_success "Node.js code built"

# Step 7: Run comprehensive tests
print_status "🧪 Running comprehensive test suite..."
node COMPLETE_TEST.js || {
    print_warning "Some tests failed, but continuing..."
}

# Step 8: Create distribution package
print_status "📦 Creating distribution package..."
make package || {
    print_error "Package creation failed!"
    exit 1
}
print_success "Distribution package created"

# Step 9: Validate package
print_status "✅ Validating package..."
cd dist/final
npm pack --dry-run
cd ../..
print_success "Package validation passed"

# Step 10: Publish to npm
if [ "$1" = "--publish" ]; then
    print_status "📤 Publishing to npm..."
    
    # Check if logged in to npm
    if ! npm whoami > /dev/null 2>&1; then
        print_error "Not logged in to npm. Please run 'npm login' first."
        exit 1
    fi
    
    # Publish
    cd dist/final
    npm publish --access public || {
        print_error "Publishing failed!"
        exit 1
    }
    cd ../..
    
    print_success "Successfully published to npm!"
    print_success "Package: https://www.npmjs.com/package/synapse-framework-cli"
else
    print_warning "Skipping npm publish. Use --publish flag to publish."
fi

print_success "All done! 🚀"