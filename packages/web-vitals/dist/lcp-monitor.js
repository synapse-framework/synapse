/**
 * LCP Monitor - Largest Contentful Paint monitoring
 */
export class LCPMonitor {
    entries = [];
    observers = [];
    lastValue = 0;
    start() {
        if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
            console.warn('LCP monitoring not supported in this environment');
            return;
        }
        try {
            const observer = new PerformanceObserver((list) => {
                const perfEntries = list.getEntries();
                for (const entry of perfEntries) {
                    if (entry.entryType === 'largest-contentful-paint') {
                        const lcpEntry = entry;
                        this.handleEntry({
                            element: lcpEntry.element?.tagName || 'unknown',
                            url: lcpEntry.url,
                            size: lcpEntry.size || 0,
                            renderTime: lcpEntry.renderTime || lcpEntry.startTime,
                            loadTime: lcpEntry.loadTime || lcpEntry.startTime
                        });
                    }
                }
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
        catch (error) {
            console.error('Failed to start LCP monitoring:', error);
        }
    }
    observe(callback) {
        this.observers.push(callback);
    }
    getMetric() {
        if (this.entries.length === 0) {
            return null;
        }
        const latestEntry = this.entries[this.entries.length - 1];
        if (latestEntry === undefined) {
            return null;
        }
        const value = latestEntry.renderTime || latestEntry.loadTime;
        const delta = value - this.lastValue;
        return {
            value,
            rating: this.getRating(value),
            entries: [...this.entries],
            delta,
            id: this.generateId(),
            timestamp: Date.now()
        };
    }
    handleEntry(entry) {
        this.entries.push(entry);
        const metric = this.getMetric();
        if (metric !== null) {
            this.lastValue = metric.value;
            this.notifyObservers(metric);
        }
    }
    getRating(value) {
        if (value <= 2500) {
            return 'good';
        }
        if (value <= 4000) {
            return 'needs-improvement';
        }
        return 'poor';
    }
    notifyObservers(metric) {
        for (const observer of this.observers) {
            observer(metric);
        }
    }
    generateId() {
        return `lcp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
    reset() {
        this.entries = [];
        this.lastValue = 0;
    }
}
//# sourceMappingURL=lcp-monitor.js.map