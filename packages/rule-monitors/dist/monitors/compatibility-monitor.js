export class CompatibilityMonitor {
    lastUpdate = new Date();
    rules = [];
    async getRules() {
        if (this.rules.length === 0) {
            await this.updateRules();
        }
        return this.rules;
    }
    async updateRules() {
        try {
            // Fetch compatibility standards and browser support data
            const [browserSupport, nodeVersions, rustEditions] = await Promise.all([
                this.fetchBrowserSupport(),
                this.fetchNodeVersions(),
                this.fetchRustEditions()
            ]);
            // Process and create rules
            this.rules = [
                ...this.createBrowserRules(browserSupport),
                ...this.createNodeRules(nodeVersions),
                ...this.createRustRules(rustEditions),
                ...this.getDefaultCompatibilityRules()
            ];
            this.lastUpdate = new Date();
            return {
                source: 'compatibility-monitor',
                rules: this.rules,
                timestamp: this.lastUpdate.toISOString(),
                version: '1.0.0'
            };
        }
        catch (error) {
            console.error('Error updating compatibility rules:', error);
            return {
                source: 'compatibility-monitor',
                rules: this.rules,
                timestamp: this.lastUpdate.toISOString(),
                version: '1.0.0'
            };
        }
    }
    async fetchBrowserSupport() {
        try {
            // Fetch browser support data
            const response = await fetch('https://caniuse.com/api/data.json');
            if (!response.ok) {
                throw new Error(`Browser support error: ${response.status}`);
            }
            return await response.json();
        }
        catch (error) {
            console.warn('Failed to fetch browser support data:', error);
            return [];
        }
    }
    async fetchNodeVersions() {
        try {
            // Fetch Node.js version information
            const response = await fetch('https://nodejs.org/dist/index.json');
            if (!response.ok) {
                throw new Error(`Node versions error: ${response.status}`);
            }
            return await response.json();
        }
        catch (error) {
            console.warn('Failed to fetch Node.js versions:', error);
            return [];
        }
    }
    async fetchRustEditions() {
        try {
            // Fetch Rust edition information
            const response = await fetch('https://forge.rust-lang.org/release/platform-support.html');
            if (!response.ok) {
                throw new Error(`Rust editions error: ${response.status}`);
            }
            return [];
        }
        catch (error) {
            console.warn('Failed to fetch Rust editions:', error);
            return [];
        }
    }
    createBrowserRules(data) {
        return [
            {
                id: 'COMPAT-BROWSER-001',
                category: 'Compatibility',
                severity: 'Medium',
                title: 'Modern Browser Features',
                description: 'Use modern browser features with appropriate fallbacks',
                remediation: 'Add polyfills or fallbacks for older browsers',
                pattern: 'fetch\\(|async\\s+await|const\\s+\\{',
                logic: 'regex',
                tags: ['compatibility', 'browser', 'polyfills', 'modern-features'],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ];
    }
    createNodeRules(data) {
        return [
            {
                id: 'COMPAT-NODE-001',
                category: 'Compatibility',
                severity: 'High',
                title: 'Node.js Version Support',
                description: 'Ensure compatibility with supported Node.js versions',
                remediation: 'Update package.json engines field and test on target versions',
                pattern: '"engines"\\s*:\\s*\\{[^}]*"node"\\s*:\\s*"[^"]*"',
                logic: 'not_contains',
                tags: ['compatibility', 'nodejs', 'engines', 'version-support'],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ];
    }
    createRustRules(data) {
        return [
            {
                id: 'COMPAT-RUST-001',
                category: 'Compatibility',
                severity: 'Medium',
                title: 'Rust Edition Compatibility',
                description: 'Use compatible Rust edition and features',
                remediation: 'Update Cargo.toml edition and check feature compatibility',
                pattern: 'edition\\s*=\\s*"2021"',
                logic: 'not_contains',
                tags: ['compatibility', 'rust', 'edition', 'cargo'],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ];
    }
    getDefaultCompatibilityRules() {
        return [
            {
                id: 'COMPAT-001',
                category: 'Compatibility',
                severity: 'High',
                title: 'ES Module Compatibility',
                description: 'Ensure proper ES module syntax and compatibility',
                remediation: 'Use proper import/export syntax and configure module type',
                pattern: 'require\\s*\\(|module\\.exports',
                logic: 'regex',
                tags: ['compatibility', 'es-modules', 'imports', 'exports'],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 'COMPAT-002',
                category: 'Compatibility',
                severity: 'Medium',
                title: 'TypeScript Target Compatibility',
                description: 'TypeScript target should be compatible with supported browsers',
                remediation: 'Update tsconfig.json target to appropriate ES version',
                pattern: '"target"\\s*:\\s*"es5"',
                logic: 'regex',
                tags: ['compatibility', 'typescript', 'target', 'browsers'],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 'COMPAT-003',
                category: 'Compatibility',
                severity: 'Low',
                title: 'CSS Vendor Prefixes',
                description: 'Use appropriate CSS vendor prefixes for browser compatibility',
                remediation: 'Add vendor prefixes for CSS properties that need them',
                pattern: 'transform|transition|animation(?!.*-webkit-|-moz-|-ms-)',
                logic: 'regex',
                tags: ['compatibility', 'css', 'vendor-prefixes', 'browsers'],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 'COMPAT-004',
                category: 'Compatibility',
                severity: 'Medium',
                title: 'Package Dependencies Compatibility',
                description: 'Ensure package dependencies are compatible with target environments',
                remediation: 'Update dependencies to compatible versions',
                pattern: '"peerDependencies"',
                logic: 'not_contains',
                tags: ['compatibility', 'dependencies', 'peer-deps', 'versions'],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 'COMPAT-005',
                category: 'Compatibility',
                severity: 'High',
                title: 'Cross-Platform Compatibility',
                description: 'Code should work across different operating systems',
                remediation: 'Use cross-platform APIs and avoid OS-specific code',
                pattern: 'process\\.platform|os\\.platform|win32|darwin|linux',
                logic: 'regex',
                tags: ['compatibility', 'cross-platform', 'os', 'portability'],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ];
    }
}
//# sourceMappingURL=compatibility-monitor.js.map