// ============================================================================
// COLOR PALETTE INTERFACES
// ============================================================================

export interface ColorPalette {
  readonly PRIMARY: PrimaryColors;
  readonly SECONDARY: SecondaryColors;
  readonly NEUTRAL: NeutralColors;
  readonly TEXT: TextColors;
  readonly BACKGROUND: BackgroundColors;
  readonly SEMANTIC: SemanticColors;
  readonly COMPONENT: ComponentColors;
}

export interface PrimaryColors {
  readonly DARK: string;      // Main dark green for navigation, footer
  readonly MAIN: string;      // Primary green for buttons, highlights
  readonly LIGHT: string;     // Light green for hover states
  readonly PALE: string;      // Very light green for backgrounds
}

export interface SecondaryColors {
  readonly GOLD: string;      // Primary gold accent
  readonly GOLD_LIGHT: string; // Light gold for hover effects
}

export interface NeutralColors {
  readonly WHITE: string;     // Pure white
  readonly GRAY_LIGHT: string; // Light gray backgrounds
  readonly GRAY_MID: string;  // Medium gray borders
  readonly BLACK: string;     // Pure black
}

export interface TextColors {
  readonly PRIMARY: string;   // Primary text color
  readonly SECONDARY: string; // Secondary text color
  readonly TERTIARY: string;  // Tertiary/muted text color
  readonly INVERSE: string;   // White text for dark backgrounds
}

export interface BackgroundColors {
  readonly PRIMARY: string;   // Main background (white)
  readonly SECONDARY: string; // Light gray section backgrounds
  readonly DARK: string;      // Dark backgrounds (navigation, footer)
  readonly GRADIENT_HERO: string; // Hero section gradient
}

export interface SemanticColors {
  readonly SUCCESS: string;   // Success states
  readonly WARNING: string;   // Warning states
  readonly ERROR: string;     // Error states
  readonly INFO: string;      // Info states
}

export interface ComponentColors {
  readonly TOPBAR: TopBarColors;
  readonly HEADER: HeaderColors;
  readonly NAVIGATION: NavigationColors;
  readonly HERO: HeroColors;
  readonly STATS: StatsColors;
  readonly SERVICES: ServicesColors;
  readonly NEWS: NewsColors;
  readonly FOOTER: FooterColors;
}

// Component-specific color interfaces
export interface TopBarColors {
  readonly BACKGROUND: string;
  readonly TEXT: string;
  readonly ICON: string;
  readonly LINK_HOVER: string;
}

export interface HeaderColors {
  readonly BACKGROUND: string;
  readonly BORDER: string;
  readonly SHADOW: string;
}

export interface NavigationColors {
  readonly BACKGROUND: string;
  readonly TEXT: string;
  readonly TEXT_HOVER: string;
  readonly ACTIVE_BORDER: string;
  readonly HOVER_BACKGROUND: string;
}

export interface HeroColors {
  readonly GRADIENT_START: string;
  readonly GRADIENT_MID: string;
  readonly GRADIENT_END: string;
  readonly TEXT_PRIMARY: string;
  readonly TEXT_SECONDARY: string;
  readonly ACCENT: string;
  readonly SEAL_OPACITY: string;
}

export interface StatsColors {
  readonly BACKGROUND: string;
  readonly BORDER: string;
  readonly NUMBER: string;
  readonly LABEL: string;
  readonly HOVER_BACKGROUND: string;
}

export interface ServicesColors {
  readonly CARD_BACKGROUND: string;
  readonly CARD_BORDER: string;
  readonly CARD_HOVER_SHADOW: string;
  readonly ICON_BACKGROUND: string;
  readonly CHATBOT_GRADIENT_START: string;
  readonly CHATBOT_GRADIENT_END: string;
}

export interface NewsColors {
  readonly SECTION_BACKGROUND: string;
  readonly CARD_BACKGROUND: string;
  readonly CARD_SHADOW: string;
  readonly TAG_BACKGROUND: string;
  readonly TAG_TEXT: string;
  readonly GRADIENT_1: string;
  readonly GRADIENT_2: string;
  readonly GRADIENT_3: string;
}

export interface FooterColors {
  readonly BACKGROUND: string;
  readonly TEXT: string;
  readonly LINK: string;
  readonly LINK_HOVER: string;
  readonly MUTED: string;
  readonly BORDER: string;
}

// ============================================================================
// COLOR PALETTE IMPLEMENTATION
// ============================================================================

export const COLORS: ColorPalette = {
  // Primary green palette - university branding colors
  PRIMARY: {
    DARK: '#1a4a1a',      // --green-dark: Navigation, footer, dark elements
    MAIN: '#2d7a2d',      // --green-main: Primary buttons, highlights
    LIGHT: '#4caf50',     // --green-light: Hover states, light accents
    PALE: '#e8f5e9'       // --green-pale: Light backgrounds, subtle highlights
  },
  
  // Secondary accent colors
  SECONDARY: {
    GOLD: '#c9a227',      // --gold: Primary gold accent
    GOLD_LIGHT: '#f0c040' // --gold-light: Light gold for hover effects
  },
  
  // Neutral colors
  NEUTRAL: {
    WHITE: '#ffffff',     // --white: Pure white
    GRAY_LIGHT: '#f5f5f5', // --gray-light: Light gray backgrounds
    GRAY_MID: '#e0e0e0',  // --gray-mid: Medium gray borders
    BLACK: '#000000'      // Pure black
  },
  
  // Text colors organized by hierarchy
  TEXT: {
    PRIMARY: '#1a1a1a',   // --text-dark: Primary text
    SECONDARY: '#444444', // --text-mid: Secondary text
    TERTIARY: '#777777',  // --text-light: Tertiary text
    INVERSE: '#ffffff'    // White text for dark backgrounds
  },
  
  // Background colors by usage
  BACKGROUND: {
    PRIMARY: '#ffffff',   // Main background
    SECONDARY: '#f5f5f5', // Section backgrounds
    DARK: '#1a4a1a',      // Dark backgrounds
    GRADIENT_HERO: 'linear-gradient(135deg, #0d2b0d 0%, #1e5c1e 40%, #2d7a2d 70%, #1a4a1a 100%)'
  },
  
  // Semantic colors for states
  SEMANTIC: {
    SUCCESS: '#4caf50',   // Success states
    WARNING: '#f0c040',   // Warning states  
    ERROR: '#f44336',     // Error states
    INFO: '#2196f3'       // Info states
  },
  
  // Component-specific colors
  COMPONENT: {
    TOPBAR: {
      BACKGROUND: '#1a3a1a',
      TEXT: '#cde8cd',
      ICON: '#8bc88b',
      LINK_HOVER: '#f0c040'
    },
    
    HEADER: {
      BACKGROUND: '#ffffff',
      BORDER: '#e0e0e0',
      SHADOW: 'rgba(0,0,0,0.07)'
    },
    
    NAVIGATION: {
      BACKGROUND: '#1a4a1a',
      TEXT: '#e0f0e0',
      TEXT_HOVER: '#ffffff',
      ACTIVE_BORDER: '#c9a227',
      HOVER_BACKGROUND: '#2d7a2d'
    },
    
    HERO: {
      GRADIENT_START: '#0d2b0d',
      GRADIENT_MID: '#1e5c1e',
      GRADIENT_END: '#1a4a1a',
      TEXT_PRIMARY: '#ffffff',
      TEXT_SECONDARY: 'rgba(255,255,255,0.85)',
      ACCENT: '#f0c040',
      SEAL_OPACITY: 'rgba(255,255,255,0.18)'
    },
    
    STATS: {
      BACKGROUND: '#ffffff',
      BORDER: '#e0e0e0',
      NUMBER: '#2d7a2d',
      LABEL: '#444444',
      HOVER_BACKGROUND: '#e8f5e9'
    },
    
    SERVICES: {
      CARD_BACKGROUND: '#ffffff',
      CARD_BORDER: '#e0e0e0',
      CARD_HOVER_SHADOW: 'rgba(45,122,45,0.15)',
      ICON_BACKGROUND: '#e8f5e9',
      CHATBOT_GRADIENT_START: '#1a4a1a',
      CHATBOT_GRADIENT_END: '#2d7a2d'
    },
    
    NEWS: {
      SECTION_BACKGROUND: '#f5f5f5',
      CARD_BACKGROUND: '#ffffff',
      CARD_SHADOW: 'rgba(0,0,0,0.07)',
      TAG_BACKGROUND: '#e8f5e9',
      TAG_TEXT: '#2d7a2d',
      GRADIENT_1: 'linear-gradient(135deg, #1e5c1e, #2d7a2d)',
      GRADIENT_2: 'linear-gradient(135deg, #1a3a6a, #2d5a9a)',
      GRADIENT_3: 'linear-gradient(135deg, #3a1a5c, #5a2d8a)'
    },
    
    FOOTER: {
      BACKGROUND: '#1a4a1a',
      TEXT: '#a8d8a8',
      LINK: '#8bc88b',
      LINK_HOVER: '#f0c040',
      MUTED: '#5a8a5a',
      BORDER: 'rgba(255,255,255,0.1)'
    }
  }
} as const;

// ============================================================================
// DESIGN TOKENS
// ============================================================================

/**
 * Design tokens for consistent theming across the application
 * Maps semantic color names to actual color values
 */
export const DESIGN_TOKENS = {
  // CSS Custom Properties mapping for easy integration
  CSS_VARIABLES: {
    // Primary colors
    '--color-primary-dark': COLORS.PRIMARY.DARK,
    '--color-primary-main': COLORS.PRIMARY.MAIN,
    '--color-primary-light': COLORS.PRIMARY.LIGHT,
    '--color-primary-pale': COLORS.PRIMARY.PALE,
    
    // Secondary colors
    '--color-secondary-gold': COLORS.SECONDARY.GOLD,
    '--color-secondary-gold-light': COLORS.SECONDARY.GOLD_LIGHT,
    
    // Neutral colors
    '--color-neutral-white': COLORS.NEUTRAL.WHITE,
    '--color-neutral-gray-light': COLORS.NEUTRAL.GRAY_LIGHT,
    '--color-neutral-gray-mid': COLORS.NEUTRAL.GRAY_MID,
    '--color-neutral-black': COLORS.NEUTRAL.BLACK,
    
    // Text colors
    '--color-text-primary': COLORS.TEXT.PRIMARY,
    '--color-text-secondary': COLORS.TEXT.SECONDARY,
    '--color-text-tertiary': COLORS.TEXT.TERTIARY,
    '--color-text-inverse': COLORS.TEXT.INVERSE,
    
    // Background colors
    '--color-bg-primary': COLORS.BACKGROUND.PRIMARY,
    '--color-bg-secondary': COLORS.BACKGROUND.SECONDARY,
    '--color-bg-dark': COLORS.BACKGROUND.DARK,
    '--color-bg-gradient-hero': COLORS.BACKGROUND.GRADIENT_HERO,
    
    // Semantic colors
    '--color-semantic-success': COLORS.SEMANTIC.SUCCESS,
    '--color-semantic-warning': COLORS.SEMANTIC.WARNING,
    '--color-semantic-error': COLORS.SEMANTIC.ERROR,
    '--color-semantic-info': COLORS.SEMANTIC.INFO
  },
  
  // Tailwind CSS color configuration
  TAILWIND_COLORS: {
    primary: {
      50: COLORS.PRIMARY.PALE,
      100: '#c8e6c9',
      200: '#a5d6a7',
      300: '#81c784',
      400: '#66bb6a',
      500: COLORS.PRIMARY.LIGHT,
      600: COLORS.PRIMARY.MAIN,
      700: '#388e3c',
      800: '#2e7d32',
      900: COLORS.PRIMARY.DARK,
      950: '#0d2b0d'
    },
    secondary: {
      500: COLORS.SECONDARY.GOLD,
      600: COLORS.SECONDARY.GOLD_LIGHT
    },
    neutral: {
      0: COLORS.NEUTRAL.WHITE,
      100: COLORS.NEUTRAL.GRAY_LIGHT,
      200: COLORS.NEUTRAL.GRAY_MID,
      900: COLORS.TEXT.PRIMARY,
      950: COLORS.NEUTRAL.BLACK
    }
  },
  
  // Component-specific token mappings
  COMPONENT_TOKENS: {
    topbar: COLORS.COMPONENT.TOPBAR,
    header: COLORS.COMPONENT.HEADER,
    navigation: COLORS.COMPONENT.NAVIGATION,
    hero: COLORS.COMPONENT.HERO,
    stats: COLORS.COMPONENT.STATS,
    services: COLORS.COMPONENT.SERVICES,
    news: COLORS.COMPONENT.NEWS,
    footer: COLORS.COMPONENT.FOOTER
  }
} as const;

// ============================================================================
// UTILITY TYPES AND FUNCTIONS
// ============================================================================

// Type for extracting color values
export type ColorValue = string;

// Type for color categories
export type ColorCategory = keyof typeof COLORS;

// Type for component color keys
export type ComponentColorKey = keyof typeof COLORS.COMPONENT;

/**
 * Utility function to get a color value by path
 * @param path - Dot notation path to color (e.g., 'PRIMARY.MAIN', 'COMPONENT.TOPBAR.BACKGROUND')
 * @returns Color value or undefined if path doesn't exist
 */
export function getColor(path: string): ColorValue | undefined {
  const keys = path.split('.');
  let current: any = COLORS;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  
  return typeof current === 'string' ? current : undefined;
}

/**
 * Utility function to generate CSS custom properties
 * @returns Object with CSS custom properties
 */
export function generateCSSVariables(): Record<string, string> {
  return DESIGN_TOKENS.CSS_VARIABLES;
}

/**
 * Utility function to get component colors
 * @param component - Component name
 * @returns Component color object or undefined
 */
export function getComponentColors(component: ComponentColorKey): any {
  return COLORS.COMPONENT[component];
}

// ============================================================================
// LEGACY SUPPORT (for backward compatibility)
// ============================================================================

/**
 * @deprecated Use COLORS.PRIMARY instead
 */
export const GREEN = COLORS.PRIMARY;

/**
 * @deprecated Use COLORS.SECONDARY instead  
 */
export const GOLD = COLORS.SECONDARY;

/**
 * @deprecated Use DESIGN_TOKENS.CSS_VARIABLES instead
 */
export const CSS_VARIABLES = DESIGN_TOKENS.CSS_VARIABLES;