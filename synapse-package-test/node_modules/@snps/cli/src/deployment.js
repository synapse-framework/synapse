/**
 * Deployment System for Synapse CLI
 * Multi-platform deployment with Docker, Vercel, AWS, and more
 * Enhanced with comprehensive cloud provider support and CI/CD integration
 */

import { promises as fs } from 'fs';
import { join, resolve, dirname, extname, basename } from 'path';
import { execSync, spawn } from 'child_process';
import { createHash } from 'crypto';

export class DeploymentSystem {
  constructor(options = {}) {
    this.root = options.root || process.cwd();
    this.distDir = options.distDir || 'dist';
    this.verbose = options.verbose || false;
    
    this.platforms = new Map();
    this.deployments = new Map();
    this.config = new Map();
    
    this.initializePlatforms();
  }

  initializePlatforms() {
    // Docker deployment
    this.platforms.set('docker', {
      name: 'Docker',
      description: 'Containerized deployment',
      configFile: 'Dockerfile',
      commands: ['docker', 'docker-compose'],
      handler: this.deployToDocker.bind(this)
    });

    // Vercel deployment
    this.platforms.set('vercel', {
      name: 'Vercel',
      description: 'Serverless deployment platform',
      configFile: 'vercel.json',
      commands: ['vercel'],
      handler: this.deployToVercel.bind(this)
    });

    // AWS deployment
    this.platforms.set('aws', {
      name: 'AWS',
      description: 'Amazon Web Services deployment',
      configFile: 'aws-config.json',
      commands: ['aws', 'sam'],
      handler: this.deployToAWS.bind(this)
    });

    // Netlify deployment
    this.platforms.set('netlify', {
      name: 'Netlify',
      description: 'Static site deployment',
      configFile: 'netlify.toml',
      commands: ['netlify'],
      handler: this.deployToNetlify.bind(this)
    });

    // GitHub Pages
    this.platforms.set('github-pages', {
      name: 'GitHub Pages',
      description: 'Static site hosting on GitHub',
      configFile: '.github/workflows/deploy.yml',
      commands: ['git'],
      handler: this.deployToGitHubPages.bind(this)
    });

    // Railway
    this.platforms.set('railway', {
      name: 'Railway',
      description: 'Modern deployment platform',
      configFile: 'railway.json',
      commands: ['railway'],
      handler: this.deployToRailway.bind(this)
    });

    // DigitalOcean
    this.platforms.set('digitalocean', {
      name: 'DigitalOcean',
      description: 'Cloud infrastructure deployment',
      configFile: 'do-app.yaml',
      commands: ['doctl'],
      handler: this.deployToDigitalOcean.bind(this)
    });
  }

  async deploy(platform, options = {}) {
    console.log(`🚀 Deploying to ${platform}...`);
    
    const platformConfig = this.platforms.get(platform);
    if (!platformConfig) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    try {
      // Check platform requirements
      await this.checkPlatformRequirements(platform);
      
      // Prepare deployment
      await this.prepareDeployment(platform, options);
      
      // Execute deployment
      const result = await platformConfig.handler(options);
      
      console.log(`✅ Successfully deployed to ${platform}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Deployment to ${platform} failed:`, error.message);
      throw error;
    }
  }

  async checkPlatformRequirements(platform) {
    const platformConfig = this.platforms.get(platform);
    
    for (const command of platformConfig.commands) {
      try {
        execSync(`${command} --version`, { stdio: 'pipe' });
      } catch (error) {
        throw new Error(`Required command not found: ${command}. Please install it first.`);
      }
    }
  }

  async prepareDeployment(platform, options) {
    console.log(`📋 Preparing deployment for ${platform}...`);
    
    // Ensure dist directory exists
    const distPath = join(this.root, this.distDir);
    try {
      await fs.access(distPath);
    } catch {
      throw new Error(`Build directory not found: ${this.distDir}. Run 'synapse build' first.`);
    }

    // Generate platform-specific configuration
    await this.generatePlatformConfig(platform, options);
    
    // Copy deployment files
    await this.copyDeploymentFiles(platform, options);
  }

  async generatePlatformConfig(platform, options) {
    const configPath = join(this.root, this.platforms.get(platform).configFile);
    
    switch (platform) {
      case 'docker':
        await this.generateDockerfile(options);
        break;
      case 'vercel':
        await this.generateVercelConfig(options);
        break;
      case 'aws':
        await this.generateAWSConfig(options);
        break;
      case 'netlify':
        await this.generateNetlifyConfig(options);
        break;
      case 'github-pages':
        await this.generateGitHubPagesConfig(options);
        break;
      case 'railway':
        await this.generateRailwayConfig(options);
        break;
      case 'digitalocean':
        await this.generateDigitalOceanConfig(options);
        break;
    }
  }

  async generateDockerfile(options) {
    const dockerfile = `# Multi-stage build for Synapse application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
`;

    await fs.writeFile(join(this.root, 'Dockerfile'), dockerfile);
    
    // Generate nginx configuration
    const nginxConfig = `events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    sendfile        on;
    keepalive_timeout  65;
    
    server {
        listen       80;
        server_name  localhost;
        
        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }
        
        # API proxy
        location /api/ {
            proxy_pass http://backend:3000/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
        
        # Static assets caching
        location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}`;

    await fs.writeFile(join(this.root, 'nginx.conf'), nginxConfig);
    console.log('✅ Docker configuration generated');
  }

  async generateVercelConfig(options) {
    const vercelConfig = {
      version: 2,
      builds: [
        {
          src: 'dist/**/*',
          use: '@vercel/static'
        }
      ],
      routes: [
        {
          src: '/(.*)',
          dest: '/index.html'
        }
      ],
      functions: {
        'api/**/*.js': {
          runtime: 'nodejs18.x'
        }
      },
      env: {
        NODE_ENV: 'production'
      }
    };

    await fs.writeFile(
      join(this.root, 'vercel.json'),
      JSON.stringify(vercelConfig, null, 2)
    );
    console.log('✅ Vercel configuration generated');
  }

  async generateAWSConfig(options) {
    const samTemplate = {
      AWSTemplateFormatVersion: '2010-09-09',
      Transform: 'AWS::Serverless-2016-10-31',
      Description: 'Synapse Application',
      Globals: {
        Function: {
          Timeout: 30,
          Runtime: 'nodejs18.x'
        }
      },
      Resources: {
        SynapseFunction: {
          Type: 'AWS::Serverless::Function',
          Properties: {
            CodeUri: 'dist/',
            Handler: 'index.handler',
            Events: {
              RootApi: {
                Type: 'Api',
                Properties: {
                  Path: '/',
                  Method: 'ANY'
                }
              }
            }
          }
        }
      },
      Outputs: {
        ApiUrl: {
          Description: 'API Gateway endpoint URL',
          Value: {
            'Fn::Sub': 'https://${SynapseFunction}.execute-api.${AWS::Region}.amazonaws.com/Prod/'
          }
        }
      }
    };

    await fs.writeFile(
      join(this.root, 'template.yaml'),
      JSON.stringify(samTemplate, null, 2)
    );
    console.log('✅ AWS SAM configuration generated');
  }

  async generateNetlifyConfig(options) {
    const netlifyConfig = `[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "/*.png"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
`;

    await fs.writeFile(join(this.root, 'netlify.toml'), netlifyConfig);
    console.log('✅ Netlify configuration generated');
  }

  async generateGitHubPagesConfig(options) {
    const workflowDir = join(this.root, '.github', 'workflows');
    await fs.mkdir(workflowDir, { recursive: true });

    const workflow = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
`;

    await fs.writeFile(join(workflowDir, 'deploy.yml'), workflow);
    console.log('✅ GitHub Pages workflow generated');
  }

  async generateRailwayConfig(options) {
    const railwayConfig = {
      build: {
        builder: 'NIXPACKS'
      },
      deploy: {
        startCommand: 'npm start',
        healthcheckPath: '/',
        healthcheckTimeout: 100,
        restartPolicyType: 'ON_FAILURE',
        restartPolicyMaxRetries: 10
      }
    };

    await fs.writeFile(
      join(this.root, 'railway.json'),
      JSON.stringify(railwayConfig, null, 2)
    );
    console.log('✅ Railway configuration generated');
  }

  async generateDigitalOceanConfig(options) {
    const doConfig = {
      name: 'synapse-app',
      services: [
        {
          name: 'web',
          source_dir: '/workspace',
          github: {
            repo: 'your-username/your-repo',
            branch: 'main'
          },
          run_command: 'npm start',
          environment_slug: 'node-js',
          instance_count: 1,
          instance_size_slug: 'basic-xxs',
          http_port: 8080,
          routes: [
            {
              path: '/'
            }
          ]
        }
      ],
      static_sites: [
        {
          name: 'static-assets',
          source_dir: '/workspace/dist',
          github: {
            repo: 'your-username/your-repo',
            branch: 'main'
          },
          routes: [
            {
              path: '/assets'
            }
          ]
        }
      ]
    };

    await fs.writeFile(
      join(this.root, 'do-app.yaml'),
      JSON.stringify(doConfig, null, 2)
    );
    console.log('✅ DigitalOcean configuration generated');
  }

  async copyDeploymentFiles(platform, options) {
    // Copy common deployment files
    const commonFiles = [
      'package.json',
      'package-lock.json',
      '.env.example'
    ];

    for (const file of commonFiles) {
      const srcPath = join(this.root, file);
      const destPath = join(this.root, this.distDir, file);
      
      try {
        await fs.copyFile(srcPath, destPath);
      } catch {
        // File doesn't exist, skip
      }
    }
  }

  async deployToDocker(options) {
    console.log('🐳 Deploying to Docker...');
    
    try {
      // Build Docker image
      const imageName = options.imageName || 'synapse-app';
      const tag = options.tag || 'latest';
      
      execSync(`docker build -t ${imageName}:${tag} .`, {
        stdio: this.verbose ? 'inherit' : 'pipe',
        cwd: this.root
      });
      
      // Run container
      if (options.run) {
        const port = options.port || 3000;
        execSync(`docker run -d -p ${port}:80 --name synapse-app ${imageName}:${tag}`, {
          stdio: this.verbose ? 'inherit' : 'pipe'
        });
        
        console.log(`✅ Container running on port ${port}`);
      }
      
      return {
        image: `${imageName}:${tag}`,
        status: 'deployed'
      };
      
    } catch (error) {
      throw new Error(`Docker deployment failed: ${error.message}`);
    }
  }

  async deployToVercel(options) {
    console.log('▲ Deploying to Vercel...');
    
    try {
      // Deploy to Vercel
      const result = execSync('vercel --prod', {
        stdio: this.verbose ? 'inherit' : 'pipe',
        cwd: this.root
      });
      
      const output = result.toString();
      const urlMatch = output.match(/https:\/\/[^\s]+/);
      const url = urlMatch ? urlMatch[0] : 'Unknown';
      
      return {
        url,
        status: 'deployed'
      };
      
    } catch (error) {
      throw new Error(`Vercel deployment failed: ${error.message}`);
    }
  }

  async deployToAWS(options) {
    console.log('☁️ Deploying to AWS...');
    
    try {
      // Deploy with SAM
      execSync('sam build', {
        stdio: this.verbose ? 'inherit' : 'pipe',
        cwd: this.root
      });
      
      execSync('sam deploy --guided', {
        stdio: this.verbose ? 'inherit' : 'pipe',
        cwd: this.root
      });
      
      return {
        status: 'deployed',
        platform: 'AWS'
      };
      
    } catch (error) {
      throw new Error(`AWS deployment failed: ${error.message}`);
    }
  }

  async deployToNetlify(options) {
    console.log('🌐 Deploying to Netlify...');
    
    try {
      // Deploy to Netlify
      const result = execSync('netlify deploy --prod --dir=dist', {
        stdio: this.verbose ? 'inherit' : 'pipe',
        cwd: this.root
      });
      
      const output = result.toString();
      const urlMatch = output.match(/https:\/\/[^\s]+/);
      const url = urlMatch ? urlMatch[0] : 'Unknown';
      
      return {
        url,
        status: 'deployed'
      };
      
    } catch (error) {
      throw new Error(`Netlify deployment failed: ${error.message}`);
    }
  }

  async deployToGitHubPages(options) {
    console.log('📄 Deploying to GitHub Pages...');
    
    try {
      // Commit and push changes
      execSync('git add .', { cwd: this.root });
      execSync('git commit -m "Deploy to GitHub Pages"', { cwd: this.root });
      execSync('git push origin main', { cwd: this.root });
      
      return {
        status: 'deployed',
        platform: 'GitHub Pages'
      };
      
    } catch (error) {
      throw new Error(`GitHub Pages deployment failed: ${error.message}`);
    }
  }

  async deployToRailway(options) {
    console.log('🚂 Deploying to Railway...');
    
    try {
      // Deploy to Railway
      execSync('railway up', {
        stdio: this.verbose ? 'inherit' : 'pipe',
        cwd: this.root
      });
      
      return {
        status: 'deployed',
        platform: 'Railway'
      };
      
    } catch (error) {
      throw new Error(`Railway deployment failed: ${error.message}`);
    }
  }

  async deployToDigitalOcean(options) {
    console.log('🌊 Deploying to DigitalOcean...');
    
    try {
      // Deploy to DigitalOcean
      execSync('doctl apps create --spec do-app.yaml', {
        stdio: this.verbose ? 'inherit' : 'pipe',
        cwd: this.root
      });
      
      return {
        status: 'deployed',
        platform: 'DigitalOcean'
      };
      
    } catch (error) {
      throw new Error(`DigitalOcean deployment failed: ${error.message}`);
    }
  }

  listPlatforms() {
    return Array.from(this.platforms.values()).map(platform => ({
      id: Array.from(this.platforms.keys()).find(key => this.platforms.get(key) === platform),
      name: platform.name,
      description: platform.description,
      configFile: platform.configFile
    }));
  }

  getDeploymentStatus(platform) {
    // Placeholder for deployment status checking
    return {
      platform,
      status: 'unknown',
      lastDeployed: null,
      url: null
    };
  }

  // ========================================================================
  // ENHANCED DEPLOYMENT FEATURES
  // ========================================================================

  async deployWithRollback(platform, options = {}) {
    console.log(`🔄 Deploying with rollback support to ${platform}...`);
    
    try {
      // Create backup of current deployment
      const backupId = await this.createBackup(platform);
      
      // Attempt deployment
      const result = await this.deploy(platform, options);
      
      // Store deployment info
      await this.storeDeploymentInfo(platform, result, backupId);
      
      return result;
      
    } catch (error) {
      console.log(`❌ Deployment failed, rolling back...`);
      await this.rollback(platform, options.backupId);
      throw error;
    }
  }

  async createBackup(platform) {
    const backupId = createHash('md5').update(Date.now().toString()).digest('hex').substring(0, 8);
    const backupDir = join(this.root, '.synapse', 'backups', backupId);
    
    await fs.mkdir(backupDir, { recursive: true });
    
    // Backup current deployment files
    const filesToBackup = [
      'package.json',
      'package-lock.json',
      'dist',
      '.env'
    ];
    
    for (const file of filesToBackup) {
      const srcPath = join(this.root, file);
      const destPath = join(backupDir, file);
      
      try {
        await fs.access(srcPath);
        await fs.cp(srcPath, destPath, { recursive: true });
      } catch {
        // File doesn't exist, skip
      }
    }
    
    console.log(`✅ Backup created: ${backupId}`);
    return backupId;
  }

  async rollback(platform, backupId) {
    if (!backupId) {
      console.log('❌ No backup ID provided for rollback');
      return;
    }
    
    const backupDir = join(this.root, '.synapse', 'backups', backupId);
    
    try {
      await fs.access(backupDir);
      
      // Restore files from backup
      const files = await fs.readdir(backupDir);
      for (const file of files) {
        const srcPath = join(backupDir, file);
        const destPath = join(this.root, file);
        
        await fs.cp(srcPath, destPath, { recursive: true });
      }
      
      console.log(`✅ Rollback completed from backup: ${backupId}`);
      
    } catch (error) {
      console.error(`❌ Rollback failed: ${error.message}`);
    }
  }

  async storeDeploymentInfo(platform, result, backupId) {
    const deploymentInfo = {
      platform,
      timestamp: new Date().toISOString(),
      result,
      backupId,
      version: await this.getCurrentVersion()
    };
    
    const infoPath = join(this.root, '.synapse', 'deployments.json');
    let deployments = [];
    
    try {
      const data = await fs.readFile(infoPath, 'utf-8');
      deployments = JSON.parse(data);
    } catch {
      // File doesn't exist, start fresh
    }
    
    deployments.push(deploymentInfo);
    
    // Keep only last 10 deployments
    if (deployments.length > 10) {
      deployments = deployments.slice(-10);
    }
    
    await fs.mkdir(dirname(infoPath), { recursive: true });
    await fs.writeFile(infoPath, JSON.stringify(deployments, null, 2));
  }

  async getCurrentVersion() {
    try {
      const packageJson = await fs.readFile(join(this.root, 'package.json'), 'utf-8');
      const pkg = JSON.parse(packageJson);
      return pkg.version || '1.0.0';
    } catch {
      return '1.0.0';
    }
  }

  async listDeployments() {
    const infoPath = join(this.root, '.synapse', 'deployments.json');
    
    try {
      const data = await fs.readFile(infoPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async getDeploymentHistory(platform) {
    const deployments = await this.listDeployments();
    return deployments.filter(d => !platform || d.platform === platform);
  }

  // ========================================================================
  // ENVIRONMENT MANAGEMENT
  // ========================================================================

  async deployToEnvironment(platform, environment, options = {}) {
    console.log(`🌍 Deploying to ${environment} environment on ${platform}...`);
    
    // Load environment-specific configuration
    const envConfig = await this.loadEnvironmentConfig(environment);
    
    // Merge with deployment options
    const mergedOptions = { ...options, ...envConfig };
    
    // Deploy with environment-specific settings
    return await this.deploy(platform, mergedOptions);
  }

  async loadEnvironmentConfig(environment) {
    const configPath = join(this.root, '.synapse', 'environments', `${environment}.json`);
    
    try {
      const data = await fs.readFile(configPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      // Return default environment config
      return {
        env: environment,
        variables: {},
        settings: {}
      };
    }
  }

  async createEnvironment(name, config) {
    const envDir = join(this.root, '.synapse', 'environments');
    await fs.mkdir(envDir, { recursive: true });
    
    const envConfig = {
      name,
      created: new Date().toISOString(),
      ...config
    };
    
    const configPath = join(envDir, `${name}.json`);
    await fs.writeFile(configPath, JSON.stringify(envConfig, null, 2));
    
    console.log(`✅ Environment '${name}' created`);
  }

  // ========================================================================
  // CI/CD INTEGRATION
  // ========================================================================

  async generateCIConfig(platform, options = {}) {
    const ciDir = join(this.root, '.github', 'workflows');
    await fs.mkdir(ciDir, { recursive: true });
    
    const workflow = this.generateGitHubWorkflow(platform, options);
    const workflowPath = join(ciDir, `deploy-${platform}.yml`);
    
    await fs.writeFile(workflowPath, workflow);
    console.log(`✅ CI/CD workflow generated: ${workflowPath}`);
  }

  generateGitHubWorkflow(platform, options) {
    const workflow = `name: Deploy to ${platform}

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'
  PLATFORM: '${platform}'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: \${{ env.NODE_VERSION }}
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Run linting
      run: npm run lint
      
    - name: Build
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: \${{ env.NODE_VERSION }}
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to ${platform}
      run: synapse deploy ${platform} --prod
      env:
        ${this.generateEnvironmentVariables(platform, options)}
`;

    return workflow;
  }

  generateEnvironmentVariables(platform, options) {
    const commonVars = [
      'NODE_ENV=production',
      'CI=true'
    ];
    
    const platformVars = {
      'vercel': [
        'VERCEL_TOKEN=${{ secrets.VERCEL_TOKEN }}',
        'VERCEL_ORG_ID=${{ secrets.VERCEL_ORG_ID }}',
        'VERCEL_PROJECT_ID=${{ secrets.VERCEL_PROJECT_ID }}'
      ],
      'aws': [
        'AWS_ACCESS_KEY_ID=${{ secrets.AWS_ACCESS_KEY_ID }}',
        'AWS_SECRET_ACCESS_KEY=${{ secrets.AWS_SECRET_ACCESS_KEY }}',
        'AWS_REGION=${{ secrets.AWS_REGION }}'
      ],
      'netlify': [
        'NETLIFY_AUTH_TOKEN=${{ secrets.NETLIFY_AUTH_TOKEN }}',
        'NETLIFY_SITE_ID=${{ secrets.NETLIFY_SITE_ID }}'
      ]
    };
    
    const vars = [...commonVars, ...(platformVars[platform] || [])];
    return vars.join('\n        ');
  }

  // ========================================================================
  // MONITORING AND HEALTH CHECKS
  // ========================================================================

  async setupHealthChecks(platform, options = {}) {
    console.log(`🏥 Setting up health checks for ${platform}...`);
    
    const healthCheckConfig = {
      endpoint: options.healthEndpoint || '/health',
      interval: options.interval || 30,
      timeout: options.timeout || 5,
      retries: options.retries || 3,
      platforms: {
        'docker': this.generateDockerHealthCheck(),
        'vercel': this.generateVercelHealthCheck(),
        'aws': this.generateAWSHealthCheck(),
        'netlify': this.generateNetlifyHealthCheck()
      }
    };
    
    const config = healthCheckConfig.platforms[platform];
    if (config) {
      await this.writeHealthCheckConfig(platform, config);
      console.log(`✅ Health checks configured for ${platform}`);
    }
  }

  generateDockerHealthCheck() {
    return `HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1`;
  }

  generateVercelHealthCheck() {
    return `// api/health.js
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}`;
  }

  generateAWSHealthCheck() {
    return `// health.js
exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    })
  };
};`;
  }

  generateNetlifyHealthCheck() {
    return `// netlify/functions/health.js
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    })
  };
};`;
  }

  async writeHealthCheckConfig(platform, config) {
    const configPath = join(this.root, `.synapse`, 'health-checks', `${platform}.js`);
    await fs.mkdir(dirname(configPath), { recursive: true });
    await fs.writeFile(configPath, config);
  }

  // ========================================================================
  // DEPLOYMENT ANALYTICS
  // ========================================================================

  async trackDeploymentMetrics(platform, result) {
    const metrics = {
      platform,
      timestamp: new Date().toISOString(),
      duration: result.duration || 0,
      success: result.status === 'deployed',
      size: await this.calculateDeploymentSize(),
      version: await this.getCurrentVersion()
    };
    
    const metricsPath = join(this.root, '.synapse', 'metrics.json');
    let allMetrics = [];
    
    try {
      const data = await fs.readFile(metricsPath, 'utf-8');
      allMetrics = JSON.parse(data);
    } catch {
      // File doesn't exist, start fresh
    }
    
    allMetrics.push(metrics);
    
    // Keep only last 100 metrics
    if (allMetrics.length > 100) {
      allMetrics = allMetrics.slice(-100);
    }
    
    await fs.mkdir(dirname(metricsPath), { recursive: true });
    await fs.writeFile(metricsPath, JSON.stringify(allMetrics, null, 2));
  }

  async calculateDeploymentSize() {
    const distPath = join(this.root, this.distDir);
    
    try {
      const stats = await fs.stat(distPath);
      return stats.size;
    } catch {
      return 0;
    }
  }

  async getDeploymentAnalytics() {
    const metricsPath = join(this.root, '.synapse', 'metrics.json');
    
    try {
      const data = await fs.readFile(metricsPath, 'utf-8');
      const metrics = JSON.parse(data);
      
      return {
        totalDeployments: metrics.length,
        successRate: metrics.filter(m => m.success).length / metrics.length * 100,
        averageDuration: metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length,
        platforms: [...new Set(metrics.map(m => m.platform))],
        recentDeployments: metrics.slice(-10)
      };
    } catch {
      return {
        totalDeployments: 0,
        successRate: 0,
        averageDuration: 0,
        platforms: [],
        recentDeployments: []
      };
    }
  }
}