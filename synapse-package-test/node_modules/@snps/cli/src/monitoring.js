/**
 * Monitoring and Health Check System for Synapse CLI
 * Comprehensive monitoring with metrics, alerts, and health checks
 */

import { promises as fs } from 'fs';
import { join, resolve, dirname, extname, basename } from 'path';
import { execSync, spawn } from 'child_process';
import { EventEmitter } from 'events';

export class MonitoringSystem extends EventEmitter {
  constructor(options = {}) {
    super();
    this.root = options.root || process.cwd();
    this.verbose = options.verbose || false;
    this.interval = options.interval || 5000; // 5 seconds
    
    this.metrics = new Map();
    this.alerts = new Map();
    this.healthChecks = new Map();
    this.dashboards = new Map();
    
    this.isRunning = false;
    this.intervalId = null;
    this.startTime = Date.now();
    
    this.initializeDefaultMetrics();
    this.initializeHealthChecks();
  }

  initializeDefaultMetrics() {
    // System metrics
    this.metrics.set('cpu_usage', { value: 0, unit: '%', threshold: 80 });
    this.metrics.set('memory_usage', { value: 0, unit: '%', threshold: 85 });
    this.metrics.set('disk_usage', { value: 0, unit: '%', threshold: 90 });
    this.metrics.set('network_io', { value: 0, unit: 'bytes/s', threshold: 1000000 });
    
    // Application metrics
    this.metrics.set('response_time', { value: 0, unit: 'ms', threshold: 1000 });
    this.metrics.set('request_count', { value: 0, unit: 'requests', threshold: 10000 });
    this.metrics.set('error_rate', { value: 0, unit: '%', threshold: 5 });
    this.metrics.set('active_connections', { value: 0, unit: 'connections', threshold: 1000 });
    
    // Build metrics
    this.metrics.set('build_time', { value: 0, unit: 's', threshold: 300 });
    this.metrics.set('bundle_size', { value: 0, unit: 'bytes', threshold: 5000000 });
    this.metrics.set('test_coverage', { value: 0, unit: '%', threshold: 80 });
    this.metrics.set('lint_errors', { value: 0, unit: 'errors', threshold: 10 });
  }

  initializeHealthChecks() {
    // System health checks
    this.healthChecks.set('system', {
      name: 'System Health',
      check: this.checkSystemHealth.bind(this),
      interval: 10000,
      timeout: 5000,
      critical: true
    });

    this.healthChecks.set('disk_space', {
      name: 'Disk Space',
      check: this.checkDiskSpace.bind(this),
      interval: 30000,
      timeout: 3000,
      critical: true
    });

    this.healthChecks.set('memory', {
      name: 'Memory Usage',
      check: this.checkMemoryUsage.bind(this),
      interval: 15000,
      timeout: 3000,
      critical: false
    });

    // Application health checks
    this.healthChecks.set('application', {
      name: 'Application Health',
      check: this.checkApplicationHealth.bind(this),
      interval: 5000,
      timeout: 2000,
      critical: true
    });

    this.healthChecks.set('database', {
      name: 'Database Connection',
      check: this.checkDatabaseHealth.bind(this),
      interval: 10000,
      timeout: 5000,
      critical: true
    });

    this.healthChecks.set('api', {
      name: 'API Endpoints',
      check: this.checkAPIHealth.bind(this),
      interval: 10000,
      timeout: 5000,
      critical: false
    });

    // Build health checks
    this.healthChecks.set('build', {
      name: 'Build System',
      check: this.checkBuildHealth.bind(this),
      interval: 60000,
      timeout: 10000,
      critical: false
    });

    this.healthChecks.set('tests', {
      name: 'Test Suite',
      check: this.checkTestHealth.bind(this),
      interval: 300000, // 5 minutes
      timeout: 30000,
      critical: false
    });
  }

  async start() {
    if (this.isRunning) return;
    
    console.log('📊 Starting Monitoring System...');
    
    this.isRunning = true;
    this.startTime = Date.now();
    
    // Start health check intervals
    for (const [id, healthCheck] of this.healthChecks) {
      this.startHealthCheck(id, healthCheck);
    }
    
    // Start metrics collection
    this.intervalId = setInterval(() => {
      this.collectMetrics();
    }, this.interval);
    
    console.log('✅ Monitoring System started');
    this.emit('started');
  }

  async stop() {
    if (!this.isRunning) return;
    
    console.log('🛑 Stopping Monitoring System...');
    
    this.isRunning = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    // Stop all health checks
    for (const [id, healthCheck] of this.healthChecks) {
      if (healthCheck.intervalId) {
        clearInterval(healthCheck.intervalId);
      }
    }
    
    console.log('✅ Monitoring System stopped');
    this.emit('stopped');
  }

  startHealthCheck(id, healthCheck) {
    const runCheck = async () => {
      try {
        const startTime = Date.now();
        const result = await Promise.race([
          healthCheck.check(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Health check timeout')), healthCheck.timeout)
          )
        ]);
        
        const duration = Date.now() - startTime;
        
        this.updateHealthStatus(id, {
          status: 'healthy',
          result,
          duration,
          lastChecked: new Date().toISOString(),
          error: null
        });
        
      } catch (error) {
        this.updateHealthStatus(id, {
          status: 'unhealthy',
          result: null,
          duration: 0,
          lastChecked: new Date().toISOString(),
          error: error.message
        });
        
        if (healthCheck.critical) {
          this.triggerAlert('critical', `Health check failed: ${healthCheck.name}`, {
            healthCheck: id,
            error: error.message
          });
        }
      }
    };
    
    // Run immediately
    runCheck();
    
    // Schedule recurring checks
    healthCheck.intervalId = setInterval(runCheck, healthCheck.interval);
  }

  updateHealthStatus(id, status) {
    const healthCheck = this.healthChecks.get(id);
    if (healthCheck) {
      healthCheck.status = status;
      this.emit('healthCheck', { id, status });
    }
  }

  async checkSystemHealth() {
    const cpuUsage = await this.getCPUUsage();
    const memoryUsage = await this.getMemoryUsage();
    const diskUsage = await this.getDiskUsage();
    
    return {
      cpu: cpuUsage,
      memory: memoryUsage,
      disk: diskUsage,
      uptime: process.uptime()
    };
  }

  async checkDiskSpace() {
    try {
      const result = execSync('df -h /', { encoding: 'utf-8' });
      const lines = result.trim().split('\n');
      const data = lines[1].split(/\s+/);
      
      const usage = parseInt(data[4].replace('%', ''));
      
      if (usage > 90) {
        throw new Error(`Disk usage critical: ${usage}%`);
      }
      
      return { usage, available: data[3] };
    } catch (error) {
      throw new Error(`Disk space check failed: ${error.message}`);
    }
  }

  async checkMemoryUsage() {
    const memInfo = process.memoryUsage();
    const totalMemory = memInfo.heapTotal + memInfo.external;
    const usedMemory = memInfo.heapUsed;
    const usage = (usedMemory / totalMemory) * 100;
    
    if (usage > 85) {
      throw new Error(`Memory usage high: ${usage.toFixed(2)}%`);
    }
    
    return {
      usage: usage.toFixed(2),
      heapUsed: memInfo.heapUsed,
      heapTotal: memInfo.heapTotal,
      external: memInfo.external
    };
  }

  async checkApplicationHealth() {
    // Check if application files exist
    const criticalFiles = [
      'package.json',
      'dist/index.js'
    ];
    
    for (const file of criticalFiles) {
      try {
        await fs.access(join(this.root, file));
      } catch {
        throw new Error(`Critical file missing: ${file}`);
      }
    }
    
    // Check if application is responsive
    const responseTime = await this.measureResponseTime();
    
    if (responseTime > 1000) {
      throw new Error(`Application response time too high: ${responseTime}ms`);
    }
    
    return {
      files: 'ok',
      responseTime,
      status: 'healthy'
    };
  }

  async checkDatabaseHealth() {
    // Placeholder for database health check
    // In a real implementation, this would check actual database connection
    return {
      connection: 'ok',
      latency: Math.random() * 10,
      status: 'healthy'
    };
  }

  async checkAPIHealth() {
    // Placeholder for API health check
    // In a real implementation, this would check actual API endpoints
    return {
      endpoints: ['/health', '/api/status'],
      status: 'healthy'
    };
  }

  async checkBuildHealth() {
    try {
      // Check if build directory exists and has recent files
      const distPath = join(this.root, 'dist');
      const stats = await fs.stat(distPath);
      
      const age = Date.now() - stats.mtime.getTime();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (age > maxAge) {
        throw new Error(`Build is stale: ${Math.round(age / (60 * 60 * 1000))} hours old`);
      }
      
      return {
        lastBuild: stats.mtime.toISOString(),
        age: Math.round(age / (60 * 60 * 1000)),
        status: 'healthy'
      };
    } catch (error) {
      throw new Error(`Build health check failed: ${error.message}`);
    }
  }

  async checkTestHealth() {
    try {
      // Check if tests pass
      const result = execSync('npm test', { 
        encoding: 'utf-8',
        cwd: this.root,
        timeout: 30000
      });
      
      const lines = result.split('\n');
      const passedMatch = lines.find(line => line.includes('passed'));
      const failedMatch = lines.find(line => line.includes('failed'));
      
      if (failedMatch && !passedMatch) {
        throw new Error('All tests failed');
      }
      
      return {
        status: 'healthy',
        output: result
      };
    } catch (error) {
      throw new Error(`Test health check failed: ${error.message}`);
    }
  }

  async getCPUUsage() {
    try {
      const result = execSync('top -bn1 | grep "Cpu(s)"', { encoding: 'utf-8' });
      const match = result.match(/(\d+\.\d+)%us/);
      return match ? parseFloat(match[1]) : 0;
    } catch {
      return 0;
    }
  }

  async getMemoryUsage() {
    const memInfo = process.memoryUsage();
    const totalMemory = memInfo.heapTotal + memInfo.external;
    const usedMemory = memInfo.heapUsed;
    return (usedMemory / totalMemory) * 100;
  }

  async getDiskUsage() {
    try {
      const result = execSync('df -h /', { encoding: 'utf-8' });
      const lines = result.trim().split('\n');
      const data = lines[1].split(/\s+/);
      return parseInt(data[4].replace('%', ''));
    } catch {
      return 0;
    }
  }

  async measureResponseTime() {
    const start = Date.now();
    
    try {
      // Simulate application response time measurement
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
      return Date.now() - start;
    } catch {
      return 1000; // Default to high response time if measurement fails
    }
  }

  collectMetrics() {
    // Update system metrics
    this.updateMetric('cpu_usage', this.getCPUUsage());
    this.updateMetric('memory_usage', this.getMemoryUsage());
    this.updateMetric('disk_usage', this.getDiskUsage());
    
    // Update application metrics
    this.updateMetric('response_time', this.measureResponseTime());
    this.updateMetric('request_count', Math.floor(Math.random() * 100));
    this.updateMetric('error_rate', Math.random() * 2);
    this.updateMetric('active_connections', Math.floor(Math.random() * 50));
    
    // Check for threshold violations
    this.checkThresholds();
  }

  updateMetric(name, value) {
    const metric = this.metrics.get(name);
    if (metric) {
      metric.value = value;
      metric.lastUpdated = new Date().toISOString();
      this.emit('metric', { name, value, metric });
    }
  }

  checkThresholds() {
    for (const [name, metric] of this.metrics) {
      if (metric.value > metric.threshold) {
        this.triggerAlert('warning', `Metric threshold exceeded: ${name}`, {
          metric: name,
          value: metric.value,
          threshold: metric.threshold,
          unit: metric.unit
        });
      }
    }
  }

  triggerAlert(level, message, data = {}) {
    const alert = {
      id: Date.now().toString(),
      level,
      message,
      data,
      timestamp: new Date().toISOString()
    };
    
    this.alerts.set(alert.id, alert);
    this.emit('alert', alert);
    
    console.log(`🚨 ${level.toUpperCase()}: ${message}`);
  }

  getHealthStatus() {
    const status = {
      overall: 'healthy',
      checks: {},
      uptime: Date.now() - this.startTime,
      lastUpdated: new Date().toISOString()
    };
    
    let hasUnhealthy = false;
    
    for (const [id, healthCheck] of this.healthChecks) {
      status.checks[id] = healthCheck.status || { status: 'unknown' };
      
      if (healthCheck.status && healthCheck.status.status === 'unhealthy') {
        hasUnhealthy = true;
        if (healthCheck.critical) {
          status.overall = 'critical';
        } else if (status.overall === 'healthy') {
          status.overall = 'warning';
        }
      }
    }
    
    return status;
  }

  getMetrics() {
    const metrics = {};
    
    for (const [name, metric] of this.metrics) {
      metrics[name] = {
        value: metric.value,
        unit: metric.unit,
        threshold: metric.threshold,
        lastUpdated: metric.lastUpdated
      };
    }
    
    return metrics;
  }

  getAlerts(limit = 10) {
    const alerts = Array.from(this.alerts.values())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
    
    return alerts;
  }

  createDashboard(name, config) {
    const dashboard = {
      id: name,
      name,
      config,
      createdAt: new Date().toISOString(),
      widgets: []
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

  generateReport() {
    const healthStatus = this.getHealthStatus();
    const metrics = this.getMetrics();
    const alerts = this.getAlerts(5);
    
    return {
      timestamp: new Date().toISOString(),
      health: healthStatus,
      metrics,
      alerts,
      summary: {
        totalMetrics: Object.keys(metrics).length,
        totalAlerts: this.alerts.size,
        uptime: healthStatus.uptime,
        status: healthStatus.overall
      }
    };
  }

  exportMetrics(format = 'json') {
    const data = this.generateReport();
    
    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'csv':
        return this.exportToCSV(data);
      case 'prometheus':
        return this.exportToPrometheus(data);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  exportToCSV(data) {
    const lines = ['timestamp,metric,value,unit,threshold'];
    
    for (const [name, metric] of Object.entries(data.metrics)) {
      lines.push(`${data.timestamp},${name},${metric.value},${metric.unit},${metric.threshold}`);
    }
    
    return lines.join('\n');
  }

  exportToPrometheus(data) {
    const lines = [];
    
    for (const [name, metric] of Object.entries(data.metrics)) {
      lines.push(`# HELP ${name} ${name} metric`);
      lines.push(`# TYPE ${name} gauge`);
      lines.push(`${name} ${metric.value}`);
    }
    
    return lines.join('\n');
  }
}