/**
 * CPU Profiler - Provides CPU profiling with flame graph generation
 */
export interface CPUProfileNode {
    readonly id: number;
    readonly functionName: string;
    readonly scriptId: string;
    readonly url: string;
    readonly lineNumber: number;
    readonly columnNumber: number;
    readonly hitCount: number;
    readonly children: number[];
    readonly selfTime: number;
    readonly totalTime: number;
}
export interface CPUProfile {
    readonly startTime: number;
    readonly endTime: number;
    readonly duration: number;
    readonly nodes: CPUProfileNode[];
    readonly samples: number[];
    readonly timeDeltas: number[];
    readonly metadata: Record<string, unknown>;
}
export interface FlameGraphData {
    readonly name: string;
    readonly value: number;
    readonly children: FlameGraphData[];
    readonly selfTime: number;
    readonly totalTime: number;
    readonly percentage: number;
}
export declare class CPUProfiler {
    private isRunning;
    private startTime;
    private endTime;
    private samples;
    private sampleInterval;
    private intervalId;
    private nodeIdCounter;
    constructor(sampleInterval?: number);
    /**
     * Start CPU profiling
     */
    start(): void;
    /**
     * Stop CPU profiling and return profile
     */
    stop(): CPUProfile;
    /**
     * Generate flame graph data from profile
     */
    generateFlameGraph(profile: CPUProfile): FlameGraphData;
    /**
     * Capture a single sample of the call stack
     */
    private captureSample;
    /**
     * Capture current call stack
     */
    private captureCallStack;
    /**
     * Build complete CPU profile from samples
     */
    private buildProfile;
    /**
     * Build flame graph from profile
     */
    private buildFlameGraphNode;
    /**
     * Generate unique key for stack frame
     */
    private getFrameKey;
    /**
     * Check if profiler is currently running
     */
    isProfilerRunning(): boolean;
}
//# sourceMappingURL=cpu-profiler.d.ts.map