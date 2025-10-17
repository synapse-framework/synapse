/**
 * @snps/ai-debug - Synapse Framework AI Debug
 * AI-assisted debugging and error resolution with zero external dependencies
 */
/**
 * Error severity levels
 */
export declare enum ErrorSeverity {
    Critical = "critical",
    High = "high",
    Medium = "medium",
    Low = "low",
    Info = "info"
}
/**
 * Error category
 */
export declare enum ErrorCategory {
    Syntax = "syntax",
    Type = "type",
    Runtime = "runtime",
    Logic = "logic",
    Performance = "performance",
    Security = "security",
    Memory = "memory",
    Network = "network"
}
/**
 * Stack frame information
 */
export interface StackFrame {
    readonly file: string;
    readonly line: number;
    readonly column: number;
    readonly functionName: string;
    readonly code?: string;
}
/**
 * Error analysis result
 */
export interface ErrorAnalysis {
    readonly error: Error;
    readonly category: ErrorCategory;
    readonly severity: ErrorSeverity;
    readonly rootCause: string;
    readonly explanation: string;
    readonly impact: string;
    readonly stackTrace: StackFrame[];
    readonly suggestions: FixSuggestion[];
    readonly relatedErrors: string[];
}
/**
 * Fix suggestion
 */
export interface FixSuggestion {
    readonly type: 'code' | 'configuration' | 'dependency' | 'architecture';
    readonly title: string;
    readonly description: string;
    readonly confidence: number;
    readonly code?: {
        readonly before: string;
        readonly after: string;
    };
    readonly steps: string[];
}
/**
 * Debugging insight
 */
export interface DebuggingInsight {
    readonly type: 'warning' | 'tip' | 'pattern' | 'antipattern';
    readonly title: string;
    readonly description: string;
    readonly location?: {
        readonly file: string;
        readonly line: number;
    };
    readonly examples?: string[];
}
/**
 * Variable state information
 */
export interface VariableState {
    readonly name: string;
    readonly value: unknown;
    readonly type: string;
    readonly scope: 'local' | 'closure' | 'global';
    readonly mutable: boolean;
}
/**
 * Main AI Debug class
 */
export declare class SynapseAIDebug {
    readonly name = "SynapseAIDebug";
    readonly version = "0.1.0";
    private readonly errorAnalyzer;
    private readonly stackTraceAnalyzer;
    private readonly insightsGenerator;
    constructor();
    initialize(): Promise<void>;
    getInfo(): Record<string, unknown>;
    /**
     * Analyze error and get suggestions
     */
    analyzeError(error: Error): ErrorAnalysis;
    /**
     * Analyze stack trace
     */
    analyzeStackTrace(stackTrace: StackFrame[]): DebuggingInsight[];
    /**
     * Generate debugging insights for code
     */
    generateInsights(code: string, filePath: string): DebuggingInsight[];
    /**
     * Get context around error location
     */
    getErrorContext(frame: StackFrame, codeLines: string[]): string;
    /**
     * Quick error diagnosis
     */
    diagnose(error: Error): string;
}
export default SynapseAIDebug;
//# sourceMappingURL=index.d.ts.map