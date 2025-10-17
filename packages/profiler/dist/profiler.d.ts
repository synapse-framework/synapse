/**
 * Main Profiler - Unified interface for all profiling capabilities
 */
import { type CPUProfile, type FlameGraphData } from './cpu-profiler.js';
import { MemoryProfiler, type MemoryProfile } from './memory-profiler.js';
import { NetworkProfiler, type NetworkProfile } from './network-profiler.js';
import { type ProfileReport, type ReportFormat } from './profiler-reporter.js';
export interface ProfilerConfig {
    readonly enableCPU: boolean;
    readonly enableMemory: boolean;
    readonly enableNetwork: boolean;
    readonly cpuSampleInterval: number;
    readonly memorySampleInterval: number;
    readonly autoReport: boolean;
    readonly reportFormat: ReportFormat;
}
export interface ProfilerSession {
    readonly id: string;
    readonly startTime: number;
    readonly endTime: number;
    readonly duration: number;
    readonly cpuProfile: CPUProfile | null;
    readonly memoryProfile: MemoryProfile | null;
    readonly networkProfile: NetworkProfile | null;
}
export interface ProfilerStats {
    readonly sessionsCompleted: number;
    readonly totalProfilingTime: number;
    readonly cpuProfilesGenerated: number;
    readonly memoryProfilesGenerated: number;
    readonly networkProfilesGenerated: number;
    readonly reportsGenerated: number;
}
export declare class Profiler {
    private readonly config;
    private readonly cpuProfiler;
    private readonly memoryProfiler;
    private readonly networkProfiler;
    private readonly reporter;
    private isRunning;
    private currentSessionId;
    private sessions;
    private stats;
    constructor(config?: Partial<ProfilerConfig>);
    /**
     * Start profiling session
     */
    start(): string;
    /**
     * Stop profiling session and return results
     */
    stop(): ProfilerSession;
    /**
     * Generate report for a session
     */
    generateReport(session: ProfilerSession): ProfileReport;
    /**
     * Generate flame graph from CPU profile
     */
    generateFlameGraph(cpuProfile: CPUProfile): FlameGraphData;
    /**
     * Take a memory snapshot
     */
    takeMemorySnapshot(): ReturnType<MemoryProfiler['takeSnapshot']>;
    /**
     * Record a network request
     */
    recordNetworkRequest(request: Parameters<NetworkProfiler['recordRequest']>[0]): void;
    /**
     * Get all completed sessions
     */
    getSessions(): readonly ProfilerSession[];
    /**
     * Get session by ID
     */
    getSession(id: string): ProfilerSession | undefined;
    /**
     * Get profiler statistics
     */
    getStats(): ProfilerStats;
    /**
     * Clear all sessions
     */
    clearSessions(): void;
    /**
     * Check if profiler is currently running
     */
    isProfilingActive(): boolean;
    /**
     * Get current session ID
     */
    getCurrentSessionId(): string | null;
    /**
     * Get profiler configuration
     */
    getConfig(): Readonly<ProfilerConfig>;
    /**
     * Profile a function execution
     */
    profile<T>(fn: () => T | Promise<T>, sessionName?: string): Promise<{
        readonly result: T;
        readonly session: ProfilerSession;
    }>;
    /**
     * Generate unique session ID
     */
    private generateSessionId;
    /**
     * Update statistics after session completion
     */
    private updateStats;
}
//# sourceMappingURL=profiler.d.ts.map