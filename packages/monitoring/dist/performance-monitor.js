/**
 * Performance Monitor
 *
 * Tracks application performance metrics including CPU, memory, and timing
 */
export class PerformanceMonitor {
    startTime;
    metrics;
    constructor() {
        this.startTime = Date.now();
        this.metrics = new Map();
    }
    recordMetric(name, value) {
        this.metrics.set(name, value);
    }
    getMetric(name) {
        return this.metrics.get(name);
    }
    getMetrics() {
        const result = {};
        this.metrics.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    }
    getCPUUsage() {
        if (typeof process !== 'undefined' && process.cpuUsage) {
            const usage = process.cpuUsage();
            return (usage.user + usage.system) / 1000000; // Convert to seconds
        }
        return 0;
    }
    getMemoryUsage() {
        if (typeof process !== 'undefined' && process.memoryUsage) {
            const usage = process.memoryUsage();
            return {
                heapUsed: usage.heapUsed,
                heapTotal: usage.heapTotal,
                external: usage.external,
                rss: usage.rss
            };
        }
        return {
            heapUsed: 0,
            heapTotal: 0,
            external: 0,
            rss: 0
        };
    }
    getUptime() {
        return Date.now() - this.startTime;
    }
    measure(name, fn) {
        const start = performance.now();
        fn();
        const duration = performance.now() - start;
        this.recordMetric(name, duration);
        return duration;
    }
    async measureAsync(name, fn) {
        const start = performance.now();
        await fn();
        const duration = performance.now() - start;
        this.recordMetric(name, duration);
        return duration;
    }
}
//# sourceMappingURL=performance-monitor.js.map