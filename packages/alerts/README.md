# @snps/alerts

Intelligent alerting and notification system for Synapse Framework with threshold-based alerts, anomaly detection, and multiple notification channels.

## Features

- **Alert Rules**: Define alert conditions with thresholds
- **Alert Evaluation**: Automatic evaluation with cooldown periods
- **Notification Channels**: Webhook, Email, Console, and more
- **Anomaly Detection**: ML-based anomaly detection
- **Alert History**: Track alert history and statistics
- **Zero Dependencies**: Built from scratch with no external dependencies

## Installation

```bash
npm install @snps/alerts
```

## Usage

### Basic Alert Management

```typescript
import { AlertManager, AlertRuleBuilder } from '@snps/alerts';

const alertManager = new AlertManager({
  evaluationInterval: 10000, // 10 seconds
  enableAnomalyDetection: true
});

// Create alert rule
const rule = new AlertRuleBuilder()
  .setId('high-cpu-alert')
  .setName('High CPU Usage')
  .setDescription('Alert when CPU usage exceeds 80%')
  .setSeverity('warning')
  .addCondition({
    metric: 'cpu_usage',
    operator: '>',
    threshold: 80,
    duration: 60000, // 1 minute
    aggregation: 'average'
  })
  .setCooldown(300000) // 5 minutes
  .addAction('console-channel')
  .build();

alertManager.addRule(rule);

// Add notification channel
alertManager.addChannel({
  id: 'console-channel',
  name: 'Console Notifications',
  type: 'console',
  enabled: true,
  config: {}
});

// Evaluate alerts
const context = {
  metricValues: new Map([
    ['cpu_usage', [85, 87, 90, 92]] // Recent values
  ]),
  timestamp: Date.now()
};

const results = await alertManager.evaluate(context);
```

### Alert Rules

```typescript
import { AlertRuleBuilder } from '@snps/alerts';

// Simple threshold alert
const rule = new AlertRuleBuilder()
  .setId('memory-alert')
  .setName('High Memory Usage')
  .setSeverity('critical')
  .addCondition({
    metric: 'memory_usage',
    operator: '>=',
    threshold: 90,
    duration: 30000 // 30 seconds
  })
  .build();

// Multiple conditions (ALL must be met)
const complexRule = new AlertRuleBuilder()
  .setId('complex-alert')
  .setName('Complex Alert')
  .setSeverity('warning')
  .addCondition({
    metric: 'error_rate',
    operator: '>',
    threshold: 5,
    duration: 60000
  })
  .addCondition({
    metric: 'response_time',
    operator: '>',
    threshold: 1000,
    duration: 60000
  })
  .addTag('production')
  .addLabel('team', 'platform')
  .build();
```

### Notification Channels

```typescript
import { AlertManager } from '@snps/alerts';

const manager = new AlertManager();

// Console channel
manager.addChannel({
  id: 'console',
  name: 'Console',
  type: 'console',
  enabled: true,
  config: {}
});

// Webhook channel
manager.addChannel({
  id: 'webhook',
  name: 'Slack Webhook',
  type: 'webhook',
  enabled: true,
  config: {
    url: 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL'
  }
});

// Email channel
manager.addChannel({
  id: 'email',
  name: 'Email Alerts',
  type: 'email',
  enabled: true,
  config: {
    to: 'alerts@example.com',
    from: 'noreply@example.com'
  }
});
```

### Anomaly Detection

```typescript
import { AnomalyDetector } from '@snps/alerts';

const detector = new AnomalyDetector({
  sensitivity: 0.7,
  minDataPoints: 20,
  stdDevThreshold: 3,
  enableSpike: true,
  enableDrop: true,
  enableTrendChange: true,
  enableOutlier: true
});

// Detect anomalies in metric data
const anomalies = detector.detect('response_time', 1500, Date.now());

for (const anomaly of anomalies) {
  console.log(`Anomaly detected: ${anomaly.type}`);
  console.log(`Value: ${anomaly.value}, Expected: ${anomaly.expectedValue}`);
  console.log(`Confidence: ${anomaly.confidence}`);
  console.log(`Description: ${anomaly.description}`);
}
```

### Auto-Evaluation

```typescript
import { AlertManager } from '@snps/alerts';

const manager = new AlertManager();

// Start automatic evaluation
manager.startAutoEvaluation(() => {
  // Get current metrics
  return {
    metricValues: new Map([
      ['cpu_usage', [getCurrentCPU()]],
      ['memory_usage', [getCurrentMemory()]]
    ]),
    timestamp: Date.now()
  };
});

// Stop when done
manager.stopAutoEvaluation();
```

### Alert History

```typescript
import { AlertManager } from '@snps/alerts';

const manager = new AlertManager();

// Get all history
const history = manager.getHistory();

// Get recent history (limit 10)
const recentHistory = manager.getHistory(10);

// Get history for specific rule
const ruleHistory = manager.getHistoryForRule('high-cpu-alert');

// Get statistics
const stats = manager.getStats();
console.log('Total rules:', stats.totalRules);
console.log('Active rules:', stats.activeRules);
console.log('Total alerts:', stats.totalAlerts);
console.log('By severity:', stats.alertsBySeverity);
```

## API Reference

### AlertManager

Main alert management interface.

#### Methods

- `addRule(rule: AlertRule)` - Add alert rule
- `removeRule(ruleId: string)` - Remove alert rule
- `getRule(ruleId: string)` - Get alert rule
- `getAllRules()` - Get all rules
- `updateRule(ruleId, updates)` - Update rule
- `addChannel(config)` - Add notification channel
- `removeChannel(channelId)` - Remove channel
- `evaluate(context)` - Evaluate alerts
- `detectAnomalies(metric, value, timestamp)` - Detect anomalies
- `getHistory(limit?)` - Get alert history
- `getStats()` - Get statistics
- `startAutoEvaluation(getContext)` - Start auto-evaluation
- `stopAutoEvaluation()` - Stop auto-evaluation

### AlertRuleBuilder

Builder for creating alert rules.

#### Methods

- `setId(id)` - Set rule ID
- `setName(name)` - Set rule name
- `setDescription(description)` - Set description
- `setSeverity(severity)` - Set severity ('critical', 'warning', 'info')
- `addCondition(condition)` - Add condition
- `setConditions(conditions)` - Set all conditions
- `setCooldown(cooldown)` - Set cooldown period in ms
- `addTag(tag)` - Add tag
- `addLabel(key, value)` - Add label
- `addAction(actionId)` - Add notification channel
- `build()` - Build alert rule

### AnomalyDetector

Detect anomalies in metric data.

#### Methods

- `detect(metric, value, timestamp)` - Detect anomalies
- `reset()` - Reset all data
- `resetMetric(metric)` - Reset specific metric

#### Anomaly Types

- `spike` - Sudden increase in value
- `drop` - Sudden decrease in value
- `trend_change` - Change in trend direction
- `outlier` - Statistical outlier

## Alert Conditions

### Operators

- `>` - Greater than
- `>=` - Greater than or equal
- `<` - Less than
- `<=` - Less than or equal
- `=` - Equal
- `!=` - Not equal

### Aggregation Functions

- `average` - Average of values
- `sum` - Sum of values
- `min` - Minimum value
- `max` - Maximum value
- `count` - Count of values

## Notification Channels

### Supported Channel Types

- `webhook` - HTTP webhook
- `email` - Email notifications
- `console` - Console output
- `slack` - Slack (via webhook)
- `discord` - Discord (via webhook)
- `pagerduty` - PagerDuty integration

## Configuration

```typescript
interface AlertConfig {
  enableAnomalyDetection: boolean;  // Enable anomaly detection
  anomalyConfig?: AnomalyConfig;   // Anomaly detector config
  evaluationInterval: number;       // Auto-evaluation interval in ms
  maxHistorySize: number;          // Max history entries to keep
}

interface AnomalyConfig {
  sensitivity: number;              // 0-1, higher = more sensitive
  minDataPoints: number;           // Minimum data points needed
  stdDevThreshold: number;         // Standard deviation threshold
  enableSpike: boolean;            // Detect spikes
  enableDrop: boolean;             // Detect drops
  enableTrendChange: boolean;      // Detect trend changes
  enableOutlier: boolean;          // Detect outliers
}
```

## License

MIT
