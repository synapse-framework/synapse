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
