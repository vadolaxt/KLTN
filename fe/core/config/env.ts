/**
 * Environment configuration
 * Centralized environment variables and configuration management
 */

export interface EnvironmentConfig {
  apiBaseUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  enableLogging: boolean;
  enableAnalytics: boolean;
  cacheTimeout: number;
}

export const ENV_CONFIG: EnvironmentConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  enableLogging: process.env.NEXT_PUBLIC_ENABLE_LOGGING === 'true' || process.env.NODE_ENV === 'development',
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' && process.env.NODE_ENV === 'production',
  cacheTimeout: parseInt(process.env.NEXT_PUBLIC_CACHE_TIMEOUT || '300000', 10) // 5 minutes default
};

export const getEnvironmentConfig = (): EnvironmentConfig => ENV_CONFIG;

export const isClientSide = (): boolean => typeof window !== 'undefined';

export const isServerSide = (): boolean => typeof window === 'undefined';