/**
 * CLS Monitor - Cumulative Layout Shift monitoring
 */
export class CLSMonitor {
    entries = [];
    observers = [];
    sessionValue = 0;
    sessionEntries = [];
    start() {
        if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
            console.warn('CLS monitoring not supported in this environment');
            return;
        }
        try {
            const observer = new PerformanceObserver((list) => {
                const perfEntries = list.getEntries();
                for (const entry of perfEntries) {
                    if (entry.entryType === 'layout-shift') {
                        const clsEntry = entry;
                        // Only count layout shifts without recent input
                        if (!clsEntry.hadRecentInput) {
                            this.handleEntry({
                                value: clsEntry.value || 0,
                                hadRecentInput: clsEntry.hadRecentInput || false,
                                startTime: clsEntry.startTime,
                                sources: (clsEntry.sources || []).map(source => ({
                                    node: source.node?.tagName,
                                    previousRect: source.previousRect,
                                    currentRect: source.currentRect
                                }))
                            });
                        }
                    }
                }
            });
            observer.observe({ entryTypes: ['layout-shift'] });
        }
        catch (error) {
            console.error('Failed to start CLS monitoring:', error);
        }
    }
    observe(callback) {
        this.observers.push(callback);
    }
    getMetric() {
        if (this.sessionEntries.length === 0) {
            return null;
        }
        return {
            value: this.sessionValue,
            rating: this.getRating(this.sessionValue),
            entries: [...this.sessionEntries],
            delta: this.sessionEntries[this.sessionEntries.length - 1]?.value || 0,
            id: this.generateId(),
            timestamp: Date.now()
        };
    }
    handleEntry(entry) {
        this.sessionEntries.push(entry);
        this.sessionValue += entry.value;
        const metric = this.getMetric();
        if (metric !== null) {
            this.notifyObservers(metric);
        }
    }
    getRating(value) {
        if (value <= 0.1) {
            return 'good';
        }
        if (value <= 0.25) {
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
        return `cls-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
    reset() {
        this.entries = [];
        this.sessionValue = 0;
        this.sessionEntries = [];
    }
    getCurrentValue() {
        return this.sessionValue;
    }
}
//# sourceMappingURL=cls-monitor.js.map