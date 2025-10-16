/**
 * CLS Monitor - Cumulative Layout Shift monitoring
 */

export interface LayoutShift {
  readonly value: number;
  readonly hadRecentInput: boolean;
  readonly startTime: number;
  readonly sources: Array<{
    readonly node?: string;
    readonly previousRect?: DOMRect;
    readonly currentRect?: DOMRect;
  }>;
}

export interface CLSEntry {
  readonly value: number;
  readonly hadRecentInput: boolean;
  readonly startTime: number;
  readonly sources: LayoutShift['sources'];
}

export interface CLSMetric {
  readonly value: number;
  readonly rating: 'good' | 'needs-improvement' | 'poor';
  readonly entries: CLSEntry[];
  readonly delta: number;
  readonly id: string;
  readonly timestamp: number;
}

export class CLSMonitor {
  private entries: CLSEntry[] = [];
  private observers: Array<(metric: CLSMetric) => void> = [];
  private sessionValue: number = 0;
  private sessionEntries: CLSEntry[] = [];

  public start(): void {
    if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
      console.warn('CLS monitoring not supported in this environment');
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        const perfEntries = list.getEntries();

        for (const entry of perfEntries) {
          if (entry.entryType === 'layout-shift') {
            const clsEntry = entry as PerformanceEntry & {
              value?: number;
              hadRecentInput?: boolean;
              sources?: Array<{
                node?: Element;
                previousRect?: DOMRect;
                currentRect?: DOMRect;
              }>;
            };

            // Only count layout shifts without recent input
            if (!clsEntry.hadRecentInput) {
              this.handleEntry({
                value: clsEntry.value || 0,
                hadRecentInput: clsEntry.hadRecentInput || false,
                startTime: clsEntry.startTime,
                sources: (clsEntry.sources || []).map(source => ({
                  node: source.node?.tagName,
                  previousRect: source.previousRect,
                  currentRect: source.currentRect
                }))
              });
            }
          }
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.error('Failed to start CLS monitoring:', error);
    }
  }

  public observe(callback: (metric: CLSMetric) => void): void {
    this.observers.push(callback);
  }

  public getMetric(): CLSMetric | null {
    if (this.sessionEntries.length === 0) {
      return null;
    }

    return {
      value: this.sessionValue,
      rating: this.getRating(this.sessionValue),
      entries: [...this.sessionEntries],
      delta: this.sessionEntries[this.sessionEntries.length - 1]?.value || 0,
      id: this.generateId(),
      timestamp: Date.now()
    };
  }

  private handleEntry(entry: CLSEntry): void {
    this.sessionEntries.push(entry);
    this.sessionValue += entry.value;

    const metric = this.getMetric();
    if (metric !== null) {
      this.notifyObservers(metric);
    }
  }

  private getRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 0.1) {
      return 'good';
    }
    if (value <= 0.25) {
      return 'needs-improvement';
    }
    return 'poor';
  }

  private notifyObservers(metric: CLSMetric): void {
    for (const observer of this.observers) {
      observer(metric);
    }
  }

  private generateId(): string {
    return `cls-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  public reset(): void {
    this.entries = [];
    this.sessionValue = 0;
    this.sessionEntries = [];
  }

  public getCurrentValue(): number {
    return this.sessionValue;
  }
}
