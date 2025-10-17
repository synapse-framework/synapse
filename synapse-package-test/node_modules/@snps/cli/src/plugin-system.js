/**
 * Advanced Plugin System for Synapse CLI
 * Comprehensive plugin architecture with hooks, lifecycle management, and hot-swapping
 */

import { promises as fs } from 'fs';
import { join, resolve, dirname, extname, basename } from 'path';
import { EventEmitter } from 'events';

export class PluginSystem extends EventEmitter {
  constructor(options = {}) {
    super();
    this.root = options.root || process.cwd();
    this.pluginsDir = options.pluginsDir || join(this.root, '.synapse', 'plugins');
    this.nodeModulesDir = join(this.root, 'node_modules');
    this.verbose = options.verbose || false;
    
    this.plugins = new Map();
    this.hooks = new Map();
    this.commands = new Map();
    this.middleware = new Map();
    this.templates = new Map();
    this.rules = new Map();
    
    this.pluginConfig = new Map();
    this.dependencies = new Map();
    this.loadOrder = [];
    
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    console.log('🔌 Initializing Plugin System...');
    
    try {
      // Ensure plugins directory exists
      await fs.mkdir(this.pluginsDir, { recursive: true });
      
      // Load plugin configuration
      await this.loadPluginConfig();
      
      // Discover and load plugins
      await this.discoverPlugins();
      await this.resolveDependencies();
      await this.loadPlugins();
      
      // Initialize all plugins
      await this.initializePlugins();
      
      this.initialized = true;
      console.log(`✅ Plugin System initialized: ${this.plugins.size} plugins loaded`);
      
    } catch (error) {
      console.error('❌ Failed to initialize Plugin System:', error.message);
      throw error;
    }
  }

  async loadPluginConfig() {
    const configPath = join(this.root, '.synapse', 'plugins.json');
    
    try {
      const config = JSON.parse(await fs.readFile(configPath, 'utf-8'));
      
      for (const [name, pluginConfig] of Object.entries(config)) {
        this.pluginConfig.set(name, pluginConfig);
      }
      
      console.log(`📋 Loaded configuration for ${this.pluginConfig.size} plugins`);
    } catch (error) {
      // No config file exists, create default
      await this.createDefaultConfig();
    }
  }

  async createDefaultConfig() {
    const defaultConfig = {
      "enabled": true,
      "autoUpdate": true,
      "trustedSources": ["@synapse", "synapse-"],
      "security": {
        "sandbox": true,
        "allowFileSystem": false,
        "allowNetwork": true,
        "allowProcess": false
      }
    };
    
    const configPath = join(this.root, '.synapse', 'plugins.json');
    await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2));
    console.log('✅ Created default plugin configuration');
  }

  async discoverPlugins() {
    console.log('🔍 Discovering plugins...');
    
    // Discover local plugins
    await this.discoverLocalPlugins();
    
    // Discover node_modules plugins
    await this.discoverNodeModulesPlugins();
    
    // Discover global plugins
    await this.discoverGlobalPlugins();
    
    console.log(`📦 Discovered ${this.plugins.size} plugins`);
  }

  async discoverLocalPlugins() {
    try {
      const entries = await fs.readdir(this.pluginsDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const pluginPath = join(this.pluginsDir, entry.name);
          await this.loadPluginManifest(pluginPath, 'local');
        }
      }
    } catch (error) {
      // Plugins directory doesn't exist
    }
  }

  async discoverNodeModulesPlugins() {
    try {
      const entries = await fs.readdir(this.nodeModulesDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.name.startsWith('synapse-plugin-') || entry.name.startsWith('@synapse/')) {
          const pluginPath = join(this.nodeModulesDir, entry.name);
          await this.loadPluginManifest(pluginPath, 'npm');
        }
      }
    } catch (error) {
      // node_modules doesn't exist
    }
  }

  async discoverGlobalPlugins() {
    // Placeholder for global plugin discovery
    // In a real implementation, this would check global npm packages
  }

  async loadPluginManifest(pluginPath, source) {
    try {
      const manifestPath = join(pluginPath, 'synapse-plugin.json');
      const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
      
      const plugin = {
        name: manifest.name,
        version: manifest.version,
        description: manifest.description,
        author: manifest.author,
        source,
        path: pluginPath,
        manifest,
        loaded: false,
        initialized: false
      };
      
      this.plugins.set(plugin.name, plugin);
      
      if (this.verbose) {
        console.log(`  📦 Found plugin: ${plugin.name}@${plugin.version} (${source})`);
      }
      
    } catch (error) {
      if (this.verbose) {
        console.log(`  ⚠️  Invalid plugin manifest: ${pluginPath}`);
      }
    }
  }

  async resolveDependencies() {
    console.log('🔗 Resolving plugin dependencies...');
    
    // Build dependency graph
    const depGraph = new Map();
    
    for (const [name, plugin] of this.plugins) {
      const deps = plugin.manifest.dependencies || [];
      depGraph.set(name, deps);
    }
    
    // Topological sort
    this.loadOrder = this.topologicalSort(depGraph);
    
    console.log(`✅ Dependency resolution completed: ${this.loadOrder.length} plugins ordered`);
  }

  topologicalSort(graph) {
    const visited = new Set();
    const visiting = new Set();
    const result = [];
    
    const visit = (node) => {
      if (visiting.has(node)) {
        throw new Error(`Circular dependency detected: ${node}`);
      }
      
      if (visited.has(node)) return;
      
      visiting.add(node);
      
      const deps = graph.get(node) || [];
      for (const dep of deps) {
        if (graph.has(dep)) {
          visit(dep);
        }
      }
      
      visiting.delete(node);
      visited.add(node);
      result.push(node);
    };
    
    for (const node of graph.keys()) {
      visit(node);
    }
    
    return result;
  }

  async loadPlugins() {
    console.log('📥 Loading plugins...');
    
    for (const pluginName of this.loadOrder) {
      const plugin = this.plugins.get(pluginName);
      if (!plugin) continue;
      
      try {
        await this.loadPlugin(plugin);
        plugin.loaded = true;
        
        if (this.verbose) {
          console.log(`  ✅ Loaded: ${plugin.name}@${plugin.version}`);
        }
        
      } catch (error) {
        console.error(`  ❌ Failed to load ${plugin.name}: ${error.message}`);
      }
    }
  }

  async loadPlugin(plugin) {
    const mainFile = join(plugin.path, plugin.manifest.main || 'index.js');
    
    try {
      // Dynamic import of plugin
      const pluginModule = await import(mainFile);
      const PluginClass = pluginModule.default || pluginModule;
      
      // Instantiate plugin
      const pluginInstance = new PluginClass({
        root: this.root,
        pluginSystem: this,
        config: this.pluginConfig.get(plugin.name) || {}
      });
      
      plugin.instance = pluginInstance;
      
      // Register plugin capabilities
      await this.registerPluginCapabilities(plugin);
      
    } catch (error) {
      throw new Error(`Failed to load plugin ${plugin.name}: ${error.message}`);
    }
  }

  async registerPluginCapabilities(plugin) {
    const instance = plugin.instance;
    
    // Register hooks
    if (instance.hooks) {
      for (const [hookName, handler] of Object.entries(instance.hooks)) {
        this.registerHook(hookName, handler, plugin.name);
      }
    }
    
    // Register commands
    if (instance.commands) {
      for (const [commandName, command] of Object.entries(instance.commands)) {
        this.registerCommand(commandName, command, plugin.name);
      }
    }
    
    // Register middleware
    if (instance.middleware) {
      for (const [middlewareName, middleware] of Object.entries(instance.middleware)) {
        this.registerMiddleware(middlewareName, middleware, plugin.name);
      }
    }
    
    // Register templates
    if (instance.templates) {
      for (const [templateName, template] of Object.entries(instance.templates)) {
        this.registerTemplate(templateName, template, plugin.name);
      }
    }
    
    // Register rules
    if (instance.rules) {
      for (const [ruleName, rule] of Object.entries(instance.rules)) {
        this.registerRule(ruleName, rule, plugin.name);
      }
    }
  }

  registerHook(hookName, handler, pluginName) {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }
    
    this.hooks.get(hookName).push({
      handler,
      plugin: pluginName,
      priority: handler.priority || 0
    });
    
    // Sort by priority
    this.hooks.get(hookName).sort((a, b) => b.priority - a.priority);
  }

  registerCommand(commandName, command, pluginName) {
    this.commands.set(commandName, {
      ...command,
      plugin: pluginName
    });
  }

  registerMiddleware(middlewareName, middleware, pluginName) {
    this.middleware.set(middlewareName, {
      ...middleware,
      plugin: pluginName
    });
  }

  registerTemplate(templateName, template, pluginName) {
    this.templates.set(templateName, {
      ...template,
      plugin: pluginName
    });
  }

  registerRule(ruleName, rule, pluginName) {
    this.rules.set(ruleName, {
      ...rule,
      plugin: pluginName
    });
  }

  async initializePlugins() {
    console.log('🚀 Initializing plugins...');
    
    for (const pluginName of this.loadOrder) {
      const plugin = this.plugins.get(pluginName);
      if (!plugin || !plugin.loaded) continue;
      
      try {
        if (plugin.instance.initialize) {
          await plugin.instance.initialize();
        }
        
        plugin.initialized = true;
        
        if (this.verbose) {
          console.log(`  ✅ Initialized: ${plugin.name}`);
        }
        
      } catch (error) {
        console.error(`  ❌ Failed to initialize ${plugin.name}: ${error.message}`);
      }
    }
  }

  async executeHook(hookName, ...args) {
    const hooks = this.hooks.get(hookName) || [];
    const results = [];
    
    for (const { handler, plugin } of hooks) {
      try {
        const result = await handler(...args);
        results.push({ plugin, result });
      } catch (error) {
        console.error(`❌ Hook ${hookName} failed in plugin ${plugin}: ${error.message}`);
      }
    }
    
    return results;
  }

  getCommand(commandName) {
    return this.commands.get(commandName);
  }

  getMiddleware(middlewareName) {
    return this.middleware.get(middlewareName);
  }

  getTemplate(templateName) {
    return this.templates.get(templateName);
  }

  getRule(ruleName) {
    return this.rules.get(ruleName);
  }

  async installPlugin(pluginName, options = {}) {
    console.log(`📦 Installing plugin: ${pluginName}`);
    
    try {
      // Check if plugin is already installed
      if (this.plugins.has(pluginName)) {
        console.log(`⚠️  Plugin ${pluginName} is already installed`);
        return;
      }
      
      // Install plugin (simulate npm install)
      const installPath = join(this.pluginsDir, pluginName);
      await fs.mkdir(installPath, { recursive: true });
      
      // Create plugin manifest
      const manifest = {
        name: pluginName,
        version: '1.0.0',
        description: `Plugin: ${pluginName}`,
        main: 'index.js',
        dependencies: []
      };
      
      await fs.writeFile(
        join(installPath, 'synapse-plugin.json'),
        JSON.stringify(manifest, null, 2)
      );
      
      // Create basic plugin file
      const pluginCode = this.generatePluginTemplate(pluginName);
      await fs.writeFile(join(installPath, 'index.js'), pluginCode);
      
      console.log(`✅ Plugin ${pluginName} installed successfully`);
      
      // Reload plugins
      await this.discoverPlugins();
      await this.resolveDependencies();
      await this.loadPlugins();
      await this.initializePlugins();
      
    } catch (error) {
      console.error(`❌ Failed to install plugin ${pluginName}: ${error.message}`);
      throw error;
    }
  }

  async uninstallPlugin(pluginName) {
    console.log(`🗑️  Uninstalling plugin: ${pluginName}`);
    
    try {
      const plugin = this.plugins.get(pluginName);
      if (!plugin) {
        console.log(`⚠️  Plugin ${pluginName} is not installed`);
        return;
      }
      
      // Remove plugin files
      if (plugin.source === 'local') {
        await fs.rm(plugin.path, { recursive: true, force: true });
      }
      
      // Remove from registry
      this.plugins.delete(pluginName);
      
      // Remove capabilities
      this.removePluginCapabilities(pluginName);
      
      console.log(`✅ Plugin ${pluginName} uninstalled successfully`);
      
    } catch (error) {
      console.error(`❌ Failed to uninstall plugin ${pluginName}: ${error.message}`);
      throw error;
    }
  }

  removePluginCapabilities(pluginName) {
    // Remove hooks
    for (const [hookName, hooks] of this.hooks) {
      const filtered = hooks.filter(h => h.plugin !== pluginName);
      if (filtered.length === 0) {
        this.hooks.delete(hookName);
      } else {
        this.hooks.set(hookName, filtered);
      }
    }
    
    // Remove commands
    for (const [commandName, command] of this.commands) {
      if (command.plugin === pluginName) {
        this.commands.delete(commandName);
      }
    }
    
    // Remove middleware
    for (const [middlewareName, middleware] of this.middleware) {
      if (middleware.plugin === pluginName) {
        this.middleware.delete(middlewareName);
      }
    }
    
    // Remove templates
    for (const [templateName, template] of this.templates) {
      if (template.plugin === pluginName) {
        this.templates.delete(templateName);
      }
    }
    
    // Remove rules
    for (const [ruleName, rule] of this.rules) {
      if (rule.plugin === pluginName) {
        this.rules.delete(ruleName);
      }
    }
  }

  generatePluginTemplate(pluginName) {
    return `/**
 * Synapse Plugin: ${pluginName}
 * Generated plugin template
 */

export default class ${pluginName}Plugin {
  constructor(options) {
    this.name = '${pluginName}';
    this.version = '1.0.0';
    this.options = options;
  }

  async initialize() {
    console.log(\`🔌 Plugin \${this.name} initialized\`);
  }

  // Define hooks
  get hooks() {
    return {
      'before-build': this.beforeBuild.bind(this),
      'after-build': this.afterBuild.bind(this),
      'before-test': this.beforeTest.bind(this),
      'after-test': this.afterTest.bind(this)
    };
  }

  // Define commands
  get commands() {
    return {
      '${pluginName}': {
        description: '${pluginName} command',
        handler: this.handleCommand.bind(this)
      }
    };
  }

  // Define middleware
  get middleware() {
    return {
      '${pluginName}-middleware': {
        handler: this.handleMiddleware.bind(this)
      }
    };
  }

  // Hook implementations
  async beforeBuild(context) {
    console.log(\`🔧 \${this.name}: Before build hook\`);
  }

  async afterBuild(context) {
    console.log(\`🔧 \${this.name}: After build hook\`);
  }

  async beforeTest(context) {
    console.log(\`🧪 \${this.name}: Before test hook\`);
  }

  async afterTest(context) {
    console.log(\`🧪 \${this.name}: After test hook\`);
  }

  // Command handler
  async handleCommand(args) {
    console.log(\`🚀 \${this.name} command executed with args:\`, args);
  }

  // Middleware handler
  async handleMiddleware(req, res, next) {
    console.log(\`🔗 \${this.name} middleware executed\`);
    next();
  }
}
`;
  }

  listPlugins() {
    const plugins = Array.from(this.plugins.values()).map(plugin => ({
      name: plugin.name,
      version: plugin.version,
      description: plugin.description,
      author: plugin.author,
      source: plugin.source,
      loaded: plugin.loaded,
      initialized: plugin.initialized
    }));
    
    return plugins;
  }

  getStats() {
    return {
      plugins: this.plugins.size,
      hooks: this.hooks.size,
      commands: this.commands.size,
      middleware: this.middleware.size,
      templates: this.templates.size,
      rules: this.rules.size,
      initialized: this.initialized
    };
  }
}