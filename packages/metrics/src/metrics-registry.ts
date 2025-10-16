/**
 * Metrics Registry - Central registry for all metrics with metadata and querying
 */

import type { Metric, MetricType } from './metrics-collector.js';

export interface MetricMetadata {
  readonly name: string;
  readonly type: MetricType;
  readonly description: string;
  readonly unit: string;
  readonly labels: string[];
  readonly category: string;
  readonly tags: string[];
  readonly registeredAt: number;
  readonly lastUpdated: number;
}

export interface MetricFilter {
  readonly name?: string;
  readonly type?: MetricType;
  readonly category?: string;
  readonly tags?: string[];
  readonly labels?: string[];
}

export interface MetricQuery {
  readonly filter?: MetricFilter;
  readonly sortBy?: 'name' | 'type' | 'category' | 'lastUpdated';
  readonly sortOrder?: 'asc' | 'desc';
  readonly limit?: number;
  readonly offset?: number;
}

export class MetricsRegistry {
  private metadata = new Map<string, MetricMetadata>();
  private categories = new Map<string, Set<string>>();
  private tags = new Map<string, Set<string>>();

  /**
   * Register metric metadata
   */
  public register(
    name: string,
    type: MetricType,
    description: string,
    options: {
      readonly unit?: string;
      readonly labels?: string[];
      readonly category?: string;
      readonly tags?: string[];
    } = {}
  ): void {
    if (this.metadata.has(name)) {
      throw new Error(`Metric '${name}' is already registered in the registry`);
    }

    const category = options.category || 'default';
    const tags = options.tags || [];

    const meta: MetricMetadata = {
      name,
      type,
      description,
      unit: options.unit || '',
      labels: options.labels || [],
      category,
      tags,
      registeredAt: Date.now(),
      lastUpdated: Date.now()
    };

    this.metadata.set(name, meta);

    // Update category index
    const categoryMetrics = this.categories.get(category) || new Set();
    categoryMetrics.add(name);
    this.categories.set(category, categoryMetrics);

    // Update tag index
    for (const tag of tags) {
      const tagMetrics = this.tags.get(tag) || new Set();
      tagMetrics.add(name);
      this.tags.set(tag, tagMetrics);
    }
  }

  /**
   * Update metric metadata
   */
  public update(name: string, updates: Partial<Omit<MetricMetadata, 'name' | 'registeredAt'>>): void {
    const existing = this.metadata.get(name);
    if (existing === undefined) {
      throw new Error(`Metric '${name}' is not registered`);
    }

    // If category changed, update index
    if (updates.category !== undefined && updates.category !== existing.category) {
      const oldCategoryMetrics = this.categories.get(existing.category);
      if (oldCategoryMetrics !== undefined) {
        oldCategoryMetrics.delete(name);
      }

      const newCategoryMetrics = this.categories.get(updates.category) || new Set();
      newCategoryMetrics.add(name);
      this.categories.set(updates.category, newCategoryMetrics);
    }

    // If tags changed, update index
    if (updates.tags !== undefined) {
      // Remove from old tags
      for (const tag of existing.tags) {
        const tagMetrics = this.tags.get(tag);
        if (tagMetrics !== undefined) {
          tagMetrics.delete(name);
        }
      }

      // Add to new tags
      for (const tag of updates.tags) {
        const tagMetrics = this.tags.get(tag) || new Set();
        tagMetrics.add(name);
        this.tags.set(tag, tagMetrics);
      }
    }

    this.metadata.set(name, {
      ...existing,
      ...updates,
      lastUpdated: Date.now()
    });
  }

  /**
   * Unregister a metric
   */
  public unregister(name: string): void {
    const meta = this.metadata.get(name);
    if (meta === undefined) {
      return;
    }

    // Remove from category index
    const categoryMetrics = this.categories.get(meta.category);
    if (categoryMetrics !== undefined) {
      categoryMetrics.delete(name);
    }

    // Remove from tag index
    for (const tag of meta.tags) {
      const tagMetrics = this.tags.get(tag);
      if (tagMetrics !== undefined) {
        tagMetrics.delete(name);
      }
    }

    this.metadata.delete(name);
  }

  /**
   * Get metric metadata
   */
  public getMetadata(name: string): MetricMetadata | undefined {
    return this.metadata.get(name);
  }

  /**
   * Check if metric is registered
   */
  public has(name: string): boolean {
    return this.metadata.has(name);
  }

  /**
   * Get all metric metadata
   */
  public getAllMetadata(): MetricMetadata[] {
    return Array.from(this.metadata.values());
  }

  /**
   * Query metrics by filter
   */
  public query(query: MetricQuery = {}): MetricMetadata[] {
    let results = Array.from(this.metadata.values());

    // Apply filter
    if (query.filter !== undefined) {
      results = this.applyFilter(results, query.filter);
    }

    // Apply sorting
    if (query.sortBy !== undefined) {
      results = this.applySorting(results, query.sortBy, query.sortOrder || 'asc');
    }

    // Apply pagination
    if (query.offset !== undefined || query.limit !== undefined) {
      const offset = query.offset || 0;
      const limit = query.limit || results.length;
      results = results.slice(offset, offset + limit);
    }

    return results;
  }

  /**
   * Get metrics by category
   */
  public getByCategory(category: string): MetricMetadata[] {
    const metricNames = this.categories.get(category);
    if (metricNames === undefined) {
      return [];
    }

    return Array.from(metricNames)
      .map(name => this.metadata.get(name))
      .filter((meta): meta is MetricMetadata => meta !== undefined);
  }

  /**
   * Get metrics by tag
   */
  public getByTag(tag: string): MetricMetadata[] {
    const metricNames = this.tags.get(tag);
    if (metricNames === undefined) {
      return [];
    }

    return Array.from(metricNames)
      .map(name => this.metadata.get(name))
      .filter((meta): meta is MetricMetadata => meta !== undefined);
  }

  /**
   * Get all categories
   */
  public getCategories(): string[] {
    return Array.from(this.categories.keys());
  }

  /**
   * Get all tags
   */
  public getTags(): string[] {
    return Array.from(this.tags.keys());
  }

  /**
   * Get metrics count
   */
  public getCount(): number {
    return this.metadata.size;
  }

  /**
   * Clear all metrics
   */
  public clear(): void {
    this.metadata.clear();
    this.categories.clear();
    this.tags.clear();
  }

  /**
   * Search metrics by name pattern
   */
  public search(pattern: string): MetricMetadata[] {
    const regex = new RegExp(pattern, 'i');
    return Array.from(this.metadata.values())
      .filter(meta => regex.test(meta.name) || regex.test(meta.description));
  }

  /**
   * Get metrics statistics
   */
  public getStats(): {
    readonly totalMetrics: number;
    readonly byType: Record<MetricType, number>;
    readonly byCategory: Record<string, number>;
    readonly totalCategories: number;
    readonly totalTags: number;
  } {
    const byType: Record<MetricType, number> = {
      counter: 0,
      gauge: 0,
      histogram: 0,
      summary: 0
    };

    const byCategory: Record<string, number> = {};

    for (const meta of this.metadata.values()) {
      byType[meta.type] = (byType[meta.type] || 0) + 1;
      byCategory[meta.category] = (byCategory[meta.category] || 0) + 1;
    }

    return {
      totalMetrics: this.metadata.size,
      byType,
      byCategory,
      totalCategories: this.categories.size,
      totalTags: this.tags.size
    };
  }

  /**
   * Apply filter to results
   */
  private applyFilter(results: MetricMetadata[], filter: MetricFilter): MetricMetadata[] {
    return results.filter(meta => {
      if (filter.name !== undefined && meta.name !== filter.name) {
        return false;
      }

      if (filter.type !== undefined && meta.type !== filter.type) {
        return false;
      }

      if (filter.category !== undefined && meta.category !== filter.category) {
        return false;
      }

      if (filter.tags !== undefined && filter.tags.length > 0) {
        const hasAllTags = filter.tags.every(tag => meta.tags.includes(tag));
        if (!hasAllTags) {
          return false;
        }
      }

      if (filter.labels !== undefined && filter.labels.length > 0) {
        const hasAllLabels = filter.labels.every(label => meta.labels.includes(label));
        if (!hasAllLabels) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Apply sorting to results
   */
  private applySorting(
    results: MetricMetadata[],
    sortBy: 'name' | 'type' | 'category' | 'lastUpdated',
    sortOrder: 'asc' | 'desc'
  ): MetricMetadata[] {
    const sorted = [...results].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'lastUpdated':
          comparison = a.lastUpdated - b.lastUpdated;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }

  /**
   * Export registry to JSON
   */
  public toJSON(): string {
    return JSON.stringify(Array.from(this.metadata.values()), null, 2);
  }

  /**
   * Import registry from JSON
   */
  public fromJSON(json: string): void {
    const data = JSON.parse(json) as MetricMetadata[];

    for (const meta of data) {
      this.register(meta.name, meta.type, meta.description, {
        unit: meta.unit,
        labels: meta.labels,
        category: meta.category,
        tags: meta.tags
      });
    }
  }
}
