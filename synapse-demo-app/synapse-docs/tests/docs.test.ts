/**
 * Synapse Documentation Test Suite
 * 
 * Comprehensive testing of the documentation website
 * using the Synapse testing framework.
 */

import { SynapseTestingFramework } from '@snps/core';
import { SynapseDocs } from '../src/index.js';

describe('Synapse Documentation Tests', () => {
  let docs: SynapseDocs;
  let testing: SynapseTestingFramework;

  beforeEach(() => {
    testing = new SynapseTestingFramework();
    docs = new SynapseDocs();
  });

  afterEach(() => {
    // Clean up DOM
    const docsElement = document.getElementById('synapse-docs');
    if (docsElement) {
      docsElement.remove();
    }
  });

  describe('Framework Initialization', () => {
    test('should initialize all framework components', async () => {
      await docs.initialize();
      
      expect(docs).toBeDefined();
      expect(docs['runtime']).toBeDefined();
      expect(docs['compiler']).toBeDefined();
      expect(docs['testing']).toBeDefined();
      expect(docs['linting']).toBeDefined();
      expect(docs['router']).toBeDefined();
      expect(docs['state']).toBeDefined();
      expect(docs['plugins']).toBeDefined();
    });

    test('should initialize Rust packages', () => {
      expect(docs['httpClient']).toBeDefined();
      expect(docs['ruleEngine']).toBeDefined();
    });

    test('should setup routing correctly', async () => {
      await docs.initialize();
      
      const router = docs['router'];
      expect(router).toBeDefined();
    });

    test('should setup state management', async () => {
      await docs.initialize();
      
      const state = docs['state'];
      expect(state).toBeDefined();
      
      const userState = state.getState('user');
      expect(userState).toBeDefined();
      expect(userState.theme).toBe('light');
      expect(userState.sidebarCollapsed).toBe(false);
    });
  });

  describe('Documentation Content', () => {
    beforeEach(async () => {
      // Setup DOM
      document.body.innerHTML = '<div id="synapse-docs"></div>';
      await docs.initialize();
    });

    test('should render home page', () => {
      docs['renderHome']();
      
      const container = document.getElementById('synapse-docs');
      expect(container).toBeTruthy();
      expect(container!.innerHTML).toContain('Synapse Framework Documentation');
      expect(container!.innerHTML).toContain('hero-section');
    });

    test('should render getting started page', () => {
      docs['renderGettingStarted']();
      
      const container = document.getElementById('synapse-docs');
      expect(container!.innerHTML).toContain('Getting Started');
      expect(container!.innerHTML).toContain('Prerequisites');
      expect(container!.innerHTML).toContain('Installation');
    });

    test('should render core framework page', () => {
      docs['renderCoreFramework']();
      
      const container = document.getElementById('synapse-docs');
      expect(container!.innerHTML).toContain('Core Framework');
      expect(container!.innerHTML).toContain('SynapseRuntime');
      expect(container!.innerHTML).toContain('SynapseCompiler');
    });

    test('should render UI components page', () => {
      docs['renderUIComponents']();
      
      const container = document.getElementById('synapse-docs');
      expect(container!.innerHTML).toContain('UI Components');
      expect(container!.innerHTML).toContain('Button');
      expect(container!.innerHTML).toContain('Card');
    });

    test('should render Rust integration page', () => {
      docs['renderRustIntegration']();
      
      const container = document.getElementById('synapse-docs');
      expect(container!.innerHTML).toContain('Rust Integration');
      expect(container!.innerHTML).toContain('EnvParser');
      expect(container!.innerHTML).toContain('HttpClient');
    });

    test('should render CLI commands page', () => {
      docs['renderCLICommands']();
      
      const container = document.getElementById('synapse-docs');
      expect(container!.innerHTML).toContain('CLI Commands');
      expect(container!.innerHTML).toContain('synapse init');
      expect(container!.innerHTML).toContain('synapse dev');
    });

    test('should render API reference page', () => {
      docs['renderAPIReference']();
      
      const container = document.getElementById('synapse-docs');
      expect(container!.innerHTML).toContain('API Reference');
      expect(container!.innerHTML).toContain('SynapseRuntime');
      expect(container!.innerHTML).toContain('constructor');
    });

    test('should render examples page', () => {
      docs['renderExamples']();
      
      const container = document.getElementById('synapse-docs');
      expect(container!.innerHTML).toContain('Examples');
      expect(container!.innerHTML).toContain('Counter App');
      expect(container!.innerHTML).toContain('Weather Dashboard');
    });

    test('should render tutorials page', () => {
      docs['renderTutorials']();
      
      const container = document.getElementById('synapse-docs');
      expect(container!.innerHTML).toContain('Tutorials');
      expect(container!.innerHTML).toContain('Building Your First App');
      expect(container!.innerHTML).toContain('State Management Deep Dive');
    });

    test('should render best practices page', () => {
      docs['renderBestPractices']();
      
      const container = document.getElementById('synapse-docs');
      expect(container!.innerHTML).toContain('Best Practices');
      expect(container!.innerHTML).toContain('Code Organization');
      expect(container!.innerHTML).toContain('Performance');
    });

    test('should render troubleshooting page', () => {
      docs['renderTroubleshooting']();
      
      const container = document.getElementById('synapse-docs');
      expect(container!.innerHTML).toContain('Troubleshooting');
      expect(container!.innerHTML).toContain('Build Errors');
      expect(container!.innerHTML).toContain('Runtime Errors');
    });

    test('should render contributing page', () => {
      docs['renderContributing']();
      
      const container = document.getElementById('synapse-docs');
      expect(container!.innerHTML).toContain('Contributing');
      expect(container!.innerHTML).toContain('Ways to Contribute');
      expect(container!.innerHTML).toContain('Development Setup');
    });
  });

  describe('Navigation and Search', () => {
    beforeEach(async () => {
      document.body.innerHTML = '<div id="synapse-docs"></div>';
      await docs.initialize();
    });

    test('should navigate between pages', () => {
      // Start with home page
      docs['renderHome']();
      let container = document.getElementById('synapse-docs');
      expect(container!.innerHTML).toContain('Synapse Framework Documentation');
      
      // Navigate to getting started
      docs.navigateTo('/getting-started');
      container = document.getElementById('synapse-docs');
      expect(container!.innerHTML).toContain('Getting Started');
      
      // Navigate to core framework
      docs.navigateTo('/core-framework');
      container = document.getElementById('synapse-docs');
      expect(container!.innerHTML).toContain('Core Framework');
    });

    test('should handle search functionality', () => {
      docs['renderHome']();
      
      // Simulate search input
      const searchInput = document.getElementById('search-input') as HTMLInputElement;
      if (searchInput) {
        searchInput.value = 'runtime';
        const event = new KeyboardEvent('keyup', { key: 'Enter' });
        docs.handleSearch(event);
        
        // Check if search results are shown
        const searchResults = document.getElementById('search-results');
        expect(searchResults).toBeTruthy();
      }
    });

    test('should toggle theme', () => {
      const userState = docs['state'].getState('user');
      expect(userState.theme).toBe('light');
      
      docs.toggleTheme();
      
      const updatedUserState = docs['state'].getState('user');
      expect(updatedUserState.theme).toBe('dark');
    });

    test('should toggle sidebar', () => {
      const userState = docs['state'].getState('user');
      expect(userState.sidebarCollapsed).toBe(false);
      
      docs.toggleSidebar();
      
      const updatedUserState = docs['state'].getState('user');
      expect(updatedUserState.sidebarCollapsed).toBe(true);
    });
  });

  describe('Content Loading', () => {
    test('should load documentation sections', async () => {
      const sections = await docs['loadDocumentationSections']();
      
      expect(sections).toBeDefined();
      expect(sections.home).toBeDefined();
      expect(sections.gettingStarted).toBeDefined();
      expect(sections.coreFramework).toBeDefined();
      expect(sections.uiComponents).toBeDefined();
      expect(sections.rustIntegration).toBeDefined();
      expect(sections.cliCommands).toBeDefined();
      expect(sections.apiReference).toBeDefined();
      expect(sections.examples).toBeDefined();
      expect(sections.tutorials).toBeDefined();
      expect(sections.bestPractices).toBeDefined();
      expect(sections.troubleshooting).toBeDefined();
      expect(sections.contributing).toBeDefined();
    });

    test('should build search index', async () => {
      const sections = await docs['loadDocumentationSections']();
      const searchIndex = docs['buildSearchIndex'](sections);
      
      expect(searchIndex).toBeDefined();
      expect(typeof searchIndex).toBe('object');
      
      // Check if common words are indexed
      expect(searchIndex['synapse']).toBeDefined();
      expect(searchIndex['framework']).toBeDefined();
      expect(searchIndex['typescript']).toBeDefined();
    });
  });

  describe('UI Components', () => {
    beforeEach(async () => {
      document.body.innerHTML = '<div id="synapse-docs"></div>';
      await docs.initialize();
    });

    test('should render sidebar navigation', () => {
      docs['renderHome']();
      
      const container = document.getElementById('synapse-docs');
      expect(container!.innerHTML).toContain('sidebar-nav');
      expect(container!.innerHTML).toContain('nav-item');
    });

    test('should render breadcrumbs', () => {
      docs['renderHome']();
      
      const container = document.getElementById('synapse-docs');
      expect(container!.innerHTML).toContain('breadcrumbs');
      expect(container!.innerHTML).toContain('Home');
    });

    test('should render search input', () => {
      docs['renderHome']();
      
      const searchInput = document.getElementById('search-input');
      expect(searchInput).toBeTruthy();
      expect(searchInput!.getAttribute('placeholder')).toBe('Search documentation...');
    });

    test('should render theme toggle', () => {
      docs['renderHome']();
      
      const themeToggle = document.querySelector('.theme-toggle');
      expect(themeToggle).toBeTruthy();
    });
  });

  describe('Performance Tests', () => {
    test('should initialize within acceptable time', async () => {
      const startTime = performance.now();
      
      await docs.initialize();
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should initialize within 2 seconds
      expect(duration).toBeLessThan(2000);
    });

    test('should render pages within acceptable time', async () => {
      document.body.innerHTML = '<div id="synapse-docs"></div>';
      await docs.initialize();
      
      const startTime = performance.now();
      
      docs['renderHome']();
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should render within 100ms
      expect(duration).toBeLessThan(100);
    });

    test('should handle search efficiently', async () => {
      document.body.innerHTML = '<div id="synapse-docs"></div>';
      await docs.initialize();
      docs['renderHome']();
      
      const startTime = performance.now();
      
      // Simulate multiple search queries
      for (let i = 0; i < 10; i++) {
        const event = new KeyboardEvent('keyup', { key: 'a' });
        docs.handleSearch(event);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should handle 10 searches within 50ms
      expect(duration).toBeLessThan(50);
    });
  });

  describe('Error Handling', () => {
    test('should handle initialization errors gracefully', async () => {
      // Mock framework to throw error
      const runtime = docs['runtime'];
      jest.spyOn(runtime, 'start').mockRejectedValue(new Error('Runtime error'));
      
      const consoleSpy = jest.spyOn(console, 'error');
      
      await docs.initialize();
      
      expect(consoleSpy).toHaveBeenCalledWith('❌ Error loading documentation:', expect.any(Error));
    });

    test('should handle content loading errors gracefully', async () => {
      // Mock loadDocumentationSections to throw error
      jest.spyOn(docs, 'loadDocumentationSections').mockRejectedValue(new Error('Content loading error'));
      
      const consoleSpy = jest.spyOn(console, 'error');
      
      await docs.initialize();
      
      expect(consoleSpy).toHaveBeenCalledWith('❌ Error loading documentation:', expect.any(Error));
    });
  });

  describe('Integration Tests', () => {
    test('should start documentation website', async () => {
      // Setup DOM
      document.body.innerHTML = '<div id="synapse-docs"></div>';
      
      const consoleSpy = jest.spyOn(console, 'log');
      
      await docs.start();
      
      expect(consoleSpy).toHaveBeenCalledWith('📚 Starting Synapse Documentation...');
      expect(consoleSpy).toHaveBeenCalledWith('✅ Documentation started successfully');
      
      // Check if documentation is rendered
      const container = document.getElementById('synapse-docs');
      expect(container!.innerHTML).toContain('Synapse Framework Documentation');
    });

    test('should handle navigation events', async () => {
      document.body.innerHTML = '<div id="synapse-docs"></div>';
      await docs.start();
      
      // Test navigation event listener
      const link = document.createElement('a');
      link.href = '/getting-started';
      link.textContent = 'Getting Started';
      
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: link });
      
      // This should not throw an error
      expect(() => {
        document.dispatchEvent(clickEvent);
      }).not.toThrow();
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