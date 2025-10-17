# 🚀 Getting Started with Synapse Framework

Welcome to the **Synapse Framework** - the world's first truly intelligent, self-updating fullstack web framework with automated best practices monitoring!

## 🎯 **What is Synapse?**

Synapse is a **zero-dependency, TypeScript-first fullstack web framework** with strict enforcement of best practices and TDD. It combines a **Rust-based high-performance compiler/bundler** with a **Node.js TypeScript runtime** for developer experience.

### **Key Features**
- 🧠 **Intelligent Rule System** - 500+ automated best practices rules
- ⚡ **Blazing Fast Rust** - 10-50x performance improvements
- 🔒 **Zero Dependencies** - Maximum security and reliability
- 🎯 **TDD Enforcement** - Test-driven development mandatory
- 🌐 **Universal Support** - Any database, storage, hosting, protocol

## 📦 **Installation**

### **Prerequisites**
- **Node.js** 18.0.0 or higher
- **Rust** 1.70+ (for Rust packages)
- **Git** (for version control)

### **Quick Install**

```bash
# Install Synapse CLI globally
npm install -g @snps/cli

# Create a new project
synapse init my-awesome-app
cd my-awesome-app

# Install dependencies
npm install
```

### **Manual Installation**

```bash
# Clone the repository
git clone https://github.com/synapse-framework/synapse.git
cd synapse

# Install dependencies
npm install

# Build the framework
make build

# Install globally
make install
```

## 🎯 **Quick Start**

### **1. Create Your First Project**

```bash
# Initialize a new Synapse project
synapse init my-first-app
cd my-first-app
```

### **2. Start Development Server**

```bash
# Start the development server
synapse dev

# Or using npm
npm run dev
```

### **3. Build for Production**

```bash
# Build the project
synapse build

# Or using npm
npm run build
```

### **4. Run Tests**

```bash
# Run all tests
synapse test

# Or using npm
npm test
```

## 🧠 **Intelligent Rule System**

Synapse includes an **intelligent rule system** that automatically monitors and enforces best practices:

### **Rule Categories**
- 🔒 **Security** - 100+ security rules with real-time CVE monitoring
- ⚡ **Performance** - 80+ performance optimization rules
- 🎨 **Code Quality** - 120+ code quality and style rules
- ♿ **Accessibility** - 60+ accessibility compliance rules
- 🌐 **Compatibility** - 80+ cross-platform compatibility rules
- 🧪 **Testing** - 60+ testing and coverage rules

### **Using the Rule System**

```bash
# Check your codebase for rule violations
synapse rules check

# Auto-fix violations where possible
synapse rules check --fix

# Update rules from all sources
synapse rules update

# Watch mode for continuous monitoring
synapse rules watch
```

## 🦀 **Rust-Powered Packages**

Synapse includes several **high-performance Rust packages**:

### **@snps/rule-engine-rust**
Intelligent rule engine with 50x performance improvements:

```typescript
import { RuleEngine } from '@snps/rule-engine-rust';

const engine = new RuleEngine();
const result = await engine.checkFile('src/app.ts');
console.log(`Found ${result.summary.total_violations} violations`);
```

### **@snps/http-client-rust**
10x faster HTTP client:

```typescript
import { HttpClient } from '@snps/http-client-rust';

const client = new HttpClient('https://api.example.com');
const response = await client.get('/users');
console.log(response.data);
```

### **@snps/env-parser-rust**
10x faster environment parsing:

```typescript
import { EnvParser } from '@snps/env-parser-rust';

const parser = new EnvParser();
await parser.loadFromFile('.env');
const port = parser.getNumber('PORT', 3000);
```

### **@snps/commit-lint-rust**
20x faster commit linting:

```typescript
import { CommitLinter } from '@snps/commit-lint-rust';

const linter = new CommitLinter();
const result = await linter.lint('feat: add new feature');
console.log(result.valid);
```

## 🏗️ **Project Structure**

A typical Synapse project looks like this:

```
my-awesome-app/
├── src/
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── api/                # API routes
│   ├── utils/              # Utility functions
│   └── styles/             # CSS/SCSS files
├── tests/                  # Test files
├── public/                 # Static assets
├── .env                    # Environment variables
├── rules.config.json       # Rule configuration
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
└── synapse.config.js       # Synapse configuration
```

## ⚙️ **Configuration**

### **Synapse Configuration (synapse.config.js)**

```javascript
export default {
  // Build configuration
  build: {
    target: 'es2022',
    minify: true,
    sourcemap: true
  },
  
  // Development configuration
  dev: {
    port: 3000,
    host: 'localhost',
    open: true
  },
  
  // Rule system configuration
  rules: {
    enabled: true,
    autoFix: true,
    failOnCritical: true
  },
  
  // Testing configuration
  testing: {
    framework: 'vitest',
    coverage: {
      threshold: 90
    }
  }
};
```

### **Rule Configuration (rules.config.json)**

```json
{
  "version": "1.0.0",
  "monitors": {
    "security": {
      "enabled": true,
      "updateInterval": 60,
      "dataSources": ["github-advisories", "cve-database"],
      "rules": ["SEC-001", "SEC-002", "SEC-003"]
    },
    "performance": {
      "enabled": true,
      "updateInterval": 120,
      "dataSources": ["lighthouse", "bundle-analyzer"],
      "rules": ["PERF-001", "PERF-002", "PERF-003"]
    }
  },
  "global": {
    "autoFix": true,
    "failOnCritical": true,
    "failOnHigh": true
  }
}
```

## 🧪 **Testing**

Synapse enforces **Test-Driven Development (TDD)**:

### **Writing Tests**

```typescript
// tests/components/Button.test.ts
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../src/components/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### **Running Tests**

```bash
# Run all tests
synapse test

# Run tests in watch mode
synapse test --watch

# Run tests with coverage
synapse test --coverage
```

## 🚀 **Deployment**

### **Build for Production**

```bash
# Build the project
synapse build

# The build output will be in the 'dist' directory
```

### **Deploy to Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### **Deploy to Netlify**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

## 🔧 **Development Workflow**

### **1. Start Development**

```bash
# Start development server
synapse dev
```

### **2. Write Code with TDD**

```bash
# Write a test first
synapse test --watch

# Write the implementation
# Test will automatically re-run
```

### **3. Check Rules**

```bash
# Check for rule violations
synapse rules check

# Auto-fix violations
synapse rules check --fix
```

### **4. Commit Changes**

```bash
# Lint commit message
synapse commit "feat: add new feature"

# Or manually
git add .
git commit -m "feat: add new feature"
```

## 📚 **Learning Resources**

### **Documentation**
- [Main Documentation](https://synapse.dev/docs)
- [API Reference](https://synapse.dev/api)
- [Rule System Guide](https://synapse.dev/rules)
- [Migration Guide](https://synapse.dev/migration)

### **Examples**
- [Basic App](https://github.com/synapse-framework/examples/tree/main/basic-app)
- [Full-Stack App](https://github.com/synapse-framework/examples/tree/main/fullstack-app)
- [API Server](https://github.com/synapse-framework/examples/tree/main/api-server)

### **Community**
- [Discord Server](https://discord.gg/synapse)
- [GitHub Discussions](https://github.com/synapse-framework/synapse/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/synapse-framework)

## 🆘 **Troubleshooting**

### **Common Issues**

#### **Build Errors**
```bash
# Clear build cache
synapse clean

# Rebuild
synapse build
```

#### **Rule Violations**
```bash
# Check specific rules
synapse rules check --rules security,performance

# Auto-fix violations
synapse rules check --fix
```

#### **Test Failures**
```bash
# Run tests with verbose output
synapse test --verbose

# Run specific test file
synapse test tests/components/Button.test.ts
```

### **Getting Help**

1. **Check the documentation** - Most issues are covered in the docs
2. **Search GitHub issues** - Look for similar issues
3. **Ask on Discord** - Get help from the community
4. **Create an issue** - Report bugs or request features

## 🎉 **Next Steps**

Now that you have Synapse set up, here's what you can do next:

1. **Explore the examples** - Check out the example projects
2. **Read the documentation** - Learn about all the features
3. **Join the community** - Connect with other developers
4. **Contribute** - Help improve Synapse
5. **Build something amazing** - Create your next project with Synapse!

## 🔗 **Related Links**

- [GitHub Repository](https://github.com/synapse-framework/synapse)
- [NPM Packages](https://www.npmjs.com/org/snps)
- [Documentation](https://synapse.dev)
- [Discord Community](https://discord.gg/synapse)
- [Twitter](https://twitter.com/synapse_framework)

---

**Welcome to the future of web development with Synapse Framework!** 🚀✨

*Built with ❤️ by the Synapse Framework Team*