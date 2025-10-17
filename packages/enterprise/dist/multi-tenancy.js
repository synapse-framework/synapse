/**
 * Multi-tenancy Support
 */
export class MultiTenancy {
    tenants = new Map();
    createTenant(name, domain, config) {
        const tenant = {
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
    getTenant(id) {
        return this.tenants.get(id);
    }
    getAllTenants() {
        return Array.from(this.tenants.values());
    }
    updateTenant(id, updates) {
        const tenant = this.tenants.get(id);
        if (!tenant) {
            return undefined;
        }
        const updated = { ...tenant, ...updates };
        this.tenants.set(id, updated);
        return updated;
    }
    deleteTenant(id) {
        return this.tenants.delete(id);
    }
}
//# sourceMappingURL=multi-tenancy.js.map