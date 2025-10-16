/**
 * LCP Monitor - Largest Contentful Paint monitoring
 */

export interface LCPEntry {
  readonly element: string;
  readonly url?: string;
  readonly size: number;
  readonly renderTime: number;
  readonly loadTime: number;
}

export interface LCPMetric {
  readonly value: number;
  readonly rating: 'good' | 'needs-improvement' | 'poor';
  readonly entries: LCPEntry[];
  readonly delta: number;
  readonly id: string;
  readonly timestamp: number;
}

export class LCPMonitor {
  private entries: LCPEntry[] = [];
  private observers: Array<(metric: LCPMetric) => void> = [];
  private lastValue: number = 0;

  public start(): void {
    if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
      console.warn('LCP monitoring not supported in this environment');
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        const perfEntries = list.getEntries();

        for (const entry of perfEntries) {
          if (entry.entryType === 'largest-contentful-paint') {
            const lcpEntry = entry as PerformancePaintTiming & {
              element?: Element;
              url?: string;
              size?: number;
              renderTime?: number;
              loadTime?: number;
            };

            this.handleEntry({
              element: lcpEntry.element?.tagName || 'unknown',
              url: lcpEntry.url,
              size: lcpEntry.size || 0,
              renderTime: lcpEntry.renderTime || lcpEntry.startTime,
              loadTime: lcpEntry.loadTime || lcpEntry.startTime
            });
          }
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      console.error('Failed to start LCP monitoring:', error);
    }
  }

  public observe(callback: (metric: LCPMetric) => void): void {
    this.observers.push(callback);
  }

  public getMetric(): LCPMetric | null {
    if (this.entries.length === 0) {
      return null;
    }

    const latestEntry = this.entries[this.entries.length - 1];
    if (latestEntry === undefined) {
      return null;
    }

    const value = latestEntry.renderTime || latestEntry.loadTime;
    const delta = value - this.lastValue;

    return {
      value,
      rating: this.getRating(value),
      entries: [...this.entries],
      delta,
      id: this.generateId(),
      timestamp: Date.now()
    };
  }

  private handleEntry(entry: LCPEntry): void {
    this.entries.push(entry);

    const metric = this.getMetric();
    if (metric !== null) {
      this.lastValue = metric.value;
      this.notifyObservers(metric);
    }
  }

  private getRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 2500) {
      return 'good';
    }
    if (value <= 4000) {
      return 'needs-improvement';
    }
    return 'poor';
  }

  private notifyObservers(metric: LCPMetric): void {
    for (const observer of this.observers) {
      observer(metric);
    }
  }

  private generateId(): string {
    return `lcp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  public reset(): void {
    this.entries = [];
    this.lastValue = 0;
  }
}
