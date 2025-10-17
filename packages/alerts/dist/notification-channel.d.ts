/**
 * Notification Channel - Send notifications via different channels
 */
import type { AlertRule } from './alert-rule.js';
export type ChannelType = 'webhook' | 'email' | 'slack' | 'discord' | 'pagerduty' | 'console';
export interface NotificationConfig {
    readonly id: string;
    readonly name: string;
    readonly type: ChannelType;
    readonly enabled: boolean;
    readonly config: Record<string, unknown>;
}
export interface NotificationResult {
    readonly success: boolean;
    readonly channelId: string;
    readonly timestamp: number;
    readonly error?: string;
}
export interface NotificationPayload {
    readonly rule: AlertRule;
    readonly message: string;
    readonly timestamp: number;
    readonly severity: string;
    readonly metadata: Record<string, unknown>;
}
export declare abstract class NotificationChannel {
    protected readonly config: NotificationConfig;
    constructor(config: NotificationConfig);
    abstract send(payload: NotificationPayload): Promise<NotificationResult>;
    getId(): string;
    getName(): string;
    getType(): ChannelType;
    isEnabled(): boolean;
    protected createResult(success: boolean, error?: string): NotificationResult;
}
export declare class WebhookChannel extends NotificationChannel {
    send(payload: NotificationPayload): Promise<NotificationResult>;
}
export declare class EmailChannel extends NotificationChannel {
    send(payload: NotificationPayload): Promise<NotificationResult>;
}
export declare class ConsoleChannel extends NotificationChannel {
    send(payload: NotificationPayload): Promise<NotificationResult>;
}
export declare class ChannelFactory {
    static create(config: NotificationConfig): NotificationChannel;
}
//# sourceMappingURL=notification-channel.d.ts.map