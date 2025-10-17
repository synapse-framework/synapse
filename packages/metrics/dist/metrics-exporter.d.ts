/**
 * Metrics Exporter - Export metrics in various formats
 */
import type { Metric } from './metrics-collector.js';
import type { AggregatedMetric } from './metrics-aggregator.js';
export type ExportFormat = 'prometheus' | 'json' | 'csv' | 'influxdb' | 'graphite';
export interface ExportOptions {
    readonly format: ExportFormat;
    readonly includeTimestamps: boolean;
    readonly includeLabels: boolean;
    readonly includeMetadata: boolean;
    readonly timestampFormat: 'unix' | 'iso';
}
export interface ExportedData {
    readonly format: ExportFormat;
    readonly content: string;
    readonly timestamp: number;
    readonly metricCount: number;
}
export declare class MetricsExporter {
    private readonly defaultOptions;
    /**
     * Export metrics
     */
    export(metrics: Metric[], options?: Partial<ExportOptions>): ExportedData;
    /**
     * Export aggregated metrics
     */
    exportAggregated(aggregated: AggregatedMetric[], options?: Partial<ExportOptions>): ExportedData;
    /**
     * Export to Prometheus format
     */
    private exportPrometheus;
    /**
     * Export to JSON format
     */
    private exportJSON;
    /**
     * Export to CSV format
     */
    private exportCSV;
    /**
     * Export to InfluxDB line protocol
     */
    private exportInfluxDB;
    /**
     * Export to Graphite format
     */
    private exportGraphite;
    /**
     * Convert aggregated metrics to specified format
     */
    private convertAggregatedToFormat;
    /**
     * Convert aggregated to Prometheus
     */
    private aggregatedToPrometheus;
    /**
     * Convert aggregated to CSV
     */
    private aggregatedToCSV;
    /**
     * Convert aggregated to InfluxDB
     */
    private aggregatedToInfluxDB;
    /**
     * Convert aggregated to Graphite
     */
    private aggregatedToGraphite;
    /**
     * Get Prometheus metric type
     */
    private getPrometheusType;
    /**
     * Format Prometheus labels
     */
    private formatPrometheusLabels;
    /**
     * Export to file (returns content to be written)
     */
    exportToFile(metrics: Metric[], filePath: string, options?: Partial<ExportOptions>): ExportedData;
    /**
     * Get supported formats
     */
    getSupportedFormats(): ExportFormat[];
}
//# sourceMappingURL=metrics-exporter.d.ts.map