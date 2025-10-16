# @snps/monitoring

Advanced performance monitoring and profiling for Synapse Framework.

## Features

- **CPU, Memory, and Network Profiling** - Track resource usage in real-time
- **Real-time Metrics Dashboard** - Collect and visualize application metrics
- **Error Tracking and Reporting** - Comprehensive error monitoring
- **Performance Budgets and Alerts** - Get notified when metrics exceed thresholds
- **Core Web Vitals Monitoring** - Track LCP, FID, CLS, FCP, TTFB
- **Real User Monitoring (RUM)** - Monitor actual user experience

## Installation

```bash
npm install @snps/monitoring
```

## Usage

```typescript
import { SynapseMonitoring } from '@snps/monitoring';

// Create monitoring instance
const monitoring = new SynapseMonitoring({
  enableProfiling: true,
  enableMetrics: true,
  enableErrorTracking: true,
  enableAlerts: true,
  enableWebVitals: true,
  enableRUM: true
});

// Start monitoring
monitoring.start();

// Get performance metrics
const report = monitoring.getReport();

// Stop monitoring
monitoring.stop();
```

## Advanced Usage

### Profiling

```typescript
const profiler = monitoring.getProfiler();

// Profile synchronous function
profiler.profile('myFunction', () => {
  // Your code here
});

// Profile asynchronous function
await profiler.profileAsync('myAsyncFunction', async () => {
  // Your async code here
});

// Get profiling results
const results = profiler.getResults();
```

### Metrics Collection

```typescript
const metrics = monitoring.getMetricsCollector();

// Record counter
metrics.increment('requests');

// Record gauge
metrics.gauge('active_users', 100);

// Record histogram
metrics.histogram('response_time', 250);
```

### Error Tracking

```typescript
const errorTracker = monitoring.getErrorTracker();

// Track error
try {
  // Your code
} catch (error) {
  errorTracker.track(error, 'high', { userId: '123' });
}

// Get errors
const errors = errorTracker.getErrors('high');
```

### Alerts

```typescript
const alerts = monitoring.getAlertSystem();

// Set up alert handler
alerts.on('critical', (alert) => {
  console.log('Critical alert:', alert.message);
  // Send notification
});

// Trigger alert
alerts.trigger('warning', 'High memory usage detected');
```

### Web Vitals

```typescript
const webVitals = monitoring.getWebVitalsMonitor();

// Record Core Web Vitals
webVitals.recordLCP(2500); // Largest Contentful Paint
webVitals.recordFID(100);  // First Input Delay
webVitals.recordCLS(0.1);  // Cumulative Layout Shift

// Get vitals
const vitals = webVitals.getVitals();
```

### Real User Monitoring

```typescript
const rum = monitoring.getRUM();

// Track page view
rum.trackPageView();

// Track user interaction
rum.trackInteraction();

// Get RUM data
const rumData = rum.getData();
```

## License

MIT © Synapse Framework Team
