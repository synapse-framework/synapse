/**
 * @snps/ai-debug - Synapse Framework AI Debug
 * AI-assisted debugging and error resolution with zero external dependencies
 */
/**
 * Error severity levels
 */
export var ErrorSeverity;
(function (ErrorSeverity) {
    ErrorSeverity["Critical"] = "critical";
    ErrorSeverity["High"] = "high";
    ErrorSeverity["Medium"] = "medium";
    ErrorSeverity["Low"] = "low";
    ErrorSeverity["Info"] = "info";
})(ErrorSeverity || (ErrorSeverity = {}));
/**
 * Error category
 */
export var ErrorCategory;
(function (ErrorCategory) {
    ErrorCategory["Syntax"] = "syntax";
    ErrorCategory["Type"] = "type";
    ErrorCategory["Runtime"] = "runtime";
    ErrorCategory["Logic"] = "logic";
    ErrorCategory["Performance"] = "performance";
    ErrorCategory["Security"] = "security";
    ErrorCategory["Memory"] = "memory";
    ErrorCategory["Network"] = "network";
})(ErrorCategory || (ErrorCategory = {}));
/**
 * Error analyzer
 */
class ErrorAnalyzer {
    /**
     * Analyze error and provide detailed information
     */
    analyzeError(error) {
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
    categorizeError(error) {
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
    determineSeverity(error, category) {
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
    parseStackTrace(error) {
        const frames = [];
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
    identifyRootCause(error, stackTrace) {
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
    explainError(error, category) {
        const explanations = {
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
    assessImpact(error, severity) {
        const impacts = {
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
    generateSuggestions(error, category, stackTrace) {
        const suggestions = [];
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
    findRelatedErrors(error) {
        const related = [];
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
    analyzeStackTrace(stackTrace) {
        const insights = [];
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
        const functionCounts = new Map();
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
    getContext(frame, codeLines) {
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
    generateInsights(code, filePath) {
        const insights = [];
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
    name = 'SynapseAIDebug';
    version = '0.1.0';
    errorAnalyzer;
    stackTraceAnalyzer;
    insightsGenerator;
    constructor() {
        this.errorAnalyzer = new ErrorAnalyzer();
        this.stackTraceAnalyzer = new StackTraceAnalyzer();
        this.insightsGenerator = new InsightsGenerator();
    }
    async initialize() {
        console.log('AI Debug initialized successfully');
    }
    getInfo() {
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
    analyzeError(error) {
        return this.errorAnalyzer.analyzeError(error);
    }
    /**
     * Analyze stack trace
     */
    analyzeStackTrace(stackTrace) {
        return this.stackTraceAnalyzer.analyzeStackTrace(stackTrace);
    }
    /**
     * Generate debugging insights for code
     */
    generateInsights(code, filePath) {
        return this.insightsGenerator.generateInsights(code, filePath);
    }
    /**
     * Get context around error location
     */
    getErrorContext(frame, codeLines) {
        return this.stackTraceAnalyzer.getContext(frame, codeLines);
    }
    /**
     * Quick error diagnosis
     */
    diagnose(error) {
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
//# sourceMappingURL=index.js.map