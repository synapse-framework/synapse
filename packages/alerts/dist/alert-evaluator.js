/**
 * Alert Evaluator - Evaluate alert conditions
 */
export class AlertEvaluator {
    conditionStates = new Map();
    evaluate(rule, context) {
        const conditionResults = [];
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
    evaluateCondition(ruleId, condition, context) {
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
        }
        else {
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
    aggregateValues(values, aggregation) {
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
    compareValue(actual, operator, threshold) {
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
    generateMessage(rule, results) {
        const parts = [`Alert '${rule.name}' triggered:`];
        for (const result of results) {
            if (result.met) {
                parts.push(`${result.condition.metric} ${result.condition.operator} ${result.condition.threshold} ` +
                    `(actual: ${result.actualValue.toFixed(2)})`);
            }
        }
        return parts.join(' ');
    }
    reset() {
        this.conditionStates.clear();
    }
    resetRule(ruleId) {
        for (const key of this.conditionStates.keys()) {
            if (key.startsWith(ruleId + ':')) {
                this.conditionStates.delete(key);
            }
        }
    }
}
//# sourceMappingURL=alert-evaluator.js.map