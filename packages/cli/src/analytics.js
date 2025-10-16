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

  // ========================================================================
  // ENHANCED ANALYTICS FEATURES
  // ========================================================================

  async createCustomMetric(name, type, unit, tags = []) {
    console.log(`📊 Creating custom metric: ${name}`);
    
    const metric = {
      name,
      type,
      unit,
      tags,
      description: `Custom metric: ${name}`,
      createdAt: new Date().toISOString()
    };
    
    this.metrics.set(name, metric);
    
    console.log(`✅ Custom metric created: ${name}`);
    
    return metric;
  }

  async createAlert(name, condition, threshold, action) {
    console.log(`🚨 Creating alert: ${name}`);
    
    const alert = {
      id: this.generateAlertId(),
      name,
      condition,
      threshold,
      action,
      enabled: true,
      createdAt: new Date().toISOString(),
      lastTriggered: null
    };
    
    this.alerts.set(name, alert);
    
    console.log(`✅ Alert created: ${name}`);
    
    return alert;
  }

  async createInsight(name, query, visualization, schedule) {
    console.log(`💡 Creating insight: ${name}`);
    
    const insight = {
      id: this.generateInsightId(),
      name,
      query,
      visualization,
      schedule,
      enabled: true,
      createdAt: new Date().toISOString(),
      lastUpdated: null
    };
    
    this.insights.set(name, insight);
    
    console.log(`✅ Insight created: ${name}`);
    
    return insight;
  }

  async generateInsightId() {
    return `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async generateAlertId() {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ========================================================================
  // REAL-TIME ANALYTICS
  // ========================================================================

  async startRealTimeAnalytics() {
    console.log('⚡ Starting real-time analytics...');
    
    // Start real-time data processing
    this.realTimeProcessor = setInterval(async () => {
      await this.processRealTimeData();
    }, 1000); // Process every second
    
    // Start real-time insights generation
    this.insightsGenerator = setInterval(async () => {
      await this.generateRealTimeInsights();
    }, 5000); // Generate insights every 5 seconds
    
    console.log('✅ Real-time analytics started');
  }

  async stopRealTimeAnalytics() {
    console.log('🛑 Stopping real-time analytics...');
    
    if (this.realTimeProcessor) {
      clearInterval(this.realTimeProcessor);
      this.realTimeProcessor = null;
    }
    
    if (this.insightsGenerator) {
      clearInterval(this.insightsGenerator);
      this.insightsGenerator = null;
    }
    
    console.log('✅ Real-time analytics stopped');
  }

  async processRealTimeData() {
    // Process recent events for real-time updates
    const recentEvents = this.events.filter(event => {
      const eventTime = new Date(event.timestamp).getTime();
      const now = Date.now();
      return (now - eventTime) < 60000; // Last minute
    });
    
    if (recentEvents.length > 0) {
      await this.processEvents(recentEvents);
      
      // Emit real-time update
      this.emit('realtime_update', {
        timestamp: new Date().toISOString(),
        eventsProcessed: recentEvents.length,
        metrics: this.getRealTimeMetrics()
      });
    }
  }

  getRealTimeMetrics() {
    const now = Date.now();
    const lastMinute = now - 60000;
    
    const recentEvents = this.events.filter(event => {
      const eventTime = new Date(event.timestamp).getTime();
      return eventTime > lastMinute;
    });
    
    return {
      eventsPerMinute: recentEvents.length,
      activeUsers: new Set(recentEvents.map(e => e.tags.user_id)).size,
      errorRate: this.calculateErrorRate(recentEvents),
      averageResponseTime: this.calculateAverageResponseTime(recentEvents)
    };
  }

  calculateErrorRate(events) {
    const errorEvents = events.filter(event => 
      event.tags.status && event.tags.status >= 400
    );
    
    return events.length > 0 ? (errorEvents.length / events.length) * 100 : 0;
  }

  calculateAverageResponseTime(events) {
    const responseTimeEvents = events.filter(event => 
      event.name === 'response_time'
    );
    
    if (responseTimeEvents.length === 0) return 0;
    
    const totalTime = responseTimeEvents.reduce((sum, event) => sum + event.value, 0);
    return totalTime / responseTimeEvents.length;
  }

  async generateRealTimeInsights() {
    const insights = [];
    
    // Generate performance insights
    const performanceInsight = await this.generatePerformanceInsight();
    if (performanceInsight) insights.push(performanceInsight);
    
    // Generate user behavior insights
    const behaviorInsight = await this.generateBehaviorInsight();
    if (behaviorInsight) insights.push(behaviorInsight);
    
    // Generate system health insights
    const healthInsight = await this.generateHealthInsight();
    if (healthInsight) insights.push(healthInsight);
    
    // Emit insights
    for (const insight of insights) {
      this.emit('insight_generated', insight);
    }
    
    return insights;
  }

  async generatePerformanceInsight() {
    const recentEvents = this.getRecentEvents('response_time', 300000); // Last 5 minutes
    
    if (recentEvents.length === 0) return null;
    
    const avgResponseTime = this.calculateAverageResponseTime(recentEvents);
    const p95ResponseTime = this.calculatePercentile(
      recentEvents.map(e => e.value), 95
    );
    
    let insight = null;
    
    if (avgResponseTime > 1000) {
      insight = {
        type: 'performance',
        severity: 'warning',
        title: 'High Response Time',
        message: `Average response time is ${avgResponseTime.toFixed(2)}ms`,
        recommendation: 'Consider optimizing database queries or adding caching',
        data: { avgResponseTime, p95ResponseTime }
      };
    } else if (avgResponseTime < 100) {
      insight = {
        type: 'performance',
        severity: 'info',
        title: 'Excellent Performance',
        message: `Average response time is ${avgResponseTime.toFixed(2)}ms`,
        recommendation: 'Performance is optimal',
        data: { avgResponseTime, p95ResponseTime }
      };
    }
    
    return insight;
  }

  async generateBehaviorInsight() {
    const recentEvents = this.getRecentEvents('user_action', 300000); // Last 5 minutes
    
    if (recentEvents.length === 0) return null;
    
    const uniqueUsers = new Set(recentEvents.map(e => e.tags.user_id)).size;
    const actionFrequency = new Map();
    
    for (const event of recentEvents) {
      const action = event.tags.action;
      actionFrequency.set(action, (actionFrequency.get(action) || 0) + 1);
    }
    
    const mostCommonAction = Array.from(actionFrequency.entries())
      .sort((a, b) => b[1] - a[1])[0];
    
    return {
      type: 'behavior',
      severity: 'info',
      title: 'User Activity Summary',
      message: `${uniqueUsers} active users, most common action: ${mostCommonAction[0]}`,
      recommendation: 'Monitor user engagement patterns',
      data: { uniqueUsers, actionFrequency: Object.fromEntries(actionFrequency) }
    };
  }

  async generateHealthInsight() {
    const recentEvents = this.getRecentEvents('error_rate', 300000); // Last 5 minutes
    
    if (recentEvents.length === 0) return null;
    
    const errorRate = this.calculateErrorRate(recentEvents);
    
    let insight = null;
    
    if (errorRate > 5) {
      insight = {
        type: 'health',
        severity: 'critical',
        title: 'High Error Rate',
        message: `Error rate is ${errorRate.toFixed(2)}%`,
        recommendation: 'Investigate and fix errors immediately',
        data: { errorRate }
      };
    } else if (errorRate > 1) {
      insight = {
        type: 'health',
        severity: 'warning',
        title: 'Elevated Error Rate',
        message: `Error rate is ${errorRate.toFixed(2)}%`,
        recommendation: 'Monitor closely and investigate if it persists',
        data: { errorRate }
      };
    }
    
    return insight;
  }

  getRecentEvents(eventType, timeWindow) {
    const now = Date.now();
    const cutoff = now - timeWindow;
    
    return this.events.filter(event => {
      const eventTime = new Date(event.timestamp).getTime();
      return eventTime > cutoff && (event.name === eventType || event.type === eventType);
    });
  }

  // ========================================================================
  // ADVANCED QUERYING AND REPORTING
  // ========================================================================

  async queryMetrics(query) {
    console.log(`🔍 Querying metrics: ${query.name}`);
    
    const { name, timeRange, filters, aggregation } = query;
    
    // Filter events by time range
    let filteredEvents = this.filterEventsByTimeRange(this.events, timeRange);
    
    // Filter by metric name
    if (name) {
      filteredEvents = filteredEvents.filter(event => 
        event.name === name || event.type === name
      );
    }
    
    // Apply additional filters
    if (filters) {
      filteredEvents = this.applyFilters(filteredEvents, filters);
    }
    
    // Apply aggregation
    if (aggregation) {
      return this.applyAggregation(filteredEvents, aggregation);
    }
    
    return filteredEvents;
  }

  filterEventsByTimeRange(events, timeRange) {
    const now = Date.now();
    let cutoff;
    
    switch (timeRange) {
      case '1h':
        cutoff = now - 3600000;
        break;
      case '24h':
        cutoff = now - 86400000;
        break;
      case '7d':
        cutoff = now - 604800000;
        break;
      case '30d':
        cutoff = now - 2592000000;
        break;
      default:
        cutoff = now - 3600000; // Default to 1 hour
    }
    
    return events.filter(event => {
      const eventTime = new Date(event.timestamp).getTime();
      return eventTime > cutoff;
    });
  }

  applyFilters(events, filters) {
    return events.filter(event => {
      for (const [key, value] of Object.entries(filters)) {
        if (event.tags[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  applyAggregation(events, aggregation) {
    const { type, field } = aggregation;
    
    switch (type) {
      case 'count':
        return events.length;
      case 'sum':
        return events.reduce((sum, event) => sum + (event.value || 0), 0);
      case 'avg':
        return events.length > 0 
          ? events.reduce((sum, event) => sum + (event.value || 0), 0) / events.length 
          : 0;
      case 'min':
        return Math.min(...events.map(event => event.value || Infinity));
      case 'max':
        return Math.max(...events.map(event => event.value || -Infinity));
      case 'group_by':
        return this.groupBy(events, field);
      default:
        return events;
    }
  }

  groupBy(events, field) {
    const groups = new Map();
    
    for (const event of events) {
      const value = event.tags[field] || event[field];
      if (!groups.has(value)) {
        groups.set(value, []);
      }
      groups.get(value).push(event);
    }
    
    return Object.fromEntries(groups);
  }

  async generateAdvancedReport(options = {}) {
    console.log('📊 Generating advanced analytics report...');
    
    const {
      timeRange = '24h',
      includeCharts = true,
      includeInsights = true,
      includeRecommendations = true
    } = options;
    
    const report = {
      timestamp: new Date().toISOString(),
      timeRange,
      summary: await this.generateReportSummary(timeRange),
      metrics: await this.generateMetricsReport(timeRange),
      insights: includeInsights ? await this.generateInsightsReport() : null,
      recommendations: includeRecommendations ? await this.generateRecommendations() : null,
      charts: includeCharts ? await this.generateCharts(timeRange) : null
    };
    
    console.log('✅ Advanced report generated');
    
    return report;
  }

  async generateReportSummary(timeRange) {
    const events = this.filterEventsByTimeRange(this.events, timeRange);
    
    return {
      totalEvents: events.length,
      uniqueUsers: new Set(events.map(e => e.tags.user_id)).size,
      averageResponseTime: this.calculateAverageResponseTime(events),
      errorRate: this.calculateErrorRate(events),
      topFeatures: this.getTopFeatures(events),
      topActions: this.getTopActions(events)
    };
  }

  getTopFeatures(events) {
    const featureUsage = new Map();
    
    for (const event of events) {
      if (event.name === 'feature_usage') {
        const feature = event.tags.feature;
        featureUsage.set(feature, (featureUsage.get(feature) || 0) + 1);
      }
    }
    
    return Array.from(featureUsage.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([feature, count]) => ({ feature, count }));
  }

  getTopActions(events) {
    const actionCounts = new Map();
    
    for (const event of events) {
      if (event.name === 'user_action') {
        const action = event.tags.action;
        actionCounts.set(action, (actionCounts.get(action) || 0) + 1);
      }
    }
    
    return Array.from(actionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([action, count]) => ({ action, count }));
  }

  async generateMetricsReport(timeRange) {
    const events = this.filterEventsByTimeRange(this.events, timeRange);
    const metrics = {};
    
    for (const [name, metric] of this.metrics) {
      const metricEvents = events.filter(e => e.name === name || e.type === name);
      
      if (metricEvents.length > 0) {
        metrics[name] = {
          count: metricEvents.length,
          average: this.calculateAverageResponseTime(metricEvents),
          min: Math.min(...metricEvents.map(e => e.value || Infinity)),
          max: Math.max(...metricEvents.map(e => e.value || -Infinity)),
          p95: this.calculatePercentile(metricEvents.map(e => e.value), 95),
          p99: this.calculatePercentile(metricEvents.map(e => e.value), 99)
        };
      }
    }
    
    return metrics;
  }

  async generateInsightsReport() {
    return Array.from(this.insights.values());
  }

  async generateRecommendations() {
    const recommendations = [];
    
    // Performance recommendations
    const recentEvents = this.filterEventsByTimeRange(this.events, '1h');
    const avgResponseTime = this.calculateAverageResponseTime(recentEvents);
    
    if (avgResponseTime > 500) {
      recommendations.push({
        category: 'performance',
        priority: 'high',
        title: 'Optimize Response Times',
        description: `Average response time is ${avgResponseTime.toFixed(2)}ms`,
        actions: [
          'Add database indexing',
          'Implement caching layer',
          'Optimize database queries',
          'Consider CDN for static assets'
        ]
      });
    }
    
    // Error rate recommendations
    const errorRate = this.calculateErrorRate(recentEvents);
    if (errorRate > 2) {
      recommendations.push({
        category: 'reliability',
        priority: 'high',
        title: 'Reduce Error Rate',
        description: `Error rate is ${errorRate.toFixed(2)}%`,
        actions: [
          'Review error logs',
          'Add better error handling',
          'Implement retry mechanisms',
          'Add monitoring alerts'
        ]
      });
    }
    
    // User engagement recommendations
    const uniqueUsers = new Set(recentEvents.map(e => e.tags.user_id)).size;
    if (uniqueUsers < 10) {
      recommendations.push({
        category: 'engagement',
        priority: 'medium',
        title: 'Increase User Engagement',
        description: `Only ${uniqueUsers} active users in the last hour`,
        actions: [
          'Improve user onboarding',
          'Add gamification elements',
          'Send engagement notifications',
          'Analyze user drop-off points'
        ]
      });
    }
    
    return recommendations;
  }

  async generateCharts(timeRange) {
    const events = this.filterEventsByTimeRange(this.events, timeRange);
    
    return {
      responseTimeChart: this.generateResponseTimeChart(events),
      errorRateChart: this.generateErrorRateChart(events),
      userActivityChart: this.generateUserActivityChart(events),
      featureUsageChart: this.generateFeatureUsageChart(events)
    };
  }

  generateResponseTimeChart(events) {
    const responseTimeEvents = events.filter(e => e.name === 'response_time');
    
    // Group by 5-minute intervals
    const intervals = new Map();
    
    for (const event of responseTimeEvents) {
      const time = new Date(event.timestamp);
      const interval = Math.floor(time.getTime() / 300000) * 300000; // 5-minute intervals
      
      if (!intervals.has(interval)) {
        intervals.set(interval, []);
      }
      intervals.get(interval).push(event.value);
    }
    
    return Array.from(intervals.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([time, values]) => ({
        time: new Date(time).toISOString(),
        average: values.reduce((sum, val) => sum + val, 0) / values.length,
        p95: this.calculatePercentile(values, 95),
        p99: this.calculatePercentile(values, 99)
      }));
  }

  generateErrorRateChart(events) {
    const errorEvents = events.filter(e => e.tags.status && e.tags.status >= 400);
    
    // Group by 5-minute intervals
    const intervals = new Map();
    
    for (const event of events) {
      const time = new Date(event.timestamp);
      const interval = Math.floor(time.getTime() / 300000) * 300000;
      
      if (!intervals.has(interval)) {
        intervals.set(interval, { total: 0, errors: 0 });
      }
      
      intervals.get(interval).total++;
      if (event.tags.status && event.tags.status >= 400) {
        intervals.get(interval).errors++;
      }
    }
    
    return Array.from(intervals.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([time, data]) => ({
        time: new Date(time).toISOString(),
        errorRate: data.total > 0 ? (data.errors / data.total) * 100 : 0
      }));
  }

  generateUserActivityChart(events) {
    const userEvents = events.filter(e => e.tags.user_id);
    
    // Group by hour
    const hourlyActivity = new Map();
    
    for (const event of userEvents) {
      const time = new Date(event.timestamp);
      const hour = new Date(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours());
      
      if (!hourlyActivity.has(hour.getTime())) {
        hourlyActivity.set(hour.getTime(), new Set());
      }
      hourlyActivity.get(hour.getTime()).add(event.tags.user_id);
    }
    
    return Array.from(hourlyActivity.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([time, users]) => ({
        time: new Date(time).toISOString(),
        activeUsers: users.size
      }));
  }

  generateFeatureUsageChart(events) {
    const featureEvents = events.filter(e => e.name === 'feature_usage');
    const featureCounts = new Map();
    
    for (const event of featureEvents) {
      const feature = event.tags.feature;
      featureCounts.set(feature, (featureCounts.get(feature) || 0) + 1);
    }
    
    return Array.from(featureCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([feature, count]) => ({ feature, count }));
  }

  // ========================================================================
  // EXPORT AND INTEGRATION
  // ========================================================================

  async exportData(format = 'json', options = {}) {
    console.log(`📤 Exporting analytics data in ${format} format...`);
    
    const { timeRange = '24h', includeEvents = true, includeMetrics = true } = options;
    
    const data = {
      timestamp: new Date().toISOString(),
      timeRange,
      events: includeEvents ? this.filterEventsByTimeRange(this.events, timeRange) : null,
      metrics: includeMetrics ? Array.from(this.metrics.values()) : null,
      insights: Array.from(this.insights.values()),
      dashboards: Array.from(this.dashboards.values())
    };
    
    let content;
    let filename;
    
    switch (format) {
      case 'json':
        content = JSON.stringify(data, null, 2);
        filename = `analytics-${Date.now()}.json`;
        break;
      case 'csv':
        content = this.convertToCSV(data);
        filename = `analytics-${Date.now()}.csv`;
        break;
      case 'xlsx':
        content = await this.convertToXLSX(data);
        filename = `analytics-${Date.now()}.xlsx`;
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
    
    const filePath = join(this.dataDir, filename);
    await fs.writeFile(filePath, content);
    
    console.log(`✅ Data exported to ${filePath}`);
    
    return filePath;
  }

  convertToCSV(data) {
    const lines = [];
    
    // Add events
    if (data.events) {
      lines.push('Type,Name,Value,Timestamp,User ID,Session ID');
      for (const event of data.events) {
        lines.push([
          event.type || event.name,
          event.name || '',
          event.value || '',
          event.timestamp,
          event.tags.user_id || '',
          event.tags.session_id || ''
        ].join(','));
      }
    }
    
    return lines.join('\n');
  }

  async convertToXLSX(data) {
    // In a real implementation, this would use a library like xlsx
    // For now, return JSON as a placeholder
    return JSON.stringify(data, null, 2);
  }

  async integrateWithExternalService(service, config) {
    console.log(`🔗 Integrating with ${service}...`);
    
    switch (service) {
      case 'google_analytics':
        return await this.integrateWithGoogleAnalytics(config);
      case 'mixpanel':
        return await this.integrateWithMixpanel(config);
      case 'amplitude':
        return await this.integrateWithAmplitude(config);
      case 'datadog':
        return await this.integrateWithDatadog(config);
      default:
        throw new Error(`Unsupported service: ${service}`);
    }
  }

  async integrateWithGoogleAnalytics(config) {
    // In a real implementation, this would send data to Google Analytics
    console.log('📊 Google Analytics integration configured');
    return { success: true, service: 'google_analytics' };
  }

  async integrateWithMixpanel(config) {
    // In a real implementation, this would send data to Mixpanel
    console.log('📊 Mixpanel integration configured');
    return { success: true, service: 'mixpanel' };
  }

  async integrateWithAmplitude(config) {
    // In a real implementation, this would send data to Amplitude
    console.log('📊 Amplitude integration configured');
    return { success: true, service: 'amplitude' };
  }

  async integrateWithDatadog(config) {
    // In a real implementation, this would send data to Datadog
    console.log('📊 Datadog integration configured');
    return { success: true, service: 'datadog' };
  }
}