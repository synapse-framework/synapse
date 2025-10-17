export class SecurityMonitor {
    lastUpdate = new Date();
    rules = [];
    async getRules() {
        if (this.rules.length === 0) {
            await this.updateRules();
        }
        return this.rules;
    }
    async updateRules() {
        const startTime = Date.now();
        try {
            // Fetch security advisories from multiple sources
            const [githubAdvisories, cveData, rustSecurity] = await Promise.all([
                this.fetchGitHubAdvisories(),
                this.fetchCVEData(),
                this.fetchRustSecurity()
            ]);
            // Process and create rules
            this.rules = [
                ...this.createGitHubRules(githubAdvisories),
                ...this.createCVERules(cveData),
                ...this.createRustSecurityRules(rustSecurity),
                ...this.getDefaultSecurityRules()
            ];
            this.lastUpdate = new Date();
            return {
                source: 'security-monitor',
                rules: this.rules,
                timestamp: this.lastUpdate.toISOString(),
                version: '1.0.0'
            };
        }
        catch (error) {
            console.error('Error updating security rules:', error);
            // Return cached rules if available
            return {
                source: 'security-monitor',
                rules: this.rules,
                timestamp: this.lastUpdate.toISOString(),
                version: '1.0.0'
            };
        }
    }
    async fetchGitHubAdvisories() {
        try {
            const response = await fetch('https://api.github.com/advisories?per_page=100');
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            return await response.json();
        }
        catch (error) {
            console.warn('Failed to fetch GitHub advisories:', error);
            return [];
        }
    }
    async fetchCVEData() {
        try {
            // Using NVD CVE API 2.0
            const response = await fetch('https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=100');
            if (!response.ok) {
                throw new Error(`CVE API error: ${response.status}`);
            }
            const data = await response.json();
            return data.vulnerabilities || [];
        }
        catch (error) {
            console.warn('Failed to fetch CVE data:', error);
            return [];
        }
    }
    async fetchRustSecurity() {
        try {
            // Using RustSec advisory database
            const response = await fetch('https://rustsec.org/advisories.json');
            if (!response.ok) {
                throw new Error(`RustSec API error: ${response.status}`);
            }
            return await response.json();
        }
        catch (error) {
            console.warn('Failed to fetch Rust security data:', error);
            return [];
        }
    }
    createGitHubRules(advisories) {
        return advisories
            .filter(adv => adv.severity === 'high' || adv.severity === 'critical')
            .map(adv => ({
            id: `SEC-GH-${adv.ghsa_id}`,
            category: 'Security',
            severity: adv.severity === 'critical' ? 'Critical' : 'High',
            title: `GitHub Security Advisory: ${adv.summary}`,
            description: adv.description || 'Security vulnerability detected',
            remediation: `Update to a secure version or apply the recommended fix: ${adv.html_url}`,
            pattern: adv.vulnerabilities?.[0]?.package?.name || '',
            logic: 'contains',
            tags: ['security', 'github', 'advisory', 'auto-fixable'],
            created_at: new Date(adv.published_at).toISOString(),
            updated_at: new Date(adv.updated_at).toISOString()
        }));
    }
    createCVERules(cveData) {
        return cveData
            .filter(cve => cve.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore >= 7.0)
            .map(cve => ({
            id: `SEC-CVE-${cve.cve?.id}`,
            category: 'Security',
            severity: cve.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore >= 9.0 ? 'Critical' : 'High',
            title: `CVE: ${cve.cve?.id}`,
            description: cve.cve?.descriptions?.[0]?.value || 'Critical security vulnerability',
            remediation: `Apply security patch for CVE ${cve.cve?.id}`,
            pattern: cve.cve?.id || '',
            logic: 'contains',
            tags: ['security', 'cve', 'vulnerability', 'critical'],
            created_at: new Date(cve.cve?.published).toISOString(),
            updated_at: new Date(cve.cve?.lastModified).toISOString()
        }));
    }
    createRustSecurityRules(rustData) {
        return rustData
            .filter(adv => adv.versions?.patched?.length > 0)
            .map(adv => ({
            id: `SEC-RUST-${adv.id}`,
            category: 'Security',
            severity: adv.severity === 'critical' ? 'Critical' : 'High',
            title: `Rust Security: ${adv.title}`,
            description: adv.description || 'Rust security vulnerability',
            remediation: `Update Rust dependencies: ${adv.versions.patched.join(', ')}`,
            pattern: adv.package || '',
            logic: 'contains',
            tags: ['security', 'rust', 'cargo', 'vulnerability'],
            created_at: new Date(adv.date).toISOString(),
            updated_at: new Date(adv.date).toISOString()
        }));
    }
    getDefaultSecurityRules() {
        return [
            {
                id: 'SEC-001',
                category: 'Security',
                severity: 'High',
                title: 'No Hardcoded Secrets',
                description: 'Hardcoded secrets, passwords, or API keys should not be present in code',
                remediation: 'Use environment variables or secure secret management',
                pattern: '(password|secret|key|token)\\s*[:=]\\s*["\'][^"\']+["\']',
                logic: 'regex',
                tags: ['security', 'secrets', 'hardcoded', 'auto-fixable'],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 'SEC-002',
                category: 'Security',
                severity: 'Medium',
                title: 'No Console Logging of Sensitive Data',
                description: 'Sensitive data should not be logged to console',
                remediation: 'Remove or sanitize sensitive data from console logs',
                pattern: 'console\\.(log|warn|error)\\s*\\([^)]*password[^)]*\\)',
                logic: 'regex',
                tags: ['security', 'logging', 'sensitive-data', 'auto-fixable'],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 'SEC-003',
                category: 'Security',
                severity: 'High',
                title: 'HTTPS Only for External Requests',
                description: 'All external HTTP requests should use HTTPS',
                remediation: 'Change HTTP URLs to HTTPS',
                pattern: 'http://(?!localhost|127\\.0\\.0\\.1)',
                logic: 'regex',
                tags: ['security', 'https', 'ssl', 'tls', 'auto-fixable'],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 'SEC-004',
                category: 'Security',
                severity: 'Medium',
                title: 'Input Validation Required',
                description: 'User inputs should be validated before processing',
                remediation: 'Add input validation and sanitization',
                pattern: 'req\\.(body|query|params)\\.[a-zA-Z]+(?!.*validate|.*sanitize)',
                logic: 'regex',
                tags: ['security', 'validation', 'input', 'xss'],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 'SEC-005',
                category: 'Security',
                severity: 'High',
                title: 'SQL Injection Prevention',
                description: 'Raw SQL queries should use parameterized statements',
                remediation: 'Use prepared statements or ORM methods',
                pattern: 'query\\s*\\([^)]*\\$\\{[^}]+\\}[^)]*\\)',
                logic: 'regex',
                tags: ['security', 'sql-injection', 'database', 'critical'],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ];
    }
}
//# sourceMappingURL=security-monitor.js.map