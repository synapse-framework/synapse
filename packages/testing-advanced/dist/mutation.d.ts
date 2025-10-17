/**
 * Mutation Testing
 * Validates test quality by introducing code mutations
 */
export interface MutationConfig {
    readonly threshold: number;
    readonly mutators?: string[];
}
export interface MutationResult {
    readonly total: number;
    readonly killed: number;
    readonly survived: number;
    readonly score: number;
    readonly mutations: Mutation[];
}
export interface Mutation {
    readonly id: string;
    readonly type: string;
    readonly location: string;
    readonly original: string;
    readonly mutated: string;
    killed: boolean;
}
export declare class MutationTester {
    private readonly config;
    constructor(config: MutationConfig);
    test(targetFile: string): Promise<MutationResult>;
    private generateMutations;
    private runTests;
}
//# sourceMappingURL=mutation.d.ts.map