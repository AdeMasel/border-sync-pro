// Theme System for Border Sync Pro
// Dark, Light, and Custom DAW-style themes

export const themes = {
  dark: {
    name: 'Dark Studio',
    colors: {
      background: '#0a0a0f',
      surface: '#1a1a24',
      surfaceHover: '#252535',
      border: '#333344',
      text: '#e8e8f0',
      textMuted: '#888899',
      primary: '#6366f1',
      primaryHover: '#818cf8',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      waveform: '#6366f1',
      timeline: '#1f1f2e',
      scrollbar: '#2a2a3a',
      glass: 'rgba(26, 26, 36, 0.7)',
      glow: 'rgba(99, 102, 241, 0.15)'
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.5)',
      md: '0 4px 6px rgba(0, 0, 0, 0.6)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.7)',
      glow: '0 0 20px rgba(99, 102, 241, 0.3)'
    }
  },

  light: {
    name: 'Light Studio',
    colors: {
      background: '#f5f5f7',
      surface: '#ffffff',
      surfaceHover: '#f0f0f2',
      border: '#d1d1d6',
      text: '#1a1a1f',
      textMuted: '#6e6e73',
      primary: '#5856d6',
      primaryHover: '#4745c7',
      success: '#34c759',
      warning: '#ff9500',
      danger: '#ff3b30',
      waveform: '#5856d6',
      timeline: '#e5e5ea',
      scrollbar: '#c7c7cc',
      glass: 'rgba(255, 255, 255, 0.8)',
      glow: 'rgba(88, 86, 214, 0.1)'
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.08)',
      md: '0 4px 6px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.12)',
      glow: '0 0 20px rgba(88, 86, 214, 0.15)'
    }
  },

  midnight: {
    name: 'Midnight Blue',
    colors: {
      background: '#0c0e1a',
      surface: '#151829',
      surfaceHover: '#1d2138',
      border: '#2a2f4a',
      text: '#d4d7e8',
      textMuted: '#7a7f99',
      primary: '#3b82f6',
      primaryHover: '#60a5fa',
      success: '#06b6d4',
      warning: '#fbbf24',
      danger: '#f87171',
      waveform: '#3b82f6',
      timeline: '#1a1d2e',
      scrollbar: '#252a40',
      glass: 'rgba(21, 24, 41, 0.75)',
      glow: 'rgba(59, 130, 246, 0.2)'
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.6)',
      md: '0 4px 6px rgba(0, 0, 0, 0.7)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.8)',
      glow: '0 0 25px rgba(59, 130, 246, 0.25)'
    }
  },

  synthwave: {
    name: 'Synthwave',
    colors: {
      background: '#1a0a1f',
      surface: '#2a1a3a',
      surfaceHover: '#3a2550',
      border: '#4a3560',
      text: '#f0d0ff',
      textMuted: '#9080b0',
      primary: '#ff00ff',
      primaryHover: '#ff3dff',
      success: '#00ffff',
      warning: '#ffff00',
      danger: '#ff0080',
      waveform: '#ff00ff',
      timeline: '#251530',
      scrollbar: '#3a2550',
      glass: 'rgba(42, 26, 58, 0.8)',
      glow: 'rgba(255, 0, 255, 0.25)'
    },
    shadows: {
      sm: '0 1px 2px rgba(255, 0, 255, 0.3)',
      md: '0 4px 6px rgba(255, 0, 255, 0.4)',
      lg: '0 10px 15px rgba(255, 0, 255, 0.5)',
      glow: '0 0 30px rgba(255, 0, 255, 0.4)'
    }
  }
};

// Apply theme to document
export const applyTheme = (themeName) => {
  const theme = themes[themeName] || themes.dark;
  const root = document.documentElement;
  
  // Apply color variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  
  // Apply shadow variables
  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });
  
  // Save preference
  localStorage.setItem('borderSyncTheme', themeName);
};

// Load saved theme
export const loadSavedTheme = () => {
  const saved = localStorage.getItem('borderSyncTheme') || 'dark';
  applyTheme(saved);
  return saved;
};

// Get all theme names
export const getThemeNames = () => Object.keys(themes);

// Get current theme
export const getCurrentTheme = () => {
  return localStorage.getItem('borderSyncTheme') || 'dark';
};
