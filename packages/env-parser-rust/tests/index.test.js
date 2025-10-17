import { describe, it } from 'node:test';
import assert from 'node:assert';
import { EnvParser } from '../index.js';
import { writeFileSync, unlinkSync } from 'node:fs';

describe('EnvParser Rust', () => {
  it('should parse environment content', () => {
    const content = `
# This is a comment
FOO=bar
BAZ="quoted value"
EMPTY=
MULTILINE="line1\\nline2"
    `;
    
    const result = EnvParser.parse(content);
    
    assert.strictEqual(result.FOO, 'bar');
    assert.strictEqual(result.BAZ, 'quoted value');
    assert.strictEqual(result.EMPTY, '');
    assert.strictEqual(result.MULTILINE, 'line1\\nline2');
  });

  it('should load .env file', () => {
    const testEnv = '.env.test';
    const content = 'TEST_VAR=test_value';
    
    writeFileSync(testEnv, content);
    
    try {
      const result = EnvParser.load(testEnv);
      assert.strictEqual(result.TEST_VAR, 'test_value');
    } finally {
      unlinkSync(testEnv);
    }
  });

  it('should validate schema', () => {
    const schema = {
      PORT: {
        validator_type: 'number',
        required: true,
        min: 1,
        max: 65535
      },
      DATABASE_URL: {
        validator_type: 'url',
        required: true
      },
      DEBUG: {
        validator_type: 'boolean',
        required: false,
        default_value: false
      }
    };

    // Set test environment variables
    process.env.PORT = '8080';
    process.env.DATABASE_URL = 'https://example.com';
    process.env.DEBUG = 'true';

    const result = EnvParser.validate(schema);
    
    assert.strictEqual(result.valid, true);
    assert.strictEqual(result.data.PORT, 8080);
    assert.strictEqual(result.data.DATABASE_URL, 'https://example.com');
    assert.strictEqual(result.data.DEBUG, true);
  });

  it('should handle validation errors', () => {
    const schema = {
      INVALID_PORT: {
        validator_type: 'number',
        required: true,
        min: 1,
        max: 100
      }
    };

    process.env.INVALID_PORT = '999';

    const result = EnvParser.validate(schema);
    
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.length > 0);
  });

  it('should expand variables', () => {
    const content = `
BASE_URL=https://api.example.com
API_URL=${BASE_URL}/v1
    `;
    
    const result = EnvParser.parse(content);
    
    assert.strictEqual(result.BASE_URL, 'https://api.example.com');
    assert.strictEqual(result.API_URL, 'https://api.example.com/v1');
  });
});