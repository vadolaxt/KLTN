/**
 * Icon definitions with type safety
 * SVG icons used throughout the homepage system
 * Organized by usage categories for better maintainability
 */

export interface IconDefinition {
  name: string;
  viewBox: string;
  path: string;
  category: 'service' | 'navigation' | 'contact' | 'social' | 'ui';
  description: string;
}

export const ICONS: Record<string, IconDefinition> = {
  // Service icons - Used in services section
  SEARCH: {
    name: 'search',
    viewBox: '0 0 24 24',
    path: 'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
    category: 'service',
    description: 'Search icon for admission lookup service'
  },
  
  DOCUMENT: {
    name: 'document',
    viewBox: '0 0 24 24',
    path: 'M20 6h-2.18c.07-.44.18-.88.18-1.25C18 3.35 16.65 2 15 2c-.95 0-1.78.41-2.37 1.03L12 3.7l-.63-.67C10.78 2.41 9.95 2 9 2 7.35 2 6 3.35 6 5c0 .37.11.81.18 1.25H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z',
    category: 'service',
    description: 'Document icon for student profile management service'
  },
  
  GLOBE: {
    name: 'globe',
    viewBox: '0 0 24 24',
    path: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z',
    category: 'service',
    description: 'Globe icon for English certificate service'
  },
  
  CHART: {
    name: 'chart',
    viewBox: '0 0 24 24',
    path: 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z',
    category: 'service',
    description: 'Chart icon for admission prediction service'
  },
  
  BOOK: {
    name: 'book',
    viewBox: '0 0 24 24',
    path: 'M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z',
    category: 'service',
    description: 'Book icon for admission handbook service'
  },
  
  CHAT: {
    name: 'chat',
    viewBox: '0 0 24 24',
    path: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z',
    category: 'service',
    description: 'Chat icon for online consultation chatbot service'
  },
  
  // Contact icons - Used in top bar and footer
  LOCATION: {
    name: 'location',
    viewBox: '0 0 24 24',
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    category: 'contact',
    description: 'Location pin icon for university address'
  },
  
  PHONE: {
    name: 'phone',
    viewBox: '0 0 24 24',
    path: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
    category: 'contact',
    description: 'Phone icon for university contact number'
  },

  EMAIL: {
    name: 'email',
    viewBox: '0 0 24 24',
    path: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
    category: 'contact',
    description: 'Email icon for university contact email'
  },

  // Navigation icons - Used in menus and navigation
  MENU: {
    name: 'menu',
    viewBox: '0 0 24 24',
    path: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
    category: 'navigation',
    description: 'Hamburger menu icon for mobile navigation'
  },

  CLOSE: {
    name: 'close',
    viewBox: '0 0 24 24',
    path: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    category: 'navigation',
    description: 'Close icon for closing modals and menus'
  },

  ARROW_RIGHT: {
    name: 'arrow-right',
    viewBox: '0 0 24 24',
    path: 'M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z',
    category: 'navigation',
    description: 'Right arrow icon for navigation and CTAs'
  },

  ARROW_DOWN: {
    name: 'arrow-down',
    viewBox: '0 0 24 24',
    path: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z',
    category: 'navigation',
    description: 'Down arrow icon for dropdown menus'
  },

  // UI icons - General interface elements
  STAR: {
    name: 'star',
    viewBox: '0 0 24 24',
    path: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
    category: 'ui',
    description: 'Star icon for ratings and highlights'
  },

  CALENDAR: {
    name: 'calendar',
    viewBox: '0 0 24 24',
    path: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z',
    category: 'ui',
    description: 'Calendar icon for dates and schedules'
  },

  CLOCK: {
    name: 'clock',
    viewBox: '0 0 24 24',
    path: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
    category: 'ui',
    description: 'Clock icon for time and deadlines'
  },

  // Social icons - For social media links
  FACEBOOK: {
    name: 'facebook',
    viewBox: '0 0 24 24',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    category: 'social',
    description: 'Facebook icon for social media link'
  },

  YOUTUBE: {
    name: 'youtube',
    viewBox: '0 0 24 24',
    path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    category: 'social',
    description: 'YouTube icon for video content link'
  }
} as const;

// Icon categories for easier filtering
export const ICON_CATEGORIES = {
  SERVICE: 'service',
  NAVIGATION: 'navigation', 
  CONTACT: 'contact',
  SOCIAL: 'social',
  UI: 'ui'
} as const;

// Service icon mappings for easy reference
export const SERVICE_ICONS = {
  SEARCH: 'SEARCH',
  DOCUMENT: 'DOCUMENT', 
  GLOBE: 'GLOBE',
  CHART: 'CHART',
  BOOK: 'BOOK',
  CHATBOT: 'CHAT'
} as const;

// Contact icon mappings
export const CONTACT_ICONS = {
  LOCATION: 'LOCATION',
  PHONE: 'PHONE',
  EMAIL: 'EMAIL'
} as const;

// Navigation icon mappings
export const NAVIGATION_ICONS = {
  MENU: 'MENU',
  CLOSE: 'CLOSE',
  ARROW_RIGHT: 'ARROW_RIGHT',
  ARROW_DOWN: 'ARROW_DOWN'
} as const;

// Type definitions
export type IconName = keyof typeof ICONS;
export type IconCategory = typeof ICON_CATEGORIES[keyof typeof ICON_CATEGORIES];
export type ServiceIconName = typeof SERVICE_ICONS[keyof typeof SERVICE_ICONS];
export type ContactIconName = typeof CONTACT_ICONS[keyof typeof CONTACT_ICONS];
export type NavigationIconName = typeof NAVIGATION_ICONS[keyof typeof NAVIGATION_ICONS];

// Utility functions
export const getIcon = (name: IconName): IconDefinition => ICONS[name];

export const getIconsByCategory = (category: IconCategory): IconDefinition[] => 
  Object.values(ICONS).filter(icon => icon.category === category);

export const isValidIconName = (name: string): name is IconName => 
  name in ICONS;

export const getServiceIcon = (serviceName: keyof typeof SERVICE_ICONS): IconDefinition => 
  ICONS[SERVICE_ICONS[serviceName]];

export const getContactIcon = (contactType: keyof typeof CONTACT_ICONS): IconDefinition => 
  ICONS[CONTACT_ICONS[contactType]];

export const getNavigationIcon = (navType: keyof typeof NAVIGATION_ICONS): IconDefinition => 
  ICONS[NAVIGATION_ICONS[navType]];

// Icon component helper for React usage
export const createIconProps = (iconName: IconName) => {
  const icon = getIcon(iconName);
  return {
    viewBox: icon.viewBox,
    'aria-label': icon.description,
    role: 'img'
  };
};