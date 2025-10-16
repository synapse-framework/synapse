/**
 * Metrics Dashboard - Real-time dashboard data structure
 */

import type { Metric } from './metrics-collector.js';

export type WidgetType = 'line' | 'bar' | 'pie' | 'gauge' | 'number' | 'table';

export interface DashboardWidget {
  readonly id: string;
  readonly type: WidgetType;
  readonly title: string;
  readonly metricName: string;
  readonly refreshInterval: number;
  readonly position: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
  readonly config: Record<string, unknown>;
}

export interface DashboardConfig {
  readonly title: string;
  readonly refreshInterval: number;
  readonly widgets: DashboardWidget[];
  readonly theme: 'light' | 'dark';
  readonly autoRefresh: boolean;
}

export interface DashboardData {
  readonly timestamp: number;
  readonly widgets: Map<string, WidgetData>;
  readonly metadata: Record<string, unknown>;
}

export interface WidgetData {
  readonly widgetId: string;
  readonly data: unknown;
  readonly lastUpdate: number;
  readonly error?: string;
}

export class MetricsDashboard {
  private config: DashboardConfig;
  private widgetData = new Map<string, WidgetData>();
  private refreshIntervals = new Map<string, NodeJS.Timeout>();

  public constructor(config: DashboardConfig) {
    this.config = config;
  }

  /**
   * Add a widget to the dashboard
   */
  public addWidget(widget: DashboardWidget): void {
    const existingWidget = this.config.widgets.find(w => w.id === widget.id);
    if (existingWidget !== undefined) {
      throw new Error(`Widget with id '${widget.id}' already exists`);
    }

    this.config = {
      ...this.config,
      widgets: [...this.config.widgets, widget]
    };
  }

  /**
   * Remove a widget from the dashboard
   */
  public removeWidget(widgetId: string): void {
    this.config = {
      ...this.config,
      widgets: this.config.widgets.filter(w => w.id !== widgetId)
    };

    // Clear widget data and interval
    this.widgetData.delete(widgetId);
    const interval = this.refreshIntervals.get(widgetId);
    if (interval !== undefined) {
      clearInterval(interval);
      this.refreshIntervals.delete(widgetId);
    }
  }

  /**
   * Update widget data
   */
  public updateWidgetData(widgetId: string, data: unknown, error?: string): void {
    this.widgetData.set(widgetId, {
      widgetId,
      data,
      lastUpdate: Date.now(),
      error
    });
  }

  /**
   * Get widget data
   */
  public getWidgetData(widgetId: string): WidgetData | undefined {
    return this.widgetData.get(widgetId);
  }

  /**
   * Get all widget data
   */
  public getAllWidgetData(): Map<string, WidgetData> {
    return new Map(this.widgetData);
  }

  /**
   * Get dashboard data
   */
  public getDashboardData(): DashboardData {
    return {
      timestamp: Date.now(),
      widgets: new Map(this.widgetData),
      metadata: {
        widgetCount: this.config.widgets.length,
        theme: this.config.theme,
        autoRefresh: this.config.autoRefresh
      }
    };
  }

  /**
   * Update widget configuration
   */
  public updateWidget(widgetId: string, updates: Partial<DashboardWidget>): void {
    const widgets = this.config.widgets.map(widget => {
      if (widget.id === widgetId) {
        return { ...widget, ...updates };
      }
      return widget;
    });

    this.config = {
      ...this.config,
      widgets
    };
  }

  /**
   * Get widget by ID
   */
  public getWidget(widgetId: string): DashboardWidget | undefined {
    return this.config.widgets.find(w => w.id === widgetId);
  }

  /**
   * Get all widgets
   */
  public getWidgets(): DashboardWidget[] {
    return [...this.config.widgets];
  }

  /**
   * Set dashboard configuration
   */
  public setConfig(config: DashboardConfig): void {
    this.config = config;
  }

  /**
   * Get dashboard configuration
   */
  public getConfig(): DashboardConfig {
    return { ...this.config };
  }

  /**
   * Start auto-refresh for a widget
   */
  public startWidgetRefresh(widgetId: string, callback: () => void): void {
    const widget = this.getWidget(widgetId);
    if (widget === undefined) {
      throw new Error(`Widget '${widgetId}' not found`);
    }

    // Clear existing interval if any
    const existingInterval = this.refreshIntervals.get(widgetId);
    if (existingInterval !== undefined) {
      clearInterval(existingInterval);
    }

    // Start new interval
    const interval = setInterval(callback, widget.refreshInterval);
    this.refreshIntervals.set(widgetId, interval);

    // Call immediately
    callback();
  }

  /**
   * Stop auto-refresh for a widget
   */
  public stopWidgetRefresh(widgetId: string): void {
    const interval = this.refreshIntervals.get(widgetId);
    if (interval !== undefined) {
      clearInterval(interval);
      this.refreshIntervals.delete(widgetId);
    }
  }

  /**
   * Start all widget refreshes
   */
  public startAllRefreshes(getMetric: (name: string) => Metric | undefined): void {
    for (const widget of this.config.widgets) {
      this.startWidgetRefresh(widget.id, () => {
        const metric = getMetric(widget.metricName);
        if (metric !== undefined) {
          const data = this.prepareWidgetData(widget, metric);
          this.updateWidgetData(widget.id, data);
        } else {
          this.updateWidgetData(widget.id, null, `Metric '${widget.metricName}' not found`);
        }
      });
    }
  }

  /**
   * Stop all widget refreshes
   */
  public stopAllRefreshes(): void {
    for (const widgetId of this.refreshIntervals.keys()) {
      this.stopWidgetRefresh(widgetId);
    }
  }

  /**
   * Prepare data for widget visualization
   */
  private prepareWidgetData(widget: DashboardWidget, metric: Metric): unknown {
    switch (widget.type) {
      case 'number':
        return this.prepareNumberData(metric);
      case 'line':
        return this.prepareLineData(metric);
      case 'bar':
        return this.prepareBarData(metric);
      case 'pie':
        return this.preparePieData(metric);
      case 'gauge':
        return this.prepareGaugeData(metric);
      case 'table':
        return this.prepareTableData(metric);
      default:
        return null;
    }
  }

  /**
   * Prepare data for number widget
   */
  private prepareNumberData(metric: Metric): { readonly value: number; readonly unit: string } {
    const latestValue = metric.values[metric.values.length - 1];
    return {
      value: latestValue?.value || 0,
      unit: metric.unit
    };
  }

  /**
   * Prepare data for line chart widget
   */
  private prepareLineData(metric: Metric): {
    readonly labels: string[];
    readonly data: number[];
  } {
    const recentValues = metric.values.slice(-50);
    return {
      labels: recentValues.map(v => new Date(v.timestamp).toLocaleTimeString()),
      data: recentValues.map(v => v.value)
    };
  }

  /**
   * Prepare data for bar chart widget
   */
  private prepareBarData(metric: Metric): {
    readonly labels: string[];
    readonly data: number[];
  } {
    // Group by labels
    const groups = new Map<string, number[]>();

    for (const value of metric.values) {
      const labelKey = Object.keys(value.labels).length > 0
        ? JSON.stringify(value.labels)
        : 'default';

      const existing = groups.get(labelKey) || [];
      existing.push(value.value);
      groups.set(labelKey, existing);
    }

    const labels: string[] = [];
    const data: number[] = [];

    for (const [label, values] of groups.entries()) {
      labels.push(label);
      const average = values.reduce((sum, v) => sum + v, 0) / values.length;
      data.push(average);
    }

    return { labels, data };
  }

  /**
   * Prepare data for pie chart widget
   */
  private preparePieData(metric: Metric): {
    readonly labels: string[];
    readonly data: number[];
  } {
    return this.prepareBarData(metric); // Similar to bar chart
  }

  /**
   * Prepare data for gauge widget
   */
  private prepareGaugeData(metric: Metric): {
    readonly value: number;
    readonly min: number;
    readonly max: number;
    readonly unit: string;
  } {
    const latestValue = metric.values[metric.values.length - 1];
    const allValues = metric.values.map(v => v.value);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);

    return {
      value: latestValue?.value || 0,
      min,
      max,
      unit: metric.unit
    };
  }

  /**
   * Prepare data for table widget
   */
  private prepareTableData(metric: Metric): {
    readonly columns: string[];
    readonly rows: Array<Record<string, unknown>>;
  } {
    const recentValues = metric.values.slice(-20);

    return {
      columns: ['Time', 'Value', 'Labels'],
      rows: recentValues.map(v => ({
        time: new Date(v.timestamp).toLocaleString(),
        value: v.value,
        labels: JSON.stringify(v.labels)
      }))
    };
  }

  /**
   * Clear all widget data
   */
  public clearData(): void {
    this.widgetData.clear();
  }

  /**
   * Get widget count
   */
  public getWidgetCount(): number {
    return this.config.widgets.length;
  }
}
