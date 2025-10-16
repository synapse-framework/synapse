# Contributing to Synapse Framework

Thank you for your interest in contributing to Synapse! We welcome contributions from everyone.

## 🚀 Quick Start

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/synapse.git`
3. Create a branch: `git checkout -b feature/amazing-feature`
4. Make your changes
5. Test your changes: `make test`
6. Commit: `git commit -m 'Add amazing feature'`
7. Push: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 📋 Development Setup

### Prerequisites
- Node.js 18+
- Rust 1.70+
- Git

### Setup Steps
```bash
# Clone the repository
git clone https://github.com/synapse-framework/synapse.git
cd synapse

# Setup development environment
make setup

# Build the framework
make build

# Run tests
make test
```

## 🏗️ Project Structure

- `rust-compiler/` - Rust-based TypeScript compiler
- `src/` - TypeScript source code
- `packages/` - Monorepo packages
- `scripts/` - Build scripts
- `tests/` - Test files
- `.github/` - GitHub workflows and templates

## 🧪 Testing

All contributions must include tests.

```bash
# Run all tests
make test

# Run specific test
node test-simple.js
node test-core-components.js
```

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:
```
feat: add database migration support
fix: resolve TypeScript compilation error
docs: update installation instructions
```

## 🎯 Code Style

- Follow TypeScript strict mode
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused
- Write self-documenting code

### TypeScript
- Explicit types required
- No `any` types
- Use `const` over `let`
- Explicit return types for functions

### Rust
- Follow Rust standard style
- Run `cargo fmt` before committing
- Run `cargo clippy` to catch issues

## 🐛 Reporting Bugs

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) and include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots if applicable

## 💡 Suggesting Features

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md) and include:
- Clear description
- Problem it solves
- Proposed solution
- Alternative solutions considered

## 🔍 Code Review Process

1. All PRs require at least one approval
2. All tests must pass
3. Code must follow style guidelines
4. Documentation must be updated
5. TODO.md should be updated if applicable

## 📚 Documentation

- Update README.md for user-facing changes
- Update CLAUDE.md for developer guidance
- Add JSDoc comments for public APIs
- Update TODO.md for tracking progress

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🤝 Code of Conduct

### Our Pledge
We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Enforcement
Violations can be reported to the project maintainers. All complaints will be reviewed and investigated promptly and fairly.

## 💬 Getting Help

- 📖 Read the [documentation](docs/)
- 💬 Ask in [GitHub Discussions](https://github.com/synapse-framework/synapse/discussions)
- 🐛 Report bugs in [Issues](https://github.com/synapse-framework/synapse/issues)
- 📧 Email: team@synapse.dev (if available)

## 🎉 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation
- Part of the Synapse community!

---

**Thank you for contributing to Synapse Framework!** 🚀
