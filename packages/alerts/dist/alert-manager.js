/**
 * Alert Manager - Main alert management interface
 */
import { AlertEvaluator } from './alert-evaluator.js';
import { NotificationChannel, ChannelFactory } from './notification-channel.js';
import { AnomalyDetector } from './anomaly-detector.js';
export class AlertManager {
    config;
    evaluator;
    anomalyDetector = null;
    rules = new Map();
    channels = new Map();
    history = [];
    evaluationInterval = null;
    cooldowns = new Map();
    constructor(config) {
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
    addRule(rule) {
        this.rules.set(rule.id, rule);
    }
    removeRule(ruleId) {
        this.rules.delete(ruleId);
        this.evaluator.resetRule(ruleId);
        this.cooldowns.delete(ruleId);
    }
    getRule(ruleId) {
        return this.rules.get(ruleId);
    }
    getAllRules() {
        return Array.from(this.rules.values());
    }
    updateRule(ruleId, updates) {
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
    addChannel(config) {
        const channel = ChannelFactory.create(config);
        this.channels.set(config.id, channel);
    }
    removeChannel(channelId) {
        this.channels.delete(channelId);
    }
    getChannel(channelId) {
        return this.channels.get(channelId);
    }
    getAllChannels() {
        return Array.from(this.channels.values());
    }
    async evaluate(context) {
        const results = [];
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
    detectAnomalies(metric, value, timestamp) {
        if (this.anomalyDetector === null) {
            return [];
        }
        return this.anomalyDetector.detect(metric, value, timestamp);
    }
    async handleTriggeredAlert(rule, result) {
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
    async sendNotifications(rule, result) {
        const results = [];
        const payload = {
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
            }
            catch (error) {
                results.push({
                    channelId,
                    success: false
                });
            }
        }
        return results;
    }
    addToHistory(entry) {
        this.history.push(entry);
        // Trim history if needed
        if (this.history.length > this.config.maxHistorySize) {
            this.history.shift();
        }
    }
    getHistory(limit) {
        const sorted = [...this.history].sort((a, b) => b.timestamp - a.timestamp);
        return limit !== undefined ? sorted.slice(0, limit) : sorted;
    }
    getHistoryForRule(ruleId, limit) {
        const filtered = this.history.filter(h => h.ruleId === ruleId);
        const sorted = filtered.sort((a, b) => b.timestamp - a.timestamp);
        return limit !== undefined ? sorted.slice(0, limit) : sorted;
    }
    getStats() {
        const activeRules = Array.from(this.rules.values()).filter(r => r.enabled).length;
        const alertsBySeverity = {
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
    startAutoEvaluation(getContext) {
        if (this.evaluationInterval !== null) {
            return;
        }
        this.evaluationInterval = setInterval(async () => {
            const context = getContext();
            await this.evaluate(context);
        }, this.config.evaluationInterval);
    }
    stopAutoEvaluation() {
        if (this.evaluationInterval !== null) {
            clearInterval(this.evaluationInterval);
            this.evaluationInterval = null;
        }
    }
    clearHistory() {
        this.history = [];
    }
    reset() {
        this.rules.clear();
        this.channels.clear();
        this.history = [];
        this.cooldowns.clear();
        this.evaluator.reset();
        if (this.anomalyDetector !== null) {
            this.anomalyDetector.reset();
        }
    }
    dispose() {
        this.stopAutoEvaluation();
        this.reset();
    }
}
//# sourceMappingURL=alert-manager.js.map