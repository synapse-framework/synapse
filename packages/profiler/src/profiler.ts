/**
 * Main Profiler - Unified interface for all profiling capabilities
 */

import { CPUProfiler, type CPUProfile, type FlameGraphData } from './cpu-profiler.js';
import { MemoryProfiler, type MemoryProfile } from './memory-profiler.js';
import { NetworkProfiler, type NetworkProfile } from './network-profiler.js';
import { ProfilerReporter, type ProfileReport, type ReportFormat } from './profiler-reporter.js';

export interface ProfilerConfig {
  readonly enableCPU: boolean;
  readonly enableMemory: boolean;
  readonly enableNetwork: boolean;
  readonly cpuSampleInterval: number;
  readonly memorySampleInterval: number;
  readonly autoReport: boolean;
  readonly reportFormat: ReportFormat;
}

export interface ProfilerSession {
  readonly id: string;
  readonly startTime: number;
  readonly endTime: number;
  readonly duration: number;
  readonly cpuProfile: CPUProfile | null;
  readonly memoryProfile: MemoryProfile | null;
  readonly networkProfile: NetworkProfile | null;
}

export interface ProfilerStats {
  readonly sessionsCompleted: number;
  readonly totalProfilingTime: number;
  readonly cpuProfilesGenerated: number;
  readonly memoryProfilesGenerated: number;
  readonly networkProfilesGenerated: number;
  readonly reportsGenerated: number;
}

export class Profiler {
  private readonly config: ProfilerConfig;
  private readonly cpuProfiler: CPUProfiler | null = null;
  private readonly memoryProfiler: MemoryProfiler | null = null;
  private readonly networkProfiler: NetworkProfiler | null = null;
  private readonly reporter: ProfilerReporter;

  private isRunning: boolean = false;
  private currentSessionId: string | null = null;
  private sessions: ProfilerSession[] = [];
  private stats: ProfilerStats = {
    sessionsCompleted: 0,
    totalProfilingTime: 0,
    cpuProfilesGenerated: 0,
    memoryProfilesGenerated: 0,
    networkProfilesGenerated: 0,
    reportsGenerated: 0
  };

  public constructor(config?: Partial<ProfilerConfig>) {
    this.config = {
      enableCPU: true,
      enableMemory: true,
      enableNetwork: true,
      cpuSampleInterval: 1,
      memorySampleInterval: 100,
      autoReport: false,
      reportFormat: 'json',
      ...config
    };

    if (this.config.enableCPU) {
      this.cpuProfiler = new CPUProfiler(this.config.cpuSampleInterval);
    }

    if (this.config.enableMemory) {
      this.memoryProfiler = new MemoryProfiler(this.config.memorySampleInterval);
    }

    if (this.config.enableNetwork) {
      this.networkProfiler = new NetworkProfiler();
    }

    this.reporter = new ProfilerReporter();
  }

  /**
   * Start profiling session
   */
  public start(): string {
    if (this.isRunning) {
      throw new Error('Profiler is already running');
    }

    this.isRunning = true;
    this.currentSessionId = this.generateSessionId();

    if (this.cpuProfiler !== null) {
      this.cpuProfiler.start();
    }

    if (this.memoryProfiler !== null) {
      this.memoryProfiler.start();
    }

    if (this.networkProfiler !== null) {
      this.networkProfiler.start();
    }

    return this.currentSessionId;
  }

  /**
   * Stop profiling session and return results
   */
  public stop(): ProfilerSession {
    if (!this.isRunning) {
      throw new Error('Profiler is not running');
    }

    this.isRunning = false;

    const cpuProfile = this.cpuProfiler !== null ? this.cpuProfiler.stop() : null;
    const memoryProfile = this.memoryProfiler !== null ? this.memoryProfiler.stop() : null;
    const networkProfile = this.networkProfiler !== null ? this.networkProfiler.stop() : null;

    const endTime = Date.now();
    const session: ProfilerSession = {
      id: this.currentSessionId || 'unknown',
      startTime: cpuProfile?.startTime || memoryProfile?.startTime || networkProfile?.startTime || 0,
      endTime,
      duration: cpuProfile?.duration || memoryProfile?.duration || networkProfile?.duration || 0,
      cpuProfile,
      memoryProfile,
      networkProfile
    };

    this.sessions.push(session);
    this.updateStats(session);

    if (this.config.autoReport) {
      this.generateReport(session);
    }

    this.currentSessionId = null;
    return session;
  }

  /**
   * Generate report for a session
   */
  public generateReport(session: ProfilerSession): ProfileReport {
    const report = this.reporter.generateCombinedReport(
      session.cpuProfile,
      session.memoryProfile,
      session.networkProfile,
      { format: this.config.reportFormat }
    );

    this.stats = {
      ...this.stats,
      reportsGenerated: this.stats.reportsGenerated + 1
    };

    return report;
  }

  /**
   * Generate flame graph from CPU profile
   */
  public generateFlameGraph(cpuProfile: CPUProfile): FlameGraphData {
    if (this.cpuProfiler === null) {
      throw new Error('CPU profiler is not enabled');
    }

    return this.cpuProfiler.generateFlameGraph(cpuProfile);
  }

  /**
   * Take a memory snapshot
   */
  public takeMemorySnapshot(): ReturnType<MemoryProfiler['takeSnapshot']> {
    if (this.memoryProfiler === null) {
      throw new Error('Memory profiler is not enabled');
    }

    return this.memoryProfiler.takeSnapshot();
  }

  /**
   * Record a network request
   */
  public recordNetworkRequest(request: Parameters<NetworkProfiler['recordRequest']>[0]): void {
    if (this.networkProfiler === null) {
      throw new Error('Network profiler is not enabled');
    }

    this.networkProfiler.recordRequest(request);
  }

  /**
   * Get all completed sessions
   */
  public getSessions(): readonly ProfilerSession[] {
    return [...this.sessions];
  }

  /**
   * Get session by ID
   */
  public getSession(id: string): ProfilerSession | undefined {
    return this.sessions.find(s => s.id === id);
  }

  /**
   * Get profiler statistics
   */
  public getStats(): ProfilerStats {
    return { ...this.stats };
  }

  /**
   * Clear all sessions
   */
  public clearSessions(): void {
    this.sessions = [];
  }

  /**
   * Check if profiler is currently running
   */
  public isProfilingActive(): boolean {
    return this.isRunning;
  }

  /**
   * Get current session ID
   */
  public getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }

  /**
   * Get profiler configuration
   */
  public getConfig(): Readonly<ProfilerConfig> {
    return { ...this.config };
  }

  /**
   * Profile a function execution
   */
  public async profile<T>(
    fn: () => T | Promise<T>,
    sessionName?: string
  ): Promise<{ readonly result: T; readonly session: ProfilerSession }> {
    const sessionId = this.start();

    try {
      const result = await fn();
      const session = this.stop();

      return { result, session };
    } catch (error) {
      // Stop profiling even on error
      if (this.isRunning) {
        this.stop();
      }
      throw error;
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Update statistics after session completion
   */
  private updateStats(session: ProfilerSession): void {
    this.stats = {
      sessionsCompleted: this.stats.sessionsCompleted + 1,
      totalProfilingTime: this.stats.totalProfilingTime + session.duration,
      cpuProfilesGenerated: this.stats.cpuProfilesGenerated + (session.cpuProfile !== null ? 1 : 0),
      memoryProfilesGenerated: this.stats.memoryProfilesGenerated + (session.memoryProfile !== null ? 1 : 0),
      networkProfilesGenerated: this.stats.networkProfilesGenerated + (session.networkProfile !== null ? 1 : 0),
      reportsGenerated: this.stats.reportsGenerated
    };
  }
}
