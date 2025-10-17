/**
 * Metrics Aggregator - Aggregate metrics over time periods
 */
export class MetricsAggregator {
    aggregations = new Map();
    /**
     * Aggregate a metric over a time period
     */
    aggregate(metric, period, func, endTime = Date.now()) {
        const startTime = this.getStartTime(endTime, period);
        const values = this.getValuesInRange(metric, startTime, endTime);
        const value = this.calculateAggregation(values, func);
        const aggregated = {
            name: metric.name,
            period,
            function: func,
            value,
            startTime,
            endTime,
            sampleCount: values.length
        };
        // Store aggregation
        const key = this.getAggregationKey(metric.name, period, func);
        const existing = this.aggregations.get(key) || [];
        existing.push(aggregated);
        // Keep only last 1000 aggregations
        if (existing.length > 1000) {
            existing.shift();
        }
        this.aggregations.set(key, existing);
        return aggregated;
    }
    /**
     * Aggregate multiple metrics
     */
    aggregateMultiple(metrics, period, func, endTime = Date.now()) {
        return metrics.map(metric => this.aggregate(metric, period, func, endTime));
    }
    /**
     * Get aggregation history for a metric
     */
    getAggregationHistory(metricName, period, func) {
        const key = this.getAggregationKey(metricName, period, func);
        return this.aggregations.get(key) || [];
    }
    /**
     * Get all aggregations for a metric
     */
    getAllAggregations(metricName) {
        const result = [];
        for (const [key, aggregations] of this.aggregations.entries()) {
            if (key.startsWith(metricName + ':')) {
                result.push(...aggregations);
            }
        }
        return result;
    }
    /**
     * Calculate rolling aggregation
     */
    calculateRolling(metric, period, func, windowSize = 10) {
        const results = [];
        const now = Date.now();
        const periodMs = this.getPeriodMs(period);
        for (let i = 0; i < windowSize; i++) {
            const endTime = now - (i * periodMs);
            const aggregated = this.aggregate(metric, period, func, endTime);
            results.unshift(aggregated);
        }
        return results;
    }
    /**
     * Compare aggregations between two time periods
     */
    compare(metric, period, func, currentEndTime = Date.now(), previousEndTime) {
        const periodMs = this.getPeriodMs(period);
        const prevEnd = previousEndTime || (currentEndTime - periodMs);
        const current = this.aggregate(metric, period, func, currentEndTime);
        const previous = this.aggregate(metric, period, func, prevEnd);
        const difference = current.value - previous.value;
        const percentageChange = previous.value !== 0
            ? (difference / previous.value) * 100
            : 0;
        return {
            current,
            previous,
            difference,
            percentageChange
        };
    }
    /**
     * Get trend analysis
     */
    analyzeTrend(metric, period, func, dataPoints = 10) {
        const aggregations = this.calculateRolling(metric, period, func, dataPoints);
        if (aggregations.length < 2) {
            return {
                trend: 'stable',
                slope: 0,
                aggregations
            };
        }
        // Calculate linear regression slope
        const slope = this.calculateSlope(aggregations.map((a, i) => ({ x: i, y: a.value })));
        const trend = slope > 0.1 ? 'increasing' : slope < -0.1 ? 'decreasing' : 'stable';
        return {
            trend,
            slope,
            aggregations
        };
    }
    /**
     * Clear aggregation history
     */
    clear() {
        this.aggregations.clear();
    }
    /**
     * Clear aggregations for a specific metric
     */
    clearMetric(metricName) {
        for (const key of this.aggregations.keys()) {
            if (key.startsWith(metricName + ':')) {
                this.aggregations.delete(key);
            }
        }
    }
    /**
     * Get values in time range
     */
    getValuesInRange(metric, startTime, endTime) {
        return metric.values
            .filter(v => v.timestamp >= startTime && v.timestamp <= endTime)
            .map(v => v.value);
    }
    /**
     * Calculate aggregation based on function
     */
    calculateAggregation(values, func) {
        if (values.length === 0) {
            return 0;
        }
        switch (func) {
            case 'sum':
                return values.reduce((sum, v) => sum + v, 0);
            case 'average':
                return values.reduce((sum, v) => sum + v, 0) / values.length;
            case 'min':
                return Math.min(...values);
            case 'max':
                return Math.max(...values);
            case 'count':
                return values.length;
            case 'median':
                return this.calculatePercentile(values, 0.5);
            case 'p95':
                return this.calculatePercentile(values, 0.95);
            case 'p99':
                return this.calculatePercentile(values, 0.99);
            default:
                return 0;
        }
    }
    /**
     * Calculate percentile
     */
    calculatePercentile(values, percentile) {
        const sorted = [...values].sort((a, b) => a - b);
        const index = Math.ceil(sorted.length * percentile) - 1;
        return sorted[Math.max(0, index)] || 0;
    }
    /**
     * Calculate linear regression slope
     */
    calculateSlope(points) {
        const n = points.length;
        if (n < 2) {
            return 0;
        }
        const sumX = points.reduce((sum, p) => sum + p.x, 0);
        const sumY = points.reduce((sum, p) => sum + p.y, 0);
        const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
        const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        return slope;
    }
    /**
     * Get start time for period
     */
    getStartTime(endTime, period) {
        const periodMs = this.getPeriodMs(period);
        return endTime - periodMs;
    }
    /**
     * Get period in milliseconds
     */
    getPeriodMs(period) {
        const periods = {
            '1m': 60 * 1000,
            '5m': 5 * 60 * 1000,
            '15m': 15 * 60 * 1000,
            '1h': 60 * 60 * 1000,
            '6h': 6 * 60 * 60 * 1000,
            '24h': 24 * 60 * 60 * 1000,
            '7d': 7 * 24 * 60 * 60 * 1000,
            '30d': 30 * 24 * 60 * 60 * 1000
        };
        return periods[period];
    }
    /**
     * Get aggregation key
     */
    getAggregationKey(name, period, func) {
        return `${name}:${period}:${func}`;
    }
    /**
     * Get aggregation count
     */
    getAggregationCount() {
        return this.aggregations.size;
    }
}
//# sourceMappingURL=metrics-aggregator.js.map