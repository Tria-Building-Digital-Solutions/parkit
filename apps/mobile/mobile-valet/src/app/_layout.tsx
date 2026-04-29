import "@/lib/androidTextDefaults";
import { Stack, SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useAuthStore, useLocaleStore } from '@/lib/store';
import { useThemeStore } from '@/lib/themeStore';
import { getStoredUser } from '@/lib/auth';
import { useFonts } from 'expo-font';
import { FeedbackModal } from '@/components/FeedbackModal';
import Toast from 'react-native-toast-message';
import { useValetTheme } from '@/theme/valetTheme';
import { t } from '@/lib/i18n';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { setUser, setLoading, isLoading } = useAuthStore();
  const { hydrateLocale, locale } = useLocaleStore();
  const { hydrateTheme } = useThemeStore();
  const theme = useValetTheme();

  const [fontsLoaded] = useFonts({
    'CalSans': require('../../assets/fonts/CalSans.ttf'),
  });

  useEffect(() => {
    const hydrate = async () => {
      setLoading(true);
      try {
        await hydrateLocale();
        await hydrateTheme();
        const user = await getStoredUser();
        setUser(user);
      } finally {
        setLoading(false);
      }
    };

    hydrate();
  }, [hydrateLocale, hydrateTheme, setLoading, setUser]);

  useEffect(() => {
    if (!isLoading && fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {
        // Ignore error if splash screen wasn't registered yet
      });
    }
  }, [isLoading, fontsLoaded]);

  if (isLoading || !fontsLoaded) {
    return null;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'default',
        }}
      >
        <Stack.Screen
          name="index"
          options={{ animation: 'none', gestureEnabled: false }}
        />
        <Stack.Screen name="home" />
        <Stack.Screen name="receive" />
        <Stack.Screen name="return-pickup" />
        <Stack.Screen name="tickets" />
        <Stack.Screen name="park" />
        <Stack.Screen
          name="profile"
          options={{ animation: 'none', gestureEnabled: true }}
        />
        <Stack.Screen
          name="settings"
          options={{ animation: 'none', gestureEnabled: true }}
        />
        <Stack.Screen
          name="workflow"
          options={{ animation: 'none', gestureEnabled: true }}
        />
        <Stack.Screen
          name="help"
          options={{ animation: 'none', gestureEnabled: true }}
        />
        <Stack.Screen
          name="welcome"
          options={{ animation: 'none', gestureEnabled: false }}
        />
        <Stack.Screen
          name="login"
          options={{ animation: 'none', gestureEnabled: true }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{ animation: 'none', gestureEnabled: true }}
        />
        <Stack.Screen
          name="signup"
          options={{ animation: 'none', gestureEnabled: true }}
        />
      </Stack>
      <FeedbackModal />
      <Toast 
        config={{
          success: (props) => {
            const currentLocale = locale || 'es';
            return (
              <View style={{
                backgroundColor: theme.colors.card,
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: 16,
                marginHorizontal: 20,
                marginBottom: 60,
                paddingVertical: 20,
                paddingHorizontal: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.12,
                shadowRadius: 16,
                elevation: 8,
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: theme.colors.success,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 16,
                  }}>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>✓</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    <Text style={{
                      color: theme.colors.text,
                      fontSize: 17,
                      fontWeight: '700',
                      lineHeight: 22,
                    }}>
                      {props.text1 || t(currentLocale, "profile.saveSuccess")}
                    </Text>
                    <Text style={{
                      color: theme.colors.textMuted,
                      fontSize: 15,
                      fontWeight: '500',
                      marginTop: 2,
                      lineHeight: 20,
                    }}>
                      {t(currentLocale, "toast.successDescription")}
                    </Text>
                  </View>
                </View>
              </View>
            );
          },
          error: (props) => {
            const currentLocale = locale || 'es';
            return (
              <View style={{
                backgroundColor: theme.colors.card,
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: 16,
                marginHorizontal: 20,
                marginBottom: 60,
                paddingVertical: 20,
                paddingHorizontal: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.12,
                shadowRadius: 16,
                elevation: 8,
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: theme.colors.logout,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 16,
                  }}>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>!</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    <Text style={{
                      color: theme.colors.text,
                      fontSize: 17,
                      fontWeight: '700',
                      lineHeight: 22,
                    }}>
                      {props.text1 || "Error"}
                    </Text>
                    <Text style={{
                      color: theme.colors.textMuted,
                      fontSize: 15,
                      fontWeight: '500',
                      marginTop: 2,
                      lineHeight: 20,
                    }}>
                      {t(currentLocale, "toast.errorDescription")}
                    </Text>
                  </View>
                </View>
              </View>
            );
          },
          info: (props) => {
            const currentLocale = locale || 'es';
            return (
              <View style={{
                backgroundColor: theme.colors.card,
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: 16,
                marginHorizontal: 20,
                marginBottom: 60,
                paddingVertical: 20,
                paddingHorizontal: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.12,
                shadowRadius: 16,
                elevation: 8,
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: theme.colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 16,
                  }}>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>i</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    <Text style={{
                      color: theme.colors.text,
                      fontSize: 17,
                      fontWeight: '700',
                      lineHeight: 22,
                    }}>
                      {props.text1 || "Información"}
                    </Text>
                    <Text style={{
                      color: theme.colors.textMuted,
                      fontSize: 15,
                      fontWeight: '500',
                      marginTop: 2,
                      lineHeight: 20,
                    }}>
                      {t(currentLocale, "toast.infoDescription")}
                    </Text>
                  </View>
                </View>
              </View>
            );
          },
        }}
      />
    </>
  );
}
