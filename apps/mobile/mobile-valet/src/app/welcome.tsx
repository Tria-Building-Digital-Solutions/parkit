import { View, Text, StyleSheet, Pressable, StatusBar, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useLocaleStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { useMemo, useState } from "react";
import { AnimatedAuthBackground } from "@/components/AnimatedAuthBackground";
import { AnimatedFormCard } from "@/components/AnimatedFormCard";
import { useValetTheme, ACCENT } from "@/theme/valetTheme";
import { Logo } from "@parkit/shared";
import { GoogleIcon, MicrosoftIcon, FacebookIcon } from "@/components/OAuthIcons";

const LOGO_SIZE = 72;

const CONTROL_HEIGHT = 56;

export function WelcomeContent({
  onLogin,
  onSignup,
}: {
  onLogin: () => void;
  onSignup: () => void;
}) {
  const locale = useLocaleStore((s) => s.locale);
  const insets = useSafeAreaInsets();
  const theme = useValetTheme();
  const { auth: a } = theme;
  const [oauthLoading, _setOauthLoading] = useState<string | null>(null);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        rootColumn: { flex: 1 },
        heroStrip: {
          flex: 1,
        },
        topBar: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 16,
          width: "100%",
          alignSelf: "center",
          backgroundColor: 'transparent',
        },
        hero: {
          position: 'absolute',
          top: 200,
          left: 0,
          right: 0,
          alignItems: 'center',
        },
        logoWrap: { alignItems: "center" },
        logo: { marginBottom: 0 },
        valetLabel: {
          marginTop: 0,
          fontWeight: "700",
          letterSpacing: 2,
          color: a.authHeroValetLabel,
          textTransform: "lowercase",
        },
        bottomSection: {
          backgroundColor: a.bottomSheet,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          ...a.authFormSheetSeparator,
          paddingHorizontal: 20,
          paddingTop: 28,
          paddingBottom: 0,
          alignItems: "stretch",
          width: "100%",
          alignSelf: "center",
        },
        ctaText: {
          fontWeight: "600",
          color: a.text,
          marginBottom: 20,
          textAlign: "center",
        },
        btnPrimary: {
          backgroundColor: a.btnLoginBg,
          minHeight: CONTROL_HEIGHT,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 14,
          shadowColor: ACCENT,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 4,
        },
        btnPrimaryText: {
          fontWeight: "600",
          color: a.btnLoginText,
          letterSpacing: 0.5,
        },
        btnSecondary: {
          backgroundColor: a.btnSignupBg,
          minHeight: CONTROL_HEIGHT,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 0,
        },
        btnSecondaryText: {
          fontWeight: "600",
          color: a.btnSignupText,
          letterSpacing: 0.5,
        },
        btnPressed: { opacity: 0.9 },
        versionLabel: {
          marginTop: 24,
          fontWeight: "500",
          color: a.textMuted,
          textAlign: "center",
        },
        oauthDivider: {
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 20,
          paddingHorizontal: 10,
        },
        dividerLine: {
          flex: 1,
          height: 1,
          backgroundColor: a.inputBorder,
        },
        dividerText: {
          marginHorizontal: 10,
          color: a.textMuted,
          fontWeight: '500',
        },
        oauthContainer: {
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 12,
          marginBottom: 0,
        },
        oauthButton: {
          width: 50,
          height: 50,
          borderRadius: 12,
          backgroundColor: a.bottomSheet,
          borderWidth: 1,
          borderColor: a.inputBorder,
          alignItems: 'center',
          justifyContent: 'center',
        },
        oauthButtonPressed: {
          backgroundColor: a.inputBg,
        },
        oauthButtonDisabled: {
          opacity: 0.6,
        },
      }),
    [a]
  );

  return (
    <AnimatedAuthBackground isDark={theme.isDark}>
      <StatusBar barStyle={a.statusBarStyle} backgroundColor="transparent" />
      <View style={styles.rootColumn}>
        <View style={styles.heroStrip}>
          <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 12) }]} />
          <View style={styles.hero}>
            <View style={styles.logoWrap}>
              <Logo size={LOGO_SIZE} style={styles.logo} variant={theme.isDark ? "onDark" : "onLight"} />
              <Text style={styles.valetLabel} maxFontSizeMultiplier={1.5}>valet</Text>
            </View>
          </View>
        </View>

        <View>
          <AnimatedFormCard isVisible={true} animationType="slide_from_bottom">
            <View style={[styles.bottomSection, { paddingBottom: Math.max(insets.bottom, 12) }]}>
              <Text style={styles.ctaText} maxFontSizeMultiplier={1.5}>{t(locale, "welcome.cta")}</Text>
            <Pressable
              onPress={onLogin}
              style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPressed]}
            >
              <Text style={styles.btnPrimaryText} maxFontSizeMultiplier={1.5}>{t(locale, "welcome.login")}</Text>
            </Pressable>
            <Pressable
              onPress={onSignup}
              style={({ pressed }) => [styles.btnSecondary, pressed && styles.btnPressed]}
            >
              <Text style={styles.btnSecondaryText} maxFontSizeMultiplier={1.5}>{t(locale, "welcome.signup")}</Text>
            </Pressable>

            {/* OAuth Divider */}
            <View style={styles.oauthDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText} maxFontSizeMultiplier={1.5}>{t(locale, "welcome.orContinueWith")}</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* OAuth Buttons */}
            <View style={styles.oauthContainer}>
              <Pressable 
                onPress={() => {}}
                disabled={oauthLoading !== null}
                style={({ pressed }) => [
                  styles.oauthButton,
                  pressed && styles.oauthButtonPressed,
                  oauthLoading !== null && styles.oauthButtonDisabled,
                ]}
              >
                {oauthLoading === 'google' ? (
                  <ActivityIndicator size="small" color={a.text} />
                ) : (
                  <GoogleIcon />
                )}
              </Pressable>
              <Pressable 
                onPress={() => {}}
                disabled={oauthLoading !== null}
                style={({ pressed }) => [
                  styles.oauthButton,
                  pressed && styles.oauthButtonPressed,
                  oauthLoading !== null && styles.oauthButtonDisabled,
                ]}
              >
                {oauthLoading === 'microsoft' ? (
                  <ActivityIndicator size="small" color={a.text} />
                ) : (
                  <MicrosoftIcon />
                )}
              </Pressable>
              <Pressable 
                onPress={() => {}}
                disabled={oauthLoading !== null}
                style={({ pressed }) => [
                  styles.oauthButton,
                  pressed && styles.oauthButtonPressed,
                  oauthLoading !== null && styles.oauthButtonDisabled,
                ]}
              >
                {oauthLoading === 'facebook' ? (
                  <ActivityIndicator size="small" color={a.text} />
                ) : (
                  <FacebookIcon />
                )}
              </Pressable>
            </View>
            </View>
          </AnimatedFormCard>
        </View>
      </View>
    </AnimatedAuthBackground>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <WelcomeContent
      onLogin={() => router.push("/login")}
      onSignup={() => router.push("/signup")}
    />
  );
}
