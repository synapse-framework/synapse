/**
 * Memory Profiler - Provides memory profiling with heap snapshots
 */
export class MemoryProfiler {
    isRunning = false;
    startTime = 0;
    endTime = 0;
    snapshots = [];
    stats = [];
    snapshotInterval = 100; // milliseconds
    intervalId = null;
    allocationTracking = new Map();
    constructor(snapshotInterval = 100) {
        this.snapshotInterval = snapshotInterval;
    }
    /**
     * Start memory profiling
     */
    start() {
        if (this.isRunning) {
            throw new Error('Memory profiler is already running');
        }
        this.isRunning = true;
        this.startTime = Date.now();
        this.snapshots = [];
        this.stats = [];
        this.allocationTracking.clear();
        // Start periodic snapshots
        this.intervalId = setInterval(() => {
            this.captureSnapshot();
        }, this.snapshotInterval);
        // Initial snapshot
        this.captureSnapshot();
    }
    /**
     * Stop memory profiling and return profile
     */
    stop() {
        if (!this.isRunning) {
            throw new Error('Memory profiler is not running');
        }
        this.isRunning = false;
        this.endTime = Date.now();
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        // Final snapshot
        this.captureSnapshot();
        return this.buildProfile();
    }
    /**
     * Take a heap snapshot
     */
    takeSnapshot() {
        const memUsage = process.memoryUsage();
        const allocations = Array.from(this.allocationTracking.values());
        return {
            timestamp: Date.now(),
            totalHeapSize: memUsage.heapTotal,
            usedHeapSize: memUsage.heapUsed,
            heapSizeLimit: memUsage.heapTotal * 2, // Approximation
            totalPhysicalSize: memUsage.rss,
            totalAvailableSize: memUsage.heapTotal - memUsage.heapUsed,
            mallocedMemory: memUsage.external,
            peakMallocedMemory: memUsage.external,
            allocations,
            metadata: {
                arrayBuffers: memUsage.arrayBuffers
            }
        };
    }
    /**
     * Track memory allocation
     */
    trackAllocation(id, size, type) {
        const stackTrace = this.captureStackTrace();
        this.allocationTracking.set(id, {
            id,
            size,
            type,
            timestamp: Date.now(),
            stackTrace
        });
    }
    /**
     * Untrack memory allocation (freed)
     */
    untrackAllocation(id) {
        this.allocationTracking.delete(id);
    }
    /**
     * Detect memory leaks
     */
    detectLeaks() {
        const leaks = [];
        const now = Date.now();
        const leakThreshold = 60000; // 1 minute
        for (const allocation of this.allocationTracking.values()) {
            if (now - allocation.timestamp > leakThreshold) {
                leaks.push(allocation);
            }
        }
        return leaks;
    }
    /**
     * Calculate memory growth rate (bytes per second)
     */
    calculateGrowthRate() {
        if (this.stats.length < 2) {
            return 0;
        }
        const firstStat = this.stats[0];
        const lastStat = this.stats[this.stats.length - 1];
        if (firstStat === undefined || lastStat === undefined) {
            return 0;
        }
        const timeDiff = (lastStat.timestamp - firstStat.timestamp) / 1000; // seconds
        const memoryDiff = lastStat.heapUsed - firstStat.heapUsed;
        return timeDiff > 0 ? memoryDiff / timeDiff : 0;
    }
    /**
     * Capture a memory snapshot
     */
    captureSnapshot() {
        const memUsage = process.memoryUsage();
        const stat = {
            timestamp: Date.now(),
            heapUsed: memUsage.heapUsed,
            heapTotal: memUsage.heapTotal,
            external: memUsage.external,
            arrayBuffers: memUsage.arrayBuffers
        };
        this.stats.push(stat);
        const snapshot = this.takeSnapshot();
        this.snapshots.push(snapshot);
    }
    /**
     * Build complete memory profile
     */
    buildProfile() {
        const heapUsedValues = this.stats.map(s => s.heapUsed);
        const peakMemory = Math.max(...heapUsedValues);
        const averageMemory = heapUsedValues.reduce((sum, val) => sum + val, 0) / heapUsedValues.length;
        const memoryLeaks = this.detectLeaks();
        const growthRate = this.calculateGrowthRate();
        return {
            startTime: this.startTime,
            endTime: this.endTime,
            duration: this.endTime - this.startTime,
            snapshots: this.snapshots,
            peakMemory,
            averageMemory,
            memoryLeaks,
            growthRate,
            metadata: {
                snapshotCount: this.snapshots.length,
                snapshotInterval: this.snapshotInterval
            }
        };
    }
    /**
     * Capture stack trace
     */
    captureStackTrace() {
        const error = new Error();
        const stack = [];
        if (error.stack !== undefined) {
            const lines = error.stack.split('\n').slice(2); // Skip Error and captureStackTrace frames
            for (const line of lines) {
                stack.push(line.trim());
            }
        }
        return stack;
    }
    /**
     * Check if profiler is currently running
     */
    isProfilerRunning() {
        return this.isRunning;
    }
    /**
     * Get current memory usage
     */
    getCurrentMemoryUsage() {
        return process.memoryUsage();
    }
}
//# sourceMappingURL=memory-profiler.js.map