/**
 * CPU Profiler - Provides CPU profiling with flame graph generation
 */

import { performance } from 'node:perf_hooks';

export interface CPUProfileNode {
  readonly id: number;
  readonly functionName: string;
  readonly scriptId: string;
  readonly url: string;
  readonly lineNumber: number;
  readonly columnNumber: number;
  readonly hitCount: number;
  readonly children: number[];
  readonly selfTime: number;
  readonly totalTime: number;
}

export interface CPUProfile {
  readonly startTime: number;
  readonly endTime: number;
  readonly duration: number;
  readonly nodes: CPUProfileNode[];
  readonly samples: number[];
  readonly timeDeltas: number[];
  readonly metadata: Record<string, unknown>;
}

export interface FlameGraphData {
  readonly name: string;
  readonly value: number;
  readonly children: FlameGraphData[];
  readonly selfTime: number;
  readonly totalTime: number;
  readonly percentage: number;
}

interface StackFrame {
  readonly functionName: string;
  readonly fileName: string;
  readonly lineNumber: number;
  readonly columnNumber: number;
  readonly timestamp: number;
}

export class CPUProfiler {
  private isRunning: boolean = false;
  private startTime: number = 0;
  private endTime: number = 0;
  private samples: StackFrame[][] = [];
  private sampleInterval: number = 1; // milliseconds
  private intervalId: NodeJS.Timeout | null = null;
  private nodeIdCounter: number = 0;

  public constructor(sampleInterval: number = 1) {
    this.sampleInterval = sampleInterval;
  }

  /**
   * Start CPU profiling
   */
  public start(): void {
    if (this.isRunning) {
      throw new Error('CPU profiler is already running');
    }

    this.isRunning = true;
    this.startTime = performance.now();
    this.samples = [];
    this.nodeIdCounter = 0;

    // Start sampling
    this.intervalId = setInterval(() => {
      this.captureSample();
    }, this.sampleInterval);
  }

  /**
   * Stop CPU profiling and return profile
   */
  public stop(): CPUProfile {
    if (!this.isRunning) {
      throw new Error('CPU profiler is not running');
    }

    this.isRunning = false;
    this.endTime = performance.now();

    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    return this.buildProfile();
  }

  /**
   * Generate flame graph data from profile
   */
  public generateFlameGraph(profile: CPUProfile): FlameGraphData {
    const rootNode = this.buildFlameGraphNode(profile);
    return rootNode;
  }

  /**
   * Capture a single sample of the call stack
   */
  private captureSample(): void {
    const stack = this.captureCallStack();
    this.samples.push(stack);
  }

  /**
   * Capture current call stack
   */
  private captureCallStack(): StackFrame[] {
    const error = new Error();
    const stack: StackFrame[] = [];

    if (error.stack !== undefined) {
      const lines = error.stack.split('\n').slice(2); // Skip Error and captureCallStack frames

      for (const line of lines) {
        const match = line.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)|at\s+(.+?):(\d+):(\d+)/);

        if (match !== null) {
          const functionName = match[1] || match[5] || 'anonymous';
          const fileName = match[2] || match[5] || 'unknown';
          const lineNumber = parseInt(match[3] || match[6] || '0', 10);
          const columnNumber = parseInt(match[4] || match[7] || '0', 10);

          stack.push({
            functionName,
            fileName,
            lineNumber,
            columnNumber,
            timestamp: performance.now()
          });
        }
      }
    }

    return stack;
  }

  /**
   * Build complete CPU profile from samples
   */
  private buildProfile(): CPUProfile {
    const nodes: CPUProfileNode[] = [];
    const nodeMap = new Map<string, number>();
    const samples: number[] = [];
    const timeDeltas: number[] = [];

    let previousTime = this.startTime;

    // Process each sample
    for (const stack of this.samples) {
      if (stack.length === 0) {
        continue;
      }

      const leafFrame = stack[0];
      if (leafFrame !== undefined) {
        const key = this.getFrameKey(leafFrame);

        let nodeId = nodeMap.get(key);
        if (nodeId === undefined) {
          nodeId = this.nodeIdCounter++;
          nodeMap.set(key, nodeId);

          nodes.push({
            id: nodeId,
            functionName: leafFrame.functionName,
            scriptId: '0',
            url: leafFrame.fileName,
            lineNumber: leafFrame.lineNumber,
            columnNumber: leafFrame.columnNumber,
            hitCount: 1,
            children: [],
            selfTime: this.sampleInterval,
            totalTime: this.sampleInterval
          });
        } else {
          const node = nodes[nodeId];
          if (node !== undefined) {
            nodes[nodeId] = {
              ...node,
              hitCount: node.hitCount + 1,
              selfTime: node.selfTime + this.sampleInterval,
              totalTime: node.totalTime + this.sampleInterval
            };
          }
        }

        samples.push(nodeId);
        const timeDelta = leafFrame.timestamp - previousTime;
        timeDeltas.push(timeDelta);
        previousTime = leafFrame.timestamp;
      }
    }

    return {
      startTime: this.startTime,
      endTime: this.endTime,
      duration: this.endTime - this.startTime,
      nodes,
      samples,
      timeDeltas,
      metadata: {
        sampleInterval: this.sampleInterval,
        totalSamples: this.samples.length
      }
    };
  }

  /**
   * Build flame graph from profile
   */
  private buildFlameGraphNode(profile: CPUProfile): FlameGraphData {
    const totalTime = profile.duration;
    const rootChildren: FlameGraphData[] = [];

    for (const node of profile.nodes) {
      if (node.hitCount > 0) {
        rootChildren.push({
          name: `${node.functionName} (${node.url}:${node.lineNumber})`,
          value: node.hitCount,
          children: [],
          selfTime: node.selfTime,
          totalTime: node.totalTime,
          percentage: (node.totalTime / totalTime) * 100
        });
      }
    }

    // Sort by total time descending
    rootChildren.sort((a, b) => b.totalTime - a.totalTime);

    return {
      name: 'root',
      value: profile.samples.length,
      children: rootChildren,
      selfTime: 0,
      totalTime: totalTime,
      percentage: 100
    };
  }

  /**
   * Generate unique key for stack frame
   */
  private getFrameKey(frame: StackFrame): string {
    return `${frame.functionName}:${frame.fileName}:${frame.lineNumber}:${frame.columnNumber}`;
  }

  /**
   * Check if profiler is currently running
   */
  public isProfilerRunning(): boolean {
    return this.isRunning;
  }
}
