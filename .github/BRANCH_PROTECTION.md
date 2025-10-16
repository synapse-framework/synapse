# Branch Protection Rules

This document outlines the branch protection rules configured for the Synapse Framework repository.

## Main Branch (`main`)

### Protection Rules
- **Require pull request reviews before merging**
  - Required number of reviewers: 2
  - Dismiss stale reviews when new commits are pushed: Yes
  - Require review from code owners: Yes
  - Restrict pushes that create files larger than 100MB: Yes

- **Require status checks to pass before merging**
  - Require branches to be up to date before merging: Yes
  - Required status checks:
    - `ci/lint` - Linting and type checking
    - `ci/test` - Test suite execution
    - `ci/build` - Build verification
    - `ci/security` - Security scanning
    - `ci/performance` - Performance tests

- **Require conversation resolution before merging**
  - All conversations on code must be resolved: Yes

- **Restrict pushes that create files larger than 100MB**
  - Maximum file size: 100MB

- **Require linear history**
  - Require linear history: Yes
  - Allow force pushes: No
  - Allow deletions: No

- **Restrict pushes to matching branches**
  - Restrict pushes to matching branches: Yes
  - Allow force pushes: No
  - Allow deletions: No

### Required Reviewers
- `@synapse-framework/core-team` (2 required)
- `@synapse-framework/security-team` (1 required for security-related changes)
- `@synapse-framework/architecture-team` (1 required for architectural changes)

## Develop Branch (`develop`)

### Protection Rules
- **Require pull request reviews before merging**
  - Required number of reviewers: 1
  - Dismiss stale reviews when new commits are pushed: Yes
  - Require review from code owners: Yes

- **Require status checks to pass before merging**
  - Require branches to be up to date before merging: Yes
  - Required status checks:
    - `ci/lint` - Linting and type checking
    - `ci/test` - Test suite execution
    - `ci/build` - Build verification

- **Require conversation resolution before merging**
  - All conversations on code must be resolved: Yes

- **Allow force pushes**
  - Allow force pushes: No
  - Allow deletions: No

### Required Reviewers
- `@synapse-framework/core-team` (1 required)
- `@synapse-framework/community-team` (1 required for community contributions)

## Feature Branches (`feature/*`)

### Protection Rules
- **Require pull request reviews before merging**
  - Required number of reviewers: 1
  - Dismiss stale reviews when new commits are pushed: Yes
  - Require review from code owners: Yes

- **Require status checks to pass before merging**
  - Require branches to be up to date before merging: Yes
  - Required status checks:
    - `ci/lint` - Linting and type checking
    - `ci/test` - Test suite execution

- **Allow force pushes**
  - Allow force pushes: Yes (for rebasing)
  - Allow deletions: Yes

## Release Branches (`release/*`)

### Protection Rules
- **Require pull request reviews before merging**
  - Required number of reviewers: 2
  - Dismiss stale reviews when new commits are pushed: Yes
  - Require review from code owners: Yes

- **Require status checks to pass before merging**
  - Require branches to be up to date before merging: Yes
  - Required status checks:
    - `ci/lint` - Linting and type checking
    - `ci/test` - Test suite execution
    - `ci/build` - Build verification
    - `ci/security` - Security scanning
    - `ci/performance` - Performance tests

- **Require conversation resolution before merging**
  - All conversations on code must be resolved: Yes

- **Allow force pushes**
  - Allow force pushes: No
  - Allow deletions: No

### Required Reviewers
- `@synapse-framework/core-team` (2 required)
- `@synapse-framework/qa-team` (1 required)
- `@synapse-framework/security-team` (1 required)

## Hotfix Branches (`hotfix/*`)

### Protection Rules
- **Require pull request reviews before merging**
  - Required number of reviewers: 2
  - Dismiss stale reviews when new commits are pushed: Yes
  - Require review from code owners: Yes

- **Require status checks to pass before merging**
  - Require branches to be up to date before merging: Yes
  - Required status checks:
    - `ci/lint` - Linting and type checking
    - `ci/test` - Test suite execution
    - `ci/build` - Build verification
    - `ci/security` - Security scanning

- **Require conversation resolution before merging**
  - All conversations on code must be resolved: Yes

- **Allow force pushes**
  - Allow force pushes: No
  - Allow deletions: No

### Required Reviewers
- `@synapse-framework/core-team` (2 required)
- `@synapse-framework/security-team` (1 required)

## Security Branches (`security/*`)

### Protection Rules
- **Require pull request reviews before merging**
  - Required number of reviewers: 3
  - Dismiss stale reviews when new commits are pushed: Yes
  - Require review from code owners: Yes

- **Require status checks to pass before merging**
  - Require branches to be up to date before merging: Yes
  - Required status checks:
    - `ci/lint` - Linting and type checking
    - `ci/test` - Test suite execution
    - `ci/build` - Build verification
    - `ci/security` - Security scanning
    - `ci/security-audit` - Additional security audit

- **Require conversation resolution before merging**
  - All conversations on code must be resolved: Yes

- **Allow force pushes**
  - Allow force pushes: No
  - Allow deletions: No

### Required Reviewers
- `@synapse-framework/security-team` (2 required)
- `@synapse-framework/core-team` (1 required)

## Status Check Requirements

### Required for All Branches
- `ci/lint` - ESLint, Prettier, TypeScript type checking
- `ci/test` - Unit tests, integration tests, e2e tests
- `ci/build` - Build verification for all packages

### Required for Main/Release/Hotfix Branches
- `ci/security` - Security scanning (CodeQL, Snyk, OWASP ZAP)
- `ci/performance` - Performance tests and bundle size analysis
- `ci/coverage` - Code coverage requirements (minimum 80%)

### Required for Security Branches
- `ci/security-audit` - Additional security audit
- `ci/compliance` - Compliance checks (license, OWASP, etc.)

## Bypass Permissions

### Who Can Bypass
- `@synapse-framework/security-team` - For critical security fixes
- `@synapse-framework/core-team` - For emergency hotfixes
- `@synapse-framework/devops-team` - For infrastructure changes

### Bypass Conditions
- Critical security vulnerabilities
- Emergency hotfixes for production issues
- Infrastructure changes that don't affect code
- Documentation-only changes

## Enforcement

### Automatic Enforcement
- All protection rules are automatically enforced by GitHub
- No manual override without proper permissions
- All bypasses are logged and require justification

### Monitoring
- Weekly review of bypass usage
- Monthly security audit of branch protection effectiveness
- Quarterly review of protection rule effectiveness

## Exceptions

### Temporary Exceptions
- Can be granted by `@synapse-framework/security-team`
- Must be documented with reason and duration
- Must be reviewed within 48 hours

### Permanent Exceptions
- Require approval from `@synapse-framework/core-team`
- Must be documented in this file
- Must be reviewed quarterly

## Contact

For questions about branch protection rules:
- Email: security@synapse-framework.dev
- GitHub: @synapse-framework/security-team
- Discord: #security channel