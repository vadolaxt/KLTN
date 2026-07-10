interface EnvironmentConfig {
  apiBaseUrl: string;
  serverUrl: string;
  googleClientId: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  enableLogging: boolean;
  enableAnalytics: boolean;
  cacheTimeout: number;
}

export const ENV_CONFIG: EnvironmentConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  // serverUrl: process.env.NEXT_PUBLIC_SERVER_URL || 'http://168.144.105.254:8081/api',
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8081/api',
  googleClientId: "655464563429-c45i97cc5isk764dbvjn0pt9fij8m41a.apps.googleusercontent.com",
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  enableLogging: process.env.NEXT_PUBLIC_ENABLE_LOGGING === 'true' || process.env.NODE_ENV === 'development',
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' && process.env.NODE_ENV === 'production',
  cacheTimeout: parseInt(process.env.NEXT_PUBLIC_CACHE_TIMEOUT || '300000', 10) // 5 minutes default
};

export const isClientSide = (): boolean => typeof window !== 'undefined';

export const isServerSide = (): boolean => typeof window === 'undefined';
