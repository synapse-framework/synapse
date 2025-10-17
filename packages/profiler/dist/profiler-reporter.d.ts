/**
 * Profiler Reporter - Generate reports from profiling data
 */
import type { CPUProfile, FlameGraphData } from './cpu-profiler.js';
import type { MemoryProfile } from './memory-profiler.js';
import type { NetworkProfile } from './network-profiler.js';
export type ReportFormat = 'json' | 'html' | 'markdown' | 'text';
export interface ReportOptions {
    readonly format: ReportFormat;
    readonly includeMetadata: boolean;
    readonly includeCharts: boolean;
    readonly maxEntries: number;
}
export interface ProfileReport {
    readonly title: string;
    readonly timestamp: number;
    readonly format: ReportFormat;
    readonly content: string;
    readonly metadata: Record<string, unknown>;
}
export declare class ProfilerReporter {
    private readonly defaultOptions;
    /**
     * Generate report from CPU profile
     */
    generateCPUReport(profile: CPUProfile, options?: Partial<ReportOptions>): ProfileReport;
    /**
     * Generate report from memory profile
     */
    generateMemoryReport(profile: MemoryProfile, options?: Partial<ReportOptions>): ProfileReport;
    /**
     * Generate report from network profile
     */
    generateNetworkReport(profile: NetworkProfile, options?: Partial<ReportOptions>): ProfileReport;
    /**
     * Generate combined report from all profiles
     */
    generateCombinedReport(cpuProfile: CPUProfile | null, memoryProfile: MemoryProfile | null, networkProfile: NetworkProfile | null, options?: Partial<ReportOptions>): ProfileReport;
    /**
     * Generate flame graph visualization data
     */
    generateFlameGraphData(flameGraph: FlameGraphData): string;
    private generateCPUReportJSON;
    private generateCPUReportHTML;
    private generateCPUReportMarkdown;
    private generateCPUReportText;
    private generateMemoryReportJSON;
    private generateMemoryReportHTML;
    private generateMemoryReportMarkdown;
    private generateMemoryReportText;
    private generateNetworkReportJSON;
    private generateNetworkReportHTML;
    private generateNetworkReportMarkdown;
    private generateNetworkReportText;
    private formatBytes;
    private escapeHTML;
}
//# sourceMappingURL=profiler-reporter.d.ts.map