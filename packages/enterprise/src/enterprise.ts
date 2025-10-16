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

export class SynapseEnterprise {
  private readonly config: EnterpriseConfig;
  private readonly sso?: SSOProvider;
  private readonly audit: AuditLogger;
  private readonly compliance: ComplianceManager;
  private readonly multiTenancy: MultiTenancy;
  private readonly rbac: RBACManager;
  private readonly rateLimiter: RateLimiter;

  public constructor(config: Partial<EnterpriseConfig> = {}) {
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

  public getSSO(): SSOProvider | undefined {
    return this.sso;
  }

  public getAudit(): AuditLogger {
    return this.audit;
  }

  public getCompliance(): ComplianceManager {
    return this.compliance;
  }

  public getMultiTenancy(): MultiTenancy {
    return this.multiTenancy;
  }

  public getRBAC(): RBACManager {
    return this.rbac;
  }

  public getRateLimiter(): RateLimiter {
    return this.rateLimiter;
  }
}
