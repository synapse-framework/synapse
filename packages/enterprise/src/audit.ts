/**
 * Audit Logger
 * Comprehensive audit trail for compliance with multiple storage backends
 */

import * as fs from 'fs';
import * as path from 'path';

export type AuditAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'permission_change'
  | 'access_denied'
  | 'authentication_failed'
  | 'authentication_success'
  | 'authorization_failed'
  | 'authorization_success'
  | 'configuration_change'
  | 'data_export'
  | 'data_import'
  | 'password_reset'
  | 'password_change'
  | 'role_assigned'
  | 'role_revoked';

export type AuditSeverity = 'low' | 'medium' | 'high' | 'critical';

export type AuditCategory =
  | 'authentication'
  | 'authorization'
  | 'data_access'
  | 'data_modification'
  | 'configuration'
  | 'security'
  | 'compliance';

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
 * Storage interface for audit logs
 */
interface AuditStorage {
  store(log: AuditLog): Promise<void>;
  query(query: AuditQuery): Promise<AuditLog[]>;
  count(query: AuditQuery): Promise<number>;
  clear(): Promise<void>;
}

/**
 * In-memory storage (for development/testing)
 */
class MemoryStorage implements AuditStorage {
  private logs: AuditLog[] = [];

  public async store(log: AuditLog): Promise<void> {
    this.logs.push(log);
  }

  public async query(query: AuditQuery): Promise<AuditLog[]> {
    let filtered = [...this.logs];

    if (query.userId) {
      filtered = filtered.filter(log => log.userId === query.userId);
    }
    if (query.action) {
      filtered = filtered.filter(log => log.action === query.action);
    }
    if (query.category) {
      filtered = filtered.filter(log => log.category === query.category);
    }
    if (query.resource) {
      filtered = filtered.filter(log => log.resource === query.resource);
    }
    if (query.severity) {
      filtered = filtered.filter(log => log.severity === query.severity);
    }
    if (query.startTime) {
      filtered = filtered.filter(log => log.timestamp >= query.startTime!);
    }
    if (query.endTime) {
      filtered = filtered.filter(log => log.timestamp <= query.endTime!);
    }
    if (query.tenantId) {
      filtered = filtered.filter(log => log.tenantId === query.tenantId);
    }

    // Sort by timestamp descending
    filtered.sort((a, b) => b.timestamp - a.timestamp);

    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || filtered.length;
    return filtered.slice(offset, offset + limit);
  }

  public async count(query: AuditQuery): Promise<number> {
    const logs = await this.query({ ...query, limit: undefined, offset: undefined });
    return logs.length;
  }

  public async clear(): Promise<void> {
    this.logs = [];
  }

  public getLogs(): AuditLog[] {
    return [...this.logs];
  }
}

/**
 * File-based storage
 */
class FileStorage implements AuditStorage {
  private readonly config: FileStorageConfig;
  private currentFile: string;

  public constructor(config: FileStorageConfig) {
    this.config = config;
    this.currentFile = this.getLogFilePath();
    this.ensureDirectory();
  }

  public async store(log: AuditLog): Promise<void> {
    this.ensureDirectory();
    this.rotateIfNeeded();

    const line = JSON.stringify(log) + '\n';
    await fs.promises.appendFile(this.currentFile, line, 'utf-8');
  }

  public async query(query: AuditQuery): Promise<AuditLog[]> {
    const logs = await this.readAllLogs();
    return this.filterLogs(logs, query);
  }

  public async count(query: AuditQuery): Promise<number> {
    const logs = await this.query({ ...query, limit: undefined, offset: undefined });
    return logs.length;
  }

  public async clear(): Promise<void> {
    const files = await fs.promises.readdir(this.config.options.directory);
    const logFiles = files.filter(f => f.startsWith('audit-') && f.endsWith('.log'));

    for (const file of logFiles) {
      await fs.promises.unlink(path.join(this.config.options.directory, file));
    }
  }

  private async readAllLogs(): Promise<AuditLog[]> {
    const files = await fs.promises.readdir(this.config.options.directory);
    const logFiles = files.filter(f => f.startsWith('audit-') && f.endsWith('.log'));

    const logs: AuditLog[] = [];

    for (const file of logFiles) {
      const filePath = path.join(this.config.options.directory, file);
      const content = await fs.promises.readFile(filePath, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim());

      for (const line of lines) {
        try {
          logs.push(JSON.parse(line));
        } catch (error) {
          console.error(`Failed to parse audit log line: ${error}`);
        }
      }
    }

    return logs;
  }

  private filterLogs(logs: AuditLog[], query: AuditQuery): AuditLog[] {
    let filtered = [...logs];

    if (query.userId) {
      filtered = filtered.filter(log => log.userId === query.userId);
    }
    if (query.action) {
      filtered = filtered.filter(log => log.action === query.action);
    }
    if (query.category) {
      filtered = filtered.filter(log => log.category === query.category);
    }
    if (query.resource) {
      filtered = filtered.filter(log => log.resource === query.resource);
    }
    if (query.severity) {
      filtered = filtered.filter(log => log.severity === query.severity);
    }
    if (query.startTime) {
      filtered = filtered.filter(log => log.timestamp >= query.startTime!);
    }
    if (query.endTime) {
      filtered = filtered.filter(log => log.timestamp <= query.endTime!);
    }
    if (query.tenantId) {
      filtered = filtered.filter(log => log.tenantId === query.tenantId);
    }

    // Sort by timestamp descending
    filtered.sort((a, b) => b.timestamp - a.timestamp);

    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || filtered.length;
    return filtered.slice(offset, offset + limit);
  }

  private getLogFilePath(): string {
    const date = new Date().toISOString().split('T')[0];
    const filename = this.config.options.rotateDaily
      ? `audit-${date}.log`
      : 'audit.log';
    return path.join(this.config.options.directory, filename);
  }

  private rotateIfNeeded(): void {
    if (this.config.options.rotateDaily) {
      const newPath = this.getLogFilePath();
      if (newPath !== this.currentFile) {
        this.currentFile = newPath;
      }
    }
  }

  private ensureDirectory(): void {
    if (!fs.existsSync(this.config.options.directory)) {
      fs.mkdirSync(this.config.options.directory, { recursive: true });
    }
  }
}

/**
 * Database storage (mock implementation - replace with actual DB in production)
 */
class DatabaseStorage implements AuditStorage {
  private readonly config: DatabaseStorageConfig;
  private readonly memoryBackup: AuditLog[] = [];

  public constructor(config: DatabaseStorageConfig) {
    this.config = config;
  }

  public async store(log: AuditLog): Promise<void> {
    // In production, insert into actual database
    this.memoryBackup.push(log);
  }

  public async query(query: AuditQuery): Promise<AuditLog[]> {
    // In production, execute SQL query
    return this.filterLogs(this.memoryBackup, query);
  }

  public async count(query: AuditQuery): Promise<number> {
    const logs = await this.query({ ...query, limit: undefined, offset: undefined });
    return logs.length;
  }

  public async clear(): Promise<void> {
    this.memoryBackup.length = 0;
  }

  private filterLogs(logs: AuditLog[], query: AuditQuery): AuditLog[] {
    let filtered = [...logs];

    if (query.userId) {
      filtered = filtered.filter(log => log.userId === query.userId);
    }
    if (query.action) {
      filtered = filtered.filter(log => log.action === query.action);
    }
    if (query.category) {
      filtered = filtered.filter(log => log.category === query.category);
    }
    if (query.resource) {
      filtered = filtered.filter(log => log.resource === query.resource);
    }
    if (query.severity) {
      filtered = filtered.filter(log => log.severity === query.severity);
    }
    if (query.startTime) {
      filtered = filtered.filter(log => log.timestamp >= query.startTime!);
    }
    if (query.endTime) {
      filtered = filtered.filter(log => log.timestamp <= query.endTime!);
    }
    if (query.tenantId) {
      filtered = filtered.filter(log => log.tenantId === query.tenantId);
    }

    // Sort by timestamp descending
    filtered.sort((a, b) => b.timestamp - a.timestamp);

    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || filtered.length;
    return filtered.slice(offset, offset + limit);
  }
}

/**
 * Cloud storage (mock implementation - replace with actual cloud provider in production)
 */
class CloudStorage implements AuditStorage {
  private readonly config: CloudStorageConfig;
  private readonly memoryBackup: AuditLog[] = [];

  public constructor(config: CloudStorageConfig) {
    this.config = config;
  }

  public async store(log: AuditLog): Promise<void> {
    // In production, upload to cloud storage (S3, GCS, Azure Blob)
    this.memoryBackup.push(log);
  }

  public async query(query: AuditQuery): Promise<AuditLog[]> {
    // In production, query from cloud storage
    return this.filterLogs(this.memoryBackup, query);
  }

  public async count(query: AuditQuery): Promise<number> {
    const logs = await this.query({ ...query, limit: undefined, offset: undefined });
    return logs.length;
  }

  public async clear(): Promise<void> {
    this.memoryBackup.length = 0;
  }

  private filterLogs(logs: AuditLog[], query: AuditQuery): AuditLog[] {
    let filtered = [...logs];

    if (query.userId) {
      filtered = filtered.filter(log => log.userId === query.userId);
    }
    if (query.action) {
      filtered = filtered.filter(log => log.action === query.action);
    }
    if (query.category) {
      filtered = filtered.filter(log => log.category === query.category);
    }
    if (query.resource) {
      filtered = filtered.filter(log => log.resource === query.resource);
    }
    if (query.severity) {
      filtered = filtered.filter(log => log.severity === query.severity);
    }
    if (query.startTime) {
      filtered = filtered.filter(log => log.timestamp >= query.startTime!);
    }
    if (query.endTime) {
      filtered = filtered.filter(log => log.timestamp <= query.endTime!);
    }
    if (query.tenantId) {
      filtered = filtered.filter(log => log.tenantId === query.tenantId);
    }

    // Sort by timestamp descending
    filtered.sort((a, b) => b.timestamp - a.timestamp);

    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || filtered.length;
    return filtered.slice(offset, offset + limit);
  }
}

/**
 * Main Audit Logger
 */
export class AuditLogger {
  private readonly storage: AuditStorage;
  private readonly config: AnyStorageConfig;

  public constructor(config: AnyStorageConfig = { backend: 'memory' }) {
    this.config = config;
    this.storage = this.createStorage(config);
  }

  public async log(entry: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const log: AuditLog = {
      ...entry,
      id: this.generateId(),
      timestamp: Date.now()
    };

    await this.storage.store(log);

    // Log to console for development
    console.log(
      `[AUDIT] ${log.severity.toUpperCase()} - ${log.action} on ${log.resource} by ${log.userId} (${log.success ? 'SUCCESS' : 'FAILED'})`
    );

    return log;
  }

  public async query(query: AuditQuery = {}): Promise<AuditLog[]> {
    return await this.storage.query(query);
  }

  public async count(query: AuditQuery = {}): Promise<number> {
    return await this.storage.count(query);
  }

  public async getStatistics(query: AuditQuery = {}): Promise<AuditStatistics> {
    const logs = await this.storage.query({ ...query, limit: undefined, offset: undefined });

    const byAction: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};
    const byUser: Record<string, number> = {};

    let minTime = Infinity;
    let maxTime = -Infinity;

    for (const log of logs) {
      byAction[log.action] = (byAction[log.action] || 0) + 1;
      byCategory[log.category] = (byCategory[log.category] || 0) + 1;
      bySeverity[log.severity] = (bySeverity[log.severity] || 0) + 1;
      byUser[log.userId] = (byUser[log.userId] || 0) + 1;

      if (log.timestamp < minTime) minTime = log.timestamp;
      if (log.timestamp > maxTime) maxTime = log.timestamp;
    }

    return {
      totalLogs: logs.length,
      byAction: byAction as Record<AuditAction, number>,
      byCategory: byCategory as Record<AuditCategory, number>,
      bySeverity: bySeverity as Record<AuditSeverity, number>,
      byUser,
      timeRange: {
        start: minTime === Infinity ? 0 : minTime,
        end: maxTime === -Infinity ? 0 : maxTime
      }
    };
  }

  public async generateReport(query: AuditQuery = {}): Promise<AuditReport> {
    const logs = await this.query(query);
    const statistics = await this.getStatistics(query);

    const summary = this.generateSummary(statistics, logs);

    return {
      generatedAt: Date.now(),
      query,
      statistics,
      logs,
      summary
    };
  }

  public async export(format: 'json' | 'csv' = 'json', query: AuditQuery = {}): Promise<string> {
    const logs = await this.query(query);

    if (format === 'json') {
      return JSON.stringify(logs, null, 2);
    }

    // CSV export
    const headers = [
      'ID',
      'Timestamp',
      'User ID',
      'User Name',
      'Action',
      'Resource',
      'Category',
      'Severity',
      'Success',
      'IP Address',
      'Session ID'
    ];

    const rows = logs.map(log => [
      log.id,
      new Date(log.timestamp).toISOString(),
      log.userId,
      log.userName || '',
      log.action,
      log.resource,
      log.category,
      log.severity,
      log.success ? 'Yes' : 'No',
      log.ipAddress || '',
      log.sessionId || ''
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  public async clear(): Promise<void> {
    await this.storage.clear();
  }

  private generateSummary(statistics: AuditStatistics, logs: AuditLog[]): string {
    const totalActions = statistics.totalLogs;
    const criticalCount = statistics.bySeverity['critical'] || 0;
    const failedCount = logs.filter(log => !log.success).length;

    let summary = `Audit Report Summary:\n`;
    summary += `Total Actions: ${totalActions}\n`;
    summary += `Critical Events: ${criticalCount}\n`;
    summary += `Failed Actions: ${failedCount}\n`;
    summary += `Success Rate: ${totalActions > 0 ? ((totalActions - failedCount) / totalActions * 100).toFixed(2) : 0}%\n`;

    return summary;
  }

  private createStorage(config: AnyStorageConfig): AuditStorage {
    switch (config.backend) {
      case 'memory':
        return new MemoryStorage();
      case 'file':
        return new FileStorage(config as FileStorageConfig);
      case 'database':
        return new DatabaseStorage(config as DatabaseStorageConfig);
      case 'cloud':
        return new CloudStorage(config as CloudStorageConfig);
      default:
        return new MemoryStorage();
    }
  }

  private generateId(): string {
    return `audit-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
}
