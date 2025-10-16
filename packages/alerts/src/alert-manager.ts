/**
 * Alert Manager - Main alert management interface
 */

import type { AlertRule, AlertSeverity } from './alert-rule.js';
import { AlertEvaluator, type EvaluationContext, type EvaluationResult } from './alert-evaluator.js';
import { NotificationChannel, ChannelFactory, type NotificationConfig, type NotificationPayload } from './notification-channel.js';
import { AnomalyDetector, type AnomalyConfig, type Anomaly } from './anomaly-detector.js';

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
  readonly notificationResults: Array<{ readonly channelId: string; readonly success: boolean }>;
}

export interface AlertStats {
  readonly totalRules: number;
  readonly activeRules: number;
  readonly totalAlerts: number;
  readonly alertsBySeverity: Record<AlertSeverity, number>;
  readonly channelCount: number;
}

export class AlertManager {
  private readonly config: AlertConfig;
  private readonly evaluator: AlertEvaluator;
  private readonly anomalyDetector: AnomalyDetector | null = null;

  private rules = new Map<string, AlertRule>();
  private channels = new Map<string, NotificationChannel>();
  private history: AlertHistory[] = [];
  private evaluationInterval: NodeJS.Timeout | null = null;
  private cooldowns = new Map<string, number>();

  public constructor(config?: Partial<AlertConfig>) {
    this.config = {
      enableAnomalyDetection: false,
      evaluationInterval: 10000, // 10 seconds
      maxHistorySize: 1000,
      ...config
    };

    this.evaluator = new AlertEvaluator();

    if (this.config.enableAnomalyDetection) {
      this.anomalyDetector = new AnomalyDetector(this.config.anomalyConfig);
    }
  }

  public addRule(rule: AlertRule): void {
    this.rules.set(rule.id, rule);
  }

  public removeRule(ruleId: string): void {
    this.rules.delete(ruleId);
    this.evaluator.resetRule(ruleId);
    this.cooldowns.delete(ruleId);
  }

  public getRule(ruleId: string): AlertRule | undefined {
    return this.rules.get(ruleId);
  }

  public getAllRules(): AlertRule[] {
    return Array.from(this.rules.values());
  }

  public updateRule(ruleId: string, updates: Partial<AlertRule>): void {
    const rule = this.rules.get(ruleId);
    if (rule === undefined) {
      throw new Error(`Rule ${ruleId} not found`);
    }

    this.rules.set(ruleId, {
      ...rule,
      ...updates,
      updatedAt: Date.now()
    });
  }

  public addChannel(config: NotificationConfig): void {
    const channel = ChannelFactory.create(config);
    this.channels.set(config.id, channel);
  }

  public removeChannel(channelId: string): void {
    this.channels.delete(channelId);
  }

  public getChannel(channelId: string): NotificationChannel | undefined {
    return this.channels.get(channelId);
  }

  public getAllChannels(): NotificationChannel[] {
    return Array.from(this.channels.values());
  }

  public async evaluate(context: EvaluationContext): Promise<EvaluationResult[]> {
    const results: EvaluationResult[] = [];

    for (const rule of this.rules.values()) {
      if (!rule.enabled) {
        continue;
      }

      // Check cooldown
      const cooldownEnd = this.cooldowns.get(rule.id);
      if (cooldownEnd !== undefined && Date.now() < cooldownEnd) {
        continue;
      }

      const result = this.evaluator.evaluate(rule, context);
      results.push(result);

      if (result.triggered) {
        await this.handleTriggeredAlert(rule, result);
      }
    }

    return results;
  }

  public detectAnomalies(metric: string, value: number, timestamp: number): Anomaly[] {
    if (this.anomalyDetector === null) {
      return [];
    }

    return this.anomalyDetector.detect(metric, value, timestamp);
  }

  private async handleTriggeredAlert(rule: AlertRule, result: EvaluationResult): Promise<void> {
    const now = Date.now();

    // Update rule state
    rule.lastTriggered = now;
    rule.state = 'active';
    this.rules.set(rule.id, rule);

    // Set cooldown
    this.cooldowns.set(rule.id, now + rule.cooldown);

    // Send notifications
    const notificationResults = await this.sendNotifications(rule, result);

    // Add to history
    this.addToHistory({
      ruleId: rule.id,
      timestamp: now,
      triggered: true,
      message: result.message || 'Alert triggered',
      notificationResults
    });
  }

  private async sendNotifications(
    rule: AlertRule,
    result: EvaluationResult
  ): Promise<Array<{ readonly channelId: string; readonly success: boolean }>> {
    const results: Array<{ channelId: string; success: boolean }> = [];

    const payload: NotificationPayload = {
      rule,
      message: result.message || 'Alert triggered',
      timestamp: result.timestamp,
      severity: rule.severity,
      metadata: {
        conditions: result.conditions
      }
    };

    for (const channelId of rule.actions) {
      const channel = this.channels.get(channelId);
      if (channel === undefined || !channel.isEnabled()) {
        continue;
      }

      try {
        const sendResult = await channel.send(payload);
        results.push({
          channelId,
          success: sendResult.success
        });
      } catch (error) {
        results.push({
          channelId,
          success: false
        });
      }
    }

    return results;
  }

  private addToHistory(entry: AlertHistory): void {
    this.history.push(entry);

    // Trim history if needed
    if (this.history.length > this.config.maxHistorySize) {
      this.history.shift();
    }
  }

  public getHistory(limit?: number): AlertHistory[] {
    const sorted = [...this.history].sort((a, b) => b.timestamp - a.timestamp);
    return limit !== undefined ? sorted.slice(0, limit) : sorted;
  }

  public getHistoryForRule(ruleId: string, limit?: number): AlertHistory[] {
    const filtered = this.history.filter(h => h.ruleId === ruleId);
    const sorted = filtered.sort((a, b) => b.timestamp - a.timestamp);
    return limit !== undefined ? sorted.slice(0, limit) : sorted;
  }

  public getStats(): AlertStats {
    const activeRules = Array.from(this.rules.values()).filter(r => r.enabled).length;
    const alertsBySeverity: Record<AlertSeverity, number> = {
      critical: 0,
      warning: 0,
      info: 0
    };

    for (const rule of this.rules.values()) {
      alertsBySeverity[rule.severity] = (alertsBySeverity[rule.severity] || 0) + 1;
    }

    return {
      totalRules: this.rules.size,
      activeRules,
      totalAlerts: this.history.length,
      alertsBySeverity,
      channelCount: this.channels.size
    };
  }

  public startAutoEvaluation(getContext: () => EvaluationContext): void {
    if (this.evaluationInterval !== null) {
      return;
    }

    this.evaluationInterval = setInterval(async () => {
      const context = getContext();
      await this.evaluate(context);
    }, this.config.evaluationInterval);
  }

  public stopAutoEvaluation(): void {
    if (this.evaluationInterval !== null) {
      clearInterval(this.evaluationInterval);
      this.evaluationInterval = null;
    }
  }

  public clearHistory(): void {
    this.history = [];
  }

  public reset(): void {
    this.rules.clear();
    this.channels.clear();
    this.history = [];
    this.cooldowns.clear();
    this.evaluator.reset();

    if (this.anomalyDetector !== null) {
      this.anomalyDetector.reset();
    }
  }

  public dispose(): void {
    this.stopAutoEvaluation();
    this.reset();
  }
}
