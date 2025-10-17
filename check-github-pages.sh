#!/bin/bash

echo "🔍 Checking GitHub Pages Status..."
echo ""

# Check if gh-pages branch exists
echo "1. Checking gh-pages branch..."
if git show-ref --verify --quiet refs/remotes/origin/gh-pages; then
    echo "   ✅ gh-pages branch exists on remote"
else
    echo "   ❌ gh-pages branch not found on remote"
fi

# Check if .nojekyll exists
echo ""
echo "2. Checking .nojekyll file..."
if [ -f ".nojekyll" ]; then
    echo "   ✅ .nojekyll file exists"
else
    echo "   ❌ .nojekyll file missing"
fi

# Check if index.html exists
echo ""
echo "3. Checking index.html..."
if [ -f "index.html" ]; then
    echo "   ✅ index.html exists"
    echo "   📄 File size: $(wc -c < index.html) bytes"
else
    echo "   ❌ index.html missing"
fi

# Check GitHub Pages URL
echo ""
echo "4. Checking GitHub Pages URL..."
response=$(curl -s -o /dev/null -w "%{http_code}" https://synapse-framework.github.io/synapse/ 2>/dev/null)
if [ "$response" = "200" ]; then
    echo "   ✅ GitHub Pages is live!"
    echo "   🌐 URL: https://synapse-framework.github.io/synapse/"
elif [ "$response" = "404" ]; then
    echo "   ❌ GitHub Pages returns 404"
    echo "   🔧 GitHub Pages needs to be enabled in repository settings"
else
    echo "   ⚠️  GitHub Pages status: HTTP $response"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Go to: https://github.com/synapse-framework/synapse/settings/pages"
echo "2. Under 'Source', select 'Deploy from a branch'"
echo "3. Select 'gh-pages' branch and '/ (root)' folder"
echo "4. Click 'Save'"
echo "5. Wait 5-10 minutes for deployment"
echo ""
echo "🎯 Expected URL: https://synapse-framework.github.io/synapse/"