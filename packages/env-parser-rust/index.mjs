/* ES Module wrapper for @snps/env-parser-rust */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import the CommonJS module
const { EnvParser: EnvParserClass, ValidationResult, Validator } = require('./index.js');

// Create a wrapper class that provides the expected interface
class EnvParser {
  constructor() {
    // Initialize with empty data
    this.env_vars = new Map();
  }

  loadFromFile(filePath) {
    const result = EnvParserClass.load(filePath);
    this.env_vars = new Map(Object.entries(result));
  }

  loadFromString(content) {
    const result = EnvParserClass.parse(content);
    this.env_vars = new Map(Object.entries(result));
  }

  get(key, defaultValue) {
    return this.env_vars.get(key) || defaultValue || '';
  }

  getNumber(key, defaultValue) {
    const value = this.env_vars.get(key);
    if (value === undefined) return defaultValue || 0;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? (defaultValue || 0) : parsed;
  }

  getBoolean(key, defaultValue) {
    const value = this.env_vars.get(key);
    if (value === undefined) return defaultValue || false;
    const lower = value.toLowerCase();
    return ['true', '1', 'yes', 'on'].includes(lower);
  }

  getArray(key, separator = ',') {
    const value = this.env_vars.get(key);
    if (!value) return [];
    return value.split(separator).map(s => s.trim());
  }

  has(key) {
    return this.env_vars.has(key);
  }

  all() {
    return Object.fromEntries(this.env_vars);
  }

  validate(schema) {
    // Convert Map to object for validation
    const envObj = Object.fromEntries(this.env_vars);
    return EnvParserClass.validate(JSON.stringify(schema), envObj);
  }

  // Static methods
  static load(path) {
    return EnvParserClass.load(path);
  }

  static parse(content) {
    return EnvParserClass.parse(content);
  }
}

// Re-export as ES modules
export { EnvParser, ValidationResult, Validator };
export default { EnvParser, ValidationResult, Validator };
