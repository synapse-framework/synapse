/**
 * @snps/ai-debug - Synapse Framework AI Debug
 * AI-assisted debugging and error resolution with zero external dependencies
 */

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  Critical = 'critical',
  High = 'high',
  Medium = 'medium',
  Low = 'low',
  Info = 'info',
}

/**
 * Error category
 */
export enum ErrorCategory {
  Syntax = 'syntax',
  Type = 'type',
  Runtime = 'runtime',
  Logic = 'logic',
  Performance = 'performance',
  Security = 'security',
  Memory = 'memory',
  Network = 'network',
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
  readonly confidence: number; // 0-1
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
 * Error analyzer
 */
class ErrorAnalyzer {
  /**
   * Analyze error and provide detailed information
   */
  public analyzeError(error: Error): ErrorAnalysis {
    const category = this.categorizeError(error);
    const severity = this.determineSeverity(error, category);
    const stackTrace = this.parseStackTrace(error);
    const rootCause = this.identifyRootCause(error, stackTrace);
    const explanation = this.explainError(error, category);
    const impact = this.assessImpact(error, severity);
    const suggestions = this.generateSuggestions(error, category, stackTrace);
    const relatedErrors = this.findRelatedErrors(error);

    return {
      error,
      category,
      severity,
      rootCause,
      explanation,
      impact,
      stackTrace,
      suggestions,
      relatedErrors,
    };
  }

  /**
   * Categorize error type
   */
  private categorizeError(error: Error): ErrorCategory {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    if (name.includes('syntax') || message.includes('syntax')) {
      return ErrorCategory.Syntax;
    }
    if (name.includes('type') || message.includes('type')) {
      return ErrorCategory.Type;
    }
    if (message.includes('memory') || message.includes('heap')) {
      return ErrorCategory.Memory;
    }
    if (message.includes('network') || message.includes('fetch') || message.includes('request')) {
      return ErrorCategory.Network;
    }
    if (message.includes('security') || message.includes('permission')) {
      return ErrorCategory.Security;
    }
    if (message.includes('undefined') || message.includes('null')) {
      return ErrorCategory.Runtime;
    }

    return ErrorCategory.Runtime;
  }

  /**
   * Determine error severity
   */
  private determineSeverity(error: Error, category: ErrorCategory): ErrorSeverity {
    if (category === ErrorCategory.Security) {
      return ErrorSeverity.Critical;
    }
    if (category === ErrorCategory.Memory) {
      return ErrorSeverity.High;
    }
    if (category === ErrorCategory.Syntax || category === ErrorCategory.Type) {
      return ErrorSeverity.High;
    }
    if (category === ErrorCategory.Logic) {
      return ErrorSeverity.Medium;
    }

    return ErrorSeverity.Low;
  }

  /**
   * Parse stack trace into structured format
   */
  private parseStackTrace(error: Error): StackFrame[] {
    const frames: StackFrame[] = [];

    if (!error.stack) {
      return frames;
    }

    const lines = error.stack.split('\n');
    for (const line of lines) {
      const match = line.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
      if (match) {
        frames.push({
          functionName: match[1]?.trim() || 'anonymous',
          file: match[2] || 'unknown',
          line: parseInt(match[3] || '0', 10),
          column: parseInt(match[4] || '0', 10),
        });
      }
    }

    return frames;
  }

  /**
   * Identify root cause of error
   */
  private identifyRootCause(error: Error, stackTrace: StackFrame[]): string {
    const message = error.message;

    if (message.includes('undefined')) {
      return 'Attempted to access a property or method on an undefined value';
    }
    if (message.includes('null')) {
      return 'Attempted to access a property or method on a null value';
    }
    if (message.includes('is not a function')) {
      return 'Attempted to call a value that is not a function';
    }
    if (message.includes('Cannot read property')) {
      return 'Attempted to read a property from undefined or null';
    }
    if (message.includes('Maximum call stack')) {
      return 'Infinite recursion or very deep call stack';
    }
    if (message.includes('out of memory')) {
      return 'Application ran out of available memory';
    }

    return 'Unknown error cause - investigate stack trace for details';
  }

  /**
   * Explain error in detail
   */
  private explainError(error: Error, category: ErrorCategory): string {
    const explanations: Record<ErrorCategory, string> = {
      [ErrorCategory.Syntax]: 'Syntax errors occur when code violates JavaScript/TypeScript language rules. Check for missing brackets, semicolons, or incorrect syntax.',
      [ErrorCategory.Type]: 'Type errors occur when operations are performed on incompatible types. Ensure types match expected interfaces.',
      [ErrorCategory.Runtime]: 'Runtime errors occur during code execution, often due to undefined/null values or incorrect assumptions.',
      [ErrorCategory.Logic]: 'Logic errors produce incorrect results but do not throw exceptions. Review algorithm and data flow.',
      [ErrorCategory.Performance]: 'Performance issues cause slow execution. Profile code to identify bottlenecks.',
      [ErrorCategory.Security]: 'Security vulnerabilities pose risks. Review access controls and input validation.',
      [ErrorCategory.Memory]: 'Memory issues indicate leaks or excessive usage. Check for unbounded caches and circular references.',
      [ErrorCategory.Network]: 'Network errors involve failed requests. Check connectivity, CORS, and endpoint availability.',
    };

    return explanations[category] || 'Error occurred during execution.';
  }

  /**
   * Assess error impact
   */
  private assessImpact(error: Error, severity: ErrorSeverity): string {
    const impacts: Record<ErrorSeverity, string> = {
      [ErrorSeverity.Critical]: 'Critical - Application cannot function. Immediate fix required.',
      [ErrorSeverity.High]: 'High - Core functionality affected. Fix as soon as possible.',
      [ErrorSeverity.Medium]: 'Medium - Some features may not work correctly. Schedule fix.',
      [ErrorSeverity.Low]: 'Low - Minor issues with limited impact. Fix when convenient.',
      [ErrorSeverity.Info]: 'Info - Informational only. No immediate action required.',
    };

    return impacts[severity] || 'Unknown impact';
  }

  /**
   * Generate fix suggestions
   */
  private generateSuggestions(error: Error, category: ErrorCategory, stackTrace: StackFrame[]): FixSuggestion[] {
    const suggestions: FixSuggestion[] = [];
    const message = error.message;

    if (message.includes('undefined') || message.includes('null')) {
      suggestions.push({
        type: 'code',
        title: 'Add null/undefined checks',
        description: 'Check if value exists before accessing properties',
        confidence: 0.95,
        code: {
          before: 'const value = obj.property;',
          after: 'const value = obj?.property ?? defaultValue;',
        },
        steps: [
          'Use optional chaining (?.) to safely access nested properties',
          'Use nullish coalescing (??) to provide default values',
          'Add runtime checks with if statements',
          'Consider using TypeScript strict null checks',
        ],
      });
    }

    if (message.includes('is not a function')) {
      suggestions.push({
        type: 'code',
        title: 'Verify function existence',
        description: 'Ensure the value is a function before calling it',
        confidence: 0.90,
        code: {
          before: 'callback();',
          after: 'if (typeof callback === "function") { callback(); }',
        },
        steps: [
          'Check if value is a function before calling',
          'Verify correct import/export',
          'Check for typos in function name',
          'Ensure function is initialized before use',
        ],
      });
    }

    if (message.includes('Maximum call stack')) {
      suggestions.push({
        type: 'code',
        title: 'Fix infinite recursion',
        description: 'Add base case or prevent circular calls',
        confidence: 0.85,
        steps: [
          'Add a base case to recursive function',
          'Check for circular references',
          'Limit recursion depth',
          'Consider iterative approach instead',
        ],
      });
    }

    if (category === ErrorCategory.Type) {
      suggestions.push({
        type: 'code',
        title: 'Fix type mismatch',
        description: 'Ensure types are compatible',
        confidence: 0.80,
        steps: [
          'Check TypeScript type definitions',
          'Add type assertions if necessary',
          'Verify data structure matches interface',
          'Use type guards for runtime checks',
        ],
      });
    }

    if (category === ErrorCategory.Memory) {
      suggestions.push({
        type: 'architecture',
        title: 'Fix memory leak',
        description: 'Clean up resources and references',
        confidence: 0.75,
        steps: [
          'Remove event listeners when done',
          'Clear timers and intervals',
          'Implement cache size limits',
          'Break circular references',
          'Use WeakMap/WeakSet for automatic cleanup',
        ],
      });
    }

    return suggestions;
  }

  /**
   * Find related error patterns
   */
  private findRelatedErrors(error: Error): string[] {
    const related: string[] = [];
    const message = error.message;

    if (message.includes('undefined')) {
      related.push('TypeError: Cannot read property of undefined');
      related.push('ReferenceError: variable is not defined');
    }

    if (message.includes('null')) {
      related.push('TypeError: Cannot read property of null');
    }

    if (message.includes('function')) {
      related.push('TypeError: value is not a function');
      related.push('ReferenceError: function is not defined');
    }

    return related;
  }
}

/**
 * Stack trace analyzer
 */
class StackTraceAnalyzer {
  /**
   * Analyze stack trace for patterns
   */
  public analyzeStackTrace(stackTrace: StackFrame[]): DebuggingInsight[] {
    const insights: DebuggingInsight[] = [];

    // Detect deep call stacks
    if (stackTrace.length > 50) {
      insights.push({
        type: 'warning',
        title: 'Deep call stack detected',
        description: `Call stack has ${stackTrace.length} frames. This may indicate recursion or complex call chains.`,
        examples: ['Consider refactoring to reduce nesting', 'Check for unintended recursion'],
      });
    }

    // Detect repeated function calls
    const functionCounts = new Map<string, number>();
    for (const frame of stackTrace) {
      const count = functionCounts.get(frame.functionName) || 0;
      functionCounts.set(frame.functionName, count + 1);
    }

    for (const [func, count] of functionCounts) {
      if (count > 3) {
        insights.push({
          type: 'warning',
          title: 'Repeated function in stack',
          description: `Function "${func}" appears ${count} times in call stack. May indicate recursion.`,
          examples: ['Add base case to recursive function', 'Check for circular dependencies'],
        });
      }
    }

    return insights;
  }

  /**
   * Get context around error location
   */
  public getContext(frame: StackFrame, codeLines: string[]): string {
    const start = Math.max(0, frame.line - 3);
    const end = Math.min(codeLines.length, frame.line + 3);
    return codeLines.slice(start, end).join('\n');
  }
}

/**
 * Debugging insights generator
 */
class InsightsGenerator {
  /**
   * Generate debugging insights
   */
  public generateInsights(code: string, filePath: string): DebuggingInsight[] {
    const insights: DebuggingInsight[] = [];

    // Detect console.log statements
    const consoleLogCount = (code.match(/console\.log/g) || []).length;
    if (consoleLogCount > 5) {
      insights.push({
        type: 'tip',
        title: 'Many console.log statements',
        description: 'Consider using a proper debugging tool instead of console.log',
        location: { file: filePath, line: 0 },
        examples: ['Use Chrome DevTools debugger', 'Add breakpoints', 'Use debug library'],
      });
    }

    // Detect try-catch without logging
    if (code.includes('try {') && code.includes('catch') && !code.includes('console.')) {
      insights.push({
        type: 'warning',
        title: 'Silent error handling',
        description: 'Errors are caught but not logged or handled',
        location: { file: filePath, line: 0 },
        examples: ['Log errors for debugging', 'Re-throw if cannot handle', 'Use error monitoring'],
      });
    }

    // Detect common anti-patterns
    if (code.includes('var ')) {
      insights.push({
        type: 'antipattern',
        title: 'Using var keyword',
        description: 'Prefer const or let over var for better scoping',
        location: { file: filePath, line: 0 },
      });
    }

    // Detect missing error handling
    if (code.includes('async ') && !code.includes('try') && !code.includes('catch')) {
      insights.push({
        type: 'warning',
        title: 'Async function without error handling',
        description: 'Async functions should have try-catch or .catch() for error handling',
        location: { file: filePath, line: 0 },
      });
    }

    return insights;
  }
}

/**
 * Main AI Debug class
 */
export class SynapseAIDebug {
  public readonly name = 'SynapseAIDebug';
  public readonly version = '0.1.0';
  private readonly errorAnalyzer: ErrorAnalyzer;
  private readonly stackTraceAnalyzer: StackTraceAnalyzer;
  private readonly insightsGenerator: InsightsGenerator;

  constructor() {
    this.errorAnalyzer = new ErrorAnalyzer();
    this.stackTraceAnalyzer = new StackTraceAnalyzer();
    this.insightsGenerator = new InsightsGenerator();
  }

  public async initialize(): Promise<void> {
    console.log('AI Debug initialized successfully');
  }

  public getInfo(): Record<string, unknown> {
    return {
      name: this.name,
      version: this.version,
      features: [
        'Error Analysis',
        'Stack Trace Analysis',
        'Automatic Fix Suggestions',
        'Debugging Insights',
        'Root Cause Detection',
        'Smart Recommendations',
      ],
    };
  }

  /**
   * Analyze error and get suggestions
   */
  public analyzeError(error: Error): ErrorAnalysis {
    return this.errorAnalyzer.analyzeError(error);
  }

  /**
   * Analyze stack trace
   */
  public analyzeStackTrace(stackTrace: StackFrame[]): DebuggingInsight[] {
    return this.stackTraceAnalyzer.analyzeStackTrace(stackTrace);
  }

  /**
   * Generate debugging insights for code
   */
  public generateInsights(code: string, filePath: string): DebuggingInsight[] {
    return this.insightsGenerator.generateInsights(code, filePath);
  }

  /**
   * Get context around error location
   */
  public getErrorContext(frame: StackFrame, codeLines: string[]): string {
    return this.stackTraceAnalyzer.getContext(frame, codeLines);
  }

  /**
   * Quick error diagnosis
   */
  public diagnose(error: Error): string {
    const analysis = this.analyzeError(error);
    const topSuggestion = analysis.suggestions[0];

    let diagnosis = `${analysis.severity.toUpperCase()}: ${analysis.category} error\n\n`;
    diagnosis += `Root Cause: ${analysis.rootCause}\n\n`;
    diagnosis += `${analysis.explanation}\n\n`;

    if (topSuggestion) {
      diagnosis += `Suggested Fix: ${topSuggestion.title}\n`;
      diagnosis += `${topSuggestion.description}\n`;
    }

    return diagnosis;
  }
}

// Default export
export default SynapseAIDebug;
