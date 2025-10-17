/**
 * Property-Based Testing
 * Generative testing with random inputs
 */
export class PropertyTester {
    config;
    constructor(config) {
        this.config = config;
    }
    check(property) {
        console.log(`🎲 Testing property: ${property.name}...`);
        const failures = [];
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
    forAll(generator, predicate, name) {
        return this.check({
            name: name || 'anonymous',
            generator,
            predicate
        });
    }
    // Generators
    int(min = -1000, max = 1000) {
        return () => Math.floor(Math.random() * (max - min + 1)) + min;
    }
    string(length = 10) {
        return () => {
            const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };
    }
    array(generator, length = 10) {
        return () => Array.from({ length }, () => generator());
    }
}
//# sourceMappingURL=property.js.map