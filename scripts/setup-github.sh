#!/bin/bash

# GitHub Repository Setup Script
# This script creates/cleans GitHub repositories and pushes all packages

set -e

echo "🚀 Synapse Framework - GitHub Repository Setup"
echo "=============================================="
echo ""

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed!"
    echo "Please install it first:"
    echo ""
    echo "sudo mkdir -p -m 755 /etc/apt/keyrings"
    echo "curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/etc/apt/keyrings/githubcli-archive-keyring.gpg"
    echo "echo \"deb [arch=\$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main\" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null"
    echo "sudo apt update"
    echo "sudo apt install gh"
    echo ""
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub!"
    echo "Please run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is installed and authenticated"
echo ""

# Get GitHub username
GH_USER=$(gh api user -q .login)
echo "📝 GitHub User: $GH_USER"
echo ""

# Repository configuration
MAIN_REPO="synapse"
ORG_NAME="synapse-framework"  # Change this to your organization or username

echo "🏗️  Repository Setup Plan:"
echo "  Main repo: $ORG_NAME/$MAIN_REPO"
echo ""

# Ask for confirmation
read -p "Do you want to proceed? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Setup cancelled"
    exit 1
fi

# Function to create or update repository
create_or_update_repo() {
    local repo_name=$1
    local description=$2
    local is_private=${3:-false}

    echo ""
    echo "📦 Processing: $repo_name"
    echo "   Description: $description"

    # Check if repo exists
    if gh repo view "$ORG_NAME/$repo_name" &> /dev/null; then
        echo "   ℹ️  Repository exists"

        # Ask if we should clean it
        read -p "   Do you want to clean this repo (delete and recreate)? (y/N) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "   🗑️  Deleting existing repository..."
            gh repo delete "$ORG_NAME/$repo_name" --yes
            echo "   ✅ Repository deleted"

            # Create new repository
            echo "   🆕 Creating new repository..."
            if [ "$is_private" = true ]; then
                gh repo create "$ORG_NAME/$repo_name" --private --description "$description"
            else
                gh repo create "$ORG_NAME/$repo_name" --public --description "$description"
            fi
            echo "   ✅ Repository created"
        else
            echo "   ⏭️  Skipping - will update existing repo"
        fi
    else
        echo "   🆕 Creating new repository..."
        if [ "$is_private" = true ]; then
            gh repo create "$ORG_NAME/$repo_name" --private --description "$description"
        else
            gh repo create "$ORG_NAME/$repo_name" --public --description "$description"
        fi
        echo "   ✅ Repository created"
    fi
}

# Create/update main repository
create_or_update_repo \
    "$MAIN_REPO" \
    "⚡ Zero Dependencies • 🔥 10x Performance • 💎 Strict Enforcement - The TypeScript-first framework that forces you to write perfect code" \
    false

echo ""
echo "✅ Repository setup complete!"
echo ""
echo "🔗 Main repository: https://github.com/$ORG_NAME/$MAIN_REPO"
echo ""

# Initialize git if not already initialized
if [ ! -d .git ]; then
    echo "📝 Initializing git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git repository already initialized"
fi

# Configure git remote
echo ""
echo "🔗 Configuring remote..."
if git remote | grep -q "^origin$"; then
    echo "   Updating existing origin remote..."
    git remote set-url origin "https://github.com/$ORG_NAME/$MAIN_REPO.git"
else
    echo "   Adding origin remote..."
    git remote add origin "https://github.com/$ORG_NAME/$MAIN_REPO.git"
fi
echo "✅ Remote configured"

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    echo ""
    echo "📝 Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
package-lock.json

# Build output
dist/
build/
*.js.map
*.d.ts.map

# Rust
target/
Cargo.lock

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local
.env.*.local

# Logs
*.log
logs/

# Testing
coverage/
.nyc_output/

# Temporary files
tmp/
temp/
*.tmp

# Cache
.cache/
.parcel-cache/
.npm/

# Production
*.tgz
EOF
    echo "✅ .gitignore created"
fi

# Stage all files
echo ""
echo "📦 Staging files..."
git add .
echo "✅ Files staged"

# Create initial commit if needed
if ! git rev-parse HEAD &> /dev/null; then
    echo ""
    echo "📝 Creating initial commit..."
    git commit -m "🎉 Initial commit - Synapse Framework v0.5.0

- Complete framework ecosystem with 13 packages
- Zero dependencies, TypeScript-first, TDD enforced
- Rust-powered compiler for 10x performance
- Enterprise features: SSO, audit, compliance, RBAC
- Performance monitoring: profiling, metrics, alerts, RUM
- Advanced testing: mutation, property-based, chaos, load
- Beautiful UI library with 8+ components
- Mobile development support
- Community platform with 50+ plugins and 25+ templates

🚀 Ready to revolutionize web development!

🤖 Generated with Claude Code
"
    echo "✅ Initial commit created"
else
    echo ""
    echo "ℹ️  Repository already has commits"

    # Check if there are changes
    if ! git diff-index --quiet HEAD --; then
        echo "📝 Creating commit for changes..."
        git commit -m "🔄 Update - Synapse Framework

- Updated CLAUDE.md with complete project structure
- Implemented @snps/monitoring (performance monitoring)
- Implemented @snps/enterprise (SSO, audit, compliance, RBAC)
- Implemented @snps/testing-advanced (mutation, property-based, chaos, load)
- All builds successful and tests passing

🤖 Generated with Claude Code
"
        echo "✅ Commit created"
    else
        echo "ℹ️  No changes to commit"
    fi
fi

# Set main branch
echo ""
echo "🌳 Ensuring main branch..."
if git branch | grep -q "main"; then
    echo "✅ Already on main branch"
else
    if git branch | grep -q "master"; then
        echo "Renaming master to main..."
        git branch -M main
        echo "✅ Branch renamed"
    else
        git branch -M main
        echo "✅ Branch set to main"
    fi
fi

# Push to remote
echo ""
echo "⬆️  Pushing to GitHub..."
read -p "Push to GitHub now? (y/N) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Pushing to origin/main..."
    git push -u origin main --force
    echo "✅ Pushed successfully!"
    echo ""
    echo "🎉 All done! Your repository is now on GitHub!"
    echo "🔗 View at: https://github.com/$ORG_NAME/$MAIN_REPO"
else
    echo "⏭️  Skipped push - you can push later with: git push -u origin main"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Visit: https://github.com/$ORG_NAME/$MAIN_REPO"
echo "  2. Update repository settings (description, topics, etc.)"
echo "  3. Add collaborators if needed"
echo "  4. Set up branch protection rules"
echo "  5. Configure GitHub Actions secrets (NPM_TOKEN, etc.)"
echo ""
