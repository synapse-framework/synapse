/**
 * Metrics Registry - Central registry for all metrics with metadata and querying
 */
import type { MetricType } from './metrics-collector.js';
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
export declare class MetricsRegistry {
    private metadata;
    private categories;
    private tags;
    /**
     * Register metric metadata
     */
    register(name: string, type: MetricType, description: string, options?: {
        readonly unit?: string;
        readonly labels?: string[];
        readonly category?: string;
        readonly tags?: string[];
    }): void;
    /**
     * Update metric metadata
     */
    update(name: string, updates: Partial<Omit<MetricMetadata, 'name' | 'registeredAt'>>): void;
    /**
     * Unregister a metric
     */
    unregister(name: string): void;
    /**
     * Get metric metadata
     */
    getMetadata(name: string): MetricMetadata | undefined;
    /**
     * Check if metric is registered
     */
    has(name: string): boolean;
    /**
     * Get all metric metadata
     */
    getAllMetadata(): MetricMetadata[];
    /**
     * Query metrics by filter
     */
    query(query?: MetricQuery): MetricMetadata[];
    /**
     * Get metrics by category
     */
    getByCategory(category: string): MetricMetadata[];
    /**
     * Get metrics by tag
     */
    getByTag(tag: string): MetricMetadata[];
    /**
     * Get all categories
     */
    getCategories(): string[];
    /**
     * Get all tags
     */
    getTags(): string[];
    /**
     * Get metrics count
     */
    getCount(): number;
    /**
     * Clear all metrics
     */
    clear(): void;
    /**
     * Search metrics by name pattern
     */
    search(pattern: string): MetricMetadata[];
    /**
     * Get metrics statistics
     */
    getStats(): {
        readonly totalMetrics: number;
        readonly byType: Record<MetricType, number>;
        readonly byCategory: Record<string, number>;
        readonly totalCategories: number;
        readonly totalTags: number;
    };
    /**
     * Apply filter to results
     */
    private applyFilter;
    /**
     * Apply sorting to results
     */
    private applySorting;
    /**
     * Export registry to JSON
     */
    toJSON(): string;
    /**
     * Import registry from JSON
     */
    fromJSON(json: string): void;
}
//# sourceMappingURL=metrics-registry.d.ts.map