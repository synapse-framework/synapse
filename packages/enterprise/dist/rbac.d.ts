/**
 * Role-Based Access Control (RBAC)
 */
export interface Permission {
    readonly resource: string;
    readonly actions: string[];
}
export interface Role {
    readonly id: string;
    readonly name: string;
    readonly permissions: Permission[];
    readonly inherits?: string[];
}
export declare class RBACManager {
    private readonly roles;
    private readonly userRoles;
    constructor();
    private initializeDefaultRoles;
    createRole(name: string, permissions: Permission[], inherits?: string[]): Role;
    assignRole(userId: string, roleId: string): void;
    revokeRole(userId: string, roleId: string): void;
    hasPermission(userId: string, resource: string, action: string): boolean;
    getUserRoles(userId: string): Role[];
}
//# sourceMappingURL=rbac.d.ts.map