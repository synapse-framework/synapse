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
export { SSOProvider, SAMLProvider, OAuth2Provider, OIDCProvider, LDAPProvider, type SSOConfig, type SSOType, type SSOUser, type SAMLConfig, type OAuth2Config, type OIDCConfig, type LDAPConfig, type AnySSOConfig, type SSOSession, type SSOAuthResult } from './sso.js';
export { AuditLogger, type AuditLog, type AuditAction, type AuditSeverity, type AuditCategory, type AuditChange, type AuditQuery, type AuditStatistics, type AuditReport, type StorageBackend, type StorageConfig, type FileStorageConfig, type DatabaseStorageConfig, type CloudStorageConfig, type AnyStorageConfig } from './audit.js';
export { ComplianceManager, GDPRComplianceManager, HIPAAComplianceManager, SOC2ComplianceManager, DataRetentionManager, type ComplianceStandard, type ComplianceStatus, type ComplianceReport, type ComplianceCheck, type DataPrivacyControl, type DataRetentionPolicy, type ConsentRecord, type DataSubjectRequest, type GDPRComplianceConfig, type HIPAAComplianceConfig, type SOC2ComplianceConfig } from './compliance.js';
export { MultiTenancy, type Tenant, type TenantConfig } from './multi-tenancy.js';
export { RBACManager, type Role, type Permission } from './rbac.js';
export { RateLimiter, type RateLimitConfig } from './rate-limiter.js';
export { SynapseEnterprise } from './enterprise.js';
//# sourceMappingURL=index.d.ts.map