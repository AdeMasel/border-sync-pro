// Keyboard Shortcuts System for Border Sync Pro
// DAW-style keyboard shortcuts for efficient workflow

import { useEffect, useCallback } from 'react';

// Shortcut definitions
export const shortcuts = {
  // Playback
  PLAY_PAUSE: { keys: 'Space', description: 'Play/Pause audio', category: 'Playback' },
  STOP: { keys: 'Escape', description: 'Stop playback', category: 'Playback' },
  SKIP_FORWARD: { keys: 'ArrowRight', description: 'Skip forward 5s', category: 'Playback' },
  SKIP_BACKWARD: { keys: 'ArrowLeft', description: 'Skip backward 5s', category: 'Playback' },
  SPEED_UP: { keys: '}', description: 'Increase playback speed', category: 'Playback' },
  SPEED_DOWN: { keys: '{', description: 'Decrease playback speed', category: 'Playback' },
  
  // Timing
  SET_TIMESTAMP: { keys: 'T', description: 'Set timestamp at current time', category: 'Timing' },
  TAP_TEMPO: { keys: 'Enter', description: 'Tap to set timing', category: 'Timing' },
  NUDGE_FORWARD: { keys: 'Shift+ArrowRight', description: 'Nudge timestamp +0.1s', category: 'Timing' },
  NUDGE_BACKWARD: { keys: 'Shift+ArrowLeft', description: 'Nudge timestamp -0.1s', category: 'Timing' },
  FINE_NUDGE_FORWARD: { keys: 'Alt+ArrowRight', description: 'Fine nudge +0.01s', category: 'Timing' },
  FINE_NUDGE_BACKWARD: { keys: 'Alt+ArrowLeft', description: 'Fine nudge -0.01s', category: 'Timing' },
  
  // Editing
  ADD_LINE: { keys: 'Ctrl+N', description: 'Add new lyric line', category: 'Editing' },
  DELETE_LINE: { keys: 'Delete', description: 'Delete current line', category: 'Editing' },
  DUPLICATE_LINE: { keys: 'Ctrl+D', description: 'Duplicate current line', category: 'Editing' },
  MOVE_LINE_UP: { keys: 'Ctrl+ArrowUp', description: 'Move line up', category: 'Editing' },
  MOVE_LINE_DOWN: { keys: 'Ctrl+ArrowDown', description: 'Move line down', category: 'Editing' },
  
  // History
  UNDO: { keys: 'Ctrl+Z', description: 'Undo last action', category: 'History' },
  REDO: { keys: 'Ctrl+Shift+Z', description: 'Redo last action', category: 'History' },
  
  // File Operations
  NEW_PROJECT: { keys: 'Ctrl+Shift+N', description: 'New project', category: 'File' },
  OPEN_AUDIO: { keys: 'Ctrl+O', description: 'Open audio file', category: 'File' },
  SAVE_PROJECT: { keys: 'Ctrl+S', description: 'Save project', category: 'File' },
  EXPORT_LRC: { keys: 'Ctrl+E', description: 'Export as LRC', category: 'File' },
  IMPORT_LRC: { keys: 'Ctrl+I', description: 'Import LRC file', category: 'File' },
  
  // View
  TOGGLE_KARAOKE: { keys: 'F11', description: 'Toggle karaoke mode', category: 'View' },
  TOGGLE_WAVEFORM: { keys: 'Ctrl+W', description: 'Toggle waveform view', category: 'View' },
  ZOOM_IN: { keys: 'Ctrl+=', description: 'Zoom in timeline', category: 'View' },
  ZOOM_OUT: { keys: 'Ctrl+-', description: 'Zoom out timeline', category: 'View' },
  FOCUS_SEARCH: { keys: 'Ctrl+F', description: 'Focus search', category: 'View' },
  
  // AI & Quality
  GENERATE_AI: { keys: 'Ctrl+G', description: 'Generate with AI', category: 'AI' },
  VALIDATE: { keys: 'Ctrl+Shift+V', description: 'Validate timestamps', category: 'Quality' },
  FIX_GAPS: { keys: 'Ctrl+Shift+F', description: 'Auto-fix timing gaps', category: 'Quality' }
};

// Check if keys match
const matchesShortcut = (event, shortcutKeys) => {
  const keys = shortcutKeys.toLowerCase().split('+');
  const ctrl = keys.includes('ctrl') || keys.includes('cmd');
  const shift = keys.includes('shift');
  const alt = keys.includes('alt');
  const key = keys[keys.length - 1];
  
  const keyMatch = event.key.toLowerCase() === key.toLowerCase() || 
                   event.code.toLowerCase() === key.toLowerCase();
  
  return keyMatch &&
         event.ctrlKey === ctrl &&
         event.metaKey === ctrl &&
         event.shiftKey === shift &&
         event.altKey === alt;
};

// Hook to register shortcuts
export const useShortcuts = (handlers) => {
  const handleKeyDown = useCallback((event) => {
    // Don't trigger if typing in input
    if (event.target.tagName === 'INPUT' || 
        event.target.tagName === 'TEXTAREA' ||
        event.target.isContentEditable) {
      return;
    }
    
    // Check each shortcut
    for (const [action, handler] of Object.entries(handlers)) {
      const shortcut = shortcuts[action];
      if (shortcut && matchesShortcut(event, shortcut.keys)) {
        event.preventDefault();
        handler();
        break;
      }
    }
  }, [handlers]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

// Get shortcuts by category
export const getShortcutsByCategory = () => {
  const categories = {};
  
  for (const [key, value] of Object.entries(shortcuts)) {
    const category = value.category;
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push({ key, ...value });
  }
  
  return categories;
};

// Format shortcut keys for display
export const formatKeys = (keys) => {
  return keys
    .replace('Ctrl', '⌘')
    .replace('Shift', '⇧')
    .replace('Alt', '⌥')
    .replace('Arrow', '')
    .replace('+', ' ');
};
