/**
 * Main Monitoring System
 *
 * Centralized monitoring and observability platform
 */
import { PerformanceMonitor } from './performance-monitor.js';
import { Profiler } from './profiler.js';
import { MetricsCollector } from './metrics.js';
import { ErrorTracker } from './error-tracker.js';
import { AlertSystem } from './alerts.js';
import { WebVitalsMonitor } from './web-vitals.js';
import { RealUserMonitoring } from './rum.js';
export class SynapseMonitoring {
    config;
    performanceMonitor;
    profiler;
    metricsCollector;
    errorTracker;
    alertSystem;
    webVitals;
    rum;
    isRunning = false;
    constructor(config = {}) {
        this.config = {
            enableProfiling: true,
            enableMetrics: true,
            enableErrorTracking: true,
            enableAlerts: true,
            enableWebVitals: true,
            enableRUM: true,
            sampleRate: 1.0,
            reportingInterval: 60000, // 1 minute
            ...config
        };
        this.performanceMonitor = new PerformanceMonitor();
        this.profiler = new Profiler({ enabled: this.config.enableProfiling });
        this.metricsCollector = new MetricsCollector();
        this.errorTracker = new ErrorTracker();
        this.alertSystem = new AlertSystem();
        this.webVitals = new WebVitalsMonitor();
        this.rum = new RealUserMonitoring();
    }
    start() {
        if (this.isRunning) {
            return;
        }
        console.log('🚀 Starting Synapse Monitoring System...');
        if (this.config.enableProfiling) {
            this.profiler.start();
        }
        if (this.config.enableMetrics) {
            this.metricsCollector.start();
        }
        if (this.config.enableErrorTracking) {
            this.errorTracker.start();
        }
        if (this.config.enableAlerts) {
            this.alertSystem.start();
        }
        if (this.config.enableWebVitals) {
            this.webVitals.start();
        }
        if (this.config.enableRUM) {
            this.rum.start();
        }
        this.isRunning = true;
        console.log('✅ Monitoring system started successfully!');
    }
    stop() {
        if (!this.isRunning) {
            return;
        }
        console.log('🛑 Stopping Synapse Monitoring System...');
        this.profiler.stop();
        this.metricsCollector.stop();
        this.errorTracker.stop();
        this.alertSystem.stop();
        this.webVitals.stop();
        this.rum.stop();
        this.isRunning = false;
        console.log('✅ Monitoring system stopped successfully!');
    }
    getReport() {
        return {
            performance: this.performanceMonitor.getMetrics(),
            profiling: this.profiler.getResults(),
            metrics: this.metricsCollector.getAll(),
            errors: this.errorTracker.getErrors(),
            alerts: this.alertSystem.getAlerts(),
            webVitals: this.webVitals.getVitals(),
            rum: this.rum.getData()
        };
    }
    getPerformanceMonitor() {
        return this.performanceMonitor;
    }
    getProfiler() {
        return this.profiler;
    }
    getMetricsCollector() {
        return this.metricsCollector;
    }
    getErrorTracker() {
        return this.errorTracker;
    }
    getAlertSystem() {
        return this.alertSystem;
    }
    getWebVitalsMonitor() {
        return this.webVitals;
    }
    getRUM() {
        return this.rum;
    }
}
//# sourceMappingURL=monitoring.js.map