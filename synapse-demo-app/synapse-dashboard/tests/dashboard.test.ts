/**
 * Synapse Dashboard Test Suite
 * 
 * Comprehensive testing of the dashboard application
 * using the Synapse testing framework.
 */

import { SynapseTestingFramework } from '@snps/core';
import { SynapseDashboard } from '../src/index.js';

describe('Synapse Dashboard Tests', () => {
  let dashboard: SynapseDashboard;
  let testing: SynapseTestingFramework;

  beforeEach(() => {
    testing = new SynapseTestingFramework();
    dashboard = new SynapseDashboard();
  });

  afterEach(() => {
    // Clean up DOM
    const dashboardElement = document.getElementById('synapse-dashboard');
    if (dashboardElement) {
      dashboardElement.remove();
    }
  });

  describe('Framework Initialization', () => {
    test('should initialize all framework components', async () => {
      await dashboard.initialize();
      
      expect(dashboard).toBeDefined();
      expect(dashboard['runtime']).toBeDefined();
      expect(dashboard['compiler']).toBeDefined();
      expect(dashboard['testing']).toBeDefined();
      expect(dashboard['linting']).toBeDefined();
      expect(dashboard['router']).toBeDefined();
      expect(dashboard['state']).toBeDefined();
      expect(dashboard['plugins']).toBeDefined();
    });

    test('should initialize Rust packages', () => {
      expect(dashboard['httpClient']).toBeDefined();
      expect(dashboard['ruleEngine']).toBeDefined();
    });

    test('should setup routing correctly', async () => {
      await dashboard.initialize();
      
      const router = dashboard['router'];
      expect(router).toBeDefined();
    });

    test('should setup state management', async () => {
      await dashboard.initialize();
      
      const state = dashboard['state'];
      expect(state).toBeDefined();
      
      const userState = state.getState('user');
      expect(userState).toBeDefined();
      expect(userState.name).toBe('Developer');
      expect(userState.role).toBe('admin');
    });
  });

  describe('UI Rendering', () => {
    beforeEach(async () => {
      // Setup DOM
      document.body.innerHTML = '<div id="synapse-dashboard"></div>';
      await dashboard.initialize();
    });

    test('should render dashboard home page', () => {
      dashboard['renderDashboard']();
      
      const container = document.getElementById('synapse-dashboard');
      expect(container).toBeTruthy();
      expect(container!.innerHTML).toContain('Synapse Dashboard');
      expect(container!.innerHTML).toContain('Performance Metrics');
      expect(container!.innerHTML).toContain('Security Status');
    });

    test('should render metrics page', () => {
      dashboard['renderMetrics']();
      
      const container = document.getElementById('synapse-dashboard');
      expect(container!.innerHTML).toContain('Performance Metrics');
      expect(container!.innerHTML).toContain('Real-time Performance');
    });

    test('should render security page', () => {
      dashboard['renderSecurity']();
      
      const container = document.getElementById('synapse-dashboard');
      expect(container!.innerHTML).toContain('Security Center');
      expect(container!.innerHTML).toContain('Security Status');
    });

    test('should render AI optimizer page', () => {
      dashboard['renderAIOptimizer']();
      
      const container = document.getElementById('synapse-dashboard');
      expect(container!.innerHTML).toContain('AI Code Optimizer');
      expect(container!.innerHTML).toContain('Code Analysis');
    });

    test('should render settings page', () => {
      dashboard['renderSettings']();
      
      const container = document.getElementById('synapse-dashboard');
      expect(container!.innerHTML).toContain('Settings');
      expect(container!.innerHTML).toContain('User Preferences');
    });
  });

  describe('State Management', () => {
    beforeEach(async () => {
      await dashboard.initialize();
    });

    test('should update metrics state', async () => {
      const metrics = await dashboard['loadMetrics']();
      
      expect(metrics).toBeDefined();
      expect(metrics.performance).toBeGreaterThanOrEqual(0);
      expect(metrics.performance).toBeLessThanOrEqual(100);
      expect(metrics.security).toBeGreaterThanOrEqual(0);
      expect(metrics.security).toBeLessThanOrEqual(100);
      expect(metrics.optimization).toBeGreaterThanOrEqual(0);
      expect(metrics.optimization).toBeLessThanOrEqual(100);
    });

    test('should update security state', async () => {
      const securityData = await dashboard['loadSecurityData']();
      
      expect(securityData).toBeDefined();
      expect(securityData.vulnerabilities).toBeGreaterThanOrEqual(0);
      expect(securityData.status).toBe('secure');
      expect(securityData.lastScan).toBeInstanceOf(Date);
    });

    test('should manage user preferences', () => {
      const state = dashboard['state'];
      
      // Update user preferences
      const userState = state.getState('user');
      userState.preferences.theme = 'light';
      state.setState('user', userState);
      
      const updatedUser = state.getState('user');
      expect(updatedUser.preferences.theme).toBe('light');
    });
  });

  describe('Functionality Tests', () => {
    beforeEach(async () => {
      await dashboard.initialize();
    });

    test('should run tests successfully', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      
      await dashboard.runTests();
      
      expect(consoleSpy).toHaveBeenCalledWith('🧪 Running tests...');
      expect(consoleSpy).toHaveBeenCalledWith('✅ Tests completed:', expect.any(Object));
    });

    test('should run linting successfully', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      
      await dashboard.runLinting();
      
      expect(consoleSpy).toHaveBeenCalledWith('🔍 Running linting...');
      expect(consoleSpy).toHaveBeenCalledWith('✅ Linting completed:', expect.any(Object));
    });

    test('should run AI optimization', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      
      await dashboard.optimizeCode();
      
      expect(consoleSpy).toHaveBeenCalledWith('🤖 Running AI optimization...');
      expect(consoleSpy).toHaveBeenCalledWith('✅ AI optimization completed');
    });

    test('should run security scan', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      
      await dashboard.runSecurityScan();
      
      expect(consoleSpy).toHaveBeenCalledWith('🔒 Running security scan...');
      expect(consoleSpy).toHaveBeenCalledWith('✅ Security scan completed');
    });
  });

  describe('Error Handling', () => {
    beforeEach(async () => {
      await dashboard.initialize();
    });

    test('should handle test failures gracefully', async () => {
      // Mock testing framework to throw error
      const testingFramework = dashboard['testing'];
      jest.spyOn(testingFramework, 'runAllTests').mockRejectedValue(new Error('Test failed'));
      
      const consoleSpy = jest.spyOn(console, 'error');
      
      await dashboard.runTests();
      
      expect(consoleSpy).toHaveBeenCalledWith('❌ Test error:', expect.any(Error));
    });

    test('should handle linting errors gracefully', async () => {
      // Mock linting system to throw error
      const lintingSystem = dashboard['linting'];
      jest.spyOn(lintingSystem, 'lintProject').mockRejectedValue(new Error('Linting failed'));
      
      const consoleSpy = jest.spyOn(console, 'error');
      
      await dashboard.runLinting();
      
      expect(consoleSpy).toHaveBeenCalledWith('❌ Linting error:', expect.any(Error));
    });
  });

  describe('Integration Tests', () => {
    test('should start dashboard application', async () => {
      // Setup DOM
      document.body.innerHTML = '<div id="synapse-dashboard"></div>';
      
      const consoleSpy = jest.spyOn(console, 'log');
      
      await dashboard.start();
      
      expect(consoleSpy).toHaveBeenCalledWith('🎯 Starting Synapse Dashboard...');
      expect(consoleSpy).toHaveBeenCalledWith('✅ Dashboard started successfully');
      
      // Check if dashboard is rendered
      const container = document.getElementById('synapse-dashboard');
      expect(container!.innerHTML).toContain('Synapse Dashboard');
    });

    test('should handle navigation between pages', async () => {
      // Setup DOM
      document.body.innerHTML = '<div id="synapse-dashboard"></div>';
      
      await dashboard.start();
      
      // Test navigation to metrics page
      dashboard['renderMetrics']();
      let container = document.getElementById('synapse-dashboard');
      expect(container!.innerHTML).toContain('Performance Metrics');
      
      // Test navigation back to dashboard
      dashboard['renderDashboard']();
      container = document.getElementById('synapse-dashboard');
      expect(container!.innerHTML).toContain('Synapse Dashboard');
    });
  });

  describe('Performance Tests', () => {
    test('should initialize within acceptable time', async () => {
      const startTime = performance.now();
      
      await dashboard.initialize();
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should initialize within 1 second
      expect(duration).toBeLessThan(1000);
    });

    test('should render dashboard within acceptable time', async () => {
      document.body.innerHTML = '<div id="synapse-dashboard"></div>';
      await dashboard.initialize();
      
      const startTime = performance.now();
      
      dashboard['renderDashboard']();
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should render within 100ms
      expect(duration).toBeLessThan(100);
    });
  });
});

// Mock DOM for testing
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now())
  }
});

// Mock document methods
Object.defineProperty(document, 'readyState', {
  value: 'complete',
  writable: true
});

// Mock addEventListener
document.addEventListener = jest.fn();