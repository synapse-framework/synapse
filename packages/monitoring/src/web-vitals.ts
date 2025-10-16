/**
 * Web Vitals Monitor
 *
 * Monitor Core Web Vitals (LCP, FID, CLS, FCP, TTFB)
 */

export interface WebVitals {
  readonly lcp?: number; // Largest Contentful Paint
  readonly fid?: number; // First Input Delay
  readonly cls?: number; // Cumulative Layout Shift
  readonly fcp?: number; // First Contentful Paint
  readonly ttfb?: number; // Time to First Byte
}

export class WebVitalsMonitor {
  private readonly vitals: WebVitals = {};
  private isRunning: boolean = false;

  public start(): void {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    console.log('📊 Web Vitals monitor started');
  }

  public stop(): void {
    if (!this.isRunning) {
      return;
    }
    this.isRunning = false;
    console.log('📊 Web Vitals monitor stopped');
  }

  public recordLCP(value: number): void {
    (this.vitals as { lcp: number }).lcp = value;
  }

  public recordFID(value: number): void {
    (this.vitals as { fid: number }).fid = value;
  }

  public recordCLS(value: number): void {
    (this.vitals as { cls: number }).cls = value;
  }

  public recordFCP(value: number): void {
    (this.vitals as { fcp: number }).fcp = value;
  }

  public recordTTFB(value: number): void {
    (this.vitals as { ttfb: number }).ttfb = value;
  }

  public getVitals(): WebVitals {
    return { ...this.vitals };
  }

  public clear(): void {
    Object.keys(this.vitals).forEach(key => {
      delete (this.vitals as Record<string, unknown>)[key];
    });
  }
}
