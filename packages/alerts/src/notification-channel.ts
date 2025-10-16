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

export abstract class NotificationChannel {
  protected readonly config: NotificationConfig;

  public constructor(config: NotificationConfig) {
    this.config = config;
  }

  public abstract send(payload: NotificationPayload): Promise<NotificationResult>;

  public getId(): string {
    return this.config.id;
  }

  public getName(): string {
    return this.config.name;
  }

  public getType(): ChannelType {
    return this.config.type;
  }

  public isEnabled(): boolean {
    return this.config.enabled;
  }

  protected createResult(success: boolean, error?: string): NotificationResult {
    return {
      success,
      channelId: this.config.id,
      timestamp: Date.now(),
      error
    };
  }
}

export class WebhookChannel extends NotificationChannel {
  public async send(payload: NotificationPayload): Promise<NotificationResult> {
    try {
      const url = this.config.config['url'] as string;
      if (!url) {
        return this.createResult(false, 'Webhook URL not configured');
      }

      // In a real implementation, this would make an HTTP request
      // For now, we'll simulate it
      console.log(`[Webhook] Sending to ${url}:`, payload);

      return this.createResult(true);
    } catch (error) {
      return this.createResult(false, error instanceof Error ? error.message : 'Unknown error');
    }
  }
}

export class EmailChannel extends NotificationChannel {
  public async send(payload: NotificationPayload): Promise<NotificationResult> {
    try {
      const to = this.config.config['to'] as string;
      if (!to) {
        return this.createResult(false, 'Email recipient not configured');
      }

      console.log(`[Email] Sending to ${to}:`, payload);

      return this.createResult(true);
    } catch (error) {
      return this.createResult(false, error instanceof Error ? error.message : 'Unknown error');
    }
  }
}

export class ConsoleChannel extends NotificationChannel {
  public async send(payload: NotificationPayload): Promise<NotificationResult> {
    try {
      console.log(`[ALERT ${payload.severity.toUpperCase()}]`, payload.message);
      console.log('Rule:', payload.rule.name);
      console.log('Timestamp:', new Date(payload.timestamp).toISOString());

      return this.createResult(true);
    } catch (error) {
      return this.createResult(false, error instanceof Error ? error.message : 'Unknown error');
    }
  }
}

export class ChannelFactory {
  public static create(config: NotificationConfig): NotificationChannel {
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
