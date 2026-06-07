import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { IconCheck } from '@/components/Icons';
import { useValetTheme } from '@/theme/valetTheme';
import { t } from '@/lib/i18n';
import type { Locale } from '@parkit/shared';

interface TicketCodeFormProps {
  locale: Locale;
  ticketCode: string;
  keyCode: string;
  unlinked: boolean;
  acknowledged: boolean;
  onTicketCodeChange: (value: string) => void;
  onKeyCodeChange: (value: string) => void;
  onToggleUnlinked: () => void;
  onAcknowledge: () => void;
  colors: {
    textSubtle: string;
    primary: string;
  };
}

export function TicketCodeForm({
  locale,
  ticketCode,
  keyCode,
  unlinked,
  acknowledged,
  onTicketCodeChange,
  onKeyCodeChange,
  onToggleUnlinked,
  onAcknowledge,
  colors: C,
}: TicketCodeFormProps) {
  const theme = useValetTheme();

  const styles = StyleSheet.create({
    sectionLabel: {
      fontSize: theme.font.base,
      fontWeight: '800',
      color: C.textSubtle,
      marginBottom: 8,
    },
    stepExplain: {
      fontSize: theme.font.sm,
      color: C.textSubtle,
      marginBottom: 16,
      lineHeight: theme.font.base,
    },
    input: {
      fontSize: theme.font.md,
      borderWidth: 1,
      borderColor: C.textSubtle,
      borderRadius: 8,
      padding: 12,
      color: C.textSubtle,
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      paddingVertical: 4,
    },
    toggleBox: {
      width: 22,
      height: 22,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: C.textSubtle,
      marginRight: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    toggleBoxActive: {
      backgroundColor: C.primary,
      borderColor: C.primary,
    },
    toggleText: {
      fontSize: theme.font.sm,
      color: C.textSubtle,
    },
    ackRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      paddingVertical: 4,
    },
    ackText: {
      fontSize: theme.font.sm,
      lineHeight: theme.font.base,
      color: C.textSubtle,
    },
  });

  return (
    <>
      <Text style={styles.sectionLabel}>{t(locale, 'receive.wizardTicketTitle')}</Text>
      <Text style={styles.stepExplain}>{t(locale, 'receive.wizardTicketHelp')}</Text>

      {/* Ticket Code */}
      <TextInput
        style={styles.input}
        value={ticketCode}
        onChangeText={onTicketCodeChange}
        placeholder={unlinked ? t(locale, 'receive.ticketCodeOnlyLabel') : t(locale, 'receive.placeholderTicketKeyCode')}
        placeholderTextColor={C.textSubtle}
        autoCapitalize="characters"
        maxFontSizeMultiplier={2}
      />

      {/* Unlinked toggle */}
      <Pressable onPress={onToggleUnlinked} style={styles.toggleRow}>
        <View style={[styles.toggleBox, unlinked && styles.toggleBoxActive]}>
          {unlinked && <IconCheck size={theme.icon.xs} color="#fff" />}
        </View>
        <Text style={styles.toggleText}>
          {unlinked ? t(locale, 'receive.ticketKeySameToggle') : t(locale, 'receive.ticketKeySeparateToggle')}
        </Text>
      </Pressable>

      {/* Key Code (when unlinked) */}
      {unlinked && (
        <TextInput
          style={styles.input}
          value={keyCode}
          onChangeText={onKeyCodeChange}
          placeholder={t(locale, 'receive.placeholderTicketKeyCode')}
          placeholderTextColor={C.textSubtle}
          autoCapitalize="characters"
          maxFontSizeMultiplier={2}
        />
      )}

      {/* Acknowledge toggle */}
      <Pressable onPress={onAcknowledge} style={styles.ackRow}>
        <View style={[styles.toggleBox, acknowledged && styles.toggleBoxActive]}>
          {acknowledged && <IconCheck size={theme.icon.xs} color="#fff" />}
        </View>
        <Text style={styles.ackText}>{t(locale, 'receive.wizardTicketAck')}</Text>
      </Pressable>
    </>
  );
}
