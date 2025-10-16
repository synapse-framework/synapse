/**
 * Web Vitals Monitor - Main interface for all web vitals monitoring
 */

import { LCPMonitor, type LCPMetric } from './lcp-monitor.js';
import { FIDMonitor, type FIDMetric } from './fid-monitor.js';
import { CLSMonitor, type CLSMetric } from './cls-monitor.js';
import { FCPMonitor, type FCPMetric } from './fcp-monitor.js';
import { TTFBMonitor, type TTFBMetric } from './ttfb-monitor.js';

export interface WebVitalsConfig {
  readonly enableLCP: boolean;
  readonly enableFID: boolean;
  readonly enableCLS: boolean;
  readonly enableFCP: boolean;
  readonly enableTTFB: boolean;
  readonly reportInterval: number;
  readonly autoReport: boolean;
}

export interface WebVitalsReport {
  readonly lcp: LCPMetric | null;
  readonly fid: FIDMetric | null;
  readonly cls: CLSMetric | null;
  readonly fcp: FCPMetric | null;
  readonly ttfb: TTFBMetric | null;
  readonly timestamp: number;
  readonly score: WebVitalsScore;
}

export interface WebVitalsScore {
  readonly overall: number;
  readonly lcp: number;
  readonly fid: number;
  readonly cls: number;
  readonly fcp: number;
  readonly ttfb: number;
}

export class WebVitalsMonitor {
  private readonly config: WebVitalsConfig;
  private readonly lcpMonitor: LCPMonitor | null = null;
  private readonly fidMonitor: FIDMonitor | null = null;
  private readonly clsMonitor: CLSMonitor | null = null;
  private readonly fcpMonitor: FCPMonitor | null = null;
  private readonly ttfbMonitor: TTFBMonitor | null = null;

  private reportInterval: NodeJS.Timeout | null = null;
  private observers: Array<(report: WebVitalsReport) => void> = [];

  public constructor(config?: Partial<WebVitalsConfig>) {
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

  public start(): void {
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

  public observe(callback: (report: WebVitalsReport) => void): void {
    this.observers.push(callback);
  }

  public getReport(): WebVitalsReport {
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

  private calculateScore(
    lcp: LCPMetric | null,
    fid: FIDMetric | null,
    cls: CLSMetric | null,
    fcp: FCPMetric | null,
    ttfb: TTFBMetric | null
  ): WebVitalsScore {
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

  private ratingToScore(rating: 'good' | 'needs-improvement' | 'poor'): number {
    switch (rating) {
      case 'good':
        return 100;
      case 'needs-improvement':
        return 50;
      case 'poor':
        return 0;
    }
  }

  private triggerReport(): void {
    const report = this.getReport();
    this.notifyObservers(report);
  }

  private notifyObservers(report: WebVitalsReport): void {
    for (const observer of this.observers) {
      observer(report);
    }
  }

  private startAutoReport(): void {
    if (this.reportInterval !== null) {
      return;
    }

    this.reportInterval = setInterval(() => {
      this.triggerReport();
    }, this.config.reportInterval);
  }

  public stopAutoReport(): void {
    if (this.reportInterval !== null) {
      clearInterval(this.reportInterval);
      this.reportInterval = null;
    }
  }

  public reset(): void {
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

  public getConfig(): Readonly<WebVitalsConfig> {
    return { ...this.config };
  }

  public dispose(): void {
    this.stopAutoReport();
    this.reset();
  }
}
