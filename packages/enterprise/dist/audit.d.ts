/**
 * Audit Logger
 * Comprehensive audit trail for compliance with multiple storage backends
 */
export type AuditAction = 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout' | 'permission_change' | 'access_denied' | 'authentication_failed' | 'authentication_success' | 'authorization_failed' | 'authorization_success' | 'configuration_change' | 'data_export' | 'data_import' | 'password_reset' | 'password_change' | 'role_assigned' | 'role_revoked';
export type AuditSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AuditCategory = 'authentication' | 'authorization' | 'data_access' | 'data_modification' | 'configuration' | 'security' | 'compliance';
export interface AuditLog {
    readonly id: string;
    readonly timestamp: number;
    readonly userId: string;
    readonly userName?: string;
    readonly action: AuditAction;
    readonly resource: string;
    readonly resourceId?: string;
    readonly category: AuditCategory;
    readonly severity: AuditSeverity;
    readonly success: boolean;
    readonly details?: Record<string, unknown>;
    readonly ipAddress?: string;
    readonly userAgent?: string;
    readonly sessionId?: string;
    readonly tenantId?: string;
    readonly changes?: AuditChange[];
}
export interface AuditChange {
    readonly field: string;
    readonly oldValue: unknown;
    readonly newValue: unknown;
}
export interface AuditQuery {
    readonly userId?: string;
    readonly action?: AuditAction;
    readonly category?: AuditCategory;
    readonly resource?: string;
    readonly severity?: AuditSeverity;
    readonly startTime?: number;
    readonly endTime?: number;
    readonly tenantId?: string;
    readonly limit?: number;
    readonly offset?: number;
}
export interface AuditStatistics {
    readonly totalLogs: number;
    readonly byAction: Record<AuditAction, number>;
    readonly byCategory: Record<AuditCategory, number>;
    readonly bySeverity: Record<AuditSeverity, number>;
    readonly byUser: Record<string, number>;
    readonly timeRange: {
        readonly start: number;
        readonly end: number;
    };
}
export interface AuditReport {
    readonly generatedAt: number;
    readonly query: AuditQuery;
    readonly statistics: AuditStatistics;
    readonly logs: AuditLog[];
    readonly summary: string;
}
export type StorageBackend = 'memory' | 'file' | 'database' | 'cloud';
export interface StorageConfig {
    readonly backend: StorageBackend;
    readonly options?: Record<string, unknown>;
}
export interface FileStorageConfig extends StorageConfig {
    readonly backend: 'file';
    readonly options: {
        readonly directory: string;
        readonly maxFileSize?: number;
        readonly rotateDaily?: boolean;
        readonly compress?: boolean;
    };
}
export interface DatabaseStorageConfig extends StorageConfig {
    readonly backend: 'database';
    readonly options: {
        readonly connectionString: string;
        readonly table?: string;
        readonly batchSize?: number;
    };
}
export interface CloudStorageConfig extends StorageConfig {
    readonly backend: 'cloud';
    readonly options: {
        readonly provider: 'aws' | 'gcp' | 'azure';
        readonly bucket: string;
        readonly region?: string;
        readonly credentials?: Record<string, string>;
    };
}
export type AnyStorageConfig = StorageConfig | FileStorageConfig | DatabaseStorageConfig | CloudStorageConfig;
/**
 * Main Audit Logger
 */
export declare class AuditLogger {
    private readonly storage;
    private readonly config;
    constructor(config?: AnyStorageConfig);
    log(entry: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog>;
    query(query?: AuditQuery): Promise<AuditLog[]>;
    count(query?: AuditQuery): Promise<number>;
    getStatistics(query?: AuditQuery): Promise<AuditStatistics>;
    generateReport(query?: AuditQuery): Promise<AuditReport>;
    export(format?: 'json' | 'csv', query?: AuditQuery): Promise<string>;
    clear(): Promise<void>;
    private generateSummary;
    private createStorage;
    private generateId;
}
//# sourceMappingURL=audit.d.ts.map