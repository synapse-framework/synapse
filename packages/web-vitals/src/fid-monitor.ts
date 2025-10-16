/**
 * FID Monitor - First Input Delay monitoring
 */

export interface FIDEntry {
  readonly name: string;
  readonly processingStart: number;
  readonly processingEnd: number;
  readonly duration: number;
  readonly startTime: number;
}

export interface FIDMetric {
  readonly value: number;
  readonly rating: 'good' | 'needs-improvement' | 'poor';
  readonly entries: FIDEntry[];
  readonly delta: number;
  readonly id: string;
  readonly timestamp: number;
}

export class FIDMonitor {
  private entries: FIDEntry[] = [];
  private observers: Array<(metric: FIDMetric) => void> = [];
  private firstInputDetected: boolean = false;

  public start(): void {
    if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
      console.warn('FID monitoring not supported in this environment');
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        if (this.firstInputDetected) {
          return;
        }

        const perfEntries = list.getEntries();

        for (const entry of perfEntries) {
          if (entry.entryType === 'first-input') {
            const fidEntry = entry as PerformanceEventTiming & {
              processingStart?: number;
              processingEnd?: number;
            };

            this.handleEntry({
              name: fidEntry.name,
              processingStart: fidEntry.processingStart || fidEntry.startTime,
              processingEnd: fidEntry.processingEnd || fidEntry.startTime + fidEntry.duration,
              duration: fidEntry.duration,
              startTime: fidEntry.startTime
            });

            this.firstInputDetected = true;
          }
        }
      });

      observer.observe({ entryTypes: ['first-input'] });
    } catch (error) {
      console.error('Failed to start FID monitoring:', error);
    }
  }

  public observe(callback: (metric: FIDMetric) => void): void {
    this.observers.push(callback);
  }

  public getMetric(): FIDMetric | null {
    if (this.entries.length === 0) {
      return null;
    }

    const entry = this.entries[0];
    if (entry === undefined) {
      return null;
    }

    const value = entry.processingStart - entry.startTime;

    return {
      value,
      rating: this.getRating(value),
      entries: [...this.entries],
      delta: value,
      id: this.generateId(),
      timestamp: Date.now()
    };
  }

  private handleEntry(entry: FIDEntry): void {
    this.entries.push(entry);

    const metric = this.getMetric();
    if (metric !== null) {
      this.notifyObservers(metric);
    }
  }

  private getRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 100) {
      return 'good';
    }
    if (value <= 300) {
      return 'needs-improvement';
    }
    return 'poor';
  }

  private notifyObservers(metric: FIDMetric): void {
    for (const observer of this.observers) {
      observer(metric);
    }
  }

  private generateId(): string {
    return `fid-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  public reset(): void {
    this.entries = [];
    this.firstInputDetected = false;
  }
}
