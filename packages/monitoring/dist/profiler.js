/**
 * Profiler
 *
 * Advanced profiling for CPU, memory, and network operations
 */
export class Profiler {
    options;
    profiles;
    activeProfiles;
    isRunning = false;
    constructor(options = { enabled: true }) {
        this.options = {
            sampleInterval: 100,
            ...options
        };
        this.profiles = new Map();
        this.activeProfiles = new Map();
    }
    start() {
        if (!this.options.enabled || this.isRunning) {
            return;
        }
        this.isRunning = true;
        console.log('📊 Profiler started');
    }
    stop() {
        if (!this.isRunning) {
            return;
        }
        this.isRunning = false;
        console.log('📊 Profiler stopped');
    }
    startProfile(name) {
        if (!this.isRunning) {
            return;
        }
        this.activeProfiles.set(name, performance.now());
    }
    endProfile(name) {
        if (!this.isRunning) {
            return undefined;
        }
        const startTime = this.activeProfiles.get(name);
        if (startTime === undefined) {
            return undefined;
        }
        const endTime = performance.now();
        const duration = endTime - startTime;
        const result = {
            name,
            duration,
            startTime,
            endTime
        };
        this.profiles.set(name, result);
        this.activeProfiles.delete(name);
        return result;
    }
    profile(name, fn) {
        this.startProfile(name);
        try {
            return fn();
        }
        finally {
            this.endProfile(name);
        }
    }
    async profileAsync(name, fn) {
        this.startProfile(name);
        try {
            return await fn();
        }
        finally {
            this.endProfile(name);
        }
    }
    getResult(name) {
        return this.profiles.get(name);
    }
    getResults() {
        return Array.from(this.profiles.values());
    }
    clearResults() {
        this.profiles.clear();
    }
}
//# sourceMappingURL=profiler.js.map