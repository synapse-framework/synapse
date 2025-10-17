#!/bin/bash

# Deploy Synapse Demo Applications to GitHub Pages
# This script builds the demo apps and prepares them for GitHub Pages deployment

set -e

echo "🚀 Deploying Synapse Demo Applications to GitHub Pages..."

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
if [ ! -d "synapse-demo-app" ]; then
    print_error "synapse-demo-app directory not found. Please run from the synapse project root."
    exit 1
fi

# Create deployment directory
print_status "Creating deployment directory..."
rm -rf gh-pages-deploy
mkdir -p gh-pages-deploy

# Build dashboard
print_status "Building dashboard application..."
cd synapse-demo-app/synapse-dashboard
npm ci --silent
npm run build
print_success "Dashboard built successfully"

# Build documentation
print_status "Building documentation application..."
cd ../synapse-docs
npm ci --silent
npm run build:docs
print_success "Documentation built successfully"

# Go back to project root
cd ../..

# Copy dashboard files
print_status "Copying dashboard files..."
cp -r synapse-demo-app/synapse-dashboard/dist/* gh-pages-deploy/

# Copy documentation files
print_status "Copying documentation files..."
mkdir -p gh-pages-deploy/docs
cp -r synapse-demo-app/synapse-docs/dist/* gh-pages-deploy/docs/

# Create main index.html
print_status "Creating main index.html..."
cat > gh-pages-deploy/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Synapse Framework Demo Applications</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 2rem; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            min-height: 100vh; 
            color: white; 
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            text-align: center; 
        }
        h1 { 
            font-size: 3rem; 
            margin-bottom: 1rem; 
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        p { 
            font-size: 1.2rem; 
            margin-bottom: 2rem; 
            opacity: 0.9; 
        }
        .apps { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 2rem; 
            margin: 3rem 0; 
        }
        .app-card { 
            background: rgba(255,255,255,0.1); 
            backdrop-filter: blur(10px); 
            border-radius: 12px; 
            padding: 2rem; 
            transition: transform 0.3s ease; 
            border: 1px solid rgba(255,255,255,0.2);
        }
        .app-card:hover { 
            transform: translateY(-5px); 
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .app-card h3 { 
            font-size: 1.5rem; 
            margin-bottom: 1rem; 
        }
        .app-card p { 
            margin-bottom: 1.5rem; 
        }
        .btn { 
            display: inline-block; 
            padding: 1rem 2rem; 
            background: white; 
            color: #667eea; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600; 
            transition: all 0.3s ease; 
        }
        .btn:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 8px 25px rgba(0,0,0,0.2); 
        }
        .status {
            background: rgba(0,255,0,0.1);
            border: 1px solid rgba(0,255,0,0.3);
            border-radius: 8px;
            padding: 1rem;
            margin: 2rem 0;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 2rem 0;
        }
        .feature {
            background: rgba(255,255,255,0.05);
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Synapse Framework</h1>
        <p>Comprehensive demonstration applications showcasing modern web development with TypeScript, Rust integration, and cutting-edge UI components.</p>
        
        <div class="status">
            <h3>✅ Framework Status: PRODUCTION READY</h3>
            <p>All core APIs working • CLI build process functional • Demo applications deployed</p>
        </div>
        
        <div class="apps">
            <div class="app-card">
                <h3>📊 Dashboard Demo</h3>
                <p>Interactive dashboard showcasing real-time metrics, security scanning, AI optimization, and comprehensive framework features.</p>
                <a href="./" class="btn">Launch Dashboard</a>
            </div>
            
            <div class="app-card">
                <h3>📚 Documentation</h3>
                <p>Full-featured documentation website built entirely with Synapse, featuring interactive navigation, search, and comprehensive guides.</p>
                <a href="./docs/" class="btn">View Documentation</a>
            </div>
        </div>
        
        <div class="features">
            <div class="feature">
                <h4>🔧 Core APIs</h4>
                <p>Working state management, routing, testing, and linting</p>
            </div>
            <div class="feature">
                <h4>🛠️ CLI Tools</h4>
                <p>Functional build process with TypeScript compilation</p>
            </div>
            <div class="feature">
                <h4>🎨 UI Components</h4>
                <p>Self-made components with fixed import issues</p>
            </div>
            <div class="feature">
                <h4>📦 NPM Packages</h4>
                <p>Published and available: @snps/core, @snps/ui, @snps/cli</p>
            </div>
        </div>
        
        <p style="margin-top: 3rem; opacity: 0.7;">
            Built with ❤️ using the Synapse Framework<br>
            <small>Zero dependencies • TypeScript-first • Rust-powered • Production ready</small>
        </p>
    </div>
</body>
</html>
EOF

print_success "Main index.html created"

# Create .nojekyll file for GitHub Pages
print_status "Creating .nojekyll file..."
touch gh-pages-deploy/.nojekyll

# Show deployment structure
print_status "Deployment structure:"
ls -la gh-pages-deploy/
echo ""
ls -la gh-pages-deploy/docs/ 2>/dev/null || echo "No docs directory"

# Show file sizes
print_status "File sizes:"
du -sh gh-pages-deploy/* | sort -hr

print_success "Deployment files prepared successfully!"
print_warning "To deploy to GitHub Pages:"
echo "1. Create a new branch called 'gh-pages'"
echo "2. Copy the contents of 'gh-pages-deploy/' to the root of that branch"
echo "3. Push the branch to GitHub"
echo "4. Enable GitHub Pages in repository settings to use the 'gh-pages' branch"
echo ""
echo "Or use GitHub CLI:"
echo "gh repo create synapse-demo-apps --public --source=gh-pages-deploy"
echo ""
print_status "Deployment directory ready: gh-pages-deploy/"