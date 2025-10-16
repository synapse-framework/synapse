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

export class AlertSystem {
  private readonly alerts: Alert[] = [];
  private readonly handlers: Map<AlertLevel, Array<(alert: Alert) => void>> = new Map();
  private isRunning: boolean = false;

  public start(): void {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    console.log('🔔 Alert system started');
  }

  public stop(): void {
    if (!this.isRunning) {
      return;
    }
    this.isRunning = false;
    console.log('🔔 Alert system stopped');
  }

  public trigger(level: AlertLevel, message: string, source?: string, metadata?: Record<string, unknown>): void {
    const alert: Alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      level,
      message,
      timestamp: Date.now(),
      source,
      metadata
    };

    this.alerts.push(alert);

    // Call handlers
    const handlers = this.handlers.get(level);
    if (handlers) {
      handlers.forEach(handler => handler(alert));
    }

    // Log based on level
    switch (level) {
      case 'critical':
      case 'error':
        console.error(`🔔 [${level.toUpperCase()}] ${message}`);
        break;
      case 'warning':
        console.warn(`🔔 [WARNING] ${message}`);
        break;
      default:
        console.log(`🔔 [INFO] ${message}`);
    }
  }

  public on(level: AlertLevel, handler: (alert: Alert) => void): void {
    if (!this.handlers.has(level)) {
      this.handlers.set(level, []);
    }
    this.handlers.get(level)?.push(handler);
  }

  public getAlerts(level?: AlertLevel): Alert[] {
    if (level) {
      return this.alerts.filter(a => a.level === level);
    }
    return [...this.alerts];
  }

  public clear(): void {
    this.alerts.length = 0;
  }
}
