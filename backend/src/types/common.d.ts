export interface ServiceResult<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: any;
}

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  revalidate?: boolean; // Whether to revalidate cache in background
}



declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      [key: string]: any;
    };
  }
}




import { FastifyRequest } from 'fastify';

export interface AuthenticatedRequest extends FastifyRequest {
  user: {
    id: string;
    email: string;
    [key: string]: any;
  };
}


