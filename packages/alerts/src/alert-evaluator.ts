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

export class AlertEvaluator {
  private conditionStates = new Map<string, ConditionState>();

  public evaluate(rule: AlertRule, context: EvaluationContext): EvaluationResult {
    const conditionResults: ConditionEvaluationResult[] = [];
    let allConditionsMet = true;

    for (const condition of rule.conditions) {
      const result = this.evaluateCondition(rule.id, condition, context);
      conditionResults.push(result);

      if (!result.met) {
        allConditionsMet = false;
      }
    }

    const triggered = allConditionsMet && conditionResults.length > 0;

    return {
      ruleId: rule.id,
      triggered,
      conditions: conditionResults,
      timestamp: context.timestamp,
      message: triggered ? this.generateMessage(rule, conditionResults) : undefined
    };
  }

  private evaluateCondition(
    ruleId: string,
    condition: AlertCondition,
    context: EvaluationContext
  ): ConditionEvaluationResult {
    const values = context.metricValues.get(condition.metric) || [];

    if (values.length === 0) {
      return {
        condition,
        actualValue: 0,
        threshold: condition.threshold,
        met: false,
        duration: 0
      };
    }

    const actualValue = this.aggregateValues(values, condition.aggregation || 'average');
    const comparisonMet = this.compareValue(actualValue, condition.operator, condition.threshold);

    const stateKey = `${ruleId}:${condition.metric}`;
    const state = this.conditionStates.get(stateKey) || {
      firstMetAt: 0,
      consecutiveMet: false
    };

    let durationMet = false;
    let duration = 0;

    if (comparisonMet) {
      if (!state.consecutiveMet) {
        state.firstMetAt = context.timestamp;
        state.consecutiveMet = true;
      }

      duration = context.timestamp - state.firstMetAt;
      durationMet = duration >= condition.duration;
    } else {
      state.consecutiveMet = false;
      state.firstMetAt = 0;
      duration = 0;
    }

    this.conditionStates.set(stateKey, state);

    return {
      condition,
      actualValue,
      threshold: condition.threshold,
      met: durationMet,
      duration
    };
  }

  private aggregateValues(values: number[], aggregation: string): number {
    if (values.length === 0) {
      return 0;
    }

    switch (aggregation) {
      case 'sum':
        return values.reduce((sum, v) => sum + v, 0);
      case 'average':
        return values.reduce((sum, v) => sum + v, 0) / values.length;
      case 'min':
        return Math.min(...values);
      case 'max':
        return Math.max(...values);
      case 'count':
        return values.length;
      default:
        return values[values.length - 1] || 0;
    }
  }

  private compareValue(actual: number, operator: string, threshold: number): boolean {
    switch (operator) {
      case '>':
        return actual > threshold;
      case '>=':
        return actual >= threshold;
      case '<':
        return actual < threshold;
      case '<=':
        return actual <= threshold;
      case '=':
        return actual === threshold;
      case '!=':
        return actual !== threshold;
      default:
        return false;
    }
  }

  private generateMessage(rule: AlertRule, results: ConditionEvaluationResult[]): string {
    const parts: string[] = [`Alert '${rule.name}' triggered:`];

    for (const result of results) {
      if (result.met) {
        parts.push(
          `${result.condition.metric} ${result.condition.operator} ${result.condition.threshold} ` +
          `(actual: ${result.actualValue.toFixed(2)})`
        );
      }
    }

    return parts.join(' ');
  }

  public reset(): void {
    this.conditionStates.clear();
  }

  public resetRule(ruleId: string): void {
    for (const key of this.conditionStates.keys()) {
      if (key.startsWith(ruleId + ':')) {
        this.conditionStates.delete(key);
      }
    }
  }
}

interface ConditionState {
  firstMetAt: number;
  consecutiveMet: boolean;
}
