/**
 * @snps/ai-optimizer - Synapse Framework AI Optimizer
 * Automatic performance optimization with zero external dependencies
 */
/**
 * Performance bottleneck types
 */
export declare enum BottleneckType {
    CPU = "cpu",
    Memory = "memory",
    IO = "io",
    Network = "network",
    Render = "render",
    Bundle = "bundle"
}
/**
 * Optimization severity levels
 */
export declare enum Severity {
    Critical = "critical",
    High = "high",
    Medium = "medium",
    Low = "low",
    Info = "info"
}
/**
 * Performance bottleneck detection
 */
export interface PerformanceBottleneck {
    readonly type: BottleneckType;
    readonly severity: Severity;
    readonly location: string;
    readonly description: string;
    readonly impact: number;
    readonly suggestions: string[];
}
/**
 * Optimization suggestion
 */
export interface OptimizationSuggestion {
    readonly type: 'code' | 'architecture' | 'configuration' | 'dependency';
    readonly severity: Severity;
    readonly title: string;
    readonly description: string;
    readonly before: string;
    readonly after: string;
    readonly impact: {
        readonly performance: number;
        readonly bundle: number;
        readonly memory: number;
    };
}
/**
 * Bundle analysis result
 */
export interface BundleAnalysis {
    readonly totalSize: number;
    readonly gzippedSize: number;
    readonly modules: BundleModule[];
    readonly duplicates: string[];
    readonly largeModules: BundleModule[];
    readonly suggestions: OptimizationSuggestion[];
}
/**
 * Bundle module information
 */
export interface BundleModule {
    readonly name: string;
    readonly size: number;
    readonly gzippedSize: number;
    readonly imports: string[];
    readonly exports: string[];
}
/**
 * Memory analysis result
 */
export interface MemoryAnalysis {
    readonly heapUsed: number;
    readonly heapTotal: number;
    readonly external: number;
    readonly leaks: MemoryLeak[];
    readonly suggestions: OptimizationSuggestion[];
}
/**
 * Memory leak detection
 */
export interface MemoryLeak {
    readonly type: 'event-listener' | 'closure' | 'cache' | 'timer' | 'reference';
    readonly location: string;
    readonly severity: Severity;
    readonly description: string;
    readonly size: number;
}
/**
 * Main AI Optimizer class
 */
export declare class SynapseAIOptimizer {
    readonly name = "SynapseAIOptimizer";
    readonly version = "0.1.0";
    private readonly codeAnalyzer;
    private readonly bundleOptimizer;
    private readonly memoryOptimizer;
    constructor();
    initialize(): Promise<void>;
    getInfo(): Record<string, unknown>;
    /**
     * Analyze code for performance issues
     */
    analyzePerformance(code: string, filePath: string): PerformanceBottleneck[];
    /**
     * Generate optimization suggestions
     */
    optimize(code: string, filePath: string): OptimizationSuggestion[];
    /**
     * Analyze bundle
     */
    analyzeBundle(code: string, dependencies: string[]): BundleAnalysis;
    /**
     * Optimize bundle size
     */
    optimizeBundleSize(code: string): string;
    /**
     * Analyze memory usage
     */
    analyzeMemory(code: string, filePath: string): MemoryAnalysis;
}
export default SynapseAIOptimizer;
//# sourceMappingURL=index.d.ts.map