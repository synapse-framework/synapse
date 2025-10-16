# @snps/enterprise

Enterprise features for Synapse Framework including SSO, audit logging, and compliance tools.

## Features

- **Single Sign-On (SSO)** - SAML, OAuth2, OIDC, and LDAP authentication
- **Audit Logging** - Comprehensive audit trail with multiple storage backends
- **Compliance** - GDPR, HIPAA, SOC2 compliance tools with automated checks
- **Data Retention** - Configurable data retention policies
- **Data Privacy** - Right-to-erasure, right-to-portability, consent management
- **Multi-tenancy** - Organization and tenant management
- **RBAC** - Role-based access control
- **Rate Limiting** - API rate limiting and throttling

## Installation

```bash
npm install @snps/enterprise
```

## Usage

### Single Sign-On (SSO)

#### SAML Authentication

```typescript
import { SAMLProvider } from '@snps/enterprise';

const samlProvider = new SAMLProvider({
  type: 'saml',
  provider: 'okta',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  redirectUri: 'https://yourapp.com/auth/callback',
  entryPoint: 'https://yourorg.okta.com/app/appid/sso/saml',
  issuer: 'https://yourapp.com',
  cert: 'YOUR_SAML_CERT'
});

// Get login URL
const loginUrl = samlProvider.getLoginUrl('optional-relay-state');

// Authenticate with SAML response
const result = await samlProvider.authenticate(samlResponse);
if (result.success) {
  console.log('User authenticated:', result.user);
  console.log('Session:', result.session);
}
```

#### OAuth2 Authentication

```typescript
import { OAuth2Provider } from '@snps/enterprise';

const oauth2Provider = new OAuth2Provider({
  type: 'oauth2',
  provider: 'github',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  redirectUri: 'https://yourapp.com/auth/callback',
  authorizationUrl: 'https://github.com/login/oauth/authorize',
  tokenUrl: 'https://github.com/login/oauth/access_token',
  userInfoUrl: 'https://api.github.com/user',
  scopes: ['user', 'repo']
});

// Get authorization URL
const authUrl = oauth2Provider.getAuthorizationUrl();

// Exchange code for token
const result = await oauth2Provider.authenticate(code);
```

#### OIDC Authentication

```typescript
import { OIDCProvider } from '@snps/enterprise';

const oidcProvider = new OIDCProvider({
  type: 'oidc',
  provider: 'auth0',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  redirectUri: 'https://yourapp.com/auth/callback',
  discoveryUrl: 'https://yourorg.auth0.com/.well-known/openid-configuration',
  issuer: 'https://yourorg.auth0.com',
  scopes: ['openid', 'profile', 'email']
});

// Get authorization URL
const authUrl = await oidcProvider.getAuthorizationUrl();

// Verify ID token
const result = await oidcProvider.authenticate(idToken);
```

#### LDAP Authentication

```typescript
import { LDAPProvider } from '@snps/enterprise';

const ldapProvider = new LDAPProvider({
  type: 'ldap',
  provider: 'active-directory',
  clientId: 'not-used',
  clientSecret: 'not-used',
  redirectUri: 'not-used',
  host: 'ldap.example.com',
  port: 389,
  baseDN: 'dc=example,dc=com',
  bindDN: 'cn=admin,dc=example,dc=com',
  bindPassword: 'admin-password',
  searchFilter: '(uid={username})',
  useTLS: true
});

// Authenticate user
const result = await ldapProvider.authenticate('username', 'password');
```

#### Unified SSO Provider

```typescript
import { SSOProvider } from '@snps/enterprise';

// Automatically uses the correct provider based on type
const ssoProvider = new SSOProvider({
  type: 'oidc',
  provider: 'auth0',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  redirectUri: 'https://yourapp.com/auth/callback',
  discoveryUrl: 'https://yourorg.auth0.com/.well-known/openid-configuration',
  issuer: 'https://yourorg.auth0.com'
});

const authUrl = await ssoProvider.getAuthUrl();
const result = await ssoProvider.authenticate(token);
```

### Audit Logging

#### Memory Storage (Development)

```typescript
import { AuditLogger } from '@snps/enterprise';

const auditLogger = new AuditLogger({
  backend: 'memory'
});

// Log an audit event
await auditLogger.log({
  userId: 'user-123',
  userName: 'John Doe',
  action: 'login',
  resource: '/api/auth',
  category: 'authentication',
  severity: 'low',
  success: true,
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...'
});
```

#### File Storage (Production)

```typescript
const auditLogger = new AuditLogger({
  backend: 'file',
  options: {
    directory: '/var/log/audit',
    rotateDaily: true,
    compress: true
  }
});
```

#### Database Storage

```typescript
const auditLogger = new AuditLogger({
  backend: 'database',
  options: {
    connectionString: 'postgresql://user:pass@localhost:5432/audit',
    table: 'audit_logs',
    batchSize: 100
  }
});
```

#### Cloud Storage

```typescript
const auditLogger = new AuditLogger({
  backend: 'cloud',
  options: {
    provider: 'aws',
    bucket: 'my-audit-logs',
    region: 'us-east-1',
    credentials: {
      accessKeyId: 'YOUR_ACCESS_KEY',
      secretAccessKey: 'YOUR_SECRET_KEY'
    }
  }
});
```

#### Querying Audit Logs

```typescript
// Query all logs
const allLogs = await auditLogger.query();

// Query by user
const userLogs = await auditLogger.query({
  userId: 'user-123'
});

// Query by action and time range
const recentLogins = await auditLogger.query({
  action: 'login',
  startTime: Date.now() - 24 * 60 * 60 * 1000, // Last 24 hours
  endTime: Date.now()
});

// Query with pagination
const paginatedLogs = await auditLogger.query({
  category: 'security',
  severity: 'critical',
  limit: 50,
  offset: 0
});
```

#### Generating Audit Reports

```typescript
// Generate statistics
const stats = await auditLogger.getStatistics({
  startTime: Date.now() - 30 * 24 * 60 * 60 * 1000 // Last 30 days
});

console.log('Total logs:', stats.totalLogs);
console.log('By action:', stats.byAction);
console.log('By category:', stats.byCategory);
console.log('By severity:', stats.bySeverity);

// Generate comprehensive report
const report = await auditLogger.generateReport({
  startTime: Date.now() - 7 * 24 * 60 * 60 * 1000 // Last 7 days
});

console.log(report.summary);

// Export logs
const jsonExport = await auditLogger.export('json');
const csvExport = await auditLogger.export('csv');
```

### Compliance

#### GDPR Compliance

```typescript
import { ComplianceManager } from '@snps/enterprise';

const complianceManager = new ComplianceManager({
  gdpr: {
    dataProtectionOfficer: 'dpo@example.com',
    privacyPolicyUrl: 'https://example.com/privacy',
    consentRequired: true,
    rightToErasure: true,
    rightToPortability: true,
    dataBreachNotification: true,
    dataMinimization: true
  }
});

// Perform GDPR audit
const gdprReport = await complianceManager.performAudit('GDPR');
console.log('GDPR Status:', gdprReport.status);
console.log('Score:', gdprReport.score);
console.log('Checks:', gdprReport.checks);
console.log('Recommendations:', gdprReport.recommendations);

// Record user consent
const gdprManager = complianceManager.getGDPRManager();
if (gdprManager) {
  const consent = gdprManager.recordConsent(
    'user-123',
    'marketing',
    true,
    'v1.0'
  );

  // Get user consents
  const consents = gdprManager.getConsents('user-123');

  // Handle data subject request (right-to-erasure)
  const request = await gdprManager.handleDataSubjectRequest(
    'user-123',
    'erasure'
  );

  // Handle data portability request
  const portabilityRequest = await gdprManager.handleDataSubjectRequest(
    'user-123',
    'portability'
  );
}
```

#### HIPAA Compliance

```typescript
const complianceManager = new ComplianceManager({
  hipaa: {
    securityOfficer: 'security@example.com',
    privacyOfficer: 'privacy@example.com',
    phiEncryption: true,
    accessControls: true,
    auditControls: true,
    integrityControls: true,
    transmissionSecurity: true
  }
});

// Perform HIPAA audit
const hipaaReport = await complianceManager.performAudit('HIPAA');

// Validate PHI access
const hipaaManager = complianceManager.getHIPAAManager();
if (hipaaManager) {
  const canAccess = hipaaManager.validatePHIAccess(
    'user-123',
    'patient-record-456',
    'read'
  );

  // Sanitize PHI
  const sanitized = await hipaaManager.sanitizePHI({
    name: 'John Doe',
    ssn: '123-45-6789',
    diagnosis: 'Condition XYZ'
  });
}
```

#### SOC2 Compliance

```typescript
const complianceManager = new ComplianceManager({
  soc2: {
    securityPrinciple: true,
    availabilityPrinciple: true,
    processingIntegrityPrinciple: true,
    confidentialityPrinciple: true,
    privacyPrinciple: true,
    controlDocumentation: true
  }
});

// Perform SOC2 audit
const soc2Report = await complianceManager.performAudit('SOC2');

// Generate control matrix
const soc2Manager = complianceManager.getSOC2Manager();
if (soc2Manager) {
  const controlMatrix = await soc2Manager.generateControlMatrix();
  console.log('Control Matrix:', controlMatrix);
}
```

#### Data Retention Policies

```typescript
const retentionManager = complianceManager.getRetentionManager();

// Add retention policy
retentionManager.addPolicy({
  id: 'user-data-policy',
  name: 'User Data Retention',
  dataType: 'user_profiles',
  retentionPeriod: 365, // days
  deletionMethod: 'anonymize',
  enabled: true
});

// Add another policy
retentionManager.addPolicy({
  id: 'log-policy',
  name: 'Log Retention',
  dataType: 'application_logs',
  retentionPeriod: 90, // days
  deletionMethod: 'hard',
  enabled: true
});

// Enforce retention policies
await retentionManager.enforceRetention();

// Delete specific data
await retentionManager.deleteData('data-id-123', 'anonymize');
```

## API Reference

### SSO Types

- `SSOType`: `'saml' | 'oauth2' | 'oidc' | 'ldap'`
- `SSOConfig`: Base configuration for SSO providers
- `SAMLConfig`: SAML-specific configuration
- `OAuth2Config`: OAuth2-specific configuration
- `OIDCConfig`: OIDC-specific configuration
- `LDAPConfig`: LDAP-specific configuration
- `SSOUser`: Authenticated user object
- `SSOSession`: User session object
- `SSOAuthResult`: Authentication result

### Audit Types

- `AuditAction`: Type of action being audited
- `AuditSeverity`: `'low' | 'medium' | 'high' | 'critical'`
- `AuditCategory`: Category of the audit event
- `AuditLog`: Complete audit log entry
- `AuditQuery`: Query parameters for filtering logs
- `AuditStatistics`: Statistical summary of audit logs
- `AuditReport`: Comprehensive audit report
- `StorageBackend`: `'memory' | 'file' | 'database' | 'cloud'`

### Compliance Types

- `ComplianceStandard`: `'GDPR' | 'HIPAA' | 'SOC2' | 'PCI-DSS' | 'ISO27001' | 'CCPA'`
- `ComplianceStatus`: `'compliant' | 'non-compliant' | 'partial' | 'pending'`
- `ComplianceReport`: Compliance audit report
- `ComplianceCheck`: Individual compliance check
- `DataRetentionPolicy`: Data retention policy configuration
- `ConsentRecord`: User consent record
- `DataSubjectRequest`: GDPR data subject request

## Best Practices

### Security

1. **Always use HTTPS** for SSO redirects and callbacks
2. **Store credentials securely** using environment variables or secret management
3. **Enable audit logging** for all authentication and authorization events
4. **Implement rate limiting** on authentication endpoints
5. **Use strong encryption** for sensitive data (AES-256)

### Compliance

1. **Regular audits** - Run compliance checks at least quarterly
2. **Document everything** - Maintain documentation for all controls
3. **Data minimization** - Only collect necessary data
4. **Consent management** - Always obtain explicit user consent
5. **Incident response** - Have a 72-hour breach notification process

### Audit Logging

1. **Log all security events** - Authentication, authorization, access
2. **Include context** - IP address, user agent, session ID
3. **Use appropriate severity** - Critical for security events
4. **Regular review** - Review audit logs regularly
5. **Retention policies** - Follow legal requirements for log retention

## License

MIT

## Support

For issues and questions, please visit:
https://github.com/synapse-framework/synapse/issues

## Contributing

Contributions are welcome! Please read the contributing guidelines in the main repository.
