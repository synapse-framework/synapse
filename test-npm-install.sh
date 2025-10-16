#!/bin/bash

# Comprehensive NPM Installation Test Script
# Tests synapse-framework-cli from NPM registry

set -e

echo "🧪 Synapse Framework - NPM Installation Test Suite"
echo "=================================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Helper function to run tests
run_test() {
    local test_name="$1"
    local command="$2"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    echo -e "${BLUE}[TEST $TOTAL_TESTS]${NC} $test_name"

    if eval "$command" > /tmp/synapse-test-output.txt 2>&1; then
        echo -e "${GREEN}✅ PASSED${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        cat /tmp/synapse-test-output.txt
    else
        echo -e "${RED}❌ FAILED${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        cat /tmp/synapse-test-output.txt
    fi
    echo ""
}

# Step 1: Check if package is published
echo -e "${YELLOW}📦 Step 1: Checking NPM Registry${NC}"
run_test "Check package on NPM registry" "npm view synapse-framework-cli version"

# Step 2: Global installation test
echo -e "${YELLOW}📦 Step 2: Testing Global Installation${NC}"
echo "Installing synapse-framework-cli globally..."
npm install -g synapse-framework-cli --force > /tmp/npm-install.log 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Global installation successful${NC}"
else
    echo -e "${RED}❌ Global installation failed${NC}"
    cat /tmp/npm-install.log
    exit 1
fi
echo ""

# Step 3: Check binary availability
echo -e "${YELLOW}🔍 Step 3: Checking Binary Availability${NC}"
run_test "Check synapse binary exists" "which synapse"
run_test "Check synapse-compiler binary exists" "which synapse-compiler"

# Step 4: Version tests
echo -e "${YELLOW}🔢 Step 4: Testing Version Commands${NC}"
run_test "synapse --version" "synapse --version"
run_test "synapse -v" "synapse -v"
run_test "synapse-compiler --version" "synapse-compiler --version"

# Step 5: Help tests
echo -e "${YELLOW}📖 Step 5: Testing Help Commands${NC}"
run_test "synapse --help" "synapse --help"
run_test "synapse -h" "synapse -h"
run_test "synapse (no args)" "synapse"

# Step 6: Command execution tests
echo -e "${YELLOW}⚙️ Step 6: Testing All CLI Commands${NC}"
run_test "synapse init" "synapse init test-project"
run_test "synapse dev" "synapse dev"
run_test "synapse build" "synapse build"
run_test "synapse test" "synapse test"
run_test "synapse lint" "synapse lint"
run_test "synapse format" "synapse format"
run_test "synapse generate" "synapse generate component"

# Step 7: Rust compiler tests
echo -e "${YELLOW}🦀 Step 7: Testing Rust Compiler Binary${NC}"
run_test "synapse-compiler version" "synapse-compiler --version"
run_test "synapse-compiler help" "synapse-compiler --help"

# Step 8: Package information tests
echo -e "${YELLOW}📋 Step 8: Testing Package Information${NC}"
run_test "npm view synapse-framework-cli" "npm view synapse-framework-cli"
run_test "npm list synapse-framework-cli" "npm list -g synapse-framework-cli"

# Step 9: File structure verification
echo -e "${YELLOW}📁 Step 9: Verifying Installed File Structure${NC}"
NPM_PREFIX=$(npm config get prefix)
INSTALL_DIR="$NPM_PREFIX/lib/node_modules/synapse-framework-cli"

if [ -d "$INSTALL_DIR" ]; then
    echo -e "${GREEN}✅ Installation directory exists: $INSTALL_DIR${NC}"
    run_test "Check dist directory" "test -d $INSTALL_DIR/dist"
    run_test "Check main entry point" "test -f $INSTALL_DIR/dist/index.js"
    run_test "Check type definitions" "test -f $INSTALL_DIR/dist/index.d.ts"
    run_test "Check synapse binary" "test -f $INSTALL_DIR/dist/bin/synapse"
    run_test "Check synapse-compiler binary" "test -f $INSTALL_DIR/dist/bin/synapse-compiler"
    run_test "Check README" "test -f $INSTALL_DIR/README.md"
    run_test "Check CLAUDE.md" "test -f $INSTALL_DIR/CLAUDE.md"
else
    echo -e "${RED}❌ Installation directory not found: $INSTALL_DIR${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
echo ""

# Step 10: Cross-platform compatibility tests
echo -e "${YELLOW}🌍 Step 10: Testing Cross-Platform Compatibility${NC}"
run_test "Check Node.js version" "node --version"
run_test "Check npm version" "npm --version"
run_test "Check platform" "uname -a"

# Final Summary
echo ""
echo "=================================================="
echo -e "${BLUE}📊 Test Summary${NC}"
echo "=================================================="
echo -e "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! Package is working correctly.${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Please review the output above.${NC}"
    exit 1
fi
