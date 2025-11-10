import { DefaultTheme, DarkTheme } from '@react-navigation/native';

const colors = {
  primary: '#246BFD',
  accent: '#FF6B6B',
  background: '#F6F8FB',
  card: '#FFFFFF',
  text: '#1F2937',
  muted: '#6B7280',
  light: '#F3F4F6',
  dark: '#1F2937',
};

const themes = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.muted,
      notification: colors.accent,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: colors.primary,
      background: colors.dark,
      card: colors.dark,
      text: colors.light,
      border: colors.muted,
      notification: colors.accent,
    },
  },
};

export { colors, themes };