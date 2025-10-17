/**
 * Metrics Collector - Collect and store metrics
 */
export class MetricsCollector {
    metrics = new Map();
    counters = new Map();
    gauges = new Map();
    histograms = new Map();
    summaries = new Map();
    /**
     * Register a new metric
     */
    registerMetric(name, type, description, labels = [], unit = '') {
        if (this.metrics.has(name)) {
            throw new Error(`Metric '${name}' is already registered`);
        }
        this.metrics.set(name, {
            name,
            type,
            description,
            values: [],
            labels,
            unit
        });
        // Initialize state based on type
        switch (type) {
            case 'counter':
                this.counters.set(name, { value: 0 });
                break;
            case 'gauge':
                this.gauges.set(name, { value: 0 });
                break;
            case 'histogram':
                this.histograms.set(name, {
                    buckets: new Map(),
                    sum: 0,
                    count: 0
                });
                break;
            case 'summary':
                this.summaries.set(name, {
                    values: [],
                    sum: 0,
                    count: 0
                });
                break;
        }
    }
    /**
     * Increment a counter
     */
    incrementCounter(name, value = 1, labels = {}) {
        this.ensureMetricExists(name, 'counter');
        const counter = this.counters.get(name);
        if (counter !== undefined) {
            counter.value += value;
            this.recordValue(name, counter.value, labels);
        }
    }
    /**
     * Set a gauge value
     */
    setGauge(name, value, labels = {}) {
        this.ensureMetricExists(name, 'gauge');
        const gauge = this.gauges.get(name);
        if (gauge !== undefined) {
            gauge.value = value;
            this.recordValue(name, value, labels);
        }
    }
    /**
     * Increment a gauge
     */
    incrementGauge(name, value = 1, labels = {}) {
        this.ensureMetricExists(name, 'gauge');
        const gauge = this.gauges.get(name);
        if (gauge !== undefined) {
            gauge.value += value;
            this.recordValue(name, gauge.value, labels);
        }
    }
    /**
     * Decrement a gauge
     */
    decrementGauge(name, value = 1, labels = {}) {
        this.incrementGauge(name, -value, labels);
    }
    /**
     * Observe a histogram value
     */
    observeHistogram(name, value, labels = {}) {
        this.ensureMetricExists(name, 'histogram');
        const histogram = this.histograms.get(name);
        if (histogram !== undefined) {
            histogram.sum += value;
            histogram.count += 1;
            // Add to appropriate bucket
            const bucketKey = this.getBucketKey(value);
            const currentCount = histogram.buckets.get(bucketKey) || 0;
            histogram.buckets.set(bucketKey, currentCount + 1);
            this.recordValue(name, value, labels);
        }
    }
    /**
     * Observe a summary value
     */
    observeSummary(name, value, labels = {}) {
        this.ensureMetricExists(name, 'summary');
        const summary = this.summaries.get(name);
        if (summary !== undefined) {
            summary.values.push(value);
            summary.sum += value;
            summary.count += 1;
            // Keep only recent values (last 1000)
            if (summary.values.length > 1000) {
                summary.values.shift();
            }
            this.recordValue(name, value, labels);
        }
    }
    /**
     * Get a metric by name
     */
    getMetric(name) {
        return this.metrics.get(name);
    }
    /**
     * Get all metrics
     */
    getAllMetrics() {
        return Array.from(this.metrics.values());
    }
    /**
     * Get counter value
     */
    getCounterValue(name) {
        const counter = this.counters.get(name);
        return counter?.value || 0;
    }
    /**
     * Get gauge value
     */
    getGaugeValue(name) {
        const gauge = this.gauges.get(name);
        return gauge?.value || 0;
    }
    /**
     * Get histogram statistics
     */
    getHistogramStats(name) {
        const histogram = this.histograms.get(name);
        if (histogram === undefined) {
            return { sum: 0, count: 0, average: 0, buckets: new Map() };
        }
        return {
            sum: histogram.sum,
            count: histogram.count,
            average: histogram.count > 0 ? histogram.sum / histogram.count : 0,
            buckets: new Map(histogram.buckets)
        };
    }
    /**
     * Get summary statistics
     */
    getSummaryStats(name) {
        const summary = this.summaries.get(name);
        if (summary === undefined || summary.values.length === 0) {
            return {
                sum: 0,
                count: 0,
                average: 0,
                min: 0,
                max: 0,
                percentiles: {}
            };
        }
        const sortedValues = [...summary.values].sort((a, b) => a - b);
        const percentiles = {
            50: this.calculatePercentile(sortedValues, 0.5),
            75: this.calculatePercentile(sortedValues, 0.75),
            90: this.calculatePercentile(sortedValues, 0.9),
            95: this.calculatePercentile(sortedValues, 0.95),
            99: this.calculatePercentile(sortedValues, 0.99)
        };
        return {
            sum: summary.sum,
            count: summary.count,
            average: summary.count > 0 ? summary.sum / summary.count : 0,
            min: sortedValues[0] || 0,
            max: sortedValues[sortedValues.length - 1] || 0,
            percentiles
        };
    }
    /**
     * Clear all metrics
     */
    clear() {
        this.metrics.clear();
        this.counters.clear();
        this.gauges.clear();
        this.histograms.clear();
        this.summaries.clear();
    }
    /**
     * Reset a specific metric
     */
    resetMetric(name) {
        const metric = this.metrics.get(name);
        if (metric === undefined) {
            return;
        }
        switch (metric.type) {
            case 'counter':
                this.counters.set(name, { value: 0 });
                break;
            case 'gauge':
                this.gauges.set(name, { value: 0 });
                break;
            case 'histogram':
                this.histograms.set(name, {
                    buckets: new Map(),
                    sum: 0,
                    count: 0
                });
                break;
            case 'summary':
                this.summaries.set(name, {
                    values: [],
                    sum: 0,
                    count: 0
                });
                break;
        }
        // Clear recorded values
        this.metrics.set(name, {
            ...metric,
            values: []
        });
    }
    /**
     * Get metrics count
     */
    getMetricsCount() {
        return this.metrics.size;
    }
    /**
     * Check if metric exists
     */
    hasMetric(name) {
        return this.metrics.has(name);
    }
    /**
     * Record a metric value
     */
    recordValue(name, value, labels) {
        const metric = this.metrics.get(name);
        if (metric === undefined) {
            return;
        }
        const metricValue = {
            value,
            timestamp: Date.now(),
            labels
        };
        // Add to values array (keep last 10000)
        const values = [...metric.values, metricValue];
        if (values.length > 10000) {
            values.shift();
        }
        this.metrics.set(name, {
            ...metric,
            values
        });
    }
    /**
     * Ensure metric exists and has correct type
     */
    ensureMetricExists(name, expectedType) {
        const metric = this.metrics.get(name);
        if (metric === undefined) {
            // Auto-register if it doesn't exist
            this.registerMetric(name, expectedType, `Auto-registered ${expectedType}`);
            return;
        }
        if (metric.type !== expectedType) {
            throw new Error(`Metric '${name}' is registered as '${metric.type}' but used as '${expectedType}'`);
        }
    }
    /**
     * Get bucket key for histogram
     */
    getBucketKey(value) {
        // Simple exponential buckets: 1, 2, 5, 10, 20, 50, 100, ...
        const buckets = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];
        for (const bucket of buckets) {
            if (value <= bucket) {
                return bucket;
            }
        }
        return Infinity;
    }
    /**
     * Calculate percentile from sorted values
     */
    calculatePercentile(sortedValues, percentile) {
        if (sortedValues.length === 0) {
            return 0;
        }
        const index = Math.ceil(sortedValues.length * percentile) - 1;
        return sortedValues[Math.max(0, index)] || 0;
    }
}
//# sourceMappingURL=metrics-collector.js.map