/**
 * API Documentation Generation System for Synapse CLI
 * Automatic API documentation generation with OpenAPI/Swagger support
 */

import { promises as fs } from 'fs';
import { join, resolve, dirname, extname, basename } from 'path';
import { execSync, spawn } from 'child_process';

export class APIDocumentationGenerator {
  constructor(options = {}) {
    this.root = options.root || process.cwd();
    this.verbose = options.verbose || false;
    this.outputDir = options.outputDir || join(this.root, 'docs', 'api');
    this.srcDir = options.srcDir || join(this.root, 'src');
    
    this.apiEndpoints = new Map();
    this.schemas = new Map();
    this.tags = new Map();
    this.servers = new Map();
    
    this.supportedFormats = ['openapi', 'swagger', 'postman', 'insomnia', 'raml'];
    this.templateEngines = ['handlebars', 'mustache', 'ejs', 'nunjucks'];
  }

  async initialize() {
    console.log('📚 Initializing API Documentation Generator...');
    
    // Ensure output directory exists
    await fs.mkdir(this.outputDir, { recursive: true });
    
    // Initialize default configuration
    this.initializeDefaultConfig();
    
    console.log('✅ API Documentation Generator initialized');
  }

  initializeDefaultConfig() {
    // Default OpenAPI configuration
    this.openApiConfig = {
      openapi: '3.0.0',
      info: {
        title: 'Synapse API',
        description: 'API documentation for Synapse application',
        version: '1.0.0',
        contact: {
          name: 'API Support',
          email: 'support@synapse.dev'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        }
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        },
        {
          url: 'https://api.synapse.dev',
          description: 'Production server'
        }
      ],
      tags: [],
      paths: {},
      components: {
        schemas: {},
        responses: {},
        parameters: {},
        examples: {},
        requestBodies: {},
        headers: {},
        securitySchemes: {}
      }
    };
  }

  async generateDocumentation(options = {}) {
    console.log('📚 Generating API documentation...');
    
    try {
      // Discover API endpoints
      await this.discoverEndpoints();
      
      // Generate schemas
      await this.generateSchemas();
      
      // Generate OpenAPI specification
      const openApiSpec = await this.generateOpenAPISpec();
      
      // Generate documentation in various formats
      const formats = options.formats || ['openapi', 'swagger', 'postman'];
      
      for (const format of formats) {
        await this.generateFormat(openApiSpec, format, options);
      }
      
      // Generate interactive documentation
      await this.generateInteractiveDocs(openApiSpec, options);
      
      console.log('✅ API documentation generated');
      
      return {
        openApiSpec,
        formats: formats,
        outputDir: this.outputDir
      };
      
    } catch (error) {
      console.error('❌ Documentation generation failed:', error.message);
      throw error;
    }
  }

  async discoverEndpoints() {
    console.log('🔍 Discovering API endpoints...');
    
    try {
      // Find API files
      const apiFiles = await this.findAPIFiles();
      
      for (const file of apiFiles) {
        await this.parseAPIFile(file);
      }
      
      console.log(`📋 Discovered ${this.apiEndpoints.size} endpoints`);
      
    } catch (error) {
      console.error('❌ Endpoint discovery failed:', error.message);
    }
  }

  async findAPIFiles() {
    const files = [];
    const apiDir = join(this.srcDir, 'api');
    
    try {
      const entries = await fs.readdir(apiDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(apiDir, entry.name);
        
        if (entry.isDirectory()) {
          files.push(...await this.findAPIFilesInDir(fullPath));
        } else if (this.isAPIFile(entry.name)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // API directory doesn't exist, try to find API files in src
      files.push(...await this.findAPIFilesInDir(this.srcDir));
    }
    
    return files;
  }

  async findAPIFilesInDir(dir) {
    const files = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        
        if (entry.isDirectory()) {
          files.push(...await this.findAPIFilesInDir(fullPath));
        } else if (this.isAPIFile(entry.name)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
    
    return files;
  }

  isAPIFile(filename) {
    const ext = extname(filename);
    return ['.ts', '.tsx', '.js', '.jsx'].includes(ext) && 
           (filename.includes('api') || filename.includes('route') || filename.includes('endpoint'));
  }

  async parseAPIFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const endpoints = this.extractEndpoints(content, filePath);
      
      for (const endpoint of endpoints) {
        this.apiEndpoints.set(endpoint.id, endpoint);
      }
      
    } catch (error) {
      console.error(`❌ Failed to parse API file ${filePath}:`, error.message);
    }
  }

  extractEndpoints(content, filePath) {
    const endpoints = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Look for route definitions
      const routeMatch = line.match(/(?:app\.|router\.|fastify\.)(get|post|put|patch|delete|options|head)\s*\(\s*['"`]([^'"`]+)['"`]/);
      if (routeMatch) {
        const method = routeMatch[1].toUpperCase();
        const path = routeMatch[2];
        
        // Extract JSDoc comments
        const jsdoc = this.extractJSDoc(lines, i);
        
        // Extract function parameters
        const params = this.extractParameters(content, i);
        
        // Extract response types
        const responses = this.extractResponses(jsdoc);
        
        // Extract request body
        const requestBody = this.extractRequestBody(jsdoc);
        
        // Extract tags
        const tags = this.extractTags(jsdoc);
        
        const endpoint = {
          id: `${method}_${path.replace(/[^a-zA-Z0-9]/g, '_')}`,
          method,
          path,
          file: filePath,
          line: i + 1,
          jsdoc,
          parameters: params,
          responses,
          requestBody,
          tags,
          summary: this.extractSummary(jsdoc),
          description: this.extractDescription(jsdoc)
        };
        
        endpoints.push(endpoint);
      }
    }
    
    return endpoints;
  }

  extractJSDoc(lines, startLine) {
    const jsdoc = [];
    let i = startLine - 1;
    
    while (i >= 0 && lines[i].trim().startsWith('*')) {
      jsdoc.unshift(lines[i].trim());
      i--;
    }
    
    if (i >= 0 && lines[i].trim().startsWith('/**')) {
      jsdoc.unshift(lines[i].trim());
    }
    
    return jsdoc.join('\n');
  }

  extractParameters(content, lineIndex) {
    const parameters = [];
    
    // Look for parameter patterns in JSDoc
    const paramRegex = /@param\s+{([^}]+)}\s+(\w+)\s+(.+)/g;
    let match;
    
    while ((match = paramRegex.exec(content)) !== null) {
      parameters.push({
        name: match[2],
        type: match[1],
        description: match[3],
        in: 'query' // Default to query parameter
      });
    }
    
    return parameters;
  }

  extractResponses(jsdoc) {
    const responses = {};
    
    // Look for response patterns in JSDoc
    const responseRegex = /@response\s+(\d+)\s+{([^}]+)}\s+(.+)/g;
    let match;
    
    while ((match = responseRegex.exec(jsdoc)) !== null) {
      responses[match[1]] = {
        description: match[3],
        content: {
          'application/json': {
            schema: {
              type: this.parseType(match[2])
            }
          }
        }
      };
    }
    
    // Add default responses if none found
    if (Object.keys(responses).length === 0) {
      responses['200'] = {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              type: 'object'
            }
          }
        }
      };
    }
    
    return responses;
  }

  extractRequestBody(jsdoc) {
    const bodyRegex = /@body\s+{([^}]+)}\s+(.+)/;
    const match = bodyRegex.exec(jsdoc);
    
    if (match) {
      return {
        description: match[2],
        content: {
          'application/json': {
            schema: {
              type: this.parseType(match[1])
            }
          }
        }
      };
    }
    
    return null;
  }

  extractTags(jsdoc) {
    const tagRegex = /@tag\s+(\w+)/g;
    const tags = [];
    let match;
    
    while ((match = tagRegex.exec(jsdoc)) !== null) {
      tags.push(match[1]);
    }
    
    return tags;
  }

  extractSummary(jsdoc) {
    const summaryRegex = /@summary\s+(.+)/;
    const match = summaryRegex.exec(jsdoc);
    return match ? match[1] : '';
  }

  extractDescription(jsdoc) {
    const descRegex = /@description\s+(.+)/;
    const match = descRegex.exec(jsdoc);
    return match ? match[1] : '';
  }

  parseType(typeString) {
    // Simple type parsing
    if (typeString.includes('string')) return 'string';
    if (typeString.includes('number')) return 'number';
    if (typeString.includes('boolean')) return 'boolean';
    if (typeString.includes('array')) return 'array';
    if (typeString.includes('object')) return 'object';
    return 'string';
  }

  async generateSchemas() {
    console.log('📊 Generating schemas...');
    
    try {
      // Find schema files
      const schemaFiles = await this.findSchemaFiles();
      
      for (const file of schemaFiles) {
        await this.parseSchemaFile(file);
      }
      
      console.log(`📋 Generated ${this.schemas.size} schemas`);
      
    } catch (error) {
      console.error('❌ Schema generation failed:', error.message);
    }
  }

  async findSchemaFiles() {
    const files = [];
    const schemaDir = join(this.srcDir, 'schemas');
    
    try {
      const entries = await fs.readdir(schemaDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(schemaDir, entry.name);
        
        if (entry.isDirectory()) {
          files.push(...await this.findSchemaFilesInDir(fullPath));
        } else if (this.isSchemaFile(entry.name)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Schema directory doesn't exist
    }
    
    return files;
  }

  async findSchemaFilesInDir(dir) {
    const files = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        
        if (entry.isDirectory()) {
          files.push(...await this.findSchemaFilesInDir(fullPath));
        } else if (this.isSchemaFile(entry.name)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
    
    return files;
  }

  isSchemaFile(filename) {
    const ext = extname(filename);
    return ['.ts', '.tsx', '.js', '.jsx', '.json'].includes(ext) && 
           (filename.includes('schema') || filename.includes('model') || filename.includes('type'));
  }

  async parseSchemaFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const schemas = this.extractSchemas(content, filePath);
      
      for (const schema of schemas) {
        this.schemas.set(schema.name, schema);
      }
      
    } catch (error) {
      console.error(`❌ Failed to parse schema file ${filePath}:`, error.message);
    }
  }

  extractSchemas(content, filePath) {
    const schemas = [];
    
    // Look for TypeScript interfaces
    const interfaceRegex = /interface\s+(\w+)\s*{([^}]+)}/g;
    let match;
    
    while ((match = interfaceRegex.exec(content)) !== null) {
      const schema = {
        name: match[1],
        type: 'object',
        properties: this.parseInterfaceProperties(match[2]),
        file: filePath
      };
      
      schemas.push(schema);
    }
    
    // Look for TypeScript types
    const typeRegex = /type\s+(\w+)\s*=\s*{([^}]+)}/g;
    
    while ((match = typeRegex.exec(content)) !== null) {
      const schema = {
        name: match[1],
        type: 'object',
        properties: this.parseInterfaceProperties(match[2]),
        file: filePath
      };
      
      schemas.push(schema);
    }
    
    return schemas;
  }

  parseInterfaceProperties(propertiesString) {
    const properties = {};
    const lines = propertiesString.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('//')) {
        const propMatch = trimmed.match(/(\w+)(\?)?\s*:\s*([^;]+)/);
        if (propMatch) {
          const name = propMatch[1];
          const optional = !!propMatch[2];
          const type = propMatch[3].trim();
          
          properties[name] = {
            type: this.parseType(type),
            required: !optional
          };
        }
      }
    }
    
    return properties;
  }

  async generateOpenAPISpec() {
    console.log('📋 Generating OpenAPI specification...');
    
    const spec = { ...this.openApiConfig };
    
    // Add paths from discovered endpoints
    for (const [id, endpoint] of this.apiEndpoints) {
      if (!spec.paths[endpoint.path]) {
        spec.paths[endpoint.path] = {};
      }
      
      spec.paths[endpoint.path][endpoint.method.toLowerCase()] = {
        summary: endpoint.summary,
        description: endpoint.description,
        tags: endpoint.tags,
        parameters: endpoint.parameters,
        requestBody: endpoint.requestBody,
        responses: endpoint.responses
      };
    }
    
    // Add schemas
    for (const [name, schema] of this.schemas) {
      spec.components.schemas[name] = schema;
    }
    
    // Add tags
    const allTags = new Set();
    for (const [id, endpoint] of this.apiEndpoints) {
      endpoint.tags.forEach(tag => allTags.add(tag));
    }
    
    spec.tags = Array.from(allTags).map(tag => ({
      name: tag,
      description: `Operations related to ${tag}`
    }));
    
    return spec;
  }

  async generateFormat(openApiSpec, format, options = {}) {
    console.log(`📄 Generating ${format} documentation...`);
    
    switch (format) {
      case 'openapi':
        await this.generateOpenAPI(openApiSpec, options);
        break;
      case 'swagger':
        await this.generateSwagger(openApiSpec, options);
        break;
      case 'postman':
        await this.generatePostman(openApiSpec, options);
        break;
      case 'insomnia':
        await this.generateInsomnia(openApiSpec, options);
        break;
      case 'raml':
        await this.generateRAML(openApiSpec, options);
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  async generateOpenAPI(openApiSpec, options) {
    const outputPath = join(this.outputDir, 'openapi.json');
    await fs.writeFile(outputPath, JSON.stringify(openApiSpec, null, 2));
    console.log(`✅ OpenAPI specification saved: ${outputPath}`);
  }

  async generateSwagger(openApiSpec, options) {
    const outputPath = join(this.outputDir, 'swagger.json');
    await fs.writeFile(outputPath, JSON.stringify(openApiSpec, null, 2));
    console.log(`✅ Swagger specification saved: ${outputPath}`);
  }

  async generatePostman(openApiSpec, options) {
    const postmanCollection = this.convertToPostman(openApiSpec);
    const outputPath = join(this.outputDir, 'postman.json');
    await fs.writeFile(outputPath, JSON.stringify(postmanCollection, null, 2));
    console.log(`✅ Postman collection saved: ${outputPath}`);
  }

  convertToPostman(openApiSpec) {
    const collection = {
      info: {
        name: openApiSpec.info.title,
        description: openApiSpec.info.description,
        version: openApiSpec.info.version,
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
      },
      item: []
    };
    
    for (const [path, methods] of Object.entries(openApiSpec.paths)) {
      for (const [method, operation] of Object.entries(methods)) {
        const item = {
          name: operation.summary || `${method.toUpperCase()} ${path}`,
          request: {
            method: method.toUpperCase(),
            url: {
              raw: `{{baseUrl}}${path}`,
              host: ['{{baseUrl}}'],
              path: path.split('/').filter(p => p)
            },
            description: operation.description
          }
        };
        
        // Add parameters
        if (operation.parameters) {
          item.request.url.variable = operation.parameters.map(param => ({
            key: param.name,
            value: `{{${param.name}}}`,
            description: param.description
          }));
        }
        
        // Add request body
        if (operation.requestBody) {
          item.request.body = {
            mode: 'raw',
            raw: JSON.stringify({}, null, 2),
            options: {
              raw: {
                language: 'json'
              }
            }
          };
        }
        
        collection.item.push(item);
      }
    }
    
    return collection;
  }

  async generateInsomnia(openApiSpec, options) {
    const insomniaCollection = this.convertToInsomnia(openApiSpec);
    const outputPath = join(this.outputDir, 'insomnia.json');
    await fs.writeFile(outputPath, JSON.stringify(insomniaCollection, null, 2));
    console.log(`✅ Insomnia collection saved: ${outputPath}`);
  }

  convertToInsomnia(openApiSpec) {
    const collection = {
      _type: 'export',
      __export_format: 4,
      __export_date: new Date().toISOString(),
      __export_source: 'synapse-cli',
      resources: []
    };
    
    for (const [path, methods] of Object.entries(openApiSpec.paths)) {
      for (const [method, operation] of Object.entries(methods)) {
        const resource = {
          _id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          _type: 'request',
          parentId: 'fld_root',
          modified: Date.now(),
          created: Date.now(),
          url: `{{ _.baseUrl }}${path}`,
          name: operation.summary || `${method.toUpperCase()} ${path}`,
          description: operation.description,
          method: method.toUpperCase(),
          body: operation.requestBody ? {
            mimeType: 'application/json',
            text: '{}'
          } : undefined
        };
        
        collection.resources.push(resource);
      }
    }
    
    return collection;
  }

  async generateRAML(openApiSpec, options) {
    const ramlSpec = this.convertToRAML(openApiSpec);
    const outputPath = join(this.outputDir, 'api.raml');
    await fs.writeFile(outputPath, ramlSpec);
    console.log(`✅ RAML specification saved: ${outputPath}`);
  }

  convertToRAML(openApiSpec) {
    let raml = `#%RAML 1.0
title: ${openApiSpec.info.title}
version: ${openApiSpec.info.version}
description: ${openApiSpec.info.description}

baseUri: ${openApiSpec.servers[0].url}

`;

    for (const [path, methods] of Object.entries(openApiSpec.paths)) {
      raml += `${path}:\n`;
      
      for (const [method, operation] of Object.entries(methods)) {
        raml += `  ${method.toLowerCase()}:\n`;
        raml += `    description: ${operation.description || ''}\n`;
        
        if (operation.parameters) {
          raml += `    queryParameters:\n`;
          for (const param of operation.parameters) {
            raml += `      ${param.name}:\n`;
            raml += `        type: ${param.type}\n`;
            raml += `        description: ${param.description || ''}\n`;
          }
        }
        
        if (operation.responses) {
          raml += `    responses:\n`;
          for (const [code, response] of Object.entries(operation.responses)) {
            raml += `      ${code}:\n`;
            raml += `        description: ${response.description}\n`;
          }
        }
        
        raml += `\n`;
      }
    }
    
    return raml;
  }

  async generateInteractiveDocs(openApiSpec, options) {
    console.log('🎨 Generating interactive documentation...');
    
    // Generate HTML documentation using Swagger UI
    const htmlDoc = this.generateHTMLDocumentation(openApiSpec);
    const outputPath = join(this.outputDir, 'index.html');
    await fs.writeFile(outputPath, htmlDoc);
    
    console.log(`✅ Interactive documentation saved: ${outputPath}`);
  }

  generateHTMLDocumentation(openApiSpec) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${openApiSpec.info.title} - API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
    <style>
        html {
            box-sizing: border-box;
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
        }
        *, *:before, *:after {
            box-sizing: inherit;
        }
        body {
            margin:0;
            background: #fafafa;
        }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                url: './openapi.json',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout"
            });
        };
    </script>
</body>
</html>`;
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      endpoints: Array.from(this.apiEndpoints.values()).map(e => ({
        id: e.id,
        method: e.method,
        path: e.path,
        summary: e.summary,
        tags: e.tags
      })),
      schemas: Array.from(this.schemas.values()).map(s => ({
        name: s.name,
        type: s.type,
        properties: Object.keys(s.properties || {})
      })),
      summary: {
        totalEndpoints: this.apiEndpoints.size,
        totalSchemas: this.schemas.size,
        supportedFormats: this.supportedFormats
      }
    };
    
    return report;
  }

  getEndpoints() {
    return Array.from(this.apiEndpoints.values());
  }

  getSchemas() {
    return Array.from(this.schemas.values());
  }

  getSupportedFormats() {
    return this.supportedFormats;
  }
}