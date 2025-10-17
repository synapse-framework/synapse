/**
 * Metrics Dashboard - Real-time dashboard data structure
 */
export class MetricsDashboard {
    config;
    widgetData = new Map();
    refreshIntervals = new Map();
    constructor(config) {
        this.config = config;
    }
    /**
     * Add a widget to the dashboard
     */
    addWidget(widget) {
        const existingWidget = this.config.widgets.find(w => w.id === widget.id);
        if (existingWidget !== undefined) {
            throw new Error(`Widget with id '${widget.id}' already exists`);
        }
        this.config = {
            ...this.config,
            widgets: [...this.config.widgets, widget]
        };
    }
    /**
     * Remove a widget from the dashboard
     */
    removeWidget(widgetId) {
        this.config = {
            ...this.config,
            widgets: this.config.widgets.filter(w => w.id !== widgetId)
        };
        // Clear widget data and interval
        this.widgetData.delete(widgetId);
        const interval = this.refreshIntervals.get(widgetId);
        if (interval !== undefined) {
            clearInterval(interval);
            this.refreshIntervals.delete(widgetId);
        }
    }
    /**
     * Update widget data
     */
    updateWidgetData(widgetId, data, error) {
        this.widgetData.set(widgetId, {
            widgetId,
            data,
            lastUpdate: Date.now(),
            error
        });
    }
    /**
     * Get widget data
     */
    getWidgetData(widgetId) {
        return this.widgetData.get(widgetId);
    }
    /**
     * Get all widget data
     */
    getAllWidgetData() {
        return new Map(this.widgetData);
    }
    /**
     * Get dashboard data
     */
    getDashboardData() {
        return {
            timestamp: Date.now(),
            widgets: new Map(this.widgetData),
            metadata: {
                widgetCount: this.config.widgets.length,
                theme: this.config.theme,
                autoRefresh: this.config.autoRefresh
            }
        };
    }
    /**
     * Update widget configuration
     */
    updateWidget(widgetId, updates) {
        const widgets = this.config.widgets.map(widget => {
            if (widget.id === widgetId) {
                return { ...widget, ...updates };
            }
            return widget;
        });
        this.config = {
            ...this.config,
            widgets
        };
    }
    /**
     * Get widget by ID
     */
    getWidget(widgetId) {
        return this.config.widgets.find(w => w.id === widgetId);
    }
    /**
     * Get all widgets
     */
    getWidgets() {
        return [...this.config.widgets];
    }
    /**
     * Set dashboard configuration
     */
    setConfig(config) {
        this.config = config;
    }
    /**
     * Get dashboard configuration
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * Start auto-refresh for a widget
     */
    startWidgetRefresh(widgetId, callback) {
        const widget = this.getWidget(widgetId);
        if (widget === undefined) {
            throw new Error(`Widget '${widgetId}' not found`);
        }
        // Clear existing interval if any
        const existingInterval = this.refreshIntervals.get(widgetId);
        if (existingInterval !== undefined) {
            clearInterval(existingInterval);
        }
        // Start new interval
        const interval = setInterval(callback, widget.refreshInterval);
        this.refreshIntervals.set(widgetId, interval);
        // Call immediately
        callback();
    }
    /**
     * Stop auto-refresh for a widget
     */
    stopWidgetRefresh(widgetId) {
        const interval = this.refreshIntervals.get(widgetId);
        if (interval !== undefined) {
            clearInterval(interval);
            this.refreshIntervals.delete(widgetId);
        }
    }
    /**
     * Start all widget refreshes
     */
    startAllRefreshes(getMetric) {
        for (const widget of this.config.widgets) {
            this.startWidgetRefresh(widget.id, () => {
                const metric = getMetric(widget.metricName);
                if (metric !== undefined) {
                    const data = this.prepareWidgetData(widget, metric);
                    this.updateWidgetData(widget.id, data);
                }
                else {
                    this.updateWidgetData(widget.id, null, `Metric '${widget.metricName}' not found`);
                }
            });
        }
    }
    /**
     * Stop all widget refreshes
     */
    stopAllRefreshes() {
        for (const widgetId of this.refreshIntervals.keys()) {
            this.stopWidgetRefresh(widgetId);
        }
    }
    /**
     * Prepare data for widget visualization
     */
    prepareWidgetData(widget, metric) {
        switch (widget.type) {
            case 'number':
                return this.prepareNumberData(metric);
            case 'line':
                return this.prepareLineData(metric);
            case 'bar':
                return this.prepareBarData(metric);
            case 'pie':
                return this.preparePieData(metric);
            case 'gauge':
                return this.prepareGaugeData(metric);
            case 'table':
                return this.prepareTableData(metric);
            default:
                return null;
        }
    }
    /**
     * Prepare data for number widget
     */
    prepareNumberData(metric) {
        const latestValue = metric.values[metric.values.length - 1];
        return {
            value: latestValue?.value || 0,
            unit: metric.unit
        };
    }
    /**
     * Prepare data for line chart widget
     */
    prepareLineData(metric) {
        const recentValues = metric.values.slice(-50);
        return {
            labels: recentValues.map(v => new Date(v.timestamp).toLocaleTimeString()),
            data: recentValues.map(v => v.value)
        };
    }
    /**
     * Prepare data for bar chart widget
     */
    prepareBarData(metric) {
        // Group by labels
        const groups = new Map();
        for (const value of metric.values) {
            const labelKey = Object.keys(value.labels).length > 0
                ? JSON.stringify(value.labels)
                : 'default';
            const existing = groups.get(labelKey) || [];
            existing.push(value.value);
            groups.set(labelKey, existing);
        }
        const labels = [];
        const data = [];
        for (const [label, values] of groups.entries()) {
            labels.push(label);
            const average = values.reduce((sum, v) => sum + v, 0) / values.length;
            data.push(average);
        }
        return { labels, data };
    }
    /**
     * Prepare data for pie chart widget
     */
    preparePieData(metric) {
        return this.prepareBarData(metric); // Similar to bar chart
    }
    /**
     * Prepare data for gauge widget
     */
    prepareGaugeData(metric) {
        const latestValue = metric.values[metric.values.length - 1];
        const allValues = metric.values.map(v => v.value);
        const min = Math.min(...allValues);
        const max = Math.max(...allValues);
        return {
            value: latestValue?.value || 0,
            min,
            max,
            unit: metric.unit
        };
    }
    /**
     * Prepare data for table widget
     */
    prepareTableData(metric) {
        const recentValues = metric.values.slice(-20);
        return {
            columns: ['Time', 'Value', 'Labels'],
            rows: recentValues.map(v => ({
                time: new Date(v.timestamp).toLocaleString(),
                value: v.value,
                labels: JSON.stringify(v.labels)
            }))
        };
    }
    /**
     * Clear all widget data
     */
    clearData() {
        this.widgetData.clear();
    }
    /**
     * Get widget count
     */
    getWidgetCount() {
        return this.config.widgets.length;
    }
}
//# sourceMappingURL=metrics-dashboard.js.map