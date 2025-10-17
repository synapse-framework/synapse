/**
 * Security Scanning and Vulnerability Detection System for Synapse CLI
 * Comprehensive security analysis, vulnerability scanning, and threat detection
 */

import { promises as fs } from 'fs';
import { join, resolve, dirname, extname, basename } from 'path';
import { execSync, spawn } from 'child_process';

export class SecurityScanner {
  constructor(options = {}) {
    this.root = options.root || process.cwd();
    this.verbose = options.verbose || false;
    this.outputDir = options.outputDir || join(this.root, '.synapse', 'security');
    
    this.vulnerabilities = new Map();
    this.securityIssues = new Map();
    this.scanResults = new Map();
    this.policies = new Map();
    
    this.initializeSecurityPolicies();
  }

  async initialize() {
    console.log('🔒 Initializing Security Scanner...');
    
    // Ensure output directory exists
    await fs.mkdir(this.outputDir, { recursive: true });
    
    // Initialize security policies
    this.initializeSecurityPolicies();
    
    console.log('✅ Security Scanner initialized');
  }

  initializeSecurityPolicies() {
    // Dependency security policies
    this.policies.set('dependency-vulnerabilities', {
      name: 'Dependency Vulnerabilities',
      severity: 'high',
      description: 'Check for known vulnerabilities in dependencies',
      enabled: true
    });

    this.policies.set('outdated-dependencies', {
      name: 'Outdated Dependencies',
      severity: 'medium',
      description: 'Check for outdated dependencies',
      enabled: true
    });

    this.policies.set('license-compliance', {
      name: 'License Compliance',
      severity: 'medium',
      description: 'Check for license compliance issues',
      enabled: true
    });

    // Code security policies
    this.policies.set('hardcoded-secrets', {
      name: 'Hardcoded Secrets',
      severity: 'critical',
      description: 'Check for hardcoded secrets and credentials',
      enabled: true
    });

    this.policies.set('sql-injection', {
      name: 'SQL Injection',
      severity: 'high',
      description: 'Check for SQL injection vulnerabilities',
      enabled: true
    });

    this.policies.set('xss-vulnerabilities', {
      name: 'XSS Vulnerabilities',
      severity: 'high',
      description: 'Check for Cross-Site Scripting vulnerabilities',
      enabled: true
    });

    this.policies.set('insecure-random', {
      name: 'Insecure Random',
      severity: 'medium',
      description: 'Check for insecure random number generation',
      enabled: true
    });

    this.policies.set('weak-crypto', {
      name: 'Weak Cryptography',
      severity: 'high',
      description: 'Check for weak cryptographic implementations',
      enabled: true
    });

    // Configuration security policies
    this.policies.set('insecure-headers', {
      name: 'Insecure Headers',
      severity: 'medium',
      description: 'Check for insecure HTTP headers',
      enabled: true
    });

    this.policies.set('cors-misconfiguration', {
      name: 'CORS Misconfiguration',
      severity: 'medium',
      description: 'Check for CORS misconfigurations',
      enabled: true
    });

    this.policies.set('https-enforcement', {
      name: 'HTTPS Enforcement',
      severity: 'high',
      description: 'Check for HTTPS enforcement',
      enabled: true
    });
  }

  async scan(options = {}) {
    console.log('🔍 Starting security scan...');
    
    const scanId = `scan-${Date.now()}`;
    const scanResult = {
      id: scanId,
      timestamp: new Date().toISOString(),
      duration: 0,
      vulnerabilities: [],
      issues: [],
      summary: {
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      }
    };
    
    const startTime = Date.now();
    
    try {
      // Run all security checks
      await this.scanDependencies(scanResult);
      await this.scanCode(scanResult);
      await this.scanConfiguration(scanResult);
      await this.scanSecrets(scanResult);
      await this.scanNetwork(scanResult);
      
      scanResult.duration = Date.now() - startTime;
      
      // Generate summary
      this.generateSummary(scanResult);
      
      // Save scan results
      await this.saveScanResults(scanId, scanResult);
      
      console.log(`✅ Security scan completed in ${scanResult.duration}ms`);
      console.log(`📊 Found ${scanResult.summary.total} issues (${scanResult.summary.critical} critical, ${scanResult.summary.high} high)`);
      
      return scanResult;
      
    } catch (error) {
      console.error('❌ Security scan failed:', error.message);
      throw error;
    }
  }

  async scanDependencies(scanResult) {
    console.log('📦 Scanning dependencies...');
    
    try {
      // Check for vulnerabilities using npm audit
      const auditResult = await this.runNpmAudit();
      scanResult.vulnerabilities.push(...auditResult);
      
      // Check for outdated dependencies
      const outdatedResult = await this.checkOutdatedDependencies();
      scanResult.issues.push(...outdatedResult);
      
      // Check for license compliance
      const licenseResult = await this.checkLicenseCompliance();
      scanResult.issues.push(...licenseResult);
      
    } catch (error) {
      console.error('❌ Dependency scan failed:', error.message);
    }
  }

  async runNpmAudit() {
    try {
      const result = execSync('npm audit --json', { 
        encoding: 'utf-8',
        cwd: this.root,
        timeout: 30000
      });
      
      const audit = JSON.parse(result);
      const vulnerabilities = [];
      
      if (audit.vulnerabilities) {
        for (const [name, vuln] of Object.entries(audit.vulnerabilities)) {
          vulnerabilities.push({
            type: 'dependency-vulnerability',
            severity: this.mapSeverity(vuln.severity),
            package: name,
            description: vuln.description,
            recommendation: vuln.recommendation,
            cwe: vuln.cwe,
            cve: vuln.cve
          });
        }
      }
      
      return vulnerabilities;
      
    } catch (error) {
      console.log('⚠️  npm audit not available or failed');
      return [];
    }
  }

  async checkOutdatedDependencies() {
    try {
      const result = execSync('npm outdated --json', { 
        encoding: 'utf-8',
        cwd: this.root,
        timeout: 30000
      });
      
      const outdated = JSON.parse(result);
      const issues = [];
      
      for (const [name, info] of Object.entries(outdated)) {
        issues.push({
          type: 'outdated-dependency',
          severity: 'medium',
          package: name,
          current: info.current,
          wanted: info.wanted,
          latest: info.latest,
          description: `Package ${name} is outdated`
        });
      }
      
      return issues;
      
    } catch (error) {
      // No outdated packages or command failed
      return [];
    }
  }

  async checkLicenseCompliance() {
    try {
      const result = execSync('npx license-checker --json', { 
        encoding: 'utf-8',
        cwd: this.root,
        timeout: 30000
      });
      
      const licenses = JSON.parse(result);
      const issues = [];
      
      const problematicLicenses = ['GPL', 'AGPL', 'LGPL', 'Copyleft'];
      
      for (const [name, info] of Object.entries(licenses)) {
        const license = info.licenses || info.license;
        if (license && problematicLicenses.some(p => license.includes(p))) {
          issues.push({
            type: 'license-compliance',
            severity: 'medium',
            package: name,
            license,
            description: `Package ${name} has potentially problematic license: ${license}`
          });
        }
      }
      
      return issues;
      
    } catch (error) {
      console.log('⚠️  License checker not available');
      return [];
    }
  }

  async scanCode(scanResult) {
    console.log('💻 Scanning code for security issues...');
    
    try {
      // Find source files
      const sourceFiles = await this.findSourceFiles();
      
      for (const file of sourceFiles) {
        const content = await fs.readFile(file, 'utf-8');
        const issues = await this.analyzeCodeFile(file, content);
        scanResult.issues.push(...issues);
      }
      
    } catch (error) {
      console.error('❌ Code scan failed:', error.message);
    }
  }

  async findSourceFiles() {
    const files = [];
    const srcDir = join(this.root, 'src');
    
    try {
      const entries = await fs.readdir(srcDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(srcDir, entry.name);
        
        if (entry.isDirectory()) {
          files.push(...await this.findSourceFilesInDir(fullPath));
        } else if (this.isSourceFile(entry.name)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
    
    return files;
  }

  async findSourceFilesInDir(dir) {
    const files = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        
        if (entry.isDirectory()) {
          files.push(...await this.findSourceFilesInDir(fullPath));
        } else if (this.isSourceFile(entry.name)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
    
    return files;
  }

  isSourceFile(filename) {
    const ext = extname(filename);
    return ['.ts', '.tsx', '.js', '.jsx', '.py', '.java', '.cs', '.php', '.rb', '.go'].includes(ext);
  }

  async analyzeCodeFile(filePath, content) {
    const issues = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;
      
      // Check for hardcoded secrets
      issues.push(...this.checkHardcodedSecrets(line, lineNumber, filePath));
      
      // Check for SQL injection
      issues.push(...this.checkSQLInjection(line, lineNumber, filePath));
      
      // Check for XSS vulnerabilities
      issues.push(...this.checkXSS(line, lineNumber, filePath));
      
      // Check for insecure random
      issues.push(...this.checkInsecureRandom(line, lineNumber, filePath));
      
      // Check for weak crypto
      issues.push(...this.checkWeakCrypto(line, lineNumber, filePath));
    }
    
    return issues;
  }

  checkHardcodedSecrets(line, lineNumber, filePath) {
    const issues = [];
    
    // Common secret patterns
    const secretPatterns = [
      /password\s*=\s*['"][^'"]+['"]/i,
      /api[_-]?key\s*=\s*['"][^'"]+['"]/i,
      /secret\s*=\s*['"][^'"]+['"]/i,
      /token\s*=\s*['"][^'"]+['"]/i,
      /private[_-]?key\s*=\s*['"][^'"]+['"]/i,
      /aws[_-]?access[_-]?key/i,
      /aws[_-]?secret[_-]?key/i,
      /database[_-]?password/i,
      /db[_-]?password/i
    ];
    
    for (const pattern of secretPatterns) {
      if (pattern.test(line)) {
        issues.push({
          type: 'hardcoded-secret',
          severity: 'critical',
          file: filePath,
          line: lineNumber,
          description: 'Hardcoded secret detected',
          recommendation: 'Use environment variables or secure configuration management'
        });
      }
    }
    
    return issues;
  }

  checkSQLInjection(line, lineNumber, filePath) {
    const issues = [];
    
    // SQL injection patterns
    const sqlPatterns = [
      /SELECT\s+.*\s+FROM\s+.*\s+WHERE\s+.*\+/i,
      /INSERT\s+INTO\s+.*\s+VALUES\s+.*\+/i,
      /UPDATE\s+.*\s+SET\s+.*\+/i,
      /DELETE\s+FROM\s+.*\s+WHERE\s+.*\+/i,
      /query\s*\(\s*['"][^'"]*\+/i,
      /execute\s*\(\s*['"][^'"]*\+/i
    ];
    
    for (const pattern of sqlPatterns) {
      if (pattern.test(line)) {
        issues.push({
          type: 'sql-injection',
          severity: 'high',
          file: filePath,
          line: lineNumber,
          description: 'Potential SQL injection vulnerability',
          recommendation: 'Use parameterized queries or prepared statements'
        });
      }
    }
    
    return issues;
  }

  checkXSS(line, lineNumber, filePath) {
    const issues = [];
    
    // XSS patterns
    const xssPatterns = [
      /innerHTML\s*=\s*[^;]+/i,
      /document\.write\s*\(/i,
      /eval\s*\(/i,
      /setTimeout\s*\(\s*['"][^'"]*\+/i,
      /setInterval\s*\(\s*['"][^'"]*\+/i
    ];
    
    for (const pattern of xssPatterns) {
      if (pattern.test(line)) {
        issues.push({
          type: 'xss-vulnerability',
          severity: 'high',
          file: filePath,
          line: lineNumber,
          description: 'Potential XSS vulnerability',
          recommendation: 'Sanitize user input and use safe DOM manipulation methods'
        });
      }
    }
    
    return issues;
  }

  checkInsecureRandom(line, lineNumber, filePath) {
    const issues = [];
    
    // Insecure random patterns
    const insecureRandomPatterns = [
      /Math\.random\(\)/i,
      /new\s+Date\(\)\.getTime\(\)/i,
      /Date\.now\(\)/i
    ];
    
    for (const pattern of insecureRandomPatterns) {
      if (pattern.test(line)) {
        issues.push({
          type: 'insecure-random',
          severity: 'medium',
          file: filePath,
          line: lineNumber,
          description: 'Insecure random number generation',
          recommendation: 'Use cryptographically secure random number generators'
        });
      }
    }
    
    return issues;
  }

  checkWeakCrypto(line, lineNumber, filePath) {
    const issues = [];
    
    // Weak crypto patterns
    const weakCryptoPatterns = [
      /MD5/i,
      /SHA1/i,
      /DES/i,
      /RC4/i,
      /crypto\.createHash\s*\(\s*['"]md5['"]/i,
      /crypto\.createHash\s*\(\s*['"]sha1['"]/i
    ];
    
    for (const pattern of weakCryptoPatterns) {
      if (pattern.test(line)) {
        issues.push({
          type: 'weak-crypto',
          severity: 'high',
          file: filePath,
          line: lineNumber,
          description: 'Weak cryptographic algorithm detected',
          recommendation: 'Use stronger cryptographic algorithms like SHA-256 or SHA-3'
        });
      }
    }
    
    return issues;
  }

  async scanConfiguration(scanResult) {
    console.log('⚙️  Scanning configuration files...');
    
    try {
      // Check for insecure headers
      const headerIssues = await this.checkInsecureHeaders();
      scanResult.issues.push(...headerIssues);
      
      // Check for CORS misconfiguration
      const corsIssues = await this.checkCORSConfiguration();
      scanResult.issues.push(...corsIssues);
      
      // Check for HTTPS enforcement
      const httpsIssues = await this.checkHTTPSEnforcement();
      scanResult.issues.push(...httpsIssues);
      
    } catch (error) {
      console.error('❌ Configuration scan failed:', error.message);
    }
  }

  async checkInsecureHeaders() {
    const issues = [];
    
    // Check for common configuration files
    const configFiles = [
      'nginx.conf',
      'apache.conf',
      '.htaccess',
      'web.config',
      'vercel.json',
      'netlify.toml'
    ];
    
    for (const file of configFiles) {
      try {
        const content = await fs.readFile(join(this.root, file), 'utf-8');
        
        // Check for missing security headers
        if (!content.includes('X-Content-Type-Options')) {
          issues.push({
            type: 'insecure-headers',
            severity: 'medium',
            file,
            description: 'Missing X-Content-Type-Options header',
            recommendation: 'Add X-Content-Type-Options: nosniff header'
          });
        }
        
        if (!content.includes('X-Frame-Options')) {
          issues.push({
            type: 'insecure-headers',
            severity: 'medium',
            file,
            description: 'Missing X-Frame-Options header',
            recommendation: 'Add X-Frame-Options: DENY or SAMEORIGIN header'
          });
        }
        
        if (!content.includes('X-XSS-Protection')) {
          issues.push({
            type: 'insecure-headers',
            severity: 'medium',
            file,
            description: 'Missing X-XSS-Protection header',
            recommendation: 'Add X-XSS-Protection: 1; mode=block header'
          });
        }
        
      } catch {
        // File doesn't exist, skip
      }
    }
    
    return issues;
  }

  async checkCORSConfiguration() {
    const issues = [];
    
    // Check for CORS configuration in common files
    const corsFiles = [
      'cors.js',
      'app.js',
      'server.js',
      'index.js',
      'main.js'
    ];
    
    for (const file of corsFiles) {
      try {
        const content = await fs.readFile(join(this.root, file), 'utf-8');
        
        // Check for overly permissive CORS
        if (content.includes('origin: true') || content.includes('origin: "*"')) {
          issues.push({
            type: 'cors-misconfiguration',
            severity: 'medium',
            file,
            description: 'Overly permissive CORS configuration',
            recommendation: 'Restrict CORS to specific origins'
          });
        }
        
      } catch {
        // File doesn't exist, skip
      }
    }
    
    return issues;
  }

  async checkHTTPSEnforcement() {
    const issues = [];
    
    // Check for HTTPS enforcement in configuration files
    const configFiles = [
      'nginx.conf',
      'apache.conf',
      '.htaccess',
      'web.config'
    ];
    
    for (const file of configFiles) {
      try {
        const content = await fs.readFile(join(this.root, file), 'utf-8');
        
        if (!content.includes('https') && !content.includes('ssl')) {
          issues.push({
            type: 'https-enforcement',
            severity: 'high',
            file,
            description: 'No HTTPS enforcement detected',
            recommendation: 'Implement HTTPS enforcement and redirect HTTP to HTTPS'
          });
        }
        
      } catch {
        // File doesn't exist, skip
      }
    }
    
    return issues;
  }

  async scanSecrets(scanResult) {
    console.log('🔐 Scanning for secrets...');
    
    try {
      // Check for common secret files
      const secretFiles = [
        '.env',
        '.env.local',
        '.env.production',
        'config.json',
        'secrets.json',
        'credentials.json'
      ];
      
      for (const file of secretFiles) {
        try {
          const content = await fs.readFile(join(this.root, file), 'utf-8');
          const issues = this.analyzeSecretFile(file, content);
          scanResult.issues.push(...issues);
        } catch {
          // File doesn't exist, skip
        }
      }
      
    } catch (error) {
      console.error('❌ Secret scan failed:', error.message);
    }
  }

  analyzeSecretFile(fileName, content) {
    const issues = [];
    
    // Check for exposed secrets
    const secretPatterns = [
      /password\s*=\s*[^\\s]+/i,
      /api[_-]?key\s*=\s*[^\\s]+/i,
      /secret\s*=\s*[^\\s]+/i,
      /token\s*=\s*[^\\s]+/i,
      /private[_-]?key\s*=\s*[^\\s]+/i
    ];
    
    for (const pattern of secretPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        issues.push({
          type: 'exposed-secret',
          severity: 'critical',
          file: fileName,
          description: 'Secret exposed in configuration file',
          recommendation: 'Move secrets to environment variables or secure secret management'
        });
      }
    }
    
    return issues;
  }

  async scanNetwork(scanResult) {
    console.log('🌐 Scanning network configuration...');
    
    try {
      // Check for open ports
      const portIssues = await this.checkOpenPorts();
      scanResult.issues.push(...portIssues);
      
      // Check for SSL/TLS configuration
      const sslIssues = await this.checkSSLConfiguration();
      scanResult.issues.push(...sslIssues);
      
    } catch (error) {
      console.error('❌ Network scan failed:', error.message);
    }
  }

  async checkOpenPorts() {
    const issues = [];
    
    // Check for common open ports
    const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995];
    
    for (const port of commonPorts) {
      try {
        const result = execSync(`netstat -tuln | grep :${port}`, { 
          encoding: 'utf-8',
          timeout: 5000
        });
        
        if (result.trim()) {
          issues.push({
            type: 'open-port',
            severity: 'medium',
            port,
            description: `Port ${port} is open`,
            recommendation: 'Close unnecessary ports or secure them properly'
          });
        }
        
      } catch {
        // Port not open or command failed
      }
    }
    
    return issues;
  }

  async checkSSLConfiguration() {
    const issues = [];
    
    // Check for SSL certificate issues
    try {
      const result = execSync('openssl s_client -connect localhost:443 -servername localhost < /dev/null 2>/dev/null | openssl x509 -noout -text', {
        encoding: 'utf-8',
        timeout: 10000
      });
      
      // Check certificate expiration
      const expirationMatch = result.match(/Not After : (.+)/);
      if (expirationMatch) {
        const expirationDate = new Date(expirationMatch[1]);
        const daysUntilExpiry = Math.ceil((expirationDate - new Date()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry < 30) {
          issues.push({
            type: 'ssl-expiration',
            severity: 'high',
            description: `SSL certificate expires in ${daysUntilExpiry} days`,
            recommendation: 'Renew SSL certificate before expiration'
          });
        }
      }
      
    } catch {
      // SSL check failed or not applicable
    }
    
    return issues;
  }

  generateSummary(scanResult) {
    const summary = {
      total: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };
    
    // Count vulnerabilities
    for (const vuln of scanResult.vulnerabilities) {
      summary.total++;
      summary[vuln.severity]++;
    }
    
    // Count issues
    for (const issue of scanResult.issues) {
      summary.total++;
      summary[issue.severity]++;
    }
    
    scanResult.summary = summary;
  }

  async saveScanResults(scanId, scanResult) {
    const resultPath = join(this.outputDir, `${scanId}.json`);
    await fs.writeFile(resultPath, JSON.stringify(scanResult, null, 2));
  }

  mapSeverity(severity) {
    const severityMap = {
      'critical': 'critical',
      'high': 'high',
      'moderate': 'medium',
      'low': 'low',
      'info': 'low'
    };
    
    return severityMap[severity] || 'low';
  }

  async generateReport() {
    const reports = [];
    
    try {
      const files = await fs.readdir(this.outputDir);
      const scanFiles = files.filter(f => f.startsWith('scan-') && f.endsWith('.json'));
      
      for (const file of scanFiles) {
        const content = await fs.readFile(join(this.outputDir, file), 'utf-8');
        const scanResult = JSON.parse(content);
        reports.push(scanResult);
      }
      
    } catch (error) {
      console.error('❌ Failed to generate security report:', error.message);
    }
    
    return reports;
  }

  getVulnerabilities() {
    return Array.from(this.vulnerabilities.values());
  }

  getSecurityIssues() {
    return Array.from(this.securityIssues.values());
  }

  getScanResults() {
    return Array.from(this.scanResults.values());
  }

  getPolicies() {
    return Array.from(this.policies.values());
  }
}