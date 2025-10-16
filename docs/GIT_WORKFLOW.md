# Git Workflow & Conventions

This document outlines the Git workflow and conventions used in the Synapse project.

## Branching Strategy (GitFlow)

We use the GitFlow branching model with the following branches:

### Main Branches

- **`main`**: Production-ready code. Always deployable.
- **`develop`**: Integration branch for features. Latest development changes.

### Supporting Branches

- **`feature/*`**: New features being developed
  - Naming: `feature/description` (e.g., `feature/user-authentication`)
  - Branch from: `develop`
  - Merge to: `develop`

- **`release/*`**: Preparing new production releases
  - Naming: `release/version` (e.g., `release/1.2.0`)
  - Branch from: `develop`
  - Merge to: `main` and `develop`

- **`hotfix/*`**: Critical fixes for production
  - Naming: `hotfix/description` (e.g., `hotfix/security-patch`)
  - Branch from: `main`
  - Merge to: `main` and `develop`

## Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes to the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Examples
```bash
feat(auth): add OAuth2 authentication
fix(api): resolve memory leak in request handler
docs(readme): update installation instructions
refactor(compiler): simplify AST transformation logic
perf(bundler): optimize tree-shaking algorithm
test(router): add unit tests for route matching
build(deps): update TypeScript to v5.0
ci(github): add security scanning workflow
chore(release): bump version to 1.2.0
```

## Workflow Process

### 1. Feature Development

```bash
# Start a new feature
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Work on your feature, make commits
git add .
git commit -m "feat(scope): your commit message"

# Push feature branch
git push origin feature/your-feature-name

# Create Pull Request to develop
```

### 2. Release Process

```bash
# Start a new release
git checkout develop
git pull origin develop
git checkout -b release/1.2.0

# Update version numbers, changelog, etc.
git add .
git commit -m "chore(release): prepare release 1.2.0"

# Push release branch
git push origin release/1.2.0

# Create Pull Request to main
# After merge, tag the release
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin v1.2.0
```

### 3. Hotfix Process

```bash
# Start a hotfix
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-fix

# Fix the issue
git add .
git commit -m "fix(scope): critical bug fix"

# Push hotfix branch
git push origin hotfix/critical-bug-fix

# Create Pull Request to main
# After merge, merge back to develop
```

## Branch Protection Rules

### Main Branch
- Require pull request reviews (2 reviewers)
- Require status checks to pass
- Require branches to be up to date
- Restrict pushes to main
- Require linear history

### Develop Branch
- Require pull request reviews (1 reviewer)
- Require status checks to pass
- Require branches to be up to date

## Code Review Guidelines

1. **Review Checklist**:
   - [ ] Code follows project conventions
   - [ ] Tests are included and passing
   - [ ] Documentation is updated
   - [ ] No breaking changes (or properly documented)
   - [ ] Security considerations addressed

2. **Review Process**:
   - At least one approval required for develop
   - At least two approvals required for main
   - All CI checks must pass
   - No merge conflicts

## Commit Message Guidelines

1. **Use imperative mood**: "add feature" not "added feature"
2. **Keep first line under 50 characters**
3. **Capitalize first letter**: "Add feature" not "add feature"
4. **No period at the end of the subject line**
5. **Use body to explain what and why, not how**
6. **Reference issues**: "Fixes #123" or "Closes #456"

## Tools and Automation

- **Commitizen**: Interactive commit message generation
- **Commitlint**: Lint commit messages
- **Husky**: Git hooks for automation
- **GitHub Actions**: CI/CD pipeline
- **Dependabot**: Automated dependency updates
- **CodeQL**: Security analysis

## Getting Started

1. Install required tools:
   ```bash
   npm install -g commitizen
   npm install --save-dev @commitlint/cli @commitlint/config-conventional husky
   ```

2. Configure commitizen:
   ```bash
   npx commitizen init cz-conventional-changelog --save-dev --save-exact
   ```

3. Use commitizen for commits:
   ```bash
   git cz
   ```

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitFlow Documentation](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)