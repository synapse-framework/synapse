/**
 * TTFB Monitor - Time to First Byte monitoring
 */
export class TTFBMonitor {
    entries = [];
    observers = [];
    start() {
        if (typeof window === 'undefined' || typeof performance === 'undefined') {
            console.warn('TTFB monitoring not supported in this environment');
            return;
        }
        try {
            // Use Navigation Timing API
            const navigationEntry = performance.getEntriesByType('navigation')[0];
            if (navigationEntry !== undefined) {
                this.handleEntry({
                    name: 'navigation',
                    startTime: navigationEntry.startTime,
                    duration: navigationEntry.duration,
                    responseStart: navigationEntry.responseStart,
                    requestStart: navigationEntry.requestStart
                });
            }
            // Also observe with PerformanceObserver for future navigations
            if (typeof PerformanceObserver !== 'undefined') {
                const observer = new PerformanceObserver((list) => {
                    const perfEntries = list.getEntries();
                    for (const entry of perfEntries) {
                        if (entry.entryType === 'navigation') {
                            const navEntry = entry;
                            this.handleEntry({
                                name: navEntry.name,
                                startTime: navEntry.startTime,
                                duration: navEntry.duration,
                                responseStart: navEntry.responseStart,
                                requestStart: navEntry.requestStart
                            });
                        }
                    }
                });
                observer.observe({ entryTypes: ['navigation'] });
            }
        }
        catch (error) {
            console.error('Failed to start TTFB monitoring:', error);
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
        const value = entry.responseStart - entry.requestStart;
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
        if (value <= 800) {
            return 'good';
        }
        if (value <= 1800) {
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
        return `ttfb-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
    reset() {
        this.entries = [];
    }
}
//# sourceMappingURL=ttfb-monitor.js.map