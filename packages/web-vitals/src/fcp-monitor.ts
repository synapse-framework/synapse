/**
 * FCP Monitor - First Contentful Paint monitoring
 */

export interface FCPEntry {
  readonly name: string;
  readonly startTime: number;
  readonly duration: number;
}

export interface FCPMetric {
  readonly value: number;
  readonly rating: 'good' | 'needs-improvement' | 'poor';
  readonly entries: FCPEntry[];
  readonly delta: number;
  readonly id: string;
  readonly timestamp: number;
}

export class FCPMonitor {
  private entries: FCPEntry[] = [];
  private observers: Array<(metric: FCPMetric) => void> = [];
  private fcpDetected: boolean = false;

  public start(): void {
    if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
      console.warn('FCP monitoring not supported in this environment');
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        if (this.fcpDetected) {
          return;
        }

        const perfEntries = list.getEntries();

        for (const entry of perfEntries) {
          if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
            this.handleEntry({
              name: entry.name,
              startTime: entry.startTime,
              duration: entry.duration
            });

            this.fcpDetected = true;
          }
        }
      });

      observer.observe({ entryTypes: ['paint'] });
    } catch (error) {
      console.error('Failed to start FCP monitoring:', error);
    }
  }

  public observe(callback: (metric: FCPMetric) => void): void {
    this.observers.push(callback);
  }

  public getMetric(): FCPMetric | null {
    if (this.entries.length === 0) {
      return null;
    }

    const entry = this.entries[0];
    if (entry === undefined) {
      return null;
    }

    const value = entry.startTime;

    return {
      value,
      rating: this.getRating(value),
      entries: [...this.entries],
      delta: value,
      id: this.generateId(),
      timestamp: Date.now()
    };
  }

  private handleEntry(entry: FCPEntry): void {
    this.entries.push(entry);

    const metric = this.getMetric();
    if (metric !== null) {
      this.notifyObservers(metric);
    }
  }

  private getRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 1800) {
      return 'good';
    }
    if (value <= 3000) {
      return 'needs-improvement';
    }
    return 'poor';
  }

  private notifyObservers(metric: FCPMetric): void {
    for (const observer of this.observers) {
      observer(metric);
    }
  }

  private generateId(): string {
    return `fcp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  public reset(): void {
    this.entries = [];
    this.fcpDetected = false;
  }
}
