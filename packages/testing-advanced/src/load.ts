/**
 * Load Testing
 * Performance and stress testing
 */

export interface LoadConfig {
  readonly concurrency: number;
  readonly duration: number; // in milliseconds
  readonly rampUp?: number; // in milliseconds
}

export interface LoadTestResult {
  readonly totalRequests: number;
  readonly successfulRequests: number;
  readonly failedRequests: number;
  readonly averageResponseTime: number;
  readonly minResponseTime: number;
  readonly maxResponseTime: number;
  readonly requestsPerSecond: number;
  readonly percentiles: {
    readonly p50: number;
    readonly p95: number;
    readonly p99: number;
  };
}

export class LoadTester {
  private readonly config: LoadConfig;

  public constructor(config: LoadConfig) {
    this.config = config;
  }

  public async test(target: () => Promise<void>): Promise<LoadTestResult> {
    console.log(`🔥 Running load test with ${this.config.concurrency} concurrent users...`);

    const startTime = Date.now();
    const responseTimes: number[] = [];
    let successful = 0;
    let failed = 0;

    while (Date.now() - startTime < this.config.duration) {
      const promises: Array<Promise<void>> = [];

      for (let i = 0; i < this.config.concurrency; i++) {
        const reqStart = Date.now();

        promises.push(
          target()
            .then(() => {
              successful++;
              responseTimes.push(Date.now() - reqStart);
            })
            .catch(() => {
              failed++;
            })
        );
      }

      await Promise.all(promises);
    }

    const totalTime = Date.now() - startTime;
    const totalRequests = successful + failed;

    responseTimes.sort((a, b) => a - b);

    return {
      totalRequests,
      successfulRequests: successful,
      failedRequests: failed,
      averageResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
      minResponseTime: responseTimes[0] || 0,
      maxResponseTime: responseTimes[responseTimes.length - 1] || 0,
      requestsPerSecond: (totalRequests / totalTime) * 1000,
      percentiles: {
        p50: responseTimes[Math.floor(responseTimes.length * 0.5)] || 0,
        p95: responseTimes[Math.floor(responseTimes.length * 0.95)] || 0,
        p99: responseTimes[Math.floor(responseTimes.length * 0.99)] || 0
      }
    };
  }
}
