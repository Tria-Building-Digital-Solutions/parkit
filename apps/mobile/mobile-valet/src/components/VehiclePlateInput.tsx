import React from 'react';
import { View, Text, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import { IconCar, IconCarFilled, IconLicensePlate } from '@/components/Icons';
import { useValetTheme } from '@/theme/valetTheme';
import { t } from '@/lib/i18n';
import type { Locale } from '@parkit/shared';
import { formatPlate } from '@parkit/shared';
import type { VehicleLookup } from '@/types/receive';
import { formatPhoneInternational } from '@/lib/phoneInternational';

interface VehiclePlateInputProps {
  locale: Locale;
  plate: string;
  onPlateChange: (plate: string) => void;
  lookupLoading: boolean;
  vehicleResolved: boolean;
  vehicle: VehicleLookup | null;
  plateLooksValid: boolean;
  colors: {
    primary: string;
    success: string;
    warning: string;
    textSubtle: string;
    textMuted: string;
    card: string;
    border: string;
    text: string;
    inputBg: string;
    inputBorder: string;
    [key: string]: string;
  };
  fonts: {
    xs: number;
    sm: number;
    base: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  space: {
    sm: number;
    md: number;
    xs: number;
  };
}

export function VehiclePlateInput({
  locale,
  plate,
  onPlateChange,
  lookupLoading,
  vehicleResolved,
  vehicle,
  plateLooksValid,
  colors: C,
  fonts: F,
  space: S,
}: VehiclePlateInputProps) {
  const theme = useValetTheme();

  const handleChange = (value: string) => {
    const formatted = formatPlate(value);
    onPlateChange(formatted);
  };

  const styles = StyleSheet.create({
    stepExplain: {
      fontSize: F.base,
      fontWeight: '600',
      color: C.textMuted,
      marginTop: 0,
      marginBottom: S.md,
      lineHeight: F.base,
    },
    inputLabel: {
      fontSize: F.base,
      fontWeight: '500',
      color: C.text,
      marginBottom: 6,
    },
    input: {
      backgroundColor: C.inputBg,
      borderWidth: 1,
      borderColor: C.inputBorder,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingLeft: 48,
      fontSize: F.base,
      fontWeight: '600',
      color: C.text,
      marginBottom: S.sm,
      height: 48,
    },
    inputContainer: {
      position: 'relative',
      marginBottom: 16,
    },
    inputIcon: {
      position: 'absolute',
      left: 16,
      top: '50%',
      marginTop: -16,
      zIndex: 1,
    },
    row: {
      flexDirection: 'row',
      gap: S.sm,
      alignItems: 'center',
      marginBottom: S.md,
    },
    inlineLoadingText: {
      fontSize: F.base,
      color: C.textSubtle,
      lineHeight: F.base,
      marginBottom: 0,
    },
    card: {
      backgroundColor: C.card,
      borderRadius: 24,
      padding: 20,
      borderWidth: 0,
      marginBottom: S.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 16,
      elevation: 2,
    },
    vehicleFoundCard: {
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.15)',
    },
    vehicleFoundHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginBottom: 16,
    },
    vehicleFoundIcon: {
      width: 40,
      height: 40,
      borderRadius: 40 / 2,
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    vehicleFoundTitle: {
      fontSize: F.base,
      fontWeight: '800',
      color: C.text,
      marginBottom: -4,
      flex: 1,
    },
    vehicleFoundSubtitle: {
      fontSize: F.base,
      fontWeight: '500',
      color: C.success,
      marginTop: -4,
    },
    vehicleSummaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: S.sm,
      paddingVertical: S.xs,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: 'rgba(148, 163, 184, 0.35)',
    },
    vehicleSummaryRowLast: {
      borderBottomWidth: 0,
      paddingBottom: 0,
    },
    vehicleSummaryLabel: {
      flexShrink: 1,
      fontSize: F.base,
      fontWeight: '700',
      color: C.text,
      letterSpacing: 0.4,
    },
    vehicleSummaryValue: {
      flex: 1,
      textAlign: 'right',
      fontSize: F.base,
      fontWeight: '700',
      color: C.textMuted,
    },
    cardHint: {
      fontSize: F.base,
      color: C.textMuted,
      marginTop: S.sm,
      lineHeight: F.base,
    },
  });

  return (
    <>
      <Text style={styles.stepExplain}>{t(locale, 'receive.wizardPlateHelp')}</Text>

      <Text style={styles.inputLabel}>{t(locale, 'receive.labelPlate')}</Text>
      <View style={styles.inputContainer}>
        <IconLicensePlate size={theme.icon.sm} color={C.textMuted} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={plate}
          onChangeText={handleChange}
          placeholder={t(locale, 'receive.placeholderPlate')}
          placeholderTextColor={C.textSubtle}
          autoCapitalize="characters"
          maxFontSizeMultiplier={2}
        />
      </View>

      {lookupLoading && (
        <View style={styles.row}>
          <ActivityIndicator size="small" color={C.primary} />
          <Text style={styles.inlineLoadingText}>{t(locale, 'receive.lookupInlineLoading')}</Text>
        </View>
      )}

      {vehicle && (
        <View style={[styles.card, styles.vehicleFoundCard]}>
          <View style={styles.vehicleFoundHeader}>
            <View style={styles.vehicleFoundIcon}>
              <IconCarFilled size={theme.icon.sm} color={C.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.vehicleFoundTitle} numberOfLines={1}>{t(locale, 'receive.foundVehicle')}</Text>
              <Text style={styles.vehicleFoundSubtitle} numberOfLines={1}>{formatPlate(vehicle.plate)}</Text>
            </View>
          </View>
          <View style={styles.vehicleSummaryRow}>
            <Text style={styles.vehicleSummaryLabel}>Vehículo</Text>
            <Text style={styles.vehicleSummaryValue}>
              {vehicle.brand} {vehicle.model} {vehicle.year ? vehicle.year : ''}
            </Text>
          </View>
          {vehicle.color && (
            <View style={styles.vehicleSummaryRow}>
              <Text style={styles.vehicleSummaryLabel}>Color</Text>
              <Text style={styles.vehicleSummaryValue}>
                {vehicle.color}
              </Text>
            </View>
          )}
          {vehicle.owners?.length && (
            <>
              <View style={styles.vehicleSummaryRow}>
                <Text style={styles.vehicleSummaryLabel}>Propietario</Text>
                <Text style={styles.vehicleSummaryValue}>
                  {vehicle.owners?.[0]?.customer?.user?.firstName} {vehicle.owners?.[0]?.customer?.user?.lastName}
                </Text>
              </View>
              {vehicle.owners?.[0]?.customer?.user?.email && (
                <View style={styles.vehicleSummaryRow}>
                  <Text style={styles.vehicleSummaryLabel}>Correo electrónico</Text>
                  <Text style={styles.vehicleSummaryValue}>
                    {vehicle.owners?.[0]?.customer?.user?.email}
                  </Text>
                </View>
              )}
              {vehicle.owners?.[0]?.customer?.user?.phone && (
                <View style={styles.vehicleSummaryRow}>
                  <Text style={styles.vehicleSummaryLabel}>Teléfono</Text>
                  <Text style={styles.vehicleSummaryValue}>
                    {formatPhoneInternational(vehicle.owners?.[0]?.customer?.user?.phone)}
                  </Text>
                </View>
              )}
            </>
          )}
          {vehicle.dimensions && (vehicle.dimensions.lengthCm || vehicle.dimensions.widthCm || vehicle.dimensions.heightCm || vehicle.dimensions.weightKg) && (
            <View style={styles.vehicleSummaryRow}>
              <Text style={styles.vehicleSummaryLabel}>Dimensiones</Text>
              <Text style={styles.vehicleSummaryValue}>
                {vehicle.dimensions.lengthCm && `${(vehicle.dimensions.lengthCm / 100).toFixed(2)}m`}
                {vehicle.dimensions.widthCm && ` × ${(vehicle.dimensions.widthCm / 100).toFixed(2)}m`}
                {vehicle.dimensions.heightCm && ` × ${(vehicle.dimensions.heightCm / 100).toFixed(2)}m`}
                {vehicle.dimensions.weightKg && (vehicle.dimensions.lengthCm || vehicle.dimensions.widthCm || vehicle.dimensions.heightCm) ? ' | ' : ''}
                {vehicle.dimensions.weightKg && `${vehicle.dimensions.weightKg}kg`}
              </Text>
            </View>
          )}
        </View>
      )}

      {vehicleResolved && !vehicle && plateLooksValid && (
        <View style={[styles.card, styles.vehicleFoundCard]}>
          <View style={styles.vehicleFoundHeader}>
            <View style={styles.vehicleFoundIcon}>
              <IconCar size={theme.icon.sm} color={C.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.vehicleFoundTitle} numberOfLines={1}>{t(locale, 'receive.newVehicleTitle')}</Text>
              <Text style={styles.vehicleFoundSubtitle} numberOfLines={1}>{formatPlate(plate)}</Text>
            </View>
          </View>
          <View style={[styles.vehicleSummaryRow, styles.vehicleSummaryRowLast]}>
            <Text style={styles.vehicleSummaryLabel}>{t(locale, 'receive.newVehicleHint')}</Text>
          </View>
        </View>
      )}
    </>
  );
}
