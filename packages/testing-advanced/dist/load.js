/**
 * Load Testing
 * Performance and stress testing
 */
export class LoadTester {
    config;
    constructor(config) {
        this.config = config;
    }
    async test(target) {
        console.log(`🔥 Running load test with ${this.config.concurrency} concurrent users...`);
        const startTime = Date.now();
        const responseTimes = [];
        let successful = 0;
        let failed = 0;
        while (Date.now() - startTime < this.config.duration) {
            const promises = [];
            for (let i = 0; i < this.config.concurrency; i++) {
                const reqStart = Date.now();
                promises.push(target()
                    .then(() => {
                    successful++;
                    responseTimes.push(Date.now() - reqStart);
                })
                    .catch(() => {
                    failed++;
                }));
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
//# sourceMappingURL=load.js.map