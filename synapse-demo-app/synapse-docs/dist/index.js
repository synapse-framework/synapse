/**
 * Synapse Documentation Website
 *
 * A comprehensive documentation site built entirely with the Synapse framework,
 * showcasing its capabilities in a real-world application.
 */
import { SynapseRuntime } from '@snps/core';
import { SynapseCompiler } from '@snps/core';
import { SynapseTestingFramework } from '@snps/core';
import { SynapseLintingSystem } from '@snps/core';
import { SynapseRouter } from '@snps/core';
import { SynapseStateManager } from '@snps/core';
import { SynapsePluginSystem } from '@snps/core';
import { HttpClient } from '@snps/http-client-rust';
import { RuleEngine } from '@snps/rule-engine-rust';
/**
 * Documentation Website Class
 */
class SynapseDocs {
    runtime;
    compiler;
    testing;
    linting;
    router;
    state;
    plugins;
    httpClient;
    ruleEngine;
    isInitialized = false;
    currentSection = 'home';
    constructor() {
        this.initializeFramework();
        this.initializeRustPackages();
    }
    /**
     * Initialize the Synapse framework components
     */
    initializeFramework() {
        console.log('🚀 Initializing Synapse Documentation Framework...');
        this.runtime = new SynapseRuntime();
        this.compiler = new SynapseCompiler();
        this.testing = new SynapseTestingFramework();
        this.linting = new SynapseLintingSystem();
        this.router = new SynapseRouter();
        this.state = new SynapseStateManager();
        this.plugins = new SynapsePluginSystem();
        console.log('✅ Framework components initialized');
    }
    /**
     * Initialize Rust-based packages
     */
    initializeRustPackages() {
        console.log('🦀 Initializing Rust packages...');
        this.httpClient = new HttpClient();
        this.ruleEngine = new RuleEngine();
        console.log('✅ Rust packages initialized');
    }
    /**
     * Initialize the documentation website
     */
    async initialize() {
        if (this.isInitialized) {
            console.log('⚠️ Documentation already initialized');
            return;
        }
        console.log('📚 Initializing Synapse Documentation...');
        // Initialize framework
        await this.runtime.start();
        // Setup state management
        this.setupStateManagement();
        // Setup UI
        this.setupUI();
        this.isInitialized = true;
        console.log('✅ Documentation initialized successfully');
    }
    /**
     * Setup state management
     */
    setupStateManagement() {
        console.log('📊 Setting up state management...');
        // Initialize documentation state
        this.state.setState('user', {
            theme: 'light',
            sidebarCollapsed: false,
            searchHistory: [],
            bookmarks: []
        });
        this.state.setState('navigation', {
            currentSection: 'home',
            breadcrumbs: ['Home'],
            previousSection: null
        });
        console.log('✅ State management configured');
    }
    /**
     * Setup the user interface
     */
    setupUI() {
        console.log('🎨 Setting up documentation UI...');
        // Create the main documentation container
        const docsContainer = document.createElement('div');
        docsContainer.id = 'synapse-docs';
        docsContainer.className = 'docs-container';
        // Add to DOM
        document.body.appendChild(docsContainer);
        console.log('✅ UI setup complete');
    }
    /**
     * Render the main documentation layout
     */
    renderLayout(content) {
        const container = document.getElementById('synapse-docs');
        if (!container)
            return;
        const state = this.state.getState();
        container.innerHTML = `
      <div class="docs-layout">
        <!-- Header -->
        <header class="docs-header">
          <div class="header-content">
            <div class="logo">
              <h1>🚀 Synapse Docs</h1>
            </div>
            <div class="header-actions">
              <div class="search-container">
                <input type="text" id="search-input" placeholder="Search documentation..." 
                       onkeyup="docs.handleSearch(event)">
                <div id="search-results" class="search-results"></div>
              </div>
              <button class="theme-toggle" onclick="docs.toggleTheme()">
                ${state.user.theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </header>

        <div class="docs-body">
          <!-- Sidebar -->
          <aside class="docs-sidebar ${state.user.sidebarCollapsed ? 'collapsed' : ''}">
            <button class="sidebar-toggle" onclick="docs.toggleSidebar()">
              ${state.user.sidebarCollapsed ? '▶️' : '◀️'}
            </button>
            <nav class="sidebar-nav">
              ${this.renderSidebarNavigation()}
            </nav>
          </aside>

          <!-- Main content -->
          <main class="docs-main">
            <div class="breadcrumbs">
              ${this.renderBreadcrumbs()}
            </div>
            <div class="content">
              ${content}
            </div>
            <div class="content-footer">
              <div class="last-updated">
                Last updated: ${new Date().toLocaleDateString()}
              </div>
            </div>
          </main>
        </div>
      </div>
    `;
    }
    /**
     * Render sidebar navigation
     */
    renderSidebarNavigation() {
        const navItems = [
            { id: 'home', title: '🏠 Home', href: '/' },
            { id: 'getting-started', title: '🚀 Getting Started', href: '/getting-started' },
            { id: 'core-framework', title: '🏗️ Core Framework', href: '/core-framework' },
            { id: 'ui-components', title: '🎨 UI Components', href: '/ui-components' },
            { id: 'rust-integration', title: '🦀 Rust Integration', href: '/rust-integration' },
            { id: 'cli-commands', title: '⚡ CLI Commands', href: '/cli-commands' },
            { id: 'api-reference', title: '📚 API Reference', href: '/api-reference' },
            { id: 'examples', title: '💻 Examples', href: '/examples' },
            { id: 'tutorials', title: '🎓 Tutorials', href: '/tutorials' },
            { id: 'best-practices', title: '✨ Best Practices', href: '/best-practices' },
            { id: 'troubleshooting', title: '🔧 Troubleshooting', href: '/troubleshooting' },
            { id: 'contributing', title: '🤝 Contributing', href: '/contributing' }
        ];
        return navItems.map(item => `
      <a href="${item.href}" class="nav-item ${this.currentSection === item.id ? 'active' : ''}" 
         onclick="docs.navigateTo('${item.href}'); return false;">
        ${item.title}
      </a>
    `).join('');
    }
    /**
     * Render breadcrumbs
     */
    renderBreadcrumbs() {
        const navState = this.state.getState('navigation');
        return navState.breadcrumbs.map((crumb, index) => `<span class="breadcrumb ${index === navState.breadcrumbs.length - 1 ? 'current' : ''}">${crumb}</span>`).join(' > ');
    }
    /**
     * Navigate to a section
     */
    navigateTo(path) {
        this.currentSection = path === '/' ? 'home' : path.substring(1);
        // Update navigation state
        const navState = this.state.getState('navigation');
        navState.previousSection = navState.currentSection;
        navState.currentSection = this.currentSection;
        navState.breadcrumbs = ['Home', this.getSectionTitle(this.currentSection)];
        this.state.setState('navigation', navState);
        // Render the appropriate content
        this.renderPage();
    }
    /**
     * Get section title
     */
    getSectionTitle(sectionId) {
        const titles = {
            'home': 'Home',
            'getting-started': 'Getting Started',
            'core-framework': 'Core Framework',
            'ui-components': 'UI Components',
            'rust-integration': 'Rust Integration',
            'cli-commands': 'CLI Commands',
            'api-reference': 'API Reference',
            'examples': 'Examples',
            'tutorials': 'Tutorials',
            'best-practices': 'Best Practices',
            'troubleshooting': 'Troubleshooting',
            'contributing': 'Contributing'
        };
        return titles[sectionId] || sectionId;
    }
    /**
     * Handle search
     */
    handleSearch(event) {
        const input = event.target;
        const query = input.value;
        if (query.length > 2) {
            this.showSearchResults(query);
        }
        else {
            this.hideSearchResults();
        }
    }
    /**
     * Show search results
     */
    showSearchResults(query) {
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer)
            return;
        const sections = ['home', 'getting-started', 'core-framework', 'ui-components', 'rust-integration',
            'cli-commands', 'api-reference', 'examples', 'tutorials', 'best-practices',
            'troubleshooting', 'contributing'];
        const matchingSections = sections.filter(section => section.toLowerCase().includes(query.toLowerCase()) ||
            this.getSectionTitle(section).toLowerCase().includes(query.toLowerCase()));
        if (matchingSections.length > 0) {
            resultsContainer.innerHTML = matchingSections.map(section => `
        <div class="search-result" onclick="docs.navigateTo('/${section}'); docs.hideSearchResults();">
          ${this.getSectionTitle(section)}
        </div>
      `).join('');
            resultsContainer.style.display = 'block';
        }
        else {
            resultsContainer.innerHTML = '<div class="search-result no-results">No results found</div>';
            resultsContainer.style.display = 'block';
        }
    }
    /**
     * Hide search results
     */
    hideSearchResults() {
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
    }
    /**
     * Toggle theme
     */
    toggleTheme() {
        const userState = this.state.getState('user');
        userState.theme = userState.theme === 'dark' ? 'light' : 'dark';
        this.state.setState('user', userState);
        document.body.className = userState.theme;
    }
    /**
     * Toggle sidebar
     */
    toggleSidebar() {
        const userState = this.state.getState('user');
        userState.sidebarCollapsed = !userState.sidebarCollapsed;
        this.state.setState('user', userState);
        const sidebar = document.querySelector('.docs-sidebar');
        if (sidebar) {
            sidebar.classList.toggle('collapsed', userState.sidebarCollapsed);
        }
    }
    /**
     * Render the current page
     */
    renderPage() {
        const content = this.getPageContent();
        this.renderLayout(content);
    }
    /**
     * Get page content based on current section
     */
    getPageContent() {
        switch (this.currentSection) {
            case 'home':
                return this.getHomeContent();
            case 'getting-started':
                return this.getGettingStartedContent();
            case 'core-framework':
                return this.getCoreFrameworkContent();
            case 'ui-components':
                return this.getUIComponentsContent();
            case 'rust-integration':
                return this.getRustIntegrationContent();
            case 'cli-commands':
                return this.getCLICommandsContent();
            case 'api-reference':
                return this.getAPIReferenceContent();
            case 'examples':
                return this.getExamplesContent();
            case 'tutorials':
                return this.getTutorialsContent();
            case 'best-practices':
                return this.getBestPracticesContent();
            case 'troubleshooting':
                return this.getTroubleshootingContent();
            case 'contributing':
                return this.getContributingContent();
            default:
                return this.getHomeContent();
        }
    }
    /**
     * Get home page content
     */
    getHomeContent() {
        return `
      <div class="hero-section">
        <h1>🚀 Synapse Framework Documentation</h1>
        <p class="hero-subtitle">A comprehensive guide to building modern web applications with TypeScript, Rust integration, and cutting-edge UI components.</p>
        
        <div class="hero-stats">
          <div class="stat">
            <div class="stat-number">95%</div>
            <div class="stat-label">Test Success Rate</div>
          </div>
          <div class="stat">
            <div class="stat-number">0</div>
            <div class="stat-label">Dependencies</div>
          </div>
          <div class="stat">
            <div class="stat-number">100%</div>
            <div class="stat-label">TypeScript Coverage</div>
          </div>
          <div class="stat">
            <div class="stat-number">7</div>
            <div class="stat-label">Core Components</div>
          </div>
        </div>
        
        <div class="hero-actions">
          <a href="/getting-started" class="btn btn-primary" onclick="docs.navigateTo('/getting-started'); return false;">Get Started</a>
          <a href="/examples" class="btn btn-secondary" onclick="docs.navigateTo('/examples'); return false;">View Examples</a>
        </div>
      </div>
      
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🏗️</div>
          <h3>Core Framework</h3>
          <p>Comprehensive TypeScript-first framework with zero dependencies, featuring runtime engine, compiler, testing, and more.</p>
          <a href="/core-framework" onclick="docs.navigateTo('/core-framework'); return false;">Learn More →</a>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3>UI Components</h3>
          <p>Modern, responsive UI component library with animations, themes, and accessibility features built-in.</p>
          <a href="/ui-components" onclick="docs.navigateTo('/ui-components'); return false;">Learn More →</a>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🦀</div>
          <h3>Rust Integration</h3>
          <p>High-performance Rust packages seamlessly integrated with Node.js through NAPI bindings.</p>
          <a href="/rust-integration" onclick="docs.navigateTo('/rust-integration'); return false;">Learn More →</a>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>CLI Tools</h3>
          <p>Comprehensive command-line interface for project management, development, and deployment.</p>
          <a href="/cli-commands" onclick="docs.navigateTo('/cli-commands'); return false;">Learn More →</a>
        </div>
      </div>
    `;
    }
    /**
     * Get getting started content
     */
    getGettingStartedContent() {
        return `
      <h1>🚀 Getting Started</h1>
      
      <p>Welcome to the Synapse Framework! This guide will help you get up and running quickly.</p>
      
      <h2>Prerequisites</h2>
      <ul>
        <li>Node.js 18+</li>
        <li>npm or yarn</li>
        <li>Modern web browser</li>
      </ul>
      
      <h2>Installation</h2>
      <div class="code-block">
        <pre><code># Install the CLI globally
npm install -g @snps/cli

# Create a new project
synapse init my-app

# Navigate to your project
cd my-app

# Start development server
synapse dev</code></pre>
      </div>
      
      <h2>Your First Application</h2>
      <div class="code-block">
        <pre><code>import { SynapseRuntime } from '@snps/core';

class MyApp {
  private runtime: SynapseRuntime;
  
  constructor() {
    this.runtime = new SynapseRuntime();
  }
  
  async start() {
    await this.runtime.start();
    console.log('🚀 App started!');
  }
}

const app = new MyApp();
app.start();</code></pre>
      </div>
    `;
    }
    /**
     * Get core framework content
     */
    getCoreFrameworkContent() {
        return `
      <h1>🏗️ Core Framework</h1>
      
      <p>The Synapse Core Framework provides the foundation for building modern web applications with TypeScript and Rust.</p>
      
      <h2>Components</h2>
      
      <div class="component-card">
        <h3>SynapseRuntime</h3>
        <p>Multi-threaded runtime engine that manages application lifecycle and performance.</p>
        <div class="code-block">
          <pre><code>import { SynapseRuntime } from '@snps/core';

const runtime = new SynapseRuntime();
await runtime.start();</code></pre>
        </div>
      </div>
      
      <div class="component-card">
        <h3>SynapseCompiler</h3>
        <p>High-performance TypeScript compiler with Rust backend for fast builds.</p>
        <div class="code-block">
          <pre><code>import { SynapseCompiler } from '@snps/core';

const compiler = new SynapseCompiler();
await compiler.compile('src/index.ts');</code></pre>
        </div>
      </div>
    `;
    }
    /**
     * Get UI components content
     */
    getUIComponentsContent() {
        return `
      <h1>🎨 UI Components</h1>
      
      <p>Modern, responsive UI component library with animations, themes, and accessibility features.</p>
      
      <h2>Available Components</h2>
      
      <div class="component-showcase">
        <div class="component-demo">
          <h3>Button</h3>
          <div class="demo-area">
            <button class="btn btn-primary">Primary Button</button>
            <button class="btn btn-secondary">Secondary Button</button>
          </div>
        </div>
        
        <div class="component-demo">
          <h3>Card</h3>
          <div class="demo-area">
            <div class="card">
              <h4>Card Title</h4>
              <p>Card content goes here.</p>
            </div>
          </div>
        </div>
      </div>
    `;
    }
    /**
     * Get Rust integration content
     */
    getRustIntegrationContent() {
        return `
      <h1>🦀 Rust Integration</h1>
      
      <p>High-performance Rust packages seamlessly integrated with Node.js through NAPI bindings.</p>
      
      <h2>Available Packages</h2>
      
      <div class="package-card">
        <h3>@snps/env-parser-rust</h3>
        <p>Fast environment variable parsing with type safety and validation.</p>
        <div class="code-block">
          <pre><code>import { EnvParser } from '@snps/env-parser-rust';

const env = EnvParser.parse('DATABASE_URL=postgres://localhost:5432/mydb');
console.log(env.DATABASE_URL);</code></pre>
        </div>
      </div>
    `;
    }
    /**
     * Get CLI commands content
     */
    getCLICommandsContent() {
        return `
      <h1>⚡ CLI Commands</h1>
      
      <p>Comprehensive command-line interface for project management, development, and deployment.</p>
      
      <h2>Project Management</h2>
      
      <div class="command-card">
        <h3>synapse init &lt;name&gt;</h3>
        <p>Initialize a new Synapse project with the specified name.</p>
        <div class="code-block">
          <pre><code>synapse init my-app
cd my-app
synapse dev</code></pre>
        </div>
      </div>
    `;
    }
    /**
     * Get API reference content
     */
    getAPIReferenceContent() {
        return `
      <h1>📚 API Reference</h1>
      
      <p>Complete API documentation for all Synapse Framework packages.</p>
      
      <h2>Core Framework APIs</h2>
      
      <div class="api-section">
        <h3>SynapseRuntime</h3>
        <div class="api-method">
          <h4>constructor()</h4>
          <p>Creates a new SynapseRuntime instance.</p>
        </div>
        <div class="api-method">
          <h4>async start(): Promise&lt;void&gt;</h4>
          <p>Starts the runtime engine and initializes all components.</p>
        </div>
      </div>
    `;
    }
    /**
     * Get examples content
     */
    getExamplesContent() {
        return `
      <h1>💻 Examples</h1>
      
      <p>Real-world examples showcasing Synapse Framework capabilities.</p>
      
      <h2>Basic Application</h2>
      <div class="example-card">
        <h3>Simple Counter App</h3>
        <p>A basic counter application demonstrating state management and UI components.</p>
        <div class="code-block">
          <pre><code>import { SynapseRuntime } from '@snps/core';

class CounterApp {
  private runtime: SynapseRuntime;
  
  constructor() {
    this.runtime = new SynapseRuntime();
  }
  
  async start() {
    await this.runtime.start();
    console.log('🚀 App started!');
  }
}</code></pre>
        </div>
      </div>
    `;
    }
    /**
     * Get tutorials content
     */
    getTutorialsContent() {
        return `
      <h1>🎓 Tutorials</h1>
      
      <p>Step-by-step tutorials to help you master the Synapse Framework.</p>
      
      <div class="tutorial-list">
        <div class="tutorial-card">
          <h3>Building Your First App</h3>
          <p>Learn the basics by creating a simple todo application.</p>
          <div class="tutorial-meta">
            <span class="difficulty">Beginner</span>
            <span class="duration">30 minutes</span>
          </div>
        </div>
        
        <div class="tutorial-card">
          <h3>State Management Deep Dive</h3>
          <p>Master reactive state management with complex applications.</p>
          <div class="tutorial-meta">
            <span class="difficulty">Intermediate</span>
            <span class="duration">45 minutes</span>
          </div>
        </div>
      </div>
    `;
    }
    /**
     * Get best practices content
     */
    getBestPracticesContent() {
        return `
      <h1>✨ Best Practices</h1>
      
      <p>Guidelines and recommendations for building maintainable applications with Synapse.</p>
      
      <h2>Code Organization</h2>
      <ul>
        <li>Use TypeScript strict mode for better type safety</li>
        <li>Organize code into logical modules and components</li>
        <li>Follow consistent naming conventions</li>
        <li>Keep functions small and focused on single responsibility</li>
        <li>Use interfaces for better code documentation</li>
      </ul>
      
      <h2>Performance</h2>
      <ul>
        <li>Use lazy loading for large components</li>
        <li>Implement proper caching strategies</li>
        <li>Optimize bundle size with tree shaking</li>
        <li>Use Rust packages for performance-critical operations</li>
        <li>Monitor and profile your application regularly</li>
      </ul>
    `;
    }
    /**
     * Get troubleshooting content
     */
    getTroubleshootingContent() {
        return `
      <h1>🔧 Troubleshooting</h1>
      
      <p>Common issues and solutions when working with the Synapse Framework.</p>
      
      <h2>Common Issues</h2>
      
      <div class="issue-card">
        <h3>Build Errors</h3>
        <p><strong>Problem:</strong> TypeScript compilation fails with type errors.</p>
        <p><strong>Solution:</strong> Check your tsconfig.json settings and ensure all imports are correct.</p>
        <div class="code-block">
          <pre><code># Check TypeScript configuration
npx tsc --noEmit

# Fix import issues
import { SynapseRuntime } from '@snps/core';</code></pre>
        </div>
      </div>
    `;
    }
    /**
     * Get contributing content
     */
    getContributingContent() {
        return `
      <h1>🤝 Contributing</h1>
      
      <p>We welcome contributions to the Synapse Framework! Here's how you can help.</p>
      
      <h2>Ways to Contribute</h2>
      <ul>
        <li>🐛 Report bugs and issues</li>
        <li>✨ Suggest new features</li>
        <li>📚 Improve documentation</li>
        <li>🧪 Add tests and examples</li>
        <li>🔧 Fix bugs and implement features</li>
        <li>🎨 Improve UI components</li>
        <li>⚡ Optimize performance</li>
      </ul>
      
      <h2>Development Setup</h2>
      <div class="code-block">
        <pre><code># Fork and clone the repository
git clone https://github.com/your-username/synapse-framework.git
cd synapse-framework

# Install dependencies
npm install

# Build the framework
make build

# Run tests
make test

# Start development
make dev</code></pre>
      </div>
    `;
    }
    /**
     * Start the documentation website
     */
    async start() {
        console.log('📚 Starting Synapse Documentation...');
        await this.initialize();
        this.renderPage();
        console.log('✅ Documentation started successfully');
    }
}
// Initialize and start the documentation
const docs = new SynapseDocs();
// Make docs globally available
window.docs = docs;
// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        docs.start();
    });
}
else {
    docs.start();
}
export default SynapseDocs;
