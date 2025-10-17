#!/bin/bash

# Publish packages that don't require Rust compilation
echo "🚀 Publishing Synapse Framework packages..."

# Set NPM token
export NPM_TOKEN="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"

# Create .npmrc file
echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc

# Publish rule-monitors (TypeScript only)
echo "📦 Publishing @snps/rule-monitors..."
cd packages/rule-monitors
npm publish --access public
cd ../..

echo "✅ Publishing completed!"
echo ""
echo "📋 Published packages:"
echo "- @snps/rule-monitors@0.1.0"
echo ""
echo "⚠️  Note: Rust packages require additional setup:"
echo "- @snps/rule-engine-rust (needs NAPI build)"
echo "- @snps/http-client-rust (needs OpenSSL)"
echo "- @snps/env-parser-rust (needs NAPI build)"
echo "- @snps/commit-lint-rust (needs NAPI build)"
echo ""
echo "🔗 Create pull request:"
echo "https://github.com/synapse-framework/synapse/pull/new/feature/rust-packages-and-documentation"