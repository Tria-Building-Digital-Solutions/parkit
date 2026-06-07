import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useValetTheme } from '@/theme/valetTheme';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
}

export function FormInput({
  label,
  error,
  required = false,
  style,
  ...textInputProps
}: FormInputProps) {
  const theme = useValetTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          style
        ]}
        placeholderTextColor={theme.colors.textMuted}
        {...textInputProps}
      />
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

function createStyles(theme: any) {
  return StyleSheet.create({
    container: {
      marginBottom: theme.space.md,
    },
    label: {
      fontSize: theme.font.sm,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.space.xs,
      fontFamily: theme.fontFamily.primary,
    },
    required: {
      color: theme.colors.logout,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.card,
      paddingHorizontal: theme.space.md,
      paddingVertical: theme.space.sm,
      fontSize: theme.font.base,
      color: theme.colors.text,
      backgroundColor: theme.colors.card,
      fontFamily: theme.fontFamily.primary,
    },
    inputError: {
      borderColor: theme.colors.logout,
    },
    errorText: {
      fontSize: theme.font.xs,
      color: theme.colors.logout,
      marginTop: theme.space.xs,
      fontFamily: theme.fontFamily.primary,
    },
  });
}
