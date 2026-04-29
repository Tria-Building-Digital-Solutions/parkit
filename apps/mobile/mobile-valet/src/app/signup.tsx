import { View, Text, StyleSheet, Pressable, StatusBar, TextInput, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator, Keyboard } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useLocaleStore, useAuthStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { useMemo, useState, useRef, useEffect } from "react";
import { AnimatedAuthBackground } from "@/components/AnimatedAuthBackground";
import { AnimatedFormCard } from "@/components/AnimatedFormCard";
import { useValetTheme } from "@/theme/valetTheme";
import { Logo } from "@parkit/shared";
import { signup, translateError } from "@/lib/auth";
import { IconMail, IconLock, IconUser, IconEye, IconEyeOff, IconClipboardText, IconCar } from "@/components/Icons";
import { AuthMessage } from "@/components/AuthMessage";

const LOGO_SIZE = 72;

const CONTROL_HEIGHT = 56;

export default function SignupScreen() {
  const router = useRouter();
  const locale = useLocaleStore((s) => s.locale);
  const insets = useSafeAreaInsets();
  const theme = useValetTheme();
  const { setUser } = useAuthStore();
  const { auth: a } = theme;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [staffRole, setStaffRole] = useState<"receptionist" | "driver">("receptionist");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
          backgroundColor: a.btnSignupBg,
          minHeight: CONTROL_HEIGHT,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 14,
        },
        btnPrimaryText: {
          fontWeight: "600",
          color: a.btnSignupText,
          letterSpacing: 0.5,
        },
        btnPressed: { opacity: 0.9 },
        roleSelection: {
          marginBottom: 16,
        },
        roleLabel: {
          fontSize: theme.font.base,
          fontWeight: '600',
          color: a.text,
          marginBottom: 6,
        },
        roleButtons: {
          flexDirection: 'row',
          backgroundColor: a.inputBg,
          borderRadius: 12,
          padding: 4,
          borderWidth: 1,
          borderColor: a.inputBorder,
        },
        roleButton: {
          flex: 1,
          height: 48,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: 2,
        },
        roleButtonSelected: {
          backgroundColor: a.btnLoginBg,
          shadowColor: a.btnLoginBg,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 2,
        },
        roleButtonContent: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        },
        roleButtonText: {
          fontSize: theme.font.base,
          fontWeight: '600',
          color: a.textMuted,
          textAlign: 'center',
          letterSpacing: 0.3,
        },
        roleButtonTextSelected: {
          color: '#FFFFFF',
        },
        inputContainer: {
          position: 'relative',
          marginBottom: 16,
        },
        nameRow: {
          flexDirection: 'row',
        },
        nameInputContainer: {
          backgroundColor: a.inputBg,
          borderWidth: 1,
          borderColor: a.inputBorder,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          height: CONTROL_HEIGHT - 8,
          marginBottom: 16,
        },
        nameInputWrapper: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          gap: 8,
        },
        nameSeparator: {
          width: 1,
          height: '60%',
          backgroundColor: a.inputBorder,
          opacity: 0.5,
        },
        nameInput: {
          flex: 1,
          color: a.text,
          paddingVertical: 12,
          letterSpacing: 0.3,
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
        passwordToggle: {
          position: 'absolute',
          right: 16,
          top: '50%',
          marginTop: -12,
          padding: 4,
          zIndex: 1,
        },
        loginLink: {
          color: a.btnLoginBg,
          fontWeight: '600',
          fontSize: theme.font.base,
          marginTop: 16,
          marginBottom: 8,
          textAlign: 'center',
        },
        scrollView: {
          maxHeight: 400,
        },
      }),
    [a, theme.font.base]
  );


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
              <Text style={styles.ctaText} maxFontSizeMultiplier={1.5}>{t(locale, "signup.headline")}</Text>
              
              <View style={styles.roleSelection}>
                <Text style={styles.roleLabel} maxFontSizeMultiplier={1.5}>{t(locale, "signup.staffRoleLabel")}</Text>
                <View style={styles.roleButtons}>
                  <Pressable
                    style={[
                      styles.roleButton,
                      staffRole === 'receptionist' && styles.roleButtonSelected
                    ]}
                    onPress={() => setStaffRole('receptionist')}
                  >
                    <View style={styles.roleButtonContent}>
                      <IconClipboardText 
                        size={24} 
                        color={staffRole === 'receptionist' ? '#FFFFFF' : a.textMuted} 
                      />
                      <Text style={[
                        styles.roleButtonText,
                        staffRole === 'receptionist' && styles.roleButtonTextSelected
                      ]}>
                        {t(locale, "signup.staffRoleReceptionist")}
                      </Text>
                    </View>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.roleButton,
                      staffRole === 'driver' && styles.roleButtonSelected
                    ]}
                    onPress={() => setStaffRole('driver')}
                  >
                    <View style={styles.roleButtonContent}>
                      <IconCar 
                        size={24} 
                        color={staffRole === 'driver' ? '#FFFFFF' : a.textMuted} 
                      />
                      <Text style={[
                        styles.roleButtonText,
                        staffRole === 'driver' && styles.roleButtonTextSelected,
                        { color: staffRole === 'driver' ? "#FFFFFF" : a.textMuted },
                      ]} maxFontSizeMultiplier={1.5}>{t(locale, "signup.staffRoleDriver")}</Text>
                    </View>
                  </Pressable>
                </View>
              </View>

              <Text style={styles.inputLabel} maxFontSizeMultiplier={1.5}>{t(locale, "signup.fullName")}</Text>
                <View style={styles.nameInputContainer}>
                  <View style={styles.nameInputWrapper}>
                    <IconUser 
                      size={20} 
                      color={a.textMuted} 
                    />
                    <TextInput
                      style={styles.nameInput}
                      value={firstName}
                      onChangeText={setFirstName}
                      placeholder={t(locale, "signup.placeholderFirstName")}
                      placeholderTextColor={a.textMuted}
                      autoCapitalize="words"
                      textContentType="givenName"
                      autoComplete="name-given"
                    />
                  </View>
                  <View style={styles.nameSeparator} />
                  <View style={styles.nameInputWrapper}>
                    <IconUser 
                      size={20} 
                      color={a.textMuted} 
                    />
                    <TextInput
                      style={styles.nameInput}
                      value={lastName}
                      onChangeText={setLastName}
                      placeholder={t(locale, "signup.placeholderLastName")}
                      placeholderTextColor={a.textMuted}
                      autoCapitalize="words"
                      textContentType="familyName"
                      autoComplete="name-family"
                    />
                  </View>
                </View>
                
                <Text style={styles.inputLabel} maxFontSizeMultiplier={1.5}>{t(locale, "signup.email")}</Text>
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
                
                <Text style={styles.inputLabel} maxFontSizeMultiplier={1.5}>{t(locale, "signup.password")}</Text>
                <View style={styles.inputContainer}>
                  <IconLock 
                    size={20} 
                    color={a.textMuted} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder={t(locale, "auth.password.placeholder")}
                    placeholderTextColor={a.textMuted}
                    secureTextEntry={!showPassword}
                    textContentType="oneTimeCode"
                    autoComplete="password-new"
                  />
                  <Pressable
                    style={styles.passwordToggle}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <IconEyeOff size={20} color={a.textMuted} />
                    ) : (
                      <IconEye size={20} color={a.textMuted} />
                    )}
                  </Pressable>
                </View>

              <View style={{ marginBottom: 16 }} />

              <Pressable
                onPress={async () => {
                  setError(null);
                  if (!firstName || !lastName || !email || !password) {
                    setError(t(locale, "auth.validation.requiredFields"));
                    return;
                  }
                  setIsLoading(true);
                  const result = await signup({
                    firstName,
                    lastName,
                    email,
                    password,
                    valetStaffRole: staffRole.toUpperCase() as 'RECEPTIONIST' | 'DRIVER',
                  });
                  setIsLoading(false);
                  if (result.success && result.user) {
                    setUser(result.user);
                    router.replace("/home");
                  } else {
                    setError(result.error ? translateError(result.error, locale, t) : t(locale, "auth.signup.failed"));
                  }
                }}
                style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPressed]}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={a.btnSignupText} />
                ) : (
                  <Text style={styles.btnPrimaryText} maxFontSizeMultiplier={1.5}>{t(locale, "signup.submit")}</Text>
                )}
              </Pressable>
              
              {error && (
                <AuthMessage type="error" message={error} />
              )}
              
              <Pressable onPress={() => router.push("/login")}>
                <Text style={styles.loginLink} maxFontSizeMultiplier={1.5}>{t(locale, "signup.hasAccount")}</Text>
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
