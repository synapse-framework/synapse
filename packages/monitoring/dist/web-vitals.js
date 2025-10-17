/**
 * Web Vitals Monitor
 *
 * Monitor Core Web Vitals (LCP, FID, CLS, FCP, TTFB)
 */
export class WebVitalsMonitor {
    vitals = {};
    isRunning = false;
    start() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        console.log('📊 Web Vitals monitor started');
    }
    stop() {
        if (!this.isRunning) {
            return;
        }
        this.isRunning = false;
        console.log('📊 Web Vitals monitor stopped');
    }
    recordLCP(value) {
        this.vitals.lcp = value;
    }
    recordFID(value) {
        this.vitals.fid = value;
    }
    recordCLS(value) {
        this.vitals.cls = value;
    }
    recordFCP(value) {
        this.vitals.fcp = value;
    }
    recordTTFB(value) {
        this.vitals.ttfb = value;
    }
    getVitals() {
        return { ...this.vitals };
    }
    clear() {
        Object.keys(this.vitals).forEach(key => {
            delete this.vitals[key];
        });
    }
}
//# sourceMappingURL=web-vitals.js.map