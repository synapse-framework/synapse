/**
 * FID Monitor - First Input Delay monitoring
 */
export class FIDMonitor {
    entries = [];
    observers = [];
    firstInputDetected = false;
    start() {
        if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
            console.warn('FID monitoring not supported in this environment');
            return;
        }
        try {
            const observer = new PerformanceObserver((list) => {
                if (this.firstInputDetected) {
                    return;
                }
                const perfEntries = list.getEntries();
                for (const entry of perfEntries) {
                    if (entry.entryType === 'first-input') {
                        const fidEntry = entry;
                        this.handleEntry({
                            name: fidEntry.name,
                            processingStart: fidEntry.processingStart || fidEntry.startTime,
                            processingEnd: fidEntry.processingEnd || fidEntry.startTime + fidEntry.duration,
                            duration: fidEntry.duration,
                            startTime: fidEntry.startTime
                        });
                        this.firstInputDetected = true;
                    }
                }
            });
            observer.observe({ entryTypes: ['first-input'] });
        }
        catch (error) {
            console.error('Failed to start FID monitoring:', error);
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
        const value = entry.processingStart - entry.startTime;
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
        if (value <= 100) {
            return 'good';
        }
        if (value <= 300) {
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
        return `fid-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
    reset() {
        this.entries = [];
        this.firstInputDetected = false;
    }
}
//# sourceMappingURL=fid-monitor.js.map