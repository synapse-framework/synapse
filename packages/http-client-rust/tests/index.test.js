import { describe, it } from 'node:test';
import assert from 'node:assert';
import { HttpClient } from '../index.js';

describe('HttpClient Rust', () => {
  it('should create HttpClient instance', () => {
    const client = new HttpClient('https://httpbin.org');
    assert.ok(client);
  });

  it('should make GET request', async () => {
    const client = new HttpClient('https://httpbin.org');
    const response = await client.get('/get');
    
    assert.strictEqual(response.status, 200);
    assert.ok(response.data);
    assert.ok(response.headers);
  });

  it('should make POST request', async () => {
    const client = new HttpClient('https://httpbin.org');
    const response = await client.post('/post', { test: 'data' });
    
    assert.strictEqual(response.status, 200);
    assert.ok(response.data);
  });

  it('should handle custom headers', async () => {
    const client = new HttpClient('https://httpbin.org');
    const response = await client.get('/headers', {
      headers: { 'X-Custom-Header': 'test-value' }
    });
    
    assert.strictEqual(response.status, 200);
    assert.ok(response.data);
  });

  it('should handle errors gracefully', async () => {
    const client = new HttpClient('https://invalid-domain-that-does-not-exist.com');
    
    try {
      await client.get('/test');
      assert.fail('Should have thrown an error');
    } catch (error) {
      assert.ok(error.message);
    }
  });
});