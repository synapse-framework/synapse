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
export declare class ErrorTracker {
    private readonly errors;
    private isRunning;
    start(): void;
    stop(): void;
    track(error: Error | unknown, severity?: ErrorSeverity, context?: Record<string, unknown>): void;
    getErrors(severity?: ErrorSeverity): ErrorReport[];
    clear(): void;
}
//# sourceMappingURL=error-tracker.d.ts.map