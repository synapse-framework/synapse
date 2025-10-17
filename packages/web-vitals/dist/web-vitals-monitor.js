/**
 * Web Vitals Monitor - Main interface for all web vitals monitoring
 */
import { LCPMonitor } from './lcp-monitor.js';
import { FIDMonitor } from './fid-monitor.js';
import { CLSMonitor } from './cls-monitor.js';
import { FCPMonitor } from './fcp-monitor.js';
import { TTFBMonitor } from './ttfb-monitor.js';
export class WebVitalsMonitor {
    config;
    lcpMonitor = null;
    fidMonitor = null;
    clsMonitor = null;
    fcpMonitor = null;
    ttfbMonitor = null;
    reportInterval = null;
    observers = [];
    constructor(config) {
        this.config = {
            enableLCP: true,
            enableFID: true,
            enableCLS: true,
            enableFCP: true,
            enableTTFB: true,
            reportInterval: 5000,
            autoReport: false,
            ...config
        };
        if (this.config.enableLCP) {
            this.lcpMonitor = new LCPMonitor();
        }
        if (this.config.enableFID) {
            this.fidMonitor = new FIDMonitor();
        }
        if (this.config.enableCLS) {
            this.clsMonitor = new CLSMonitor();
        }
        if (this.config.enableFCP) {
            this.fcpMonitor = new FCPMonitor();
        }
        if (this.config.enableTTFB) {
            this.ttfbMonitor = new TTFBMonitor();
        }
    }
    start() {
        if (this.lcpMonitor !== null) {
            this.lcpMonitor.start();
            this.lcpMonitor.observe(() => this.triggerReport());
        }
        if (this.fidMonitor !== null) {
            this.fidMonitor.start();
            this.fidMonitor.observe(() => this.triggerReport());
        }
        if (this.clsMonitor !== null) {
            this.clsMonitor.start();
            this.clsMonitor.observe(() => this.triggerReport());
        }
        if (this.fcpMonitor !== null) {
            this.fcpMonitor.start();
            this.fcpMonitor.observe(() => this.triggerReport());
        }
        if (this.ttfbMonitor !== null) {
            this.ttfbMonitor.start();
            this.ttfbMonitor.observe(() => this.triggerReport());
        }
        if (this.config.autoReport) {
            this.startAutoReport();
        }
    }
    observe(callback) {
        this.observers.push(callback);
    }
    getReport() {
        const lcp = this.lcpMonitor?.getMetric() || null;
        const fid = this.fidMonitor?.getMetric() || null;
        const cls = this.clsMonitor?.getMetric() || null;
        const fcp = this.fcpMonitor?.getMetric() || null;
        const ttfb = this.ttfbMonitor?.getMetric() || null;
        const score = this.calculateScore(lcp, fid, cls, fcp, ttfb);
        return {
            lcp,
            fid,
            cls,
            fcp,
            ttfb,
            timestamp: Date.now(),
            score
        };
    }
    calculateScore(lcp, fid, cls, fcp, ttfb) {
        const lcpScore = lcp !== null ? this.ratingToScore(lcp.rating) : 0;
        const fidScore = fid !== null ? this.ratingToScore(fid.rating) : 0;
        const clsScore = cls !== null ? this.ratingToScore(cls.rating) : 0;
        const fcpScore = fcp !== null ? this.ratingToScore(fcp.rating) : 0;
        const ttfbScore = ttfb !== null ? this.ratingToScore(ttfb.rating) : 0;
        const scores = [lcpScore, fidScore, clsScore, fcpScore, ttfbScore].filter(s => s > 0);
        const overall = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;
        return {
            overall,
            lcp: lcpScore,
            fid: fidScore,
            cls: clsScore,
            fcp: fcpScore,
            ttfb: ttfbScore
        };
    }
    ratingToScore(rating) {
        switch (rating) {
            case 'good':
                return 100;
            case 'needs-improvement':
                return 50;
            case 'poor':
                return 0;
        }
    }
    triggerReport() {
        const report = this.getReport();
        this.notifyObservers(report);
    }
    notifyObservers(report) {
        for (const observer of this.observers) {
            observer(report);
        }
    }
    startAutoReport() {
        if (this.reportInterval !== null) {
            return;
        }
        this.reportInterval = setInterval(() => {
            this.triggerReport();
        }, this.config.reportInterval);
    }
    stopAutoReport() {
        if (this.reportInterval !== null) {
            clearInterval(this.reportInterval);
            this.reportInterval = null;
        }
    }
    reset() {
        if (this.lcpMonitor !== null) {
            this.lcpMonitor.reset();
        }
        if (this.fidMonitor !== null) {
            this.fidMonitor.reset();
        }
        if (this.clsMonitor !== null) {
            this.clsMonitor.reset();
        }
        if (this.fcpMonitor !== null) {
            this.fcpMonitor.reset();
        }
        if (this.ttfbMonitor !== null) {
            this.ttfbMonitor.reset();
        }
        this.observers = [];
    }
    getConfig() {
        return { ...this.config };
    }
    dispose() {
        this.stopAutoReport();
        this.reset();
    }
}
//# sourceMappingURL=web-vitals-monitor.js.map