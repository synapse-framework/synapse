/**
 * Alert Rule - Define alert conditions and thresholds
 */
export class AlertRuleBuilder {
    rule = {
        enabled: true,
        cooldown: 300000, // 5 minutes
        tags: [],
        labels: {},
        actions: [],
        state: 'pending'
    };
    setId(id) {
        this.rule.id = id;
        return this;
    }
    setName(name) {
        this.rule.name = name;
        return this;
    }
    setDescription(description) {
        this.rule.description = description;
        return this;
    }
    setSeverity(severity) {
        this.rule.severity = severity;
        return this;
    }
    addCondition(condition) {
        this.rule.conditions = [...(this.rule.conditions || []), condition];
        return this;
    }
    setConditions(conditions) {
        this.rule.conditions = conditions;
        return this;
    }
    setEnabled(enabled) {
        this.rule.enabled = enabled;
        return this;
    }
    setCooldown(cooldown) {
        this.rule.cooldown = cooldown;
        return this;
    }
    addTag(tag) {
        this.rule.tags = [...(this.rule.tags || []), tag];
        return this;
    }
    setTags(tags) {
        this.rule.tags = tags;
        return this;
    }
    addLabel(key, value) {
        this.rule.labels = { ...(this.rule.labels || {}), [key]: value };
        return this;
    }
    setLabels(labels) {
        this.rule.labels = labels;
        return this;
    }
    addAction(actionId) {
        this.rule.actions = [...(this.rule.actions || []), actionId];
        return this;
    }
    setActions(actions) {
        this.rule.actions = actions;
        return this;
    }
    build() {
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
//# sourceMappingURL=alert-rule.js.map