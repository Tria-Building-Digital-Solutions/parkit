import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useValetTheme } from '@/theme/valetTheme';

interface WizardFooterProps {
  children?: React.ReactNode;
  keyboardPinned?: boolean;
}

export function WizardFooter({ children, keyboardPinned = false }: WizardFooterProps) {
  const theme = useValetTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, keyboardPinned && styles.keyboardPinned]}>
      {children}
    </View>
  );
}

interface WizardButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
}

export function WizardButton({ 
  title, 
  onPress, 
  disabled = false, 
  variant = 'primary',
  icon 
}: WizardButtonProps) {
  const theme = useValetTheme();
  const styles = createStyles(theme);

  return (
    <Pressable
      style={({ pressed }) => [
        variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
        { backgroundColor: variant === 'primary' ? theme.colors.primary : theme.colors.card },
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && <View style={styles.buttonIcon}>{icon}</View>}
      <Text style={[
        variant === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText,
        { color: variant === 'primary' ? '#fff' : theme.colors.text }
      ]}>
        {title}
      </Text>
    </Pressable>
  );
}

interface WizardButtonRowProps {
  children: React.ReactNode;
  gap?: number;
}

export function WizardButtonRow({ children, gap }: WizardButtonRowProps) {
  const theme = useValetTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.buttonRow, { gap: gap || theme.space.sm }]}>
      {children}
    </View>
  );
}

function createStyles(theme: any) {
  const S = theme.space;
  const R = theme.radius;

  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingHorizontal: S.lg,
      paddingTop: S.md,
      paddingBottom: S.xl,
    },
    keyboardPinned: {
      paddingBottom: S.xl + 100, // Extra padding for keyboard
    },
    primaryButton: {
      borderRadius: R.card,
      paddingVertical: S.md,
      paddingHorizontal: S.lg,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      minHeight: 48,
    },
    secondaryButton: {
      borderRadius: R.card,
      borderWidth: 2,
      borderColor: theme.colors.border,
      paddingVertical: S.md,
      paddingHorizontal: S.lg,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      minHeight: 48,
    },
    primaryButtonText: {
      fontSize: theme.font.base,
      fontWeight: '700',
      color: '#fff',
    },
    secondaryButtonText: {
      fontSize: theme.font.base,
      fontWeight: '700',
    },
    buttonIcon: {
      marginRight: S.sm,
    },
    disabled: {
      opacity: 0.5,
    },
    pressed: {
      opacity: 0.8,
    },
    buttonRow: {
      flexDirection: 'row',
    },
  });
}
