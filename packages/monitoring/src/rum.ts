/**
 * Real User Monitoring (RUM)
 *
 * Monitor real user interactions and experience
 */

export interface RUMData {
  readonly sessionId: string;
  readonly userId?: string;
  readonly pageViews: number;
  readonly interactions: number;
  readonly errors: number;
  readonly averageLoadTime: number;
  readonly browserInfo?: BrowserInfo;
}

export interface BrowserInfo {
  readonly userAgent: string;
  readonly language: string;
  readonly platform: string;
  readonly screenResolution: string;
}

export class RealUserMonitoring {
  private readonly sessions: Map<string, RUMData> = new Map();
  private currentSessionId: string = '';
  private isRunning: boolean = false;

  public start(): void {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    this.currentSessionId = this.generateSessionId();
    console.log('👤 Real User Monitoring started');
  }

  public stop(): void {
    if (!this.isRunning) {
      return;
    }
    this.isRunning = false;
    console.log('👤 Real User Monitoring stopped');
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  public trackPageView(): void {
    const session = this.sessions.get(this.currentSessionId);
    if (session) {
      this.sessions.set(this.currentSessionId, {
        ...session,
        pageViews: session.pageViews + 1
      });
    } else {
      this.sessions.set(this.currentSessionId, {
        sessionId: this.currentSessionId,
        pageViews: 1,
        interactions: 0,
        errors: 0,
        averageLoadTime: 0
      });
    }
  }

  public trackInteraction(): void {
    const session = this.sessions.get(this.currentSessionId);
    if (session) {
      this.sessions.set(this.currentSessionId, {
        ...session,
        interactions: session.interactions + 1
      });
    }
  }

  public trackError(): void {
    const session = this.sessions.get(this.currentSessionId);
    if (session) {
      this.sessions.set(this.currentSessionId, {
        ...session,
        errors: session.errors + 1
      });
    }
  }

  public getData(): RUMData | undefined {
    return this.sessions.get(this.currentSessionId);
  }

  public getAllSessions(): RUMData[] {
    return Array.from(this.sessions.values());
  }

  public clear(): void {
    this.sessions.clear();
  }
}
