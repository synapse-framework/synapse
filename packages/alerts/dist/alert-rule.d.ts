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
    readonly duration: number;
    readonly aggregation?: 'average' | 'sum' | 'min' | 'max' | 'count';
}
export interface AlertRule {
    id: string;
    name: string;
    description: string;
    severity: AlertSeverity;
    conditions: AlertCondition[];
    enabled: boolean;
    cooldown: number;
    tags: string[];
    labels: Record<string, string>;
    actions: string[];
    createdAt: number;
    updatedAt: number;
    lastTriggered?: number;
    state: AlertState;
}
export declare class AlertRuleBuilder {
    private rule;
    setId(id: string): this;
    setName(name: string): this;
    setDescription(description: string): this;
    setSeverity(severity: AlertSeverity): this;
    addCondition(condition: AlertCondition): this;
    setConditions(conditions: AlertCondition[]): this;
    setEnabled(enabled: boolean): this;
    setCooldown(cooldown: number): this;
    addTag(tag: string): this;
    setTags(tags: string[]): this;
    addLabel(key: string, value: string): this;
    setLabels(labels: Record<string, string>): this;
    addAction(actionId: string): this;
    setActions(actions: string[]): this;
    build(): AlertRule;
}
//# sourceMappingURL=alert-rule.d.ts.map