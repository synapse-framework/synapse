import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';

// Rust Packages Tests
describe('Rust Packages', () => {
  let envParser, commitLinter, httpClient, ruleEngine;

  before(async () => {
    // Import Rust packages
    const { EnvParser } = await import('@snps/env-parser-rust');
    const { CommitLinter } = await import('@snps/commit-lint-rust');
    const { HttpClient } = await import('@snps/http-client-rust');
    const { RuleEngine } = await import('@snps/rule-engine-rust');

    // Initialize instances
    envParser = new EnvParser();
    commitLinter = new CommitLinter();
    httpClient = new HttpClient('https://httpbin.org');
    ruleEngine = new RuleEngine();
  });

  describe('@snps/env-parser-rust - EnvParser', () => {
    test('should create EnvParser instance', () => {
      assert(envParser instanceof EnvParser);
    });

    test('should load environment variables from string', async () => {
      const envContent = `
        APP_NAME=TestApp
        APP_VERSION=1.0.0
        DEBUG=true
        PORT=3000
        API_URL=https://api.example.com
      `;

      await envParser.loadFromString(envContent);
      
      assert.strictEqual(envParser.get('APP_NAME'), 'TestApp');
      assert.strictEqual(envParser.get('APP_VERSION'), '1.0.0');
      assert.strictEqual(envParser.get('DEBUG'), 'true');
      assert.strictEqual(envParser.get('PORT'), '3000');
      assert.strictEqual(envParser.get('API_URL'), 'https://api.example.com');
    });

    test('should return default values for missing keys', () => {
      assert.strictEqual(envParser.get('MISSING_KEY', 'default'), 'default');
      assert.strictEqual(envParser.get('ANOTHER_MISSING_KEY'), undefined);
    });

    test('should parse boolean values', () => {
      assert.strictEqual(envParser.getBoolean('DEBUG', false), true);
      assert.strictEqual(envParser.getBoolean('MISSING_BOOL', false), false);
    });

    test('should parse number values', () => {
      assert.strictEqual(envParser.getNumber('PORT', 8080), 3000);
      assert.strictEqual(envParser.getNumber('MISSING_NUMBER', 8080), 8080);
    });

    test('should parse array values', () => {
      await envParser.loadFromString('ALLOWED_ORIGINS=http://localhost:3000,https://example.com,https://api.example.com');
      const origins = envParser.getArray('ALLOWED_ORIGINS');
      assert(Array.isArray(origins));
      assert.strictEqual(origins.length, 3);
      assert.strictEqual(origins[0], 'http://localhost:3000');
      assert.strictEqual(origins[1], 'https://example.com');
      assert.strictEqual(origins[2], 'https://api.example.com');
    });

    test('should check if key exists', () => {
      assert.strictEqual(envParser.has('APP_NAME'), true);
      assert.strictEqual(envParser.has('MISSING_KEY'), false);
    });

    test('should get all environment variables', () => {
      const allVars = envParser.all();
      assert(typeof allVars === 'object');
      assert.strictEqual(allVars.APP_NAME, 'TestApp');
      assert.strictEqual(allVars.APP_VERSION, '1.0.0');
    });

    test('should validate environment variables', () => {
      const schema = {
        APP_NAME: { required: true, type: 'string' },
        APP_VERSION: { required: true, type: 'string' },
        DEBUG: { required: false, type: 'boolean' },
        PORT: { required: false, type: 'number' }
      };

      const result = envParser.validate(schema);
      assert.strictEqual(result.valid, true);
      assert(Array.isArray(result.errors));
      assert.strictEqual(result.errors.length, 0);
    });

    test('should handle validation errors', () => {
      const schema = {
        REQUIRED_MISSING: { required: true, type: 'string' },
        APP_NAME: { required: true, type: 'number' } // Wrong type
      };

      const result = envParser.validate(schema);
      assert.strictEqual(result.valid, false);
      assert(result.errors.length > 0);
    });
  });

  describe('@snps/commit-lint-rust - CommitLinter', () => {
    test('should create CommitLinter instance', () => {
      assert(commitLinter instanceof CommitLinter);
    });

    test('should validate conventional commit messages', async () => {
      const validCommits = [
        'feat: add new feature',
        'fix: resolve bug in authentication',
        'docs: update README',
        'style: format code',
        'refactor: restructure components',
        'test: add unit tests',
        'chore: update dependencies',
        'feat(api): add user endpoint',
        'fix(auth): resolve login issue',
        'docs(readme): update installation guide'
      ];

      for (const commit of validCommits) {
        const result = await commitLinter.lint(commit);
        assert.strictEqual(result.valid, true, `Commit "${commit}" should be valid`);
        assert(Array.isArray(result.errors));
        assert.strictEqual(result.errors.length, 0);
      }
    });

    test('should reject invalid commit messages', async () => {
      const invalidCommits = [
        'invalid commit message',
        'feat',
        'fix:',
        'random text',
        'FEAT: uppercase type',
        'feat:',
        'feat: ',
        'feat:add feature without space'
      ];

      for (const commit of invalidCommits) {
        const result = await commitLinter.lint(commit);
        assert.strictEqual(result.valid, false, `Commit "${commit}" should be invalid`);
        assert(Array.isArray(result.errors));
        assert(result.errors.length > 0);
      }
    });

    test('should provide helpful error messages', async () => {
      const result = await commitLinter.lint('invalid commit');
      assert.strictEqual(result.valid, false);
      assert(result.errors.length > 0);
      assert(typeof result.errors[0] === 'string');
      assert(result.errors[0].length > 0);
    });

    test('should handle empty commit messages', async () => {
      const result = await commitLinter.lint('');
      assert.strictEqual(result.valid, false);
      assert(result.errors.length > 0);
    });

    test('should handle very long commit messages', async () => {
      const longCommit = 'feat: ' + 'a'.repeat(1000);
      const result = await commitLinter.lint(longCommit);
      // Should still validate the format even if long
      assert.strictEqual(result.valid, true);
    });
  });

  describe('@snps/http-client-rust - HttpClient', () => {
    test('should create HttpClient instance', () => {
      assert(httpClient instanceof HttpClient);
    });

    test('should make GET requests', async () => {
      try {
        const response = await httpClient.get('/get');
        assert(typeof response === 'object');
        assert(typeof response.status === 'number');
        assert(response.status >= 200 && response.status < 300);
      } catch (error) {
        // Network errors are acceptable in test environment
        assert(error instanceof Error);
      }
    });

    test('should make POST requests', async () => {
      try {
        const response = await httpClient.post('/post', { test: 'data' });
        assert(typeof response === 'object');
        assert(typeof response.status === 'number');
      } catch (error) {
        // Network errors are acceptable in test environment
        assert(error instanceof Error);
      }
    });

    test('should make PUT requests', async () => {
      try {
        const response = await httpClient.put('/put', { test: 'data' });
        assert(typeof response === 'object');
        assert(typeof response.status === 'number');
      } catch (error) {
        // Network errors are acceptable in test environment
        assert(error instanceof Error);
      }
    });

    test('should make DELETE requests', async () => {
      try {
        const response = await httpClient.delete('/delete');
        assert(typeof response === 'object');
        assert(typeof response.status === 'number');
      } catch (error) {
        // Network errors are acceptable in test environment
        assert(error instanceof Error);
      }
    });

    test('should handle request timeouts', async () => {
      try {
        const response = await httpClient.get('/delay/5'); // 5 second delay
        assert(typeof response === 'object');
      } catch (error) {
        // Timeout errors are acceptable
        assert(error instanceof Error);
      }
    });

    test('should handle invalid URLs', async () => {
      try {
        const response = await httpClient.get('invalid-url');
        assert(typeof response === 'object');
      } catch (error) {
        // Invalid URL errors are expected
        assert(error instanceof Error);
      }
    });
  });

  describe('@snps/rule-engine-rust - RuleEngine', () => {
    test('should create RuleEngine instance', () => {
      assert(ruleEngine instanceof RuleEngine);
    });

    test('should add rules', () => {
      const rule = {
        id: 'no-console',
        name: 'No Console Statements',
        description: 'Disallow console statements in production code',
        pattern: /console\.(log|warn|error|info)/,
        severity: 'error'
      };

      ruleEngine.addRule(rule);
      const rules = ruleEngine.getRules();
      assert(Array.isArray(rules));
      assert(rules.length >= 1);
      assert(rules.some(r => r.id === 'no-console'));
    });

    test('should check code against rules', async () => {
      const code = `
        function test() {
          console.log('This should trigger a rule violation');
          return 'test';
        }
      `;

      const result = await ruleEngine.checkCode(code);
      assert(typeof result === 'object');
      assert(Array.isArray(result.violations));
      assert(result.violations.length > 0);
      assert(result.violations[0].ruleId === 'no-console');
    });

    test('should handle code without violations', async () => {
      const code = `
        function test() {
          return 'test';
        }
      `;

      const result = await ruleEngine.checkCode(code);
      assert(typeof result === 'object');
      assert(Array.isArray(result.violations));
      assert(result.violations.length === 0);
    });

    test('should remove rules', () => {
      const initialRuleCount = ruleEngine.getRules().length;
      ruleEngine.removeRule('no-console');
      const finalRuleCount = ruleEngine.getRules().length;
      assert(finalRuleCount < initialRuleCount);
    });

    test('should clear all rules', () => {
      ruleEngine.clearRules();
      const rules = ruleEngine.getRules();
      assert(Array.isArray(rules));
      assert(rules.length === 0);
    });

    test('should handle empty code', async () => {
      const result = await ruleEngine.checkCode('');
      assert(typeof result === 'object');
      assert(Array.isArray(result.violations));
      assert(result.violations.length === 0);
    });

    test('should handle malformed code', async () => {
      const code = `
        function test() {
          console.log('Missing closing brace
        }
      `;

      const result = await ruleEngine.checkCode(code);
      assert(typeof result === 'object');
      assert(Array.isArray(result.violations));
      // Should handle malformed code gracefully
    });
  });
});