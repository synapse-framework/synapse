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
