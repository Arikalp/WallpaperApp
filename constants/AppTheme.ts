// Premium Color Palette - Minimalistic & Modern
export const AppColors = {
  primary: '#8B5CF6', // Purple accent
  primaryDark: '#7C3AED',
  primaryLight: '#A78BFA',
  
  background: '#FFFFFF',
  backgroundDark: '#000000',
  
  surface: '#F9FAFB',
  surfaceDark: '#111111',
  
  card: '#FFFFFF',
  cardDark: '#1A1A1A',
  
  text: '#111827',
  textDark: '#F9FAFB',
  
  textSecondary: '#6B7280',
  textSecondaryDark: '#9CA3AF',
  
  border: '#E5E7EB',
  borderDark: '#27272A',
  
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  
  // Glassmorphism
  glass: 'rgba(255, 255, 255, 0.1)',
  glassDark: 'rgba(0, 0, 0, 0.3)',
};

// Spacing System (8pt grid)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

// Border Radius
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

// Typography
export const Typography = {
  h1: { fontSize: 32, fontWeight: '900' as const, letterSpacing: -1 },
  h2: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.5 },
  h3: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  bodyBold: { fontSize: 16, fontWeight: '600' as const },
  caption: { fontSize: 14, fontWeight: '400' as const },
  small: { fontSize: 12, fontWeight: '400' as const },
};

// Shadows
export const Shadows = {
  small: {
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  medium: {
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  large: {
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
    elevation: 8,
  },
  purple: {
    boxShadow: '0px 4px 12px rgba(139, 92, 246, 0.3)',
    elevation: 6,
  },
};

// Animation Timing
export const Timing = {
  fast: 200,
  normal: 300,
  slow: 500,
};
