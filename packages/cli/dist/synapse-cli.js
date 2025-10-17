// src/synapse-cli.ts
import { spawn } from "child_process";
import { promises as fs } from "fs";
import { join } from "path";

// src/types.ts
var CLIError = class extends Error {
  constructor(message, code, details) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = "CLIError";
  }
};
var ConfigurationError = class extends CLIError {
  constructor(message, details) {
    super(message, "CONFIGURATION_ERROR", details);
    this.name = "ConfigurationError";
  }
};
var BuildError = class extends CLIError {
  constructor(message, details) {
    super(message, "BUILD_ERROR", details);
    this.name = "BuildError";
  }
};
var TestError = class extends CLIError {
  constructor(message, details) {
    super(message, "TEST_ERROR", details);
    this.name = "TestError";
  }
};
var DeploymentError = class extends CLIError {
  constructor(message, details) {
    super(message, "DEPLOYMENT_ERROR", details);
    this.name = "DeploymentError";
  }
};

// src/synapse-cli.ts
var SynapseCLIWrapper = class {
  rustBinaryPath;
  projectPath;
  projectConfig = null;
  eventListeners = /* @__PURE__ */ new Map();
  isInitialized = false;
  constructor(projectPath) {
    this.projectPath = projectPath || process.cwd();
    this.rustBinaryPath = this.findRustBinary();
  }
  findRustBinary() {
    const possiblePaths = [
      join(__dirname, "..", "dist", "synapse-cli"),
      join(__dirname, "..", "target", "release", "synapse-cli"),
      join(__dirname, "..", "target", "debug", "synapse-cli"),
      "synapse-cli"
      // If installed globally
    ];
    for (const path of possiblePaths) {
      try {
        fs.access(path, fs.constants.F_OK | fs.constants.X_OK);
        return path;
      } catch {
        continue;
      }
    }
    throw new CLIError(
      "Rust binary not found. Please build the CLI first.",
      "BINARY_NOT_FOUND"
    );
  }
  async executeCommand(args) {
    return new Promise((resolve2, reject) => {
      const process2 = spawn(this.rustBinaryPath, args, {
        cwd: this.projectPath,
        stdio: ["pipe", "pipe", "pipe"]
      });
      let stdout = "";
      let stderr = "";
      process2.stdout?.on("data", (data) => {
        stdout += data.toString();
      });
      process2.stderr?.on("data", (data) => {
        stderr += data.toString();
      });
      process2.on("close", (code) => {
        if (code === 0) {
          resolve2(stdout);
        } else {
          reject(new CLIError(
            `Command failed with code ${code}`,
            "COMMAND_FAILED",
            { stdout, stderr, code }
          ));
        }
      });
      process2.on("error", (error) => {
        reject(new CLIError(
          `Failed to execute command: ${error.message}`,
          "COMMAND_ERROR",
          { error }
        ));
      });
    });
  }
  emitEvent(event) {
    const listeners = this.eventListeners.get(event.type) || [];
    listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error("Error in event listener:", error);
      }
    });
  }
  // Event system
  on(eventType, listener) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType).push(listener);
  }
  off(eventType, listener) {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
  // Core commands
  async init(options) {
    this.emitEvent({
      type: "build_start",
      message: "Initializing project...",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    try {
      const args = ["init", options.name];
      if (options.template) {
        args.push("--template", options.template);
      }
      if (options.yes) {
        args.push("--yes");
      }
      await this.executeCommand(args);
      await this.loadConfig();
      this.emitEvent({
        type: "build_complete",
        message: "Project initialized successfully",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      this.emitEvent({
        type: "error",
        message: `Failed to initialize project: ${error.message}`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        data: { error }
      });
      throw error;
    }
  }
  async dev(options = {}) {
    this.emitEvent({
      type: "build_start",
      message: "Starting development server...",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    try {
      const args = ["dev"];
      if (options.port) {
        args.push("--port", options.port.toString());
      }
      if (options.open) {
        args.push("--open");
      }
      await this.executeCommand(args);
      this.emitEvent({
        type: "build_complete",
        message: "Development server started",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      this.emitEvent({
        type: "error",
        message: `Failed to start development server: ${error.message}`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        data: { error }
      });
      throw error;
    }
  }
  async build(options = {}) {
    this.emitEvent({
      type: "build_start",
      message: "Building project...",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    try {
      const args = ["build"];
      if (options.output) {
        args.push("--output", options.output);
      }
      if (options.minify) {
        args.push("--minify");
      }
      await this.executeCommand(args);
      this.emitEvent({
        type: "build_complete",
        message: "Build completed successfully",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      this.emitEvent({
        type: "error",
        message: `Build failed: ${error.message}`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        data: { error }
      });
      throw new BuildError(`Build failed: ${error.message}`, { error });
    }
  }
  async test(options = {}) {
    this.emitEvent({
      type: "test_start",
      message: "Running tests...",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    try {
      const args = ["test"];
      if (options.pattern) {
        args.push(options.pattern);
      }
      if (options.watch) {
        args.push("--watch");
      }
      await this.executeCommand(args);
      this.emitEvent({
        type: "test_complete",
        message: "Tests completed successfully",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      this.emitEvent({
        type: "error",
        message: `Tests failed: ${error.message}`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        data: { error }
      });
      throw new TestError(`Tests failed: ${error.message}`, { error });
    }
  }
  async lint(options = {}) {
    try {
      const args = ["lint"];
      if (options.fix) {
        args.push("--fix");
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Linting failed: ${error.message}`, "LINT_ERROR", { error });
    }
  }
  async format(options = {}) {
    try {
      const args = ["format"];
      if (options.check) {
        args.push("--check");
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Formatting failed: ${error.message}`, "FORMAT_ERROR", { error });
    }
  }
  async generate(options) {
    try {
      const args = ["generate", "--type", options.type, options.name];
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Code generation failed: ${error.message}`, "GENERATE_ERROR", { error });
    }
  }
  // Plugin management
  async plugin(options) {
    try {
      const args = ["plugin", options.action];
      if (options.name) {
        args.push(options.name);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Plugin operation failed: ${error.message}`, "PLUGIN_ERROR", { error });
    }
  }
  async template(options) {
    try {
      const args = ["template", options.action];
      if (options.name) {
        args.push(options.name);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Template operation failed: ${error.message}`, "TEMPLATE_ERROR", { error });
    }
  }
  // Advanced features
  async batch(options) {
    try {
      const args = ["batch", options.action];
      if (options.config) {
        args.push("--config", options.config);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Batch operation failed: ${error.message}`, "BATCH_ERROR", { error });
    }
  }
  async config(options) {
    try {
      const args = ["config", options.action];
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
  async rust(options) {
    try {
      const args = ["rust", options.action];
      if (options.target) {
        args.push("--target", options.target);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Rust operation failed: ${error.message}`, "RUST_ERROR", { error });
    }
  }
  async hotReload(options) {
    try {
      const args = ["hot-reload", options.action];
      if (options.options) {
        args.push("--options", options.options);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Hot reload operation failed: ${error.message}`, "HOT_RELOAD_ERROR", { error });
    }
  }
  async deploy(options) {
    try {
      const args = ["deploy", options.action];
      if (options.target) {
        args.push("--target", options.target);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new DeploymentError(`Deployment failed: ${error.message}`, { error });
    }
  }
  async monitor(options) {
    try {
      const args = ["monitor", options.action];
      if (options.options) {
        args.push("--options", options.options);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Monitoring operation failed: ${error.message}`, "MONITOR_ERROR", { error });
    }
  }
  async profile(options) {
    try {
      const args = ["profile", options.action];
      if (options.options) {
        args.push("--options", options.options);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Profiling operation failed: ${error.message}`, "PROFILE_ERROR", { error });
    }
  }
  async security(options) {
    try {
      const args = ["security", options.action];
      if (options.options) {
        args.push("--options", options.options);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Security operation failed: ${error.message}`, "SECURITY_ERROR", { error });
    }
  }
  async db(options) {
    try {
      const args = ["db", options.action];
      if (options.options) {
        args.push("--options", options.options);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Database operation failed: ${error.message}`, "DB_ERROR", { error });
    }
  }
  async docs(options) {
    try {
      const args = ["docs", options.action];
      if (options.options) {
        args.push("--options", options.options);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Documentation operation failed: ${error.message}`, "DOCS_ERROR", { error });
    }
  }
  async i18n(options) {
    try {
      const args = ["i18n", options.action];
      if (options.options) {
        args.push("--options", options.options);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`I18n operation failed: ${error.message}`, "I18N_ERROR", { error });
    }
  }
  async cache(options) {
    try {
      const args = ["cache", options.action];
      if (options.options) {
        args.push("--options", options.options);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Cache operation failed: ${error.message}`, "CACHE_ERROR", { error });
    }
  }
  async analytics(options) {
    try {
      const args = ["analytics", options.action];
      if (options.options) {
        args.push("--options", options.options);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Analytics operation failed: ${error.message}`, "ANALYTICS_ERROR", { error });
    }
  }
  async ai(options) {
    try {
      const args = ["ai", options.action];
      if (options.options) {
        args.push("--options", options.options);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`AI operation failed: ${error.message}`, "AI_ERROR", { error });
    }
  }
  async cloud(options) {
    try {
      const args = ["cloud", options.action];
      if (options.options) {
        args.push("--options", options.options);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Cloud operation failed: ${error.message}`, "CLOUD_ERROR", { error });
    }
  }
  async team(options) {
    try {
      const args = ["team", options.action];
      if (options.options) {
        args.push("--options", options.options);
      }
      await this.executeCommand(args);
    } catch (error) {
      throw new CLIError(`Team operation failed: ${error.message}`, "TEAM_ERROR", { error });
    }
  }
  // Utility methods
  getVersion() {
    try {
      return "2.0.0";
    } catch {
      return "unknown";
    }
  }
  getConfig() {
    return this.projectConfig;
  }
  setConfig(config) {
    if (this.projectConfig) {
      this.projectConfig = { ...this.projectConfig, ...config };
    } else {
      this.projectConfig = {
        name: config.name || "unknown",
        version: config.version || "0.1.0",
        template: config.template,
        features: config.features || [],
        created_at: config.created_at || (/* @__PURE__ */ new Date()).toISOString(),
        last_modified: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
  }
  validateProject() {
    try {
      const packageJsonPath = join(this.projectPath, "package.json");
      const synapseConfigPath = join(this.projectPath, ".synapse", "config.json");
      fs.access(packageJsonPath);
      fs.access(synapseConfigPath);
      return true;
    } catch {
      return false;
    }
  }
  getProjectInfo() {
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
  async loadConfig() {
    try {
      const configPath = join(this.projectPath, ".synapse", "config.json");
      const configData = await fs.readFile(configPath, "utf-8");
      this.projectConfig = JSON.parse(configData);
    } catch {
      this.projectConfig = null;
    }
  }
  // Initialize the CLI wrapper
  async initialize() {
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
};
function createSynapseCLI(projectPath) {
  return new SynapseCLIWrapper(projectPath);
}
var synapse_cli_default = SynapseCLIWrapper;
export {
  SynapseCLIWrapper,
  createSynapseCLI,
  synapse_cli_default as default
};
