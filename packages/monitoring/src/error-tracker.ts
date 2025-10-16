/**
 * Error Tracker
 *
 * Track and report application errors
 */

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorReport {
  readonly message: string;
  readonly stack?: string;
  readonly severity: ErrorSeverity;
  readonly timestamp: number;
  readonly context?: Record<string, unknown>;
  readonly userId?: string;
  readonly sessionId?: string;
}

export class ErrorTracker {
  private readonly errors: ErrorReport[] = [];
  private isRunning: boolean = false;

  public start(): void {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;

    // Install global error handlers
    if (typeof process !== 'undefined') {
      process.on('uncaughtException', (error) => {
        this.track(error, 'critical');
      });
      process.on('unhandledRejection', (reason) => {
        this.track(reason as Error, 'high');
      });
    }

    console.log('🚨 Error tracker started');
  }

  public stop(): void {
    if (!this.isRunning) {
      return;
    }
    this.isRunning = false;
    console.log('🚨 Error tracker stopped');
  }

  public track(error: Error | unknown, severity: ErrorSeverity = 'medium', context?: Record<string, unknown>): void {
    const report: ErrorReport = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      severity,
      timestamp: Date.now(),
      context
    };

    this.errors.push(report);

    // Log based on severity
    if (severity === 'critical' || severity === 'high') {
      console.error('🚨 Error tracked:', report.message);
    }
  }

  public getErrors(severity?: ErrorSeverity): ErrorReport[] {
    if (severity) {
      return this.errors.filter(e => e.severity === severity);
    }
    return [...this.errors];
  }

  public clear(): void {
    this.errors.length = 0;
  }
}
