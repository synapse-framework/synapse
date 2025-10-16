/**
 * Synapse Framework - Basic Usage Example
 * Demonstrates how to use the framework for a simple web application
 */

import { 
  SynapseFramework, 
  TestingFramework, 
  LintingSystem, 
  Router, 
  StateManager,
  PluginSystem,
  expect,
  test
} from '@synapse/framework';

// ============================================================================
// BASIC FRAMEWORK USAGE
// ============================================================================

async function basicExample() {
  console.log('🚀 Synapse Framework - Basic Usage Example');

  // Initialize the framework
  const framework = new SynapseFramework({
    runtime: {
      maxWorkers: 4,
      minWorkers: 2
    },
    compiler: {
      target: 'ES2022',
      strict: true,
      minify: false,
      sourceMaps: true
    },
    testing: {
      coverage: true,
      threshold: 100,
      parallel: true
    },
    linting: {
      strict: true,
      autoFix: true,
      formatOnSave: true
    }
  });

  try {
    // Initialize the framework
    await framework.initialize();
    console.log('✅ Framework initialized successfully!');

    // Start the framework
    await framework.start();
    console.log('✅ Framework started successfully!');

    // Get framework status
    const status = framework.getStatus();
    console.log('📊 Framework Status:', {
      version: status.version,
      initialized: status.initialized,
      running: status.running,
      runtime: status.runtime.isRunning,
      compiler: status.compiler,
      testing: status.testing,
      linting: status.linting
    });

    // Get framework health
    const health = framework.getHealth();
    console.log('🏥 Framework Health:', {
      healthy: health.healthy,
      status: health.status,
      uptime: health.uptime,
      memory: health.memory,
      errors: health.errors,
      warnings: health.warnings
    });

    // Stop the framework
    await framework.stop();
    console.log('✅ Framework stopped successfully!');

  } catch (error) {
    console.error('❌ Framework error:', error);
  }
}

// ============================================================================
// TESTING EXAMPLE
// ============================================================================

async function testingExample() {
  console.log('🧪 Testing Framework Example');

  const testing = new TestingFramework({
    coverage: true,
    threshold: 100,
    parallel: true,
    watch: false
  });

  try {
    await testing.initialize();

    // Define a test
    test('should add two numbers correctly', () => {
      const result = add(2, 3);
      expect(result).toBe(5);
    });

    test('should handle string concatenation', () => {
      const result = concatenate('Hello', 'World');
      expect(result).toBe('HelloWorld');
    });

    // Run tests
    const result = await testing.run([]);
    console.log('📊 Test Results:', {
      success: result.success,
      passed: result.passed,
      failed: result.failed,
      skipped: result.skipped,
      duration: result.duration
    });

  } catch (error) {
    console.error('❌ Testing error:', error);
  }
}

// ============================================================================
// LINTING EXAMPLE
// ============================================================================

async function lintingExample() {
  console.log('🔍 Linting System Example');

  const linting = new LintingSystem();

  try {
    await linting.initialize();

    // Lint code
    const lintResult = await linting.lint(['src/**/*.ts']);
    console.log('📊 Lint Results:', {
      success: lintResult.success,
      files: lintResult.summary.files,
      errors: lintResult.summary.errors,
      warnings: lintResult.summary.warnings,
      fixable: lintResult.summary.fixable
    });

    // Format code
    const formatResult = await linting.format(['src/**/*.ts']);
    console.log('🎨 Format Results:', {
      success: formatResult.success,
      files: formatResult.summary.files,
      changed: formatResult.summary.changed,
      unchanged: formatResult.summary.unchanged
    });

  } catch (error) {
    console.error('❌ Linting error:', error);
  }
}

// ============================================================================
// ROUTING EXAMPLE
// ============================================================================

async function routingExample() {
  console.log('🛣️  Routing System Example');

  const router = new Router({
    mode: 'history',
    base: '/app'
  });

  try {
    await router.initialize();

    // Add routes
    router.addRoute({
      path: '/',
      component: { name: 'HomePage', render: () => console.log('Rendering HomePage') },
      middleware: [],
      guards: [],
      meta: { title: 'Home' },
      children: []
    });

    router.addRoute({
      path: '/about',
      component: { name: 'AboutPage', render: () => console.log('Rendering AboutPage') },
      middleware: [],
      guards: [],
      meta: { title: 'About' },
      children: []
    });

    // Navigate to routes
    await router.navigate('/');
    await router.navigate('/about');

    // Get router stats
    const stats = router.getStats();
    console.log('📊 Router Stats:', stats);

  } catch (error) {
    console.error('❌ Routing error:', error);
  }
}

// ============================================================================
// STATE MANAGEMENT EXAMPLE
// ============================================================================

async function stateExample() {
  console.log('🗃️  State Management Example');

  const state = new StateManager({
    initialState: {
      user: { name: 'John Doe', email: 'john@example.com' },
      counter: 0,
      todos: []
    }
  });

  try {
    await state.initialize();

    // Subscribe to state changes
    const unsubscribe = state.subscribe((newState, action) => {
      console.log('🔄 State changed:', action.type, newState);
    });

    // Update state
    state.setState('counter', 42);
    state.setState('user.name', 'Jane Doe');

    // Dispatch actions
    state.dispatch({ type: 'ADD_TODO', payload: { text: 'Learn Synapse Framework' } });
    state.dispatch({ type: 'INCREMENT_COUNTER' });

    // Get state
    const counter = state.getState<number>('counter');
    const userName = state.getState<string>('user.name');
    console.log('📊 Current State:', { counter, userName });

    // Get state stats
    const stats = state.getStats();
    console.log('📊 State Stats:', stats);

    // Unsubscribe
    unsubscribe();

  } catch (error) {
    console.error('❌ State management error:', error);
  }
}

// ============================================================================
// PLUGIN SYSTEM EXAMPLE
// ============================================================================

async function pluginExample() {
  console.log('🔌 Plugin System Example');

  const plugins = new PluginSystem();

  try {
    await plugins.initialize();

    // Define a plugin
    const myPlugin = {
      id: 'my-plugin',
      name: 'My Plugin',
      version: '1.0.0',
      dependencies: [],
      hooks: [],
      commands: [],
      middleware: [],
      components: []
    };

    // Load plugin
    await plugins.load(myPlugin);
    console.log('✅ Plugin loaded successfully!');

    // List plugins
    const pluginList = plugins.list();
    console.log('📋 Loaded Plugins:', pluginList.map(p => `${p.name}@${p.version}`));

    // Get plugin stats
    const stats = plugins.getStats();
    console.log('📊 Plugin Stats:', stats);

    // Unload plugin
    await plugins.unload('my-plugin');
    console.log('✅ Plugin unloaded successfully!');

  } catch (error) {
    console.error('❌ Plugin error:', error);
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function add(a: number, b: number): number {
  return a + b;
}

function concatenate(a: string, b: string): string {
  return a + b;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  try {
    await basicExample();
    await testingExample();
    await lintingExample();
    await routingExample();
    await stateExample();
    await pluginExample();
    
    console.log('🎉 All examples completed successfully!');
  } catch (error) {
    console.error('❌ Example error:', error);
    process.exit(1);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  main();
}

export { basicExample, testingExample, lintingExample, routingExample, stateExample, pluginExample };