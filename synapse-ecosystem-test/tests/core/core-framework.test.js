import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';

// Core Framework Tests
describe('Core Framework Packages', () => {
  let framework, compiler, testingFramework, lintingSystem, router, stateManager, pluginSystem;

  before(async () => {
    // Import core packages
    const { SynapseFramework } = await import('@snps/core');
    const { SynapseCompiler } = await import('@snps/compiler');
    const { SynapseTestingFramework } = await import('@snps/testing');
    const { SynapseLintingSystem } = await import('@snps/linting');
    const { SynapseRouter } = await import('@snps/router');
    const { SynapseStateManager } = await import('@snps/state');
    const { SynapsePluginSystem } = await import('@snps/plugins');

    // Initialize instances
    framework = new SynapseFramework({
      name: 'TestApp',
      version: '1.0.0',
      mode: 'test'
    });

    compiler = new SynapseCompiler({
      target: 'es2022',
      module: 'esnext',
      strict: true
    });

    testingFramework = new SynapseTestingFramework({
      coverageThreshold: 100,
      strictMode: true,
      testTimeout: 5000
    });

    lintingSystem = new SynapseLintingSystem({
      rules: 'all',
      strict: true,
      autoFix: true
    });

    router = new SynapseRouter({
      routes: [
        { path: '/', component: 'HomePage' },
        { path: '/test', component: 'TestPage' }
      ]
    });

    stateManager = new SynapseStateManager({
      initialState: { count: 0, user: null }
    });

    pluginSystem = new SynapsePluginSystem({
      plugins: [],
      autoLoad: false
    });
  });

  describe('@snps/core - SynapseFramework', () => {
    test('should initialize framework with correct name and version', () => {
      assert.strictEqual(framework.name, 'TestApp');
      assert.strictEqual(framework.version, '1.0.0');
      assert.strictEqual(framework.mode, 'test');
    });

    test('should have required methods', () => {
      assert(typeof framework.start === 'function');
      assert(typeof framework.stop === 'function');
      assert(typeof framework.getConfig === 'function');
    });

    test('should start and stop framework', async () => {
      await framework.start();
      assert(framework.isRunning === true);
      
      await framework.stop();
      assert(framework.isRunning === false);
    });
  });

  describe('@snps/compiler - SynapseCompiler', () => {
    test('should initialize compiler with correct config', () => {
      assert.strictEqual(compiler.target, 'es2022');
      assert.strictEqual(compiler.module, 'esnext');
      assert.strictEqual(compiler.strict, true);
    });

    test('should have required methods', () => {
      assert(typeof compiler.compile === 'function');
      assert(typeof compiler.watch === 'function');
      assert(typeof compiler.getConfig === 'function');
    });

    test('should compile TypeScript code', async () => {
      const tsCode = `
        interface User {
          name: string;
          age: number;
        }
        
        const user: User = { name: 'John', age: 30 };
        console.log(user.name);
      `;

      const result = await compiler.compile(tsCode);
      assert(result.success === true);
      assert(typeof result.output === 'string');
      assert(result.output.includes('user.name'));
    });
  });

  describe('@snps/testing - SynapseTestingFramework', () => {
    test('should initialize testing framework with correct config', () => {
      assert.strictEqual(testingFramework.coverageThreshold, 100);
      assert.strictEqual(testingFramework.strictMode, true);
      assert.strictEqual(testingFramework.testTimeout, 5000);
    });

    test('should have required methods', () => {
      assert(typeof testingFramework.runTest === 'function');
      assert(typeof testingFramework.runTests === 'function');
      assert(typeof testingFramework.getCoverage === 'function');
    });

    test('should run a simple test', async () => {
      const result = await testingFramework.runTest('Simple Test', async () => {
        const sum = 2 + 2;
        assert.strictEqual(sum, 4);
        return sum;
      });

      assert(result.passed === true);
      assert(result.duration > 0);
      assert(result.name === 'Simple Test');
    });

    test('should handle test failures', async () => {
      const result = await testingFramework.runTest('Failing Test', async () => {
        throw new Error('Test failure');
      });

      assert(result.passed === false);
      assert(result.error.message === 'Test failure');
    });
  });

  describe('@snps/linting - SynapseLintingSystem', () => {
    test('should initialize linting system with correct config', () => {
      assert.strictEqual(lintingSystem.rules, 'all');
      assert.strictEqual(lintingSystem.strict, true);
      assert.strictEqual(lintingSystem.autoFix, true);
    });

    test('should have required methods', () => {
      assert(typeof lintingSystem.lint === 'function');
      assert(typeof lintingSystem.fix === 'function');
      assert(typeof lintingSystem.getRules === 'function');
    });

    test('should lint JavaScript code', async () => {
      const jsCode = `
        function test() {
          var unused = 'this should trigger a linting error';
          console.log('Hello World');
          return true;
        }
      `;

      const result = await lintingSystem.lint(jsCode);
      assert(Array.isArray(result.errors));
      assert(Array.isArray(result.warnings));
      assert(result.errors.length > 0); // Should have unused variable error
    });

    test('should fix auto-fixable issues', async () => {
      const jsCode = `
        function test() {
          var unused = 'this should trigger a linting error';
          console.log('Hello World');
          return true;
        }
      `;

      const result = await lintingSystem.fix(jsCode);
      assert(result.fixed === true);
      assert(typeof result.output === 'string');
    });
  });

  describe('@snps/router - SynapseRouter', () => {
    test('should initialize router with correct routes', () => {
      assert(Array.isArray(router.routes));
      assert(router.routes.length === 2);
      assert(router.routes[0].path === '/');
      assert(router.routes[1].path === '/test');
    });

    test('should have required methods', () => {
      assert(typeof router.navigate === 'function');
      assert(typeof router.getCurrentRoute === 'function');
      assert(typeof router.addRoute === 'function');
    });

    test('should navigate to routes', () => {
      router.navigate('/');
      assert(router.getCurrentRoute().path === '/');
      
      router.navigate('/test');
      assert(router.getCurrentRoute().path === '/test');
    });

    test('should add new routes', () => {
      router.addRoute({ path: '/new', component: 'NewPage' });
      assert(router.routes.length === 3);
      assert(router.routes[2].path === '/new');
    });
  });

  describe('@snps/state - SynapseStateManager', () => {
    test('should initialize state manager with correct initial state', () => {
      assert.strictEqual(stateManager.getState('count'), 0);
      assert.strictEqual(stateManager.getState('user'), null);
    });

    test('should have required methods', () => {
      assert(typeof stateManager.setState === 'function');
      assert(typeof stateManager.getState === 'function');
      assert(typeof stateManager.subscribe === 'function');
      assert(typeof stateManager.unsubscribe === 'function');
    });

    test('should set and get state', () => {
      stateManager.setState('count', 5);
      assert.strictEqual(stateManager.getState('count'), 5);
      
      stateManager.setState('user', { name: 'John', age: 30 });
      const user = stateManager.getState('user');
      assert.strictEqual(user.name, 'John');
      assert.strictEqual(user.age, 30);
    });

    test('should notify subscribers of state changes', (done) => {
      stateManager.subscribe('count', (newCount) => {
        assert.strictEqual(newCount, 10);
        done();
      });
      
      stateManager.setState('count', 10);
    });
  });

  describe('@snps/plugins - SynapsePluginSystem', () => {
    test('should initialize plugin system with correct config', () => {
      assert(Array.isArray(pluginSystem.plugins));
      assert.strictEqual(pluginSystem.autoLoad, false);
    });

    test('should have required methods', () => {
      assert(typeof pluginSystem.loadPlugin === 'function');
      assert(typeof pluginSystem.unloadPlugin === 'function');
      assert(typeof pluginSystem.getPlugins === 'function');
    });

    test('should load and unload plugins', () => {
      const plugin = {
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
        install: () => {},
        uninstall: () => {}
      };

      pluginSystem.loadPlugin(plugin);
      assert(pluginSystem.getPlugins().length === 1);
      assert(pluginSystem.getPlugins()[0].id === 'test-plugin');

      pluginSystem.unloadPlugin('test-plugin');
      assert(pluginSystem.getPlugins().length === 0);
    });
  });
});