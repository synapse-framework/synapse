/**
 * Notification Channel - Send notifications via different channels
 */
export class NotificationChannel {
    config;
    constructor(config) {
        this.config = config;
    }
    getId() {
        return this.config.id;
    }
    getName() {
        return this.config.name;
    }
    getType() {
        return this.config.type;
    }
    isEnabled() {
        return this.config.enabled;
    }
    createResult(success, error) {
        return {
            success,
            channelId: this.config.id,
            timestamp: Date.now(),
            error
        };
    }
}
export class WebhookChannel extends NotificationChannel {
    async send(payload) {
        try {
            const url = this.config.config['url'];
            if (!url) {
                return this.createResult(false, 'Webhook URL not configured');
            }
            // In a real implementation, this would make an HTTP request
            // For now, we'll simulate it
            console.log(`[Webhook] Sending to ${url}:`, payload);
            return this.createResult(true);
        }
        catch (error) {
            return this.createResult(false, error instanceof Error ? error.message : 'Unknown error');
        }
    }
}
export class EmailChannel extends NotificationChannel {
    async send(payload) {
        try {
            const to = this.config.config['to'];
            if (!to) {
                return this.createResult(false, 'Email recipient not configured');
            }
            console.log(`[Email] Sending to ${to}:`, payload);
            return this.createResult(true);
        }
        catch (error) {
            return this.createResult(false, error instanceof Error ? error.message : 'Unknown error');
        }
    }
}
export class ConsoleChannel extends NotificationChannel {
    async send(payload) {
        try {
            console.log(`[ALERT ${payload.severity.toUpperCase()}]`, payload.message);
            console.log('Rule:', payload.rule.name);
            console.log('Timestamp:', new Date(payload.timestamp).toISOString());
            return this.createResult(true);
        }
        catch (error) {
            return this.createResult(false, error instanceof Error ? error.message : 'Unknown error');
        }
    }
}
export class ChannelFactory {
    static create(config) {
        switch (config.type) {
            case 'webhook':
                return new WebhookChannel(config);
            case 'email':
                return new EmailChannel(config);
            case 'console':
                return new ConsoleChannel(config);
            default:
                throw new Error(`Unsupported channel type: ${config.type}`);
        }
    }
}
//# sourceMappingURL=notification-channel.js.map