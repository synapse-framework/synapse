/**
 * Alert System
 *
 * Intelligent alerting and notification system
 */
export type AlertLevel = 'info' | 'warning' | 'error' | 'critical';
export interface Alert {
    readonly id: string;
    readonly level: AlertLevel;
    readonly message: string;
    readonly timestamp: number;
    readonly source?: string;
    readonly metadata?: Record<string, unknown>;
}
export declare class AlertSystem {
    private readonly alerts;
    private readonly handlers;
    private isRunning;
    start(): void;
    stop(): void;
    trigger(level: AlertLevel, message: string, source?: string, metadata?: Record<string, unknown>): void;
    on(level: AlertLevel, handler: (alert: Alert) => void): void;
    getAlerts(level?: AlertLevel): Alert[];
    clear(): void;
}
//# sourceMappingURL=alerts.d.ts.map