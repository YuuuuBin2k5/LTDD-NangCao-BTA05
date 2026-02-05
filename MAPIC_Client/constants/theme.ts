/**
 * Theme Constants - Doraemon Inspired Design System
 * Modern, sophisticated design with space-themed aesthetics
 */

// Doraemon Space Theme Color Palette
export const colors = {
  // Primary Brand Colors (Doraemon Theme)
  primary: '#3A86FF',        // Doraemon Blue - Main brand color
  background: '#0B2545',     // Deep Space Blue - Dark mode background
  action: '#FF0022',         // Red Bow - Call-to-action buttons
  accent: '#FFD60A',         // Yellow Bell - Highlights and stars
  sub: '#8338EC',           // Purple Notes - Gradients and hover effects
  light: '#EEF4ED',         // Cloud White - Text and card backgrounds
  
  // Legacy Doraemon Colors (for backward compatibility)
  cream: '#FFF8E7',
  matchaGreen: '#B8D4A8',
  babyBlue: '#A8D8EA',
  lightLavender: '#E8D5F2',
  doraemonBlue: '#3A86FF',
  doraemonRed: '#FF0022',
  doraemonYellow: '#FFD60A',
  doraemonWhite: '#FFFFFF',
  lightBlue: '#E3F2FD',
  
  // Gradient Colors
  gradient: {
    space: ['#0B2545', '#3A86FF'],      // Deep space to bright blue
    cosmic: ['#8338EC', '#3A86FF'],     // Purple to blue
    sunset: ['#FF0022', '#FFD60A'],     // Red to yellow
    aurora: ['#3A86FF', '#8338EC', '#FFD60A'], // Multi-color aurora
  },
  
  // Page-specific Background Colors (Creative blends)
  pageBackground: {
    // Home/Map: Deep ocean blue with cosmic purple hints
    home: '#0D2B52',        // Blend: 80% #0B2545 + 20% #8338EC
    
    // Chat: Warm twilight purple with blue undertones  
    chat: '#4A2B7A',        // Blend: 60% #8338EC + 30% #0B2545 + 10% #3A86FF
    
    // Friends: Vibrant cosmic blue with purple energy
    friends: '#2A5B9E',     // Blend: 50% #3A86FF + 40% #0B2545 + 10% #8338EC
    
    // Settings: Rich midnight blue with purple mystique
    settings: '#1A3A6B',    // Blend: 60% #0B2545 + 30% #3A86FF + 10% #8338EC
    
    // Profile/Edit: Elegant deep purple with blue sophistication
    profile: '#3B2668',     // Blend: 70% #8338EC + 20% #0B2545 + 10% #3A86FF
    
    // Auth screens: Serene deep blue with subtle purple
    auth: '#0F2E5A',        // Blend: 75% #0B2545 + 20% #3A86FF + 5% #8338EC
  },
  
  // Glassmorphism Colors
  glass: {
    light: 'rgba(238, 244, 237, 0.2)',   // Light glass with 20% opacity
    medium: 'rgba(238, 244, 237, 0.3)',  // Medium glass with 30% opacity
    dark: 'rgba(11, 37, 69, 0.5)',       // Dark glass with 50% opacity
    blur: 'rgba(255, 255, 255, 0.1)',    // Subtle blur effect
  },
  
  // Creative Card/Section Backgrounds (Glassmorphism with color tints)
  cardBackground: {
    // Frosted blue glass - Cool and modern
    frostedBlue: 'rgba(58, 134, 255, 0.15)',      // Primary blue tint
    
    // Mystic purple glass - Elegant and mysterious
    mysticPurple: 'rgba(131, 56, 236, 0.18)',     // Purple tint
    
    // Cosmic blend - Multi-dimensional
    cosmicBlend: 'rgba(88, 95, 200, 0.2)',        // Blue + Purple blend
    
    // Aurora glow - Vibrant and energetic
    auroraGlow: 'rgba(100, 120, 255, 0.22)',      // Bright blue-purple
    
    // Deep space - Sophisticated and deep
    deepSpace: 'rgba(20, 50, 90, 0.4)',           // Dark blue tint
    
    // Twilight mist - Soft and dreamy
    twilightMist: 'rgba(70, 80, 150, 0.25)',      // Muted blue-purple
    
    // Nebula cloud - Ethereal and floating
    nebulaCloud: 'rgba(110, 90, 180, 0.2)',       // Purple-blue cloud
    
    // Starlight - Bright and shimmering
    starlight: 'rgba(150, 170, 255, 0.18)',       // Light blue shimmer
  },
  
  // Card Border Colors (Subtle glows)
  cardBorder: {
    blue: 'rgba(58, 134, 255, 0.3)',
    purple: 'rgba(131, 56, 236, 0.3)',
    white: 'rgba(255, 255, 255, 0.2)',
    gold: 'rgba(255, 214, 10, 0.3)',
  },
  
  // Functional Colors
  success: '#4CAF50',
  warning: '#FFD60A',
  error: '#FF0022',
  info: '#3A86FF',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  
  // Gray Scale
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Opacity variants
  opacity: {
    glass: 'rgba(255, 255, 255, 0.7)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  }
};

// Typography - Modern Sans-serif
export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System-Medium',
    bold: 'System-Bold',
    semibold: 'System-Semibold',
    // Recommended: Montserrat or Quicksand for production
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  }
};

// Spacing Scale (based on 4px grid)
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
};

// Border Radius - Rounded corners for friendly feel
export const borderRadius = {
  none: 0,
  sm: 8,      // Increased for more rounded feel
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

// Shadows - Enhanced for depth
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  
  // Glow effect for accent elements
  glow: {
    shadowColor: '#3A86FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
};

// Glassmorphism Effect - Modern frosted glass look
export const glassmorphism = {
  light: {
    backgroundColor: colors.glass.light,
    borderRadius: borderRadius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...shadows.md,
    // Note: Use BlurView component for actual blur effect
  },
  
  medium: {
    backgroundColor: colors.glass.medium,
    borderRadius: borderRadius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...shadows.lg,
  },
  
  dark: {
    backgroundColor: colors.glass.dark,
    borderRadius: borderRadius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...shadows.xl,
  },
};

// Animation Durations (in milliseconds)
export const animation = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 1000,
};

// Animation Easing
export const easing = {
  linear: 'linear',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
};

// Z-Index Layers
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
};

// Breakpoints (for responsive design)
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

// Icon Sizes - Rounded style
export const iconSize = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
  '2xl': 48,
};

// Avatar Sizes - Circular
export const avatarSize = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  '2xl': 80,
};

// Button Heights - Rounded
export const buttonHeight = {
  sm: 36,
  md: 44,
  lg: 52,
  xl: 60,
};

// Map Specific Constants
export const mapTheme = {
  defaultZoom: 15,
  minZoom: 3,
  maxZoom: 20,
  cameraTilt: 12,
  clusterThreshold: 10,
};

// Export default theme object
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  glassmorphism,
  animation,
  easing,
  zIndex,
  breakpoints,
  iconSize,
  avatarSize,
  buttonHeight,
  mapTheme,
};

export default theme;

