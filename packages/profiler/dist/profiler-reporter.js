/**
 * Profiler Reporter - Generate reports from profiling data
 */
export class ProfilerReporter {
    defaultOptions = {
        format: 'json',
        includeMetadata: true,
        includeCharts: false,
        maxEntries: 100
    };
    /**
     * Generate report from CPU profile
     */
    generateCPUReport(profile, options) {
        const opts = { ...this.defaultOptions, ...options };
        let content;
        switch (opts.format) {
            case 'json':
                content = this.generateCPUReportJSON(profile, opts);
                break;
            case 'html':
                content = this.generateCPUReportHTML(profile, opts);
                break;
            case 'markdown':
                content = this.generateCPUReportMarkdown(profile, opts);
                break;
            case 'text':
                content = this.generateCPUReportText(profile, opts);
                break;
        }
        return {
            title: 'CPU Profile Report',
            timestamp: Date.now(),
            format: opts.format,
            content,
            metadata: opts.includeMetadata ? profile.metadata : {}
        };
    }
    /**
     * Generate report from memory profile
     */
    generateMemoryReport(profile, options) {
        const opts = { ...this.defaultOptions, ...options };
        let content;
        switch (opts.format) {
            case 'json':
                content = this.generateMemoryReportJSON(profile, opts);
                break;
            case 'html':
                content = this.generateMemoryReportHTML(profile, opts);
                break;
            case 'markdown':
                content = this.generateMemoryReportMarkdown(profile, opts);
                break;
            case 'text':
                content = this.generateMemoryReportText(profile, opts);
                break;
        }
        return {
            title: 'Memory Profile Report',
            timestamp: Date.now(),
            format: opts.format,
            content,
            metadata: opts.includeMetadata ? profile.metadata : {}
        };
    }
    /**
     * Generate report from network profile
     */
    generateNetworkReport(profile, options) {
        const opts = { ...this.defaultOptions, ...options };
        let content;
        switch (opts.format) {
            case 'json':
                content = this.generateNetworkReportJSON(profile, opts);
                break;
            case 'html':
                content = this.generateNetworkReportHTML(profile, opts);
                break;
            case 'markdown':
                content = this.generateNetworkReportMarkdown(profile, opts);
                break;
            case 'text':
                content = this.generateNetworkReportText(profile, opts);
                break;
        }
        return {
            title: 'Network Profile Report',
            timestamp: Date.now(),
            format: opts.format,
            content,
            metadata: opts.includeMetadata ? profile.metadata : {}
        };
    }
    /**
     * Generate combined report from all profiles
     */
    generateCombinedReport(cpuProfile, memoryProfile, networkProfile, options) {
        const opts = { ...this.defaultOptions, ...options };
        const sections = [];
        if (cpuProfile !== null) {
            const cpuReport = this.generateCPUReport(cpuProfile, opts);
            sections.push(cpuReport.content);
        }
        if (memoryProfile !== null) {
            const memoryReport = this.generateMemoryReport(memoryProfile, opts);
            sections.push(memoryReport.content);
        }
        if (networkProfile !== null) {
            const networkReport = this.generateNetworkReport(networkProfile, opts);
            sections.push(networkReport.content);
        }
        const content = sections.join('\n\n---\n\n');
        return {
            title: 'Combined Profile Report',
            timestamp: Date.now(),
            format: opts.format,
            content,
            metadata: {}
        };
    }
    /**
     * Generate flame graph visualization data
     */
    generateFlameGraphData(flameGraph) {
        return JSON.stringify(flameGraph, null, 2);
    }
    // CPU Report Formats
    generateCPUReportJSON(profile, options) {
        return JSON.stringify(profile, null, 2);
    }
    generateCPUReportHTML(profile, options) {
        const topFunctions = profile.nodes
            .sort((a, b) => b.totalTime - a.totalTime)
            .slice(0, options.maxEntries);
        return `
<!DOCTYPE html>
<html>
<head>
  <title>CPU Profile Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1, h2 { color: #333; }
    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    .summary { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>CPU Profile Report</h1>
  <div class="summary">
    <p><strong>Duration:</strong> ${profile.duration.toFixed(2)} ms</p>
    <p><strong>Total Samples:</strong> ${profile.samples.length}</p>
    <p><strong>Unique Functions:</strong> ${profile.nodes.length}</p>
  </div>
  <h2>Top Functions by Time</h2>
  <table>
    <tr>
      <th>Function</th>
      <th>File</th>
      <th>Total Time (ms)</th>
      <th>Self Time (ms)</th>
      <th>Hit Count</th>
    </tr>
    ${topFunctions.map(node => `
    <tr>
      <td>${this.escapeHTML(node.functionName)}</td>
      <td>${this.escapeHTML(node.url)}:${node.lineNumber}</td>
      <td>${node.totalTime.toFixed(2)}</td>
      <td>${node.selfTime.toFixed(2)}</td>
      <td>${node.hitCount}</td>
    </tr>
    `).join('')}
  </table>
</body>
</html>
    `.trim();
    }
    generateCPUReportMarkdown(profile, options) {
        const topFunctions = profile.nodes
            .sort((a, b) => b.totalTime - a.totalTime)
            .slice(0, options.maxEntries);
        return `
# CPU Profile Report

## Summary

- **Duration:** ${profile.duration.toFixed(2)} ms
- **Total Samples:** ${profile.samples.length}
- **Unique Functions:** ${profile.nodes.length}

## Top Functions by Time

| Function | File | Total Time (ms) | Self Time (ms) | Hit Count |
|----------|------|-----------------|----------------|-----------|
${topFunctions.map(node => `| ${node.functionName} | ${node.url}:${node.lineNumber} | ${node.totalTime.toFixed(2)} | ${node.selfTime.toFixed(2)} | ${node.hitCount} |`).join('\n')}
    `.trim();
    }
    generateCPUReportText(profile, options) {
        const topFunctions = profile.nodes
            .sort((a, b) => b.totalTime - a.totalTime)
            .slice(0, options.maxEntries);
        return `
CPU PROFILE REPORT
==================

Duration: ${profile.duration.toFixed(2)} ms
Total Samples: ${profile.samples.length}
Unique Functions: ${profile.nodes.length}

TOP FUNCTIONS BY TIME
---------------------
${topFunctions.map(node => `${node.functionName} (${node.url}:${node.lineNumber})\n  Total: ${node.totalTime.toFixed(2)} ms, Self: ${node.selfTime.toFixed(2)} ms, Hits: ${node.hitCount}`).join('\n\n')}
    `.trim();
    }
    // Memory Report Formats
    generateMemoryReportJSON(profile, options) {
        return JSON.stringify(profile, null, 2);
    }
    generateMemoryReportHTML(profile, options) {
        return `
<!DOCTYPE html>
<html>
<head>
  <title>Memory Profile Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1, h2 { color: #333; }
    .summary { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    .metric { margin: 10px 0; }
    .warning { color: #d32f2f; font-weight: bold; }
  </style>
</head>
<body>
  <h1>Memory Profile Report</h1>
  <div class="summary">
    <div class="metric"><strong>Duration:</strong> ${profile.duration.toFixed(2)} ms</div>
    <div class="metric"><strong>Peak Memory:</strong> ${this.formatBytes(profile.peakMemory)}</div>
    <div class="metric"><strong>Average Memory:</strong> ${this.formatBytes(profile.averageMemory)}</div>
    <div class="metric"><strong>Growth Rate:</strong> ${this.formatBytes(profile.growthRate)}/s</div>
    <div class="metric ${profile.memoryLeaks.length > 0 ? 'warning' : ''}">
      <strong>Memory Leaks:</strong> ${profile.memoryLeaks.length} detected
    </div>
  </div>
</body>
</html>
    `.trim();
    }
    generateMemoryReportMarkdown(profile, options) {
        return `
# Memory Profile Report

## Summary

- **Duration:** ${profile.duration.toFixed(2)} ms
- **Peak Memory:** ${this.formatBytes(profile.peakMemory)}
- **Average Memory:** ${this.formatBytes(profile.averageMemory)}
- **Growth Rate:** ${this.formatBytes(profile.growthRate)}/s
- **Memory Leaks:** ${profile.memoryLeaks.length} detected
    `.trim();
    }
    generateMemoryReportText(profile, options) {
        return `
MEMORY PROFILE REPORT
=====================

Duration: ${profile.duration.toFixed(2)} ms
Peak Memory: ${this.formatBytes(profile.peakMemory)}
Average Memory: ${this.formatBytes(profile.averageMemory)}
Growth Rate: ${this.formatBytes(profile.growthRate)}/s
Memory Leaks: ${profile.memoryLeaks.length} detected
    `.trim();
    }
    // Network Report Formats
    generateNetworkReportJSON(profile, options) {
        return JSON.stringify(profile, null, 2);
    }
    generateNetworkReportHTML(profile, options) {
        return `
<!DOCTYPE html>
<html>
<head>
  <title>Network Profile Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1, h2 { color: #333; }
    .summary { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    .metric { margin: 10px 0; }
  </style>
</head>
<body>
  <h1>Network Profile Report</h1>
  <div class="summary">
    <div class="metric"><strong>Total Requests:</strong> ${profile.totalRequests}</div>
    <div class="metric"><strong>Failed Requests:</strong> ${profile.failedRequests}</div>
    <div class="metric"><strong>Total Bytes:</strong> ${this.formatBytes(profile.totalBytesTransferred)}</div>
    <div class="metric"><strong>Average Time:</strong> ${profile.averageRequestTime.toFixed(2)} ms</div>
  </div>
</body>
</html>
    `.trim();
    }
    generateNetworkReportMarkdown(profile, options) {
        return `
# Network Profile Report

## Summary

- **Total Requests:** ${profile.totalRequests}
- **Failed Requests:** ${profile.failedRequests}
- **Total Bytes:** ${this.formatBytes(profile.totalBytesTransferred)}
- **Average Time:** ${profile.averageRequestTime.toFixed(2)} ms
    `.trim();
    }
    generateNetworkReportText(profile, options) {
        return `
NETWORK PROFILE REPORT
======================

Total Requests: ${profile.totalRequests}
Failed Requests: ${profile.failedRequests}
Total Bytes: ${this.formatBytes(profile.totalBytesTransferred)}
Average Time: ${profile.averageRequestTime.toFixed(2)} ms
    `.trim();
    }
    // Utility Methods
    formatBytes(bytes) {
        if (bytes === 0) {
            return '0 B';
        }
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i] || 'B'}`;
    }
    escapeHTML(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m] || m);
    }
}
//# sourceMappingURL=profiler-reporter.js.map