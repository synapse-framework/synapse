/**
 * Role-Based Access Control (RBAC)
 */
export class RBACManager {
    roles = new Map();
    userRoles = new Map();
    constructor() {
        this.initializeDefaultRoles();
    }
    initializeDefaultRoles() {
        this.createRole('admin', [
            { resource: '*', actions: ['*'] }
        ]);
        this.createRole('user', [
            { resource: 'profile', actions: ['read', 'update'] },
            { resource: 'data', actions: ['read'] }
        ]);
        this.createRole('guest', [
            { resource: 'public', actions: ['read'] }
        ]);
    }
    createRole(name, permissions, inherits) {
        const role = {
            id: `role-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name,
            permissions,
            inherits
        };
        this.roles.set(role.id, role);
        return role;
    }
    assignRole(userId, roleId) {
        const roles = this.userRoles.get(userId) || [];
        if (!roles.includes(roleId)) {
            roles.push(roleId);
            this.userRoles.set(userId, roles);
        }
    }
    revokeRole(userId, roleId) {
        const roles = this.userRoles.get(userId) || [];
        const index = roles.indexOf(roleId);
        if (index > -1) {
            roles.splice(index, 1);
            this.userRoles.set(userId, roles);
        }
    }
    hasPermission(userId, resource, action) {
        const roleIds = this.userRoles.get(userId) || [];
        for (const roleId of roleIds) {
            const role = this.roles.get(roleId);
            if (!role)
                continue;
            for (const perm of role.permissions) {
                if (perm.resource === '*' || perm.resource === resource) {
                    if (perm.actions.includes('*') || perm.actions.includes(action)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    getUserRoles(userId) {
        const roleIds = this.userRoles.get(userId) || [];
        return roleIds.map(id => this.roles.get(id)).filter((r) => r !== undefined);
    }
}
//# sourceMappingURL=rbac.js.map