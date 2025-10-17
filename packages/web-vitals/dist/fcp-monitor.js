/**
 * FCP Monitor - First Contentful Paint monitoring
 */
export class FCPMonitor {
    entries = [];
    observers = [];
    fcpDetected = false;
    start() {
        if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
            console.warn('FCP monitoring not supported in this environment');
            return;
        }
        try {
            const observer = new PerformanceObserver((list) => {
                if (this.fcpDetected) {
                    return;
                }
                const perfEntries = list.getEntries();
                for (const entry of perfEntries) {
                    if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
                        this.handleEntry({
                            name: entry.name,
                            startTime: entry.startTime,
                            duration: entry.duration
                        });
                        this.fcpDetected = true;
                    }
                }
            });
            observer.observe({ entryTypes: ['paint'] });
        }
        catch (error) {
            console.error('Failed to start FCP monitoring:', error);
        }
    }
    observe(callback) {
        this.observers.push(callback);
    }
    getMetric() {
        if (this.entries.length === 0) {
            return null;
        }
        const entry = this.entries[0];
        if (entry === undefined) {
            return null;
        }
        const value = entry.startTime;
        return {
            value,
            rating: this.getRating(value),
            entries: [...this.entries],
            delta: value,
            id: this.generateId(),
            timestamp: Date.now()
        };
    }
    handleEntry(entry) {
        this.entries.push(entry);
        const metric = this.getMetric();
        if (metric !== null) {
            this.notifyObservers(metric);
        }
    }
    getRating(value) {
        if (value <= 1800) {
            return 'good';
        }
        if (value <= 3000) {
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
        return `fcp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
    reset() {
        this.entries = [];
        this.fcpDetected = false;
    }
}
//# sourceMappingURL=fcp-monitor.js.map