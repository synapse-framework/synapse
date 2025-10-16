/**
 * @snps/testing-advanced
 *
 * Advanced testing features for Synapse Framework
 *
 * Features:
 * - Mutation Testing - Test quality validation
 * - Property-Based Testing - Generative testing
 * - Chaos Engineering - Resilience testing
 * - Load Testing - Performance and stress testing
 */

export { MutationTester, type MutationConfig, type MutationResult } from './mutation.js';
export { PropertyTester, type PropertyConfig, type Property } from './property.js';
export { ChaosEngine, type ChaosConfig, type ChaosExperiment } from './chaos.js';
export { LoadTester, type LoadConfig, type LoadTestResult } from './load.js';

// Re-export main advanced testing class
export { AdvancedTesting } from './advanced-testing.js';
