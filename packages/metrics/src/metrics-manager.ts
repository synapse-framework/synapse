/**
 * Metrics Manager - Main interface for metrics management
 */

import { MetricsCollector, type Metric, type MetricType } from './metrics-collector.js';
import { MetricsDashboard, type DashboardConfig, type DashboardData } from './metrics-dashboard.js';
import { MetricsAggregator, type AggregationFunction, type AggregationPeriod, type AggregatedMetric } from './metrics-aggregator.js';
import { MetricsExporter, type ExportFormat, type ExportedData } from './metrics-exporter.js';
import { MetricsRegistry, type MetricMetadata, type MetricQuery } from './metrics-registry.js';

export interface MetricsConfig {
  readonly enableAutoCollection: boolean;
  readonly collectionInterval: number;
  readonly enableDashboard: boolean;
  readonly dashboardConfig?: DashboardConfig;
  readonly enableRegistry: boolean;
  readonly defaultCategory: string;
}

export interface MetricsSnapshot {
  readonly timestamp: number;
  readonly metrics: Metric[];
  readonly aggregations: AggregatedMetric[];
  readonly metadata: Record<string, unknown>;
}

export interface MetricsStats {
  readonly totalMetrics: number;
  readonly totalValues: number;
  readonly metricsPerType: Record<MetricType, number>;
  readonly oldestTimestamp: number;
  readonly newestTimestamp: number;
  readonly registryStats?: ReturnType<MetricsRegistry['getStats']>;
}

export class MetricsManager {
  private readonly config: MetricsConfig;
  private readonly collector: MetricsCollector;
  private readonly aggregator: MetricsAggregator;
  private readonly exporter: MetricsExporter;
  private readonly registry: MetricsRegistry | null = null;
  private dashboard: MetricsDashboard | null = null;

  private autoCollectionInterval: NodeJS.Timeout | null = null;
  private systemMetricsEnabled: boolean = false;

  public constructor(config?: Partial<MetricsConfig>) {
    this.config = {
      enableAutoCollection: false,
      collectionInterval: 1000,
      enableDashboard: false,
      enableRegistry: true,
      defaultCategory: 'default',
      ...config
    };

    this.collector = new MetricsCollector();
    this.aggregator = new MetricsAggregator();
    this.exporter = new MetricsExporter();

    if (this.config.enableRegistry) {
      this.registry = new MetricsRegistry();
    }

    if (this.config.enableDashboard && this.config.dashboardConfig !== undefined) {
      this.dashboard = new MetricsDashboard(this.config.dashboardConfig);
    }
  }

  /**
   * Register a new metric
   */
  public registerMetric(
    name: string,
    type: MetricType,
    description: string,
    options: {
      readonly labels?: string[];
      readonly unit?: string;
      readonly category?: string;
      readonly tags?: string[];
    } = {}
  ): void {
    // Register in collector
    this.collector.registerMetric(name, type, description, options.labels, options.unit);

    // Register in registry
    if (this.registry !== null) {
      this.registry.register(name, type, description, {
        unit: options.unit,
        labels: options.labels,
        category: options.category || this.config.defaultCategory,
        tags: options.tags
      });
    }
  }

  /**
   * Increment a counter
   */
  public incrementCounter(name: string, value: number = 1, labels: Record<string, string> = {}): void {
    this.collector.incrementCounter(name, value, labels);
  }

  /**
   * Set a gauge value
   */
  public setGauge(name: string, value: number, labels: Record<string, string> = {}): void {
    this.collector.setGauge(name, value, labels);
  }

  /**
   * Increment a gauge
   */
  public incrementGauge(name: string, value: number = 1, labels: Record<string, string> = {}): void {
    this.collector.incrementGauge(name, value, labels);
  }

  /**
   * Decrement a gauge
   */
  public decrementGauge(name: string, value: number = 1, labels: Record<string, string> = {}): void {
    this.collector.decrementGauge(name, value, labels);
  }

  /**
   * Observe a histogram value
   */
  public observeHistogram(name: string, value: number, labels: Record<string, string> = {}): void {
    this.collector.observeHistogram(name, value, labels);
  }

  /**
   * Observe a summary value
   */
  public observeSummary(name: string, value: number, labels: Record<string, string> = {}): void {
    this.collector.observeSummary(name, value, labels);
  }

  /**
   * Get a metric
   */
  public getMetric(name: string): Metric | undefined {
    return this.collector.getMetric(name);
  }

  /**
   * Get all metrics
   */
  public getAllMetrics(): Metric[] {
    return this.collector.getAllMetrics();
  }

  /**
   * Aggregate a metric
   */
  public aggregate(
    metricName: string,
    period: AggregationPeriod,
    func: AggregationFunction
  ): AggregatedMetric | null {
    const metric = this.collector.getMetric(metricName);
    if (metric === undefined) {
      return null;
    }

    return this.aggregator.aggregate(metric, period, func);
  }

  /**
   * Get aggregation history
   */
  public getAggregationHistory(
    metricName: string,
    period: AggregationPeriod,
    func: AggregationFunction
  ): AggregatedMetric[] {
    return this.aggregator.getAggregationHistory(metricName, period, func);
  }

  /**
   * Export metrics
   */
  public export(format: ExportFormat): ExportedData {
    const metrics = this.collector.getAllMetrics();
    return this.exporter.export(metrics, { format });
  }

  /**
   * Query metrics from registry
   */
  public query(query: MetricQuery): MetricMetadata[] {
    if (this.registry === null) {
      throw new Error('Registry is not enabled');
    }

    return this.registry.query(query);
  }

  /**
   * Get metrics by category
   */
  public getByCategory(category: string): MetricMetadata[] {
    if (this.registry === null) {
      throw new Error('Registry is not enabled');
    }

    return this.registry.getByCategory(category);
  }

  /**
   * Get dashboard data
   */
  public getDashboardData(): DashboardData | null {
    if (this.dashboard === null) {
      return null;
    }

    return this.dashboard.getDashboardData();
  }

  /**
   * Start dashboard auto-refresh
   */
  public startDashboard(): void {
    if (this.dashboard === null) {
      throw new Error('Dashboard is not enabled');
    }

    this.dashboard.startAllRefreshes((name: string) => this.collector.getMetric(name));
  }

  /**
   * Stop dashboard auto-refresh
   */
  public stopDashboard(): void {
    if (this.dashboard !== null) {
      this.dashboard.stopAllRefreshes();
    }
  }

  /**
   * Take a snapshot of all metrics
   */
  public takeSnapshot(): MetricsSnapshot {
    const metrics = this.collector.getAllMetrics();
    const aggregations: AggregatedMetric[] = [];

    // Get common aggregations
    for (const metric of metrics) {
      const hourly = this.aggregator.aggregate(metric, '1h', 'average');
      aggregations.push(hourly);
    }

    return {
      timestamp: Date.now(),
      metrics,
      aggregations,
      metadata: {
        metricsCount: metrics.length,
        registryEnabled: this.registry !== null,
        dashboardEnabled: this.dashboard !== null
      }
    };
  }

  /**
   * Get metrics statistics
   */
  public getStats(): MetricsStats {
    const metrics = this.collector.getAllMetrics();
    let totalValues = 0;
    let oldestTimestamp = Infinity;
    let newestTimestamp = 0;

    const metricsPerType: Record<MetricType, number> = {
      counter: 0,
      gauge: 0,
      histogram: 0,
      summary: 0
    };

    for (const metric of metrics) {
      metricsPerType[metric.type] = (metricsPerType[metric.type] || 0) + 1;
      totalValues += metric.values.length;

      for (const value of metric.values) {
        if (value.timestamp < oldestTimestamp) {
          oldestTimestamp = value.timestamp;
        }
        if (value.timestamp > newestTimestamp) {
          newestTimestamp = value.timestamp;
        }
      }
    }

    return {
      totalMetrics: metrics.length,
      totalValues,
      metricsPerType,
      oldestTimestamp: oldestTimestamp === Infinity ? 0 : oldestTimestamp,
      newestTimestamp,
      registryStats: this.registry?.getStats()
    };
  }

  /**
   * Enable system metrics collection
   */
  public enableSystemMetrics(): void {
    if (this.systemMetricsEnabled) {
      return;
    }

    this.systemMetricsEnabled = true;

    // Register system metrics
    this.registerMetric('system_cpu_usage', 'gauge', 'CPU usage percentage', {
      unit: '%',
      category: 'system'
    });

    this.registerMetric('system_memory_usage', 'gauge', 'Memory usage in bytes', {
      unit: 'bytes',
      category: 'system'
    });

    this.registerMetric('system_memory_total', 'gauge', 'Total memory in bytes', {
      unit: 'bytes',
      category: 'system'
    });

    // Start collection if auto-collection is enabled
    if (this.config.enableAutoCollection) {
      this.startAutoCollection();
    }
  }

  /**
   * Start auto-collection of system metrics
   */
  public startAutoCollection(): void {
    if (this.autoCollectionInterval !== null) {
      return;
    }

    this.autoCollectionInterval = setInterval(() => {
      this.collectSystemMetrics();
    }, this.config.collectionInterval);

    // Collect immediately
    this.collectSystemMetrics();
  }

  /**
   * Stop auto-collection
   */
  public stopAutoCollection(): void {
    if (this.autoCollectionInterval !== null) {
      clearInterval(this.autoCollectionInterval);
      this.autoCollectionInterval = null;
    }
  }

  /**
   * Collect system metrics
   */
  private collectSystemMetrics(): void {
    if (!this.systemMetricsEnabled) {
      return;
    }

    const memUsage = process.memoryUsage();

    // CPU usage approximation (not perfect, but gives an idea)
    const cpuUsage = process.cpuUsage();
    const cpuPercent = (cpuUsage.user + cpuUsage.system) / 1000000; // Convert to seconds

    this.setGauge('system_cpu_usage', cpuPercent);
    this.setGauge('system_memory_usage', memUsage.heapUsed);
    this.setGauge('system_memory_total', memUsage.heapTotal);
  }

  /**
   * Clear all metrics
   */
  public clear(): void {
    this.collector.clear();
    this.aggregator.clear();
    if (this.registry !== null) {
      this.registry.clear();
    }
    if (this.dashboard !== null) {
      this.dashboard.clearData();
    }
  }

  /**
   * Get configuration
   */
  public getConfig(): Readonly<MetricsConfig> {
    return { ...this.config };
  }

  /**
   * Get collector
   */
  public getCollector(): MetricsCollector {
    return this.collector;
  }

  /**
   * Get aggregator
   */
  public getAggregator(): MetricsAggregator {
    return this.aggregator;
  }

  /**
   * Get exporter
   */
  public getExporter(): MetricsExporter {
    return this.exporter;
  }

  /**
   * Get registry
   */
  public getRegistry(): MetricsRegistry | null {
    return this.registry;
  }

  /**
   * Get dashboard
   */
  public getDashboard(): MetricsDashboard | null {
    return this.dashboard;
  }

  /**
   * Dispose and cleanup
   */
  public dispose(): void {
    this.stopAutoCollection();
    this.stopDashboard();
    this.clear();
  }
}
