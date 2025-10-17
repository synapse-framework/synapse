import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

export class EnvParser {
  static load(path: string = '.env'): Record<string, string> {
    const fullPath = resolve(process.cwd(), path);
    
    if (!existsSync(fullPath)) {
      return {};
    }
    
    const content = readFileSync(fullPath, 'utf-8');
    return this.parse(content);
  }

  static loadSync(path: string = '.env'): Record<string, string> {
    return this.load(path);
  }

  static parse(content: string): Record<string, string> {
    const env: Record<string, string> = {};
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }
      
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        let value = valueParts.join('=');
        
        // Remove quotes
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        // Variable expansion
        value = this.expandVariables(value, env);
        
        env[key.trim()] = value;
      }
    }
    
    return env;
  }

  static validate(schema: Record<string, Validator>): ValidationResult {
    const errors: string[] = [];
    const data: Record<string, any> = {};
    
    for (const [key, validator] of Object.entries(schema)) {
      const value = process.env[key];
      
      if (validator.required && (value === undefined || value === '')) {
        errors.push(`Required environment variable '${key}' is missing`);
        continue;
      }
      
      if (value === undefined || value === '') {
        if (validator.default !== undefined) {
          data[key] = validator.default;
        }
        continue;
      }
      
      const validationResult = this.validateValue(value, validator);
      if (!validationResult.valid) {
        errors.push(...validationResult.errors);
        continue;
      }
      
      data[key] = validationResult.value;
    }
    
    return {
      valid: errors.length === 0,
      errors,
      data,
    };
  }

  private static expandVariables(value: string, env: Record<string, string>): string {
    return value.replace(/\$\{([^}]+)\}/g, (match, varName) => {
      return env[varName] || process.env[varName] || match;
    });
  }

  private static validateValue(value: string, validator: Validator): ValueValidationResult {
    const errors: string[] = [];
    let parsedValue: any = value;

    switch (validator.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push(`Value must be a string`);
        } else {
          if (validator.min !== undefined && value.length < validator.min) {
            errors.push(`String must be at least ${validator.min} characters long`);
          }
          if (validator.max !== undefined && value.length > validator.max) {
            errors.push(`String must be at most ${validator.max} characters long`);
          }
          if (validator.pattern && !validator.pattern.test(value)) {
            errors.push(`String does not match required pattern`);
          }
        }
        break;

      case 'number':
        parsedValue = Number(value);
        if (isNaN(parsedValue)) {
          errors.push(`Value must be a valid number`);
        } else {
          if (validator.min !== undefined && parsedValue < validator.min) {
            errors.push(`Number must be at least ${validator.min}`);
          }
          if (validator.max !== undefined && parsedValue > validator.max) {
            errors.push(`Number must be at most ${validator.max}`);
          }
        }
        break;

      case 'boolean':
        if (value.toLowerCase() === 'true' || value === '1') {
          parsedValue = true;
        } else if (value.toLowerCase() === 'false' || value === '0') {
          parsedValue = false;
        } else {
          errors.push(`Value must be a boolean (true/false, 1/0)`);
        }
        break;

      case 'url':
        try {
          new URL(value);
        } catch {
          errors.push(`Value must be a valid URL`);
        }
        break;

      default:
        errors.push(`Unknown validator type: ${validator.type}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      value: parsedValue,
    };
  }
}

export interface Validator {
  type: 'string' | 'number' | 'boolean' | 'url';
  required?: boolean;
  default?: any;
  min?: number;
  max?: number;
  pattern?: RegExp;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  data: Record<string, any>;
}

interface ValueValidationResult {
  valid: boolean;
  errors: string[];
  value: any;
}

// Convenience functions
export function loadEnv(path?: string): Record<string, string> {
  return EnvParser.load(path);
}

export function parseEnv(content: string): Record<string, string> {
  return EnvParser.parse(content);
}

export function validateEnv(schema: Record<string, Validator>): ValidationResult {
  return EnvParser.validate(schema);
}

// Export for compatibility
export default EnvParser;