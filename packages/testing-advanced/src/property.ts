/**
 * Property-Based Testing
 * Generative testing with random inputs
 */

export interface PropertyConfig {
  readonly iterations: number;
  readonly seed?: number;
}

export interface Property<T> {
  readonly name: string;
  readonly generator: () => T;
  readonly predicate: (value: T) => boolean;
}

export class PropertyTester {
  private readonly config: PropertyConfig;

  public constructor(config: PropertyConfig) {
    this.config = config;
  }

  public check<T>(property: Property<T>): PropertyTestResult {
    console.log(`🎲 Testing property: ${property.name}...`);

    const failures: Array<{ value: T; iteration: number }> = [];

    for (let i = 0; i < this.config.iterations; i++) {
      const value = property.generator();
      const result = property.predicate(value);

      if (!result) {
        failures.push({ value, iteration: i });
      }
    }

    return {
      property: property.name,
      iterations: this.config.iterations,
      passed: failures.length === 0,
      failures
    };
  }

  public forAll<T>(generator: () => T, predicate: (value: T) => boolean, name?: string): PropertyTestResult {
    return this.check({
      name: name || 'anonymous',
      generator,
      predicate
    });
  }

  // Generators
  public int(min: number = -1000, max: number = 1000): () => number {
    return () => Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public string(length: number = 10): () => string {
    return () => {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };
  }

  public array<T>(generator: () => T, length: number = 10): () => T[] {
    return () => Array.from({ length }, () => generator());
  }
}

export interface PropertyTestResult {
  readonly property: string;
  readonly iterations: number;
  readonly passed: boolean;
  readonly failures: Array<{ value: unknown; iteration: number }>;
}
