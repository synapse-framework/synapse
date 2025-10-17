/**
 * @snps/core - Core Synapse Framework Components
 * Runtime, Compiler, Testing, Linting, Router, State, Plugins
 */
export declare class SynapseRuntime {
    readonly name = "SynapseRuntime";
    readonly version = "0.1.0";
    constructor();
    start(): Promise<void>;
    stop(): Promise<void>;
}
export declare class SynapseCompiler {
    readonly name = "SynapseCompiler";
    readonly version = "0.1.0";
    constructor();
    compile(file?: string): Promise<string | void>;
    build(project: string): Promise<void>;
}
export declare class SynapseTestingFramework {
    readonly name = "SynapseTestingFramework";
    readonly version = "0.1.0";
    private testResults;
    constructor();
    runTests(): Promise<any[]>;
    runAllTests(): Promise<any[]>;
    getTestResults(): any[];
}
export declare class SynapseLintingSystem {
    readonly name = "SynapseLintingSystem";
    readonly version = "0.1.0";
    private lintResults;
    constructor();
    lint(): Promise<any[]>;
    lintProject(): Promise<any[]>;
    getLintResults(): any[];
}
export declare class SynapseRouter {
    readonly name = "SynapseRouter";
    readonly version = "0.1.0";
    private routes;
    private currentRoute;
    constructor();
    addRoute(path: string, handler: () => void): void;
    navigate(path: string): void;
    getCurrentRoute(): string;
    route(): Promise<void>;
}
export declare class SynapseStateManager {
    readonly name = "SynapseStateManager";
    readonly version = "0.1.0";
    private state;
    constructor();
    setState(key: string, value: any): void;
    getState(key: string): any;
    getAllState(): Record<string, any>;
    clearState(): void;
    manageState(): Promise<void>;
}
export declare class SynapsePluginSystem {
    readonly name = "SynapsePluginSystem";
    readonly version = "0.1.0";
    private plugins;
    constructor();
    initialize(): Promise<void>;
    loadPlugins(): Promise<void>;
    loadPlugin(name: string, plugin: any): void;
    getPlugin(name: string): any;
    getAllPlugins(): Record<string, any>;
}
//# sourceMappingURL=index.d.ts.map