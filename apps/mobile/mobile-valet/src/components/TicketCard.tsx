import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconCar, IconMapPin, IconAlertCircle, IconCircleCheck } from '@/components/Icons';
import { useValetTheme } from '@/theme/valetTheme';
import type { TicketAssignment } from '@/types/tickets';

interface TicketCardProps {
  item: TicketAssignment;
  onGoPark?: (item: TicketAssignment) => void;
  onRequestReturn?: (item: TicketAssignment) => void;
  onMarkDelivered?: (item: TicketAssignment) => void;
  onStart?: (item: TicketAssignment) => void;
  onComplete?: (item: TicketAssignment) => void;
  locale: string;
  t: (locale: string, key: string, params?: any) => string;
}

export default function TicketCard({
  item,
  onGoPark,
  onRequestReturn,
  onMarkDelivered,
  onStart,
  onComplete,
  locale,
  t,
}: TicketCardProps) {
  const theme = useValetTheme();
  const styles = createStyles(theme);

  const isReception = item.status === undefined; // Reception tickets don't have status
  const getStatusColor = (status: string) => {
  switch (status) {
    case 'REQUEST_PARKING':
    case 'assigned':
      return { color: theme.colors.primary, bgColor: theme.colors.primary + '20' };
    case 'PARKED':
    case 'in-transit':
      return { color: theme.colors.warning, bgColor: theme.colors.warning + '20' };
    case 'REQUEST_DELIVERY':
      return { color: theme.colors.primary, bgColor: theme.colors.primary + '20' };
    case 'DELIVERED':
    case 'completed':
      return { color: theme.colors.success, bgColor: theme.colors.success + '20' };
    default:
      return { color: theme.colors.textMuted, bgColor: theme.colors.bg };
  }
};

const statusVisuals = getStatusColor(item.ticketStatus || item.status || 'pending');

  const renderActions = () => {
    if (isReception) {
      // Reception ticket actions
      if (item.ticketStatus === 'REQUEST_PARKING' && onGoPark) {
        return (
          <TouchableOpacity
            style={[styles.btn, styles.btnPrimary]}
            onPress={() => onGoPark(item)}
            accessibilityRole="button"
          >
            <IconCar size={16} color="#fff" style={styles.btnIcon} />
            <Text style={styles.btnText} maxFontSizeMultiplier={2}>
              {t(locale, 'tickets.actionGoPark')}
            </Text>
          </TouchableOpacity>
        );
      }
      if (item.ticketStatus === 'PARKED' && onRequestReturn) {
        return (
          <TouchableOpacity
            style={[styles.btn, styles.btnWarning]}
            onPress={() => onRequestReturn(item)}
            accessibilityRole="button"
          >
            <IconAlertCircle size={16} color="#fff" style={styles.btnIcon} />
            <Text style={styles.btnText} maxFontSizeMultiplier={2}>
              {t(locale, 'tickets.actionRequestReturn')}
            </Text>
          </TouchableOpacity>
        );
      }
      if (item.ticketStatus === 'REQUEST_DELIVERY' && onMarkDelivered) {
        return (
          <TouchableOpacity
            style={[styles.btn, styles.btnSuccess]}
            onPress={() => onMarkDelivered(item)}
            accessibilityRole="button"
          >
            <IconCircleCheck size={16} color="#fff" style={styles.btnIcon} />
            <Text style={styles.btnText} maxFontSizeMultiplier={2}>
              {t(locale, 'tickets.actionMarkDelivered')}
            </Text>
          </TouchableOpacity>
        );
      }
      if (item.ticketStatus === 'DELIVERED') {
        return (
          <View style={styles.completedBox}>
            <IconCircleCheck size={16} color={theme.colors.success} />
            <Text style={styles.completedText} maxFontSizeMultiplier={2}>
              {t(locale, 'tickets.statusDelivered')}
            </Text>
          </View>
        );
      }
    } else {
      // Delivery ticket actions
      if (item.status === 'assigned' && onStart) {
        return (
          <TouchableOpacity
            style={[styles.btn, styles.btnPrimary]}
            onPress={() => onStart(item)}
            accessibilityRole="button"
          >
            <IconCar size={16} color="#fff" style={styles.btnIcon} />
            <Text style={styles.btnText} maxFontSizeMultiplier={2}>
              {t(locale, 'tickets.actionStart')}
            </Text>
          </TouchableOpacity>
        );
      }
      if (item.status === 'in-transit' && onComplete) {
        return (
          <TouchableOpacity
            style={[styles.btn, styles.btnSuccess]}
            onPress={() => onComplete(item)}
            accessibilityRole="button"
          >
            <IconCircleCheck size={16} color="#fff" style={styles.btnIcon} />
            <Text style={styles.btnText} maxFontSizeMultiplier={2}>
              {t(locale, 'tickets.actionComplete')}
            </Text>
          </TouchableOpacity>
        );
      }
      if (item.status === 'completed') {
        return (
          <View style={styles.completedBox}>
            <IconCircleCheck size={16} color={theme.colors.success} />
            <Text style={styles.completedText} maxFontSizeMultiplier={2}>
              {t(locale, 'tickets.statusCompleted')}
            </Text>
          </View>
        );
      }
    }
    return null;
  };

  return (
    <View style={[styles.card, { borderLeftColor: statusVisuals.color }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.plate} maxFontSizeMultiplier={2}>
            {item.vehiclePlate}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusVisuals.bgColor }]}>
            <Text style={[styles.statusText, { color: statusVisuals.color }]} maxFontSizeMultiplier={2}>
              {t(locale, isReception ? `tickets.status${item.ticketStatus}` : `tickets.status${item.status}`)}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          {item.parkingName && (
            <View style={styles.location}>
              <IconMapPin size={14} color={theme.colors.textMuted} />
              <Text style={styles.locationText} maxFontSizeMultiplier={2}>
                {item.parkingName}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleText} maxFontSizeMultiplier={2}>
            {item.vehicleBrandModel}
          </Text>
          {item.vehicleColor && (
            <Text style={styles.colorText} maxFontSizeMultiplier={2}>
              {item.vehicleColor}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.actions}>
        {renderActions()}
      </View>
    </View>
  );
}

function createStyles(theme: any) {
  const S = theme.space;
  const R = theme.radius;
  const F = theme.font;
  const Fonts = theme.fontFamily;

  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: R.card,
      padding: S.md,
      marginBottom: S.sm,
      borderLeftWidth: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: S.sm,
    },
    headerLeft: {
      flex: 1,
    },
    plate: {
      fontSize: F.lg,
      fontWeight: '800',
      fontFamily: Fonts.primary,
      color: theme.colors.text,
      marginBottom: S.xs,
    },
    statusBadge: {
      paddingHorizontal: S.sm,
      paddingVertical: S.xs,
      borderRadius: R.sm,
      alignSelf: 'flex-start',
    },
    statusText: {
      fontSize: F.xs,
      fontWeight: '700',
      fontFamily: Fonts.primary,
    },
    headerRight: {
      alignItems: 'flex-end',
    },
    location: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: S.xs,
    },
    locationText: {
      fontSize: F.xs,
      color: theme.colors.textMuted,
    },
    content: {
      marginBottom: S.md,
    },
    vehicleInfo: {
      marginBottom: S.xs,
    },
    vehicleText: {
      fontSize: F.base,
      fontWeight: '600',
      color: theme.colors.text,
    },
    colorText: {
      fontSize: F.sm,
      color: theme.colors.textMuted,
      marginTop: 2,
    },
    customerText: {
      fontSize: F.sm,
      color: theme.colors.textMuted,
      marginBottom: S.xs,
    },
    notesText: {
      fontSize: F.sm,
      color: theme.colors.textMuted,
      fontStyle: 'italic',
    },
    actions: {
      alignItems: 'flex-end',
    },
    btn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: S.md,
      paddingVertical: S.sm,
      borderRadius: R.sm,
      minWidth: 120,
    },
    btnIcon: {
      marginRight: S.xs,
    },
    btnText: {
      fontSize: F.sm,
      fontWeight: '700',
      fontFamily: Fonts.primary,
      color: '#fff',
    },
    btnPrimary: {
      backgroundColor: theme.colors.primary,
    },
    btnWarning: {
      backgroundColor: theme.colors.warning,
    },
    btnSuccess: {
      backgroundColor: theme.colors.success,
    },
    completedBox: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: S.sm,
      paddingVertical: S.sm,
      borderRadius: R.sm,
      backgroundColor: theme.colors.success + '20',
    },
    completedText: {
      fontSize: F.sm,
      fontWeight: '700',
      fontFamily: Fonts.primary,
      color: theme.colors.success,
      marginLeft: S.xs,
    },
  });
}
