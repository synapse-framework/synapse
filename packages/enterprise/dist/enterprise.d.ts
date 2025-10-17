/**
 * Main Enterprise System
 */
import { SSOProvider, type AnySSOConfig } from './sso.js';
import { AuditLogger } from './audit.js';
import { ComplianceManager } from './compliance.js';
import { MultiTenancy } from './multi-tenancy.js';
import { RBACManager } from './rbac.js';
import { RateLimiter } from './rate-limiter.js';
export interface EnterpriseConfig {
    readonly sso?: AnySSOConfig;
    readonly enableAudit: boolean;
    readonly enableCompliance: boolean;
    readonly enableMultiTenancy: boolean;
    readonly enableRBAC: boolean;
    readonly enableRateLimiting: boolean;
}
export declare class SynapseEnterprise {
    private readonly config;
    private readonly sso?;
    private readonly audit;
    private readonly compliance;
    private readonly multiTenancy;
    private readonly rbac;
    private readonly rateLimiter;
    constructor(config?: Partial<EnterpriseConfig>);
    getSSO(): SSOProvider | undefined;
    getAudit(): AuditLogger;
    getCompliance(): ComplianceManager;
    getMultiTenancy(): MultiTenancy;
    getRBAC(): RBACManager;
    getRateLimiter(): RateLimiter;
}
//# sourceMappingURL=enterprise.d.ts.map