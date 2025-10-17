# GitHub Secrets Configuration Guide

This document provides a comprehensive guide for configuring the required GitHub secrets for the Synapse Framework CI/CD pipelines.

## Overview

The Synapse Framework uses GitHub Actions for CI/CD, which requires several secrets to be configured in the repository settings. These secrets enable automated testing, building, publishing, and deployment.

## Required Secrets

### Critical Secrets (Required for Core Functionality)

#### 1. NPM_TOKEN
**Purpose**: Publishing packages to NPM registry
**Priority**: 🔴 Critical
**Used in**: `publish.yml`, `release.yml`

**Setup Instructions**:
1. Go to [NPM Account Settings](https://www.npmjs.com/settings/tokens)
2. Click "Generate New Token"
3. Select "Automation" token type
4. Copy the token
5. In GitHub repository settings, go to "Secrets and variables" → "Actions"
6. Click "New repository secret"
7. Name: `NPM_TOKEN`
8. Value: Paste the NPM token

#### 2. SNYK_TOKEN
**Purpose**: Security vulnerability scanning
**Priority**: 🔴 Critical
**Used in**: `ci.yml`, `security.yml`

**Setup Instructions**:
1. Go to [Snyk.io](https://snyk.io) and create an account
2. Navigate to "Account Settings" → "General" → "API Token"
3. Click "Generate Token"
4. Copy the token
5. In GitHub repository settings, add secret:
   - Name: `SNYK_TOKEN`
   - Value: Paste the Snyk token

### Optional Secrets (Enhancement Features)

#### 3. DOCKER_USERNAME
**Purpose**: Docker image publishing
**Priority**: 🟡 Optional
**Used in**: `release.yml`

**Setup Instructions**:
1. Create a [Docker Hub](https://hub.docker.com) account
2. In GitHub repository settings, add secret:
   - Name: `DOCKER_USERNAME`
   - Value: Your Docker Hub username

#### 4. DOCKER_PASSWORD
**Purpose**: Docker image publishing authentication
**Priority**: 🟡 Optional
**Used in**: `release.yml`

**Setup Instructions**:
1. In Docker Hub, go to "Account Settings" → "Security"
2. Create a new "Access Token"
3. In GitHub repository settings, add secret:
   - Name: `DOCKER_PASSWORD`
   - Value: The Docker access token (not your password)

#### 5. DISCORD_WEBHOOK
**Purpose**: Discord notifications for releases and deployments
**Priority**: 🟡 Optional
**Used in**: `ci.yml`, `release.yml`

**Setup Instructions**:
1. In your Discord server, go to "Server Settings" → "Integrations" → "Webhooks"
2. Click "Create Webhook"
3. Copy the webhook URL
4. In GitHub repository settings, add secret:
   - Name: `DISCORD_WEBHOOK`
   - Value: The Discord webhook URL

#### 6. TWITTER_API_KEY
**Purpose**: Twitter notifications for releases
**Priority**: 🟡 Optional
**Used in**: `release.yml`

**Setup Instructions**:
1. Go to [Twitter Developer Portal](https://developer.twitter.com)
2. Create a new app
3. Generate API keys
4. In GitHub repository settings, add secret:
   - Name: `TWITTER_API_KEY`
   - Value: Your Twitter API key

#### 7. TWITTER_API_SECRET
**Purpose**: Twitter API authentication
**Priority**: 🟡 Optional
**Used in**: `release.yml`

**Setup Instructions**:
1. From the same Twitter app created above
2. In GitHub repository settings, add secret:
   - Name: `TWITTER_API_SECRET`
   - Value: Your Twitter API secret

#### 8. TWITTER_ACCESS_TOKEN
**Purpose**: Twitter API access
**Priority**: 🟡 Optional
**Used in**: `release.yml`

**Setup Instructions**:
1. From the same Twitter app
2. Generate access tokens
3. In GitHub repository settings, add secret:
   - Name: `TWITTER_ACCESS_TOKEN`
   - Value: Your Twitter access token

#### 9. TWITTER_ACCESS_TOKEN_SECRET
**Purpose**: Twitter API access authentication
**Priority**: 🟡 Optional
**Used in**: `release.yml`

**Setup Instructions**:
1. From the same Twitter app
2. In GitHub repository settings, add secret:
   - Name: `TWITTER_ACCESS_TOKEN_SECRET`
   - Value: Your Twitter access token secret

## Secret Priority Matrix

| Secret | Impact if Missing | Workflow Status |
|--------|------------------|-----------------|
| NPM_TOKEN | ❌ Cannot publish packages | Fails |
| SNYK_TOKEN | ⚠️ Security scans skipped | Partial |
| DOCKER_USERNAME | ⚠️ Docker publishing skipped | Partial |
| DOCKER_PASSWORD | ⚠️ Docker publishing skipped | Partial |
| DISCORD_WEBHOOK | ✅ No Discord notifications | Success |
| TWITTER_* | ✅ No Twitter notifications | Success |

## Quick Setup (Minimum Required)

For basic functionality, configure only these secrets:
1. `NPM_TOKEN`
2. `SNYK_TOKEN`

## Full Setup (All Features)

For complete functionality including notifications and Docker publishing:
1. Configure all secrets listed above
2. Test each integration individually
3. Verify notifications work as expected

## Verification

After configuring secrets, you can verify they work by:

1. **NPM_TOKEN**: Check if `publish.yml` workflow succeeds
2. **SNYK_TOKEN**: Check if security scans run in `ci.yml`
3. **Docker**: Check if `release.yml` publishes Docker images
4. **Discord**: Check if notifications appear in Discord
5. **Twitter**: Check if tweets are posted on releases

## Troubleshooting

### Common Issues

1. **Invalid NPM Token**: Ensure token has "Automation" type
2. **Snyk Scan Fails**: Verify token has proper permissions
3. **Docker Push Fails**: Use access token, not password
4. **Discord Notifications Missing**: Check webhook URL format
5. **Twitter API Errors**: Verify all 4 Twitter secrets are set

### Testing Secrets

You can test individual secrets by creating a simple workflow:

```yaml
name: Test Secrets
on: workflow_dispatch
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Test NPM Token
        run: echo "NPM_TOKEN is set: ${{ secrets.NPM_TOKEN != '' }}"
      - name: Test Snyk Token
        run: echo "SNYK_TOKEN is set: ${{ secrets.SNYK_TOKEN != '' }}"
```

## Security Best Practices

1. **Never commit secrets to code**
2. **Use least-privilege tokens**
3. **Rotate tokens regularly**
4. **Monitor token usage**
5. **Use organization secrets for shared repositories**

## Maintenance Schedule

- **Monthly**: Review token permissions
- **Quarterly**: Rotate NPM and Snyk tokens
- **Annually**: Review all secret configurations

## Checklist

- [ ] NPM_TOKEN configured
- [ ] SNYK_TOKEN configured
- [ ] DOCKER_USERNAME configured (optional)
- [ ] DOCKER_PASSWORD configured (optional)
- [ ] DISCORD_WEBHOOK configured (optional)
- [ ] TWITTER_API_KEY configured (optional)
- [ ] TWITTER_API_SECRET configured (optional)
- [ ] TWITTER_ACCESS_TOKEN configured (optional)
- [ ] TWITTER_ACCESS_TOKEN_SECRET configured (optional)
- [ ] All workflows tested
- [ ] Notifications verified
- [ ] Security scans running
- [ ] Package publishing working

## Support

If you encounter issues with secret configuration:

1. Check the [GitHub Actions documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
2. Review the [NPM token documentation](https://docs.npmjs.com/creating-and-viewing-access-tokens)
3. Check the [Snyk documentation](https://docs.snyk.io/integrations/ci-cd-integrations/github-actions-integration)
4. Open an issue in this repository

---

**Last Updated**: October 16, 2025
**Maintained by**: Synapse Framework Team