# @snps/profiler

Advanced profiling for Synapse Framework with CPU, memory, and network profiling capabilities.

## Features

- **CPU Profiling**: Profile CPU usage with flame graph generation
- **Memory Profiling**: Track memory usage with heap snapshots and leak detection
- **Network Profiling**: Monitor network requests and analyze performance
- **Report Generation**: Generate reports in multiple formats (JSON, HTML, Markdown, Text)
- **Zero Dependencies**: Built from scratch with no external dependencies

## Installation

```bash
npm install @snps/profiler
```

## Usage

### Basic Profiling

```typescript
import { Profiler } from '@snps/profiler';

const profiler = new Profiler({
  enableCPU: true,
  enableMemory: true,
  enableNetwork: true
});

// Start profiling
const sessionId = profiler.start();

// Your code here
await someFunction();

// Stop profiling
const session = profiler.stop();

console.log('CPU Profile:', session.cpuProfile);
console.log('Memory Profile:', session.memoryProfile);
console.log('Network Profile:', session.networkProfile);
```

### Profile a Function

```typescript
import { Profiler } from '@snps/profiler';

const profiler = new Profiler();

const { result, session } = await profiler.profile(async () => {
  // Your code here
  return await someAsyncOperation();
});

console.log('Result:', result);
console.log('Profiling data:', session);
```

### CPU Profiling

```typescript
import { CPUProfiler } from '@snps/profiler';

const cpuProfiler = new CPUProfiler(1); // 1ms sample interval

cpuProfiler.start();
// Your code here
const profile = cpuProfiler.stop();

// Generate flame graph
const flameGraph = cpuProfiler.generateFlameGraph(profile);
console.log('Flame Graph:', flameGraph);
```

### Memory Profiling

```typescript
import { MemoryProfiler } from '@snps/profiler';

const memoryProfiler = new MemoryProfiler(100); // 100ms snapshot interval

memoryProfiler.start();

// Track allocations
memoryProfiler.trackAllocation('object-1', 1024, 'Object');

// Your code here

// Detect leaks
const leaks = memoryProfiler.detectLeaks();
console.log('Memory Leaks:', leaks);

const profile = memoryProfiler.stop();
console.log('Peak Memory:', profile.peakMemory);
console.log('Growth Rate:', profile.growthRate);
```

### Network Profiling

```typescript
import { NetworkProfiler } from '@snps/profiler';

const networkProfiler = new NetworkProfiler();

networkProfiler.start();

// Record requests
networkProfiler.startRequest('req-1', 'GET', 'https://api.example.com/data');

// After request completes
networkProfiler.completeRequest(
  'req-1',
  200,
  { 'Content-Type': 'application/json' },
  { 'Content-Type': 'application/json' },
  512,
  2048,
  {
    dnsLookup: 10,
    tcpConnection: 20,
    tlsHandshake: 30,
    firstByte: 50,
    contentDownload: 100,
    total: 210
  }
);

const profile = networkProfiler.stop();
console.log('Total Requests:', profile.totalRequests);
console.log('Average Time:', profile.averageRequestTime);
```

### Generate Reports

```typescript
import { Profiler, ProfilerReporter } from '@snps/profiler';

const profiler = new Profiler();
const reporter = new ProfilerReporter();

profiler.start();
// Your code here
const session = profiler.stop();

// Generate HTML report
const htmlReport = reporter.generateCombinedReport(
  session.cpuProfile,
  session.memoryProfile,
  session.networkProfile,
  { format: 'html' }
);

console.log(htmlReport.content);
```

## API Reference

### Profiler

Main profiler class with unified interface.

#### Methods

- `start(): string` - Start profiling session
- `stop(): ProfilerSession` - Stop profiling and return results
- `profile<T>(fn: () => T | Promise<T>): Promise<{ result: T; session: ProfilerSession }>` - Profile a function
- `generateReport(session: ProfilerSession): ProfileReport` - Generate report
- `generateFlameGraph(cpuProfile: CPUProfile): FlameGraphData` - Generate flame graph
- `takeMemorySnapshot(): HeapSnapshot` - Take memory snapshot
- `recordNetworkRequest(request: NetworkRequest): void` - Record network request
- `getSessions(): ProfilerSession[]` - Get all sessions
- `getStats(): ProfilerStats` - Get profiler statistics

### CPUProfiler

CPU profiling with flame graph generation.

#### Methods

- `start(): void` - Start CPU profiling
- `stop(): CPUProfile` - Stop and return profile
- `generateFlameGraph(profile: CPUProfile): FlameGraphData` - Generate flame graph

### MemoryProfiler

Memory profiling with heap snapshots and leak detection.

#### Methods

- `start(): void` - Start memory profiling
- `stop(): MemoryProfile` - Stop and return profile
- `takeSnapshot(): HeapSnapshot` - Take heap snapshot
- `trackAllocation(id: string, size: number, type: string): void` - Track allocation
- `untrackAllocation(id: string): void` - Untrack allocation
- `detectLeaks(): MemoryAllocation[]` - Detect memory leaks
- `calculateGrowthRate(): number` - Calculate memory growth rate

### NetworkProfiler

Network profiling and analysis.

#### Methods

- `start(): void` - Start network profiling
- `stop(): NetworkProfile` - Stop and return profile
- `recordRequest(request: NetworkRequest): void` - Record request
- `startRequest(id: string, method: string, url: string): void` - Start tracking request
- `completeRequest(...): void` - Complete tracking request
- `analyzePerformance(): object` - Analyze network performance
- `calculateBandwidth(): object` - Calculate bandwidth usage

### ProfilerReporter

Generate reports from profiling data.

#### Methods

- `generateCPUReport(profile: CPUProfile, options?: ReportOptions): ProfileReport`
- `generateMemoryReport(profile: MemoryProfile, options?: ReportOptions): ProfileReport`
- `generateNetworkReport(profile: NetworkProfile, options?: ReportOptions): ProfileReport`
- `generateCombinedReport(...): ProfileReport`
- `generateFlameGraphData(flameGraph: FlameGraphData): string`

## Configuration

```typescript
interface ProfilerConfig {
  enableCPU: boolean;           // Enable CPU profiling
  enableMemory: boolean;        // Enable memory profiling
  enableNetwork: boolean;       // Enable network profiling
  cpuSampleInterval: number;    // CPU sample interval in ms
  memorySampleInterval: number; // Memory snapshot interval in ms
  autoReport: boolean;          // Auto-generate reports
  reportFormat: ReportFormat;   // Report format ('json', 'html', 'markdown', 'text')
}
```

## Report Formats

- **JSON**: Structured data format
- **HTML**: Interactive HTML report with tables and charts
- **Markdown**: Markdown format for documentation
- **Text**: Plain text format

## License

MIT
