/**
 * Memory Profiler - Provides memory profiling with heap snapshots
 */
export interface MemoryAllocation {
    readonly id: string;
    readonly size: number;
    readonly type: string;
    readonly timestamp: number;
    readonly stackTrace: string[];
}
export interface HeapSnapshot {
    readonly timestamp: number;
    readonly totalHeapSize: number;
    readonly usedHeapSize: number;
    readonly heapSizeLimit: number;
    readonly totalPhysicalSize: number;
    readonly totalAvailableSize: number;
    readonly mallocedMemory: number;
    readonly peakMallocedMemory: number;
    readonly allocations: MemoryAllocation[];
    readonly metadata: Record<string, unknown>;
}
export interface MemoryProfile {
    readonly startTime: number;
    readonly endTime: number;
    readonly duration: number;
    readonly snapshots: HeapSnapshot[];
    readonly peakMemory: number;
    readonly averageMemory: number;
    readonly memoryLeaks: MemoryAllocation[];
    readonly growthRate: number;
    readonly metadata: Record<string, unknown>;
}
export declare class MemoryProfiler {
    private isRunning;
    private startTime;
    private endTime;
    private snapshots;
    private stats;
    private snapshotInterval;
    private intervalId;
    private allocationTracking;
    constructor(snapshotInterval?: number);
    /**
     * Start memory profiling
     */
    start(): void;
    /**
     * Stop memory profiling and return profile
     */
    stop(): MemoryProfile;
    /**
     * Take a heap snapshot
     */
    takeSnapshot(): HeapSnapshot;
    /**
     * Track memory allocation
     */
    trackAllocation(id: string, size: number, type: string): void;
    /**
     * Untrack memory allocation (freed)
     */
    untrackAllocation(id: string): void;
    /**
     * Detect memory leaks
     */
    detectLeaks(): MemoryAllocation[];
    /**
     * Calculate memory growth rate (bytes per second)
     */
    calculateGrowthRate(): number;
    /**
     * Capture a memory snapshot
     */
    private captureSnapshot;
    /**
     * Build complete memory profile
     */
    private buildProfile;
    /**
     * Capture stack trace
     */
    private captureStackTrace;
    /**
     * Check if profiler is currently running
     */
    isProfilerRunning(): boolean;
    /**
     * Get current memory usage
     */
    getCurrentMemoryUsage(): NodeJS.MemoryUsage;
}
//# sourceMappingURL=memory-profiler.d.ts.map