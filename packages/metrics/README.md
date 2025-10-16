# @snps/metrics

Real-time metrics collection and monitoring dashboard for Synapse Framework.

## Features

- **Metrics Collection**: Counter, Gauge, Histogram, and Summary metrics
- **Real-time Dashboard**: Live dashboard with multiple widget types
- **Aggregation**: Time-based aggregation with multiple functions
- **Export**: Export to Prometheus, JSON, CSV, InfluxDB, and Graphite formats
- **Registry**: Central registry with metadata and querying
- **System Metrics**: Built-in system metrics collection
- **Zero Dependencies**: Built from scratch with no external dependencies

## Installation

```bash
npm install @snps/metrics
```

## Usage

### Basic Usage

```typescript
import { MetricsManager } from '@snps/metrics';

const metrics = new MetricsManager({
  enableAutoCollection: true,
  collectionInterval: 1000
});

// Register metrics
metrics.registerMetric('http_requests', 'counter', 'Total HTTP requests');
metrics.registerMetric('active_connections', 'gauge', 'Active connections');
metrics.registerMetric('request_duration', 'histogram', 'Request duration in ms');

// Record values
metrics.incrementCounter('http_requests');
metrics.setGauge('active_connections', 42);
metrics.observeHistogram('request_duration', 125);

// Get metrics
const allMetrics = metrics.getAllMetrics();
console.log(allMetrics);
```

### Metrics Collection

```typescript
import { MetricsCollector } from '@snps/metrics';

const collector = new MetricsCollector();

// Counter - monotonically increasing value
collector.registerMetric('api_calls', 'counter', 'Total API calls');
collector.incrementCounter('api_calls', 1);

// Gauge - value that can go up or down
collector.registerMetric('temperature', 'gauge', 'Current temperature');
collector.setGauge('temperature', 72.5);
collector.incrementGauge('temperature', 0.5);
collector.decrementGauge('temperature', 0.2);

// Histogram - distribution of values
collector.registerMetric('response_time', 'histogram', 'Response time');
collector.observeHistogram('response_time', 150);

// Summary - similar to histogram with percentiles
collector.registerMetric('batch_size', 'summary', 'Batch processing size');
collector.observeSummary('batch_size', 100);
```

### Dashboard

```typescript
import { MetricsDashboard } from '@snps/metrics';

const dashboard = new MetricsDashboard({
  title: 'Application Metrics',
  refreshInterval: 5000,
  theme: 'dark',
  autoRefresh: true,
  widgets: [
    {
      id: 'widget-1',
      type: 'line',
      title: 'Request Rate',
      metricName: 'http_requests',
      refreshInterval: 1000,
      position: { x: 0, y: 0, width: 6, height: 4 },
      config: {}
    },
    {
      id: 'widget-2',
      type: 'gauge',
      title: 'Active Users',
      metricName: 'active_users',
      refreshInterval: 5000,
      position: { x: 6, y: 0, width: 6, height: 4 },
      config: {}
    }
  ]
});

// Add widget
dashboard.addWidget({
  id: 'widget-3',
  type: 'number',
  title: 'Total Errors',
  metricName: 'errors_total',
  refreshInterval: 2000,
  position: { x: 0, y: 4, width: 3, height: 2 },
  config: {}
});

// Get dashboard data
const data = dashboard.getDashboardData();
console.log(data);
```

### Aggregation

```typescript
import { MetricsAggregator } from '@snps/metrics';

const aggregator = new MetricsAggregator();

// Aggregate over time period
const hourlyAverage = aggregator.aggregate(metric, '1h', 'average');
console.log('Hourly average:', hourlyAverage.value);

// Rolling aggregation
const rolling = aggregator.calculateRolling(metric, '5m', 'sum', 12);

// Compare periods
const comparison = aggregator.compare(metric, '1h', 'average');
console.log('Change:', comparison.percentageChange);

// Trend analysis
const trend = aggregator.analyzeTrend(metric, '15m', 'average', 20);
console.log('Trend:', trend.trend);
console.log('Slope:', trend.slope);
```

### Export

```typescript
import { MetricsExporter } from '@snps/metrics';

const exporter = new MetricsExporter();

// Export to Prometheus
const prometheus = exporter.export(metrics, { format: 'prometheus' });
console.log(prometheus.content);

// Export to JSON
const json = exporter.export(metrics, {
  format: 'json',
  includeTimestamps: true,
  includeLabels: true
});

// Export to CSV
const csv = exporter.export(metrics, { format: 'csv' });

// Export aggregated metrics
const aggregated = exporter.exportAggregated(aggregations, { format: 'json' });
```

### Registry

```typescript
import { MetricsRegistry } from '@snps/metrics';

const registry = new MetricsRegistry();

// Register with metadata
registry.register('api_latency', 'histogram', 'API endpoint latency', {
  unit: 'ms',
  labels: ['endpoint', 'method'],
  category: 'api',
  tags: ['performance', 'latency']
});

// Query metrics
const apiMetrics = registry.query({
  filter: { category: 'api' },
  sortBy: 'name',
  sortOrder: 'asc',
  limit: 10
});

// Get by category
const performanceMetrics = registry.getByCategory('performance');

// Get by tag
const latencyMetrics = registry.getByTag('latency');

// Search
const results = registry.search('latency');

// Get statistics
const stats = registry.getStats();
console.log('Total metrics:', stats.totalMetrics);
console.log('By type:', stats.byType);
```

### System Metrics

```typescript
import { MetricsManager } from '@snps/metrics';

const metrics = new MetricsManager({
  enableAutoCollection: true,
  collectionInterval: 1000
});

// Enable system metrics
metrics.enableSystemMetrics();

// System metrics are automatically collected:
// - system_cpu_usage
// - system_memory_usage
// - system_memory_total

// Get system metrics
const cpuMetric = metrics.getMetric('system_cpu_usage');
const memoryMetric = metrics.getMetric('system_memory_usage');
```

## API Reference

### MetricsManager

Main interface for metrics management.

#### Methods

- `registerMetric(name, type, description, options)` - Register a metric
- `incrementCounter(name, value?, labels?)` - Increment counter
- `setGauge(name, value, labels?)` - Set gauge value
- `incrementGauge(name, value?, labels?)` - Increment gauge
- `decrementGauge(name, value?, labels?)` - Decrement gauge
- `observeHistogram(name, value, labels?)` - Observe histogram value
- `observeSummary(name, value, labels?)` - Observe summary value
- `getMetric(name)` - Get metric by name
- `getAllMetrics()` - Get all metrics
- `aggregate(name, period, func)` - Aggregate metric
- `export(format)` - Export metrics
- `query(query)` - Query metrics from registry
- `takeSnapshot()` - Take metrics snapshot
- `getStats()` - Get statistics

### MetricsCollector

Collect and store metrics.

#### Metric Types

- **Counter**: Monotonically increasing value
- **Gauge**: Value that can increase or decrease
- **Histogram**: Distribution of values with buckets
- **Summary**: Distribution with percentiles

### MetricsDashboard

Real-time dashboard with widgets.

#### Widget Types

- `line` - Line chart
- `bar` - Bar chart
- `pie` - Pie chart
- `gauge` - Gauge display
- `number` - Single number display
- `table` - Data table

### MetricsAggregator

Aggregate metrics over time periods.

#### Aggregation Functions

- `sum` - Sum of values
- `average` - Average of values
- `min` - Minimum value
- `max` - Maximum value
- `count` - Count of values
- `median` - Median value
- `p95` - 95th percentile
- `p99` - 99th percentile

#### Time Periods

- `1m`, `5m`, `15m` - Minutes
- `1h`, `6h`, `24h` - Hours
- `7d`, `30d` - Days

### MetricsExporter

Export metrics in various formats.

#### Export Formats

- **Prometheus**: Prometheus exposition format
- **JSON**: JSON format
- **CSV**: Comma-separated values
- **InfluxDB**: InfluxDB line protocol
- **Graphite**: Graphite plaintext format

## Configuration

```typescript
interface MetricsConfig {
  enableAutoCollection: boolean;     // Auto-collect system metrics
  collectionInterval: number;        // Collection interval in ms
  enableDashboard: boolean;          // Enable dashboard
  dashboardConfig?: DashboardConfig; // Dashboard configuration
  enableRegistry: boolean;           // Enable metrics registry
  defaultCategory: string;           // Default category for metrics
}
```

## License

MIT
