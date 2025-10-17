/**
 * @snps/enterprise
 *
 * Enterprise features for Synapse Framework
 *
 * Features:
 * - Single Sign-On (SSO) - SAML, OAuth2, OIDC, LDAP
 * - Audit Logging - Comprehensive audit trail with multiple storage backends
 * - Compliance - GDPR, HIPAA, SOC2 with data privacy controls
 * - Multi-tenancy - Organization management
 * - Role-Based Access Control (RBAC)
 * - API Rate Limiting
 */
// SSO exports
export { SSOProvider, SAMLProvider, OAuth2Provider, OIDCProvider, LDAPProvider } from './sso.js';
// Audit logging exports
export { AuditLogger } from './audit.js';
// Compliance exports
export { ComplianceManager, GDPRComplianceManager, HIPAAComplianceManager, SOC2ComplianceManager, DataRetentionManager } from './compliance.js';
// Multi-tenancy exports
export { MultiTenancy } from './multi-tenancy.js';
// RBAC exports
export { RBACManager } from './rbac.js';
// Rate limiter exports
export { RateLimiter } from './rate-limiter.js';
// Re-export main enterprise class
export { SynapseEnterprise } from './enterprise.js';
//# sourceMappingURL=index.js.map