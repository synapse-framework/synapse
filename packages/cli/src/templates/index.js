/**
 * Template System for Synapse CLI
 * Handles custom project templates with variable substitution
 */

import { promises as fs } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class TemplateManager {
  constructor() {
    this.templatesDir = join(__dirname, '..', '..', 'templates');
    this.userTemplatesDir = join(process.env.HOME || process.env.USERPROFILE || '', '.synapse', 'templates');
  }

  async initialize() {
    // Ensure templates directories exist
    await fs.mkdir(this.templatesDir, { recursive: true });
    await fs.mkdir(this.userTemplatesDir, { recursive: true });
    
    // Create built-in templates if they don't exist
    await this.createBuiltinTemplates();
  }

  async createBuiltinTemplates() {
    const builtinTemplates = [
      'default',
      'api',
      'fullstack',
      'ui-library',
      'enterprise',
      'startup'
    ];

    for (const template of builtinTemplates) {
      const templatePath = join(this.templatesDir, template);
      if (!await this.templateExists(template)) {
        await this.createTemplate(template, this.getBuiltinTemplateConfig(template));
      }
    }
  }

  getBuiltinTemplateConfig(templateName) {
    const configs = {
      default: {
        name: 'Default',
        description: 'Standard Synapse project template',
        version: '1.0.0',
        author: 'Synapse Framework',
        variables: ['projectName', 'description', 'author'],
        files: {
          'package.json': {
            content: `{
  "name": "{{projectName}}",
  "version": "0.1.0",
  "description": "{{description}}",
  "type": "module",
  "scripts": {
    "dev": "synapse dev",
    "build": "synapse build",
    "test": "synapse test",
    "lint": "synapse lint",
    "format": "synapse format"
  },
  "dependencies": {
    "@snps/core": "^0.1.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}`,
            type: 'json'
          },
          'src/index.ts': {
            content: `import { SynapseFramework } from '@snps/core';

const app = new SynapseFramework();
await app.initialize();

console.log('🚀 {{projectName}} is running!');
`,
            type: 'typescript'
          },
          'public/index.html': {
            content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{projectName}}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .container { max-width: 800px; margin: 0 auto; padding: 2rem; }
    </style>
</head>
<body>
    <div class="container">
        <h1>{{projectName}}</h1>
        <p>{{description}}</p>
        <div id="app"></div>
    </div>
    <script type="module" src="/src/index.ts"></script>
</body>
</html>`,
            type: 'html'
          }
        }
      },
      api: {
        name: 'API Server',
        description: 'Backend API server template with Express-like structure',
        version: '1.0.0',
        author: 'Synapse Framework',
        variables: ['projectName', 'description', 'author', 'port'],
        files: {
          'package.json': {
            content: `{
  "name": "{{projectName}}",
  "version": "0.1.0",
  "description": "{{description}}",
  "type": "module",
  "scripts": {
    "dev": "synapse dev",
    "build": "synapse build",
    "test": "synapse test",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@snps/core": "^0.1.0"
  }
}`,
            type: 'json'
          },
          'src/index.ts': {
            content: `import { SynapseFramework } from '@snps/core';

class {{projectName}}API {
  private port = {{port || 3000}};
  
  constructor() {
    console.log('🚀 {{projectName}} API Server starting...');
  }
  
  async start() {
    console.log(\`✅ API Server running on port \${this.port}\`);
  }
}

const api = new {{projectName}}API();
await api.start();
`,
            type: 'typescript'
          },
          'src/routes/index.ts': {
            content: `export class IndexRoutes {
  static async get() {
    return { message: 'Welcome to {{projectName}} API' };
  }
  
  static async health() {
    return { status: 'healthy', timestamp: new Date().toISOString() };
  }
}`,
            type: 'typescript'
          }
        }
      },
      fullstack: {
        name: 'Fullstack Application',
        description: 'Complete fullstack application with frontend and backend',
        version: '1.0.0',
        author: 'Synapse Framework',
        variables: ['projectName', 'description', 'author', 'database'],
        files: {
          'package.json': {
            content: `{
  "name": "{{projectName}}",
  "version": "0.1.0",
  "description": "{{description}}",
  "type": "module",
  "scripts": {
    "dev": "synapse dev",
    "build": "synapse build",
    "test": "synapse test",
    "db:migrate": "synapse db:migrate",
    "db:seed": "synapse db:seed"
  },
  "dependencies": {
    "@snps/core": "^0.1.0"
  }
}`,
            type: 'json'
          },
          'src/client/index.ts': {
            content: `import { SynapseFramework } from '@snps/core';

class {{projectName}}Client {
  constructor() {
    console.log('🌐 {{projectName}} Client initialized');
  }
  
  async render() {
    document.getElementById('app')!.innerHTML = \`
      <div class="app">
        <h1>{{projectName}}</h1>
        <p>{{description}}</p>
      </div>
    \`;
  }
}

const client = new {{projectName}}Client();
await client.render();
`,
            type: 'typescript'
          },
          'src/server/index.ts': {
            content: `import { SynapseFramework } from '@snps/core';

class {{projectName}}Server {
  constructor() {
    console.log('🖥️ {{projectName}} Server initialized');
  }
  
  async start() {
    console.log('✅ Fullstack application started');
  }
}

const server = new {{projectName}}Server();
await server.start();
`,
            type: 'typescript'
          }
        }
      },
      'ui-library': {
        name: 'UI Library',
        description: 'Component library template for building reusable UI components',
        version: '1.0.0',
        author: 'Synapse Framework',
        variables: ['projectName', 'description', 'author', 'organization'],
        files: {
          'package.json': {
            content: `{
  "name": "@{{organization || 'company'}}/{{projectName}}",
  "version": "0.1.0",
  "description": "{{description}}",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "dev": "synapse dev",
    "build": "synapse build",
    "test": "synapse test",
    "storybook": "synapse storybook"
  },
  "dependencies": {
    "@snps/core": "^0.1.0"
  }
}`,
            type: 'json'
          },
          'src/index.ts': {
            content: `// {{projectName}} UI Library
export * from './components';
export * from './themes';
export * from './utils';
`,
            type: 'typescript'
          },
          'src/components/Button.ts': {
            content: `import { SynapseComponent } from '@snps/core';

export class Button extends SynapseComponent {
  constructor(props: any = {}) {
    super();
    this.props = props;
  }
  
  render(): string {
    const { variant = 'primary', size = 'medium', children = 'Button' } = this.props;
    return \`<button class="btn btn-\${variant} btn-\${size}">\${children}</button>\`;
  }
}`,
            type: 'typescript'
          },
          'src/themes/index.ts': {
            content: `export const defaultTheme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '3rem'
  }
};`,
            type: 'typescript'
          }
        }
      },
      enterprise: {
        name: 'Enterprise Application',
        description: 'Enterprise-grade application with advanced features',
        version: '1.0.0',
        author: 'Synapse Framework',
        variables: ['projectName', 'description', 'author', 'company', 'license'],
        files: {
          'package.json': {
            content: `{
  "name": "{{projectName}}",
  "version": "0.1.0",
  "description": "{{description}}",
  "type": "module",
  "scripts": {
    "dev": "synapse dev",
    "build": "synapse build",
    "test": "synapse test",
    "test:coverage": "synapse test --coverage",
    "lint": "synapse lint",
    "security:audit": "synapse security:audit",
    "deploy:staging": "synapse deploy --env staging",
    "deploy:prod": "synapse deploy --env production"
  },
  "dependencies": {
    "@snps/core": "^0.1.0"
  },
  "license": "{{license || 'UNLICENSED'}}"
}`,
            type: 'json'
          },
          'src/index.ts': {
            content: `import { SynapseFramework } from '@snps/core';

class {{projectName}} {
  private readonly company = '{{company}}';
  
  constructor() {
    console.log(\`🏢 \${this.company} - {{projectName}} Enterprise Application\`);
  }
  
  async initialize() {
    console.log('✅ Enterprise application initialized');
  }
}

const app = new {{projectName}}();
await app.initialize();
`,
            type: 'typescript'
          },
          'docs/README.md': {
            content: `# {{projectName}}

{{description}}

## Company
{{company}}

## License
{{license || 'UNLICENSED'}}

## Enterprise Features
- Security auditing
- Performance monitoring
- Automated testing
- CI/CD pipeline
`,
            type: 'markdown'
          }
        }
      },
      startup: {
        name: 'Startup MVP',
        description: 'Rapid development template for startup MVPs',
        version: '1.0.0',
        author: 'Synapse Framework',
        variables: ['projectName', 'description', 'author', 'startupName'],
        files: {
          'package.json': {
            content: `{
  "name": "{{projectName}}",
  "version": "0.1.0",
  "description": "{{description}}",
  "type": "module",
  "scripts": {
    "dev": "synapse dev",
    "build": "synapse build",
    "deploy": "synapse deploy",
    "test": "synapse test"
  },
  "dependencies": {
    "@snps/core": "^0.1.0"
  }
}`,
            type: 'json'
          },
          'src/index.ts': {
            content: `import { SynapseFramework } from '@snps/core';

class {{startupName}}MVP {
  constructor() {
    console.log('🚀 {{startupName}} MVP - {{projectName}}');
    console.log('💡 Built for rapid iteration and fast deployment');
  }
  
  async launch() {
    console.log('✅ MVP launched successfully!');
    console.log('🎯 Ready for user feedback and iteration');
  }
}

const mvp = new {{startupName}}MVP();
await mvp.launch();
`,
            type: 'typescript'
          },
          'README.md': {
            content: `# {{projectName}}

{{description}}

## Startup: {{startupName}}

### Quick Start
\`\`\`bash
npm run dev
\`\`\`

### MVP Features
- Fast development
- Quick deployment
- User feedback ready
- Iteration friendly
`,
            type: 'markdown'
          }
        }
      }
    };

    return configs[templateName] || configs.default;
  }

  async templateExists(templateName) {
    const builtinPath = join(this.templatesDir, templateName);
    const userPath = join(this.userTemplatesDir, templateName);
    
    try {
      await fs.access(builtinPath);
      return true;
    } catch {
      try {
        await fs.access(userPath);
        return true;
      } catch {
        return false;
      }
    }
  }

  async createTemplate(templateName, config) {
    const templatePath = join(this.templatesDir, templateName);
    await fs.mkdir(templatePath, { recursive: true });
    
    // Create template.json
    await fs.writeFile(
      join(templatePath, 'template.json'),
      JSON.stringify(config, null, 2)
    );
    
    // Create files
    for (const [filePath, fileConfig] of Object.entries(config.files)) {
      const fullPath = join(templatePath, filePath);
      await fs.mkdir(dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, fileConfig.content);
    }
  }

  async listTemplates() {
    const templates = [];
    
    // Built-in templates
    try {
      const builtinTemplates = await fs.readdir(this.templatesDir);
      for (const template of builtinTemplates) {
        const config = await this.loadTemplateConfig(template, 'builtin');
        templates.push({ ...config, type: 'builtin', name: template });
      }
    } catch (error) {
      // Templates directory doesn't exist yet
    }
    
    // User templates
    try {
      const userTemplates = await fs.readdir(this.userTemplatesDir);
      for (const template of userTemplates) {
        const config = await this.loadTemplateConfig(template, 'user');
        templates.push({ ...config, type: 'user', name: template });
      }
    } catch (error) {
      // User templates directory doesn't exist yet
    }
    
    return templates;
  }

  async loadTemplateConfig(templateName, type = 'builtin') {
    const templatePath = type === 'builtin' 
      ? join(this.templatesDir, templateName)
      : join(this.userTemplatesDir, templateName);
    
    try {
      const configPath = join(templatePath, 'template.json');
      const configContent = await fs.readFile(configPath, 'utf-8');
      return JSON.parse(configContent);
    } catch (error) {
      throw new Error(`Template '${templateName}' not found or invalid`);
    }
  }

  async generateProject(templateName, projectName, variables = {}) {
    const config = await this.loadTemplateConfig(templateName);
    
    // Merge default variables with provided ones
    const allVariables = {
      projectName,
      description: `A ${config.name} project`,
      author: process.env.USER || 'Developer',
      ...variables
    };
    
    const projectPath = resolve(process.cwd(), projectName);
    
    // Check if directory already exists
    try {
      await fs.access(projectPath);
      throw new Error(`Directory ${projectName} already exists`);
    } catch {
      // Directory doesn't exist, which is what we want
    }
    
    // Create project directory
    await fs.mkdir(projectPath, { recursive: true });
    
    // Generate files
    for (const [filePath, fileConfig] of Object.entries(config.files)) {
      const fullPath = join(projectPath, filePath);
      await fs.mkdir(dirname(fullPath), { recursive: true });
      
      const content = this.substituteVariables(fileConfig.content, allVariables);
      await fs.writeFile(fullPath, content);
    }
    
    return {
      projectPath,
      template: config,
      variables: allVariables
    };
  }

  substituteVariables(content, variables) {
    return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] || match;
    });
  }

  async createCustomTemplate(templateName, config) {
    const templatePath = join(this.userTemplatesDir, templateName);
    await fs.mkdir(templatePath, { recursive: true });
    
    // Create template.json
    await fs.writeFile(
      join(templatePath, 'template.json'),
      JSON.stringify(config, null, 2)
    );
    
    // Create files
    for (const [filePath, fileConfig] of Object.entries(config.files)) {
      const fullPath = join(templatePath, filePath);
      await fs.mkdir(dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, fileConfig.content);
    }
  }

  async removeTemplate(templateName) {
    const userPath = join(this.userTemplatesDir, templateName);
    try {
      await fs.rm(userPath, { recursive: true, force: true });
      return true;
    } catch (error) {
      return false;
    }
  }
}