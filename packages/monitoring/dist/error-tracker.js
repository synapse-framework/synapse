/**
 * Error Tracker
 *
 * Track and report application errors
 */
export class ErrorTracker {
    errors = [];
    isRunning = false;
    start() {
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
                this.track(reason, 'high');
            });
        }
        console.log('🚨 Error tracker started');
    }
    stop() {
        if (!this.isRunning) {
            return;
        }
        this.isRunning = false;
        console.log('🚨 Error tracker stopped');
    }
    track(error, severity = 'medium', context) {
        const report = {
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
    getErrors(severity) {
        if (severity) {
            return this.errors.filter(e => e.severity === severity);
        }
        return [...this.errors];
    }
    clear() {
        this.errors.length = 0;
    }
}
//# sourceMappingURL=error-tracker.js.map