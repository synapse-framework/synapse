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
export declare class MetricsDashboard {
    private config;
    private widgetData;
    private refreshIntervals;
    constructor(config: DashboardConfig);
    /**
     * Add a widget to the dashboard
     */
    addWidget(widget: DashboardWidget): void;
    /**
     * Remove a widget from the dashboard
     */
    removeWidget(widgetId: string): void;
    /**
     * Update widget data
     */
    updateWidgetData(widgetId: string, data: unknown, error?: string): void;
    /**
     * Get widget data
     */
    getWidgetData(widgetId: string): WidgetData | undefined;
    /**
     * Get all widget data
     */
    getAllWidgetData(): Map<string, WidgetData>;
    /**
     * Get dashboard data
     */
    getDashboardData(): DashboardData;
    /**
     * Update widget configuration
     */
    updateWidget(widgetId: string, updates: Partial<DashboardWidget>): void;
    /**
     * Get widget by ID
     */
    getWidget(widgetId: string): DashboardWidget | undefined;
    /**
     * Get all widgets
     */
    getWidgets(): DashboardWidget[];
    /**
     * Set dashboard configuration
     */
    setConfig(config: DashboardConfig): void;
    /**
     * Get dashboard configuration
     */
    getConfig(): DashboardConfig;
    /**
     * Start auto-refresh for a widget
     */
    startWidgetRefresh(widgetId: string, callback: () => void): void;
    /**
     * Stop auto-refresh for a widget
     */
    stopWidgetRefresh(widgetId: string): void;
    /**
     * Start all widget refreshes
     */
    startAllRefreshes(getMetric: (name: string) => Metric | undefined): void;
    /**
     * Stop all widget refreshes
     */
    stopAllRefreshes(): void;
    /**
     * Prepare data for widget visualization
     */
    private prepareWidgetData;
    /**
     * Prepare data for number widget
     */
    private prepareNumberData;
    /**
     * Prepare data for line chart widget
     */
    private prepareLineData;
    /**
     * Prepare data for bar chart widget
     */
    private prepareBarData;
    /**
     * Prepare data for pie chart widget
     */
    private preparePieData;
    /**
     * Prepare data for gauge widget
     */
    private prepareGaugeData;
    /**
     * Prepare data for table widget
     */
    private prepareTableData;
    /**
     * Clear all widget data
     */
    clearData(): void;
    /**
     * Get widget count
     */
    getWidgetCount(): number;
}
//# sourceMappingURL=metrics-dashboard.d.ts.map