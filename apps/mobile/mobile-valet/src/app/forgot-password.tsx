import { View, Text, StyleSheet, Pressable, StatusBar, TextInput, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator, Keyboard } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useLocaleStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { useMemo, useState, useRef, useEffect } from "react";
import { AnimatedAuthBackground } from "@/components/AnimatedAuthBackground";
import { AnimatedFormCard } from "@/components/AnimatedFormCard";
import { useValetTheme, ACCENT } from "@/theme/valetTheme";
import { Logo, getAppVersionString } from "@parkit/shared";
import { forgotPassword, translateError } from "@/lib/auth";
import { GoogleIcon as _GoogleIcon, MicrosoftIcon as _MicrosoftIcon, FacebookIcon as _FacebookIcon } from "@/components/OAuthIcons";
import { IconMail } from "@/components/Icons";
import { AuthMessage } from "@/components/AuthMessage";

const LOGO_SIZE = 72;

const CONTROL_HEIGHT = 56;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const locale = useLocaleStore((s) => s.locale);
  const insets = useSafeAreaInsets();
  const theme = useValetTheme();
  const { auth: a } = theme;
  const [_oauthLoading, _setOauthLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const formCardRef = useRef<(() => void) | null>(null);

  // Handle keyboard show/hide
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const _heroMinHeight = Math.round(140 + LOGO_SIZE + 16);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        rootColumn: { flex: 1 },
        heroStrip: {
          flex: 1,
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
        inputContainer: {
          position: 'relative',
          marginBottom: 16,
        },
        input: {
          backgroundColor: a.inputBg,
          borderWidth: 1,
          borderColor: a.inputBorder,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingLeft: 48,
          color: a.text,
          height: CONTROL_HEIGHT - 8,
        },
        inputIcon: {
          position: 'absolute',
          left: 16,
          top: '50%',
          marginTop: -10,
          zIndex: 1,
        },
inputLabel: {
          fontWeight: "500",
          color: a.text,
          marginBottom: 6,
        },
        explanationText: {
          fontWeight: "400",
          color: a.textMuted,
          textAlign: "left",
          marginBottom: 20,
        },
        forgotPasswordLink: {
          textAlign: 'center',
          color: a.btnLoginBg,
          fontWeight: '600',
          fontSize: theme.font.base,
          marginTop: 16,
          marginBottom: 8,
        },
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
    [a, theme.font.base]
  );

  const _versionLabel = t(locale, "welcome.version", {
    version: getAppVersionString() || "â",
  });

  return (
    <AnimatedAuthBackground isDark={theme.isDark}>
      <StatusBar barStyle={a.statusBarStyle} backgroundColor="transparent" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.rootColumn}>
            <View style={styles.heroStrip}>
          <View style={styles.hero}>
            <View style={styles.logoWrap}>
              {!isKeyboardVisible && (
                <>
                  <Logo size={LOGO_SIZE} style={styles.logo} variant={theme.isDark ? "onDark" : "onLight"} />
                  <Text style={styles.valetLabel} maxFontSizeMultiplier={1.5}>valet</Text>
                </>
              )}
            </View>
        </View>
        </View>

        <View>
          <AnimatedFormCard ref={formCardRef} isVisible={true} animationType="slide_from_bottom">
            <View style={[styles.bottomSection, { paddingBottom: Math.max(insets.bottom, 12) }]}>
            <Text style={styles.ctaText} maxFontSizeMultiplier={1.5}>{t(locale, "forgot.recoveryTitle")}</Text>
            
            <Text style={styles.explanationText} maxFontSizeMultiplier={1.5}>
              {t(locale, "forgot.recoveryDescription")}
            </Text>
            
<Text style={styles.inputLabel} maxFontSizeMultiplier={1.5}>{t(locale, "forgot.emailLabel")}</Text>
            <View style={styles.inputContainer}>
                <IconMail 
                  size={20} 
                  color={a.textMuted} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder={t(locale, "auth.email.placeholder")}
                  placeholderTextColor={a.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  spellCheck={false}
                  textContentType="none"
                  autoComplete="email"
                  dataDetectorTypes="none"
                />
            </View>
            
            <View style={{ marginBottom: 16 }} />

            <Pressable
              onPress={async () => {
                setError(null);
                setSuccess(false);
                if (!email) {
                  setError(t(locale, "auth.validation.requiredFields"));
                  return;
                }
                setIsLoading(true);
                const result = await forgotPassword(email);
                setIsLoading(false);
                if (result.success) {
                  setSuccess(true);
                  setEmail("");
                } else {
                  setError(result.error ? translateError(result.error, locale, t) : t(locale, "auth.forgotPassword.failed"));
                }
              }}
              style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPressed]}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={a.btnLoginText} />
              ) : (
                <Text style={styles.btnPrimaryText} maxFontSizeMultiplier={1.5}>{t(locale, "forgot.sendRecoveryLink")}</Text>
              )}
            </Pressable>
            
            {error && (
              <AuthMessage type="error" message={error} />
            )}
            {success && (
              <AuthMessage type="success" message={t(locale, "forgot.recoverySent")} />
            )}
            
            <Pressable onPress={() => router.push("/login")}>
              <Text style={styles.forgotPasswordLink} maxFontSizeMultiplier={1.5}>{t(locale, "forgot.backToLoginText")}</Text>
            </Pressable>

            </View>
          </AnimatedFormCard>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AnimatedAuthBackground>
  );
}
