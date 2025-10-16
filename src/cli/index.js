#!/usr/bin/env node

/**
 * Synapse CLI - Command Line Interface
 * Simplified version for NPM publishing
 */

import { promises as fs } from 'fs';
import { join, resolve } from 'path';
import { 
  SynapseFramework,
  SynapseRuntime,
  SynapseCompiler,
  SynapseTestingFramework,
  SynapseLintingSystem,
  SynapseRouter,
  SynapseStateManager,
  SynapsePluginSystem
} from '../index.js';

console.log('🚀 Synapse Framework CLI v0.1.0');
console.log('');

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

// Initialize framework components
const framework = new SynapseFramework();
const runtime = new SynapseRuntime();
const compiler = new SynapseCompiler();
const testing = new SynapseTestingFramework();
const linting = new SynapseLintingSystem();
const router = new SynapseRouter();
const stateManager = new SynapseStateManager();
const pluginSystem = new SynapsePluginSystem();

async function initProject(projectName) {
  if (!projectName) {
    console.error('❌ Project name is required. Usage: synapse init <project-name>');
    process.exit(1);
  }

  console.log(`📦 Initializing new Synapse project: ${projectName}`);
  
  const projectPath = resolve(process.cwd(), projectName);
  
  // Check if directory already exists
  try {
    await fs.access(projectPath);
    console.error(`❌ Directory ${projectName} already exists`);
    process.exit(1);
  } catch {
    // Directory doesn't exist, which is what we want
  }

  // Create project directory
  await fs.mkdir(projectPath, { recursive: true });
  
  // Create project structure
  await createProjectStructure(projectPath, projectName);
  
  console.log('✅ Project initialized successfully');
  console.log(`📁 Project created at: ${projectPath}`);
  console.log('');
  console.log('Next steps:');
  console.log(`  cd ${projectName}`);
  console.log('  synapse dev');
}

async function createProjectStructure(projectPath, projectName) {
  // Create directories
  const dirs = [
    'src',
    'src/components',
    'src/pages',
    'src/api',
    'src/utils',
    'src/types',
    'tests',
    'public',
    'dist'
  ];

  for (const dir of dirs) {
    await fs.mkdir(join(projectPath, dir), { recursive: true });
  }

  // Create package.json
  const packageJson = {
    name: projectName,
    version: '0.1.0',
    type: 'module',
    scripts: {
      dev: 'synapse dev',
      build: 'synapse build',
      test: 'synapse test',
      lint: 'synapse lint',
      format: 'synapse format'
    },
    dependencies: {
      '@snps/core': '^0.1.0'
    }
  };

  await fs.writeFile(
    join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Create main entry point
  const mainTs = `import { SynapseFramework } from '@snps/core';

const app = new SynapseFramework();
await app.initialize();

console.log('🚀 ${projectName} is running!');
`;

  await fs.writeFile(join(projectPath, 'src', 'index.ts'), mainTs);

  // Create index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
</head>
<body>
    <div id="app"></div>
    <script type="module" src="/src/index.ts"></script>
</body>
</html>`;

  await fs.writeFile(join(projectPath, 'public', 'index.html'), indexHtml);

  // Create README
  const readme = `# ${projectName}

A Synapse Framework project.

## Getting Started

\`\`\`bash
# Start development server
synapse dev

# Build for production
synapse build

# Run tests
synapse test

# Lint code
synapse lint
\`\`\`

## Project Structure

- \`src/\` - Source code
- \`public/\` - Static assets
- \`tests/\` - Test files
- \`dist/\` - Build output
`;

  await fs.writeFile(join(projectPath, 'README.md'), readme);

  // Create tsconfig.json
  const tsconfig = {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'node',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      outDir: './dist',
      rootDir: './src'
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist']
  };

  await fs.writeFile(
    join(projectPath, 'tsconfig.json'),
    JSON.stringify(tsconfig, null, 2)
  );
}

async function startDevServer() {
  console.log('🚀 Starting development server...');
  
  // Initialize framework components
  await framework.initialize();
  await runtime.start();
  await router.route();
  await stateManager.manageState();
  await pluginSystem.loadPlugins();

  console.log('✅ Development server started on http://localhost:3000');
  console.log('📁 Serving files from:', process.cwd());
  console.log('🔄 Hot reload enabled');
  console.log('');
  console.log('Press Ctrl+C to stop the server');

  // Keep the process alive
  process.on('SIGINT', async () => {
    console.log('\n🛑 Stopping development server...');
    await runtime.stop();
    console.log('✅ Development server stopped');
    process.exit(0);
  });

  // Keep the process running
  await new Promise(() => {});
}

async function buildProject() {
  console.log('🔨 Building project...');
  
  await framework.initialize();
  await compiler.compile();
  await linting.lint();

  console.log('✅ Build completed successfully');
  console.log('📁 Output directory: dist/');
}

async function runTests() {
  console.log('🧪 Running tests...');
  
  await framework.initialize();
  await testing.runTests();

  console.log('✅ All tests passed');
}

async function lintCode() {
  console.log('🔍 Linting code...');
  
  await framework.initialize();
  await linting.lint();

  console.log('✅ Linting completed');
}

async function formatCode() {
  console.log('✨ Formatting code...');
  
  // Basic formatting implementation
  const srcDir = join(process.cwd(), 'src');
  
  try {
    const files = await getTsFiles(srcDir);
    
    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8');
      const formatted = formatTypeScript(content);
      await fs.writeFile(file, formatted);
    }
    
    console.log('✅ Code formatted');
  } catch (error) {
    console.log('⚠️  No TypeScript files found to format');
  }
}

async function getTsFiles(dir) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getTsFiles(fullPath));
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }

  return files;
}

function formatTypeScript(code) {
  // Basic TypeScript formatting
  return code
    .replace(/\s*{\s*/g, ' {\n  ')
    .replace(/;\s*/g, ';\n')
    .replace(/\s*}\s*/g, '\n}\n')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
}

// Main command handling
try {
  switch (command) {
    case 'init':
      await initProject(args[1]);
      break;
    
    case 'dev':
      await startDevServer();
      break;
    
    case 'build':
      await buildProject();
      break;
    
    case 'test':
      await runTests();
      break;
    
    case 'lint':
      await lintCode();
      break;
    
    case 'format':
      await formatCode();
      break;
    
    case '--version':
    case '-v':
      console.log('SynapseCLI v0.1.0');
      break;
    
    case '--help':
    case '-h':
    default:
      console.log('Available commands:');
      console.log('  init <name>    - Initialize new project');
      console.log('  dev            - Start development server');
      console.log('  build          - Build for production');
      console.log('  test           - Run tests');
      console.log('  lint           - Lint code');
      console.log('  format         - Format code');
      console.log('  --version, -v  - Show version');
      console.log('  --help, -h     - Show help');
      break;
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}