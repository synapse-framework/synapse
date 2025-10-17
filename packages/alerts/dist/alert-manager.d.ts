/**
 * Alert Manager - Main alert management interface
 */
import type { AlertRule, AlertSeverity } from './alert-rule.js';
import { type EvaluationContext, type EvaluationResult } from './alert-evaluator.js';
import { NotificationChannel, type NotificationConfig } from './notification-channel.js';
import { type AnomalyConfig, type Anomaly } from './anomaly-detector.js';
export interface AlertConfig {
    readonly enableAnomalyDetection: boolean;
    readonly anomalyConfig?: AnomalyConfig;
    readonly evaluationInterval: number;
    readonly maxHistorySize: number;
}
export interface AlertHistory {
    readonly ruleId: string;
    readonly timestamp: number;
    readonly triggered: boolean;
    readonly message: string;
    readonly notificationResults: Array<{
        readonly channelId: string;
        readonly success: boolean;
    }>;
}
export interface AlertStats {
    readonly totalRules: number;
    readonly activeRules: number;
    readonly totalAlerts: number;
    readonly alertsBySeverity: Record<AlertSeverity, number>;
    readonly channelCount: number;
}
export declare class AlertManager {
    private readonly config;
    private readonly evaluator;
    private readonly anomalyDetector;
    private rules;
    private channels;
    private history;
    private evaluationInterval;
    private cooldowns;
    constructor(config?: Partial<AlertConfig>);
    addRule(rule: AlertRule): void;
    removeRule(ruleId: string): void;
    getRule(ruleId: string): AlertRule | undefined;
    getAllRules(): AlertRule[];
    updateRule(ruleId: string, updates: Partial<AlertRule>): void;
    addChannel(config: NotificationConfig): void;
    removeChannel(channelId: string): void;
    getChannel(channelId: string): NotificationChannel | undefined;
    getAllChannels(): NotificationChannel[];
    evaluate(context: EvaluationContext): Promise<EvaluationResult[]>;
    detectAnomalies(metric: string, value: number, timestamp: number): Anomaly[];
    private handleTriggeredAlert;
    private sendNotifications;
    private addToHistory;
    getHistory(limit?: number): AlertHistory[];
    getHistoryForRule(ruleId: string, limit?: number): AlertHistory[];
    getStats(): AlertStats;
    startAutoEvaluation(getContext: () => EvaluationContext): void;
    stopAutoEvaluation(): void;
    clearHistory(): void;
    reset(): void;
    dispose(): void;
}
//# sourceMappingURL=alert-manager.d.ts.map