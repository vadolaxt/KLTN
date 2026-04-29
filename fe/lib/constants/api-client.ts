/**
 * API endpoints configuration
 * Centralized API endpoint definitions for the homepage system
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Homepage data endpoints
  HOMEPAGE: {
    STATS: '/api/homepage/stats',
    SERVICES: '/api/homepage/services', 
    NEWS: '/api/homepage/news',
    ALL: '/api/homepage/data'
  },
  
  // Authentication endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout'
  },
  
  // Admission services endpoints
  ADMISSION: {
    SEARCH: '/api/admission/search',
    PROFILE: '/api/admission/profile',
    CERTIFICATE: '/api/admission/certificate',
    PREDICTION: '/api/admission/prediction',
    HANDBOOK: '/api/admission/handbook',
    CHATBOT: '/api/admission/chatbot'
  }
} as const;

export const API_TIMEOUT = 10000; // 10 seconds
export const API_RETRY_ATTEMPTS = 3;
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes