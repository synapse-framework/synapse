/**
 * Metrics Collector
 *
 * Collect and aggregate application metrics
 */

export type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary';

export interface Metric {
  readonly name: string;
  readonly type: MetricType;
  readonly value: number;
  readonly timestamp: number;
  readonly tags?: Record<string, string>;
}

export class MetricsCollector {
  private readonly metrics: Map<string, Metric>;
  private isRunning: boolean = false;

  public constructor() {
    this.metrics = new Map();
  }

  public start(): void {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    console.log('📈 Metrics collector started');
  }

  public stop(): void {
    if (!this.isRunning) {
      return;
    }
    this.isRunning = false;
    console.log('📈 Metrics collector stopped');
  }

  public record(name: string, type: MetricType, value: number, tags?: Record<string, string>): void {
    const metric: Metric = {
      name,
      type,
      value,
      timestamp: Date.now(),
      tags
    };
    this.metrics.set(name, metric);
  }

  public increment(name: string, delta: number = 1): void {
    const existing = this.metrics.get(name);
    const value = existing ? existing.value + delta : delta;
    this.record(name, 'counter', value);
  }

  public gauge(name: string, value: number): void {
    this.record(name, 'gauge', value);
  }

  public histogram(name: string, value: number): void {
    this.record(name, 'histogram', value);
  }

  public get(name: string): Metric | undefined {
    return this.metrics.get(name);
  }

  public getAll(): Metric[] {
    return Array.from(this.metrics.values());
  }

  public clear(): void {
    this.metrics.clear();
  }
}
