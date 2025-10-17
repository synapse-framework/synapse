/**
 * CPU Profiler - Provides CPU profiling with flame graph generation
 */
import { performance } from 'node:perf_hooks';
export class CPUProfiler {
    isRunning = false;
    startTime = 0;
    endTime = 0;
    samples = [];
    sampleInterval = 1; // milliseconds
    intervalId = null;
    nodeIdCounter = 0;
    constructor(sampleInterval = 1) {
        this.sampleInterval = sampleInterval;
    }
    /**
     * Start CPU profiling
     */
    start() {
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
    stop() {
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
    generateFlameGraph(profile) {
        const rootNode = this.buildFlameGraphNode(profile);
        return rootNode;
    }
    /**
     * Capture a single sample of the call stack
     */
    captureSample() {
        const stack = this.captureCallStack();
        this.samples.push(stack);
    }
    /**
     * Capture current call stack
     */
    captureCallStack() {
        const error = new Error();
        const stack = [];
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
    buildProfile() {
        const nodes = [];
        const nodeMap = new Map();
        const samples = [];
        const timeDeltas = [];
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
                }
                else {
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
    buildFlameGraphNode(profile) {
        const totalTime = profile.duration;
        const rootChildren = [];
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
    getFrameKey(frame) {
        return `${frame.functionName}:${frame.fileName}:${frame.lineNumber}:${frame.columnNumber}`;
    }
    /**
     * Check if profiler is currently running
     */
    isProfilerRunning() {
        return this.isRunning;
    }
}
//# sourceMappingURL=cpu-profiler.js.map