import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Modal,
  FlatList,
  Platform,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Constants from "expo-constants";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IconUser, IconCircleCheck, IconMail, IconClipboardText, IconCar, IconPhone, IconHome2, IconCamera, IconGallery, IconId, IconList, IconCalendar } from "@/components/Icons";
import { IconEdit } from "@/components/IconEdit";
import { ValetBackButton } from "@/components/ValetBackButton";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import type { ValetStaffRole } from "@parkit/shared";
import { useAuthStore, useLocaleStore } from "@/lib/store";
import { useCompanyContext } from "@/lib/useCompanyContext";
import { t } from "@/lib/i18n";
import { useValetTheme, useResponsiveLayout } from "@/theme/valetTheme";
import { StickyFormFooter } from "@/components/StickyFormFooter";
import api from "@/lib/api";
import { messageFromAxios } from "@parkit/shared";
import { saveUser } from "@/lib/auth";
import { createFeedback } from "@/lib/feedback";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LICENSE_TYPE_OPTIONS, LICENSE_TYPE_VALUES, labelForLicenseType } from "@/lib/licenseTypes";
import {
  formatPhoneInternational,
  formatPhoneWithCountryCode,
  getDeviceCountryCode,
  isValidPhoneOptional,
  phoneDigitsForApi,
} from "@/lib/phoneInternational";

import { formatYmdLocal, parseYmdLocal } from "@/lib/dateUtils";
import { EMAIL_RE } from "@/lib/validation";

type MePayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  avatarUrl?: string | null;
};

export default function ProfileScreen() {
  const router = useRouter();
  const locale = useLocaleStore((s) => s.locale);
  const { user, mergeUser } = useAuthStore();
  const theme = useValetTheme();
  const responsive = useResponsiveLayout();
  const insets = useSafeAreaInsets();
  useCompanyContext(user);
  const styles = useMemo(
    () => createStyles(theme, responsive.contentMaxWidth, responsive.sectionPadding),
    [theme, responsive.contentMaxWidth, responsive.sectionPadding]
  );
  const C = theme.colors;
  const feedback = useMemo(() => createFeedback(locale), [locale]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  /** Local preview (data URL) or null if user removed the photo before saving */
  const [localAvatar, setLocalAvatar] = useState<string | null | undefined>(undefined);
  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const [staffRole, setStaffRole] = useState<ValetStaffRole>(
    user?.valetStaffRole === "DRIVER" ? "DRIVER" : "RECEPTIONIST"
  );
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [licenseModalOpen, setLicenseModalOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<"firstName" | "lastName" | "email" | "phone", string>>
  >({});

  // Estados para valores originales (para detectar cambios)
  const [originalFirstName, setOriginalFirstName] = useState("");
  const [originalLastName, setOriginalLastName] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [originalPhone, setOriginalPhone] = useState("");
  const [originalStaffRole, setOriginalStaffRole] = useState<ValetStaffRole>(
    user?.valetStaffRole === "DRIVER" ? "DRIVER" : "RECEPTIONIST"
  );
  const [originalLicenseTypes, setOriginalLicenseTypes] = useState<string[]>([]);
  const [originalLicenseExpiryYmd, setOriginalLicenseExpiryYmd] = useState("");
  const [licenseTypes, setLicenseTypes] = useState<string[]>([]);
  /** YYYY-MM-DD local o "" */
  const [licenseExpiryYmd, setLicenseExpiryYmd] = useState("");
  const [expiryPickerOpen, setExpiryPickerOpen] = useState(false);
  const [originalAvatarRemoved, setOriginalAvatarRemoved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const hasChanges = useMemo(() => {
    if (saving) return false;
    return (
      firstName !== originalFirstName ||
      lastName !== originalLastName ||
      email !== originalEmail ||
      phone !== originalPhone ||
      staffRole !== originalStaffRole ||
      licenseExpiryYmd !== originalLicenseExpiryYmd ||
      avatarRemoved !== originalAvatarRemoved ||
      localAvatar !== undefined ||
      JSON.stringify([...licenseTypes].sort()) !== JSON.stringify([...originalLicenseTypes].sort())
    );
  }, [
    firstName, lastName, email, phone, staffRole, licenseExpiryYmd,
    avatarRemoved, localAvatar, licenseTypes, saving,
    originalFirstName, originalLastName, originalEmail, originalPhone,
    originalStaffRole, originalLicenseExpiryYmd, originalAvatarRemoved, originalLicenseTypes
  ]);

  useEffect(() => {
    const r = user?.valetStaffRole;
    if (r === "DRIVER" || r === "RECEPTIONIST") {
      setStaffRole(r);
    }
  }, [user?.valetStaffRole]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [uRes, vRes] = await Promise.all([
        api.get<{ data: MePayload }>("/users/me"),
        api
          .get<{
            data: {
              staffRole?: string | null;
              licenseNumber?: string | null;
              licenseExpiry?: string | null;
            };
          }>("/valets/me")
          .catch(() => null),
      ]);
      const d = uRes.data?.data;
      if (d) {
        const fn = String(d.firstName ?? "");
        const ln = String(d.lastName ?? "");
        const em = String(d.email ?? "");
        const ph = formatPhoneWithCountryCode(d.phone != null ? String(d.phone) : "", getDeviceCountryCode());
        setFirstName(fn);
        setLastName(ln);
        setEmail(em);
        setPhone(ph);
        setOriginalFirstName(fn);
        setOriginalLastName(ln);
        setOriginalEmail(em);
        setOriginalPhone(ph);
        setOriginalAvatarRemoved(false);
        setLocalAvatar(undefined);
        setAvatarRemoved(false);
      } else { /* empty */ }
      const vd = vRes?.data?.data;
      if (vd) {
        if (vd.staffRole === "DRIVER" || vd.staffRole === "RECEPTIONIST") {
          setStaffRole(vd.staffRole);
          setOriginalStaffRole(vd.staffRole);
        }
        if (vd.staffRole === "DRIVER") {
          const raw = String(vd.licenseNumber ?? "");
          const parts = raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
          const allowed = new Set<string>([...LICENSE_TYPE_VALUES]);
          const filteredTypes = parts.filter((p) => allowed.has(p));
          setLicenseTypes(filteredTypes);
          setOriginalLicenseTypes(filteredTypes);
          if (vd.licenseExpiry) {
            const dt = new Date(String(vd.licenseExpiry));
            const ymd = Number.isNaN(dt.getTime()) ? "" : formatYmdLocal(dt);
            setLicenseExpiryYmd(ymd);
            setOriginalLicenseExpiryYmd(ymd);
          } else {
            setLicenseExpiryYmd("");
            setOriginalLicenseExpiryYmd("");
          }
        } else {
          setLicenseTypes([]);
          setOriginalLicenseTypes([]);
          setLicenseExpiryYmd("");
          setOriginalLicenseExpiryYmd("");
        }
      } else { /* empty */ }
    } catch (err) {
      feedback.error(t(locale, "profile.loadError"));
    } finally {
      setLoading(false);
    }
  }, [feedback, locale]);

  useEffect(() => {
    load();
  }, [load]);

  /** After «Remove photo» do not show the server URL until saving. */
  const displayAvatarUri = useMemo(() => {
    if (avatarRemoved) return null;
    if (typeof localAvatar === "string" && localAvatar.length > 0) return localAvatar;
    return user?.avatarUrl?.trim() || null;
  }, [avatarRemoved, localAvatar, user?.avatarUrl]);

  const hasPhotoPending = typeof localAvatar === "string" && localAvatar.length > 0;

  const processPickedUri = async (uri: string) => {
    try {
      console.log("Processing image URI:", uri);
      
      // Validate URI before processing
      if (!uri || typeof uri !== 'string') {
        throw new Error('Invalid image URI provided');
      }
      
      const manipulated = await manipulateAsync(
        uri,
        [{ resize: { width: 480 } }],
        { compress: 0.82, format: SaveFormat.JPEG, base64: true }
      );
      
      if (!manipulated.base64) {
        throw new Error('Failed to process image - no base64 data returned');
      }
      
      const dataUri = `data:image/jpeg;base64,${manipulated.base64}`;
      console.log("Image processed successfully, data URI length:", dataUri.length);
      
      setLocalAvatar(dataUri);
      setAvatarRemoved(false);
      
      // Provide success feedback
      feedback.success(t(locale, "profile.photoUpdated") || "Photo updated successfully");
    } catch (error) {
      console.error("Error in processPickedUri:", error);
      
      let errorMessage = t(locale, "profile.photoProcessError");
      if (error instanceof Error) {
        if (error.message.includes('file') || error.message.includes('URI')) {
          errorMessage = t(locale, "profile.photoProcessError");
        } else if (error.message.includes('memory') || error.message.includes('size')) {
          errorMessage = t(locale, "profile.photoProcessError");
        }
      }
      
      feedback.error(errorMessage);
    }
  };

  const pickImage = async () => {
    try {
      console.log("Requesting media library permissions...");
      
      // On web, permissions work differently
      if (Platform.OS === "web") {
        console.log("Web platform detected, launching image picker...");
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
        console.log("Web image picker result:", result);
        
        if (result.canceled) {
          console.log("User cancelled image selection");
          return;
        }
        
        if (!result.assets?.[0]?.uri) {
          console.log("No image URI returned");
          feedback.error(t(locale, "profile.photoProcessError"));
          return;
        }
        
        await processPickedUri(result.assets[0].uri);
        return;
      }
      
      // Check if running in Expo Go
      if (Constants.appOwnership === 'expo') {
        console.log("Running in Expo Go - using simplified approach");
      }
      
      // First check current permission status
      const { status: currentStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
      console.log("Current media library permission status:", currentStatus);
      
      let status = currentStatus;
      
      // Always request if not granted (including undetermined)
      if (currentStatus !== 'granted') {
        console.log("Requesting media library permissions...");
        const { status: requestedStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        status = requestedStatus;
        console.log("Media library permission status after request:", status);
      }
      
      // For Expo Go, if still not granted after request, try one more time
      if (Constants.appOwnership === 'expo' && status !== 'granted') {
        console.log("Expo Go: Permission not granted, trying alternative approach...");
        // Try direct request without checking first
        const { status: retryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        status = retryStatus;
        console.log("Expo Go: Retry permission status:", status);
      }
      
      if (status !== 'granted') {
        console.log("Media library permission denied");
        // For Expo Go, provide more specific guidance
        if (Constants.appOwnership === 'expo') {
          feedback.error("Para acceder a la galería en Expo Go, ve a Configuración > Aplicaciones > Expo Go > Permisos y activa 'Almacenamiento'.");
          return;
        }
        feedback.error(t(locale, "profile.photoPermissionDenied"));
        return;
      }
      
      console.log("Launching image library...");
      // Use simplified options for Expo Go compatibility
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: Constants.appOwnership !== 'expo', // Disable editing in Expo Go
        aspect: Constants.appOwnership !== 'expo' ? [1, 1] : undefined,
        quality: 0.8,
      });
      console.log("Image library result:", result);
      
      if (result.canceled) {
        console.log("User cancelled image selection");
        return;
      }
      
      if (!result.assets?.[0]?.uri) {
        console.log("No image URI returned");
        feedback.error(t(locale, "profile.photoProcessError"));
        return;
      }
      
      await processPickedUri(result.assets[0].uri);
    } catch (error) {
      console.error("Error in pickImage:", error);
      // Provide more specific error messages for Expo Go
      if (Constants.appOwnership === 'expo') {
        feedback.error("Error al abrir la galería en Expo Go. Intenta reiniciar la app o usar una development build.");
        return;
      }
      if (error instanceof Error) {
        if (error.message.includes('Permission')) {
          feedback.error(t(locale, "profile.photoPermissionDenied"));
        } else {
          feedback.error(`${t(locale, "profile.photoProcessError")}: ${error.message}`);
        }
      } else {
        feedback.error(t(locale, "profile.photoProcessError"));
      }
    }
  };

  const takePhoto = async () => {
    try {
      console.log("Requesting camera permissions...");
      
      // On web, camera works differently and may not be available
      if (Platform.OS === "web") {
        console.log("Web platform detected, camera may not be fully supported");
        feedback.error("Camera is not fully supported on web. Please use gallery option.");
        return;
      }
      
      // Check if running in Expo Go
      if (Constants.appOwnership === 'expo') {
        console.log("Running in Expo Go - using simplified camera approach");
      }
      
      // First check current permission status
      const { status: currentStatus } = await ImagePicker.getCameraPermissionsAsync();
      console.log("Current camera permission status:", currentStatus);
      
      let status = currentStatus;
      
      // Always request if not granted (including undetermined)
      if (currentStatus !== 'granted') {
        console.log("Requesting camera permissions...");
        const { status: requestedStatus } = await ImagePicker.requestCameraPermissionsAsync();
        status = requestedStatus;
        console.log("Camera permission status after request:", status);
      }
      
      // For Expo Go, if still not granted after request, try one more time
      if (Constants.appOwnership === 'expo' && status !== 'granted') {
        console.log("Expo Go: Camera permission not granted, trying alternative approach...");
        // Try direct request without checking first
        const { status: retryStatus } = await ImagePicker.requestCameraPermissionsAsync();
        status = retryStatus;
        console.log("Expo Go: Retry camera permission status:", status);
      }
      
      if (status !== 'granted') {
        console.log("Camera permission denied");
        // For Expo Go, provide more specific guidance
        if (Constants.appOwnership === 'expo') {
          feedback.error("Para acceder a la cámara en Expo Go, ve a Configuración > Aplicaciones > Expo Go > Permisos y activa 'Cámara'.");
          return;
        }
        // Provide more specific error message
        const errorMessage = Platform.OS === 'ios' 
          ? t(locale, "profile.photoCameraDenied")
          : t(locale, "profile.photoCameraDenied");
        feedback.error(errorMessage);
        return;
      }
      
      console.log("Launching camera...");
      // Use simplified options for Expo Go compatibility
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: Constants.appOwnership !== 'expo', // Disable editing in Expo Go
        aspect: Constants.appOwnership !== 'expo' ? [1, 1] : undefined,
        quality: 0.8,
      });
      console.log("Camera result:", result);
      
      if (result.canceled) {
        console.log("User cancelled camera");
        return;
      }
      
      if (!result.assets?.[0]?.uri) {
        console.log("No image URI returned from camera");
        feedback.error(t(locale, "profile.photoProcessError"));
        return;
      }
      
      await processPickedUri(result.assets[0].uri);
    } catch (error) {
      console.error("Error in takePhoto:", error);
      // Provide more specific error messages for Expo Go
      if (Constants.appOwnership === 'expo') {
        feedback.error("Error al abrir la cámara en Expo Go. Intenta reiniciar la app o usar una development build.");
        return;
      }
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Permission')) {
          feedback.error(t(locale, "profile.photoCameraDenied"));
        } else if (error.message.includes('Camera')) {
          feedback.error(t(locale, "profile.photoCameraDenied"));
        } else {
          feedback.error(`${t(locale, "profile.photoProcessError")}: ${error.message}`);
        }
      } else {
        feedback.error(t(locale, "profile.photoProcessError"));
      }
    }
  };

  const validate = useCallback((): boolean => {
    const fn = firstName.trim();
    const ln = lastName.trim();
    const em = email.trim();
    const ph = phone;

    const nextErr: Partial<Record<"firstName" | "lastName" | "email" | "phone", string>> = {};

    if (!fn) {
      nextErr.firstName = t(locale, "profile.errorFirstNameRequired");
    } else if (fn.length < 2) {
      nextErr.firstName = t(locale, "profile.errorNameLength");
    }

    if (!ln) {
      nextErr.lastName = t(locale, "profile.errorLastNameRequired");
    } else if (ln.length < 2) {
      nextErr.lastName = t(locale, "profile.errorNameLength");
    }

    if (!em) {
      nextErr.email = t(locale, "profile.errorEmailRequired");
    } else if (!EMAIL_RE.test(em)) {
      nextErr.email = t(locale, "profile.errorEmailInvalid");
    }

    if (!isValidPhoneOptional(ph)) {
      nextErr.phone = t(locale, "profile.errorPhoneInvalid");
    }

    if (Object.keys(nextErr).length > 0) {
      setFieldErrors(nextErr);
      const firstMsg =
        nextErr.firstName ||
        nextErr.lastName ||
        nextErr.email ||
        nextErr.phone ||
        t(locale, "profile.errorRequired");
      feedback.error(firstMsg);
      return false;
    }

    setFieldErrors({});
    return true;
  }, [firstName, lastName, email, phone, locale, feedback]);

  const handleSave = async () => {
    if (!validate()) return;

    const fn = firstName.trim();
    const ln = lastName.trim();
    const em = email.trim();
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        firstName: fn,
        lastName: ln,
        email: em,
        phone: phoneDigitsForApi(phone),
      };
      if (avatarRemoved || typeof localAvatar === "string") {
        payload.avatarUrl = avatarRemoved ? null : localAvatar;
      }
      const res = await api.patch<{ data: MePayload }>("/users/me", payload);
      const d = res.data?.data;

      const valetPatch: {
        staffRole: ValetStaffRole;
        licenseNumber: string | null;
        licenseExpiry: string | null;
      } = {
        staffRole,
        licenseNumber: null,
        licenseExpiry: null,
      };
      if (staffRole === "DRIVER") {
        valetPatch.licenseNumber =
          licenseTypes.length > 0
            ? [...licenseTypes].sort((a, b) => a.localeCompare(b)).join(", ")
            : null;
        valetPatch.licenseExpiry = licenseExpiryYmd.trim()
          ? new Date(`${licenseExpiryYmd.trim()}T12:00:00`).toISOString()
          : null;
      }
      await api.patch("/valets/me", valetPatch);

      if (d && user) {
        const nextAvatar =
          avatarRemoved || d.avatarUrl === null || d.avatarUrl === ""
            ? null
            : d.avatarUrl != null
              ? String(d.avatarUrl)
              : typeof localAvatar === "string"
                ? localAvatar
                : user.avatarUrl ?? null;
        mergeUser({
          firstName: String(d.firstName ?? fn),
          lastName: String(d.lastName ?? ln),
          email: String(d.email ?? em),
          phone: d.phone != null ? formatPhoneInternational(String(d.phone)) : null,
          avatarUrl: nextAvatar,
          valetStaffRole: staffRole,
        });
        const next = useAuthStore.getState().user;
        if (next) await saveUser(next);
        setLocalAvatar(undefined);
        setAvatarRemoved(false);
        if (d.phone != null) {
          setPhone(formatPhoneWithCountryCode(String(d.phone), getDeviceCountryCode()));
        } else {
          setPhone("");
        }
        // Actualizar los valores originales después de guardar exitosamente
        setOriginalFirstName(fn);
        setOriginalLastName(ln);
        setOriginalEmail(em);
        setOriginalPhone(phone);
        setOriginalStaffRole(staffRole);
        setOriginalLicenseExpiryYmd(licenseExpiryYmd);
        setOriginalLicenseTypes([...licenseTypes]);
        setOriginalAvatarRemoved(false);
        
        setIsEditing(false);
      }
    } catch (e) {
      const msg = messageFromAxios(e);
      feedback.error(
        msg === "NETWORK_ERROR"
          ? t(locale, "common.networkError")
          : msg || t(locale, "profile.saveError")
      );
    } finally {
      setSaving(false);
    }
  };

  const licenseCodesDisplay = useMemo(
    () => LICENSE_TYPE_VALUES.filter((v) => licenseTypes.includes(v)).join(", "),
    [licenseTypes]
  );

  const toggleLicenseType = (value: string) => {
    setLicenseTypes((prev) => {
      const next = prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value];
      return [...next].sort((a, b) => a.localeCompare(b));
    });
  };

  const onExpiryChange = (event: { type?: string }, date?: Date) => {
    if (Platform.OS === "android") {
      setExpiryPickerOpen(false);
      if (event.type === "dismissed") return;
    }
    if (date) {
      setLicenseExpiryYmd(formatYmdLocal(date));
    }
  };

  const openPhotoChooser = () => {
    console.log("openPhotoChooser called, platform:", Platform.OS);
    if (Platform.OS === "web") {
      // On web, still show modal but with different behavior
      setPhotoModalOpen(true);
      return;
    }
    setPhotoModalOpen(true);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.card}
        translucent={Platform.OS === "android"}
      />
      <View style={styles.frame}>
      <View style={styles.flex}>
        <View style={[styles.header, { paddingTop: insets.top + theme.space.md }]}>
          {isEditing ? (
            <ValetBackButton
              onPress={() => {
                // Salir de modo edición
                setIsEditing(false);
              }}
              accessibilityLabel={t(locale, "common.back")}
            />
          ) : (
            <Pressable 
              onPress={() => {
                // Entrar en modo edición
                setIsEditing(true);
              }} 
              style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
            >
              <IconEdit size={24} color={C.text} />
            </Pressable>
          )}
          <Text style={styles.headerTitle}>{t(locale, "profile.title")}</Text>
          <Pressable onPress={() => router.replace("/home")} style={{ width: 44, alignItems: "center", justifyContent: "center" }}>
            <IconHome2 size={24} color={C.text} />
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={C.primary} />
            <Text style={styles.loadingText}>{t(locale, "common.loading")}</Text>
          </View>
        ) : isEditing ? (
          <View style={styles.bodyColumn}>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.avatarBlock}>
                <Pressable
                  onPress={openPhotoChooser}
                  style={({ pressed }) => [
                    styles.avatarRing,
                    { borderColor: hasPhotoPending ? "#F59E0B" : C.border },
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={t(locale, "profile.changePhoto")}
                >
                  {displayAvatarUri ? (
                    <Image source={{ uri: displayAvatarUri }} style={styles.avatarImage} />
                  ) : (
                    <View style={[styles.avatarPlaceholder, { backgroundColor: theme.isDark ? "rgba(148,163,184,0.15)" : "rgba(100,116,139,0.15)" }]}>
                      <IconUser size={60} color={C.textMuted} />
                    </View>
                  )}
                </Pressable>
                <Text style={[styles.avatarSub, { color: C.textMuted }]}>
                  {t(locale, "profile.tapToChangePhoto")}
                </Text>
              </View>

            <View style={styles.roleSelection}>
              <Text style={styles.roleLabel}>{t(locale, "profile.staffRoleLabel")}</Text>
              <View style={styles.roleButtons}>
                <Pressable
                  style={[
                    styles.roleButton,
                    staffRole === 'RECEPTIONIST' && styles.roleButtonSelected
                  ]}
                  onPress={() => {
                    setStaffRole('RECEPTIONIST');
                    setLicenseTypes([]);
                    setLicenseExpiryYmd("");
                  }}
                >
                  <View style={styles.roleButtonContent}>
                    <IconClipboardText
                      size={24}
                      color={staffRole === 'RECEPTIONIST' ? '#FFFFFF' : C.textMuted}
                    />
                    <Text style={[
                      styles.roleButtonText,
                      staffRole === 'RECEPTIONIST' && styles.roleButtonTextSelected
                    ]}>
                      {t(locale, "profile.receptionistRole")}
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  style={[
                    styles.roleButton,
                    staffRole === 'DRIVER' && styles.roleButtonSelected
                  ]}
                  onPress={() => setStaffRole('DRIVER')}
                >
                  <View style={styles.roleButtonContent}>
                    <IconCar
                      size={24}
                      color={staffRole === 'DRIVER' ? '#FFFFFF' : C.textMuted}
                    />
                    <Text style={[
                      styles.roleButtonText,
                      staffRole === 'DRIVER' && styles.roleButtonTextSelected
                    ]}>
                      {t(locale, "profile.driverRole")}
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>

            <Text style={styles.inputLabel} maxFontSizeMultiplier={1.5}>{t(locale, "profile.fullName")}</Text>
              <View style={styles.nameInputContainer}>
                <View style={styles.nameInputWrapper}>
                  <IconUser 
                    size={20} 
                    color={C.textMuted} 
                  />
                  <TextInput
                    style={styles.nameInput}
                    value={firstName}
                    onChangeText={(v) => {
                      setFirstName(v);
                      if (fieldErrors.firstName) setFieldErrors((e) => ({ ...e, firstName: undefined }));
                    }}
                    placeholder={t(locale, "profile.placeholderFirstName")}
                    placeholderTextColor={C.textSubtle}
                    autoCapitalize="words"
                    textContentType="givenName"
                    autoComplete="name-given"
                  />
                </View>
                <View style={styles.nameSeparator} />
                <View style={styles.nameInputWrapper}>
                  <IconUser 
                    size={20} 
                    color={C.textMuted} 
                  />
                  <TextInput
                    style={styles.nameInput}
                    value={lastName}
                    onChangeText={(v) => {
                      setLastName(v);
                      if (fieldErrors.lastName) setFieldErrors((e) => ({ ...e, lastName: undefined }));
                    }}
                    placeholder={t(locale, "profile.placeholderLastName")}
                    placeholderTextColor={C.textSubtle}
                    autoCapitalize="words"
                    textContentType="familyName"
                    autoComplete="name-family"
                  />
                </View>
              </View>
              {fieldErrors.firstName ? (
                <Text style={styles.fieldError}>{fieldErrors.firstName}</Text>
              ) : null}
              {fieldErrors.lastName ? (
                <Text style={styles.fieldError}>{fieldErrors.lastName}</Text>
              ) : null}

            <Text style={styles.label}>
              {t(locale, "profile.email")}
              <Text style={{ color: C.logout }}> *</Text>
            </Text>
            <View style={styles.inputContainer}>
              <IconMail size={20} color={C.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input,
                  { borderColor: fieldErrors.email ? C.logout : C.border },
                ]}
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  if (fieldErrors.email) setFieldErrors((e) => ({ ...e, email: undefined }));
                }}
                placeholder={t(locale, "profile.placeholderEmail")}
                placeholderTextColor={C.textSubtle}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                textContentType="none"
                dataDetectorTypes="none"
              />
            </View>
            {fieldErrors.email ? <Text style={styles.fieldError}>{fieldErrors.email}</Text> : null}

            <Text style={styles.label}>{t(locale, "profile.phone")}</Text>
            <View style={styles.inputContainer}>
              <IconPhone size={20} color={C.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input,
                  { borderColor: fieldErrors.phone ? C.logout : C.border },
                ]}
                value={phone}
                onChangeText={(v) => {
                  setPhone(formatPhoneWithCountryCode(v, getDeviceCountryCode()));
                  if (fieldErrors.phone) setFieldErrors((e) => ({ ...e, phone: undefined }));
                }}
                placeholder={t(locale, "profile.placeholderPhone")}
                placeholderTextColor={C.textSubtle}
                keyboardType="default"
                autoComplete="tel"
                textContentType="telephoneNumber"
              />
            </View>
            {fieldErrors.phone ? <Text style={styles.fieldError}>{fieldErrors.phone}</Text> : null}

            {staffRole === "DRIVER" && (
              <>
                <Text style={styles.label}>{t(locale, "profile.licenseTypesLabel")}</Text>
                <Pressable
                  style={({ pressed }) => [
                    styles.input,
                    { borderColor: C.border, backgroundColor: C.card, position: 'relative' },
                    pressed && styles.pressed,
                  ]}
                  onPress={() => setLicenseModalOpen(true)}
                  accessibilityRole="button"
                  accessibilityLabel={t(locale, "profile.licensePickerTitle")}
                >
                  <IconId size={20} color={C.textMuted} style={{ position: 'absolute', left: 16, top: '50%', marginTop: 0, zIndex: 1 }} />
                  <Text
                    style={[{ color: C.text, paddingTop: 4, textAlignVertical: 'center', fontSize: theme.font.base, fontFamily: theme.fontFamily.primary }]} numberOfLines={1}
                  >
                    {licenseCodesDisplay || t(locale, "profile.licenseTypesPlaceholder")}
                  </Text>
                  <IconList size={16} color={C.textMuted} style={{ position: 'absolute', right: 16, top: '50%', marginTop: 0, zIndex: 1 }} />
                </Pressable>

                <Modal
                  visible={licenseModalOpen}
                  animationType="slide"
                  transparent
                  onRequestClose={() => setLicenseModalOpen(false)}
                >
                  <View style={styles.modalOverlay}>
                    <Pressable
                      style={styles.modalBackdropPress}
                      onPress={() => setLicenseModalOpen(false)}
                      accessibilityLabel={t(locale, "common.cancel")}
                    />
                    <View
                      style={[styles.modalSheetLicense, { backgroundColor: C.card, borderColor: C.border }]}
                    >
                      <Text style={[styles.modalTitle, { color: C.text }]}>
                        {t(locale, "profile.licensePickerTitle")}
                      </Text>
                      <FlatList
                        data={LICENSE_TYPE_OPTIONS}
                        keyExtractor={(item) => item.value}
                        style={styles.modalListLicense}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => {
                          const selected = licenseTypes.includes(item.value);
                          return (
                            <Pressable
                              style={({ pressed }) => [
                                styles.licenseOptionRow,
                                { borderBottomColor: C.border },
                                pressed && styles.pressed,
                              ]}
                              onPress={() => toggleLicenseType(item.value)}
                            >
                              <View style={styles.licenseOptionText}>
                                <Text style={[styles.roleRowName, { color: C.text }]} numberOfLines={2}>
                                  {labelForLicenseType(item.value, locale)}
                                </Text>
                              </View>
                              {selected && <IconCircleCheck size={26} color={C.primary} />}
                            </Pressable>
                          );
                        }}
                      />
                      <Pressable style={styles.modalDoneBtn} onPress={() => setLicenseModalOpen(false)}>
                        <Text style={[styles.modalDoneBtnText, { color: C.primary }]}>
                          {t(locale, "common.ok")}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>

                <View style={{ height: 16 }} />

                <Text style={styles.label}>{t(locale, "profile.licenseExpiryLabel")}</Text>
                <Pressable
                  onPress={() => setExpiryPickerOpen(true)}
                  style={({ pressed }) => [
                    styles.input,
                    { borderColor: C.border, backgroundColor: C.card, position: 'relative' },
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                >
                  <IconCalendar size={20} color={C.textMuted} style={{ position: 'absolute', left: 16, top: '50%', marginTop: 0, zIndex: 1 }} />
                  <Text
                    style={[{ color: C.text, paddingTop: 4, textAlignVertical: 'center', fontSize: theme.font.base, fontFamily: theme.fontFamily.primary }]} numberOfLines={1}
                  >
                    {licenseExpiryYmd.trim()
                      ? licenseExpiryYmd
                      : t(locale, "profile.licenseExpiryPlaceholder")}
                  </Text>
                  <IconList size={16} color={C.textMuted} style={{ position: 'absolute', right: 16, top: '50%', marginTop: 0, zIndex: 1 }} />
                </Pressable>
                {licenseExpiryYmd.trim() ? (
                  <Pressable onPress={() => setLicenseExpiryYmd("")} style={styles.clearExpiryLink}>
                    <Text style={[styles.secondaryLinkText, styles.dangerText]}>
                      {t(locale, "profile.licenseClearExpiry")}
                    </Text>
                  </Pressable>
                ) : null}

                {expiryPickerOpen && Platform.OS === "android" ? (
                  <DateTimePicker
                    value={parseYmdLocal(licenseExpiryYmd) ?? new Date()}
                    mode="date"
                    display="default"
                    onChange={onExpiryChange}
                  />
                ) : null}

                {expiryPickerOpen && Platform.OS === "ios" ? (
                  <Modal
                    transparent
                    animationType="slide"
                    visible={expiryPickerOpen}
                    onRequestClose={() => setExpiryPickerOpen(false)}
                  >
                    <View style={styles.iosExpiryOverlay}>
                      <Pressable
                        style={styles.modalBackdropPress}
                        onPress={() => setExpiryPickerOpen(false)}
                      />
                      <View style={[styles.iosExpirySheet, { backgroundColor: C.card }]}>
                        <View style={styles.iosExpiryToolbar}>
                          <Pressable onPress={() => setExpiryPickerOpen(false)} hitSlop={12}>
                            <Text style={[styles.iosExpiryToolbarBtn, { color: C.textMuted }]}>
                              {t(locale, "common.cancel")}
                            </Text>
                          </Pressable>
                          <Pressable onPress={() => setExpiryPickerOpen(false)} hitSlop={12}>
                            <Text style={[styles.iosExpiryToolbarBtn, { color: C.primary, fontWeight: "800" }]}>
                              {t(locale, "common.ok")}
                            </Text>
                          </Pressable>
                        </View>
                        <DateTimePicker
                          value={parseYmdLocal(licenseExpiryYmd) ?? new Date()}
                          mode="date"
                          display="spinner"
                          onChange={(_, date) => {
                            if (date) setLicenseExpiryYmd(formatYmdLocal(date));
                          }}
                        />
                      </View>
                    </View>
                  </Modal>
                ) : null}
              </>
            )}
            </ScrollView>

            <Modal
              visible={photoModalOpen}
              animationType="slide"
              transparent
              onRequestClose={() => setPhotoModalOpen(false)}
            >
              <View style={styles.modalOverlay}>
                <Pressable
                  style={styles.modalBackdropPress}
                  onPress={() => setPhotoModalOpen(false)}
                  accessibilityLabel={t(locale, "common.cancel")}
                />
                <View
                  style={[styles.modalSheet, { backgroundColor: C.card, borderColor: C.border }]}
                >
                  <Text style={[styles.modalTitle, { color: C.text }]}>
                    {t(locale, "profile.changePhoto")}
                  </Text>
                  <View style={styles.photoOptions}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.photoOption,
                        { borderColor: C.border, backgroundColor: C.card },
                        pressed && styles.pressed,
                      ]}
                      onPress={() => {
                        console.log("Gallery button pressed!");
                        setPhotoModalOpen(false);
                        console.log("Modal closed, calling pickImage...");
                        void pickImage();
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={t(locale, "profile.photoFromLibrary")}
                    >
                      <IconGallery size={24} color={C.primary} />
                      <Text style={[styles.photoOptionText, { color: C.text }]}>{t(locale, "profile.photoFromLibrary")}</Text>
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [
                        styles.photoOption,
                        { borderColor: C.border, backgroundColor: C.card },
                        pressed && styles.pressed,
                      ]}
                      onPress={() => {
                        console.log("Camera button pressed!");
                        setPhotoModalOpen(false);
                        console.log("Modal closed, calling takePhoto...");
                        void takePhoto();
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={t(locale, "profile.photoFromCamera")}
                    >
                      <IconCamera size={24} color={C.primary} />
                      <Text style={[styles.photoOptionText, { color: C.text }]}>{t(locale, "profile.photoFromCamera")}</Text>
                    </Pressable>
                  </View>
                  <Pressable style={styles.modalDoneBtn} onPress={() => setPhotoModalOpen(false)}>
                    <Text style={[styles.modalDoneBtnText, { color: C.primary }]}>
                      {t(locale, "common.cancel")}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Modal>

            <View>
              <StickyFormFooter keyboardPinned>
                <Pressable
                  style={({ pressed }) => [
                    styles.primaryBtnFooter,
                    { backgroundColor: C.primary },
                    (!hasChanges || saving) && styles.btnDisabled,
                    pressed && hasChanges && !saving && styles.pressed,
                  ]}
                  onPress={handleSave}
                  disabled={!hasChanges || saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryBtnText}>{t(locale, "profile.save")}</Text>
                  )}
                </Pressable>
              </StickyFormFooter>
            </View>
          </View>
        ) : (
          // Vista estática - modo lectura con look and feel de settings
          <View style={styles.bodyColumn}>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.avatarBlock}>
                <View style={[styles.avatarRing, { borderColor: C.border }]}>
                  {displayAvatarUri ? (
                    <Image source={{ uri: displayAvatarUri }} style={styles.avatarImage} />
                  ) : (
                    <View style={[styles.avatarPlaceholder, { backgroundColor: theme.isDark ? "rgba(148,163,184,0.15)" : "rgba(100,116,139,0.15)" }]}>
                      <IconUser size={60} color={C.textMuted} />
                    </View>
                  )}
                </View>
                <Text style={[styles.avatarSub, { color: C.textMuted }]}>
                  {t(locale, "profile.photo")}
                </Text>
              </View>

              <Text style={styles.sectionTitle}>{t(locale, "profile.personalInfo")}</Text>
              <View style={styles.settingsSection}>
                <View style={styles.settingsRow}>
                  {staffRole === 'DRIVER' ? (
                    <IconCar size={20} color={C.textMuted} style={styles.settingsIcon} />
                  ) : (
                    <IconClipboardText size={20} color={C.textMuted} style={styles.settingsIcon} />
                  )}
                  <View style={styles.settingsRowContent}>
                    <Text style={styles.settingsLabel}>{t(locale, "profile.staffRoleLabel")}</Text>
                    <Text style={styles.settingsValue}>{staffRole === 'DRIVER' ? t(locale, "profile.driverRole") : t(locale, "profile.receptionistRole")}</Text>
                  </View>
                </View>

                <View style={styles.settingsRow}>
                  <IconUser size={20} color={C.textMuted} style={styles.settingsIcon} />
                  <View style={styles.settingsRowContent}>
                    <Text style={styles.settingsLabel}>{t(locale, "profile.firstNameLabel")}</Text>
                    <Text style={styles.settingsValue}>{firstName} {lastName}</Text>
                  </View>
                </View>

                <View style={styles.settingsRow}>
                  <IconMail size={20} color={C.textMuted} style={styles.settingsIcon} />
                  <View style={styles.settingsRowContent}>
                    <Text style={styles.settingsLabel}>{t(locale, "profile.emailLabel")}</Text>
                    <Text style={styles.settingsValue}>{email}</Text>
                  </View>
                </View>

                {phone && (
                  <View style={[styles.settingsRow, styles.settingsRowLast]}>
                    <IconPhone size={20} color={C.textMuted} style={styles.settingsIcon} />
                    <View style={styles.settingsRowContent}>
                      <Text style={styles.settingsLabel}>{t(locale, "profile.phoneLabel")}</Text>
                      <Text style={styles.settingsValue}>{phone}</Text>
                    </View>
                  </View>
                )}
              </View>

              {staffRole === "DRIVER" && (
                <>
                  <Text style={styles.sectionTitle}>{t(locale, "profile.driverLicenseSection")}</Text>
                  <View style={styles.settingsSection}>
                    <View style={styles.settingsRow}>
                      <IconId size={20} color={C.textMuted} style={styles.settingsIcon} />
                      <View style={styles.settingsRowContent}>
                        <Text style={styles.settingsLabel}>{t(locale, "profile.licenseTypesLabel")}</Text>
                        <Text style={styles.settingsValue}>
                          {licenseTypes.length > 0 ? licenseCodesDisplay : t(locale, "profile.noLicenseTypes")}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.settingsRow, styles.settingsRowLast]}>
                      <IconCalendar size={20} color={C.textMuted} style={styles.settingsIcon} />
                      <View style={styles.settingsRowContent}>
                        <Text style={styles.settingsLabel}>{t(locale, "profile.licenseExpiryLabel")}</Text>
                        <Text style={styles.settingsValue}>
                          {licenseExpiryYmd ? new Date(licenseExpiryYmd).toLocaleDateString(locale === "es" ? "es-ES" : "en-US") : t(locale, "profile.noExpiryDate")}
                        </Text>
                      </View>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        )}
      </View>
      </View>
    </SafeAreaView>
  );
}

type Theme = ReturnType<typeof useValetTheme>;

function createStyles(theme: Theme, contentMaxWidth: number, sectionPadding: number) {
  const C = theme.colors;
  const S = theme.space;
  const F = theme.font;
  const R = theme.radius;

  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: C.bg, alignItems: "center" },
    frame: {
      flex: 1,
      width: "100%",
      maxWidth: contentMaxWidth,
    },
    flex: { flex: 1 },
    bodyColumn: { flex: 1, minHeight: 0 },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: sectionPadding,
      paddingVertical: S.xs,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: C.border,
      backgroundColor: C.card,
    },
    headerSpacer: { width: 44 },
    headerTitle: {
      flex: 1,
      textAlign: "center",
      fontSize: F.base,
      fontWeight: "800",
      color: C.text,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: S.md,
    },
    loadingText: { fontSize: F.base, color: C.textMuted },
    scroll: { flex: 1 },
    scrollContent: {
      paddingHorizontal: sectionPadding,
      paddingTop: S.lg,
      paddingBottom: S.xl,
    },
    intro: {
      fontSize: F.base,
      color: C.textMuted,
      lineHeight: 24,
      marginBottom: S.md,
      fontWeight: "600",
    },
    avatarBlock: { alignItems: "center", marginBottom: S.lg },
    avatarSub: {
      fontSize: F.base,
      textAlign: "center",
      marginTop: S.sm,
      fontWeight: "500",
    },
    avatarHint: {
      fontSize: F.base,
      textAlign: "center",
      marginTop: S.sm,
      marginBottom: S.md,
      fontWeight: "600",
      lineHeight: 18,
      paddingHorizontal: S.md,
    },
    avatarActionsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: S.sm,
      marginBottom: S.xs,
    },
    avatarChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: S.sm,
      paddingVertical: S.sm,
      paddingHorizontal: S.md,
      borderRadius: R.button,
      borderWidth: 2,
    },
    avatarChipText: {
      fontSize: F.base,
      fontWeight: "800",
    },
    avatarRing: {
      width: 80,
      height: 80,
      borderRadius: 40,
      overflow: "hidden",
      borderWidth: 3,
      borderColor: C.primary,
      backgroundColor: C.card,
    },
    avatarImage: { width: "100%", height: "100%" },
    avatarPlaceholder: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.isDark ? "rgba(148,163,184,0.12)" : "rgba(15,23,42,0.06)",
    },
    avatarInitials: {
      fontSize: F.base,
      fontWeight: "800",
      color: C.text,
      letterSpacing: 1,
    },
    secondaryLink: { paddingVertical: S.xs },
    secondaryLinkText: {
      fontSize: F.base,
      fontWeight: "700",
      color: C.primary,
    },
    dangerText: { color: C.logout },
    label: {
      fontSize: F.base,
      fontWeight: "500",
      color: C.text,
      marginBottom: S.sm,
    },
    inputLabel: {
      fontSize: F.base,
      fontWeight: "500",
      color: C.text,
      marginBottom: 6,
    },
    pickerRow: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 2,
      borderRadius: R.button,
      paddingHorizontal: S.md,
      paddingVertical: S.md,
      marginBottom: S.md,
      gap: S.sm,
    },
    pickerRowText: { flex: 1, minWidth: 0 },
    pickerRowTitle: {
      fontSize: F.base,
      fontWeight: "800",
    },
    pickerRowSub: {
      fontSize: F.base,
      fontWeight: "600",
      marginTop: 4,
      lineHeight: 18,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(15, 23, 42, 0.45)",
    },
    modalBackdropPress: {
      flex: 1,
    },
    modalSheet: {
      maxHeight: 320,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      borderWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: S.md,
      paddingTop: S.md,
      paddingBottom: S.lg,
    },
    modalTitle: {
      fontSize: F.base,
      fontWeight: "800",
      textAlign: "center",
      marginBottom: S.sm,
    },
    modalList: {
      maxHeight: 260,
    },
    roleRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: S.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      gap: S.sm,
      minHeight: 52,
    },
    roleRowText: { flex: 1, minWidth: 0 },
    roleRowName: {
      fontSize: F.base,
    },
    roleRowAddr: {
      fontSize: F.base,
      marginTop: 4,
      lineHeight: F.base,
    },
    input: {
      backgroundColor: theme.auth.inputBg,
      borderWidth: 1,
      borderColor: theme.auth.inputBorder,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingLeft: 48,
      fontSize: F.base,
      fontWeight: '600',
      letterSpacing: 0.3,
      color: theme.auth.text,
      height: 48,
    },
    inputIcon: {
      position: "absolute",
      left: 16,
      top: "50%",
      marginTop: -10,
      zIndex: 1,
    },
    inputContainer: {
      position: "relative",
      marginBottom: S.md,
    },
    nameRow: {
      flexDirection: "row",
      gap: 12,
    },
    nameInputContainer: {
      backgroundColor: theme.auth.inputBg,
      borderWidth: 1,
      borderColor: theme.auth.inputBorder,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      height: 48,
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
      backgroundColor: theme.auth.inputBorder,
      opacity: 0.5,
    },
    nameInput: {
      flex: 1,
      color: theme.auth.text,
      paddingVertical: 12,
      letterSpacing: 0.3,
    },
    roleSelection: {
      marginBottom: S.md,
    },
    roleLabel: {
      fontSize: F.base,
      fontWeight: "600",
      color: C.text,
      marginBottom: S.sm,
    },
    roleButtons: {
      flexDirection: 'row',
      backgroundColor: theme.auth.inputBg,
      borderRadius: 12,
      padding: 4,
      borderWidth: 1,
      borderColor: theme.auth.inputBorder,
      minHeight: 56,
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
      backgroundColor: C.primary,
      shadowColor: C.primary,
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
      color: C.textMuted,
      textAlign: 'center',
      letterSpacing: 0.3,
    },
    roleButtonTextSelected: {
      color: '#FFFFFF',
    },
    fieldError: {
      fontSize: F.base,
      fontWeight: "600",
      color: C.logout,
      marginBottom: S.sm,
    },
    saveFooter: {
      paddingHorizontal: sectionPadding,
      paddingTop: S.md,
      borderTopWidth: StyleSheet.hairlineWidth,
    },
    primaryBtnFooter: {
      borderRadius: 16,
      paddingVertical: S.md,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 56,
      shadowColor: C.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
      elevation: 4,
    },
    primaryBtnText: { color: "#fff", fontWeight: "600", fontSize: F.base,  letterSpacing: 0.5 },
    btnDisabled: { opacity: 0.5 },
    pressed: { opacity: 0.9 },
    licenseDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: C.border,
      marginVertical: S.lg,
    },
    sectionDriver: {
      fontSize: F.base,
      fontWeight: "800",
      color: C.text,
      marginBottom: S.sm,
    },
    helper: {
      fontSize: F.base,
      lineHeight: 18,
      marginBottom: S.sm,
      fontWeight: "500",
    },
    modalSheetLicense: {
      maxHeight: 440,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      borderWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: S.md,
      paddingTop: S.md,
      paddingBottom: S.md,
    },
    modalListLicense: {
      maxHeight: 320,
    },
    licenseOptionRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: S.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      gap: S.md,
      minHeight: 52,
    },
    licenseOptionText: { flex: 1, minWidth: 0 },
    modalDoneBtn: {
      alignItems: "center",
      paddingVertical: S.sm,
      marginTop: S.xs,
      minHeight: 48,
      justifyContent: "center",
    },
    modalDoneBtnText: {
      fontSize: F.base,
      fontWeight: "800",
    },
    clearExpiryLink: {
      alignSelf: "flex-start",
      marginBottom: S.md,
      paddingVertical: S.xs,
    },
    iosExpiryOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(15, 23, 42, 0.45)",
    },
    iosExpirySheet: {
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      paddingBottom: Platform.OS === "ios" ? 28 : S.md,
    },
    iosExpiryToolbar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: S.lg,
      paddingVertical: S.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: C.border,
    },
    iosExpiryToolbarBtn: {
      fontSize: F.base,
      fontWeight: "600",
    },
    photoOptions: {
      gap: S.sm,
    },
    photoOption: {
      flexDirection: "row",
      alignItems: "center",
      gap: S.md,
      paddingVertical: S.md,
      paddingHorizontal: S.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: 12,
    },
    photoOptionText: {
      fontSize: F.base,
      fontWeight: "600",
      color: C.text,
    },
    // Estilos para vista estática
    infoSection: {
      backgroundColor: C.card,
      borderRadius: R.card,
      padding: S.lg,
      marginBottom: S.md,
      borderWidth: 1,
      borderColor: C.border,
    },
    infoLabel: {
      fontSize: F.base,
      fontWeight: "600",
      color: C.textMuted,
      marginBottom: S.xs,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    infoValue: {
      fontSize: F.base,
      fontWeight: "700",
      color: C.text,
      lineHeight: 24,
    },
    // Estilos adicionales para vista estática
    inputText: {
      fontSize: F.base,
      fontWeight: '600',
      color: theme.auth.text,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: F.base,
      fontWeight: "800",
      color: C.text,
      marginBottom: S.sm,
    },
    // Estilos para texto plano en modo lectura
    plainText: {
      fontSize: F.base,
      fontWeight: '600',
      color: C.text,
      marginBottom: S.sm,
      lineHeight: 20,
      paddingTop: 6,
    },
    plainTextRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: S.md,
      marginBottom: S.sm,
    },
    plainTextContent: {
      flex: 1,
    },
    plainTextSub: {
      fontSize: F.base,
      fontWeight: '500',
      color: C.textMuted,
      marginTop: 4,
    },
    plainTextIcon: {
      marginTop: 2,
    },
    // Estilos para diseño profesional de vista no editable
    infoCard: {
      backgroundColor: C.card,
      borderRadius: R.card,
      padding: S.lg,
      marginBottom: S.md,
      borderWidth: 1,
      borderColor: C.border,
      shadowColor: C.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    infoHeader: {
      marginBottom: S.md,
      paddingBottom: S.sm,
      borderBottomWidth: 1,
      borderBottomColor: C.border,
    },
    infoTitle: {
      fontSize: F.base,
      fontWeight: '700',
      color: C.text,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: S.sm,
    },
    infoIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.isDark ? 'rgba(148,163,184,0.1)' : 'rgba(100,116,139,0.1)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: S.md,
    },
    infoContent: {
      flex: 1,
    },
    infoDivider: {
      height: 1,
      backgroundColor: C.border,
      marginVertical: S.sm,
    },
    // Estilos para look and feel de settings
    settingsSection: {
      backgroundColor: C.card,
      borderRadius: R.card,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.isDark ? "rgba(148, 163, 184, 0.15)" : "rgba(226, 232, 240, 0.8)",
      marginBottom: S.md,
    },
    settingsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: 58,
      paddingVertical: S.md,
      paddingHorizontal: S.lg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: C.border,
    },
    settingsRowLast: {
      borderBottomWidth: 0,
    },
    settingsRowContent: {
      flex: 1,
    },
    settingsLabel: {
      fontWeight: '700',
      fontFamily: theme.fontFamily.primary,
      color: C.text,
    },
    settingsValue: {
      fontFamily: theme.fontFamily.primary,
      color: C.textSubtle,
      marginTop: 2,
    },
    settingsIcon: {
      marginRight: S.md,
    },
  });
}
