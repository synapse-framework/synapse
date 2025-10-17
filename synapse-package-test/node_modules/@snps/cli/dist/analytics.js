/**
 * Analytics and Metrics Collection System for Synapse CLI
 * Comprehensive analytics with real-time metrics, dashboards, and insights
 */

import { promises as fs } from 'fs';
import { join, resolve, dirname, extname, basename } from 'path';
import { EventEmitter } from 'events';

export class AnalyticsSystem extends EventEmitter {
  constructor(options = {}) {
    super();
    this.root = options.root || process.cwd();
    this.verbose = options.verbose || false;
    this.dataDir = options.dataDir || join(this.root, '.synapse', 'analytics');
    this.retentionDays = options.retentionDays || 30;
    this.batchSize = options.batchSize || 100;
    this.flushInterval = options.flushInterval || 5000; // 5 seconds
    
    this.metrics = new Map();
    this.events = [];
    this.dashboards = new Map();
    this.insights = new Map();
    this.alerts = new Map();
    
    this.isCollecting = false;
    this.flushTimer = null;
    this.sessionId = this.generateSessionId();
    
    this.initializeMetrics();
    this.initializeDashboards();
  }

  async initialize() {
    console.log('📊 Initializing Analytics System...');
    
    // Ensure data directory exists
    await fs.mkdir(this.dataDir, { recursive: true });
    
    // Load existing data
    await this.loadExistingData();
    
    // Start collection
    this.startCollection();
    
    console.log('✅ Analytics System initialized');
  }

  initializeMetrics() {
    // Performance metrics
    this.metrics.set('performance', {
      name: 'Performance',
      description: 'Application performance metrics',
      type: 'counter',
      unit: 'ms',
      tags: ['endpoint', 'method', 'status']
    });

    this.metrics.set('response_time', {
      name: 'Response Time',
      description: 'API response times',
      type: 'histogram',
      unit: 'ms',
      buckets: [10, 50, 100, 200, 500, 1000, 2000, 5000]
    });

    this.metrics.set('throughput', {
      name: 'Throughput',
      description: 'Requests per second',
      type: 'rate',
      unit: 'req/s',
      window: 60
    });

    this.metrics.set('error_rate', {
      name: 'Error Rate',
      description: 'Percentage of failed requests',
      type: 'gauge',
      unit: '%',
      window: 300
    });

    // Business metrics
    this.metrics.set('user_actions', {
      name: 'User Actions',
      description: 'User interaction events',
      type: 'counter',
      unit: 'events',
      tags: ['action', 'user_id', 'session_id']
    });

    this.metrics.set('feature_usage', {
      name: 'Feature Usage',
      description: 'Feature adoption and usage',
      type: 'counter',
      unit: 'uses',
      tags: ['feature', 'user_id', 'version']
    });

    this.metrics.set('conversion', {
      name: 'Conversion',
      description: 'Conversion funnel metrics',
      type: 'counter',
      unit: 'conversions',
      tags: ['funnel_step', 'user_id', 'source']
    });

    // System metrics
    this.metrics.set('memory_usage', {
      name: 'Memory Usage',
      description: 'Memory consumption',
      type: 'gauge',
      unit: 'bytes',
      tags: ['type', 'component']
    });

    this.metrics.set('cpu_usage', {
      name: 'CPU Usage',
      description: 'CPU utilization',
      type: 'gauge',
      unit: '%',
      tags: ['core', 'process']
    });

    this.metrics.set('disk_usage', {
      name: 'Disk Usage',
      description: 'Disk space utilization',
      type: 'gauge',
      unit: 'bytes',
      tags: ['mount', 'filesystem']
    });

    // Custom metrics
    this.metrics.set('custom', {
      name: 'Custom Metrics',
      description: 'User-defined metrics',
      type: 'counter',
      unit: 'units',
      tags: ['name', 'category']
    });
  }

  initializeDashboards() {
    // Performance dashboard
    this.dashboards.set('performance', {
      name: 'Performance Dashboard',
      description: 'Real-time performance metrics',
      widgets: [
        {
          id: 'response_time_chart',
          type: 'line_chart',
          title: 'Response Time',
          metric: 'response_time',
          timeRange: '1h',
          refreshInterval: 30
        },
        {
          id: 'throughput_gauge',
          type: 'gauge',
          title: 'Throughput',
          metric: 'throughput',
          timeRange: '5m',
          refreshInterval: 10
        },
        {
          id: 'error_rate_chart',
          type: 'area_chart',
          title: 'Error Rate',
          metric: 'error_rate',
          timeRange: '1h',
          refreshInterval: 30
        }
      ]
    });

    // Business dashboard
    this.dashboards.set('business', {
      name: 'Business Dashboard',
      description: 'Business metrics and KPIs',
      widgets: [
        {
          id: 'user_actions_table',
          type: 'table',
          title: 'User Actions',
          metric: 'user_actions',
          timeRange: '24h',
          refreshInterval: 60
        },
        {
          id: 'feature_usage_pie',
          type: 'pie_chart',
          title: 'Feature Usage',
          metric: 'feature_usage',
          timeRange: '7d',
          refreshInterval: 300
        },
        {
          id: 'conversion_funnel',
          type: 'funnel_chart',
          title: 'Conversion Funnel',
          metric: 'conversion',
          timeRange: '30d',
          refreshInterval: 3600
        }
      ]
    });

    // System dashboard
    this.dashboards.set('system', {
      name: 'System Dashboard',
      description: 'System health and resource usage',
      widgets: [
        {
          id: 'memory_usage_chart',
          type: 'line_chart',
          title: 'Memory Usage',
          metric: 'memory_usage',
          timeRange: '1h',
          refreshInterval: 30
        },
        {
          id: 'cpu_usage_gauge',
          type: 'gauge',
          title: 'CPU Usage',
          metric: 'cpu_usage',
          timeRange: '5m',
          refreshInterval: 10
        },
        {
          id: 'disk_usage_bar',
          type: 'bar_chart',
          title: 'Disk Usage',
          metric: 'disk_usage',
          timeRange: '24h',
          refreshInterval: 300
        }
      ]
    });
  }

  async loadExistingData() {
    try {
      // Load metrics data
      const metricsPath = join(this.dataDir, 'metrics.json');
      const metricsData = await fs.readFile(metricsPath, 'utf-8');
      const parsedMetrics = JSON.parse(metricsData);
      
      // Load events data
      const eventsPath = join(this.dataDir, 'events.json');
      const eventsData = await fs.readFile(eventsPath, 'utf-8');
      const parsedEvents = JSON.parse(eventsData);
      
      this.events = parsedEvents || [];
      
      console.log(`📊 Loaded ${this.events.length} events`);
      
    } catch (error) {
      console.log('⚠️  No existing analytics data found');
    }
  }

  async saveData() {
    try {
      // Save events data
      const eventsPath = join(this.dataDir, 'events.json');
      await fs.writeFile(eventsPath, JSON.stringify(this.events, null, 2));
      
      // Save metrics data
      const metricsPath = join(this.dataDir, 'metrics.json');
      const metricsData = Array.from(this.metrics.entries()).map(([key, metric]) => ({
        key,
        ...metric
      }));
      await fs.writeFile(metricsPath, JSON.stringify(metricsData, null, 2));
      
    } catch (error) {
      console.error('❌ Failed to save analytics data:', error.message);
    }
  }

  startCollection() {
    if (this.isCollecting) return;
    
    this.isCollecting = true;
    
    // Start flush timer
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
    
    console.log('📊 Analytics collection started');
  }

  stopCollection() {
    if (!this.isCollecting) return;
    
    this.isCollecting = false;
    
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    
    // Final flush
    this.flush();
    
    console.log('📊 Analytics collection stopped');
  }

  trackEvent(name, properties = {}, tags = {}) {
    const event = {
      id: this.generateEventId(),
      name,
      properties,
      tags: {
        ...tags,
        session_id: this.sessionId,
        timestamp: Date.now(),
        version: '1.0.0'
      },
      timestamp: new Date().toISOString()
    };
    
    this.events.push(event);
    
    // Emit event for real-time processing
    this.emit('event', event);
    
    if (this.verbose) {
      console.log(`📊 Event tracked: ${name}`, properties);
    }
    
    // Check if we need to flush
    if (this.events.length >= this.batchSize) {
      this.flush();
    }
  }

  trackMetric(name, value, tags = {}) {
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`⚠️  Unknown metric: ${name}`);
      return;
    }
    
    const metricEvent = {
      id: this.generateEventId(),
      type: 'metric',
      name,
      value,
      tags: {
        ...tags,
        session_id: this.sessionId,
        timestamp: Date.now()
      },
      timestamp: new Date().toISOString()
    };
    
    this.events.push(metricEvent);
    
    // Emit metric for real-time processing
    this.emit('metric', metricEvent);
    
    if (this.verbose) {
      console.log(`📊 Metric tracked: ${name} = ${value}`, tags);
    }
  }

  trackPerformance(endpoint, method, statusCode, duration, tags = {}) {
    this.trackMetric('response_time', duration, {
      endpoint,
      method,
      status: statusCode,
      ...tags
    });
    
    this.trackMetric('throughput', 1, {
      endpoint,
      method,
      ...tags
    });
    
    if (statusCode >= 400) {
      this.trackMetric('error_rate', 1, {
        endpoint,
        method,
        status: statusCode,
        ...tags
      });
    }
  }

  trackUserAction(action, userId, properties = {}) {
    this.trackEvent('user_action', {
      action,
      user_id: userId,
      ...properties
    }, {
      action,
      user_id: userId
    });
  }

  trackFeatureUsage(feature, userId, version = '1.0.0') {
    this.trackEvent('feature_usage', {
      feature,
      user_id: userId,
      version
    }, {
      feature,
      user_id: userId,
      version
    });
  }

  trackConversion(funnelStep, userId, source = 'direct') {
    this.trackEvent('conversion', {
      funnel_step: funnelStep,
      user_id: userId,
      source
    }, {
      funnel_step: funnelStep,
      user_id: userId,
      source
    });
  }

  trackSystemMetric(type, value, component = 'system') {
    this.trackMetric('memory_usage', value, {
      type,
      component
    });
  }

  async flush() {
    if (this.events.length === 0) return;
    
    try {
      // Process events
      await this.processEvents(this.events);
      
      // Save data
      await this.saveData();
      
      // Clear processed events
      this.events = [];
      
      if (this.verbose) {
        console.log('📊 Analytics data flushed');
      }
      
    } catch (error) {
      console.error('❌ Failed to flush analytics data:', error.message);
    }
  }

  async processEvents(events) {
    // Group events by type
    const eventGroups = this.groupEventsByType(events);
    
    // Process each group
    for (const [type, groupEvents] of eventGroups) {
      switch (type) {
        case 'metric':
          await this.processMetrics(groupEvents);
          break;
        case 'user_action':
          await this.processUserActions(groupEvents);
          break;
        case 'feature_usage':
          await this.processFeatureUsage(groupEvents);
          break;
        case 'conversion':
          await this.processConversions(groupEvents);
          break;
        default:
          await this.processGenericEvents(groupEvents);
      }
    }
  }

  groupEventsByType(events) {
    const groups = new Map();
    
    for (const event of events) {
      const type = event.type || event.name;
      if (!groups.has(type)) {
        groups.set(type, []);
      }
      groups.get(type).push(event);
    }
    
    return groups;
  }

  async processMetrics(events) {
    // Aggregate metrics
    const aggregated = this.aggregateMetrics(events);
    
    // Update insights
    await this.updateInsights('metrics', aggregated);
    
    // Check alerts
    await this.checkAlerts('metrics', aggregated);
  }

  aggregateMetrics(events) {
    const aggregated = new Map();
    
    for (const event of events) {
      const { name, value, tags } = event;
      
      if (!aggregated.has(name)) {
        aggregated.set(name, {
          count: 0,
          sum: 0,
          min: Infinity,
          max: -Infinity,
          values: []
        });
      }
      
      const metric = aggregated.get(name);
      metric.count++;
      metric.sum += value;
      metric.min = Math.min(metric.min, value);
      metric.max = Math.max(metric.max, value);
      metric.values.push(value);
    }
    
    // Calculate statistics
    for (const [name, metric] of aggregated) {
      metric.average = metric.sum / metric.count;
      metric.median = this.calculateMedian(metric.values);
      metric.p95 = this.calculatePercentile(metric.values, 95);
      metric.p99 = this.calculatePercentile(metric.values, 99);
    }
    
    return aggregated;
  }

  calculateMedian(values) {
    const sorted = values.sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid];
  }

  calculatePercentile(values, percentile) {
    const sorted = values.sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  async processUserActions(events) {
    // Analyze user behavior patterns
    const patterns = this.analyzeUserPatterns(events);
    
    // Update insights
    await this.updateInsights('user_actions', patterns);
  }

  analyzeUserPatterns(events) {
    const patterns = {
      totalActions: events.length,
      uniqueUsers: new Set(events.map(e => e.tags.user_id)).size,
      actionFrequency: new Map(),
      sessionDuration: 0,
      commonFlows: []
    };
    
    // Count action frequency
    for (const event of events) {
      const action = event.tags.action;
      patterns.actionFrequency.set(action, (patterns.actionFrequency.get(action) || 0) + 1);
    }
    
    return patterns;
  }

  async processFeatureUsage(events) {
    // Analyze feature adoption
    const adoption = this.analyzeFeatureAdoption(events);
    
    // Update insights
    await this.updateInsights('feature_usage', adoption);
  }

  analyzeFeatureAdoption(events) {
    const adoption = {
      totalUsage: events.length,
      uniqueUsers: new Set(events.map(e => e.tags.user_id)).size,
      featureFrequency: new Map(),
      adoptionRate: 0
    };
    
    // Count feature frequency
    for (const event of events) {
      const feature = event.tags.feature;
      adoption.featureFrequency.set(feature, (adoption.featureFrequency.get(feature) || 0) + 1);
    }
    
    return adoption;
  }

  async processConversions(events) {
    // Analyze conversion funnel
    const funnel = this.analyzeConversionFunnel(events);
    
    // Update insights
    await this.updateInsights('conversion', funnel);
  }

  analyzeConversionFunnel(events) {
    const funnel = {
      totalConversions: events.length,
      uniqueUsers: new Set(events.map(e => e.tags.user_id)).size,
      stepFrequency: new Map(),
      conversionRate: 0
    };
    
    // Count step frequency
    for (const event of events) {
      const step = event.tags.funnel_step;
      funnel.stepFrequency.set(step, (funnel.stepFrequency.get(step) || 0) + 1);
    }
    
    return funnel;
  }

  async processGenericEvents(events) {
    // Process generic events
    console.log(`📊 Processed ${events.length} generic events`);
  }

  async updateInsights(type, data) {
    const insight = {
      type,
      data,
      timestamp: Date.now(),
      generated: new Date().toISOString()
    };
    
    this.insights.set(type, insight);
    
    // Emit insight for real-time updates
    this.emit('insight', insight);
  }

  async checkAlerts(type, data) {
    // Check for alert conditions
    const alerts = this.alerts.get(type) || [];
    
    for (const alert of alerts) {
      if (this.evaluateAlertCondition(alert, data)) {
        await this.triggerAlert(alert, data);
      }
    }
  }

  evaluateAlertCondition(alert, data) {
    // Simple alert condition evaluation
    // In a real implementation, this would be more sophisticated
    return false;
  }

  async triggerAlert(alert, data) {
    const alertEvent = {
      id: this.generateEventId(),
      type: 'alert',
      alert: alert.name,
      data,
      timestamp: new Date().toISOString()
    };
    
    this.emit('alert', alertEvent);
    
    console.log(`🚨 Alert triggered: ${alert.name}`);
  }

  createDashboard(name, widgets) {
    const dashboard = {
      id: name,
      name,
      widgets,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.dashboards.set(name, dashboard);
    
    return dashboard;
  }

  getDashboard(name) {
    return this.dashboards.get(name);
  }

  listDashboards() {
    return Array.from(this.dashboards.values());
  }

  async generateReport(timeRange = '24h') {
    const report = {
      timestamp: new Date().toISOString(),
      timeRange,
      summary: {
        totalEvents: this.events.length,
        totalMetrics: this.metrics.size,
        totalInsights: this.insights.size,
        totalDashboards: this.dashboards.size
      },
      metrics: Array.from(this.metrics.values()),
      insights: Array.from(this.insights.values()),
      dashboards: Array.from(this.dashboards.values())
    };
    
    return report;
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateEventId() {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getStats() {
    return {
      totalEvents: this.events.length,
      totalMetrics: this.metrics.size,
      totalInsights: this.insights.size,
      totalDashboards: this.dashboards.size,
      isCollecting: this.isCollecting,
      sessionId: this.sessionId
    };
  }
}