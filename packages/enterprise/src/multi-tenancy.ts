/**
 * Multi-tenancy Support
 */

export interface Tenant {
  readonly id: string;
  readonly name: string;
  readonly domain: string;
  readonly config: TenantConfig;
  readonly createdAt: number;
  readonly status: 'active' | 'suspended' | 'inactive';
}

export interface TenantConfig {
  readonly maxUsers: number;
  readonly features: string[];
  readonly customBranding?: boolean;
  readonly storage: {
    readonly used: number;
    readonly limit: number;
  };
}

export class MultiTenancy {
  private readonly tenants: Map<string, Tenant> = new Map();

  public createTenant(name: string, domain: string, config: TenantConfig): Tenant {
    const tenant: Tenant = {
      id: `tenant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      domain,
      config,
      createdAt: Date.now(),
      status: 'active'
    };

    this.tenants.set(tenant.id, tenant);
    console.log(`🏢 Created tenant: ${name}`);
    return tenant;
  }

  public getTenant(id: string): Tenant | undefined {
    return this.tenants.get(id);
  }

  public getAllTenants(): Tenant[] {
    return Array.from(this.tenants.values());
  }

  public updateTenant(id: string, updates: Partial<Tenant>): Tenant | undefined {
    const tenant = this.tenants.get(id);
    if (!tenant) {
      return undefined;
    }

    const updated = { ...tenant, ...updates };
    this.tenants.set(id, updated);
    return updated;
  }

  public deleteTenant(id: string): boolean {
    return this.tenants.delete(id);
  }
}
