/**
 * Profiler
 *
 * Advanced profiling for CPU, memory, and network operations
 */

export interface ProfilerOptions {
  readonly enabled: boolean;
  readonly sampleInterval?: number;
}

export interface ProfileResult {
  readonly name: string;
  readonly duration: number;
  readonly startTime: number;
  readonly endTime: number;
  readonly cpuUsage?: number;
  readonly memoryUsage?: number;
}

export class Profiler {
  private readonly options: ProfilerOptions;
  private readonly profiles: Map<string, ProfileResult>;
  private readonly activeProfiles: Map<string, number>;
  private isRunning: boolean = false;

  public constructor(options: ProfilerOptions = { enabled: true }) {
    this.options = {
      sampleInterval: 100,
      ...options
    };
    this.profiles = new Map();
    this.activeProfiles = new Map();
  }

  public start(): void {
    if (!this.options.enabled || this.isRunning) {
      return;
    }
    this.isRunning = true;
    console.log('📊 Profiler started');
  }

  public stop(): void {
    if (!this.isRunning) {
      return;
    }
    this.isRunning = false;
    console.log('📊 Profiler stopped');
  }

  public startProfile(name: string): void {
    if (!this.isRunning) {
      return;
    }
    this.activeProfiles.set(name, performance.now());
  }

  public endProfile(name: string): ProfileResult | undefined {
    if (!this.isRunning) {
      return undefined;
    }

    const startTime = this.activeProfiles.get(name);
    if (startTime === undefined) {
      return undefined;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    const result: ProfileResult = {
      name,
      duration,
      startTime,
      endTime
    };

    this.profiles.set(name, result);
    this.activeProfiles.delete(name);

    return result;
  }

  public profile<T>(name: string, fn: () => T): T {
    this.startProfile(name);
    try {
      return fn();
    } finally {
      this.endProfile(name);
    }
  }

  public async profileAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.startProfile(name);
    try {
      return await fn();
    } finally {
      this.endProfile(name);
    }
  }

  public getResult(name: string): ProfileResult | undefined {
    return this.profiles.get(name);
  }

  public getResults(): ProfileResult[] {
    return Array.from(this.profiles.values());
  }

  public clearResults(): void {
    this.profiles.clear();
  }
}
