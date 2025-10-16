/**
 * Performance Monitor
 *
 * Tracks application performance metrics including CPU, memory, and timing
 */

export class PerformanceMonitor {
  private readonly startTime: number;
  private readonly metrics: Map<string, number>;

  public constructor() {
    this.startTime = Date.now();
    this.metrics = new Map();
  }

  public recordMetric(name: string, value: number): void {
    this.metrics.set(name, value);
  }

  public getMetric(name: string): number | undefined {
    return this.metrics.get(name);
  }

  public getMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  public getCPUUsage(): number {
    if (typeof process !== 'undefined' && process.cpuUsage) {
      const usage = process.cpuUsage();
      return (usage.user + usage.system) / 1000000; // Convert to seconds
    }
    return 0;
  }

  public getMemoryUsage(): MemoryUsage {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage();
      return {
        heapUsed: usage.heapUsed,
        heapTotal: usage.heapTotal,
        external: usage.external,
        rss: usage.rss
      };
    }
    return {
      heapUsed: 0,
      heapTotal: 0,
      external: 0,
      rss: 0
    };
  }

  public getUptime(): number {
    return Date.now() - this.startTime;
  }

  public measure(name: string, fn: () => void): number {
    const start = performance.now();
    fn();
    const duration = performance.now() - start;
    this.recordMetric(name, duration);
    return duration;
  }

  public async measureAsync(name: string, fn: () => Promise<void>): Promise<number> {
    const start = performance.now();
    await fn();
    const duration = performance.now() - start;
    this.recordMetric(name, duration);
    return duration;
  }
}

export interface MemoryUsage {
  readonly heapUsed: number;
  readonly heapTotal: number;
  readonly external: number;
  readonly rss: number;
}
