/**
 * Profiler
 *
 * Advanced profiling for CPU, memory, and network operations
 */
export interface ProfilerOptions {
    readonly enabled: boolean;
    readonly sampleInterval?: number;
}
export interface ProfileResult {
    readonly name: string;
    readonly duration: number;
    readonly startTime: number;
    readonly endTime: number;
    readonly cpuUsage?: number;
    readonly memoryUsage?: number;
}
export declare class Profiler {
    private readonly options;
    private readonly profiles;
    private readonly activeProfiles;
    private isRunning;
    constructor(options?: ProfilerOptions);
    start(): void;
    stop(): void;
    startProfile(name: string): void;
    endProfile(name: string): ProfileResult | undefined;
    profile<T>(name: string, fn: () => T): T;
    profileAsync<T>(name: string, fn: () => Promise<T>): Promise<T>;
    getResult(name: string): ProfileResult | undefined;
    getResults(): ProfileResult[];
    clearResults(): void;
}
//# sourceMappingURL=profiler.d.ts.map