import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Logo } from '@parkit/shared';
import { IconUser } from '@/components/Icons';
import { useValetTheme } from '@/theme/valetTheme';
import { HeaderAnimatedView } from '@/components/ReanimatedWrappers';
import {
  HEADER_RADIUS_BOTTOM,
  getHeaderSizes,
  HEADER_LOGO_BASE_SIZE,
} from '@/lib/homeUtils';

interface HomeHeaderProps {
  user: any;
  displayName: string;
  onProfilePress: () => void;
  _onSettingsPress: () => void;
  _onLogoutPress: () => void;
  reduceMotion: boolean;
  windowWidth: number;
  _windowHeight: number;
}

export default function HomeHeader({
  user,
  displayName,
  onProfilePress,
  _onSettingsPress,
  _onLogoutPress,
  reduceMotion,
  windowWidth,
  _windowHeight,
}: HomeHeaderProps) {
  const theme = useValetTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();

  const headerSizes = getHeaderSizes(windowWidth);
  const headerTextPrimary = theme.isDark ? theme.colors.text : theme.colors.card;
  const headerTextSecondary = theme.isDark ? theme.colors.textMuted : theme.colors.card;

  const headerGradientSpec = {
    colors: theme.isDark
      ? [theme.colors.card, theme.colors.card] as [string, string]
      : [theme.colors.primary, theme.colors.primary] as [string, string],
    locations: [0.4, 1] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  };

  return (
    <HeaderAnimatedView reduceMotion={reduceMotion}>
      <LinearGradient
        colors={headerGradientSpec.colors}
        locations={headerGradientSpec.locations}
        start={headerGradientSpec.start}
        end={headerGradientSpec.end}
        style={[
          styles.heroHeader,
          {
            borderBottomLeftRadius: HEADER_RADIUS_BOTTOM,
            borderBottomRightRadius: HEADER_RADIUS_BOTTOM,
            paddingTop: insets.top + theme.space.md,
          },
        ]}
      >
        <View style={styles.heroToolbarWrap}>
          <View style={[styles.heroToolbar, { gap: headerSizes.gap }]}>
            <Logo
              size={headerSizes.logoSize}
              variant={theme.isDark ? 'onDark' : 'onLight'}
              style={styles.heroLogo}
            />
            <View style={styles.headerUserBlock}>
              <View style={[styles.headerGreetingRow, { gap: headerSizes.gap }]}>
                <View style={styles.headerGreetingCol}>
                  <Text
                    style={[styles.headerDisplayName, { color: headerTextPrimary, fontSize: theme.font.base }]}
                    numberOfLines={2}
                  >
                    {displayName}
                  </Text>
                  <Text
                    style={[styles.headerRole, { color: headerTextSecondary, fontSize: theme.font.sm }]}
                    numberOfLines={1}
                  >
                    {user?.role === 'DRIVER' ? 'Valet' : user?.role === 'RECEPTIONIST' ? 'Recepción' : 'Staff'}
                  </Text>
                </View>
                <Pressable
                  style={({ pressed }) => [
                    styles.headerAvatarPress,
                    pressed && styles.pressed,
                  ]}
                  onPress={onProfilePress}
                  accessibilityRole="button"
                  accessibilityLabel="Profile"
                >
                  <View style={styles.avatarRing}>
                    {user?.avatarUrl ? (
                      <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
                    ) : (
                      <View style={[styles.avatarPlaceholder, { backgroundColor: theme.isDark ? 'rgba(148,163,184,0.15)' : 'rgba(100,116,139,0.15)' }]}>
                        <IconUser size={headerSizes.avatarSize} color={headerTextSecondary} />
                      </View>
                    )}
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </HeaderAnimatedView>
  );
}

function createStyles(theme: any) {
  const S = theme.space;

  return StyleSheet.create({
    heroHeader: {
      paddingHorizontal: S.lg,
      paddingBottom: S.xl,
    },
    heroToolbarWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    heroToolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    heroLogo: {
      marginRight: S.md,
    },
    headerUserBlock: {
      flex: 1,
      alignItems: 'flex-end',
    },
    headerGreetingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    headerGreetingCol: {
      flex: 1,
      alignItems: 'flex-end',
    },
    headerDisplayName: {
      fontWeight: '700',
      textAlign: 'right',
    },
    headerRole: {
      fontWeight: '500',
      textAlign: 'right',
      marginTop: 2,
    },
    headerAvatarPress: {
      borderRadius: 100,
    },
    avatarRing: {
      width: HEADER_LOGO_BASE_SIZE * 0.8,
      height: HEADER_LOGO_BASE_SIZE * 0.8,
      borderRadius: 100,
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.3)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
      borderRadius: 100,
      resizeMode: 'cover',
    },
    avatarPlaceholder: {
      width: '100%',
      height: '100%',
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pressed: {
      opacity: 0.7,
    },
  });
}
