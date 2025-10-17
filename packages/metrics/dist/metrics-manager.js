/**
 * Metrics Manager - Main interface for metrics management
 */
import { MetricsCollector } from './metrics-collector.js';
import { MetricsDashboard } from './metrics-dashboard.js';
import { MetricsAggregator } from './metrics-aggregator.js';
import { MetricsExporter } from './metrics-exporter.js';
import { MetricsRegistry } from './metrics-registry.js';
export class MetricsManager {
    config;
    collector;
    aggregator;
    exporter;
    registry = null;
    dashboard = null;
    autoCollectionInterval = null;
    systemMetricsEnabled = false;
    constructor(config) {
        this.config = {
            enableAutoCollection: false,
            collectionInterval: 1000,
            enableDashboard: false,
            enableRegistry: true,
            defaultCategory: 'default',
            ...config
        };
        this.collector = new MetricsCollector();
        this.aggregator = new MetricsAggregator();
        this.exporter = new MetricsExporter();
        if (this.config.enableRegistry) {
            this.registry = new MetricsRegistry();
        }
        if (this.config.enableDashboard && this.config.dashboardConfig !== undefined) {
            this.dashboard = new MetricsDashboard(this.config.dashboardConfig);
        }
    }
    /**
     * Register a new metric
     */
    registerMetric(name, type, description, options = {}) {
        // Register in collector
        this.collector.registerMetric(name, type, description, options.labels, options.unit);
        // Register in registry
        if (this.registry !== null) {
            this.registry.register(name, type, description, {
                unit: options.unit,
                labels: options.labels,
                category: options.category || this.config.defaultCategory,
                tags: options.tags
            });
        }
    }
    /**
     * Increment a counter
     */
    incrementCounter(name, value = 1, labels = {}) {
        this.collector.incrementCounter(name, value, labels);
    }
    /**
     * Set a gauge value
     */
    setGauge(name, value, labels = {}) {
        this.collector.setGauge(name, value, labels);
    }
    /**
     * Increment a gauge
     */
    incrementGauge(name, value = 1, labels = {}) {
        this.collector.incrementGauge(name, value, labels);
    }
    /**
     * Decrement a gauge
     */
    decrementGauge(name, value = 1, labels = {}) {
        this.collector.decrementGauge(name, value, labels);
    }
    /**
     * Observe a histogram value
     */
    observeHistogram(name, value, labels = {}) {
        this.collector.observeHistogram(name, value, labels);
    }
    /**
     * Observe a summary value
     */
    observeSummary(name, value, labels = {}) {
        this.collector.observeSummary(name, value, labels);
    }
    /**
     * Get a metric
     */
    getMetric(name) {
        return this.collector.getMetric(name);
    }
    /**
     * Get all metrics
     */
    getAllMetrics() {
        return this.collector.getAllMetrics();
    }
    /**
     * Aggregate a metric
     */
    aggregate(metricName, period, func) {
        const metric = this.collector.getMetric(metricName);
        if (metric === undefined) {
            return null;
        }
        return this.aggregator.aggregate(metric, period, func);
    }
    /**
     * Get aggregation history
     */
    getAggregationHistory(metricName, period, func) {
        return this.aggregator.getAggregationHistory(metricName, period, func);
    }
    /**
     * Export metrics
     */
    export(format) {
        const metrics = this.collector.getAllMetrics();
        return this.exporter.export(metrics, { format });
    }
    /**
     * Query metrics from registry
     */
    query(query) {
        if (this.registry === null) {
            throw new Error('Registry is not enabled');
        }
        return this.registry.query(query);
    }
    /**
     * Get metrics by category
     */
    getByCategory(category) {
        if (this.registry === null) {
            throw new Error('Registry is not enabled');
        }
        return this.registry.getByCategory(category);
    }
    /**
     * Get dashboard data
     */
    getDashboardData() {
        if (this.dashboard === null) {
            return null;
        }
        return this.dashboard.getDashboardData();
    }
    /**
     * Start dashboard auto-refresh
     */
    startDashboard() {
        if (this.dashboard === null) {
            throw new Error('Dashboard is not enabled');
        }
        this.dashboard.startAllRefreshes((name) => this.collector.getMetric(name));
    }
    /**
     * Stop dashboard auto-refresh
     */
    stopDashboard() {
        if (this.dashboard !== null) {
            this.dashboard.stopAllRefreshes();
        }
    }
    /**
     * Take a snapshot of all metrics
     */
    takeSnapshot() {
        const metrics = this.collector.getAllMetrics();
        const aggregations = [];
        // Get common aggregations
        for (const metric of metrics) {
            const hourly = this.aggregator.aggregate(metric, '1h', 'average');
            aggregations.push(hourly);
        }
        return {
            timestamp: Date.now(),
            metrics,
            aggregations,
            metadata: {
                metricsCount: metrics.length,
                registryEnabled: this.registry !== null,
                dashboardEnabled: this.dashboard !== null
            }
        };
    }
    /**
     * Get metrics statistics
     */
    getStats() {
        const metrics = this.collector.getAllMetrics();
        let totalValues = 0;
        let oldestTimestamp = Infinity;
        let newestTimestamp = 0;
        const metricsPerType = {
            counter: 0,
            gauge: 0,
            histogram: 0,
            summary: 0
        };
        for (const metric of metrics) {
            metricsPerType[metric.type] = (metricsPerType[metric.type] || 0) + 1;
            totalValues += metric.values.length;
            for (const value of metric.values) {
                if (value.timestamp < oldestTimestamp) {
                    oldestTimestamp = value.timestamp;
                }
                if (value.timestamp > newestTimestamp) {
                    newestTimestamp = value.timestamp;
                }
            }
        }
        return {
            totalMetrics: metrics.length,
            totalValues,
            metricsPerType,
            oldestTimestamp: oldestTimestamp === Infinity ? 0 : oldestTimestamp,
            newestTimestamp,
            registryStats: this.registry?.getStats()
        };
    }
    /**
     * Enable system metrics collection
     */
    enableSystemMetrics() {
        if (this.systemMetricsEnabled) {
            return;
        }
        this.systemMetricsEnabled = true;
        // Register system metrics
        this.registerMetric('system_cpu_usage', 'gauge', 'CPU usage percentage', {
            unit: '%',
            category: 'system'
        });
        this.registerMetric('system_memory_usage', 'gauge', 'Memory usage in bytes', {
            unit: 'bytes',
            category: 'system'
        });
        this.registerMetric('system_memory_total', 'gauge', 'Total memory in bytes', {
            unit: 'bytes',
            category: 'system'
        });
        // Start collection if auto-collection is enabled
        if (this.config.enableAutoCollection) {
            this.startAutoCollection();
        }
    }
    /**
     * Start auto-collection of system metrics
     */
    startAutoCollection() {
        if (this.autoCollectionInterval !== null) {
            return;
        }
        this.autoCollectionInterval = setInterval(() => {
            this.collectSystemMetrics();
        }, this.config.collectionInterval);
        // Collect immediately
        this.collectSystemMetrics();
    }
    /**
     * Stop auto-collection
     */
    stopAutoCollection() {
        if (this.autoCollectionInterval !== null) {
            clearInterval(this.autoCollectionInterval);
            this.autoCollectionInterval = null;
        }
    }
    /**
     * Collect system metrics
     */
    collectSystemMetrics() {
        if (!this.systemMetricsEnabled) {
            return;
        }
        const memUsage = process.memoryUsage();
        // CPU usage approximation (not perfect, but gives an idea)
        const cpuUsage = process.cpuUsage();
        const cpuPercent = (cpuUsage.user + cpuUsage.system) / 1000000; // Convert to seconds
        this.setGauge('system_cpu_usage', cpuPercent);
        this.setGauge('system_memory_usage', memUsage.heapUsed);
        this.setGauge('system_memory_total', memUsage.heapTotal);
    }
    /**
     * Clear all metrics
     */
    clear() {
        this.collector.clear();
        this.aggregator.clear();
        if (this.registry !== null) {
            this.registry.clear();
        }
        if (this.dashboard !== null) {
            this.dashboard.clearData();
        }
    }
    /**
     * Get configuration
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * Get collector
     */
    getCollector() {
        return this.collector;
    }
    /**
     * Get aggregator
     */
    getAggregator() {
        return this.aggregator;
    }
    /**
     * Get exporter
     */
    getExporter() {
        return this.exporter;
    }
    /**
     * Get registry
     */
    getRegistry() {
        return this.registry;
    }
    /**
     * Get dashboard
     */
    getDashboard() {
        return this.dashboard;
    }
    /**
     * Dispose and cleanup
     */
    dispose() {
        this.stopAutoCollection();
        this.stopDashboard();
        this.clear();
    }
}
//# sourceMappingURL=metrics-manager.js.map