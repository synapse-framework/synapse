import type { Rule } from '@snps/rule-engine-rust';

export class PerformanceMonitor {
  private lastUpdate: Date = new Date();
  private rules: Rule[] = [];

  async getRules(): Promise<Rule[]> {
    if (this.rules.length === 0) {
      await this.updateRules();
    }
    return this.rules;
  }

  async updateRules(): Promise<{ source: string; rules: Rule[]; timestamp: string; version: string }> {
    try {
      // Fetch performance benchmarks and standards
      const [lighthouseData, bundleData, performanceStandards] = await Promise.all([
        this.fetchLighthouseStandards(),
        this.fetchBundleAnalysisData(),
        this.fetchPerformanceStandards()
      ]);

      // Process and create rules
      this.rules = [
        ...this.createLighthouseRules(lighthouseData),
        ...this.createBundleRules(bundleData),
        ...this.createPerformanceRules(performanceStandards),
        ...this.getDefaultPerformanceRules()
      ];

      this.lastUpdate = new Date();
      
      return {
        source: 'performance-monitor',
        rules: this.rules,
        timestamp: this.lastUpdate.toISOString(),
        version: '1.0.0'
      };
    } catch (error) {
      console.error('Error updating performance rules:', error);
      return {
        source: 'performance-monitor',
        rules: this.rules,
        timestamp: this.lastUpdate.toISOString(),
        version: '1.0.0'
      };
    }
  }

  private async fetchLighthouseStandards(): Promise<any[]> {
    try {
      // Fetch latest Lighthouse performance standards
      const response = await fetch('https://web.dev/lighthouse-performance/');
      if (!response.ok) {
        throw new Error(`Lighthouse standards error: ${response.status}`);
      }
      // This would parse the HTML to extract performance standards
      // For now, return mock data
      return [
        { metric: 'FCP', threshold: 1800, description: 'First Contentful Paint' },
        { metric: 'LCP', threshold: 2500, description: 'Largest Contentful Paint' },
        { metric: 'FID', threshold: 100, description: 'First Input Delay' },
        { metric: 'CLS', threshold: 0.1, description: 'Cumulative Layout Shift' }
      ];
    } catch (error) {
      console.warn('Failed to fetch Lighthouse standards:', error);
      return [];
    }
  }

  private async fetchBundleAnalysisData(): Promise<any[]> {
    try {
      // Fetch bundle analysis standards
      const response = await fetch('https://bundlephobia.com/api/size?package=react');
      if (!response.ok) {
        throw new Error(`Bundle analysis error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn('Failed to fetch bundle analysis data:', error);
      return [];
    }
  }

  private async fetchPerformanceStandards(): Promise<any[]> {
    try {
      // Fetch web performance standards
      const response = await fetch('https://web.dev/performance/');
      if (!response.ok) {
        throw new Error(`Performance standards error: ${response.status}`);
      }
      return [];
    } catch (error) {
      console.warn('Failed to fetch performance standards:', error);
      return [];
    }
  }

  private createLighthouseRules(data: any[]): Rule[] {
    return data.map(item => ({
      id: `PERF-LH-${item.metric}`,
      category: 'Performance',
      severity: 'Medium',
      title: `Lighthouse ${item.metric} Threshold`,
      description: `${item.description} should be under ${item.threshold}ms`,
      remediation: `Optimize ${item.metric} to meet performance standards`,
      pattern: item.metric,
      logic: 'contains',
      tags: ['performance', 'lighthouse', 'web-vitals', 'optimization'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  }

  private createBundleRules(data: any[]): Rule[] {
    return [
      {
        id: 'PERF-BUNDLE-001',
        category: 'Performance',
        severity: 'Medium',
        title: 'Bundle Size Optimization',
        description: 'JavaScript bundles should be optimized for size',
        remediation: 'Use code splitting, tree shaking, and compression',
        pattern: 'bundle\\.js|chunk\\.js|vendor\\.js',
        logic: 'contains',
        tags: ['performance', 'bundle', 'size', 'optimization'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  private createPerformanceRules(data: any[]): Rule[] {
    return [];
  }

  private getDefaultPerformanceRules(): Rule[] {
    return [
      {
        id: 'PERF-001',
        category: 'Performance',
        severity: 'High',
        title: 'No Synchronous File Operations',
        description: 'Synchronous file operations block the event loop',
        remediation: 'Use asynchronous file operations (fs.promises)',
        pattern: 'fs\\.(readFileSync|writeFileSync|existsSync|statSync)',
        logic: 'regex',
        tags: ['performance', 'async', 'file-io', 'blocking', 'auto-fixable'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'PERF-002',
        category: 'Performance',
        severity: 'Medium',
        title: 'Avoid Large Bundle Imports',
        description: 'Import only what you need from large libraries',
        remediation: 'Use tree-shaking friendly imports',
        pattern: 'import\\s+\\*\\s+as\\s+\\w+\\s+from\\s+["\']lodash["\']',
        logic: 'regex',
        tags: ['performance', 'bundle', 'imports', 'tree-shaking', 'auto-fixable'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'PERF-003',
        category: 'Performance',
        severity: 'Medium',
        title: 'Memory Leak Prevention',
        description: 'Event listeners should be properly cleaned up',
        remediation: 'Remove event listeners in cleanup functions',
        pattern: 'addEventListener(?!.*removeEventListener)',
        logic: 'regex',
        tags: ['performance', 'memory', 'event-listeners', 'cleanup'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'PERF-004',
        category: 'Performance',
        severity: 'Low',
        title: 'Image Optimization',
        description: 'Images should be optimized for web delivery',
        remediation: 'Use WebP format and appropriate sizing',
        pattern: '\\.(jpg|jpeg|png)(?!.*webp)',
        logic: 'regex',
        tags: ['performance', 'images', 'optimization', 'webp'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'PERF-005',
        category: 'Performance',
        severity: 'High',
        title: 'Database Query Optimization',
        description: 'Database queries should be optimized and indexed',
        remediation: 'Add database indexes and optimize query patterns',
        pattern: 'SELECT\\s+\\*\\s+FROM',
        logic: 'regex',
        tags: ['performance', 'database', 'queries', 'optimization'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'PERF-006',
        category: 'Performance',
        severity: 'Medium',
        title: 'Lazy Loading Implementation',
        description: 'Large components should be lazy loaded',
        remediation: 'Use React.lazy() or dynamic imports',
        pattern: 'import.*from.*["\'][^"\']*/(components|pages)/[^"\']*["\']',
        logic: 'regex',
        tags: ['performance', 'lazy-loading', 'code-splitting', 'react'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'PERF-007',
        category: 'Performance',
        severity: 'Low',
        title: 'CSS Optimization',
        description: 'CSS should be optimized and minified',
        remediation: 'Use CSS minification and remove unused styles',
        pattern: '\\s{2,}|\\n\\s*\\n',
        logic: 'regex',
        tags: ['performance', 'css', 'minification', 'optimization'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'PERF-008',
        category: 'Performance',
        severity: 'Medium',
        title: 'Caching Strategy',
        description: 'Implement proper caching for static assets',
        remediation: 'Add appropriate cache headers and service workers',
        pattern: 'Cache-Control|ETag|Last-Modified',
        logic: 'not_contains',
        tags: ['performance', 'caching', 'headers', 'service-worker'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }
}