/**
 * Intelligent Caching System for Synapse CLI
 * Advanced caching with multiple strategies, invalidation, and performance optimization
 */

import { promises as fs } from 'fs';
import { join, resolve, dirname, extname, basename } from 'path';
import { createHash } from 'crypto';

export class IntelligentCache {
  constructor(options = {}) {
    this.root = options.root || process.cwd();
    this.verbose = options.verbose || false;
    this.cacheDir = options.cacheDir || join(this.root, '.synapse', 'cache');
    this.maxSize = options.maxSize || 100 * 1024 * 1024; // 100MB
    this.ttl = options.ttl || 3600000; // 1 hour
    this.compression = options.compression || true;
    
    this.cache = new Map();
    this.metadata = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      evictions: 0,
      size: 0
    };
    
    this.strategies = new Map();
    this.policies = new Map();
    
    this.initializeStrategies();
    this.initializePolicies();
  }

  async initialize() {
    console.log('💾 Initializing Intelligent Cache...');
    
    // Ensure cache directory exists
    await fs.mkdir(this.cacheDir, { recursive: true });
    
    // Load existing cache metadata
    await this.loadCacheMetadata();
    
    // Start cleanup interval
    this.startCleanupInterval();
    
    console.log('✅ Intelligent Cache initialized');
  }

  initializeStrategies() {
    // LRU (Least Recently Used) strategy
    this.strategies.set('lru', {
      name: 'Least Recently Used',
      description: 'Evicts least recently used items first',
      evict: this.evictLRU.bind(this)
    });

    // LFU (Least Frequently Used) strategy
    this.strategies.set('lfu', {
      name: 'Least Frequently Used',
      description: 'Evicts least frequently used items first',
      evict: this.evictLFU.bind(this)
    });

    // FIFO (First In, First Out) strategy
    this.strategies.set('fifo', {
      name: 'First In, First Out',
      description: 'Evicts oldest items first',
      evict: this.evictFIFO.bind(this)
    });

    // TTL (Time To Live) strategy
    this.strategies.set('ttl', {
      name: 'Time To Live',
      description: 'Evicts expired items first',
      evict: this.evictTTL.bind(this)
    });

    // Size-based strategy
    this.strategies.set('size', {
      name: 'Size Based',
      description: 'Evicts largest items first',
      evict: this.evictSize.bind(this)
    });
  }

  initializePolicies() {
    // Write-through policy
    this.policies.set('write-through', {
      name: 'Write Through',
      description: 'Writes to cache and storage simultaneously',
      write: this.writeThrough.bind(this)
    });

    // Write-behind policy
    this.policies.set('write-behind', {
      name: 'Write Behind',
      description: 'Writes to cache immediately, storage asynchronously',
      write: this.writeBehind.bind(this)
    });

    // Write-around policy
    this.policies.set('write-around', {
      name: 'Write Around',
      description: 'Writes directly to storage, bypassing cache',
      write: this.writeAround.bind(this)
    });

    // Read-through policy
    this.policies.set('read-through', {
      name: 'Read Through',
      description: 'Reads from cache, loads from storage if miss',
      read: this.readThrough.bind(this)
    });

    // Cache-aside policy
    this.policies.set('cache-aside', {
      name: 'Cache Aside',
      description: 'Application manages cache and storage separately',
      read: this.cacheAsideRead.bind(this),
      write: this.cacheAsideWrite.bind(this)
    });
  }

  async get(key, options = {}) {
    const startTime = Date.now();
    
    try {
      // Check if key exists in memory cache
      if (this.cache.has(key)) {
        const item = this.cache.get(key);
        const metadata = this.metadata.get(key);
        
        // Check if item is expired
        if (this.isExpired(metadata)) {
          await this.delete(key);
          this.stats.misses++;
          return null;
        }
        
        // Update access time and frequency
        metadata.lastAccessed = Date.now();
        metadata.accessCount++;
        this.metadata.set(key, metadata);
        
        this.stats.hits++;
        
        if (this.verbose) {
          console.log(`💾 Cache hit: ${key} (${Date.now() - startTime}ms)`);
        }
        
        return this.deserialize(item);
      }
      
      // Try to load from disk cache
      const diskItem = await this.loadFromDisk(key);
      if (diskItem) {
        // Load into memory cache
        await this.set(key, diskItem, { ...options, skipDisk: true });
        
        this.stats.hits++;
        
        if (this.verbose) {
          console.log(`💾 Disk cache hit: ${key} (${Date.now() - startTime}ms)`);
        }
        
        return diskItem;
      }
      
      this.stats.misses++;
      
      if (this.verbose) {
        console.log(`💾 Cache miss: ${key} (${Date.now() - startTime}ms)`);
      }
      
      return null;
      
    } catch (error) {
      console.error(`❌ Cache get error for ${key}:`, error.message);
      this.stats.misses++;
      return null;
    }
  }

  async set(key, value, options = {}) {
    const startTime = Date.now();
    
    try {
      const {
        ttl = this.ttl,
        strategy = 'lru',
        policy = 'write-through',
        tags = [],
        skipDisk = false
      } = options;
      
      const serializedValue = this.serialize(value);
      const size = this.calculateSize(serializedValue);
      
      // Check if we need to evict items
      if (this.stats.size + size > this.maxSize) {
        await this.evictItems(size, strategy);
      }
      
      // Store in memory cache
      this.cache.set(key, serializedValue);
      
      // Create metadata
      const metadata = {
        key,
        size,
        ttl,
        createdAt: Date.now(),
        lastAccessed: Date.now(),
        accessCount: 1,
        strategy,
        tags,
        compressed: this.compression
      };
      
      this.metadata.set(key, metadata);
      this.stats.sets++;
      this.stats.size += size;
      
      // Apply write policy
      if (!skipDisk) {
        await this.policies.get(policy).write(key, value, metadata);
      }
      
      if (this.verbose) {
        console.log(`💾 Cache set: ${key} (${size} bytes, ${Date.now() - startTime}ms)`);
      }
      
      return true;
      
    } catch (error) {
      console.error(`❌ Cache set error for ${key}:`, error.message);
      return false;
    }
  }

  async delete(key) {
    try {
      // Remove from memory cache
      if (this.cache.has(key)) {
        const metadata = this.metadata.get(key);
        if (metadata) {
          this.stats.size -= metadata.size;
        }
        
        this.cache.delete(key);
        this.metadata.delete(key);
      }
      
      // Remove from disk cache
      await this.deleteFromDisk(key);
      
      this.stats.deletes++;
      
      if (this.verbose) {
        console.log(`💾 Cache delete: ${key}`);
      }
      
      return true;
      
    } catch (error) {
      console.error(`❌ Cache delete error for ${key}:`, error.message);
      return false;
    }
  }

  async clear() {
    try {
      // Clear memory cache
      this.cache.clear();
      this.metadata.clear();
      this.stats.size = 0;
      
      // Clear disk cache
      await this.clearDiskCache();
      
      console.log('💾 Cache cleared');
      
    } catch (error) {
      console.error('❌ Cache clear error:', error.message);
    }
  }

  async evictItems(requiredSize, strategy = 'lru') {
    const strategyImpl = this.strategies.get(strategy);
    if (!strategyImpl) {
      throw new Error(`Unknown eviction strategy: ${strategy}`);
    }
    
    let freedSize = 0;
    const itemsToEvict = [];
    
    // Get items to evict
    const evictionCandidates = await strategyImpl.evict(requiredSize);
    
    for (const key of evictionCandidates) {
      const metadata = this.metadata.get(key);
      if (metadata) {
        freedSize += metadata.size;
        itemsToEvict.push(key);
        
        if (freedSize >= requiredSize) {
          break;
        }
      }
    }
    
    // Evict items
    for (const key of itemsToEvict) {
      await this.delete(key);
      this.stats.evictions++;
    }
    
    if (this.verbose) {
      console.log(`💾 Evicted ${itemsToEvict.length} items, freed ${freedSize} bytes`);
    }
  }

  evictLRU(requiredSize) {
    // Sort by last accessed time (oldest first)
    const sortedItems = Array.from(this.metadata.entries())
      .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed)
      .map(([key]) => key);
    
    return sortedItems;
  }

  evictLFU(requiredSize) {
    // Sort by access count (least frequent first)
    const sortedItems = Array.from(this.metadata.entries())
      .sort(([, a], [, b]) => a.accessCount - b.accessCount)
      .map(([key]) => key);
    
    return sortedItems;
  }

  evictFIFO(requiredSize) {
    // Sort by creation time (oldest first)
    const sortedItems = Array.from(this.metadata.entries())
      .sort(([, a], [, b]) => a.createdAt - b.createdAt)
      .map(([key]) => key);
    
    return sortedItems;
  }

  evictTTL(requiredSize) {
    // Sort by expiration time (expired first, then closest to expiry)
    const now = Date.now();
    const sortedItems = Array.from(this.metadata.entries())
      .sort(([, a], [, b]) => {
        const aExpiry = a.createdAt + a.ttl;
        const bExpiry = b.createdAt + b.ttl;
        
        // Expired items first
        if (aExpiry <= now && bExpiry > now) return -1;
        if (bExpiry <= now && aExpiry > now) return 1;
        
        // Then by expiry time
        return aExpiry - bExpiry;
      })
      .map(([key]) => key);
    
    return sortedItems;
  }

  evictSize(requiredSize) {
    // Sort by size (largest first)
    const sortedItems = Array.from(this.metadata.entries())
      .sort(([, a], [, b]) => b.size - a.size)
      .map(([key]) => key);
    
    return sortedItems;
  }

  isExpired(metadata) {
    if (!metadata) return true;
    
    const now = Date.now();
    const expiryTime = metadata.createdAt + metadata.ttl;
    
    return now > expiryTime;
  }

  async loadFromDisk(key) {
    try {
      const filePath = join(this.cacheDir, this.getCacheFileName(key));
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      // Check if expired
      if (this.isExpired(data.metadata)) {
        await this.deleteFromDisk(key);
        return null;
      }
      
      return this.deserialize(data.value);
      
    } catch (error) {
      // File doesn't exist or can't be read
      return null;
    }
  }

  async saveToDisk(key, value, metadata) {
    try {
      const filePath = join(this.cacheDir, this.getCacheFileName(key));
      const data = {
        key,
        value: this.serialize(value),
        metadata
      };
      
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      
    } catch (error) {
      console.error(`❌ Failed to save to disk: ${key}`, error.message);
    }
  }

  async deleteFromDisk(key) {
    try {
      const filePath = join(this.cacheDir, this.getCacheFileName(key));
      await fs.unlink(filePath);
    } catch (error) {
      // File doesn't exist or can't be deleted
    }
  }

  async clearDiskCache() {
    try {
      const files = await fs.readdir(this.cacheDir);
      
      for (const file of files) {
        if (file.endsWith('.cache')) {
          await fs.unlink(join(this.cacheDir, file));
        }
      }
      
    } catch (error) {
      console.error('❌ Failed to clear disk cache:', error.message);
    }
  }

  async loadCacheMetadata() {
    try {
      const metadataPath = join(this.cacheDir, 'metadata.json');
      const content = await fs.readFile(metadataPath, 'utf-8');
      const data = JSON.parse(content);
      
      this.stats = { ...this.stats, ...data.stats };
      
    } catch (error) {
      // No metadata file exists
    }
  }

  async saveCacheMetadata() {
    try {
      const metadataPath = join(this.cacheDir, 'metadata.json');
      const data = {
        stats: this.stats,
        timestamp: Date.now()
      };
      
      await fs.writeFile(metadataPath, JSON.stringify(data, null, 2));
      
    } catch (error) {
      console.error('❌ Failed to save cache metadata:', error.message);
    }
  }

  getCacheFileName(key) {
    const hash = createHash('md5').update(key).digest('hex');
    return `${hash}.cache`;
  }

  serialize(value) {
    if (this.compression) {
      // In a real implementation, this would use compression
      return JSON.stringify(value);
    }
    return JSON.stringify(value);
  }

  deserialize(data) {
    try {
      return JSON.parse(data);
    } catch (error) {
      return data;
    }
  }

  calculateSize(data) {
    return Buffer.byteLength(data, 'utf8');
  }

  // Write policies
  async writeThrough(key, value, metadata) {
    await this.saveToDisk(key, value, metadata);
  }

  async writeBehind(key, value, metadata) {
    // In a real implementation, this would queue the write operation
    setImmediate(() => this.saveToDisk(key, value, metadata));
  }

  async writeAround(key, value, metadata) {
    // Write-around doesn't use cache for writes
    // This would typically write directly to storage
  }

  // Read policies
  async readThrough(key) {
    // In a real implementation, this would load from storage
    return null;
  }

  async cacheAsideRead(key) {
    // Cache-aside read is handled by the get method
    return null;
  }

  async cacheAsideWrite(key, value, metadata) {
    // Cache-aside write is handled by the set method
    return null;
  }

  // Cache operations
  async invalidateByTag(tag) {
    const keysToInvalidate = [];
    
    for (const [key, metadata] of this.metadata) {
      if (metadata.tags && metadata.tags.includes(tag)) {
        keysToInvalidate.push(key);
      }
    }
    
    for (const key of keysToInvalidate) {
      await this.delete(key);
    }
    
    console.log(`💾 Invalidated ${keysToInvalidate.length} items with tag: ${tag}`);
  }

  async invalidateByPattern(pattern) {
    const regex = new RegExp(pattern);
    const keysToInvalidate = [];
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToInvalidate.push(key);
      }
    }
    
    for (const key of keysToInvalidate) {
      await this.delete(key);
    }
    
    console.log(`💾 Invalidated ${keysToInvalidate.length} items matching pattern: ${pattern}`);
  }

  async warmup(keys, loader) {
    console.log(`🔥 Warming up cache with ${keys.length} keys...`);
    
    for (const key of keys) {
      try {
        const value = await loader(key);
        if (value !== null) {
          await this.set(key, value);
        }
      } catch (error) {
        console.error(`❌ Failed to warm up key ${key}:`, error.message);
      }
    }
    
    console.log('✅ Cache warmup completed');
  }

  startCleanupInterval() {
    // Clean up expired items every 5 minutes
    setInterval(() => {
      this.cleanupExpired();
    }, 5 * 60 * 1000);
  }

  async cleanupExpired() {
    const expiredKeys = [];
    
    for (const [key, metadata] of this.metadata) {
      if (this.isExpired(metadata)) {
        expiredKeys.push(key);
      }
    }
    
    for (const key of expiredKeys) {
      await this.delete(key);
    }
    
    if (expiredKeys.length > 0 && this.verbose) {
      console.log(`💾 Cleaned up ${expiredKeys.length} expired items`);
    }
  }

  getStats() {
    const hitRate = this.stats.hits + this.stats.misses > 0 
      ? (this.stats.hits / (this.stats.hits + this.stats.misses)) * 100 
      : 0;
    
    return {
      ...this.stats,
      hitRate: Math.round(hitRate * 100) / 100,
      memoryUsage: this.stats.size,
      maxSize: this.maxSize,
      utilization: Math.round((this.stats.size / this.maxSize) * 100),
      itemCount: this.cache.size
    };
  }

  async generateReport() {
    const stats = this.getStats();
    const strategies = Array.from(this.strategies.values());
    const policies = Array.from(this.policies.values());
    
    return {
      timestamp: new Date().toISOString(),
      stats,
      strategies,
      policies,
      summary: {
        totalItems: this.cache.size,
        memoryUsage: stats.memoryUsage,
        hitRate: stats.hitRate,
        utilization: stats.utilization
      }
    };
  }

  getSupportedStrategies() {
    return Array.from(this.strategies.values());
  }

  getSupportedPolicies() {
    return Array.from(this.policies.values());
  }
}