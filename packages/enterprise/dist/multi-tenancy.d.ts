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
export declare class MultiTenancy {
    private readonly tenants;
    createTenant(name: string, domain: string, config: TenantConfig): Tenant;
    getTenant(id: string): Tenant | undefined;
    getAllTenants(): Tenant[];
    updateTenant(id: string, updates: Partial<Tenant>): Tenant | undefined;
    deleteTenant(id: string): boolean;
}
//# sourceMappingURL=multi-tenancy.d.ts.map