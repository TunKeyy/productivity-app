import { useColorScheme } from 'react-native';

export const colors = {
  primary: '#7C3AED', // Purple
  secondary: '#60A5FA', // Blue
  accent: {
    light: '#F2F1F9',
    dark: '#2D2B42'
  },
  background: {
    light: {
      default: '#FFFFFF',
      secondary: '#F3F4F6',
    },
    dark: {
      default: '#1F2937',
      secondary: '#374151',
    }
  },
  text: {
    light: {
      primary: '#1F2937',
      secondary: '#6B7280',
      light: '#9CA3AF',
    },
    dark: {
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
      light: '#9CA3AF',
    }
  },
  border: {
    light: '#E5E7EB',
    dark: '#374151',
  },
  success: {
    light: '#4CAF50',
    dark: '#2E7D32'
  },
  error: {
    light: '#F44336',
    dark: '#C62828'
  },
  warning: {
    light: '#FFC107',
    dark: '#F57F17'
  },
  info: {
    light: '#2196F3',
    dark: '#1565C0'
  }
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
}; 