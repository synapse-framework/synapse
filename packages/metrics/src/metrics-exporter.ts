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

export class MetricsExporter {
  private readonly defaultOptions: ExportOptions = {
    format: 'json',
    includeTimestamps: true,
    includeLabels: true,
    includeMetadata: true,
    timestampFormat: 'unix'
  };

  /**
   * Export metrics
   */
  public export(metrics: Metric[], options?: Partial<ExportOptions>): ExportedData {
    const opts = { ...this.defaultOptions, ...options };

    let content: string;
    switch (opts.format) {
      case 'prometheus':
        content = this.exportPrometheus(metrics, opts);
        break;
      case 'json':
        content = this.exportJSON(metrics, opts);
        break;
      case 'csv':
        content = this.exportCSV(metrics, opts);
        break;
      case 'influxdb':
        content = this.exportInfluxDB(metrics, opts);
        break;
      case 'graphite':
        content = this.exportGraphite(metrics, opts);
        break;
    }

    return {
      format: opts.format,
      content,
      timestamp: Date.now(),
      metricCount: metrics.length
    };
  }

  /**
   * Export aggregated metrics
   */
  public exportAggregated(
    aggregated: AggregatedMetric[],
    options?: Partial<ExportOptions>
  ): ExportedData {
    const opts = { ...this.defaultOptions, ...options };

    const content = opts.format === 'json'
      ? JSON.stringify(aggregated, null, 2)
      : this.convertAggregatedToFormat(aggregated, opts);

    return {
      format: opts.format,
      content,
      timestamp: Date.now(),
      metricCount: aggregated.length
    };
  }

  /**
   * Export to Prometheus format
   */
  private exportPrometheus(metrics: Metric[], options: ExportOptions): string {
    const lines: string[] = [];

    for (const metric of metrics) {
      // Add HELP line
      lines.push(`# HELP ${metric.name} ${metric.description}`);

      // Add TYPE line
      const promType = this.getPrometheusType(metric.type);
      lines.push(`# TYPE ${metric.name} ${promType}`);

      // Add metric values
      if (metric.values.length > 0) {
        const latestValue = metric.values[metric.values.length - 1];
        if (latestValue !== undefined) {
          const labels = options.includeLabels && Object.keys(latestValue.labels).length > 0
            ? `{${this.formatPrometheusLabels(latestValue.labels)}}`
            : '';

          const timestamp = options.includeTimestamps
            ? ` ${latestValue.timestamp}`
            : '';

          lines.push(`${metric.name}${labels} ${latestValue.value}${timestamp}`);
        }
      }

      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Export to JSON format
   */
  private exportJSON(metrics: Metric[], options: ExportOptions): string {
    const data = metrics.map(metric => {
      const result: Record<string, unknown> = {
        name: metric.name,
        type: metric.type,
        description: metric.description
      };

      if (options.includeMetadata) {
        result['unit'] = metric.unit;
        result['labels'] = metric.labels;
      }

      result['values'] = metric.values.map(v => {
        const value: Record<string, unknown> = {
          value: v.value
        };

        if (options.includeTimestamps) {
          value['timestamp'] = options.timestampFormat === 'iso'
            ? new Date(v.timestamp).toISOString()
            : v.timestamp;
        }

        if (options.includeLabels && Object.keys(v.labels).length > 0) {
          value['labels'] = v.labels;
        }

        return value;
      });

      return result;
    });

    return JSON.stringify(data, null, 2);
  }

  /**
   * Export to CSV format
   */
  private exportCSV(metrics: Metric[], options: ExportOptions): string {
    const lines: string[] = [];

    // Header
    const headers = ['metric_name', 'metric_type', 'value'];
    if (options.includeTimestamps) {
      headers.push('timestamp');
    }
    if (options.includeLabels) {
      headers.push('labels');
    }
    lines.push(headers.join(','));

    // Data
    for (const metric of metrics) {
      for (const value of metric.values) {
        const row = [
          metric.name,
          metric.type,
          value.value.toString()
        ];

        if (options.includeTimestamps) {
          const timestamp = options.timestampFormat === 'iso'
            ? new Date(value.timestamp).toISOString()
            : value.timestamp.toString();
          row.push(timestamp);
        }

        if (options.includeLabels) {
          row.push(JSON.stringify(value.labels));
        }

        lines.push(row.join(','));
      }
    }

    return lines.join('\n');
  }

  /**
   * Export to InfluxDB line protocol
   */
  private exportInfluxDB(metrics: Metric[], options: ExportOptions): string {
    const lines: string[] = [];

    for (const metric of metrics) {
      for (const value of metric.values) {
        const measurement = metric.name;

        const tags = options.includeLabels && Object.keys(value.labels).length > 0
          ? ',' + Object.entries(value.labels)
              .map(([k, v]) => `${k}=${v}`)
              .join(',')
          : '';

        const fields = `value=${value.value}`;

        const timestamp = options.includeTimestamps
          ? ` ${value.timestamp}000000` // InfluxDB uses nanoseconds
          : '';

        lines.push(`${measurement}${tags} ${fields}${timestamp}`);
      }
    }

    return lines.join('\n');
  }

  /**
   * Export to Graphite format
   */
  private exportGraphite(metrics: Metric[], options: ExportOptions): string {
    const lines: string[] = [];

    for (const metric of metrics) {
      for (const value of metric.values) {
        const path = metric.name;

        const timestamp = options.includeTimestamps
          ? ` ${Math.floor(value.timestamp / 1000)}` // Graphite uses seconds
          : '';

        lines.push(`${path} ${value.value}${timestamp}`);
      }
    }

    return lines.join('\n');
  }

  /**
   * Convert aggregated metrics to specified format
   */
  private convertAggregatedToFormat(
    aggregated: AggregatedMetric[],
    options: ExportOptions
  ): string {
    switch (options.format) {
      case 'prometheus':
        return this.aggregatedToPrometheus(aggregated);
      case 'csv':
        return this.aggregatedToCSV(aggregated);
      case 'influxdb':
        return this.aggregatedToInfluxDB(aggregated);
      case 'graphite':
        return this.aggregatedToGraphite(aggregated);
      default:
        return JSON.stringify(aggregated, null, 2);
    }
  }

  /**
   * Convert aggregated to Prometheus
   */
  private aggregatedToPrometheus(aggregated: AggregatedMetric[]): string {
    const lines: string[] = [];

    for (const agg of aggregated) {
      const name = `${agg.name}_${agg.function}_${agg.period}`;
      lines.push(`# TYPE ${name} gauge`);
      lines.push(`${name} ${agg.value} ${agg.endTime}`);
    }

    return lines.join('\n');
  }

  /**
   * Convert aggregated to CSV
   */
  private aggregatedToCSV(aggregated: AggregatedMetric[]): string {
    const lines: string[] = [];
    lines.push('name,period,function,value,start_time,end_time,sample_count');

    for (const agg of aggregated) {
      lines.push(
        `${agg.name},${agg.period},${agg.function},${agg.value},${agg.startTime},${agg.endTime},${agg.sampleCount}`
      );
    }

    return lines.join('\n');
  }

  /**
   * Convert aggregated to InfluxDB
   */
  private aggregatedToInfluxDB(aggregated: AggregatedMetric[]): string {
    const lines: string[] = [];

    for (const agg of aggregated) {
      lines.push(
        `${agg.name},period=${agg.period},function=${agg.function} value=${agg.value},sample_count=${agg.sampleCount}i ${agg.endTime}000000`
      );
    }

    return lines.join('\n');
  }

  /**
   * Convert aggregated to Graphite
   */
  private aggregatedToGraphite(aggregated: AggregatedMetric[]): string {
    const lines: string[] = [];

    for (const agg of aggregated) {
      const path = `${agg.name}.${agg.period}.${agg.function}`;
      const timestamp = Math.floor(agg.endTime / 1000);
      lines.push(`${path} ${agg.value} ${timestamp}`);
    }

    return lines.join('\n');
  }

  /**
   * Get Prometheus metric type
   */
  private getPrometheusType(type: string): string {
    const typeMap: Record<string, string> = {
      counter: 'counter',
      gauge: 'gauge',
      histogram: 'histogram',
      summary: 'summary'
    };

    return typeMap[type] || 'untyped';
  }

  /**
   * Format Prometheus labels
   */
  private formatPrometheusLabels(labels: Record<string, string>): string {
    return Object.entries(labels)
      .map(([key, value]) => `${key}="${value}"`)
      .join(',');
  }

  /**
   * Export to file (returns content to be written)
   */
  public exportToFile(
    metrics: Metric[],
    filePath: string,
    options?: Partial<ExportOptions>
  ): ExportedData {
    return this.export(metrics, options);
  }

  /**
   * Get supported formats
   */
  public getSupportedFormats(): ExportFormat[] {
    return ['prometheus', 'json', 'csv', 'influxdb', 'graphite'];
  }
}
