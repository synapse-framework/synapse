/**
 * Synapse CLI TypeScript Wrapper
 * Comprehensive TypeScript interface for the Rust CLI backend
 */

import { spawn, ChildProcess } from 'child_process';
import { promises as fs } from 'fs';
import { join, resolve } from 'path';
import {
  SynapseCLI,
  ProjectConfig,
  InitCommand,
  DevCommand,
  BuildCommand,
  TestCommand,
  LintCommand,
  FormatCommand,
  GenerateCommand,
  PluginCommand,
  TemplateCommand,
  BatchCommand,
  ConfigCommand,
  RustCommand,
  HotReloadCommand,
  DeployCommand,
  MonitorCommand,
  ProfileCommand,
  SecurityCommand,
  DbCommand,
  DocsCommand,
  I18nCommand,
  CacheCommand,
  AnalyticsCommand,
  AiCommand,
  CloudCommand,
  TeamCommand,
  CLIEvent,
  CLIEventListener,
  CLIError,
  ValidationError,
  ConfigurationError,
  BuildError,
  TestError,
  DeploymentError
} from './types';

export class SynapseCLIWrapper implements SynapseCLI {
  private rustBinaryPath: string;
  private projectPath: string;
  private projectConfig: ProjectConfig | null = null;
  private eventListeners: Map<string, CLIEventListener[]> = new Map();
  private isInitialized = false;

  constructor(projectPath?: string) {
    this.projectPath = projectPath || process.cwd();
    this.rustBinaryPath = this.findRustBinary();
  }

  private findRustBinary(): string {
    // Try to find the Rust binary in different locations
    const possiblePaths = [
      join(__dirname, '..', 'dist', 'synapse-cli'),
      join(__dirname, '..', 'target', 'release', 'synapse-cli'),
      join(__dirname, '..', 'target', 'debug', 'synapse-cli'),
      'synapse-cli' // If installed globally
    ];

    for (const path of possiblePaths) {
      try {
        // Check if file exists and is executable
        fs.access(path, fs.constants.F_OK | fs.constants.X_OK);
        return path;
      } catch {
        continue;
      }
    }

    throw new CLIError(
      'Rust binary not found. Please build the CLI first.',
      'BINARY_NOT_FOUND'
    );
  }

  private async executeCommand(args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const process = spawn(this.rustBinaryPath, args, {
        cwd: this.projectPath,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      process.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      process.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new CLIError(
            `Command failed with code ${code}`,
            'COMMAND_FAILED',
            { stdout, stderr, code }
          ));
        }
      });

      process.on('error', (error) => {
        reject(new CLIError(
          `Failed to execute command: ${error.message}`,
          'COMMAND_ERROR',
          { error }
        ));
      });
    });
  }

  private emitEvent(event: CLIEvent): void {
    const listeners = this.eventListeners.get(event.type) || [];
    listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }

  // Event system
  public on(eventType: string, listener: CLIEventListener): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(listener);
  }

  public off(eventType: string, listener: CLIEventListener): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // Core commands
  public async init(options: InitCommand): Promise<void> {
    this.emitEvent({
      type: 'build_start',
      message: 'Initializing project...',
      timestamp: new Date().toISOString()
    });

    try {
      const args = ['init', options.name];
      if (options.template) {
        args.push('--template', options.template);
      }
      if (options.yes) {
        args.push('--yes');
      }

      await this.executeCommand(args);
      
      // Load the new project config
      await this.loadConfig();

      this.emitEvent({
        type: 'build_complete',
        message: 'Project initialized successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.emitEvent({
        type: 'error',
        message: `Failed to initialize project: ${error.message}`,
        timestamp: new Date().toISOString(),
        data: { error }
      });
      throw error;
    }
  }

  public async dev(options: DevCommand = {}): Promise<void> {
    this.emitEvent({
      type: 'build_start',
      message: 'Starting development server...',
      timestamp: new Date().toISOString()
    });

    try {
      const args = ['dev'];
      if (options.port) {
        args.push('--port', options.port.toString());
      }
      if (options.open) {
        args.push('--open');
      }

      // For dev server, we need to handle the long-running process differently
      await this.executeCommand(args);

      this.emitEvent({
        type: 'build_complete',
        message: 'Development server started',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.emitEvent({
        type: 'error',
        message: `Failed to start development server: ${error.message}`,
        timestamp: new Date().toISOString(),
        data: { error }
      });
      throw error;
    }
  }

  public async build(options: BuildCommand = {}): Promise<void> {
    this.emitEvent({
      type: 'build_start',
      message: 'Building project...',
      timestamp: new Date().toISOString()
    });

    try {
      const args = ['build'];
      if (options.output) {
        args.push('--output', options.output);
      }
      if (options.minify) {
        args.push('--minify');
      }

      await this.executeCommand(args);

      this.emitEvent({
        type: 'build_complete',
        message: 'Build completed successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.emitEvent({
        type: 'error',
        message: `Build failed: ${error.message}`,
        timestamp: new Date().toISOString(),
        data: { error }
      });
      throw new BuildError(`Build failed: ${error.message}`, { error });
    }
  }

  public async test(options: TestCommand = {}): Promise<void> {
    this.emitEvent({
      type: 'test_start',
      message: 'Running tests...',
      timestamp: new Date().toISOString()
    });

    try {
      const args = ['test'];
      if (options.pattern) {
        args.push(options.pattern);
      }
      if (options.watch) {
        args.push('--watch');
      }

      await this.executeCommand(args);

      this.emitEvent({
        type: 'test_complete',
        message: 'Tests completed successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.emitEvent({
        type: 'error',
        message: `Tests failed: ${error.message}`,
        timestamp: new Date().toISOString(),
        data: { error }
      });
      throw new TestError(`Tests failed: ${error.message}`, { error });
    }
  }

  public async lint(options: LintCommand = {}): Promise<void> {
    try {
      const args = ['lint'];
      if (options.fix) {
        args.push('--fix');
      }

      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Linting failed: ${error.message}`, 'LINT_ERROR', { error });
    }
  }

  public async format(options: FormatCommand = {}): Promise<void> {
    try {
      const args = ['format'];
      if (options.check) {
        args.push('--check');
      }

      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Formatting failed: ${error.message}`, 'FORMAT_ERROR', { error });
    }
  }

  public async generate(options: GenerateCommand): Promise<void> {
    try {
      const args = ['generate', '--type', options.type, options.name];
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Code generation failed: ${error.message}`, 'GENERATE_ERROR', { error });
    }
  }

  // Plugin management
  public async plugin(options: PluginCommand): Promise<void> {
    try {
      const args = ['plugin', options.action];
      if (options.name) {
        args.push(options.name);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Plugin operation failed: ${error.message}`, 'PLUGIN_ERROR', { error });
    }
  }

  public async template(options: TemplateCommand): Promise<void> {
    try {
      const args = ['template', options.action];
      if (options.name) {
        args.push(options.name);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Template operation failed: ${error.message}`, 'TEMPLATE_ERROR', { error });
    }
  }

  // Advanced features
  public async batch(options: BatchCommand): Promise<void> {
    try {
      const args = ['batch', options.action];
      if (options.config) {
        args.push('--config', options.config);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Batch operation failed: ${error.message}`, 'BATCH_ERROR', { error });
    }
  }

  public async config(options: ConfigCommand): Promise<void> {
    try {
      const args = ['config', options.action];
      if (options.key) {
        args.push(options.key);
      }
      if (options.value) {
        args.push(options.value);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new ConfigurationError(`Config operation failed: ${error.message}`, { error });
    }
  }

  public async rust(options: RustCommand): Promise<void> {
    try {
      const args = ['rust', options.action];
      if (options.target) {
        args.push('--target', options.target);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Rust operation failed: ${error.message}`, 'RUST_ERROR', { error });
    }
  }

  public async hotReload(options: HotReloadCommand): Promise<void> {
    try {
      const args = ['hot-reload', options.action];
      if (options.options) {
        args.push('--options', options.options);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Hot reload operation failed: ${error.message}`, 'HOT_RELOAD_ERROR', { error });
    }
  }

  public async deploy(options: DeployCommand): Promise<void> {
    try {
      const args = ['deploy', options.action];
      if (options.target) {
        args.push('--target', options.target);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new DeploymentError(`Deployment failed: ${error.message}`, { error });
    }
  }

  public async monitor(options: MonitorCommand): Promise<void> {
    try {
      const args = ['monitor', options.action];
      if (options.options) {
        args.push('--options', options.options);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Monitoring operation failed: ${error.message}`, 'MONITOR_ERROR', { error });
    }
  }

  public async profile(options: ProfileCommand): Promise<void> {
    try {
      const args = ['profile', options.action];
      if (options.options) {
        args.push('--options', options.options);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Profiling operation failed: ${error.message}`, 'PROFILE_ERROR', { error });
    }
  }

  public async security(options: SecurityCommand): Promise<void> {
    try {
      const args = ['security', options.action];
      if (options.options) {
        args.push('--options', options.options);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Security operation failed: ${error.message}`, 'SECURITY_ERROR', { error });
    }
  }

  public async db(options: DbCommand): Promise<void> {
    try {
      const args = ['db', options.action];
      if (options.options) {
        args.push('--options', options.options);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Database operation failed: ${error.message}`, 'DB_ERROR', { error });
    }
  }

  public async docs(options: DocsCommand): Promise<void> {
    try {
      const args = ['docs', options.action];
      if (options.options) {
        args.push('--options', options.options);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Documentation operation failed: ${error.message}`, 'DOCS_ERROR', { error });
    }
  }

  public async i18n(options: I18nCommand): Promise<void> {
    try {
      const args = ['i18n', options.action];
      if (options.options) {
        args.push('--options', options.options);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`I18n operation failed: ${error.message}`, 'I18N_ERROR', { error });
    }
  }

  public async cache(options: CacheCommand): Promise<void> {
    try {
      const args = ['cache', options.action];
      if (options.options) {
        args.push('--options', options.options);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Cache operation failed: ${error.message}`, 'CACHE_ERROR', { error });
    }
  }

  public async analytics(options: AnalyticsCommand): Promise<void> {
    try {
      const args = ['analytics', options.action];
      if (options.options) {
        args.push('--options', options.options);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Analytics operation failed: ${error.message}`, 'ANALYTICS_ERROR', { error });
    }
  }

  public async ai(options: AiCommand): Promise<void> {
    try {
      const args = ['ai', options.action];
      if (options.options) {
        args.push('--options', options.options);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`AI operation failed: ${error.message}`, 'AI_ERROR', { error });
    }
  }

  public async cloud(options: CloudCommand): Promise<void> {
    try {
      const args = ['cloud', options.action];
      if (options.options) {
        args.push('--options', options.options);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Cloud operation failed: ${error.message}`, 'CLOUD_ERROR', { error });
    }
  }

  public async team(options: TeamCommand): Promise<void> {
    try {
      const args = ['team', options.action];
      if (options.options) {
        args.push('--options', options.options);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Team operation failed: ${error.message}`, 'TEAM_ERROR', { error });
    }
  }

  // Utility methods
  public getVersion(): string {
    try {
      // This would typically read from package.json or a version file
      return '2.0.0';
    } catch {
      return 'unknown';
    }
  }

  public getConfig(): ProjectConfig | null {
    return this.projectConfig;
  }

  public setConfig(config: Partial<ProjectConfig>): void {
    if (this.projectConfig) {
      this.projectConfig = { ...this.projectConfig, ...config };
    } else {
      this.projectConfig = {
        name: config.name || 'unknown',
        version: config.version || '0.1.0',
        template: config.template,
        features: config.features || [],
        created_at: config.created_at || new Date().toISOString(),
        last_modified: new Date().toISOString()
      };
    }
  }

  public validateProject(): boolean {
    try {
      const packageJsonPath = join(this.projectPath, 'package.json');
      const synapseConfigPath = join(this.projectPath, '.synapse', 'config.json');
      
      // Check if package.json exists
      fs.access(packageJsonPath);
      
      // Check if .synapse directory exists
      fs.access(synapseConfigPath);
      
      return true;
    } catch {
      return false;
    }
  }

  public getProjectInfo(): {
    name: string;
    version: string;
    template?: string;
    features: string[];
  } | null {
    if (!this.projectConfig) {
      return null;
    }

    return {
      name: this.projectConfig.name,
      version: this.projectConfig.version,
      template: this.projectConfig.template,
      features: this.projectConfig.features
    };
  }

  private async loadConfig(): Promise<void> {
    try {
      const configPath = join(this.projectPath, '.synapse', 'config.json');
      const configData = await fs.readFile(configPath, 'utf-8');
      this.projectConfig = JSON.parse(configData);
    } catch {
      // Config file doesn't exist or is invalid
      this.projectConfig = null;
    }
  }

  // Initialize the CLI wrapper
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      await this.loadConfig();
      this.isInitialized = true;
    } catch (error) {
      throw new ConfigurationError(
        `Failed to initialize CLI: ${error.message}`,
        { error }
      );
    }
  }
}

// Factory function to create CLI instance
export function createSynapseCLI(projectPath?: string): SynapseCLIWrapper {
  return new SynapseCLIWrapper(projectPath);
}

// Default export
export default SynapseCLIWrapper;