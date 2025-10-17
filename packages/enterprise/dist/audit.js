/**
 * Audit Logger
 * Comprehensive audit trail for compliance with multiple storage backends
 */
import * as fs from 'fs';
import * as path from 'path';
/**
 * In-memory storage (for development/testing)
 */
class MemoryStorage {
    logs = [];
    async store(log) {
        this.logs.push(log);
    }
    async query(query) {
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
            filtered = filtered.filter(log => log.timestamp >= query.startTime);
        }
        if (query.endTime) {
            filtered = filtered.filter(log => log.timestamp <= query.endTime);
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
    async count(query) {
        const logs = await this.query({ ...query, limit: undefined, offset: undefined });
        return logs.length;
    }
    async clear() {
        this.logs = [];
    }
    getLogs() {
        return [...this.logs];
    }
}
/**
 * File-based storage
 */
class FileStorage {
    config;
    currentFile;
    constructor(config) {
        this.config = config;
        this.currentFile = this.getLogFilePath();
        this.ensureDirectory();
    }
    async store(log) {
        this.ensureDirectory();
        this.rotateIfNeeded();
        const line = JSON.stringify(log) + '\n';
        await fs.promises.appendFile(this.currentFile, line, 'utf-8');
    }
    async query(query) {
        const logs = await this.readAllLogs();
        return this.filterLogs(logs, query);
    }
    async count(query) {
        const logs = await this.query({ ...query, limit: undefined, offset: undefined });
        return logs.length;
    }
    async clear() {
        const files = await fs.promises.readdir(this.config.options.directory);
        const logFiles = files.filter(f => f.startsWith('audit-') && f.endsWith('.log'));
        for (const file of logFiles) {
            await fs.promises.unlink(path.join(this.config.options.directory, file));
        }
    }
    async readAllLogs() {
        const files = await fs.promises.readdir(this.config.options.directory);
        const logFiles = files.filter(f => f.startsWith('audit-') && f.endsWith('.log'));
        const logs = [];
        for (const file of logFiles) {
            const filePath = path.join(this.config.options.directory, file);
            const content = await fs.promises.readFile(filePath, 'utf-8');
            const lines = content.split('\n').filter(line => line.trim());
            for (const line of lines) {
                try {
                    logs.push(JSON.parse(line));
                }
                catch (error) {
                    console.error(`Failed to parse audit log line: ${error}`);
                }
            }
        }
        return logs;
    }
    filterLogs(logs, query) {
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
            filtered = filtered.filter(log => log.timestamp >= query.startTime);
        }
        if (query.endTime) {
            filtered = filtered.filter(log => log.timestamp <= query.endTime);
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
    getLogFilePath() {
        const date = new Date().toISOString().split('T')[0];
        const filename = this.config.options.rotateDaily
            ? `audit-${date}.log`
            : 'audit.log';
        return path.join(this.config.options.directory, filename);
    }
    rotateIfNeeded() {
        if (this.config.options.rotateDaily) {
            const newPath = this.getLogFilePath();
            if (newPath !== this.currentFile) {
                this.currentFile = newPath;
            }
        }
    }
    ensureDirectory() {
        if (!fs.existsSync(this.config.options.directory)) {
            fs.mkdirSync(this.config.options.directory, { recursive: true });
        }
    }
}
/**
 * Database storage (mock implementation - replace with actual DB in production)
 */
class DatabaseStorage {
    config;
    memoryBackup = [];
    constructor(config) {
        this.config = config;
    }
    async store(log) {
        // In production, insert into actual database
        this.memoryBackup.push(log);
    }
    async query(query) {
        // In production, execute SQL query
        return this.filterLogs(this.memoryBackup, query);
    }
    async count(query) {
        const logs = await this.query({ ...query, limit: undefined, offset: undefined });
        return logs.length;
    }
    async clear() {
        this.memoryBackup.length = 0;
    }
    filterLogs(logs, query) {
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
            filtered = filtered.filter(log => log.timestamp >= query.startTime);
        }
        if (query.endTime) {
            filtered = filtered.filter(log => log.timestamp <= query.endTime);
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
class CloudStorage {
    config;
    memoryBackup = [];
    constructor(config) {
        this.config = config;
    }
    async store(log) {
        // In production, upload to cloud storage (S3, GCS, Azure Blob)
        this.memoryBackup.push(log);
    }
    async query(query) {
        // In production, query from cloud storage
        return this.filterLogs(this.memoryBackup, query);
    }
    async count(query) {
        const logs = await this.query({ ...query, limit: undefined, offset: undefined });
        return logs.length;
    }
    async clear() {
        this.memoryBackup.length = 0;
    }
    filterLogs(logs, query) {
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
            filtered = filtered.filter(log => log.timestamp >= query.startTime);
        }
        if (query.endTime) {
            filtered = filtered.filter(log => log.timestamp <= query.endTime);
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
    storage;
    config;
    constructor(config = { backend: 'memory' }) {
        this.config = config;
        this.storage = this.createStorage(config);
    }
    async log(entry) {
        const log = {
            ...entry,
            id: this.generateId(),
            timestamp: Date.now()
        };
        await this.storage.store(log);
        // Log to console for development
        console.log(`[AUDIT] ${log.severity.toUpperCase()} - ${log.action} on ${log.resource} by ${log.userId} (${log.success ? 'SUCCESS' : 'FAILED'})`);
        return log;
    }
    async query(query = {}) {
        return await this.storage.query(query);
    }
    async count(query = {}) {
        return await this.storage.count(query);
    }
    async getStatistics(query = {}) {
        const logs = await this.storage.query({ ...query, limit: undefined, offset: undefined });
        const byAction = {};
        const byCategory = {};
        const bySeverity = {};
        const byUser = {};
        let minTime = Infinity;
        let maxTime = -Infinity;
        for (const log of logs) {
            byAction[log.action] = (byAction[log.action] || 0) + 1;
            byCategory[log.category] = (byCategory[log.category] || 0) + 1;
            bySeverity[log.severity] = (bySeverity[log.severity] || 0) + 1;
            byUser[log.userId] = (byUser[log.userId] || 0) + 1;
            if (log.timestamp < minTime)
                minTime = log.timestamp;
            if (log.timestamp > maxTime)
                maxTime = log.timestamp;
        }
        return {
            totalLogs: logs.length,
            byAction: byAction,
            byCategory: byCategory,
            bySeverity: bySeverity,
            byUser,
            timeRange: {
                start: minTime === Infinity ? 0 : minTime,
                end: maxTime === -Infinity ? 0 : maxTime
            }
        };
    }
    async generateReport(query = {}) {
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
    async export(format = 'json', query = {}) {
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
    async clear() {
        await this.storage.clear();
    }
    generateSummary(statistics, logs) {
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
    createStorage(config) {
        switch (config.backend) {
            case 'memory':
                return new MemoryStorage();
            case 'file':
                return new FileStorage(config);
            case 'database':
                return new DatabaseStorage(config);
            case 'cloud':
                return new CloudStorage(config);
            default:
                return new MemoryStorage();
        }
    }
    generateId() {
        return `audit-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
}
//# sourceMappingURL=audit.js.map