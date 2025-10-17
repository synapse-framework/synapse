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
export declare class RealUserMonitoring {
    private readonly sessions;
    private currentSessionId;
    private isRunning;
    start(): void;
    stop(): void;
    private generateSessionId;
    trackPageView(): void;
    trackInteraction(): void;
    trackError(): void;
    getData(): RUMData | undefined;
    getAllSessions(): RUMData[];
    clear(): void;
}
//# sourceMappingURL=rum.d.ts.map