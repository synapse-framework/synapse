/**
 * @snps/ai-testing - Synapse Framework AI Testing
 * AI-generated test cases and scenarios with zero external dependencies
 */
/**
 * Test types
 */
export var TestType;
(function (TestType) {
    TestType["Unit"] = "unit";
    TestType["Integration"] = "integration";
    TestType["E2E"] = "e2e";
    TestType["Performance"] = "performance";
    TestType["Security"] = "security";
    TestType["Snapshot"] = "snapshot";
})(TestType || (TestType = {}));
/**
 * Test case priority
 */
export var Priority;
(function (Priority) {
    Priority["Critical"] = "critical";
    Priority["High"] = "high";
    Priority["Medium"] = "medium";
    Priority["Low"] = "low";
})(Priority || (Priority = {}));
/**
 * Test generator
 */
class TestGenerator {
    /**
     * Generate test cases from code
     */
    generateTests(code, fileName) {
        const tests = [];
        // Detect functions to test
        const functions = this.extractFunctions(code);
        for (const func of functions) {
            // Generate basic test
            tests.push(this.generateBasicTest(func, fileName));
            // Generate edge case tests
            tests.push(...this.generateEdgeCaseTests(func, fileName));
            // Generate error handling tests
            tests.push(...this.generateErrorTests(func, fileName));
        }
        return tests;
    }
    /**
     * Generate test suite
     */
    generateTestSuite(code, fileName) {
        const tests = this.generateTests(code, fileName);
        const name = this.getTestSuiteName(fileName);
        return {
            name,
            description: `Test suite for ${fileName}`,
            tests,
            setup: this.generateSetup(code),
            teardown: this.generateTeardown(code),
        };
    }
    /**
     * Extract functions from code
     */
    extractFunctions(code) {
        const functions = [];
        // Match function declarations
        const functionRegex = /(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)/g;
        let match;
        while ((match = functionRegex.exec(code)) !== null) {
            functions.push({
                name: match[1] || 'unknown',
                params: this.parseParams(match[2] || ''),
                isAsync: code.substring(Math.max(0, match.index - 20), match.index).includes('async'),
                isExported: code.substring(Math.max(0, match.index - 20), match.index).includes('export'),
            });
        }
        // Match arrow functions
        const arrowRegex = /(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s+)?\(([^)]*)\)\s*=>/g;
        while ((match = arrowRegex.exec(code)) !== null) {
            functions.push({
                name: match[1] || 'unknown',
                params: this.parseParams(match[2] || ''),
                isAsync: code.substring(match.index, match.index + 50).includes('async'),
                isExported: code.substring(Math.max(0, match.index - 20), match.index).includes('export'),
            });
        }
        // Match class methods
        const methodRegex = /(?:public|private|protected)?\s*(?:async\s+)?(\w+)\s*\(([^)]*)\)\s*[:{]/g;
        while ((match = methodRegex.exec(code)) !== null) {
            if (match[1] && !['if', 'for', 'while', 'switch'].includes(match[1])) {
                functions.push({
                    name: match[1],
                    params: this.parseParams(match[2] || ''),
                    isAsync: code.substring(Math.max(0, match.index - 20), match.index).includes('async'),
                    isExported: false,
                });
            }
        }
        return functions;
    }
    /**
     * Parse function parameters
     */
    parseParams(paramsStr) {
        if (!paramsStr.trim()) {
            return [];
        }
        return paramsStr.split(',').map(param => {
            const parts = param.trim().split(':');
            return {
                name: parts[0]?.trim() || 'param',
                type: parts[1]?.trim() || 'any',
            };
        });
    }
    /**
     * Generate basic test
     */
    generateBasicTest(func, fileName) {
        const testName = `should ${func.name} correctly`;
        const paramValues = this.generateParamValues(func.params);
        let code = `describe('${func.name}', () => {\n`;
        code += `  it('${testName}', ${func.isAsync ? 'async ' : ''}() => {\n`;
        if (paramValues.length > 0) {
            code += `    const result = ${func.isAsync ? 'await ' : ''}${func.name}(${paramValues.join(', ')});\n`;
        }
        else {
            code += `    const result = ${func.isAsync ? 'await ' : ''}${func.name}();\n`;
        }
        code += `    expect(result).toBeDefined();\n`;
        code += `  });\n`;
        code += `});\n`;
        return {
            name: testName,
            type: TestType.Unit,
            priority: Priority.High,
            description: `Basic test for ${func.name}`,
            code,
            assertions: ['expect(result).toBeDefined()'],
            tags: ['basic', 'unit'],
        };
    }
    /**
     * Generate edge case tests
     */
    generateEdgeCaseTests(func, fileName) {
        const tests = [];
        // Test with null/undefined
        if (func.params.length > 0) {
            tests.push({
                name: `should handle null/undefined in ${func.name}`,
                type: TestType.Unit,
                priority: Priority.High,
                description: `Edge case test for ${func.name} with null/undefined`,
                code: this.generateNullTest(func),
                assertions: ['expect(result).toBeDefined()'],
                tags: ['edge-case', 'null-check'],
            });
        }
        // Test with empty values
        if (func.params.some(p => p.type.includes('string') || p.type.includes('array'))) {
            tests.push({
                name: `should handle empty values in ${func.name}`,
                type: TestType.Unit,
                priority: Priority.Medium,
                description: `Edge case test for ${func.name} with empty values`,
                code: this.generateEmptyTest(func),
                assertions: ['expect(result).toBeDefined()'],
                tags: ['edge-case', 'empty-values'],
            });
        }
        // Test with large values
        if (func.params.some(p => p.type.includes('number'))) {
            tests.push({
                name: `should handle large numbers in ${func.name}`,
                type: TestType.Unit,
                priority: Priority.Low,
                description: `Edge case test for ${func.name} with large numbers`,
                code: this.generateLargeNumberTest(func),
                assertions: ['expect(result).toBeDefined()'],
                tags: ['edge-case', 'large-numbers'],
            });
        }
        return tests;
    }
    /**
     * Generate error handling tests
     */
    generateErrorTests(func, fileName) {
        const tests = [];
        if (func.isAsync) {
            tests.push({
                name: `should handle errors in ${func.name}`,
                type: TestType.Unit,
                priority: Priority.High,
                description: `Error handling test for ${func.name}`,
                code: this.generateErrorTest(func),
                assertions: ['expect(error).toBeDefined()'],
                tags: ['error-handling', 'async'],
            });
        }
        return tests;
    }
    /**
     * Generate parameter values
     */
    generateParamValues(params) {
        return params.map(param => {
            const type = param.type.toLowerCase();
            if (type.includes('string')) {
                return "'test'";
            }
            if (type.includes('number')) {
                return '42';
            }
            if (type.includes('boolean')) {
                return 'true';
            }
            if (type.includes('array')) {
                return '[]';
            }
            if (type.includes('object')) {
                return '{}';
            }
            return 'null';
        });
    }
    /**
     * Generate null test
     */
    generateNullTest(func) {
        let code = `it('should handle null/undefined', ${func.isAsync ? 'async ' : ''}() => {\n`;
        code += `  const result = ${func.isAsync ? 'await ' : ''}${func.name}(null);\n`;
        code += `  expect(result).toBeDefined();\n`;
        code += `});\n`;
        return code;
    }
    /**
     * Generate empty test
     */
    generateEmptyTest(func) {
        let code = `it('should handle empty values', ${func.isAsync ? 'async ' : ''}() => {\n`;
        code += `  const result = ${func.isAsync ? 'await ' : ''}${func.name}('');\n`;
        code += `  expect(result).toBeDefined();\n`;
        code += `});\n`;
        return code;
    }
    /**
     * Generate large number test
     */
    generateLargeNumberTest(func) {
        let code = `it('should handle large numbers', ${func.isAsync ? 'async ' : ''}() => {\n`;
        code += `  const result = ${func.isAsync ? 'await ' : ''}${func.name}(Number.MAX_SAFE_INTEGER);\n`;
        code += `  expect(result).toBeDefined();\n`;
        code += `});\n`;
        return code;
    }
    /**
     * Generate error test
     */
    generateErrorTest(func) {
        let code = `it('should handle errors', async () => {\n`;
        code += `  try {\n`;
        code += `    await ${func.name}(invalidInput);\n`;
        code += `    expect(true).toBe(false); // Should not reach here\n`;
        code += `  } catch (error) {\n`;
        code += `    expect(error).toBeDefined();\n`;
        code += `  }\n`;
        code += `});\n`;
        return code;
    }
    /**
     * Generate test suite name
     */
    getTestSuiteName(fileName) {
        return fileName.replace(/\.(ts|js)$/, '').replace(/[/-]/g, ' ');
    }
    /**
     * Generate setup code
     */
    generateSetup(code) {
        if (code.includes('beforeEach') || code.includes('class')) {
            return 'beforeEach(() => {\n  // Setup\n});';
        }
        return undefined;
    }
    /**
     * Generate teardown code
     */
    generateTeardown(code) {
        if (code.includes('afterEach') || code.includes('cleanup')) {
            return 'afterEach(() => {\n  // Cleanup\n});';
        }
        return undefined;
    }
}
/**
 * Edge case detector
 */
class EdgeCaseDetector {
    /**
     * Detect edge cases from code
     */
    detectEdgeCases(code, functionName) {
        const cases = [];
        // Detect null/undefined checks
        if (code.includes('null') || code.includes('undefined')) {
            cases.push({
                scenario: 'Null/undefined input',
                input: null,
                expectedOutput: 'Should handle gracefully',
                description: 'Function should handle null or undefined input',
                priority: Priority.Critical,
            });
        }
        // Detect array operations
        if (code.includes('.map') || code.includes('.filter') || code.includes('.reduce')) {
            cases.push({
                scenario: 'Empty array',
                input: [],
                expectedOutput: 'Should return empty or default',
                description: 'Function should handle empty arrays',
                priority: Priority.High,
            });
        }
        // Detect string operations
        if (code.includes('.split') || code.includes('.substring') || code.includes('.slice')) {
            cases.push({
                scenario: 'Empty string',
                input: '',
                expectedOutput: 'Should handle gracefully',
                description: 'Function should handle empty strings',
                priority: Priority.High,
            });
        }
        // Detect numeric operations
        if (code.includes('*') || code.includes('/') || code.includes('%')) {
            cases.push({
                scenario: 'Zero value',
                input: 0,
                expectedOutput: 'Should handle division by zero',
                description: 'Function should handle zero in calculations',
                priority: Priority.Critical,
            });
            cases.push({
                scenario: 'Negative numbers',
                input: -1,
                expectedOutput: 'Should handle negative values',
                description: 'Function should handle negative numbers',
                priority: Priority.Medium,
            });
            cases.push({
                scenario: 'Very large numbers',
                input: Number.MAX_SAFE_INTEGER,
                expectedOutput: 'Should handle without overflow',
                description: 'Function should handle large numbers',
                priority: Priority.Low,
            });
        }
        return cases;
    }
}
/**
 * Coverage analyzer
 */
class CoverageAnalyzer {
    /**
     * Analyze test coverage
     */
    analyzeCoverage(code, tests) {
        const totalLines = code.split('\n').length;
        const testedFunctions = new Set(tests.map(t => this.extractFunctionName(t.code)));
        const allFunctions = this.extractAllFunctions(code);
        const coveredFunctions = allFunctions.filter(f => testedFunctions.has(f));
        const uncoveredFunctions = allFunctions.filter(f => !testedFunctions.has(f));
        const coveredLines = Math.floor((coveredFunctions.length / Math.max(allFunctions.length, 1)) * totalLines);
        const percentage = (coveredLines / totalLines) * 100;
        const suggestions = this.generateCoverageSuggestions(code, uncoveredFunctions);
        return {
            totalLines,
            coveredLines,
            percentage,
            uncoveredLines: [],
            uncoveredFunctions,
            suggestions,
        };
    }
    /**
     * Extract function name from test
     */
    extractFunctionName(testCode) {
        const match = testCode.match(/describe\('(\w+)'/);
        return match?.[1] || '';
    }
    /**
     * Extract all functions from code
     */
    extractAllFunctions(code) {
        const functions = [];
        const functionRegex = /function\s+(\w+)|const\s+(\w+)\s*=.*?=>|(\w+)\s*\([^)]*\)\s*[:{]/g;
        let match;
        while ((match = functionRegex.exec(code)) !== null) {
            const name = match[1] || match[2] || match[3];
            if (name && !['if', 'for', 'while', 'switch'].includes(name)) {
                functions.push(name);
            }
        }
        return functions;
    }
    /**
     * Generate coverage suggestions
     */
    generateCoverageSuggestions(code, uncoveredFunctions) {
        const suggestions = [];
        for (const func of uncoveredFunctions) {
            suggestions.push({
                type: 'missing-test',
                description: `Add test for function: ${func}`,
                location: {
                    file: 'source.ts',
                    line: 0,
                },
            });
        }
        return suggestions;
    }
}
/**
 * Mutation testing suggester
 */
class MutationTester {
    /**
     * Generate mutation testing suggestions
     */
    generateMutations(code) {
        const mutations = [];
        // Operator mutations
        mutations.push(...this.generateOperatorMutations(code));
        // Constant mutations
        mutations.push(...this.generateConstantMutations(code));
        // Condition mutations
        mutations.push(...this.generateConditionMutations(code));
        return mutations;
    }
    /**
     * Generate operator mutations
     */
    generateOperatorMutations(code) {
        const mutations = [];
        if (code.includes('+')) {
            mutations.push({
                type: 'operator',
                original: '+',
                mutated: '-',
                location: { file: 'source.ts', line: 0 },
                description: 'Change + to - to test operator coverage',
                testNeeded: true,
            });
        }
        if (code.includes('===')) {
            mutations.push({
                type: 'operator',
                original: '===',
                mutated: '!==',
                location: { file: 'source.ts', line: 0 },
                description: 'Change === to !== to test equality checks',
                testNeeded: true,
            });
        }
        return mutations;
    }
    /**
     * Generate constant mutations
     */
    generateConstantMutations(code) {
        const mutations = [];
        if (code.includes('true')) {
            mutations.push({
                type: 'constant',
                original: 'true',
                mutated: 'false',
                location: { file: 'source.ts', line: 0 },
                description: 'Change true to false to test boolean logic',
                testNeeded: true,
            });
        }
        return mutations;
    }
    /**
     * Generate condition mutations
     */
    generateConditionMutations(code) {
        const mutations = [];
        if (code.includes('if')) {
            mutations.push({
                type: 'condition',
                original: 'if (condition)',
                mutated: 'if (!condition)',
                location: { file: 'source.ts', line: 0 },
                description: 'Negate condition to test branch coverage',
                testNeeded: true,
            });
        }
        return mutations;
    }
}
/**
 * Main AI Testing class
 */
export class SynapseAITesting {
    name = 'SynapseAITesting';
    version = '0.1.0';
    testGenerator;
    edgeCaseDetector;
    coverageAnalyzer;
    mutationTester;
    constructor() {
        this.testGenerator = new TestGenerator();
        this.edgeCaseDetector = new EdgeCaseDetector();
        this.coverageAnalyzer = new CoverageAnalyzer();
        this.mutationTester = new MutationTester();
    }
    async initialize() {
        console.log('AI Testing initialized successfully');
    }
    getInfo() {
        return {
            name: this.name,
            version: this.version,
            features: [
                'AI Test Generation',
                'Edge Case Detection',
                'Coverage Analysis',
                'Mutation Testing',
                'Test Suite Generation',
                'Smart Test Recommendations',
            ],
        };
    }
    /**
     * Generate tests from code
     */
    generateTests(code, fileName) {
        return this.testGenerator.generateTests(code, fileName);
    }
    /**
     * Generate test suite
     */
    generateTestSuite(code, fileName) {
        return this.testGenerator.generateTestSuite(code, fileName);
    }
    /**
     * Detect edge cases
     */
    detectEdgeCases(code, functionName) {
        return this.edgeCaseDetector.detectEdgeCases(code, functionName);
    }
    /**
     * Analyze test coverage
     */
    analyzeCoverage(code, tests) {
        return this.coverageAnalyzer.analyzeCoverage(code, tests);
    }
    /**
     * Generate mutation testing suggestions
     */
    generateMutations(code) {
        return this.mutationTester.generateMutations(code);
    }
}
// Default export
export default SynapseAITesting;
//# sourceMappingURL=index.js.map