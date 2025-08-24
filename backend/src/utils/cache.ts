export class Cache {
  private cache: Map<string, { value: any; expiry: number }>;
  private ttl: number; // Time to live in milliseconds
  private maxSize: number;

  constructor(options?: { ttl?: number; maxSize?: number }) {
    this.cache = new Map();
    this.ttl = options?.ttl || 5 * 60 * 1000; // Default 5 minutes
    this.maxSize = options?.maxSize || 1000; // Default 1000 items

    // Clean up expired items periodically
    setInterval(() => this.cleanup(), this.ttl);
  }

  public set(key: string, value: any, ttl?: number): void {
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }
    const expiry = Date.now() + (ttl || this.ttl);
    this.cache.set(key, { value, expiry });
  }

  public get(key: string): any | undefined {
    const item = this.cache.get(key);
    if (!item) {
      return undefined;
    }
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }
    return item.value;
  }

  public has(key: string): boolean {
    return this.cache.has(key) && Date.now() <= this.cache.get(key)!.expiry;
  }

  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  public invalidatePattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  public clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }

  private evictOldest(): void {
    const oldestKey = this.cache.keys().next().value;
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }
}



// Instância global do cache
export const cacheService = new Cache();

