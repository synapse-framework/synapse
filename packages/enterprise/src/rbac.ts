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

export class RBACManager {
  private readonly roles: Map<string, Role> = new Map();
  private readonly userRoles: Map<string, string[]> = new Map();

  public constructor() {
    this.initializeDefaultRoles();
  }

  private initializeDefaultRoles(): void {
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

  public createRole(name: string, permissions: Permission[], inherits?: string[]): Role {
    const role: Role = {
      id: `role-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      permissions,
      inherits
    };

    this.roles.set(role.id, role);
    return role;
  }

  public assignRole(userId: string, roleId: string): void {
    const roles = this.userRoles.get(userId) || [];
    if (!roles.includes(roleId)) {
      roles.push(roleId);
      this.userRoles.set(userId, roles);
    }
  }

  public revokeRole(userId: string, roleId: string): void {
    const roles = this.userRoles.get(userId) || [];
    const index = roles.indexOf(roleId);
    if (index > -1) {
      roles.splice(index, 1);
      this.userRoles.set(userId, roles);
    }
  }

  public hasPermission(userId: string, resource: string, action: string): boolean {
    const roleIds = this.userRoles.get(userId) || [];

    for (const roleId of roleIds) {
      const role = this.roles.get(roleId);
      if (!role) continue;

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

  public getUserRoles(userId: string): Role[] {
    const roleIds = this.userRoles.get(userId) || [];
    return roleIds.map(id => this.roles.get(id)).filter((r): r is Role => r !== undefined);
  }
}
