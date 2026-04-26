/**
 * Image asset constants
 * Centralized image path definitions and metadata
 * Organized by usage categories for better maintainability
 */

import { IconDefinition, ICONS, SERVICE_ICONS } from "./icons";

export interface ImageAsset {
  path: string;
  alt: string;
  width?: number;
  height?: number;
  format: 'png' | 'svg' | 'jpg' | 'webp';
  category: 'branding' | 'service' | 'news' | 'ui';
  description: string;
}

export const IMAGES = {
  // Branding images - University logos and identity assets
  BRANDING: {
    NLU_WHITE_PNG: {
      path: '/assets/imgs/logo_2-w.png',
      alt: 'NLU Logo White PNG',
      format: 'png',
      category: 'branding',
      description: 'NLU university logo in white color, PNG format'
    } as ImageAsset,
    
    NLU_WHITE_SVG: {
      path: '/assets/imgs/logo_2-w.svg', 
      alt: 'NLU Logo White SVG',
      format: 'svg',
      category: 'branding',
      description: 'NLU university logo in white color, scalable SVG format'
    } as ImageAsset,
    
    NLU_BLACK_PNG: {
      path: '/assets/imgs/logo_3-b.png',
      alt: 'NLU Logo Black PNG', 
      format: 'png',
      category: 'branding',
      description: 'NLU university logo in black color, PNG format'
    } as ImageAsset,
    
    NLU_BLACK_SVG: {
      path: '/assets/imgs/logo_3-b.svg',
      alt: 'NLU Logo Black SVG',
      format: 'svg',
      category: 'branding',
      description: 'NLU university logo in black color, scalable SVG format'
    } as ImageAsset,
    
    TSM_PNG: {
      path: '/assets/imgs/tsm logo.png',
      alt: 'TSM Logo PNG',
      format: 'png',
      category: 'branding',
      description: 'TSM (Tuyển Sinh Mới) logo in PNG format'
    } as ImageAsset,
    
    TSM_SVG: {
      path: '/assets/imgs/tsm logo.svg',
      alt: 'TSM Logo SVG', 
      format: 'svg',
      category: 'branding',
      description: 'TSM (Tuyển Sinh Mới) logo in scalable SVG format'
    } as ImageAsset,

    // Hero section seal logo
    NLU_SEAL: {
      path: '/assets/imgs/nlu-seal.svg',
      alt: 'NLU University Seal',
      format: 'svg',
      category: 'branding',
      description: 'NLU university official seal for hero section background'
    } as ImageAsset
  },
  
  // Service icons - Fallback images for service cards
  SERVICE_ICONS: {
    SEARCH: {
      path: '/images/icons/search.svg',
      alt: 'Search service icon',
      format: 'svg',
      category: 'service',
      description: 'Search icon for admission lookup service'
    } as ImageAsset,
    
    DOCUMENT: {
      path: '/images/icons/document.svg',
      alt: 'Document management icon',
      format: 'svg',
      category: 'service',
      description: 'Document icon for student profile management service'
    } as ImageAsset,
    
    GLOBE: {
      path: '/images/icons/globe.svg', 
      alt: 'Language certificate icon',
      format: 'svg',
      category: 'service',
      description: 'Globe icon for English certificate service'
    } as ImageAsset,
    
    CHART: {
      path: '/images/icons/chart.svg',
      alt: 'Prediction chart icon',
      format: 'svg',
      category: 'service',
      description: 'Chart icon for admission prediction service'
    } as ImageAsset,
    
    BOOK: {
      path: '/images/icons/book.svg',
      alt: 'Handbook icon',
      format: 'svg',
      category: 'service',
      description: 'Book icon for admission handbook service'
    } as ImageAsset,
    
    CHATBOT: {
      path: '/images/icons/chatbot.svg',
      alt: 'Chatbot service icon', 
      format: 'svg',
      category: 'service',
      description: 'Chatbot icon for online consultation service'
    } as ImageAsset
  },

  // News placeholder images - Generated gradient backgrounds
  NEWS_PLACEHOLDERS: {
    GRADIENT_GREEN: {
      path: '/images/news/gradient-green.svg',
      alt: 'News placeholder with green gradient',
      format: 'svg',
      category: 'news',
      description: 'Green gradient background for news cards'
    } as ImageAsset,
    
    GRADIENT_BLUE: {
      path: '/images/news/gradient-blue.svg', 
      alt: 'News placeholder with blue gradient',
      format: 'svg',
      category: 'news',
      description: 'Blue gradient background for news cards'
    } as ImageAsset,
    
    GRADIENT_PURPLE: {
      path: '/images/news/gradient-purple.svg',
      alt: 'News placeholder with purple gradient',
      format: 'svg',
      category: 'news',
      description: 'Purple gradient background for news cards'
    } as ImageAsset,

    GRADIENT_ORANGE: {
      path: '/images/news/gradient-orange.svg',
      alt: 'News placeholder with orange gradient',
      format: 'svg',
      category: 'news',
      description: 'Orange gradient background for news cards'
    } as ImageAsset,

    GRADIENT_TEAL: {
      path: '/images/news/gradient-teal.svg',
      alt: 'News placeholder with teal gradient',
      format: 'svg',
      category: 'news',
      description: 'Teal gradient background for news cards'
    } as ImageAsset,

    GRADIENT_PINK: {
      path: '/images/news/gradient-pink.svg',
      alt: 'News placeholder with pink gradient',
      format: 'svg',
      category: 'news',
      description: 'Pink gradient background for news cards'
    } as ImageAsset
  },

  // UI elements - General interface images
  UI_ELEMENTS: {
    HERO_PATTERN: {
      path: '/images/ui/hero-pattern.svg',
      alt: 'Hero section background pattern',
      format: 'svg',
      category: 'ui',
      description: 'Subtle pattern overlay for hero section background'
    } as ImageAsset,

    LOADING_SPINNER: {
      path: '/images/ui/loading-spinner.svg',
      alt: 'Loading spinner animation',
      format: 'svg',
      category: 'ui',
      description: 'Animated loading spinner for async operations'
    } as ImageAsset,

    ERROR_ILLUSTRATION: {
      path: '/images/ui/error-illustration.svg',
      alt: 'Error state illustration',
      format: 'svg',
      category: 'ui',
      description: 'Friendly illustration for error states'
    } as ImageAsset,

    EMPTY_STATE: {
      path: '/images/ui/empty-state.svg',
      alt: 'Empty state illustration',
      format: 'svg',
      category: 'ui',
      description: 'Illustration for empty content states'
    } as ImageAsset
  }
} as const;

// News emoji mappings for placeholder images
export const NEWS_EMOJIS = {
  ADMISSION: '📋',
  SCHEDULE: '📅', 
  CONSULTATION: '🎓',
  ANNOUNCEMENT: '📢',
  EVENT: '🎉',
  DEADLINE: '⏰',
  HANDBOOK: '📖',
  CERTIFICATE: '🏆',
  REGISTRATION: '✍️',
  RESULTS: '📊'
} as const;

// Gradient classes for news images - matches CSS classes
export const NEWS_GRADIENTS = {
  GREEN: 'gradient-green',
  BLUE: 'gradient-blue', 
  PURPLE: 'gradient-purple',
  ORANGE: 'gradient-orange',
  TEAL: 'gradient-teal',
  PINK: 'gradient-pink'
} as const;

// Image category mappings for easy reference
export const IMAGE_CATEGORIES = {
  BRANDING: 'BRANDING',
  SERVICE_ICONS: 'SERVICE_ICONS',
  NEWS_PLACEHOLDERS: 'NEWS_PLACEHOLDERS',
  UI_ELEMENTS: 'UI_ELEMENTS'
} as const;

// Service icon mappings to match service types
export const SERVICE_IMAGE_MAP = {
  search: 'SEARCH',
  document: 'DOCUMENT',
  globe: 'GLOBE', 
  chart: 'CHART',
  book: 'BOOK',
  chatbot: 'CHATBOT'
} as const;

// Logo usage mappings
export const LOGO_USAGE = {
  HEADER_LIGHT: 'NLU_BLACK_SVG',    // For light backgrounds
  HEADER_DARK: 'NLU_WHITE_SVG',     // For dark backgrounds
  FOOTER: 'NLU_WHITE_SVG',          // Footer always uses white
  HERO_SEAL: 'NLU_SEAL',            // Hero section background
  FAVICON: 'NLU_BLACK_PNG'          // Browser favicon
} as const;

// Type definitions
export type ImageCategory = keyof typeof IMAGES;
export type NewsEmoji = typeof NEWS_EMOJIS[keyof typeof NEWS_EMOJIS];
export type NewsGradient = typeof NEWS_GRADIENTS[keyof typeof NEWS_GRADIENTS];
export type ServiceImageKey = keyof typeof SERVICE_IMAGE_MAP;
export type LogoUsage = keyof typeof LOGO_USAGE;

// Utility functions
export const getImageAsset = (category: ImageCategory, name: string): ImageAsset | undefined => {
  const categoryImages = IMAGES[category] as Record<string, ImageAsset>;
  return categoryImages[name];
};

export const getBrandingImage = (logoKey: string): ImageAsset | undefined => {
  return getImageAsset('BRANDING', logoKey);
};

export const getServiceIcon = (serviceName: keyof typeof SERVICE_ICONS): IconDefinition => 
  ICONS[SERVICE_ICONS[serviceName]];

export const getServiceIconImage = (serviceType: ServiceImageKey): ImageAsset | undefined => {
  const iconKey = SERVICE_IMAGE_MAP[serviceType];
  return getImageAsset('SERVICE_ICONS', iconKey);
};

export const getNewsPlaceholder = (gradientType: keyof typeof NEWS_GRADIENTS): ImageAsset | undefined => {
  const placeholderKey = `GRADIENT_${gradientType}`;
  return getImageAsset('NEWS_PLACEHOLDERS', placeholderKey);
};

export const getLogoForUsage = (usage: LogoUsage): ImageAsset | undefined => {
  const logoKey = LOGO_USAGE[usage];
  return getBrandingImage(logoKey);
};

export const getRandomNewsEmoji = (): NewsEmoji => {
  const emojis = Object.values(NEWS_EMOJIS);
  return emojis[Math.floor(Math.random() * emojis.length)];
};

export const getRandomNewsGradient = (): NewsGradient => {
  const gradients = Object.values(NEWS_GRADIENTS);
  return gradients[Math.floor(Math.random() * gradients.length)];
};

export const getImagesByCategory = (category: keyof typeof IMAGES): ImageAsset[] => {
  return Object.values(IMAGES[category]);
};

export const createImageProps = (imageAsset: ImageAsset) => {
  return {
    src: imageAsset.path,
    alt: imageAsset.alt,
    width: imageAsset.width,
    height: imageAsset.height,
    'aria-describedby': imageAsset.description
  };
};

// Responsive image utilities
export const getResponsiveImageSizes = (breakpoints: string[] = ['640px', '768px', '1024px']) => {
  return breakpoints.map((bp, index) => {
    if (index === breakpoints.length - 1) return `${bp}`;
    return `(max-width: ${bp}) ${Math.floor(100 / (index + 1))}vw`;
  }).join(', ');
};

// Image optimization helpers
export const getOptimizedImagePath = (originalPath: string, width?: number, quality?: number): string => {
  if (!width && !quality) return originalPath;
  
  const url = new URL(originalPath, 'https://example.com');
  if (width) url.searchParams.set('w', width.toString());
  if (quality) url.searchParams.set('q', quality.toString());
  
  return url.pathname + url.search;
};