/**
 * @snps/ai-testing - Synapse Framework AI Testing
 * AI-generated test cases and scenarios with zero external dependencies
 */
/**
 * Test types
 */
export declare enum TestType {
    Unit = "unit",
    Integration = "integration",
    E2E = "e2e",
    Performance = "performance",
    Security = "security",
    Snapshot = "snapshot"
}
/**
 * Test case priority
 */
export declare enum Priority {
    Critical = "critical",
    High = "high",
    Medium = "medium",
    Low = "low"
}
/**
 * Generated test case
 */
export interface GeneratedTestCase {
    readonly name: string;
    readonly type: TestType;
    readonly priority: Priority;
    readonly description: string;
    readonly code: string;
    readonly setup?: string;
    readonly teardown?: string;
    readonly assertions: string[];
    readonly tags: string[];
}
/**
 * Test suite
 */
export interface TestSuite {
    readonly name: string;
    readonly description: string;
    readonly tests: GeneratedTestCase[];
    readonly setup?: string;
    readonly teardown?: string;
}
/**
 * Edge case
 */
export interface EdgeCase {
    readonly scenario: string;
    readonly input: unknown;
    readonly expectedOutput: unknown;
    readonly description: string;
    readonly priority: Priority;
}
/**
 * Coverage analysis
 */
export interface CoverageAnalysis {
    readonly totalLines: number;
    readonly coveredLines: number;
    readonly percentage: number;
    readonly uncoveredLines: number[];
    readonly uncoveredFunctions: string[];
    readonly suggestions: CoverageSuggestion[];
}
/**
 * Coverage suggestion
 */
export interface CoverageSuggestion {
    readonly type: 'missing-test' | 'edge-case' | 'error-path' | 'branch';
    readonly description: string;
    readonly location: {
        readonly file: string;
        readonly line: number;
    };
    readonly generatedTest?: GeneratedTestCase;
}
/**
 * Mutation testing suggestion
 */
export interface MutationSuggestion {
    readonly type: 'operator' | 'constant' | 'condition' | 'statement';
    readonly original: string;
    readonly mutated: string;
    readonly location: {
        readonly file: string;
        readonly line: number;
    };
    readonly description: string;
    readonly testNeeded: boolean;
}
/**
 * Main AI Testing class
 */
export declare class SynapseAITesting {
    readonly name = "SynapseAITesting";
    readonly version = "0.1.0";
    private readonly testGenerator;
    private readonly edgeCaseDetector;
    private readonly coverageAnalyzer;
    private readonly mutationTester;
    constructor();
    initialize(): Promise<void>;
    getInfo(): Record<string, unknown>;
    /**
     * Generate tests from code
     */
    generateTests(code: string, fileName: string): GeneratedTestCase[];
    /**
     * Generate test suite
     */
    generateTestSuite(code: string, fileName: string): TestSuite;
    /**
     * Detect edge cases
     */
    detectEdgeCases(code: string, functionName: string): EdgeCase[];
    /**
     * Analyze test coverage
     */
    analyzeCoverage(code: string, tests: GeneratedTestCase[]): CoverageAnalysis;
    /**
     * Generate mutation testing suggestions
     */
    generateMutations(code: string): MutationSuggestion[];
}
export default SynapseAITesting;
//# sourceMappingURL=index.d.ts.map