/**
 * Main Enterprise System
 */
import { SSOProvider } from './sso.js';
import { AuditLogger } from './audit.js';
import { ComplianceManager } from './compliance.js';
import { MultiTenancy } from './multi-tenancy.js';
import { RBACManager } from './rbac.js';
import { RateLimiter } from './rate-limiter.js';
export class SynapseEnterprise {
    config;
    sso;
    audit;
    compliance;
    multiTenancy;
    rbac;
    rateLimiter;
    constructor(config = {}) {
        this.config = {
            enableAudit: true,
            enableCompliance: true,
            enableMultiTenancy: true,
            enableRBAC: true,
            enableRateLimiting: true,
            ...config
        };
        if (this.config.sso) {
            this.sso = new SSOProvider(this.config.sso);
        }
        this.audit = new AuditLogger();
        this.compliance = new ComplianceManager();
        this.multiTenancy = new MultiTenancy();
        this.rbac = new RBACManager();
        this.rateLimiter = new RateLimiter({
            windowMs: 60000,
            maxRequests: 100
        });
    }
    getSSO() {
        return this.sso;
    }
    getAudit() {
        return this.audit;
    }
    getCompliance() {
        return this.compliance;
    }
    getMultiTenancy() {
        return this.multiTenancy;
    }
    getRBAC() {
        return this.rbac;
    }
    getRateLimiter() {
        return this.rateLimiter;
    }
}
//# sourceMappingURL=enterprise.js.map