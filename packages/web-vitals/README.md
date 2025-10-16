# @snps/web-vitals

Comprehensive web vitals monitoring for Synapse Framework with support for all Core Web Vitals metrics.

## Features

- **LCP (Largest Contentful Paint)**: Monitor largest element render time
- **FID (First Input Delay)**: Track user input responsiveness
- **CLS (Cumulative Layout Shift)**: Measure visual stability
- **FCP (First Contentful Paint)**: Monitor initial render time
- **TTFB (Time to First Byte)**: Track server response time
- **Automatic Scoring**: Get performance scores based on Google's thresholds
- **Real-time Monitoring**: Observe metrics as they occur
- **Zero Dependencies**: Built from scratch with no external dependencies

## Installation

```bash
npm install @snps/web-vitals
```

## Usage

### Basic Monitoring

```typescript
import { WebVitalsMonitor } from '@snps/web-vitals';

const monitor = new WebVitalsMonitor({
  enableLCP: true,
  enableFID: true,
  enableCLS: true,
  enableFCP: true,
  enableTTFB: true,
  autoReport: true,
  reportInterval: 5000
});

// Start monitoring
monitor.start();

// Observe reports
monitor.observe((report) => {
  console.log('Web Vitals Report:', report);
  console.log('Overall Score:', report.score.overall);

  if (report.lcp) {
    console.log('LCP:', report.lcp.value, 'ms', `(${report.lcp.rating})`);
  }

  if (report.fid) {
    console.log('FID:', report.fid.value, 'ms', `(${report.fid.rating})`);
  }

  if (report.cls) {
    console.log('CLS:', report.cls.value, `(${report.cls.rating})`);
  }
});

// Get current report
const report = monitor.getReport();
```

### Individual Metric Monitoring

```typescript
import { LCPMonitor, FIDMonitor, CLSMonitor } from '@snps/web-vitals';

// LCP Monitoring
const lcpMonitor = new LCPMonitor();
lcpMonitor.start();
lcpMonitor.observe((metric) => {
  console.log('LCP:', metric.value, 'ms');
  console.log('Rating:', metric.rating);
  console.log('Largest element:', metric.entries[0]?.element);
});

// FID Monitoring
const fidMonitor = new FIDMonitor();
fidMonitor.start();
fidMonitor.observe((metric) => {
  console.log('FID:', metric.value, 'ms');
  console.log('Input type:', metric.entries[0]?.name);
});

// CLS Monitoring
const clsMonitor = new CLSMonitor();
clsMonitor.start();
clsMonitor.observe((metric) => {
  console.log('CLS:', metric.value);
  console.log('Layout shifts:', metric.entries.length);
});
```

### Browser Integration

```html
<!DOCTYPE html>
<html>
<head>
  <title>Web Vitals Example</title>
</head>
<body>
  <h1>My App</h1>

  <script type="module">
    import { WebVitalsMonitor } from '@snps/web-vitals';

    const monitor = new WebVitalsMonitor();
    monitor.start();

    monitor.observe((report) => {
      // Send to analytics
      sendToAnalytics({
        lcp: report.lcp?.value,
        fid: report.fid?.value,
        cls: report.cls?.value,
        fcp: report.fcp?.value,
        ttfb: report.ttfb?.value,
        score: report.score.overall
      });
    });
  </script>
</body>
</html>
```

### With Analytics

```typescript
import { WebVitalsMonitor } from '@snps/web-vitals';

const monitor = new WebVitalsMonitor();
monitor.start();

monitor.observe((report) => {
  // Google Analytics
  if (typeof gtag !== 'undefined') {
    if (report.lcp) {
      gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: 'LCP',
        value: Math.round(report.lcp.value),
        metric_rating: report.lcp.rating
      });
    }
  }

  // Custom analytics endpoint
  fetch('/api/analytics/web-vitals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(report)
  });
});
```

## Metrics

### LCP (Largest Contentful Paint)

Measures loading performance. Good LCP is 2.5s or less.

- **Good**: ≤ 2500ms
- **Needs Improvement**: 2500ms - 4000ms
- **Poor**: > 4000ms

```typescript
import { LCPMonitor } from '@snps/web-vitals';

const monitor = new LCPMonitor();
monitor.start();

const metric = monitor.getMetric();
console.log('LCP:', metric?.value, 'ms');
console.log('Element:', metric?.entries[0]?.element);
```

### FID (First Input Delay)

Measures interactivity. Good FID is 100ms or less.

- **Good**: ≤ 100ms
- **Needs Improvement**: 100ms - 300ms
- **Poor**: > 300ms

```typescript
import { FIDMonitor } from '@snps/web-vitals';

const monitor = new FIDMonitor();
monitor.start();

const metric = monitor.getMetric();
console.log('FID:', metric?.value, 'ms');
```

### CLS (Cumulative Layout Shift)

Measures visual stability. Good CLS is 0.1 or less.

- **Good**: ≤ 0.1
- **Needs Improvement**: 0.1 - 0.25
- **Poor**: > 0.25

```typescript
import { CLSMonitor } from '@snps/web-vitals';

const monitor = new CLSMonitor();
monitor.start();

const metric = monitor.getMetric();
console.log('CLS:', metric?.value);
console.log('Shifts:', metric?.entries.length);
```

### FCP (First Contentful Paint)

Measures perceived load speed. Good FCP is 1.8s or less.

- **Good**: ≤ 1800ms
- **Needs Improvement**: 1800ms - 3000ms
- **Poor**: > 3000ms

```typescript
import { FCPMonitor } from '@snps/web-vitals';

const monitor = new FCPMonitor();
monitor.start();

const metric = monitor.getMetric();
console.log('FCP:', metric?.value, 'ms');
```

### TTFB (Time to First Byte)

Measures server response time. Good TTFB is 800ms or less.

- **Good**: ≤ 800ms
- **Needs Improvement**: 800ms - 1800ms
- **Poor**: > 1800ms

```typescript
import { TTFBMonitor } from '@snps/web-vitals';

const monitor = new TTFBMonitor();
monitor.start();

const metric = monitor.getMetric();
console.log('TTFB:', metric?.value, 'ms');
```

## API Reference

### WebVitalsMonitor

Main interface for monitoring all web vitals.

#### Methods

- `start()` - Start monitoring all enabled metrics
- `observe(callback)` - Observe metric reports
- `getReport()` - Get current report
- `reset()` - Reset all monitors
- `stopAutoReport()` - Stop automatic reporting
- `dispose()` - Clean up resources

### Individual Monitors

Each metric has its own monitor class:

- `LCPMonitor` - Largest Contentful Paint
- `FIDMonitor` - First Input Delay
- `CLSMonitor` - Cumulative Layout Shift
- `FCPMonitor` - First Contentful Paint
- `TTFBMonitor` - Time to First Byte

All monitors share these methods:

- `start()` - Start monitoring
- `observe(callback)` - Observe metrics
- `getMetric()` - Get current metric
- `reset()` - Reset monitor

## Configuration

```typescript
interface WebVitalsConfig {
  enableLCP: boolean;          // Enable LCP monitoring
  enableFID: boolean;          // Enable FID monitoring
  enableCLS: boolean;          // Enable CLS monitoring
  enableFCP: boolean;          // Enable FCP monitoring
  enableTTFB: boolean;         // Enable TTFB monitoring
  reportInterval: number;      // Auto-report interval in ms
  autoReport: boolean;         // Enable automatic reporting
}
```

## Browser Support

Requires browser support for:

- `PerformanceObserver` API
- `PerformanceNavigationTiming` API
- `LayoutShift` API (for CLS)
- `PerformanceEventTiming` API (for FID)

Most modern browsers support these APIs. Graceful degradation is handled for unsupported environments.

## Best Practices

1. **Start monitoring early**: Initialize monitoring as early as possible in your app
2. **Send to analytics**: Integrate with your analytics platform
3. **Set performance budgets**: Define acceptable thresholds for your app
4. **Monitor in production**: Real user metrics are most valuable
5. **Track over time**: Monitor trends, not just individual measurements

## Performance Budgets Example

```typescript
import { WebVitalsMonitor } from '@snps/web-vitals';

const monitor = new WebVitalsMonitor();
monitor.start();

const budgets = {
  lcp: 2500,  // ms
  fid: 100,   // ms
  cls: 0.1,   // score
  fcp: 1800,  // ms
  ttfb: 800   // ms
};

monitor.observe((report) => {
  const violations = [];

  if (report.lcp && report.lcp.value > budgets.lcp) {
    violations.push(`LCP: ${report.lcp.value}ms > ${budgets.lcp}ms`);
  }

  if (report.fid && report.fid.value > budgets.fid) {
    violations.push(`FID: ${report.fid.value}ms > ${budgets.fid}ms`);
  }

  if (report.cls && report.cls.value > budgets.cls) {
    violations.push(`CLS: ${report.cls.value} > ${budgets.cls}`);
  }

  if (violations.length > 0) {
    console.warn('Performance budget violations:', violations);
  }
});
```

## License

MIT
