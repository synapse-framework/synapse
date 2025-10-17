/**
 * Metrics Collector
 *
 * Collect and aggregate application metrics
 */
export class MetricsCollector {
    metrics;
    isRunning = false;
    constructor() {
        this.metrics = new Map();
    }
    start() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        console.log('📈 Metrics collector started');
    }
    stop() {
        if (!this.isRunning) {
            return;
        }
        this.isRunning = false;
        console.log('📈 Metrics collector stopped');
    }
    record(name, type, value, tags) {
        const metric = {
            name,
            type,
            value,
            timestamp: Date.now(),
            tags
        };
        this.metrics.set(name, metric);
    }
    increment(name, delta = 1) {
        const existing = this.metrics.get(name);
        const value = existing ? existing.value + delta : delta;
        this.record(name, 'counter', value);
    }
    gauge(name, value) {
        this.record(name, 'gauge', value);
    }
    histogram(name, value) {
        this.record(name, 'histogram', value);
    }
    get(name) {
        return this.metrics.get(name);
    }
    getAll() {
        return Array.from(this.metrics.values());
    }
    clear() {
        this.metrics.clear();
    }
}
//# sourceMappingURL=metrics.js.map