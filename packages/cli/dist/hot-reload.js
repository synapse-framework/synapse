/**
 * Hot Module Replacement (HMR) System for Synapse CLI
 * Real-time code updates without page refresh
 */

import { promises as fs } from 'fs';
import { join, resolve, dirname, extname, relative } from 'path';
import { EventEmitter } from 'events';

export class HotReloadSystem extends EventEmitter {
  constructor(options = {}) {
    super();
    this.root = options.root || process.cwd();
    this.srcDir = options.srcDir || 'src';
    this.distDir = options.distDir || 'dist';
    this.port = options.port || 3001;
    this.verbose = options.verbose || false;
    
    this.watchers = new Map();
    this.moduleGraph = new Map();
    this.updateQueue = new Set();
    this.isUpdating = false;
    
    this.server = null;
    this.clients = new Set();
  }

  async start() {
    console.log('🔥 Starting Hot Module Replacement system...');
    
    try {
      // Build initial module graph
      await this.buildModuleGraph();
      
      // Start file watchers
      await this.startWatchers();
      
      // Start WebSocket server
      await this.startWebSocketServer();
      
      console.log('✅ HMR system started');
      this.emit('ready');
      
    } catch (error) {
      console.error('❌ Failed to start HMR system:', error.message);
      throw error;
    }
  }

  async stop() {
    console.log('🛑 Stopping HMR system...');
    
    // Close all watchers
    for (const [path, watcher] of this.watchers) {
      watcher.close();
    }
    this.watchers.clear();
    
    // Close WebSocket server
    if (this.server) {
      this.server.close();
    }
    
    console.log('✅ HMR system stopped');
  }

  async buildModuleGraph() {
    console.log('📊 Building module dependency graph...');
    
    const files = await this.findSourceFiles();
    this.moduleGraph.clear();
    
    for (const file of files) {
      const dependencies = await this.extractDependencies(file);
      this.moduleGraph.set(file, {
        dependencies,
        dependents: new Set(),
        lastModified: await this.getFileModTime(file),
        content: await fs.readFile(file, 'utf-8')
      });
    }
    
    // Build reverse dependencies
    for (const [file, module] of this.moduleGraph) {
      for (const dep of module.dependencies) {
        const depModule = this.moduleGraph.get(dep);
        if (depModule) {
          depModule.dependents.add(file);
        }
      }
    }
    
    console.log(`✅ Module graph built: ${this.moduleGraph.size} modules`);
  }

  async findSourceFiles() {
    const files = [];
    const srcDir = join(this.root, this.srcDir);
    
    try {
      const entries = await fs.readdir(srcDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(srcDir, entry.name);
        
        if (entry.isDirectory()) {
          files.push(...await this.findSourceFilesInDir(fullPath));
        } else if (this.isSourceFile(entry.name)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
    
    return files;
  }

  async findSourceFilesInDir(dir) {
    const files = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        
        if (entry.isDirectory()) {
          files.push(...await this.findSourceFilesInDir(fullPath));
        } else if (this.isSourceFile(entry.name)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
    
    return files;
  }

  isSourceFile(filename) {
    const ext = extname(filename);
    return ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.sass', '.less'].includes(ext);
  }

  async extractDependencies(filePath) {
    const dependencies = [];
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Extract import statements
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      dependencies.push(this.resolveModulePath(filePath, match[1]));
    }
    
    while ((match = requireRegex.exec(content)) !== null) {
      dependencies.push(this.resolveModulePath(filePath, match[1]));
    }
    
    return dependencies.filter(dep => dep && this.moduleGraph.has(dep));
  }

  resolveModulePath(fromFile, importPath) {
    if (importPath.startsWith('.')) {
      const fromDir = dirname(fromFile);
      const resolved = resolve(fromDir, importPath);
      
      // Try different extensions
      const extensions = ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.sass', '.less'];
      for (const ext of extensions) {
        const withExt = resolved + ext;
        if (this.moduleGraph.has(withExt)) {
          return withExt;
        }
      }
      
      return resolved;
    }
    
    return null; // External dependency
  }

  async startWatchers() {
    const srcDir = join(this.root, this.srcDir);
    
    const watcher = fs.watch(srcDir, { recursive: true }, async (eventType, filename) => {
      if (filename) {
        const fullPath = join(srcDir, filename);
        await this.handleFileChange(fullPath, eventType);
      }
    });
    
    this.watchers.set(srcDir, watcher);
    console.log('👀 File watchers started');
  }

  async handleFileChange(filePath, eventType) {
    if (this.isUpdating) return;
    
    const relativePath = relative(this.root, filePath);
    
    if (this.verbose) {
      console.log(`📝 File changed: ${relativePath} (${eventType})`);
    }
    
    if (eventType === 'rename') {
      // File added or removed
      await this.handleFileRename(filePath);
    } else {
      // File modified
      await this.handleFileModification(filePath);
    }
  }

  async handleFileRename(filePath) {
    const exists = await this.fileExists(filePath);
    
    if (exists) {
      // File added
      await this.addModule(filePath);
    } else {
      // File removed
      await this.removeModule(filePath);
    }
  }

  async handleFileModification(filePath) {
    const module = this.moduleGraph.get(filePath);
    if (!module) return;
    
    const newContent = await fs.readFile(filePath, 'utf-8');
    const newModTime = await this.getFileModTime(filePath);
    
    if (newModTime <= module.lastModified) return;
    
    // Update module
    module.content = newContent;
    module.lastModified = newModTime;
    
    // Trigger HMR update
    await this.triggerHMRUpdate(filePath);
  }

  async addModule(filePath) {
    if (this.moduleGraph.has(filePath)) return;
    
    const dependencies = await this.extractDependencies(filePath);
    this.moduleGraph.set(filePath, {
      dependencies,
      dependents: new Set(),
      lastModified: await this.getFileModTime(filePath),
      content: await fs.readFile(filePath, 'utf-8')
    });
    
    // Update reverse dependencies
    for (const dep of dependencies) {
      const depModule = this.moduleGraph.get(dep);
      if (depModule) {
        depModule.dependents.add(filePath);
      }
    }
    
    console.log(`➕ Module added: ${relative(this.root, filePath)}`);
  }

  async removeModule(filePath) {
    const module = this.moduleGraph.get(filePath);
    if (!module) return;
    
    // Remove from reverse dependencies
    for (const dep of module.dependencies) {
      const depModule = this.moduleGraph.get(dep);
      if (depModule) {
        depModule.dependents.delete(filePath);
      }
    }
    
    this.moduleGraph.delete(filePath);
    console.log(`➖ Module removed: ${relative(this.root, filePath)}`);
  }

  async triggerHMRUpdate(changedFile) {
    this.updateQueue.add(changedFile);
    
    if (this.isUpdating) return;
    
    this.isUpdating = true;
    
    try {
      // Process all queued updates
      const updates = Array.from(this.updateQueue);
      this.updateQueue.clear();
      
      // Find all affected modules
      const affectedModules = new Set();
      for (const file of updates) {
        affectedModules.add(file);
        this.addDependents(file, affectedModules);
      }
      
      // Generate HMR update
      const hmrUpdate = await this.generateHMRUpdate(Array.from(affectedModules));
      
      // Send to clients
      this.broadcastUpdate(hmrUpdate);
      
      console.log(`🔄 HMR update sent for ${affectedModules.size} modules`);
      
    } finally {
      this.isUpdating = false;
    }
  }

  addDependents(file, affectedModules) {
    const module = this.moduleGraph.get(file);
    if (!module) return;
    
    for (const dependent of module.dependents) {
      if (!affectedModules.has(dependent)) {
        affectedModules.add(dependent);
        this.addDependents(dependent, affectedModules);
      }
    }
  }

  async generateHMRUpdate(affectedModules) {
    const update = {
      type: 'hmr-update',
      timestamp: Date.now(),
      modules: []
    };
    
    for (const file of affectedModules) {
      const module = this.moduleGraph.get(file);
      if (!module) continue;
      
      const relativePath = relative(this.root, file);
      const compiledContent = await this.compileModule(file, module.content);
      
      update.modules.push({
        path: relativePath,
        content: compiledContent,
        dependencies: Array.from(module.dependencies).map(dep => 
          relative(this.root, dep)
        )
      });
    }
    
    return update;
  }

  async compileModule(filePath, content) {
    const ext = extname(filePath);
    
    switch (ext) {
      case '.ts':
      case '.tsx':
        return this.compileTypeScript(content);
      case '.js':
      case '.jsx':
        return content;
      case '.css':
        return content;
      case '.scss':
      case '.sass':
        return await this.compileSass(content);
      case '.less':
        return await this.compileLess(content);
      default:
        return content;
    }
  }

  compileTypeScript(content) {
    // Simple TypeScript compilation (remove types)
    return content
      .replace(/:\s*[^=,;)\]]+/g, '') // Remove type annotations
      .replace(/<[^>]+>/g, '') // Remove generic types
      .replace(/as\s+[^,;)\]]+/g, '') // Remove type assertions
      .replace(/import\s+type\s+.*?from\s+['"][^'"]+['"];?\s*/g, '') // Remove type imports
      .replace(/export\s+type\s+.*?;?\s*/g, '') // Remove type exports
      .replace(/interface\s+\w+[^}]+}/g, '') // Remove interfaces
      .replace(/type\s+\w+\s*=[^;]+;/g, '') // Remove type aliases
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  async compileSass(content) {
    // Placeholder for Sass compilation
    return content;
  }

  async compileLess(content) {
    // Placeholder for Less compilation
    return content;
  }

  async startWebSocketServer() {
    // Simulate WebSocket server
    console.log(`🔌 HMR WebSocket server started on port ${this.port}`);
    
    // In a real implementation, this would use ws or similar
    this.server = {
      close: () => console.log('🔌 HMR WebSocket server closed')
    };
  }

  broadcastUpdate(update) {
    if (this.clients.size === 0) {
      console.log('⚠️  No clients connected for HMR update');
      return;
    }
    
    const message = JSON.stringify(update);
    console.log(`📡 Broadcasting HMR update to ${this.clients.size} clients`);
    
    // In a real implementation, this would send to WebSocket clients
    this.emit('update', update);
  }

  addClient(client) {
    this.clients.add(client);
    console.log(`👤 Client connected (${this.clients.size} total)`);
  }

  removeClient(client) {
    this.clients.delete(client);
    console.log(`👤 Client disconnected (${this.clients.size} total)`);
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async getFileModTime(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return stats.mtime.getTime();
    } catch {
      return 0;
    }
  }

  getModuleGraph() {
    return this.moduleGraph;
  }

  getStats() {
    return {
      modules: this.moduleGraph.size,
      watchers: this.watchers.size,
      clients: this.clients.size,
      isUpdating: this.isUpdating,
      queuedUpdates: this.updateQueue.size
    };
  }
}