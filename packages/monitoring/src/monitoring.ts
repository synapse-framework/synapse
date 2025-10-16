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

export interface MonitoringConfig {
  readonly enableProfiling: boolean;
  readonly enableMetrics: boolean;
  readonly enableErrorTracking: boolean;
  readonly enableAlerts: boolean;
  readonly enableWebVitals: boolean;
  readonly enableRUM: boolean;
  readonly sampleRate: number;
  readonly reportingInterval: number;
}

export class SynapseMonitoring {
  private readonly config: MonitoringConfig;
  private readonly performanceMonitor: PerformanceMonitor;
  private readonly profiler: Profiler;
  private readonly metricsCollector: MetricsCollector;
  private readonly errorTracker: ErrorTracker;
  private readonly alertSystem: AlertSystem;
  private readonly webVitals: WebVitalsMonitor;
  private readonly rum: RealUserMonitoring;
  private isRunning: boolean = false;

  public constructor(config: Partial<MonitoringConfig> = {}) {
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

  public start(): void {
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

  public stop(): void {
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

  public getReport(): MonitoringReport {
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

  public getPerformanceMonitor(): PerformanceMonitor {
    return this.performanceMonitor;
  }

  public getProfiler(): Profiler {
    return this.profiler;
  }

  public getMetricsCollector(): MetricsCollector {
    return this.metricsCollector;
  }

  public getErrorTracker(): ErrorTracker {
    return this.errorTracker;
  }

  public getAlertSystem(): AlertSystem {
    return this.alertSystem;
  }

  public getWebVitalsMonitor(): WebVitalsMonitor {
    return this.webVitals;
  }

  public getRUM(): RealUserMonitoring {
    return this.rum;
  }
}

export interface MonitoringReport {
  readonly performance: unknown;
  readonly profiling: unknown;
  readonly metrics: unknown;
  readonly errors: unknown;
  readonly alerts: unknown;
  readonly webVitals: unknown;
  readonly rum: unknown;
}
