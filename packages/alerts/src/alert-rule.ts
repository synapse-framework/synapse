/**
 * Alert Rule - Define alert conditions and thresholds
 */

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertState = 'active' | 'pending' | 'resolved' | 'silenced';
export type ComparisonOperator = '>' | '>=' | '<' | '<=' | '=' | '!=';

export interface AlertCondition {
  readonly metric: string;
  readonly operator: ComparisonOperator;
  readonly threshold: number;
  readonly duration: number; // milliseconds
  readonly aggregation?: 'average' | 'sum' | 'min' | 'max' | 'count';
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  severity: AlertSeverity;
  conditions: AlertCondition[];
  enabled: boolean;
  cooldown: number; // milliseconds
  tags: string[];
  labels: Record<string, string>;
  actions: string[]; // notification channel IDs
  createdAt: number;
  updatedAt: number;
  lastTriggered?: number;
  state: AlertState;
}

export class AlertRuleBuilder {
  private rule: Partial<AlertRule> = {
    enabled: true,
    cooldown: 300000, // 5 minutes
    tags: [],
    labels: {},
    actions: [],
    state: 'pending'
  };

  public setId(id: string): this {
    this.rule.id = id;
    return this;
  }

  public setName(name: string): this {
    this.rule.name = name;
    return this;
  }

  public setDescription(description: string): this {
    this.rule.description = description;
    return this;
  }

  public setSeverity(severity: AlertSeverity): this {
    this.rule.severity = severity;
    return this;
  }

  public addCondition(condition: AlertCondition): this {
    this.rule.conditions = [...(this.rule.conditions || []), condition];
    return this;
  }

  public setConditions(conditions: AlertCondition[]): this {
    this.rule.conditions = conditions;
    return this;
  }

  public setEnabled(enabled: boolean): this {
    this.rule.enabled = enabled;
    return this;
  }

  public setCooldown(cooldown: number): this {
    this.rule.cooldown = cooldown;
    return this;
  }

  public addTag(tag: string): this {
    this.rule.tags = [...(this.rule.tags || []), tag];
    return this;
  }

  public setTags(tags: string[]): this {
    this.rule.tags = tags;
    return this;
  }

  public addLabel(key: string, value: string): this {
    this.rule.labels = { ...(this.rule.labels || {}), [key]: value };
    return this;
  }

  public setLabels(labels: Record<string, string>): this {
    this.rule.labels = labels;
    return this;
  }

  public addAction(actionId: string): this {
    this.rule.actions = [...(this.rule.actions || []), actionId];
    return this;
  }

  public setActions(actions: string[]): this {
    this.rule.actions = actions;
    return this;
  }

  public build(): AlertRule {
    if (!this.rule.id || !this.rule.name || !this.rule.severity || !this.rule.conditions) {
      throw new Error('Missing required fields: id, name, severity, and conditions are required');
    }

    const now = Date.now();
    return {
      ...this.rule,
      id: this.rule.id,
      name: this.rule.name,
      description: this.rule.description || '',
      severity: this.rule.severity,
      conditions: this.rule.conditions,
      enabled: this.rule.enabled ?? true,
      cooldown: this.rule.cooldown ?? 300000,
      tags: this.rule.tags || [],
      labels: this.rule.labels || {},
      actions: this.rule.actions || [],
      createdAt: now,
      updatedAt: now,
      state: this.rule.state || 'pending'
    };
  }
}
