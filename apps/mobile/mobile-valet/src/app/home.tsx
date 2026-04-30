import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
  Image,
  Modal,
  FlatList,
  StatusBar,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Redirect, useRouter } from "expo-router";
import { useMemo, useEffect, useState, useCallback } from "react";
import React from "react";
import { IconUser, IconLocationFilled, IconList, IconSettings, IconLogout, IconKey, IconKeyOff, IconSteeringWheelOutline, IconTrafficCone, IconCircleCheck } from "@/components/Icons";
import { Logo } from "@parkit/shared";
import api, { clearAuthToken } from "@/lib/api";
import { useAuthStore, useLocaleStore, useCompanyStore, useParkingPreferenceStore, useAccessibilityStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { useValetTheme } from "@/theme/valetTheme";
import { useValetProfileSync } from "@/lib/useValetProfileSync";
import { useNearestParking, haversineKm } from "@/lib/useNearestParking";
import { useOnAppForeground } from "@/lib/useOnAppForeground";
import { TICKETS_POLL_MS } from "@/lib/syncConstants";
import { usePushNotifications } from "@/lib/usePushNotifications";
import {
  avatarPresenceRingColor,
  HEADER_RADIUS_BOTTOM,
  getHeaderSizes,
  HEADER_LOGO_BASE_SIZE,
} from "@/lib/homeUtils";
import { AnimatedGridTile } from "@/components/AnimatedGridTile";
import { WorkflowTile } from "@/components/WorkflowTile";
import { HeaderAnimatedView } from "@/components/ReanimatedWrappers";
import { LinearGradient } from "expo-linear-gradient";

// Static font sizes for error boundary (fallback UI when theme is not available)
const ERROR_TITLE_SIZE = 18;
const ERROR_BODY_SIZE = 14;

class HomeErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fee2e2' }}>
          <Text style={{ fontSize: ERROR_TITLE_SIZE, fontWeight: 'bold', color: '#dc2626', marginBottom: 10 }} maxFontSizeMultiplier={1.5}>Error en Home</Text>
          <Text style={{ fontSize: ERROR_BODY_SIZE, color: '#7f1d1d', textAlign: 'center' }} maxFontSizeMultiplier={1.5}>{this.state.error?.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function HomeScreen() {
  return (
    <HomeErrorBoundary>
      <HomeScreenContent />
    </HomeErrorBoundary>
  );
}

function HomeScreenContent() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const setCompanyId = useCompanyStore((s) => s.setCompanyId);
  const locale = useLocaleStore((s) => s.locale);
  const theme = useValetTheme();
  const insets = useSafeAreaInsets();
  const windowDims = useWindowDimensions();
  const winW = windowDims.width;
  const winH =
    typeof windowDims.height === "number" && windowDims.height > 0 ? windowDims.height : winW;
  const shortestSide = Math.min(winW, winH);
  const isTablet = shortestSide >= 600;
  const isLandscape = winW > winH;
  useValetProfileSync(user);
  usePushNotifications(user?.id);
  const { nearest, status: locStatus, allParkings, userCoords } = useNearestParking(!!user);
  const manualParkingId = useParkingPreferenceStore((s) => s.manualParkingId);
  const setManualParkingId = useParkingPreferenceStore((s) => s.setManualParkingId);
  const hydrateParkingPreference = useParkingPreferenceStore((s) => s.hydrateParkingPreference);
  const [parkingModalOpen, setParkingModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [parkingAlertCount, setParkingAlertCount] = useState(0);
  const [deliveryAlertCount, setDeliveryAlertCount] = useState(0);
  const isDriverUi = user?.valetStaffRole === "DRIVER";
  const {  reduceMotion } = useAccessibilityStore();
  const statusKey = user?.valetCurrentStatus;
  const isAvailable = statusKey === "AVAILABLE";

  // Calculate proportional header sizes based on logo and text scale
  const headerSizes = getHeaderSizes(HEADER_LOGO_BASE_SIZE);

  useEffect(() => {
    void hydrateParkingPreference();
  }, [hydrateParkingPreference]);

  const loadQueueAlerts = useCallback(async (opts?: { silent?: boolean }) => {
    if (!user?.id || !isDriverUi) {
      setParkingAlertCount(0);
      setDeliveryAlertCount(0);
      return;
    }
    try {
      const res = await api.get<{ data?: { parking?: number; delivery?: number } }>(
        `/notifications/user/${encodeURIComponent(user.id)}/unread-count-all`
      );
      const parkingCount = Number(res.data?.data?.parking ?? 0);
      const deliveryCount = Number(res.data?.data?.delivery ?? 0);
      setParkingAlertCount(Number.isFinite(parkingCount) && parkingCount > 0 ? Math.floor(parkingCount) : 0);
      setDeliveryAlertCount(Number.isFinite(deliveryCount) && deliveryCount > 0 ? Math.floor(deliveryCount) : 0);
    } catch {
      if (!opts?.silent) {
        setParkingAlertCount(0);
        setDeliveryAlertCount(0);
      }
    }
  }, [user?.id, isDriverUi]);

  useEffect(() => {
    void loadQueueAlerts();
  }, [loadQueueAlerts]);

  useEffect(() => {
    if (!isDriverUi || !user?.id) return;
    const id = setInterval(() => {
      void loadQueueAlerts({ silent: true });
    }, TICKETS_POLL_MS);
    return () => clearInterval(id);
  }, [isDriverUi, user?.id, loadQueueAlerts]);

  useOnAppForeground(() => {
    void loadQueueAlerts({ silent: true });
  });

  const displayedParking = useMemo(() => {
    if (!user) return null;
    if (manualParkingId && allParkings.length > 0) {
      const p = allParkings.find((x) => x.id === manualParkingId);
      if (p) {
        let distanceKm: number | null = null;
        if (userCoords && p.latitude != null && p.longitude != null) {
          distanceKm = haversineKm(userCoords.lat, userCoords.lon, p.latitude, p.longitude);
        }
        return { parking: p, distanceKm, isManual: true };
      }
    }
    if (nearest) {
      return { parking: nearest.parking, distanceKm: nearest.distanceKm, isManual: false };
    }
    return null;
  }, [user, manualParkingId, allParkings, nearest, userCoords]);

  useEffect(() => {
    if (!user || user.systemRole !== "STAFF") return;
    const p = displayedParking?.parking;
    if (!p?.id || !p.companyId) return;
    const timer = setTimeout(() => {
      void api
        .patch("/valets/me", {
          companyId: p.companyId,
          currentParkingId: p.id,
        })
        .catch(() => {});
    }, 350);
    return () => clearTimeout(timer);
  }, [user, displayedParking?.parking, displayedParking?.parking?.id, displayedParking?.parking?.companyId]);

  const styles = useMemo(
    () => createStyles(theme, shortestSide, isTablet, isLandscape, headerSizes),
    [theme, shortestSide, isTablet, isLandscape, headerSizes]
  );

  if (!user) {
    return <Redirect href="/login" />;
  }

  const C = theme.colors;
  const firstName = user.firstName?.trim() || "";
  const displayName = firstName || user.email?.split("@")[0]?.trim() || "—";
  const avatarUri = user.avatarUrl?.trim() || null;

  const avatarPresenceColor = avatarPresenceRingColor(theme, statusKey);

  const statusLabel =
    statusKey === "AVAILABLE"
      ? t(locale, "home.statusAvailable")
      : statusKey === "BUSY"
        ? t(locale, "home.statusBusy")
        : statusKey === "AWAY"
          ? t(locale, "home.statusAway")
          : t(locale, "home.statusSyncing");

  const handleLogout = () => {
    setLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    await api.post("/valets/me/presence", { status: "AWAY" }).catch(() => {});
    await clearAuthToken();
    setCompanyId(null);
    setUser(null);
    router.replace("/login");
  };

  const headerMaxH = Math.min(80, winH * 0.10);

  const headerGradientSpec = theme.isDark
    ? ({
        colors: ["#1E293B", "#0F172A", "#020617"] as const,
        locations: [0, 0.55, 1] as const,
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      } as const)
    : ({
        /** Light: premium bluish gray (cold neutral, almost no saturation — 2024+ product style) */
        colors: ["#D5DDE8", "#E6EBF2", "#F4F6F9"] as const,
        locations: [0, 0.42, 1] as const,
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0.88 },
      } as const);

  const headerTextPrimary = theme.isDark ? C.text : "#0F172A";
    /** Same tone as the start of the header gradient (status bar visually aligned). */
  const statusBarBg = headerGradientSpec.colors[0];
  const S = theme.space;

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor={statusBarBg}
        translucent={Platform.OS === "android"}
      />
      <View style={styles.mainColumn}>
        <View style={styles.screenContent}>
        <HeaderAnimatedView reduceMotion={reduceMotion}>
        <LinearGradient
          colors={[...headerGradientSpec.colors]}
          locations={[...headerGradientSpec.locations]}
          start={headerGradientSpec.start}
          end={headerGradientSpec.end}
          style={[
            styles.heroPlain,
            {
              paddingTop: insets.top + S.md,
              maxHeight: headerMaxH + insets.top,
            },
          ]}
        >
          <View style={styles.heroToolbarWrap}>
            <View style={[styles.heroToolbar, { gap: headerSizes.gap }]}>
              <Logo
                size={headerSizes.logoSize}
                variant={theme.isDark ? "onDark" : "onLight"}
                style={styles.heroLogo}
              />
              <View style={styles.headerUserBlock}>
                <View style={[styles.headerGreetingRow, { gap: headerSizes.gap }]}>
                  <View style={styles.headerGreetingCol}>
                    <Text
                      style={[styles.headerDisplayName, { color: headerTextPrimary, fontSize: theme.font.base }]}
                      numberOfLines={2}
                      maxFontSizeMultiplier={1.5}
                      adjustsFontSizeToFit={true}
                    >
                      {displayName}
                    </Text>
                    <Text
                      style={[styles.headerRoleBelow, { color: headerTextPrimary }]}
                      numberOfLines={1}
                      maxFontSizeMultiplier={1.5}
                      adjustsFontSizeToFit={true}
                    >
                      {isDriverUi ? t(locale, "home.titleDriver") : t(locale, "home.titleReception")}
                    </Text>
                  </View>
                  <Pressable
                    style={({ pressed }) => [
                      styles.avatarWrapper,
                      { width: headerSizes.avatarSize + 4, height: headerSizes.avatarSize + 4 },
                      pressed && styles.avatarPressed,
                    ]}
                    accessibilityLabel={`${t(locale, "home.profile")} - ${statusLabel}`}
                    accessibilityRole="button"
                    onPress={() => router.push("/profile")}
                  >
                    <View
                      style={[
                        styles.headerAvatarInner,
                        { 
                          backgroundColor: theme.isDark ? C.card : "#FFFFFF",
                          width: headerSizes.avatarSize,
                          height: headerSizes.avatarSize,
                          borderRadius: headerSizes.avatarSize / 2,
                        },
                      ]}
                    >
                      {avatarUri ? (
                        <Image
                          source={{ uri: avatarUri }}
                          style={[styles.headerAvatarImage, { 
                            width: headerSizes.avatarSize,
                            height: headerSizes.avatarSize,
                          }]}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={{ 
                          width: headerSizes.avatarSize, 
                          height: headerSizes.avatarSize, 
                          borderRadius: headerSizes.avatarSize / 2,
                          backgroundColor: theme.isDark ? "rgba(148,163,184,0.15)" : "rgba(100,116,139,0.15)",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <IconUser size={headerSizes.avatarSize * 0.5} color={C.textMuted} />
                        </View>
                      )}
                    </View>
                    <View style={[
                      styles.statusDotBadge,
                      { 
                        backgroundColor: avatarPresenceColor,
                        width: headerSizes.statusDotSize,
                        height: headerSizes.statusDotSize,
                        borderRadius: headerSizes.statusDotSize / 2,
                        borderWidth: headerSizes.statusDotBorderWidth,
                      },
                      isAvailable && styles.statusDotPulse
                    ]}>
                      {isAvailable && <View style={[styles.statusDotInner, { 
                        width: headerSizes.statusDotSize * 0.43,
                        height: headerSizes.statusDotSize * 0.43,
                        borderRadius: headerSizes.statusDotSize * 0.215,
                      }]} />}
                    </View>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
        </HeaderAnimatedView>

        <View style={styles.gridFlex}>
          {isDriverUi ? (
            <>
              <View style={[styles.gridRowFixed]}>
                <AnimatedGridTile
                  variant="accent"
                  lucideIcon={IconSteeringWheelOutline}
                  title={t(locale, "home.actionParkingQueue")}
                  sub=""
                  badgeCount={parkingAlertCount}
                  onPress={() => router.push({ pathname: "/tickets", params: { queue: "parking" } })}
                  styles={styles}
                  isDark={theme.isDark}
                  index={0}
                  reduceMotion={reduceMotion}
                  iconStrokeWidth={1.5}
                  centerContent={true}
                />
                <AnimatedGridTile
                  variant="warm"
                  lucideIcon={IconTrafficCone}
                  title={t(locale, "home.actionDeliveryQueue")}
                  sub=""
                  badgeCount={deliveryAlertCount}
                  onPress={() => router.push({ pathname: "/tickets", params: { queue: "delivery" } })}
                  styles={styles}
                  isDark={theme.isDark}
                  index={1}
                  reduceMotion={reduceMotion}
                  iconStrokeWidth={1.5}
                  centerContent={true}
                />
              </View>
              <View style={[styles.gridRowFill, { flex: 2.2 }]}>
                <WorkflowTile
                  styles={styles}
                  isDark={theme.isDark}
                />
              </View>
            </>
          ) : (
            <>
              <View style={[styles.gridRowFixed]}>
                <AnimatedGridTile
                  variant="accent"
                  lucideIcon={IconKey}
                  iconSize={20}
                  title={t(locale, "home.actionReceive")}
                  sub=""
                  onPress={() => router.push("/receive")}
                  styles={styles}
                  isDark={theme.isDark}
                  index={0}
                  reduceMotion={reduceMotion}
                  centerContent={true}
                />
                <AnimatedGridTile
                  variant="warm"
                  lucideIcon={IconKeyOff}
                  iconSize={20}
                  title={t(locale, "home.actionReturn")}
                  sub=""
                  onPress={() => router.push("/return-pickup")}
                  styles={styles}
                  isDark={theme.isDark}
                  index={1}
                  reduceMotion={reduceMotion}
                  centerContent={true}
                />
              </View>
              <View style={[styles.gridRowFill, { flex: 2.2 }]}>
                <WorkflowTile
                  styles={styles}
                  isDark={theme.isDark}
                />
              </View>
            </>
          )}
        </View>

        <View style={styles.bottomCard}>
          <Pressable
            style={({ pressed }) => [styles.bottomCardInner, pressed && styles.pressed]}
            onPress={() => setParkingModalOpen(true)}
            accessibilityRole="button"
            accessibilityLabel={t(locale, "home.chooseParking")}
          >
            <View style={styles.bottomIconWrap}>
              <IconLocationFilled size={theme.icon.xs} fill={C.primary}  color={C.primary} />
            </View>
            <View style={styles.bottomTextCol}>
              <View style={styles.bottomTitleRow}>
                <Text style={styles.bottomTitle} numberOfLines={1} maxFontSizeMultiplier={1.5} adjustsFontSizeToFit={true}>
                  {t(locale, "home.nearestTitle")}
                </Text>
                {allParkings.length > 0 && locStatus !== "loading" && locStatus !== "unavailable" && (
                  <IconList size={theme.icon.sm} color={C.primary} />
                )}
              </View>
              {locStatus === "loading" && (
                <View style={styles.bottomLoadingRow}>
                  <ActivityIndicator size="small" color={C.primary} />
                  <Text style={styles.bottomMeta} maxFontSizeMultiplier={1.5}>{t(locale, "home.nearestLoading")}</Text>
                </View>
              )}
              {locStatus === "unavailable" && (
                <Text style={styles.bottomMeta} maxFontSizeMultiplier={1.5}>{t(locale, "home.nearestNoCoords")}</Text>
              )}
              {locStatus === "denied" && (
                <Text style={styles.bottomMeta} maxFontSizeMultiplier={1.5}>{t(locale, "home.nearestDenied")}</Text>
              )}
              {(locStatus === "ready" || locStatus === "denied") && displayedParking && (
                <>
                  {displayedParking.isManual && (
                    <Text style={[styles.bottomManualHint, { color: C.textMuted }]} maxFontSizeMultiplier={1.5}>
                      {t(locale, "home.manualParkingHint")}
                    </Text>
                  )}
                  <Text style={styles.bottomName} numberOfLines={2} maxFontSizeMultiplier={1.5} adjustsFontSizeToFit={true}>
                    {displayedParking.parking.name}
                  </Text>
                  {displayedParking.parking.company && (
                    <Text style={styles.bottomCompany} numberOfLines={1} maxFontSizeMultiplier={1.5} adjustsFontSizeToFit={true}>
                      {displayedParking.parking.company.commercialName?.trim() ||
                        displayedParking.parking.company.legalName?.trim() ||
                        "—"}
                    </Text>
                  )}
                  {displayedParking.distanceKm != null && (
                    <Text style={styles.bottomMeta} maxFontSizeMultiplier={1.5}>
                      {t(locale, "home.nearestKm", {
                        km:
                          displayedParking.distanceKm < 10
                            ? displayedParking.distanceKm.toFixed(1)
                            : String(Math.round(displayedParking.distanceKm)),
                      })}
                    </Text>
                  )}
                  <Text style={styles.bottomAddr} maxFontSizeMultiplier={1.5}>
                    {displayedParking.parking.address}
                  </Text>
                  {displayedParking.isManual && (
                    <Pressable
                      style={({ pressed }) => [styles.bottomUseNearestBtn, pressed && styles.pressed]}
                      onPress={() => void setManualParkingId(null)}
                    >
                      <Text style={[styles.bottomUseNearestText, { color: C.primary }]} maxFontSizeMultiplier={1.5}>
                        {t(locale, "home.useNearestParking")}
                      </Text>
                    </Pressable>
                  )}
                </>
              )}
            </View>
          </Pressable>
        </View>

        <View style={styles.helpLogoutRow}>
          <Pressable
            style={({ pressed }) => [styles.helpLogoutBtn, pressed && styles.pressed]}
            onPress={() => router.push("/settings")}
            accessibilityRole="button"
            accessibilityLabel={t(locale, "home.settings")}
          >
            <IconSettings size={theme.icon.md} color={C.primary} />
            <Text
              style={[styles.helpLogoutBtnText, { color: C.primary }]}
              maxFontSizeMultiplier={1.5}
              numberOfLines={2}
            >
              {t(locale, "home.settings")}
            </Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.helpLogoutBtn, pressed && styles.pressed]}
            onPress={handleLogout}
            accessibilityRole="button"
            accessibilityLabel={t(locale, "tickets.logout")}
          >
            <IconLogout size={theme.icon.md} color={C.logout} />
            <Text
              style={[styles.helpLogoutBtnText, { color: C.logout }]}
              maxFontSizeMultiplier={1.5}
              numberOfLines={2}
            >
              {t(locale, "tickets.logout")}
            </Text>
          </Pressable>
        </View>

        <Modal
          visible={parkingModalOpen}
          animationType="slide"
          transparent
          onRequestClose={() => setParkingModalOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <Pressable
              style={styles.modalBackdropPress}
              onPress={() => setParkingModalOpen(false)}
              accessibilityLabel={t(locale, "common.cancel")}
            />
            <View style={[styles.modalSheet, { backgroundColor: C.card, borderColor: C.border }]}>
              <Text style={[styles.modalTitle, { color: C.text }]} maxFontSizeMultiplier={1.5}>{t(locale, "home.parkingPickerTitle")}</Text>
              <FlatList
                data={allParkings}
                keyExtractor={(item) => item.id}
                style={styles.modalList}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => {
                  const isSelected = item.id === manualParkingId || (displayedParking?.parking.id === item.id && !manualParkingId);
                  return (
                    <Pressable
                      style={({ pressed }) => [
                        styles.parkingRow,
                        { borderBottomColor: C.border },
                        pressed && styles.pressed,
                      ]}
                      onPress={() => {
                        void setManualParkingId(item.id);
                        setParkingModalOpen(false);
                      }}
                    >
                      <View style={styles.parkingRowText}>
                        <Text style={[styles.parkingRowName, { color: C.text }]} numberOfLines={2} maxFontSizeMultiplier={1.5}>
                          {item.name}
                        </Text>
                        <Text style={[styles.parkingRowAddr, { color: C.textMuted }]} numberOfLines={2} maxFontSizeMultiplier={1.5}>
                          {item.address}
                        </Text>
                      </View>
                      {isSelected && <IconCircleCheck size={theme.icon.md} color={C.primary} />}
                    </Pressable>
                  );
                }}
                ListEmptyComponent={
                  <Text style={{ color: C.textMuted, padding: theme.space.md }} maxFontSizeMultiplier={1.5}>
                    {t(locale, "home.parkingPickerEmpty")}
                  </Text>
                }
              />
            </View>
          </View>
        </Modal>

        <Modal
          visible={logoutModalOpen}
          animationType="slide"
          transparent
          onRequestClose={() => setLogoutModalOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <Pressable
              style={styles.modalBackdropPress}
              onPress={() => setLogoutModalOpen(false)}
              accessibilityLabel={t(locale, "common.cancel")}
            />
            <View style={[styles.modalSheet, { backgroundColor: C.card, borderColor: C.border }]}>
              <Text style={[styles.modalTitle, { color: C.text }]} maxFontSizeMultiplier={1.5}>{t(locale, "tickets.logoutConfirmTitle")}</Text>
              <Text style={[styles.modalBody, { color: C.textMuted }]} maxFontSizeMultiplier={1.5}>{t(locale, "tickets.logoutConfirmMessage")}</Text>
              <View style={styles.modalActions}>
                <Pressable
                  style={({ pressed }) => [
                    styles.modalActionBtn,
                    { borderColor: C.border, backgroundColor: C.card },
                    pressed && styles.pressed,
                  ]}
                  onPress={() => setLogoutModalOpen(false)}
                >
                  <Text style={[styles.modalActionBtnText, { color: C.text }]} maxFontSizeMultiplier={1.5}>{t(locale, "common.cancel")}</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.modalActionBtn,
                    { borderColor: C.logout, backgroundColor: C.logout },
                    pressed && styles.pressed,
                  ]}
                  onPress={() => {
                    setLogoutModalOpen(false);
                    void confirmLogout();
                  }}
                >
                  <Text style={[styles.modalActionBtnText, { color: "#fff" }]} maxFontSizeMultiplier={1.5}>{t(locale, "tickets.logout")}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        </View>
      </View>
    </SafeAreaView>
  );
}

type Theme = ReturnType<typeof useValetTheme>;

function createStyles(
  theme: Theme,
  shortestSide: number,
  isTablet: boolean,
  isLandscape: boolean,
  headerSizes: { avatarSize: number }
) {
  const C = theme.colors;
  const S = theme.space;
  const F = theme.font;
  const R = theme.radius;

  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: C.bg,
    },
    mainColumn: {
      flex: 1,
      minHeight: 0,
      alignItems: "center",
    },
    screenContent: {
      flex: 1,
      minHeight: 0,
      width: "100%",
      alignSelf: "center",
    },
    heroPlain: {
      paddingHorizontal: S.lg,
      paddingTop: S.sm,
      paddingBottom: S.sm,
      overflow: "hidden",
      borderBottomLeftRadius: HEADER_RADIUS_BOTTOM,
      borderBottomRightRadius: HEADER_RADIUS_BOTTOM,
      ...Platform.select({
        ios: {
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: theme.isDark ? 0.45 : 0.12,
          shadowRadius: 24,
        },
        android: { elevation: theme.isDark ? 8 : 4 },
      }),
    },
    heroToolbarWrap: {
      marginBottom: S.sm,
      width: "100%",
    },
    heroToolbar: {
      flexDirection: "row",
      alignItems: "center",
      gap: S.md,
      minWidth: 0,
      width: "100%",
    },
    heroLogo: {
      opacity: 1,
      flexShrink: 0,
    },
    /** Right block: row aligned to the right [avatar | greeting + position]. */
    headerUserBlock: {
      flex: 1,
      minWidth: 0,
      alignItems: "flex-end",
    },
    headerGreetingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      width: "100%",
      gap: S.md,
      flexWrap: "nowrap",
    },
    headerGreetingCol: {
      justifyContent: "center",
      gap: 1,
      alignItems: "flex-end",
      flexShrink: 1,
      maxWidth: "58%",
    },
    headerRoleBelow: {
      fontWeight: Platform.OS === "android" ? "normal" : "600",
            textAlign: "right",
      letterSpacing: 0.2,
    },
    /** Avatar container with status dot */
    avatarWrapper: {
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    avatarPressed: {
      transform: [{ scale: 0.96 }],
    },
    statusDotBadge: {
      position: "absolute",
      bottom: 2,
      right: 2,
      borderColor: C.card,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 1,
        },
        android: { elevation: 2 },
      }),
    },
    statusDotPulse: {
      alignItems: "center",
      justifyContent: "center",
    },
    statusDotInner: {
      backgroundColor: "#FFFFFF",
      opacity: 0.4,
    },
    headerAvatarInner: {
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: C.border,
    },
    /** Medidas explícitas: en algunos dispositivos % dentro del círculo no pinta la imagen. */
    headerAvatarImage: {
      resizeMode: 'cover',
    },
    headerAvatarInitials: {
      fontWeight: "600",
    },
    headerDisplayName: {
      fontWeight: Platform.OS === "android" ? "normal" : "700",
      textAlign: "right",
      letterSpacing: -0.3,
    },
    headerBadge: {
      position: "absolute",
      top: -2,
      right: -2,
      minWidth: 16,
      height: 16,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 5,
      backgroundColor: C.primary,
      borderWidth: 0,
    },
    headerBadgeText: {
      color: "#fff",
      fontWeight: "600",
    },
    gridFlex: {
      flex: 1,
      minHeight: 0,
      paddingHorizontal: isTablet ? S.xl : S.lg,
      paddingTop: isLandscape ? S.xs : S.sm,
      paddingBottom: S.sm,
      gap: isTablet ? S.md : S.sm,
    },
    gridRowFill: {
      flex: 1,
      minHeight: 0,
      flexDirection: "row",
      alignItems: "stretch",
      gap: S.sm,
    },
    gridRowFixed: {
      height: isTablet ? 140 : 120,
      flexDirection: "row",
      alignItems: "stretch",
      gap: S.sm,
    },
    tileSpacer: {
      flex: 1,
      minWidth: 0,
    },
    tileGhost: {
      opacity: 0,
    },
    helpLogoutRow: {
      flexDirection: "row",
      alignItems: "stretch",
      paddingHorizontal: S.lg,
      paddingTop: S.xs,
      paddingBottom: S.md,
      gap: S.sm,
    },
    helpLogoutBtn: {
      flex: 1,
      minWidth: 0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: S.sm,
      paddingVertical: S.md,
      paddingHorizontal: S.sm,
      borderRadius: R.card,
      borderWidth: 2,
      borderColor: C.border,
      backgroundColor: C.card,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: theme.isDark ? 0.25 : 0.06,
          shadowRadius: 4,
        },
        android: { elevation: theme.isDark ? 2 : 1 },
      }),
    },
    helpLogoutBtnText: {
      fontWeight: "700",
      textAlign: "center",
      flexShrink: 1,
    },
    tile: {
      flex: 1,
      minWidth: 0,
      minHeight: 0,
      position: "relative",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.isDark ? "rgba(148, 163, 184, 0.12)" : "rgba(226, 232, 240, 0.9)",
      paddingVertical: isTablet ? S.lg : S.md + 2,
      paddingHorizontal: isTablet ? S.md : S.sm + 2,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.isDark ? "rgba(30, 41, 59, 0.5)" : "rgba(255, 255, 255, 0.85)",
      ...Platform.select({
        ios: {
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: theme.isDark ? 0.35 : 0.08,
          shadowRadius: 14,
        },
        android: {
          elevation: theme.isDark ? 5 : 3,
        },
      }),
    },
    tileAccent: {
      backgroundColor: theme.isDark ? "rgba(30, 41, 59, 0.55)" : "rgba(255, 255, 255, 0.9)",
      borderColor: theme.isDark ? "rgba(37, 99, 235, 0.3)" : "rgba(29, 78, 216, 0.15)",
    },
    tileWarm: {
      backgroundColor: theme.isDark ? "rgba(30, 41, 59, 0.55)" : "rgba(255, 255, 255, 0.9)",
      borderColor: theme.isDark ? "rgba(249, 115, 22, 0.3)" : "rgba(194, 65, 12, 0.15)",
    },
    tileQueue: {
      backgroundColor: theme.isDark ? "rgba(30, 41, 59, 0.55)" : "rgba(255, 255, 255, 0.9)",
      borderColor: theme.isDark ? "rgba(129, 140, 248, 0.3)" : "rgba(67, 56, 202, 0.15)",
    },
    tileBooking: {
      backgroundColor: theme.isDark ? "rgba(30, 41, 59, 0.55)" : "rgba(255, 255, 255, 0.9)",
      borderColor: theme.isDark ? "rgba(45, 212, 191, 0.3)" : "rgba(13, 148, 136, 0.15)",
    },
    tileProfile: {
      backgroundColor: theme.isDark ? "rgba(30, 41, 59, 0.55)" : "rgba(255, 255, 255, 0.9)",
      borderColor: theme.isDark ? "rgba(192, 132, 252, 0.3)" : "rgba(124, 58, 237, 0.15)",
    },
    tileSettings: {
      backgroundColor: theme.isDark ? "rgba(30, 41, 59, 0.55)" : "rgba(255, 255, 255, 0.9)",
      borderColor: theme.isDark ? "rgba(148, 163, 184, 0.25)" : "rgba(51, 65, 85, 0.15)",
    },
    tileWorkflow: {
      backgroundColor: theme.isDark ? "rgba(30, 41, 59, 0.45)" : "rgba(255, 255, 255, 0.8)",
      borderColor: theme.isDark ? "rgba(6, 182, 212, 0.25)" : "rgba(14, 116, 144, 0.15)",
    },
    tileFilled: {
      backgroundColor: C.primary,
      borderColor: C.primary,
    },
    tileIconWrap: {
      width: headerSizes.avatarSize,
      height: headerSizes.avatarSize,
      borderRadius: headerSizes.avatarSize / 2,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: S.sm + 2,
      alignSelf: "center",
    },
    tileBadge: {
      position: "absolute",
      top: 8,
      right: 8,
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 6,
      backgroundColor: C.primary,
      borderWidth: 0,
    },
    tileBadgeText: {
      color: "#fff",
      fontSize: F.xs,
      fontWeight: "600",
      letterSpacing: 0.2,
    },
    tileTitle: {
      fontWeight: "700",
      color: C.text,
      marginBottom: 4,
      textAlign: "center",
      width: "100%",
    },
    tileSub: {
      fontWeight: "600",
      color: C.textMuted,
      textAlign: "center",
      width: "100%",
    },
    pressed: {
      opacity: 0.93,
      transform: [{ scale: 0.988 }],
    },
    bottomCard: {
      paddingHorizontal: S.lg,
      paddingBottom: S.sm,
      paddingTop: S.xs,
    },
    bottomCardInner: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: S.md,
      backgroundColor: C.card,
      borderRadius: R.card,
      borderWidth: 1,
      borderColor: C.border,
      padding: S.md,
      minHeight: 152,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        android: { elevation: 2 },
      }),
    },
    bottomIconWrap: {
      marginTop: 24,
    },
    bottomTextCol: {
      flex: 1,
      minWidth: 0,
    },
    bottomTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: S.sm,
      marginBottom: 4,
    },
    bottomTitle: {
      fontWeight: "600",
      color: C.textMuted,
      letterSpacing: 0.6,
      flex: 1,
      minWidth: 0,
    },
    bottomChooseBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingVertical: 4,
      paddingHorizontal: S.xs,
      flexShrink: 0,
    },
    bottomChooseBtnText: {
      fontWeight: "600",
    },
    bottomManualHint: {
      fontWeight: "700",
      marginBottom: 4,
    },
    bottomUseNearestBtn: {
      marginTop: S.sm,
      alignSelf: "flex-start",
      paddingVertical: 4,
    },
    bottomUseNearestText: {
      fontWeight: "600",
    },
    logoutText: {
      fontWeight: "700",
      color: C.text,
    },
    bottomName: {
      fontWeight: "600",
      color: C.text,
    },
    bottomCompany: {
      fontWeight: "600",
      color: C.textMuted,
      marginTop: 2,
    },
    bottomMeta: {
      fontWeight: "700",
      color: C.primary,
      marginTop: 2,
    },
    bottomAddr: {
      color: C.textSubtle,
      marginTop: 4,
    },
    bottomLoadingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 4,
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
      maxHeight: 360,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      borderWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: S.md,
      paddingTop: S.md,
      paddingBottom: S.lg,
    },
    modalTitle: {
      fontWeight: Platform.OS === "android" ? "normal" : "600",
      textAlign: "center",
      marginBottom: S.sm,
    },
    modalList: {
      maxHeight: 300,
    },
    parkingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: S.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    parkingRowText: {
      flex: 1,
    },
    parkingRowName: {
      fontWeight: "600",
    },
    parkingRowAddr: {
      marginTop: 4,
    },
    modalBody: {
      marginBottom: S.md,
    },
    modalDoneBtn: {
      alignItems: "center",
      paddingVertical: S.md,
      paddingHorizontal: S.sm,
      marginTop: S.xs,
      minHeight: 58,
      justifyContent: "center",
    },
    modalDoneBtnText: {
      fontWeight: "800",
    },
    modalActions: {
      flexDirection: "row",
      gap: S.sm,
      marginTop: S.md,
    },
    modalActionBtn: {
      flex: 1,
      paddingVertical: S.md,
      paddingHorizontal: S.md,
      borderRadius: 12,
      borderWidth: StyleSheet.hairlineWidth,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 48,
    },
    modalActionBtnText: {
      fontWeight: "700",
    },
  });
}
