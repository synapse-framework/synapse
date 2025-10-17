/**
 * Alert Evaluator - Evaluate alert conditions
 */
import type { AlertRule, AlertCondition } from './alert-rule.js';
export interface EvaluationContext {
    readonly metricValues: Map<string, number[]>;
    readonly timestamp: number;
}
export interface EvaluationResult {
    readonly ruleId: string;
    readonly triggered: boolean;
    readonly conditions: ConditionEvaluationResult[];
    readonly timestamp: number;
    readonly message?: string;
}
export interface ConditionEvaluationResult {
    readonly condition: AlertCondition;
    readonly actualValue: number;
    readonly threshold: number;
    readonly met: boolean;
    readonly duration: number;
}
export declare class AlertEvaluator {
    private conditionStates;
    evaluate(rule: AlertRule, context: EvaluationContext): EvaluationResult;
    private evaluateCondition;
    private aggregateValues;
    private compareValue;
    private generateMessage;
    reset(): void;
    resetRule(ruleId: string): void;
}
//# sourceMappingURL=alert-evaluator.d.ts.map