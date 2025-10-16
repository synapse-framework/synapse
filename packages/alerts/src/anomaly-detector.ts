/**
 * Anomaly Detector - Detect anomalies in metric data
 */

export type AnomalyType = 'spike' | 'drop' | 'trend_change' | 'outlier';

export interface AnomalyConfig {
  readonly sensitivity: number; // 0-1, higher = more sensitive
  readonly minDataPoints: number;
  readonly stdDevThreshold: number;
  readonly enableSpike: boolean;
  readonly enableDrop: boolean;
  readonly enableTrendChange: boolean;
  readonly enableOutlier: boolean;
}

export interface Anomaly {
  readonly type: AnomalyType;
  readonly timestamp: number;
  readonly value: number;
  readonly expectedValue: number;
  readonly deviation: number;
  readonly confidence: number;
  readonly description: string;
}

export class AnomalyDetector {
  private readonly config: AnomalyConfig;
  private dataHistory = new Map<string, number[]>();

  public constructor(config?: Partial<AnomalyConfig>) {
    this.config = {
      sensitivity: 0.7,
      minDataPoints: 20,
      stdDevThreshold: 3,
      enableSpike: true,
      enableDrop: true,
      enableTrendChange: true,
      enableOutlier: true,
      ...config
    };
  }

  public detect(metric: string, value: number, timestamp: number): Anomaly[] {
    const anomalies: Anomaly[] = [];
    const history = this.dataHistory.get(metric) || [];

    // Add value to history
    history.push(value);
    if (history.length > 1000) {
      history.shift();
    }
    this.dataHistory.set(metric, history);

    // Need enough data points to detect anomalies
    if (history.length < this.config.minDataPoints) {
      return anomalies;
    }

    const stats = this.calculateStats(history);

    // Detect spike
    if (this.config.enableSpike) {
      const spike = this.detectSpike(value, stats, timestamp);
      if (spike !== null) {
        anomalies.push(spike);
      }
    }

    // Detect drop
    if (this.config.enableDrop) {
      const drop = this.detectDrop(value, stats, timestamp);
      if (drop !== null) {
        anomalies.push(drop);
      }
    }

    // Detect outlier
    if (this.config.enableOutlier) {
      const outlier = this.detectOutlier(value, stats, timestamp);
      if (outlier !== null) {
        anomalies.push(outlier);
      }
    }

    // Detect trend change (requires more history)
    if (this.config.enableTrendChange && history.length >= 50) {
      const trendChange = this.detectTrendChange(history, timestamp);
      if (trendChange !== null) {
        anomalies.push(trendChange);
      }
    }

    return anomalies;
  }

  private detectSpike(value: number, stats: Stats, timestamp: number): Anomaly | null {
    const threshold = stats.mean + (this.config.stdDevThreshold * stats.stdDev);

    if (value > threshold) {
      const deviation = (value - stats.mean) / stats.stdDev;
      const confidence = Math.min(deviation / this.config.stdDevThreshold, 1);

      if (confidence >= this.config.sensitivity) {
        return {
          type: 'spike',
          timestamp,
          value,
          expectedValue: stats.mean,
          deviation,
          confidence,
          description: `Value ${value.toFixed(2)} is ${deviation.toFixed(2)} standard deviations above mean`
        };
      }
    }

    return null;
  }

  private detectDrop(value: number, stats: Stats, timestamp: number): Anomaly | null {
    const threshold = stats.mean - (this.config.stdDevThreshold * stats.stdDev);

    if (value < threshold) {
      const deviation = (stats.mean - value) / stats.stdDev;
      const confidence = Math.min(deviation / this.config.stdDevThreshold, 1);

      if (confidence >= this.config.sensitivity) {
        return {
          type: 'drop',
          timestamp,
          value,
          expectedValue: stats.mean,
          deviation,
          confidence,
          description: `Value ${value.toFixed(2)} is ${deviation.toFixed(2)} standard deviations below mean`
        };
      }
    }

    return null;
  }

  private detectOutlier(value: number, stats: Stats, timestamp: number): Anomaly | null {
    const zScore = Math.abs((value - stats.mean) / stats.stdDev);

    if (zScore > this.config.stdDevThreshold * 1.5) {
      const confidence = Math.min(zScore / (this.config.stdDevThreshold * 2), 1);

      if (confidence >= this.config.sensitivity) {
        return {
          type: 'outlier',
          timestamp,
          value,
          expectedValue: stats.mean,
          deviation: zScore,
          confidence,
          description: `Value ${value.toFixed(2)} is an outlier with z-score ${zScore.toFixed(2)}`
        };
      }
    }

    return null;
  }

  private detectTrendChange(history: number[], timestamp: number): Anomaly | null {
    // Split history into two halves
    const midPoint = Math.floor(history.length / 2);
    const firstHalf = history.slice(0, midPoint);
    const secondHalf = history.slice(midPoint);

    const firstSlope = this.calculateSlope(firstHalf);
    const secondSlope = this.calculateSlope(secondHalf);

    // Check if trend direction changed significantly
    const slopeChange = Math.abs(secondSlope - firstSlope);
    const threshold = 0.5; // Adjust based on sensitivity

    if (slopeChange > threshold && Math.sign(firstSlope) !== Math.sign(secondSlope)) {
      const latestValue = history[history.length - 1] || 0;
      const stats = this.calculateStats(history);

      return {
        type: 'trend_change',
        timestamp,
        value: latestValue,
        expectedValue: stats.mean,
        deviation: slopeChange,
        confidence: this.config.sensitivity,
        description: `Trend changed from ${firstSlope.toFixed(3)} to ${secondSlope.toFixed(3)}`
      };
    }

    return null;
  }

  private calculateStats(values: number[]): Stats {
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return { mean, variance, stdDev };
  }

  private calculateSlope(values: number[]): number {
    const n = values.length;
    if (n < 2) {
      return 0;
    }

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (let i = 0; i < n; i++) {
      const x = i;
      const y = values[i] || 0;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }

  public reset(): void {
    this.dataHistory.clear();
  }

  public resetMetric(metric: string): void {
    this.dataHistory.delete(metric);
  }

  public getConfig(): Readonly<AnomalyConfig> {
    return { ...this.config };
  }
}

interface Stats {
  readonly mean: number;
  readonly variance: number;
  readonly stdDev: number;
}
