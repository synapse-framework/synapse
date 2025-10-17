/**
 * Network Profiler - Provides network profiling and analysis
 */
export class NetworkProfiler {
    isRunning = false;
    startTime = 0;
    endTime = 0;
    requests = [];
    pendingRequests = new Map();
    /**
     * Start network profiling
     */
    start() {
        if (this.isRunning) {
            throw new Error('Network profiler is already running');
        }
        this.isRunning = true;
        this.startTime = Date.now();
        this.requests = [];
        this.pendingRequests.clear();
    }
    /**
     * Stop network profiling and return profile
     */
    stop() {
        if (!this.isRunning) {
            throw new Error('Network profiler is not running');
        }
        this.isRunning = false;
        this.endTime = Date.now();
        return this.buildProfile();
    }
    /**
     * Record a network request
     */
    recordRequest(request) {
        if (!this.isRunning) {
            return;
        }
        this.requests.push(request);
    }
    /**
     * Start tracking a request
     */
    startRequest(id, method, url) {
        if (!this.isRunning) {
            return;
        }
        this.pendingRequests.set(id, {
            id,
            method,
            url,
            timestamp: Date.now()
        });
    }
    /**
     * Complete tracking a request
     */
    completeRequest(id, status, requestHeaders, responseHeaders, requestSize, responseSize, timings, error) {
        if (!this.isRunning) {
            return;
        }
        const pendingRequest = this.pendingRequests.get(id);
        if (pendingRequest === undefined) {
            return;
        }
        const request = {
            id,
            method: pendingRequest.method || 'GET',
            url: pendingRequest.url || '',
            status,
            requestHeaders,
            responseHeaders,
            requestSize,
            responseSize,
            timings,
            timestamp: pendingRequest.timestamp || Date.now(),
            error
        };
        this.requests.push(request);
        this.pendingRequests.delete(id);
    }
    /**
     * Analyze network performance
     */
    analyzePerformance() {
        const byDomain = new Map();
        const byMethod = new Map();
        const byStatus = new Map();
        const slowRequests = [];
        const slowThreshold = 1000; // 1 second
        for (const request of this.requests) {
            // By domain
            const domain = this.extractDomain(request.url);
            const domainStats = byDomain.get(domain) || { count: 0, totalTime: 0 };
            byDomain.set(domain, {
                count: domainStats.count + 1,
                totalTime: domainStats.totalTime + request.timings.total
            });
            // By method
            const methodStats = byMethod.get(request.method) || { count: 0, totalTime: 0 };
            byMethod.set(request.method, {
                count: methodStats.count + 1,
                totalTime: methodStats.totalTime + request.timings.total
            });
            // By status
            const statusCount = byStatus.get(request.status) || 0;
            byStatus.set(request.status, statusCount + 1);
            // Slow requests
            if (request.timings.total > slowThreshold) {
                slowRequests.push(request);
            }
        }
        // Sort slow requests by time
        slowRequests.sort((a, b) => b.timings.total - a.timings.total);
        return {
            byDomain,
            byMethod,
            byStatus,
            slowRequests
        };
    }
    /**
     * Calculate bandwidth usage
     */
    calculateBandwidth() {
        let uploadBytes = 0;
        let downloadBytes = 0;
        for (const request of this.requests) {
            uploadBytes += request.requestSize;
            downloadBytes += request.responseSize;
        }
        const totalBytes = uploadBytes + downloadBytes;
        const duration = (this.endTime || Date.now()) - this.startTime;
        const averageSpeed = duration > 0 ? (totalBytes / duration) * 1000 : 0; // bytes per second
        return {
            totalBytes,
            uploadBytes,
            downloadBytes,
            averageSpeed
        };
    }
    /**
     * Build complete network profile
     */
    buildProfile() {
        const totalRequests = this.requests.length;
        const failedRequests = this.requests.filter(r => r.status >= 400 || r.error !== undefined).length;
        const totalBytesTransferred = this.requests.reduce((sum, r) => sum + r.requestSize + r.responseSize, 0);
        const requestTimes = this.requests.map(r => r.timings.total);
        const averageRequestTime = totalRequests > 0
            ? requestTimes.reduce((sum, time) => sum + time, 0) / totalRequests
            : 0;
        const sortedByTime = [...this.requests].sort((a, b) => b.timings.total - a.timings.total);
        const slowestRequest = sortedByTime[0] || null;
        const fastestRequest = sortedByTime[sortedByTime.length - 1] || null;
        const bandwidth = this.calculateBandwidth();
        const analysis = this.analyzePerformance();
        return {
            startTime: this.startTime,
            endTime: this.endTime,
            duration: this.endTime - this.startTime,
            requests: this.requests,
            totalRequests,
            failedRequests,
            totalBytesTransferred,
            averageRequestTime,
            slowestRequest,
            fastestRequest,
            metadata: {
                bandwidth,
                analysis: {
                    domainCount: analysis.byDomain.size,
                    slowRequestCount: analysis.slowRequests.length
                }
            }
        };
    }
    /**
     * Extract domain from URL
     */
    extractDomain(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        }
        catch {
            return 'unknown';
        }
    }
    /**
     * Check if profiler is currently running
     */
    isProfilerRunning() {
        return this.isRunning;
    }
    /**
     * Get current request count
     */
    getRequestCount() {
        return this.requests.length;
    }
    /**
     * Clear all recorded requests
     */
    clearRequests() {
        this.requests = [];
        this.pendingRequests.clear();
    }
}
//# sourceMappingURL=network-profiler.js.map