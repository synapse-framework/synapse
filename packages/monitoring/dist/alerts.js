/**
 * Alert System
 *
 * Intelligent alerting and notification system
 */
export class AlertSystem {
    alerts = [];
    handlers = new Map();
    isRunning = false;
    start() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        console.log('🔔 Alert system started');
    }
    stop() {
        if (!this.isRunning) {
            return;
        }
        this.isRunning = false;
        console.log('🔔 Alert system stopped');
    }
    trigger(level, message, source, metadata) {
        const alert = {
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
    on(level, handler) {
        if (!this.handlers.has(level)) {
            this.handlers.set(level, []);
        }
        this.handlers.get(level)?.push(handler);
    }
    getAlerts(level) {
        if (level) {
            return this.alerts.filter(a => a.level === level);
        }
        return [...this.alerts];
    }
    clear() {
        this.alerts.length = 0;
    }
}
//# sourceMappingURL=alerts.js.map