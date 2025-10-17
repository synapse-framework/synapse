import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CommitLinter, lintCommitMessage } from '../index.js';

describe('CommitLinter Rust', () => {
  it('should create CommitLinter instance', () => {
    const linter = new CommitLinter();
    assert.ok(linter);
  });

  it('should validate good commit message', () => {
    const linter = new CommitLinter();
    const result = linter.lint('feat: add new feature');
    
    assert.strictEqual(result.valid, true);
    assert.strictEqual(result.errors.length, 0);
    assert.strictEqual(result.score, 100);
  });

  it('should reject invalid commit message', () => {
    const linter = new CommitLinter();
    const result = linter.lint('invalid commit message');
    
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.length > 0);
  });

  it('should warn about long subject', () => {
    const linter = new CommitLinter();
    const result = linter.lint('feat: this is a very long commit message that exceeds the recommended length');
    
    assert.strictEqual(result.valid, true);
    assert.ok(result.warnings.length > 0);
  });

  it('should reject invalid type', () => {
    const linter = new CommitLinter();
    const result = linter.lint('invalid: add new feature');
    
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some(error => error.includes('Invalid type')));
  });

  it('should reject uppercase subject', () => {
    const linter = new CommitLinter();
    const result = linter.lint('feat: Add new feature');
    
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some(error => error.includes('lowercase')));
  });

  it('should reject subject ending with period', () => {
    const linter = new CommitLinter();
    const result = linter.lint('feat: add new feature.');
    
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some(error => error.includes('period')));
  });

  it('should handle commit with body', () => {
    const linter = new CommitLinter();
    const commitMessage = `feat: add new feature

This is a detailed description of the feature.
It can span multiple lines.

Closes: #123`;
    
    const result = linter.lint(commitMessage);
    
    assert.strictEqual(result.valid, true);
  });

  it('should warn about missing empty line before body', () => {
    const linter = new CommitLinter();
    const commitMessage = `feat: add new feature
This is a body without empty line`;
    
    const result = linter.lint(commitMessage);
    
    assert.strictEqual(result.valid, true);
    assert.ok(result.warnings.some(warning => warning.includes('empty line')));
  });

  it('should validate breaking change footer', () => {
    const linter = new CommitLinter();
    const commitMessage = `feat: add new feature

BREAKING CHANGE: This is a breaking change`;
    
    const result = linter.lint(commitMessage);
    
    assert.strictEqual(result.valid, true);
  });

  it('should warn about short breaking change', () => {
    const linter = new CommitLinter();
    const commitMessage = `feat: add new feature

BREAKING CHANGE: short`;
    
    const result = linter.lint(commitMessage);
    
    assert.strictEqual(result.valid, true);
    assert.ok(result.warnings.some(warning => warning.includes('detailed')));
  });

  it('should handle CLI function', () => {
    // Test the CLI function
    try {
      lintCommitMessage('feat: add new feature');
      // Should not throw
    } catch (error) {
      assert.fail('Should not throw for valid commit message');
    }
  });

  it('should throw for invalid commit in CLI', () => {
    try {
      lintCommitMessage('invalid commit message');
      assert.fail('Should have thrown for invalid commit message');
    } catch (error) {
      assert.ok(error.message);
    }
  });
});