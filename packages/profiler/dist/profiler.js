/**
 * Main Profiler - Unified interface for all profiling capabilities
 */
import { CPUProfiler } from './cpu-profiler.js';
import { MemoryProfiler } from './memory-profiler.js';
import { NetworkProfiler } from './network-profiler.js';
import { ProfilerReporter } from './profiler-reporter.js';
export class Profiler {
    config;
    cpuProfiler = null;
    memoryProfiler = null;
    networkProfiler = null;
    reporter;
    isRunning = false;
    currentSessionId = null;
    sessions = [];
    stats = {
        sessionsCompleted: 0,
        totalProfilingTime: 0,
        cpuProfilesGenerated: 0,
        memoryProfilesGenerated: 0,
        networkProfilesGenerated: 0,
        reportsGenerated: 0
    };
    constructor(config) {
        this.config = {
            enableCPU: true,
            enableMemory: true,
            enableNetwork: true,
            cpuSampleInterval: 1,
            memorySampleInterval: 100,
            autoReport: false,
            reportFormat: 'json',
            ...config
        };
        if (this.config.enableCPU) {
            this.cpuProfiler = new CPUProfiler(this.config.cpuSampleInterval);
        }
        if (this.config.enableMemory) {
            this.memoryProfiler = new MemoryProfiler(this.config.memorySampleInterval);
        }
        if (this.config.enableNetwork) {
            this.networkProfiler = new NetworkProfiler();
        }
        this.reporter = new ProfilerReporter();
    }
    /**
     * Start profiling session
     */
    start() {
        if (this.isRunning) {
            throw new Error('Profiler is already running');
        }
        this.isRunning = true;
        this.currentSessionId = this.generateSessionId();
        if (this.cpuProfiler !== null) {
            this.cpuProfiler.start();
        }
        if (this.memoryProfiler !== null) {
            this.memoryProfiler.start();
        }
        if (this.networkProfiler !== null) {
            this.networkProfiler.start();
        }
        return this.currentSessionId;
    }
    /**
     * Stop profiling session and return results
     */
    stop() {
        if (!this.isRunning) {
            throw new Error('Profiler is not running');
        }
        this.isRunning = false;
        const cpuProfile = this.cpuProfiler !== null ? this.cpuProfiler.stop() : null;
        const memoryProfile = this.memoryProfiler !== null ? this.memoryProfiler.stop() : null;
        const networkProfile = this.networkProfiler !== null ? this.networkProfiler.stop() : null;
        const endTime = Date.now();
        const session = {
            id: this.currentSessionId || 'unknown',
            startTime: cpuProfile?.startTime || memoryProfile?.startTime || networkProfile?.startTime || 0,
            endTime,
            duration: cpuProfile?.duration || memoryProfile?.duration || networkProfile?.duration || 0,
            cpuProfile,
            memoryProfile,
            networkProfile
        };
        this.sessions.push(session);
        this.updateStats(session);
        if (this.config.autoReport) {
            this.generateReport(session);
        }
        this.currentSessionId = null;
        return session;
    }
    /**
     * Generate report for a session
     */
    generateReport(session) {
        const report = this.reporter.generateCombinedReport(session.cpuProfile, session.memoryProfile, session.networkProfile, { format: this.config.reportFormat });
        this.stats = {
            ...this.stats,
            reportsGenerated: this.stats.reportsGenerated + 1
        };
        return report;
    }
    /**
     * Generate flame graph from CPU profile
     */
    generateFlameGraph(cpuProfile) {
        if (this.cpuProfiler === null) {
            throw new Error('CPU profiler is not enabled');
        }
        return this.cpuProfiler.generateFlameGraph(cpuProfile);
    }
    /**
     * Take a memory snapshot
     */
    takeMemorySnapshot() {
        if (this.memoryProfiler === null) {
            throw new Error('Memory profiler is not enabled');
        }
        return this.memoryProfiler.takeSnapshot();
    }
    /**
     * Record a network request
     */
    recordNetworkRequest(request) {
        if (this.networkProfiler === null) {
            throw new Error('Network profiler is not enabled');
        }
        this.networkProfiler.recordRequest(request);
    }
    /**
     * Get all completed sessions
     */
    getSessions() {
        return [...this.sessions];
    }
    /**
     * Get session by ID
     */
    getSession(id) {
        return this.sessions.find(s => s.id === id);
    }
    /**
     * Get profiler statistics
     */
    getStats() {
        return { ...this.stats };
    }
    /**
     * Clear all sessions
     */
    clearSessions() {
        this.sessions = [];
    }
    /**
     * Check if profiler is currently running
     */
    isProfilingActive() {
        return this.isRunning;
    }
    /**
     * Get current session ID
     */
    getCurrentSessionId() {
        return this.currentSessionId;
    }
    /**
     * Get profiler configuration
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * Profile a function execution
     */
    async profile(fn, sessionName) {
        const sessionId = this.start();
        try {
            const result = await fn();
            const session = this.stop();
            return { result, session };
        }
        catch (error) {
            // Stop profiling even on error
            if (this.isRunning) {
                this.stop();
            }
            throw error;
        }
    }
    /**
     * Generate unique session ID
     */
    generateSessionId() {
        return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
    /**
     * Update statistics after session completion
     */
    updateStats(session) {
        this.stats = {
            sessionsCompleted: this.stats.sessionsCompleted + 1,
            totalProfilingTime: this.stats.totalProfilingTime + session.duration,
            cpuProfilesGenerated: this.stats.cpuProfilesGenerated + (session.cpuProfile !== null ? 1 : 0),
            memoryProfilesGenerated: this.stats.memoryProfilesGenerated + (session.memoryProfile !== null ? 1 : 0),
            networkProfilesGenerated: this.stats.networkProfilesGenerated + (session.networkProfile !== null ? 1 : 0),
            reportsGenerated: this.stats.reportsGenerated
        };
    }
}
//# sourceMappingURL=profiler.js.map