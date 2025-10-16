/**
 * Synapse CLI Usage Examples
 * Comprehensive examples showing how to use the TypeScript wrapper
 */

import { 
  SynapseCLIWrapper, 
  createSynapseCLI,
  InitCommand,
  DevCommand,
  BuildCommand,
  TestCommand,
  AiCommand,
  DeployCommand,
  SecurityCommand,
  CLIEvent
} from '../src/synapse-cli';

// Example 1: Basic CLI Usage
async function basicUsage() {
  console.log('🚀 Basic CLI Usage Example');
  
  const cli = createSynapseCLI();
  await cli.initialize();
  
  // Initialize a new project
  const initOptions: InitCommand = {
    name: 'my-awesome-app',
    template: 'fullstack',
    yes: false
  };
  
  await cli.init(initOptions);
  
  // Start development server
  const devOptions: DevCommand = {
    port: 3000,
    open: true
  };
  
  await cli.dev(devOptions);
}

// Example 2: Event-driven CLI Usage
async function eventDrivenUsage() {
  console.log('🎯 Event-driven CLI Usage Example');
  
  const cli = createSynapseCLI();
  await cli.initialize();
  
  // Set up event listeners
  cli.on('build_start', (event: CLIEvent) => {
    console.log(`🔄 Build started: ${event.message}`);
  });
  
  cli.on('build_complete', (event: CLIEvent) => {
    console.log(`✅ Build completed: ${event.message}`);
  });
  
  cli.on('error', (event: CLIEvent) => {
    console.error(`❌ Error: ${event.message}`);
  });
  
  // Build the project
  const buildOptions: BuildCommand = {
    output: 'dist',
    minify: true
  };
  
  await cli.build(buildOptions);
}

// Example 3: AI-Powered Development
async function aiPoweredUsage() {
  console.log('🤖 AI-Powered Development Example');
  
  const cli = createSynapseCLI();
  await cli.initialize();
  
  // Generate code using AI
  const aiGenerateOptions: AiCommand = {
    action: 'generate',
    options: 'Create a React component for user authentication'
  };
  
  await cli.ai(aiGenerateOptions);
  
  // Generate tests
  const aiTestOptions: AiCommand = {
    action: 'test',
    options: 'src/components/AuthForm.tsx'
  };
  
  await cli.ai(aiTestOptions);
  
  // Analyze code quality
  const aiAnalyzeOptions: AiCommand = {
    action: 'analyze',
    options: 'src/'
  };
  
  await cli.ai(aiAnalyzeOptions);
}

// Example 4: Testing and Quality Assurance
async function testingUsage() {
  console.log('🧪 Testing and Quality Assurance Example');
  
  const cli = createSynapseCLI();
  await cli.initialize();
  
  // Run tests with watch mode
  const testOptions: TestCommand = {
    pattern: 'auth',
    watch: true
  };
  
  await cli.test(testOptions);
  
  // Run linting with auto-fix
  await cli.lint({ fix: true });
  
  // Format code
  await cli.format({ check: false });
}

// Example 5: Security and Deployment
async function securityAndDeploymentUsage() {
  console.log('🔒 Security and Deployment Example');
  
  const cli = createSynapseCLI();
  await cli.initialize();
  
  // Security scan
  const securityOptions: SecurityCommand = {
    action: 'scan',
    options: '--include-dependencies --include-secrets'
  };
  
  await cli.security(securityOptions);
  
  // Deploy to cloud
  const deployOptions: DeployCommand = {
    action: 'start',
    target: 'aws-s3'
  };
  
  await cli.deploy(deployOptions);
}

// Example 6: Advanced Configuration
async function advancedConfigurationUsage() {
  console.log('⚙️ Advanced Configuration Example');
  
  const cli = createSynapseCLI();
  await cli.initialize();
  
  // Get current configuration
  const config = cli.getConfig();
  console.log('Current config:', config);
  
  // Update configuration
  cli.setConfig({
    features: ['typescript', 'testing', 'ai', 'security'],
    template: 'enterprise'
  });
  
  // Validate project
  const isValid = cli.validateProject();
  console.log('Project is valid:', isValid);
  
  // Get project info
  const projectInfo = cli.getProjectInfo();
  console.log('Project info:', projectInfo);
}

// Example 7: Error Handling
async function errorHandlingUsage() {
  console.log('🛡️ Error Handling Example');
  
  const cli = createSynapseCLI();
  
  try {
    await cli.initialize();
    
    // This will fail if not in a valid project
    await cli.build({ output: 'dist' });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Build failed:', error.message);
      
      // Handle specific error types
      if (error.message.includes('BINARY_NOT_FOUND')) {
        console.log('Please build the Rust CLI first');
      } else if (error.message.includes('VALIDATION_ERROR')) {
        console.log('Please check your project configuration');
      }
    }
  }
}

// Example 8: Plugin Management
async function pluginManagementUsage() {
  console.log('🔌 Plugin Management Example');
  
  const cli = createSynapseCLI();
  await cli.initialize();
  
  // List available plugins
  await cli.plugin({ action: 'list' });
  
  // Install a plugin
  await cli.plugin({ 
    action: 'install', 
    name: '@snps/ui' 
  });
  
  // Install another plugin
  await cli.plugin({ 
    action: 'install', 
    name: '@snps/auth' 
  });
}

// Example 9: Template Management
async function templateManagementUsage() {
  console.log('📋 Template Management Example');
  
  const cli = createSynapseCLI();
  await cli.initialize();
  
  // List available templates
  await cli.template({ action: 'list' });
  
  // Create a custom template
  await cli.template({ 
    action: 'create', 
    name: 'my-custom-template' 
  });
}

// Example 10: Batch Operations
async function batchOperationsUsage() {
  console.log('⚡ Batch Operations Example');
  
  const cli = createSynapseCLI();
  await cli.initialize();
  
  // Process multiple operations in batch
  await cli.batch({ 
    action: 'process', 
    config: 'batch-config.json' 
  });
  
  // Validate batch configuration
  await cli.batch({ 
    action: 'validate', 
    config: 'batch-config.json' 
  });
}

// Example 11: Monitoring and Analytics
async function monitoringUsage() {
  console.log('📊 Monitoring and Analytics Example');
  
  const cli = createSynapseCLI();
  await cli.initialize();
  
  // Start monitoring
  await cli.monitor({ 
    action: 'start', 
    options: '--port 3001 --metrics cpu,memory,disk' 
  });
  
  // Start analytics
  await cli.analytics({ 
    action: 'start', 
    options: '--project-id my-project --api-key my-key' 
  });
}

// Example 12: Database Management
async function databaseUsage() {
  console.log('🗄️ Database Management Example');
  
  const cli = createSynapseCLI();
  await cli.initialize();
  
  // Run database migrations
  await cli.db({ 
    action: 'migrate', 
    options: '--direction up --target latest' 
  });
  
  // Seed database
  await cli.db({ 
    action: 'seed', 
    options: '--environment development' 
  });
}

// Example 13: Internationalization
async function internationalizationUsage() {
  console.log('🌍 Internationalization Example');
  
  const cli = createSynapseCLI();
  await cli.initialize();
  
  // Extract translation strings
  await cli.i18n({ 
    action: 'extract', 
    options: '--locales en,es,fr --format json' 
  });
  
  // Validate translations
  await cli.i18n({ 
    action: 'validate', 
    options: '--strict --fix-issues' 
  });
}

// Example 14: Documentation Generation
async function documentationUsage() {
  console.log('📚 Documentation Generation Example');
  
  const cli = createSynapseCLI();
  await cli.initialize();
  
  // Generate API documentation
  await cli.docs({ 
    action: 'generate', 
    options: '--format openapi --output docs/api.json' 
  });
  
  // Serve documentation
  await cli.docs({ 
    action: 'serve', 
    options: '--port 8080 --open' 
  });
}

// Example 15: Caching Management
async function cachingUsage() {
  console.log('💾 Caching Management Example');
  
  const cli = createSynapseCLI();
  await cli.initialize();
  
  // Get cache statistics
  await cli.cache({ 
    action: 'stats', 
    options: '--include-memory --include-hit-rates' 
  });
  
  // Clear cache
  await cli.cache({ 
    action: 'clear' 
  });
  
  // Optimize cache
  await cli.cache({ 
    action: 'optimize' 
  });
}

// Example 16: Team Collaboration
async function teamCollaborationUsage() {
  console.log('👥 Team Collaboration Example');
  
  const cli = createSynapseCLI();
  await cli.initialize();
  
  // Create a team
  await cli.team({ 
    action: 'create', 
    options: '--name "My Team" --description "Development team"' 
  });
  
  // Invite team members
  await cli.team({ 
    action: 'invite', 
    options: '--team-id team-123 --email user@example.com --role member' 
  });
}

// Example 17: Cloud Synchronization
async function cloudSyncUsage() {
  console.log('☁️ Cloud Synchronization Example');
  
  const cli = createSynapseCLI();
  await cli.initialize();
  
  // Sync with cloud
  await cli.cloud({ 
    action: 'sync', 
    options: '--provider aws --region us-east-1' 
  });
  
  // Check sync status
  await cli.cloud({ 
    action: 'status' 
  });
}

// Example 18: Hot Reload
async function hotReloadUsage() {
  console.log('🔥 Hot Reload Example');
  
  const cli = createSynapseCLI();
  await cli.initialize();
  
  // Start hot reload
  await cli.hotReload({ 
    action: 'start', 
    options: '--port 3000 --watch src/**/*' 
  });
  
  // Check hot reload status
  await cli.hotReload({ 
    action: 'status' 
  });
}

// Example 19: Rust Compilation
async function rustCompilationUsage() {
  console.log('🦀 Rust Compilation Example');
  
  const cli = createSynapseCLI();
  await cli.initialize();
  
  // Initialize Rust project
  await cli.rust({ 
    action: 'init' 
  });
  
  // Compile Rust code
  await cli.rust({ 
    action: 'compile', 
    target: 'wasm32-unknown-unknown' 
  });
}

// Example 20: Performance Profiling
async function performanceProfilingUsage() {
  console.log('⚡ Performance Profiling Example');
  
  const cli = createSynapseCLI();
  await cli.initialize();
  
  // Start profiling
  await cli.profile({ 
    action: 'start', 
    options: '--duration 30 --include-memory --include-cpu' 
  });
  
  // Generate profile report
  await cli.profile({ 
    action: 'report', 
    options: '--format html --output profile-report.html' 
  });
}

// Main function to run all examples
async function runAllExamples() {
  console.log('🚀 Running Synapse CLI Examples\n');
  
  try {
    await basicUsage();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await eventDrivenUsage();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await aiPoweredUsage();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await testingUsage();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await securityAndDeploymentUsage();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await advancedConfigurationUsage();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await errorHandlingUsage();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await pluginManagementUsage();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await templateManagementUsage();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await batchOperationsUsage();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await monitoringUsage();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await databaseUsage();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await internationalizationUsage();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await documentationUsage();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await cachingUsage();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await teamCollaborationUsage();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await cloudSyncUsage();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await hotReloadUsage();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await rustCompilationUsage();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await performanceProfilingUsage();
    
    console.log('\n🎉 All examples completed successfully!');
  } catch (error) {
    console.error('❌ Example failed:', error);
  }
}

// Export all examples for individual use
export {
  basicUsage,
  eventDrivenUsage,
  aiPoweredUsage,
  testingUsage,
  securityAndDeploymentUsage,
  advancedConfigurationUsage,
  errorHandlingUsage,
  pluginManagementUsage,
  templateManagementUsage,
  batchOperationsUsage,
  monitoringUsage,
  databaseUsage,
  internationalizationUsage,
  documentationUsage,
  cachingUsage,
  teamCollaborationUsage,
  cloudSyncUsage,
  hotReloadUsage,
  rustCompilationUsage,
  performanceProfilingUsage,
  runAllExamples
};

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples().catch(console.error);
}