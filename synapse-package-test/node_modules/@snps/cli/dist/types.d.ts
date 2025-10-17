/**
 * TypeScript type definitions for Synapse CLI
 * Comprehensive interface definitions for all CLI functionality
 */
export interface ProjectConfig {
    name: string;
    version: string;
    template?: string;
    features: string[];
    created_at: string;
    last_modified: string;
}
export interface PluginInfo {
    name: string;
    version: string;
    description: string;
    installed: boolean;
    dependencies: string[];
}
export interface TemplateInfo {
    name: string;
    description: string;
    features: string[];
    files: string[];
}
export interface DeploymentConfig {
    provider: string;
    region: string;
    bucket: string;
    credentials: Record<string, string>;
}
export interface Vulnerability {
    id: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    package: string;
    version: string;
}
export interface Dependency {
    name: string;
    version: string;
    latest_version: string;
    outdated: boolean;
    license: string;
}
export interface SecurityReport {
    vulnerabilities: Vulnerability[];
    dependencies: Dependency[];
    score: number;
    timestamp: string;
}
export interface PerformanceMetrics {
    build_time: number;
    bundle_size: number;
    memory_usage: number;
    cache_hit_rate: number;
    test_coverage: number;
}
export interface TestResult {
    name: string;
    status: 'passed' | 'failed' | 'skipped';
    duration: number;
    error?: string;
}
export interface LintIssue {
    file: string;
    line: number;
    column: number;
    severity: 'error' | 'warning' | 'info';
    message: string;
    rule: string;
    fixable: boolean;
}
export interface CodeAnalysis {
    complexity: {
        cyclomatic: number;
        cognitive: number;
        maintainability: number;
    };
    quality: {
        duplication: number;
        test_coverage: number;
        security_score: number;
    };
    performance: {
        bundle_size: string;
        load_time: string;
        memory_usage: string;
    };
    issues: string[];
    recommendations: string[];
}
export interface AIGenerateOptions {
    prompt: string;
    language?: string;
    framework?: string;
    save?: boolean;
    filename?: string;
}
export interface AICompleteOptions {
    context: string;
    language?: string;
    max_tokens?: number;
}
export interface AIFixOptions {
    issue: string;
    file?: string;
    auto_fix?: boolean;
}
export interface AITestOptions {
    target: string;
    framework?: 'jest' | 'vitest' | 'mocha';
    coverage?: boolean;
}
export interface AIDocsOptions {
    target: string;
    format?: 'markdown' | 'html' | 'json';
    include_examples?: boolean;
}
export interface AIRefactorOptions {
    target: string;
    suggestions?: string[];
    auto_apply?: boolean;
}
export interface AIOptimizeOptions {
    target: string;
    focus?: 'performance' | 'bundle_size' | 'memory' | 'all';
}
export interface AIAnalyzeOptions {
    target: string;
    include_complexity?: boolean;
    include_quality?: boolean;
    include_performance?: boolean;
}
export interface CloudDeployOptions {
    provider: 'aws' | 'gcp' | 'azure' | 'vercel' | 'netlify' | 'github-pages';
    region?: string;
    bucket?: string;
    credentials?: Record<string, string>;
    build_command?: string;
    output_dir?: string;
}
export interface SecurityScanOptions {
    target?: string;
    include_dependencies?: boolean;
    include_secrets?: boolean;
    include_compliance?: boolean;
    fix_issues?: boolean;
}
export interface PerformanceProfileOptions {
    target?: string;
    duration?: number;
    include_memory?: boolean;
    include_cpu?: boolean;
    output_format?: 'json' | 'html' | 'text';
}
export interface DatabaseMigrateOptions {
    direction: 'up' | 'down';
    target?: string;
    dry_run?: boolean;
    force?: boolean;
}
export interface DatabaseSeedOptions {
    target?: string;
    environment?: 'development' | 'staging' | 'production';
    force?: boolean;
}
export interface I18nExtractOptions {
    target?: string;
    locales?: string[];
    format?: 'json' | 'yaml' | 'po';
    include_metadata?: boolean;
}
export interface I18nValidateOptions {
    target?: string;
    locales?: string[];
    strict?: boolean;
    fix_issues?: boolean;
}
export interface AnalyticsStartOptions {
    project_id?: string;
    api_key?: string;
    endpoint?: string;
    batch_size?: number;
    flush_interval?: number;
}
export interface CacheStatsOptions {
    include_memory?: boolean;
    include_hit_rates?: boolean;
    include_policies?: boolean;
}
export interface CacheInvalidateOptions {
    pattern?: string;
    tags?: string[];
    all?: boolean;
}
export interface MonitorStartOptions {
    port?: number;
    metrics?: string[];
    alerts?: string[];
    dashboard?: boolean;
}
export interface TeamCreateOptions {
    name: string;
    description?: string;
    members?: string[];
    permissions?: string[];
}
export interface TeamInviteOptions {
    team_id: string;
    email: string;
    role?: 'admin' | 'member' | 'viewer';
}
export interface HotReloadStartOptions {
    port?: number;
    watch?: string[];
    ignore?: string[];
    debounce?: number;
}
export interface BatchProcessOptions {
    config_file?: string;
    parallel?: boolean;
    max_workers?: number;
    dry_run?: boolean;
}
export interface ConfigSetOptions {
    key: string;
    value: string;
    global?: boolean;
    project?: boolean;
}
export interface ConfigGetOptions {
    key?: string;
    global?: boolean;
    project?: boolean;
    all?: boolean;
}
export interface RustCompileOptions {
    target?: string;
    release?: boolean;
    features?: string[];
    optimization?: 'debug' | 'release' | 'size';
}
export interface DocsGenerateOptions {
    target?: string;
    format?: 'openapi' | 'swagger' | 'postman' | 'insomnia' | 'raml';
    output?: string;
    include_examples?: boolean;
}
export interface DocsServeOptions {
    port?: number;
    host?: string;
    open?: boolean;
    watch?: boolean;
}
export interface InitCommand {
    name: string;
    template?: string;
    yes?: boolean;
}
export interface DevCommand {
    port?: number;
    open?: boolean;
}
export interface BuildCommand {
    output?: string;
    minify?: boolean;
}
export interface TestCommand {
    pattern?: string;
    watch?: boolean;
}
export interface LintCommand {
    fix?: boolean;
}
export interface FormatCommand {
    check?: boolean;
}
export interface GenerateCommand {
    type: string;
    name: string;
}
export interface PluginCommand {
    action: 'install' | 'uninstall' | 'list' | 'update' | 'info';
    name?: string;
}
export interface TemplateCommand {
    action: 'create' | 'list' | 'install' | 'remove';
    name?: string;
}
export interface BatchCommand {
    action: 'process' | 'validate' | 'dry-run';
    config?: string;
}
export interface ConfigCommand {
    action: 'set' | 'get' | 'list' | 'remove';
    key?: string;
    value?: string;
}
export interface RustCommand {
    action: 'init' | 'compile' | 'test' | 'optimize';
    target?: string;
}
export interface HotReloadCommand {
    action: 'start' | 'stop' | 'restart' | 'status';
    options?: string;
}
export interface DeployCommand {
    action: 'start' | 'status' | 'rollback' | 'logs';
    target?: string;
}
export interface MonitorCommand {
    action: 'start' | 'stop' | 'status' | 'metrics';
    options?: string;
}
export interface ProfileCommand {
    action: 'start' | 'stop' | 'report' | 'analyze';
    options?: string;
}
export interface SecurityCommand {
    action: 'scan' | 'audit' | 'fix' | 'report';
    options?: string;
}
export interface DbCommand {
    action: 'migrate' | 'seed' | 'reset' | 'status';
    options?: string;
}
export interface DocsCommand {
    action: 'generate' | 'serve' | 'build' | 'validate';
    options?: string;
}
export interface I18nCommand {
    action: 'extract' | 'validate' | 'compile' | 'missing';
    options?: string;
}
export interface CacheCommand {
    action: 'stats' | 'clear' | 'invalidate' | 'optimize';
    options?: string;
}
export interface AnalyticsCommand {
    action: 'start' | 'stop' | 'report' | 'export';
    options?: string;
}
export interface AiCommand {
    action: 'generate' | 'complete' | 'fix' | 'test' | 'docs' | 'refactor' | 'optimize' | 'analyze';
    options?: string;
}
export interface CloudCommand {
    action: 'deploy' | 'sync' | 'status' | 'logs';
    options?: string;
}
export interface TeamCommand {
    action: 'create' | 'invite' | 'list' | 'remove' | 'permissions';
    options?: string;
}
export interface SynapseCLI {
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
}
export interface CLIEvent {
    type: 'build_start' | 'build_complete' | 'test_start' | 'test_complete' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: string;
    data?: any;
}
export interface CLIEventListener {
    (event: CLIEvent): void;
}
export declare class CLIError extends Error {
    code: string;
    details?: any;
    constructor(message: string, code: string, details?: any);
}
export declare class ValidationError extends CLIError {
    constructor(message: string, details?: any);
}
export declare class ConfigurationError extends CLIError {
    constructor(message: string, details?: any);
}
export declare class BuildError extends CLIError {
    constructor(message: string, details?: any);
}
export declare class TestError extends CLIError {
    constructor(message: string, details?: any);
}
export declare class DeploymentError extends CLIError {
    constructor(message: string, details?: any);
}
export * from './types';
