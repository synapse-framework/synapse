/**
 * Property-Based Testing
 * Generative testing with random inputs
 */
export interface PropertyConfig {
    readonly iterations: number;
    readonly seed?: number;
}
export interface Property<T> {
    readonly name: string;
    readonly generator: () => T;
    readonly predicate: (value: T) => boolean;
}
export declare class PropertyTester {
    private readonly config;
    constructor(config: PropertyConfig);
    check<T>(property: Property<T>): PropertyTestResult;
    forAll<T>(generator: () => T, predicate: (value: T) => boolean, name?: string): PropertyTestResult;
    int(min?: number, max?: number): () => number;
    string(length?: number): () => string;
    array<T>(generator: () => T, length?: number): () => T[];
}
export interface PropertyTestResult {
    readonly property: string;
    readonly iterations: number;
    readonly passed: boolean;
    readonly failures: Array<{
        value: unknown;
        iteration: number;
    }>;
}
//# sourceMappingURL=property.d.ts.map