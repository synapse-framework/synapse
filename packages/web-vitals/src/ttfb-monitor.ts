/**
 * TTFB Monitor - Time to First Byte monitoring
 */

export interface TTFBEntry {
  readonly name: string;
  readonly startTime: number;
  readonly duration: number;
  readonly responseStart: number;
  readonly requestStart: number;
}

export interface TTFBMetric {
  readonly value: number;
  readonly rating: 'good' | 'needs-improvement' | 'poor';
  readonly entries: TTFBEntry[];
  readonly delta: number;
  readonly id: string;
  readonly timestamp: number;
}

export class TTFBMonitor {
  private entries: TTFBEntry[] = [];
  private observers: Array<(metric: TTFBMetric) => void> = [];

  public start(): void {
    if (typeof window === 'undefined' || typeof performance === 'undefined') {
      console.warn('TTFB monitoring not supported in this environment');
      return;
    }

    try {
      // Use Navigation Timing API
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      if (navigationEntry !== undefined) {
        this.handleEntry({
          name: 'navigation',
          startTime: navigationEntry.startTime,
          duration: navigationEntry.duration,
          responseStart: navigationEntry.responseStart,
          requestStart: navigationEntry.requestStart
        });
      }

      // Also observe with PerformanceObserver for future navigations
      if (typeof PerformanceObserver !== 'undefined') {
        const observer = new PerformanceObserver((list) => {
          const perfEntries = list.getEntries();

          for (const entry of perfEntries) {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;

              this.handleEntry({
                name: navEntry.name,
                startTime: navEntry.startTime,
                duration: navEntry.duration,
                responseStart: navEntry.responseStart,
                requestStart: navEntry.requestStart
              });
            }
          }
        });

        observer.observe({ entryTypes: ['navigation'] });
      }
    } catch (error) {
      console.error('Failed to start TTFB monitoring:', error);
    }
  }

  public observe(callback: (metric: TTFBMetric) => void): void {
    this.observers.push(callback);
  }

  public getMetric(): TTFBMetric | null {
    if (this.entries.length === 0) {
      return null;
    }

    const entry = this.entries[0];
    if (entry === undefined) {
      return null;
    }

    const value = entry.responseStart - entry.requestStart;

    return {
      value,
      rating: this.getRating(value),
      entries: [...this.entries],
      delta: value,
      id: this.generateId(),
      timestamp: Date.now()
    };
  }

  private handleEntry(entry: TTFBEntry): void {
    this.entries.push(entry);

    const metric = this.getMetric();
    if (metric !== null) {
      this.notifyObservers(metric);
    }
  }

  private getRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 800) {
      return 'good';
    }
    if (value <= 1800) {
      return 'needs-improvement';
    }
    return 'poor';
  }

  private notifyObservers(metric: TTFBMetric): void {
    for (const observer of this.observers) {
      observer(metric);
    }
  }

  private generateId(): string {
    return `ttfb-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  public reset(): void {
    this.entries = [];
  }
}
