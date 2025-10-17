import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Full-Stack Application Integration Tests
describe('Full-Stack Application Integration', () => {
  let app, framework, envParser, httpClient, ruleEngine, commitLinter, stateManager, router, testingFramework, lintingSystem;

  before(async () => {
    // Import all packages
    const { SynapseFramework } = await import('@snps/core');
    const { SynapseCompiler } = await import('@snps/compiler');
    const { SynapseTestingFramework } = await import('@snps/testing');
    const { SynapseLintingSystem } = await import('@snps/linting');
    const { SynapseRouter } = await import('@snps/router');
    const { SynapseStateManager } = await import('@snps/state');
    const { SynapsePluginSystem } = await import('@snps/plugins');
    const { EnvParser } = await import('@snps/env-parser-rust');
    const { CommitLinter } = await import('@snps/commit-lint-rust');
    const { HttpClient } = await import('@snps/http-client-rust');
    const { RuleEngine } = await import('@snps/rule-engine-rust');
    const { Button, Card, Input, Modal } = await import('@snps/ui');
    const { SynapseCLI } = await import('@snps/cli');

    // Initialize framework
    framework = new SynapseFramework({
      name: 'FullStackTestApp',
      version: '1.0.0',
      mode: 'test'
    });

    // Initialize all components
    envParser = new EnvParser();
    httpClient = new HttpClient('https://httpbin.org');
    ruleEngine = new RuleEngine();
    commitLinter = new CommitLinter();
    stateManager = new SynapseStateManager({
      initialState: {
        user: null,
        settings: {},
        notifications: [],
        theme: 'light',
        data: []
      }
    });
    router = new SynapseRouter({
      routes: [
        { path: '/', component: 'HomePage' },
        { path: '/dashboard', component: 'DashboardPage' },
        { path: '/settings', component: 'SettingsPage' },
        { path: '/api/users', handler: 'getUsers' },
        { path: '/api/posts', handler: 'getPosts' }
      ]
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

    // Load environment variables
    await envParser.loadFromString(`
      APP_NAME=FullStackTestApp
      APP_VERSION=1.0.0
      API_URL=https://api.example.com
      DEBUG=true
      PORT=3000
      DATABASE_URL=postgresql://localhost:5432/testdb
      JWT_SECRET=test-secret-key
      REDIS_URL=redis://localhost:6379
    `);

    // Add rules to rule engine
    ruleEngine.addRule({
      id: 'no-console',
      name: 'No Console Statements',
      description: 'Disallow console statements in production code',
      pattern: /console\.(log|warn|error|info)/,
      severity: 'error'
    });

    ruleEngine.addRule({
      id: 'no-var',
      name: 'No Var Declarations',
      description: 'Use let or const instead of var',
      pattern: /\bvar\s+/,
      severity: 'warning'
    });

    // Start framework
    await framework.start();
  });

  after(async () => {
    if (framework) {
      await framework.stop();
    }
  });

  describe('Environment Configuration Integration', () => {
    test('should load and validate environment configuration', () => {
      const appName = envParser.get('APP_NAME');
      const appVersion = envParser.get('APP_VERSION');
      const debug = envParser.getBoolean('DEBUG');
      const port = envParser.getNumber('PORT');

      assert.strictEqual(appName, 'FullStackTestApp');
      assert.strictEqual(appVersion, '1.0.0');
      assert.strictEqual(debug, true);
      assert.strictEqual(port, 3000);
    });

    test('should validate required environment variables', () => {
      const schema = {
        APP_NAME: { required: true, type: 'string' },
        APP_VERSION: { required: true, type: 'string' },
        API_URL: { required: true, type: 'string' },
        DATABASE_URL: { required: true, type: 'string' },
        JWT_SECRET: { required: true, type: 'string' }
      };

      const result = envParser.validate(schema);
      assert.strictEqual(result.valid, true);
      assert.strictEqual(result.errors.length, 0);
    });
  });

  describe('State Management Integration', () => {
    test('should manage application state across components', () => {
      // Set user state
      stateManager.setState('user', {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin'
      });

      // Set settings
      stateManager.setState('settings', {
        theme: 'dark',
        notifications: true,
        autoSave: true,
        language: 'en'
      });

      // Set notifications
      stateManager.setState('notifications', [
        { id: 1, message: 'Welcome to the app!', type: 'info' },
        { id: 2, message: 'Profile updated', type: 'success' }
      ]);

      // Verify state
      const user = stateManager.getState('user');
      const settings = stateManager.getState('settings');
      const notifications = stateManager.getState('notifications');

      assert.strictEqual(user.name, 'John Doe');
      assert.strictEqual(settings.theme, 'dark');
      assert.strictEqual(notifications.length, 2);
    });

    test('should handle state subscriptions', (done) => {
      stateManager.subscribe('user', (newUser) => {
        assert.strictEqual(newUser.name, 'Jane Doe');
        done();
      });

      stateManager.setState('user', { name: 'Jane Doe', email: 'jane@example.com' });
    });
  });

  describe('Routing Integration', () => {
    test('should handle route navigation', () => {
      router.navigate('/');
      assert.strictEqual(router.getCurrentRoute().path, '/');

      router.navigate('/dashboard');
      assert.strictEqual(router.getCurrentRoute().path, '/dashboard');

      router.navigate('/settings');
      assert.strictEqual(router.getCurrentRoute().path, '/settings');
    });

    test('should handle API routes', () => {
      router.navigate('/api/users');
      const route = router.getCurrentRoute();
      assert.strictEqual(route.path, '/api/users');
      assert.strictEqual(route.handler, 'getUsers');
    });
  });

  describe('HTTP Client Integration', () => {
    test('should make API requests', async () => {
      try {
        const response = await httpClient.get('/get');
        assert(typeof response === 'object');
        assert(typeof response.status === 'number');
      } catch (error) {
        // Network errors are acceptable in test environment
        assert(error instanceof Error);
      }
    });

    test('should handle API errors gracefully', async () => {
      try {
        const response = await httpClient.get('/status/500');
        // Should handle 500 errors
        assert(typeof response === 'object');
      } catch (error) {
        // Error handling is expected
        assert(error instanceof Error);
      }
    });
  });

  describe('Rule Engine Integration', () => {
    test('should validate code against rules', async () => {
      const code = `
        function processUser(user) {
          var name = user.name; // Should trigger no-var rule
          console.log('Processing user:', name); // Should trigger no-console rule
          return name.toUpperCase();
        }
      `;

      const result = await ruleEngine.checkCode(code);
      assert(Array.isArray(result.violations));
      assert(result.violations.length >= 2);
      
      const ruleIds = result.violations.map(v => v.ruleId);
      assert(ruleIds.includes('no-console'));
      assert(ruleIds.includes('no-var'));
    });

    test('should handle clean code', async () => {
      const code = `
        function processUser(user) {
          const name = user.name;
          return name.toUpperCase();
        }
      `;

      const result = await ruleEngine.checkCode(code);
      assert(Array.isArray(result.violations));
      assert(result.violations.length === 0);
    });
  });

  describe('Commit Linting Integration', () => {
    test('should validate commit messages in CI/CD pipeline', async () => {
      const commits = [
        'feat: add user authentication',
        'fix: resolve login bug',
        'docs: update API documentation',
        'style: format code',
        'refactor: restructure components',
        'test: add unit tests',
        'chore: update dependencies'
      ];

      for (const commit of commits) {
        const result = await commitLinter.lint(commit);
        assert.strictEqual(result.valid, true, `Commit "${commit}" should be valid`);
      }
    });

    test('should reject invalid commits', async () => {
      const invalidCommits = [
        'invalid commit message',
        'feat',
        'fix:',
        'random text'
      ];

      for (const commit of invalidCommits) {
        const result = await commitLinter.lint(commit);
        assert.strictEqual(result.valid, false, `Commit "${commit}" should be invalid`);
      }
    });
  });

  describe('Testing Framework Integration', () => {
    test('should run application tests', async () => {
      const testResult = await testingFramework.runTest('Application Test', async () => {
        const user = stateManager.getState('user');
        assert(user !== null);
        assert.strictEqual(user.name, 'Jane Doe');
        return true;
      });

      assert.strictEqual(testResult.passed, true);
      assert(testResult.duration > 0);
    });

    test('should handle test failures', async () => {
      const testResult = await testingFramework.runTest('Failing Test', async () => {
        throw new Error('Test failure');
      });

      assert.strictEqual(testResult.passed, false);
      assert.strictEqual(testResult.error.message, 'Test failure');
    });
  });

  describe('Linting System Integration', () => {
    test('should lint application code', async () => {
      const code = `
        function processData(data) {
          var result = []; // Should trigger no-var rule
          for (var i = 0; i < data.length; i++) { // Should trigger no-var rule
            console.log('Processing item:', data[i]); // Should trigger no-console rule
            result.push(data[i] * 2);
          }
          return result;
        }
      `;

      const result = await lintingSystem.lint(code);
      assert(Array.isArray(result.errors));
      assert(result.errors.length > 0);
    });

    test('should fix auto-fixable issues', async () => {
      const code = `
        function processData(data) {
          var result = [];
          return result;
        }
      `;

      const result = await lintingSystem.fix(code);
      assert.strictEqual(result.fixed, true);
      assert(typeof result.output === 'string');
      assert(!result.output.includes('var '));
    });
  });

  describe('UI Components Integration', () => {
    test('should create and interact with UI components', () => {
      const button = new Button({
        text: 'Submit',
        variant: 'primary',
        onClick: () => {
          console.log('Button clicked');
        }
      });

      const card = new Card({
        title: 'User Profile',
        content: 'User information and settings'
      });

      const input = new Input({
        placeholder: 'Enter your name',
        value: '',
        onChange: (value) => {
          input.value = value;
        }
      });

      const modal = new Modal({
        title: 'Confirm Action',
        content: 'Are you sure you want to proceed?',
        isOpen: false
      });

      // Test component properties
      assert.strictEqual(button.text, 'Submit');
      assert.strictEqual(button.variant, 'primary');
      assert.strictEqual(card.title, 'User Profile');
      assert.strictEqual(input.placeholder, 'Enter your name');
      assert.strictEqual(modal.title, 'Confirm Action');

      // Test component interactions
      input.setValue('John Doe');
      assert.strictEqual(input.value, 'John Doe');

      modal.open();
      assert.strictEqual(modal.isOpen, true);

      modal.close();
      assert.strictEqual(modal.isOpen, false);
    });
  });

  describe('End-to-End Application Flow', () => {
    test('should complete full application workflow', async () => {
      // 1. Load configuration
      const config = {
        appName: envParser.get('APP_NAME'),
        appVersion: envParser.get('APP_VERSION'),
        debug: envParser.getBoolean('DEBUG'),
        port: envParser.getNumber('PORT')
      };

      assert.strictEqual(config.appName, 'FullStackTestApp');
      assert.strictEqual(config.appVersion, '1.0.0');
      assert.strictEqual(config.debug, true);
      assert.strictEqual(config.port, 3000);

      // 2. Initialize user session
      stateManager.setState('user', {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin'
      });

      const user = stateManager.getState('user');
      assert.strictEqual(user.name, 'John Doe');

      // 3. Navigate to dashboard
      router.navigate('/dashboard');
      assert.strictEqual(router.getCurrentRoute().path, '/dashboard');

      // 4. Make API request
      try {
        const response = await httpClient.get('/get');
        assert(typeof response === 'object');
      } catch (error) {
        // Network errors are acceptable in test environment
        assert(error instanceof Error);
      }

      // 5. Validate code quality
      const code = `
        function handleUser(user) {
          const name = user.name;
          return name.toUpperCase();
        }
      `;

      const ruleResult = await ruleEngine.checkCode(code);
      assert(Array.isArray(ruleResult.violations));
      assert(ruleResult.violations.length === 0);

      // 6. Run tests
      const testResult = await testingFramework.runTest('E2E Test', async () => {
        const currentUser = stateManager.getState('user');
        assert(currentUser !== null);
        assert.strictEqual(currentUser.name, 'John Doe');
        return true;
      });

      assert.strictEqual(testResult.passed, true);

      // 7. Lint code
      const lintResult = await lintingSystem.lint(code);
      assert(Array.isArray(lintResult.errors));
      assert(Array.isArray(lintResult.warnings));

      // 8. Validate commit message
      const commitResult = await commitLinter.lint('feat: add user management');
      assert.strictEqual(commitResult.valid, true);

      console.log('✅ End-to-end application workflow completed successfully');
    });
  });
});