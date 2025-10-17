/**
 * Real User Monitoring (RUM)
 *
 * Monitor real user interactions and experience
 */
export class RealUserMonitoring {
    sessions = new Map();
    currentSessionId = '';
    isRunning = false;
    start() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        this.currentSessionId = this.generateSessionId();
        console.log('👤 Real User Monitoring started');
    }
    stop() {
        if (!this.isRunning) {
            return;
        }
        this.isRunning = false;
        console.log('👤 Real User Monitoring stopped');
    }
    generateSessionId() {
        return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    trackPageView() {
        const session = this.sessions.get(this.currentSessionId);
        if (session) {
            this.sessions.set(this.currentSessionId, {
                ...session,
                pageViews: session.pageViews + 1
            });
        }
        else {
            this.sessions.set(this.currentSessionId, {
                sessionId: this.currentSessionId,
                pageViews: 1,
                interactions: 0,
                errors: 0,
                averageLoadTime: 0
            });
        }
    }
    trackInteraction() {
        const session = this.sessions.get(this.currentSessionId);
        if (session) {
            this.sessions.set(this.currentSessionId, {
                ...session,
                interactions: session.interactions + 1
            });
        }
    }
    trackError() {
        const session = this.sessions.get(this.currentSessionId);
        if (session) {
            this.sessions.set(this.currentSessionId, {
                ...session,
                errors: session.errors + 1
            });
        }
    }
    getData() {
        return this.sessions.get(this.currentSessionId);
    }
    getAllSessions() {
        return Array.from(this.sessions.values());
    }
    clear() {
        this.sessions.clear();
    }
}
//# sourceMappingURL=rum.js.map