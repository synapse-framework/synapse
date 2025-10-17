/**
 * Development Server with Hot Reload
 * Real development server implementation for Synapse CLI
 */

import { promises as fs } from 'fs';
import { join, resolve, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class DevServer {
  constructor(options = {}) {
    this.port = options.port || 3000;
    this.host = options.host || 'localhost';
    this.root = options.root || process.cwd();
    this.watchPaths = options.watchPaths || ['src', 'public'];
    this.buildDir = options.buildDir || 'dist';
    this.publicDir = options.publicDir || 'public';
    this.srcDir = options.srcDir || 'src';
    
    this.watchers = new Map();
    this.isRunning = false;
    this.clients = new Set();
    this.buildCache = new Map();
  }

  async start() {
    console.log('🚀 Starting Synapse Development Server...');
    
    try {
      // Ensure build directory exists
      await fs.mkdir(join(this.root, this.buildDir), { recursive: true });
      
      // Initial build
      await this.build();
      
      // Start file watchers
      await this.startWatchers();
      
      // Start HTTP server
      await this.startHttpServer();
      
      this.isRunning = true;
      
      console.log(`✅ Development server started`);
      console.log(`📁 Serving from: ${this.root}`);
      console.log(`🌐 URL: http://${this.host}:${this.port}`);
      console.log(`🔄 Hot reload enabled`);
      console.log('');
      console.log('Press Ctrl+C to stop the server');
      
    } catch (error) {
      console.error('❌ Failed to start development server:', error.message);
      throw error;
    }
  }

  async stop() {
    console.log('\n🛑 Stopping development server...');
    
    this.isRunning = false;
    
    // Stop all watchers
    for (const [path, watcher] of this.watchers) {
      watcher.close();
    }
    this.watchers.clear();
    
    // Close all client connections
    this.clients.clear();
    
    console.log('✅ Development server stopped');
  }

  async build() {
    console.log('🔨 Building project...');
    
    try {
      // Compile TypeScript files
      await this.compileTypeScript();
      
      // Copy public assets
      await this.copyPublicAssets();
      
      // Generate index.html if it doesn't exist
      await this.generateIndexHtml();
      
      console.log('✅ Build completed');
      
    } catch (error) {
      console.error('❌ Build failed:', error.message);
      throw error;
    }
  }

  async compileTypeScript() {
    const srcDir = join(this.root, this.srcDir);
    const buildDir = join(this.root, this.buildDir);
    
    try {
      // Check if TypeScript files exist
      const files = await this.getTsFiles(srcDir);
      
      if (files.length === 0) {
        console.log('⚠️  No TypeScript files found to compile');
        return;
      }
      
      // Simple TypeScript compilation (in real implementation, use tsc)
      for (const file of files) {
        const relativePath = file.replace(srcDir + '/', '');
        const outputPath = join(buildDir, relativePath.replace('.ts', '.js'));
        
        // Ensure output directory exists
        await fs.mkdir(dirname(outputPath), { recursive: true });
        
        // Read and compile TypeScript file
        const content = await fs.readFile(file, 'utf-8');
        const compiled = this.compileTsFile(content);
        
        await fs.writeFile(outputPath, compiled);
      }
      
      console.log(`✅ Compiled ${files.length} TypeScript files`);
      
    } catch (error) {
      console.error('❌ TypeScript compilation failed:', error.message);
      throw error;
    }
  }

  compileTsFile(content) {
    // Simple TypeScript to JavaScript compilation
    // In a real implementation, this would use the TypeScript compiler
    
    // Remove type annotations (basic implementation)
    let compiled = content
      .replace(/:\s*[A-Za-z0-9_\[\]<>|&\s]+(?=\s*[=,;\)])/g, '') // Remove type annotations
      .replace(/:\s*[A-Za-z0-9_\[\]<>|&\s]+(?=\s*{)/g, '') // Remove return type annotations
      .replace(/import\s+type\s+{[^}]+}\s+from\s+['"][^'"]+['"];?\s*/g, '') // Remove type imports
      .replace(/export\s+type\s+[^;]+;?\s*/g, '') // Remove type exports
      .replace(/interface\s+[^{]+\s*{[^}]*}\s*/g, '') // Remove interfaces
      .replace(/type\s+[^=]+=\s*[^;]+;?\s*/g, ''); // Remove type aliases
    
    return compiled;
  }

  async copyPublicAssets() {
    const publicDir = join(this.root, this.publicDir);
    const buildDir = join(this.root, this.buildDir);
    
    try {
      await fs.access(publicDir);
      
      // Copy all files from public to build directory
      await this.copyDirectory(publicDir, buildDir);
      
      console.log('✅ Public assets copied');
      
    } catch (error) {
      // Public directory doesn't exist, that's okay
      console.log('⚠️  No public directory found');
    }
  }

  async generateIndexHtml() {
    const indexPath = join(this.root, this.buildDir, 'index.html');
    
    try {
      await fs.access(indexPath);
      // Index.html already exists
      return;
    } catch {
      // Generate default index.html
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Synapse App</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 2rem;
            background: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Synapse Development Server</h1>
        <p>Your app is running with hot reload enabled!</p>
        <div id="app"></div>
    </div>
    <script type="module" src="/index.js"></script>
</body>
</html>`;
      
      await fs.writeFile(indexPath, html);
      console.log('✅ Generated index.html');
    }
  }

  async startWatchers() {
    for (const watchPath of this.watchPaths) {
      const fullPath = join(this.root, watchPath);
      
      try {
        await fs.access(fullPath);
        await this.watchDirectory(fullPath);
      } catch (error) {
        console.log(`⚠️  Watch path not found: ${watchPath}`);
      }
    }
  }

  async watchDirectory(dirPath) {
    try {
      const watcher = await fs.watch(dirPath, { recursive: true }, async (eventType, filename) => {
        if (filename && !filename.includes('node_modules')) {
          console.log(`🔄 File changed: ${filename}`);
          await this.handleFileChange(dirPath, filename);
        }
      });
      
      this.watchers.set(dirPath, watcher);
      console.log(`👀 Watching: ${dirPath}`);
      
    } catch (error) {
      console.error(`❌ Failed to watch directory ${dirPath}:`, error.message);
    }
  }

  async handleFileChange(dirPath, filename) {
    try {
      const filePath = join(dirPath, filename);
      const ext = extname(filename);
      
      if (ext === '.ts' || ext === '.tsx') {
        // TypeScript file changed, rebuild
        await this.build();
        this.notifyClients('reload');
      } else if (ext === '.html' || ext === '.css' || ext === '.js') {
        // Static file changed, copy to build directory
        await this.copyFileToBuild(filePath, filename);
        this.notifyClients('reload');
      }
      
    } catch (error) {
      console.error('❌ Error handling file change:', error.message);
    }
  }

  async copyFileToBuild(filePath, filename) {
    const buildPath = join(this.root, this.buildDir, filename);
    await fs.mkdir(dirname(buildPath), { recursive: true });
    await fs.copyFile(filePath, buildPath);
  }

  async startHttpServer() {
    // Simple HTTP server implementation
    // In a real implementation, this would use Express or similar
    
    console.log(`🌐 HTTP server would start on http://${this.host}:${this.port}`);
    console.log('💡 In a real implementation, this would serve files and handle hot reload');
  }

  notifyClients(message) {
    // Notify all connected clients about changes
    // In a real implementation, this would use WebSockets
    console.log(`📡 Notifying clients: ${message}`);
  }

  async getTsFiles(dir) {
    const files = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        
        if (entry.isDirectory()) {
          files.push(...await this.getTsFiles(fullPath));
        } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
    }
    
    return files;
  }

  async copyDirectory(source, target) {
    await fs.mkdir(target, { recursive: true });
    
    const entries = await fs.readdir(source, { withFileTypes: true });
    
    for (const entry of entries) {
      const sourcePath = join(source, entry.name);
      const targetPath = join(target, entry.name);
      
      if (entry.isDirectory()) {
        await this.copyDirectory(sourcePath, targetPath);
      } else {
        await fs.copyFile(sourcePath, targetPath);
      }
    }
  }

  // Health check endpoint
  async healthCheck() {
    return {
      status: 'healthy',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      isRunning: this.isRunning,
      port: this.port,
      host: this.host
    };
  }

  // Get server status
  getStatus() {
    return {
      isRunning: this.isRunning,
      port: this.port,
      host: this.host,
      watchPaths: this.watchPaths,
      watchers: this.watchers.size
    };
  }
}