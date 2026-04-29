import React, { ReactNode } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useValetTheme } from '@/theme/valetTheme';
import { ValetBackButton } from '@/components/ValetBackButton';

interface ReceiveWizardProps {
  currentStep: number;
  typeStepNum: number;
  _cardStepNum: number;
  _plateStepNum: number;
  _driverStepNum: number;
  _vehicleStepNum: number;
  _parkingStepNum: number;
  _damageStepNum: number;
  _ticketStepNum: number;
  valetStepNum: number;
  onBack: () => void;
  children: ReactNode;
  title: string;
  reservationFlow: boolean;
}

export default function ReceiveWizard({
  currentStep,
  typeStepNum,
  _cardStepNum,
  _plateStepNum,
  _driverStepNum,
  _vehicleStepNum,
  _parkingStepNum,
  _damageStepNum,
  _ticketStepNum,
  valetStepNum,
  onBack,
  children,
  title,
  reservationFlow,
}: ReceiveWizardProps) {
  const theme = useValetTheme();
  const styles = createStyles(theme);
  const safeInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, currentStep === typeStepNum ? styles.headerType : styles.header, { paddingTop: safeInsets.top + theme.space.md }]}>
        {currentStep === typeStepNum ? (
          <View style={{ width: 44, height: 44 }} />
        ) : (
          <ValetBackButton
            onPress={onBack}
            accessibilityLabel="Back"
          />
        )}
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {title}
          </Text>
        </View>
        <View style={styles.headerRight}>
          {currentStep === valetStepNum && (
            <View style={styles.stepIndicator}>
              <Text style={[styles.stepIndicatorText, { color: theme.colors.text }]}>
                {currentStep - (reservationFlow ? 3 : 7)}/{reservationFlow ? 5 : 9}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={{ flex: 1, minHeight: 0, alignSelf: "stretch", width: "100%" }}>
        {children}
      </View>
    </View>
  );
}

function createStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.bg,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.space.md,
      paddingBottom: theme.space.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerType: {
      borderBottomWidth: 0,
    },
    headerContent: {
      flex: 1,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
    },
    headerRight: {
      width: 44,
      height: 44,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    stepIndicator: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    stepIndicatorText: {
      fontSize: 12,
      fontWeight: '600',
    },
  });
}
