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

interface MemoryStats {
  readonly timestamp: number;
  readonly heapUsed: number;
  readonly heapTotal: number;
  readonly external: number;
  readonly arrayBuffers: number;
}

export class MemoryProfiler {
  private isRunning: boolean = false;
  private startTime: number = 0;
  private endTime: number = 0;
  private snapshots: HeapSnapshot[] = [];
  private stats: MemoryStats[] = [];
  private snapshotInterval: number = 100; // milliseconds
  private intervalId: NodeJS.Timeout | null = null;
  private allocationTracking = new Map<string, MemoryAllocation>();

  public constructor(snapshotInterval: number = 100) {
    this.snapshotInterval = snapshotInterval;
  }

  /**
   * Start memory profiling
   */
  public start(): void {
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
  public stop(): MemoryProfile {
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
  public takeSnapshot(): HeapSnapshot {
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
  public trackAllocation(id: string, size: number, type: string): void {
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
  public untrackAllocation(id: string): void {
    this.allocationTracking.delete(id);
  }

  /**
   * Detect memory leaks
   */
  public detectLeaks(): MemoryAllocation[] {
    const leaks: MemoryAllocation[] = [];
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
  public calculateGrowthRate(): number {
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
  private captureSnapshot(): void {
    const memUsage = process.memoryUsage();

    const stat: MemoryStats = {
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
  private buildProfile(): MemoryProfile {
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
  private captureStackTrace(): string[] {
    const error = new Error();
    const stack: string[] = [];

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
  public isProfilerRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Get current memory usage
   */
  public getCurrentMemoryUsage(): NodeJS.MemoryUsage {
    return process.memoryUsage();
  }
}
