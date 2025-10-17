#!/usr/bin/env node
/**
 * @snps/cli - Synapse Framework CLI
 * Comprehensive command-line interface for all framework operations
 *
 * This is the main entry point that provides both a TypeScript wrapper
 * and a fallback JavaScript implementation for the Rust CLI backend.
 */
export { SynapseCLIWrapper, createSynapseCLI } from './synapse-cli';
export * from './types';
export declare class SynapseCLI {
    readonly name = "SynapseCLI";
    readonly version = "2.0.0";
    constructor();
    run(): Promise<void>;
    private hasRustBinary;
    private runWithRust;
    private runWithJS;
    initProject(projectName?: string): Promise<void>;
    private createProjectStructure;
    private startDevServer;
    private buildProject;
    private findTypeScriptFiles;
    private compileTypeScriptFile;
    private copyPublicFiles;
    private copyDirectory;
    private runTests;
    private lintCode;
    private formatCode;
    private generateCode;
    private generateComponent;
    private generatePage;
    private generateApi;
    private generateTest;
    private handlePluginCommand;
    private getTsFiles;
    private formatTypeScript;
    private showVersion;
    private showHelp;
}
export default SynapseCLI;
