/**
 * Synapse CLI TypeScript Wrapper
 * Comprehensive TypeScript interface for the Rust CLI backend
 */
import { SynapseCLI, ProjectConfig, InitCommand, DevCommand, BuildCommand, TestCommand, LintCommand, FormatCommand, GenerateCommand, PluginCommand, TemplateCommand, BatchCommand, ConfigCommand, RustCommand, HotReloadCommand, DeployCommand, MonitorCommand, ProfileCommand, SecurityCommand, DbCommand, DocsCommand, I18nCommand, CacheCommand, AnalyticsCommand, AiCommand, CloudCommand, TeamCommand, CLIEventListener } from './types';
export declare class SynapseCLIWrapper implements SynapseCLI {
    private rustBinaryPath;
    private projectPath;
    private projectConfig;
    private eventListeners;
    private isInitialized;
    constructor(projectPath?: string);
    private findRustBinary;
    private executeCommand;
    private emitEvent;
    on(eventType: string, listener: CLIEventListener): void;
    off(eventType: string, listener: CLIEventListener): void;
    init(options: InitCommand): Promise<void>;
    dev(options?: DevCommand): Promise<void>;
    build(options?: BuildCommand): Promise<void>;
    test(options?: TestCommand): Promise<void>;
    lint(options?: LintCommand): Promise<void>;
    format(options?: FormatCommand): Promise<void>;
    generate(options: GenerateCommand): Promise<void>;
    plugin(options: PluginCommand): Promise<void>;
    template(options: TemplateCommand): Promise<void>;
    batch(options: BatchCommand): Promise<void>;
    config(options: ConfigCommand): Promise<void>;
    rust(options: RustCommand): Promise<void>;
    hotReload(options: HotReloadCommand): Promise<void>;
    deploy(options: DeployCommand): Promise<void>;
    monitor(options: MonitorCommand): Promise<void>;
    profile(options: ProfileCommand): Promise<void>;
    security(options: SecurityCommand): Promise<void>;
    db(options: DbCommand): Promise<void>;
    docs(options: DocsCommand): Promise<void>;
    i18n(options: I18nCommand): Promise<void>;
    cache(options: CacheCommand): Promise<void>;
    analytics(options: AnalyticsCommand): Promise<void>;
    ai(options: AiCommand): Promise<void>;
    cloud(options: CloudCommand): Promise<void>;
    team(options: TeamCommand): Promise<void>;
    getVersion(): string;
    getConfig(): ProjectConfig | null;
    setConfig(config: Partial<ProjectConfig>): void;
    validateProject(): boolean;
    getProjectInfo(): {
        name: string;
        version: string;
        template?: string;
        features: string[];
    } | null;
    private loadConfig;
    initialize(): Promise<void>;
}
export declare function createSynapseCLI(projectPath?: string): SynapseCLIWrapper;
export default SynapseCLIWrapper;
