import { createClient, RedisClientType } from 'redis';

// ========== TIPOS E INTERFACES ==========

interface CacheOptions {
  ttl?: number; // Time to live em segundos
  prefix?: string;
  serialize?: boolean;
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  errors: number;
}

interface CacheEntry<T = any> {
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

// ========== CONFIGURAÇÃO ==========

const CACHE_CONFIG = {
  // Redis configuration
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD,
    database: parseInt(process.env.REDIS_DB || '0', 10),
    connectTimeout: 10000,
    lazyConnect: true,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3
  },
  
  // Default cache settings
  defaults: {
    ttl: 3600, // 1 hora
    prefix: 'giropro:cache:',
    maxKeyLength: 250,
    maxValueSize: 10 * 1024 * 1024 // 10MB
  },
  
  // Fallback in-memory cache settings
  memory: {
    maxSize: 1000, // Máximo de entradas
    cleanupInterval: 300000 // 5 minutos
  }
};

// ========== SERVIÇO DE CACHE PRINCIPAL ==========

export class CacheService {
  private static redisClient: RedisClientType | null = null;
  private static memoryCache = new Map<string, CacheEntry>();
  private static stats: CacheStats = { hits: 0, misses: 0, sets: 0, deletes: 0, errors: 0 };
  private static isRedisConnected = false;
  private static cleanupTimer: NodeJS.Timeout | null = null;

  /**
   * Inicializa o serviço de cache
   */
  static async initialize(): Promise<void> {
    try {
      // Tentar conectar ao Redis
      await this.connectRedis();
      
      // Configurar limpeza automática do cache em memória
      this.setupMemoryCleanup();
      
      console.log('✅ CacheService inicializado com sucesso');
    } catch (error) {
      console.warn('⚠️ Redis indisponível, usando cache em memória:', error);
      this.setupMemoryCleanup();
    }
  }

  /**
   * Busca um valor do cache
   */
  static async get<T = any>(key: string, options: CacheOptions = {}): Promise<T | null> {
    const fullKey = this.buildKey(key, options.prefix);
    
    try {
      // Tentar buscar do Redis primeiro
      if (this.isRedisConnected && this.redisClient) {
        const value = await this.redisClient.get(fullKey);
        
        if (value !== null) {
          this.stats.hits++;
          return options.serialize !== false ? JSON.parse(value) : value as T;
        }
      }
      
      // Fallback para cache em memória
      const memoryEntry = this.memoryCache.get(fullKey);
      
      if (memoryEntry) {
        // Verificar se não expirou
        if (Date.now() - memoryEntry.timestamp < memoryEntry.ttl * 1000) {
          memoryEntry.hits++;
          this.stats.hits++;
          return memoryEntry.value as T;
        } else {
          // Remover entrada expirada
          this.memoryCache.delete(fullKey);
        }
      }
      
      this.stats.misses++;
      return null;
      
    } catch (error) {
      console.error('Erro ao buscar cache:', error);
      this.stats.errors++;
      return null;
    }
  }

  /**
   * Armazena um valor no cache
   */
  static async set(
    key: string, 
    value: any, 
    ttl: number = CACHE_CONFIG.defaults.ttl,
    options: CacheOptions = {}
  ): Promise<boolean> {
    const fullKey = this.buildKey(key, options.prefix);
    
    try {
      // Validações
      if (fullKey.length > CACHE_CONFIG.defaults.maxKeyLength) {
        console.warn(`Chave de cache muito longa: ${fullKey.length} chars`);
        return false;
      }
      
      const serializedValue = options.serialize !== false ? JSON.stringify(value) : value;
      const valueSize = new Blob([serializedValue]).size;
      
      if (valueSize > CACHE_CONFIG.defaults.maxValueSize) {
        console.warn(`Valor de cache muito grande: ${valueSize} bytes`);
        return false;
      }

      // Tentar armazenar no Redis
      if (this.isRedisConnected && this.redisClient) {
        await this.redisClient.setEx(fullKey, ttl, serializedValue);
      }
      
      // Armazenar também em memória como backup
      this.setMemoryCache(fullKey, value, ttl);
      
      this.stats.sets++;
      return true;
      
    } catch (error) {
      console.error('Erro ao armazenar cache:', error);
      this.stats.errors++;
      
      // Tentar salvar apenas em memória
      try {
        this.setMemoryCache(fullKey, value, ttl);
        return true;
      } catch {
        return false;
      }
    }
  }

  /**
   * Remove uma chave específica do cache
   */
  static async delete(key: string, options: CacheOptions = {}): Promise<boolean> {
    const fullKey = this.buildKey(key, options.prefix);
    
    try {
      let deleted = false;
      
      // Remover do Redis
      if (this.isRedisConnected && this.redisClient) {
        const result = await this.redisClient.del(fullKey);
        deleted = result > 0;
      }
      
      // Remover do cache em memória
      const memoryDeleted = this.memoryCache.delete(fullKey);
      
      if (deleted || memoryDeleted) {
        this.stats.deletes++;
        return true;
      }
      
      return false;
      
    } catch (error) {
      console.error('Erro ao deletar cache:', error);
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Remove múltiplas chaves baseadas em padrão
   */
  static async deletePattern(pattern: string, options: CacheOptions = {}): Promise<number> {
    const fullPattern = this.buildKey(pattern, options.prefix);
    let deletedCount = 0;
    
    try {
      // Deletar do Redis usando SCAN para performance
      if (this.isRedisConnected && this.redisClient) {
        const keys = await this.redisClient.keys(fullPattern);
        if (keys.length > 0) {
          const result = await this.redisClient.del(keys);
          deletedCount += result;
        }
      }
      
      // Deletar do cache em memória
      const memoryKeys = Array.from(this.memoryCache.keys()).filter(key => 
        this.matchesPattern(key, fullPattern)
      );
      
      memoryKeys.forEach(key => {
        if (this.memoryCache.delete(key)) {
          deletedCount++;
        }
      });
      
      this.stats.deletes += deletedCount;
      return deletedCount;
      
    } catch (error) {
      console.error('Erro ao deletar padrão de cache:', error);
      this.stats.errors++;
      return deletedCount;
    }
  }

  /**
   * Limpa todo o cache
   */
  static async clear(): Promise<boolean> {
    try {
      // Limpar Redis
      if (this.isRedisConnected && this.redisClient) {
        const keys = await this.redisClient.keys(`${CACHE_CONFIG.defaults.prefix}*`);
        if (keys.length > 0) {
          await this.redisClient.del(keys);
        }
      }
      
      // Limpar cache em memória
      this.memoryCache.clear();
      
      console.log('🧹 Cache completamente limpo');
      return true;
      
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Verifica se uma chave existe no cache
   */
  static async exists(key: string, options: CacheOptions = {}): Promise<boolean> {
    const fullKey = this.buildKey(key, options.prefix);
    
    try {
      // Verificar no Redis
      if (this.isRedisConnected && this.redisClient) {
        const exists = await this.redisClient.exists(fullKey);
        if (exists) return true;
      }
      
      // Verificar no cache em memória
      const memoryEntry = this.memoryCache.get(fullKey);
      if (memoryEntry) {
        // Verificar se não expirou
        return Date.now() - memoryEntry.timestamp < memoryEntry.ttl * 1000;
      }
      
      return false;
      
    } catch (error) {
      console.error('Erro ao verificar existência no cache:', error);
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Obtém estatísticas do cache
   */
  static getStats(): CacheStats & {
    memorySize: number;
    redisConnected: boolean;
    hitRate: string;
  } {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? ((this.stats.hits / total) * 100).toFixed(2) : '0.00';
    
    return {
      ...this.stats,
      memorySize: this.memoryCache.size,
      redisConnected: this.isRedisConnected,
      hitRate: `${hitRate}%`
    };
  }

  /**
   * Reinicia as estatísticas
   */
  static resetStats(): void {
    this.stats = { hits: 0, misses: 0, sets: 0, deletes: 0, errors: 0 };
  }

  /**
   * Obtém informações sobre o cache em memória
   */
  static getMemoryCacheInfo(): Array<{
    key: string;
    size: number;
    age: number;
    hits: number;
    ttl: number;
  }> {
    const now = Date.now();
    
    return Array.from(this.memoryCache.entries()).map(([key, entry]) => ({
      key,
      size: new Blob([JSON.stringify(entry.value)]).size,
      age: Math.round((now - entry.timestamp) / 1000),
      hits: entry.hits,
      ttl: entry.ttl
    }));
  }

  /**
   * Cache com callback (get-or-set pattern)
   */
  static async getOrSet<T>(
    key: string,
    callback: () => Promise<T> | T,
    ttl: number = CACHE_CONFIG.defaults.ttl,
    options: CacheOptions = {}
  ): Promise<T> {
    // Tentar buscar do cache
    let value = await this.get<T>(key, options);
    
    if (value !== null) {
      return value;
    }
    
    // Executar callback e cachear o resultado
    try {
      value = await callback();
      await this.set(key, value, ttl, options);
      return value;
    } catch (error) {
      console.error('Erro no callback do cache:', error);
      throw error;
    }
  }

  /**
   * Cache para múltiplas chaves (batch operations)
   */
  static async mget<T = any>(keys: string[], options: CacheOptions = {}): Promise<(T | null)[]> {
    const promises = keys.map(key => this.get<T>(key, options));
    return Promise.all(promises);
  }

  static async mset(
    entries: Array<{ key: string; value: any; ttl?: number }>,
    options: CacheOptions = {}
  ): Promise<boolean[]> {
    const promises = entries.map(entry => 
      this.set(entry.key, entry.value, entry.ttl, options)
    );
    return Promise.all(promises);
  }

  /**
   * Encerra o serviço de cache
   */
  static async shutdown(): Promise<void> {
    try {
      // Limpar timer de limpeza
      if (this.cleanupTimer) {
        clearInterval(this.cleanupTimer);
        this.cleanupTimer = null;
      }
      
      // Fechar conexão Redis
      if (this.redisClient) {
        await this.redisClient.quit();
        this.redisClient = null;
        this.isRedisConnected = false;
      }
      
      // Limpar cache em memória
      this.memoryCache.clear();
      
      console.log('✅ CacheService encerrado com sucesso');
      
    } catch (error) {
      console.error('Erro ao encerrar CacheService:', error);
    }
  }

  // ========== MÉTODOS PRIVADOS ==========

  private static async connectRedis(): Promise<void> {
    try {
      this.redisClient = createClient(CACHE_CONFIG.redis) as RedisClientType;
      
      // Configurar event listeners
      this.redisClient.on('error', (error) => {
        console.error('Erro no Redis:', error);
        this.isRedisConnected = false;
        this.stats.errors++;
      });
      
      this.redisClient.on('connect', () => {
        console.log('✅ Conectado ao Redis');
        this.isRedisConnected = true;
      });
      
      this.redisClient.on('disconnect', () => {
        console.warn('⚠️ Desconectado do Redis');
        this.isRedisConnected = false;
      });
      
      // Conectar
      await this.redisClient.connect();
      
    } catch (error) {
      console.error('Falha ao conectar com Redis:', error);
      this.redisClient = null;
      this.isRedisConnected = false;
      throw error;
    }
  }

  private static buildKey(key: string, prefix?: string): string {
    const finalPrefix = prefix || CACHE_CONFIG.defaults.prefix;
    return `${finalPrefix}${key}`;
  }

  private static setMemoryCache(key: string, value: any, ttl: number): void {
    // Verificar limite de tamanho
    if (this.memoryCache.size >= CACHE_CONFIG.memory.maxSize) {
      // Remover entradas mais antigas
      this.cleanupMemoryCache();
    }
    
    this.memoryCache.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
      hits: 0
    });
  }

  private static setupMemoryCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    
    this.cleanupTimer = setInterval(() => {
      this.cleanupMemoryCache();
    }, CACHE_CONFIG.memory.cleanupInterval);
  }

  private static cleanupMemoryCache(): void {
    const now = Date.now();
    const entriesToRemove: string[] = [];

    // Identificar entradas expiradas
    for (const [key, entry] of this.memoryCache.entries()) {
      if (now - entry.timestamp >= entry.ttl * 1000) {
        entriesToRemove.push(key);
      }
    }

    // Remover entradas expiradas
    entriesToRemove.forEach(key => {
      this.memoryCache.delete(key);
    });

    // Se ainda estiver acima do limite, remover entradas menos utilizadas
    if (this.memoryCache.size >= CACHE_CONFIG.memory.maxSize) {
      const entries = Array.from(this.memoryCache.entries());
      
      // Ordenar por menos hits e mais antigas
      entries.sort((a, b) => {
        if (a[1].hits !== b[1].hits) {
          return a[1].hits - b[1].hits; // Menos hits primeiro
        }
        return a[1].timestamp - b[1].timestamp; // Mais antigas primeiro
      });

      // Remover 25% das entradas
      const toRemove = Math.ceil(entries.length * 0.25);
      for (let i = 0; i < toRemove; i++) {
        this.memoryCache.delete(entries[i][0]);
      }
    }

    if (entriesToRemove.length > 0) {
      console.log(`🧹 Limpeza de cache: ${entriesToRemove.length} entradas removidas`);
    }
  }

  private static matchesPattern(key: string, pattern: string): boolean {
    // Converter pattern com * para regex
    const regexPattern = pattern
      .replace(/[.*+?^${}()|[\]\\]/g, '\\  private static cleanupMem') // Escape regex chars
      .replace(/\\\*/g, '.*'); // Convert * to .*
    
    const regex = new RegExp(`^${regexPattern}import { createClient, RedisClientType } from 'redis';

// ========== TIPOS E INTERFACES ==========

interface CacheOptions {
  ttl?: number; // Time to live em segundos
  prefix?: string;
  serialize?: boolean;
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  errors: number;
}

interface CacheEntry<T = any> {
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

// ========== CONFIGURAÇÃO ==========

const CACHE_CONFIG = {
  // Redis configuration
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD,
    database: parseInt(process.env.REDIS_DB || '0', 10),
    connectTimeout: 10000,
    lazyConnect: true,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3
  },
  
  // Default cache settings
  defaults: {
    ttl: 3600, // 1 hora
    prefix: 'giropro:cache:',
    maxKeyLength: 250,
    maxValueSize: 10 * 1024 * 1024 // 10MB
  },
  
  // Fallback in-memory cache settings
  memory: {
    maxSize: 1000, // Máximo de entradas
    cleanupInterval: 300000 // 5 minutos
  }
};

// ========== SERVIÇO DE CACHE PRINCIPAL ==========

export class CacheService {
  private static redisClient: RedisClientType | null = null;
  private static memoryCache = new Map<string, CacheEntry>();
  private static stats: CacheStats = { hits: 0, misses: 0, sets: 0, deletes: 0, errors: 0 };
  private static isRedisConnected = false;
  private static cleanupTimer: NodeJS.Timeout | null = null;

  /**
   * Inicializa o serviço de cache
   */
  static async initialize(): Promise<void> {
    try {
      // Tentar conectar ao Redis
      await this.connectRedis();
      
      // Configurar limpeza automática do cache em memória
      this.setupMemoryCleanup();
      
      console.log('✅ CacheService inicializado com sucesso');
    } catch (error) {
      console.warn('⚠️ Redis indisponível, usando cache em memória:', error);
      this.setupMemoryCleanup();
    }
  }

  /**
   * Busca um valor do cache
   */
  static async get<T = any>(key: string, options: CacheOptions = {}): Promise<T | null> {
    const fullKey = this.buildKey(key, options.prefix);
    
    try {
      // Tentar buscar do Redis primeiro
      if (this.isRedisConnected && this.redisClient) {
        const value = await this.redisClient.get(fullKey);
        
        if (value !== null) {
          this.stats.hits++;
          return options.serialize !== false ? JSON.parse(value) : value as T;
        }
      }
      
      // Fallback para cache em memória
      const memoryEntry = this.memoryCache.get(fullKey);
      
      if (memoryEntry) {
        // Verificar se não expirou
        if (Date.now() - memoryEntry.timestamp < memoryEntry.ttl * 1000) {
          memoryEntry.hits++;
          this.stats.hits++;
          return memoryEntry.value as T;
        } else {
          // Remover entrada expirada
          this.memoryCache.delete(fullKey);
        }
      }
      
      this.stats.misses++;
      return null;
      
    } catch (error) {
      console.error('Erro ao buscar cache:', error);
      this.stats.errors++;
      return null;
    }
  }

  /**
   * Armazena um valor no cache
   */
  static async set(
    key: string, 
    value: any, 
    ttl: number = CACHE_CONFIG.defaults.ttl,
    options: CacheOptions = {}
  ): Promise<boolean> {
    const fullKey = this.buildKey(key, options.prefix);
    
    try {
      // Validações
      if (fullKey.length > CACHE_CONFIG.defaults.maxKeyLength) {
        console.warn(`Chave de cache muito longa: ${fullKey.length} chars`);
        return false;
      }
      
      const serializedValue = options.serialize !== false ? JSON.stringify(value) : value;
      const valueSize = new Blob([serializedValue]).size;
      
      if (valueSize > CACHE_CONFIG.defaults.maxValueSize) {
        console.warn(`Valor de cache muito grande: ${valueSize} bytes`);
        return false;
      }

      // Tentar armazenar no Redis
      if (this.isRedisConnected && this.redisClient) {
        await this.redisClient.setEx(fullKey, ttl, serializedValue);
      }
      
      // Armazenar também em memória como backup
      this.setMemoryCache(fullKey, value, ttl);
      
      this.stats.sets++;
      return true;
      
    } catch (error) {
      console.error('Erro ao armazenar cache:', error);
      this.stats.errors++;
      
      // Tentar salvar apenas em memória
      try {
        this.setMemoryCache(fullKey, value, ttl);
        return true;
      } catch {
        return false;
      }
    }
  }

  /**
   * Remove uma chave específica do cache
   */
  static async delete(key: string, options: CacheOptions = {}): Promise<boolean> {
    const fullKey = this.buildKey(key, options.prefix);
    
    try {
      let deleted = false;
      
      // Remover do Redis
      if (this.isRedisConnected && this.redisClient) {
        const result = await this.redisClient.del(fullKey);
        deleted = result > 0;
      }
      
      // Remover do cache em memória
      const memoryDeleted = this.memoryCache.delete(fullKey);
      
      if (deleted || memoryDeleted) {
        this.stats.deletes++;
        return true;
      }
      
      return false;
      
    } catch (error) {
      console.error('Erro ao deletar cache:', error);
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Remove múltiplas chaves baseadas em padrão
   */
  static async deletePattern(pattern: string, options: CacheOptions = {}): Promise<number> {
    const fullPattern = this.buildKey(pattern, options.prefix);
    let deletedCount = 0;
    
    try {
      // Deletar do Redis usando SCAN para performance
      if (this.isRedisConnected && this.redisClient) {
        const keys = await this.redisClient.keys(fullPattern);
        if (keys.length > 0) {
          const result = await this.redisClient.del(keys);
          deletedCount += result;
        }
      }
      
      // Deletar do cache em memória
      const memoryKeys = Array.from(this.memoryCache.keys()).filter(key => 
        this.matchesPattern(key, fullPattern)
      );
      
      memoryKeys.forEach(key => {
        if (this.memoryCache.delete(key)) {
          deletedCount++;
        }
      });
      
      this.stats.deletes += deletedCount;
      return deletedCount;
      
    } catch (error) {
      console.error('Erro ao deletar padrão de cache:', error);
      this.stats.errors++;
      return deletedCount;
    }
  }

  /**
   * Limpa todo o cache
   */
  static async clear(): Promise<boolean> {
    try {
      // Limpar Redis
      if (this.isRedisConnected && this.redisClient) {
        const keys = await this.redisClient.keys(`${CACHE_CONFIG.defaults.prefix}*`);
        if (keys.length > 0) {
          await this.redisClient.del(keys);
        }
      }
      
      // Limpar cache em memória
      this.memoryCache.clear();
      
      console.log('🧹 Cache completamente limpo');
      return true;
      
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Verifica se uma chave existe no cache
   */
  static async exists(key: string, options: CacheOptions = {}): Promise<boolean> {
    const fullKey = this.buildKey(key, options.prefix);
    
    try {
      // Verificar no Redis
      if (this.isRedisConnected && this.redisClient) {
        const exists = await this.redisClient.exists(fullKey);
        if (exists) return true;
      }
      
      // Verificar no cache em memória
      const memoryEntry = this.memoryCache.get(fullKey);
      if (memoryEntry) {
        // Verificar se não expirou
        return Date.now() - memoryEntry.timestamp < memoryEntry.ttl * 1000;
      }
      
      return false;
      
    } catch (error) {
      console.error('Erro ao verificar existência no cache:', error);
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Obtém estatísticas do cache
   */
  static getStats(): CacheStats & {
    memorySize: number;
    redisConnected: boolean;
    hitRate: string;
  } {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? ((this.stats.hits / total) * 100).toFixed(2) : '0.00';
    
    return {
      ...this.stats,
      memorySize: this.memoryCache.size,
      redisConnected: this.isRedisConnected,
      hitRate: `${hitRate}%`
    };
  }

  /**
   * Reinicia as estatísticas
   */
  static resetStats(): void {
    this.stats = { hits: 0, misses: 0, sets: 0, deletes: 0, errors: 0 };
  }

  /**
   * Obtém informações sobre o cache em memória
   */
  static getMemoryCacheInfo(): Array<{
    key: string;
    size: number;
    age: number;
    hits: number;
    ttl: number;
  }> {
    const now = Date.now();
    
    return Array.from(this.memoryCache.entries()).map(([key, entry]) => ({
      key,
      size: new Blob([JSON.stringify(entry.value)]).size,
      age: Math.round((now - entry.timestamp) / 1000),
      hits: entry.hits,
      ttl: entry.ttl
    }));
  }

  /**
   * Cache com callback (get-or-set pattern)
   */
  static async getOrSet<T>(
    key: string,
    callback: () => Promise<T> | T,
    ttl: number = CACHE_CONFIG.defaults.ttl,
    options: CacheOptions = {}
  ): Promise<T> {
    // Tentar buscar do cache
    let value = await this.get<T>(key, options);
    
    if (value !== null) {
      return value;
    }
    
    // Executar callback e cachear o resultado
    try {
      value = await callback();
      await this.set(key, value, ttl, options);
      return value;
    } catch (error) {
      console.error('Erro no callback do cache:', error);
      throw error;
    }
  }

  /**
   * Cache para múltiplas chaves (batch operations)
   */
  static async mget<T = any>(keys: string[], options: CacheOptions = {}): Promise<(T | null)[]> {
    const promises = keys.map(key => this.get<T>(key, options));
    return Promise.all(promises);
  }

  static async mset(
    entries: Array<{ key: string; value: any; ttl?: number }>,
    options: CacheOptions = {}
  ): Promise<boolean[]> {
    const promises = entries.map(entry => 
      this.set(entry.key, entry.value, entry.ttl, options)
    );
    return Promise.all(promises);
  }

  /**
   * Encerra o serviço de cache
   */
  static async shutdown(): Promise<void> {
    try {
      // Limpar timer de limpeza
      if (this.cleanupTimer) {
        clearInterval(this.cleanupTimer);
        this.cleanupTimer = null;
      }
      
      // Fechar conexão Redis
      if (this.redisClient) {
        await this.redisClient.quit();
        this.redisClient = null;
        this.isRedisConnected = false;
      }
      
      // Limpar cache em memória
      this.memoryCache.clear();
      
      console.log('✅ CacheService encerrado com sucesso');
      
    } catch (error) {
      console.error('Erro ao encerrar CacheService:', error);
    }
  }

  // ========== MÉTODOS PRIVADOS ==========

  private static async connectRedis(): Promise<void> {
    try {
      this.redisClient = createClient(CACHE_CONFIG.redis) as RedisClientType;
      
      // Configurar event listeners
      this.redisClient.on('error', (error) => {
        console.error('Erro no Redis:', error);
        this.isRedisConnected = false;
        this.stats.errors++;
      });
      
      this.redisClient.on('connect', () => {
        console.log('✅ Conectado ao Redis');
        this.isRedisConnected = true;
      });
      
      this.redisClient.on('disconnect', () => {
        console.warn('⚠️ Desconectado do Redis');
        this.isRedisConnected = false;
      });
      
      // Conectar
      await this.redisClient.connect();
      
    } catch (error) {
      console.error('Falha ao conectar com Redis:', error);
      this.redisClient = null;
      this.isRedisConnected = false;
      throw error;
    }
  }

  private static buildKey(key: string, prefix?: string): string {
    const finalPrefix = prefix || CACHE_CONFIG.defaults.prefix;
    return `${finalPrefix}${key}`;
  }

  private static setMemoryCache(key: string, value: any, ttl: number): void {
    // Verificar limite de tamanho
    if (this.memoryCache.size >= CACHE_CONFIG.memory.maxSize) {
      // Remover entradas mais antigas
      this.cleanupMemoryCache();
    }
    
    this.memoryCache.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
      hits: 0
    });
  }

  private static setupMemoryCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    
    this.cleanupTimer = setInterval(() => {
      this.cleanupMemoryCache();
    }, CACHE_CONFIG.memory.cleanupInterval);
  }

);
    return regex.test(key);
  }
}

// ========== CACHE ESPECIALIZADO PARA FUEL PRICES ==========

export class FuelPriceCacheService {
  private static readonly PREFIXES = {
    PRICES: 'fuel-prices:',
    HISTORY: 'price-history:',
    REGIONAL: 'regional-comparison:',
    STATS: 'price-stats:',
    NEARBY: 'nearby-prices:',
    REPORTS: 'price-reports:'
  };

  private static readonly TTL = {
    PRICES: 300, // 5 minutos
    HISTORY: 600, // 10 minutos
    REGIONAL: 900, // 15 minutos
    STATS: 1800, // 30 minutos
    NEARBY: 300, // 5 minutos
    REPORTS: 3600 // 1 hora
  };

  /**
   * Cache de preços por região
   */
  static async getPrices(filters: any): Promise<any> {
    const key = `${this.PREFIXES.PRICES}${JSON.stringify(filters)}`;
    return CacheService.get(key);
  }

  static async setPrices(filters: any, data: any): Promise<boolean> {
    const key = `${this.PREFIXES.PRICES}${JSON.stringify(filters)}`;
    return CacheService.set(key, data, this.TTL.PRICES);
  }

  /**
   * Cache de histórico de preços
   */
  static async getHistory(params: any): Promise<any> {
    const key = `${this.PREFIXES.HISTORY}${JSON.stringify(params)}`;
    return CacheService.get(key);
  }

  static async setHistory(params: any, data: any): Promise<boolean> {
    const key = `${this.PREFIXES.HISTORY}${JSON.stringify(params)}`;
    return CacheService.set(key, data, this.TTL.HISTORY);
  }

  /**
   * Cache de comparativo regional
   */
  static async getRegionalComparison(params: any): Promise<any> {
    const key = `${this.PREFIXES.REGIONAL}${JSON.stringify(params)}`;
    return CacheService.get(key);
  }

  static async setRegionalComparison(params: any, data: any): Promise<boolean> {
    const key = `${this.PREFIXES.REGIONAL}${JSON.stringify(params)}`;
    return CacheService.set(key, data, this.TTL.REGIONAL);
  }

  /**
   * Cache de estatísticas
   */
  static async getStats(params: any): Promise<any> {
    const key = `${this.PREFIXES.STATS}${JSON.stringify(params)}`;
    return CacheService.get(key);
  }

  static async setStats(params: any, data: any): Promise<boolean> {
    const key = `${this.PREFIXES.STATS}${JSON.stringify(params)}`;
    return CacheService.set(key, data, this.TTL.STATS);
  }

  /**
   * Cache de postos próximos
   */
  static async getNearbyPrices(query: any): Promise<any> {
    // Para geolocalização, usar coordenadas arredondadas para melhor cache hit
    const roundedQuery = {
      ...query,
      latitude: Math.round(query.latitude * 1000) / 1000, // 3 casas decimais
      longitude: Math.round(query.longitude * 1000) / 1000
    };
    
    const key = `${this.PREFIXES.NEARBY}${JSON.stringify(roundedQuery)}`;
    return CacheService.get(key);
  }

  static async setNearbyPrices(query: any, data: any): Promise<boolean> {
    const roundedQuery = {
      ...query,
      latitude: Math.round(query.latitude * 1000) / 1000,
      longitude: Math.round(query.longitude * 1000) / 1000
    };
    
    const key = `${this.PREFIXES.NEARBY}${JSON.stringify(roundedQuery)}`;
    return CacheService.set(key, data, this.TTL.NEARBY);
  }

  /**
   * Invalidar cache por padrões específicos
   */
  static async invalidatePricesForRegion(estado: string, cidade?: string): Promise<number> {
    const patterns = [
      `${this.PREFIXES.PRICES}*${estado}*`,
      `${this.PREFIXES.HISTORY}*${estado}*`,
      `${this.PREFIXES.REGIONAL}*${estado}*`
    ];

    if (cidade) {
      patterns.push(
        `${this.PREFIXES.PRICES}*${cidade}*`,
        `${this.PREFIXES.HISTORY}*${cidade}*`
      );
    }

    let totalDeleted = 0;
    for (const pattern of patterns) {
      const deleted = await CacheService.deletePattern(pattern);
      totalDeleted += deleted;
    }

    return totalDeleted;
  }

  static async invalidateStatistics(): Promise<number> {
    return CacheService.deletePattern(`${this.PREFIXES.STATS}*`);
  }

  static async invalidateAll(): Promise<boolean> {
    const patterns = Object.values(this.PREFIXES);
    
    for (const prefix of patterns) {
      await CacheService.deletePattern(`${prefix}*`);
    }

    return true;
  }
}

// ========== AUTO-INICIALIZAÇÃO ==========

// Inicializar automaticamente quando o módulo é carregado
if (process.env.NODE_ENV !== 'test') {
  CacheService.initialize().catch(error => {
    console.error('Falha ao inicializar CacheService:', error);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  await CacheService.shutdown();
});

process.on('SIGINT', async () => {
  await CacheService.shutdown();
});

// Export das instâncias
export { CacheService as default, FuelPriceCacheService };