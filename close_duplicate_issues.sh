#!/bin/bash

# This script closes GitHub issues from 119 to 201,
# adding a comment that they are duplicates of Epic #222.
# It requires the GitHub CLI (gh) to be installed and authenticated.

echo "🧹 Starting cleanup of duplicate issues..."

for i in $(seq 119 201); do
  echo "Closing issue #$i..."
  gh issue close $i --comment "## 🔄 Issue Closed - Consolidated into Epic #222

This issue has been closed as it is now comprehensively tracked in **Epic #222: Zero-Dependency Data Systems Architecture**.

### ✅ **Why This Consolidation:**
- **Better Organization:** Single epic instead of 85+ individual issues
- **Clearer Requirements:** Detailed TDD plan and zero-dependency strategy
- **Proper Structure:** Follows the quality standards established in issues #207-221
- **Reduced Duplication:** Eliminates repetitive and vague issue descriptions

### 📋 **Next Steps:**
Epic #222 will be broken down into smaller, implementable issues that include:
- ✅ **Zero-Dependency Verification** - Clear implementation strategy
- ✅ **TDD Requirements** - Comprehensive testing plan with >95% coverage
- ✅ **Technical Details** - Specific algorithms, data structures, and architecture
- ✅ **Testable Criteria** - Measurable acceptance criteria

### 🔗 **Reference:**
- **Epic #222:** Zero-Dependency Data Systems Architecture
- **Template Issues:** #207-221 for examples of proper issue structure
- **Quality Standards:** Updated issue template with mandatory TDD sections

Thank you for your contribution! Please refer to Epic #222 for the consolidated requirements." 2>/dev/null || echo "Issue #$i not found or already closed"
done

echo "✅ Cleanup completed!"