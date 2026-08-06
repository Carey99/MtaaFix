/**
 * MtaaFix design tokens — dark-first theme.
 * The `dark` key is picked up automatically by useColors() when the device is in dark mode.
 * Setting userInterfaceStyle: "dark" in app.json locks the app to the dark palette.
 */

const colors = {
  light: {
    text: '#0a0a0a',
    tint: '#D4E157',
    background: '#f5f5f5',
    foreground: '#0a0a0a',
    card: '#ffffff',
    cardForeground: '#0a0a0a',
    primary: '#D4E157',
    primaryForeground: '#000000',
    secondary: '#eeeeee',
    secondaryForeground: '#1a1a1a',
    muted: '#eeeeee',
    mutedForeground: '#737373',
    accent: '#D4E157',
    accentForeground: '#000000',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#e0e0e0',
    input: '#e0e0e0',
  },

  dark: {
    text: '#ffffff',
    tint: '#D4E157',
    background: '#000000',
    foreground: '#ffffff',
    card: '#1a1a1a',
    cardForeground: '#ffffff',
    primary: '#D4E157',
    primaryForeground: '#000000',
    secondary: '#2a2a2a',
    secondaryForeground: '#ffffff',
    muted: '#2a2a2a',
    mutedForeground: '#888888',
    accent: '#D4E157',
    accentForeground: '#000000',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#2a2a2a',
    input: '#2a2a2a',
  },

  radius: 12,
};

export default colors;
