/**
 * @snps/ai-codegen - Synapse Framework AI Code Generation
 * AI-powered code generation and suggestions with zero external dependencies
 */
/**
 * Code generation pattern types
 */
export declare enum CodePattern {
    Component = "component",
    Service = "service",
    Controller = "controller",
    Model = "model",
    Utility = "utility",
    Test = "test",
    Interface = "interface",
    Class = "class",
    Function = "function",
    Hook = "hook"
}
/**
 * Programming language support
 */
export declare enum Language {
    TypeScript = "typescript",
    JavaScript = "javascript",
    JSX = "jsx",
    TSX = "tsx"
}
/**
 * Code generation context
 */
export interface CodeGenerationContext {
    readonly pattern: CodePattern;
    readonly language: Language;
    readonly name: string;
    readonly description?: string;
    readonly imports?: string[];
    readonly exports?: string[];
    readonly props?: Record<string, string>;
    readonly methods?: string[];
    readonly styles?: boolean;
    readonly tests?: boolean;
}
/**
 * Generated code result
 */
export interface GeneratedCode {
    readonly code: string;
    readonly imports: string[];
    readonly exports: string[];
    readonly metadata: {
        readonly pattern: CodePattern;
        readonly language: Language;
        readonly linesOfCode: number;
        readonly complexity: number;
    };
}
/**
 * Code suggestion
 */
export interface CodeSuggestion {
    readonly type: 'completion' | 'refactor' | 'optimization' | 'fix';
    readonly code: string;
    readonly description: string;
    readonly confidence: number;
    readonly location?: {
        readonly line: number;
        readonly column: number;
    };
}
/**
 * Code generation engine
 */
export declare class CodeGenerationEngine {
    private readonly templateRegistry;
    constructor();
    /**
     * Generate code from context
     */
    generateCode(context: CodeGenerationContext): GeneratedCode;
    /**
     * Generate context-aware suggestions
     */
    generateSuggestions(code: string, context: Partial<CodeGenerationContext>): CodeSuggestion[];
    /**
     * Generate code completion suggestions
     */
    generateCompletions(partial: string, context: Partial<CodeGenerationContext>): string[];
    /**
     * Register custom template
     */
    registerTemplate(pattern: CodePattern, language: Language, template: string): void;
    private getTemplateKey;
    private applyTemplate;
    private generateImports;
    private generateExports;
    private calculateComplexity;
}
/**
 * Main AI Code Generation class
 */
export declare class SynapseAICodegen {
    readonly name = "SynapseAICodegen";
    readonly version = "0.1.0";
    private readonly engine;
    constructor();
    initialize(): Promise<void>;
    getInfo(): Record<string, unknown>;
    /**
     * Generate code from context
     */
    generate(context: CodeGenerationContext): GeneratedCode;
    /**
     * Get code suggestions
     */
    suggest(code: string, context?: Partial<CodeGenerationContext>): CodeSuggestion[];
    /**
     * Get code completions
     */
    complete(partial: string, context?: Partial<CodeGenerationContext>): string[];
    /**
     * Register custom template
     */
    registerTemplate(pattern: CodePattern, language: Language, template: string): void;
}
export default SynapseAICodegen;
//# sourceMappingURL=index.d.ts.map