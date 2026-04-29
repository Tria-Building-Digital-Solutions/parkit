import { View, Text, StyleSheet, StatusBar, Platform, FlatList, RefreshControl, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Redirect, useRouter } from "expo-router";
import { useMemo, useState, useCallback, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore, useLocaleStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { useValetTheme, useResponsiveLayout } from "@/theme/valetTheme";
import { ValetBackButton } from "@/components/ValetBackButton";
import { IconUsersGroup, IconPulse, IconTicket, IconSteeringWheel } from "@/components/Icons";
import api from "@/lib/api";

interface WorkflowStatus {
  activeProcesses: number;
  completedToday: number;
  pendingTasks: number;
  lastUpdated: string;
  breakdown: {
    requestParking: number;
    parked: number;
    requestDelivery: number;
  };
  valets: {
    available: number;
    busy: number;
    away: number;
    total: number;
  };
  performance: {
    avgServiceMinutes: number;
    throughputPerHour: number;
  };
  recentTickets: Array<{
    id: string;
    ticketCode: string;
    status: string;
    entryTime: string;
    vehicle: {
      plate?: string;
      brand?: string;
      model?: string;
      color?: string;
    };
    parking: {
      name?: string;
    };
  }>;
}

export default function WorkflowScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const locale = useLocaleStore((s) => s.locale);
  const theme = useValetTheme();
  const responsive = useResponsiveLayout();
  const insets = useSafeAreaInsets();
  const C = theme.colors;
  const S = theme.space;
  const Fa = theme.font;

  const [workflowData, setWorkflowData] = useState<WorkflowStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWorkflowData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<WorkflowStatus>("/valets/workflow-status");
      setWorkflowData(response.data);
    } catch (error) {
      console.error("Error loading workflow data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadWorkflowData();
  }, [loadWorkflowData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadWorkflowData();
  }, [loadWorkflowData]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safe: { flex: 1, backgroundColor: C.bg },
        frame: {
          flex: 1,
          width: "100%",
          maxWidth: responsive.contentMaxWidth,
          alignSelf: "center",
        },
        header: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: responsive.sectionPadding,
          paddingVertical: S.md,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: C.border,
          backgroundColor: C.card,
        },
        headerSpacer: { width: 44 },
        title: {
          flex: 1,
          textAlign: "center",
          fontSize: Fa.xxl - 4,
          fontWeight: "800",
          color: C.text,
        },
        content: {
          flex: 1,
          padding: responsive.sectionPadding,
        },
        // Premium Banner
        banner: {
          borderRadius: 20,
          overflow: "hidden",
          marginBottom: S.lg,
          ...Platform.select({
            ios: {
              shadowColor: C.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        bannerGradient: {
          padding: S.lg,
        },
        bannerTitle: {
          fontSize: Fa.lg,
          fontWeight: "800",
          color: "#fff",
          marginBottom: S.xs,
        },
        bannerSubtitle: {
          fontSize: Fa.sm,
          color: "rgba(255,255,255,0.9)",
        },
        // Stats Grid
        statsGrid: {
          flexDirection: "row",
          flexWrap: "wrap",
          marginBottom: S.lg,
          gap: S.sm,
        },
        statCard: {
          flex: 1,
          minWidth: "45%",
          backgroundColor: C.card,
          borderRadius: 16,
          padding: S.md,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: theme.isDark ? 0.2 : 0.08,
              shadowRadius: 8,
            },
            android: {
              elevation: theme.isDark ? 4 : 2,
            },
          }),
        },
        statHeader: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: S.sm,
        },
        statIconContainer: {
          width: 36,
          height: 36,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          marginRight: S.sm,
        },
        statValue: {
          fontSize: Fa.lg,
          fontWeight: "800",
          color: C.text,
          marginBottom: 2,
        },
        statLabel: {
          fontSize: Fa.sm,
          color: C.textMuted,
        },
        // Breakdown Section
        sectionTitle: {
          fontSize: Fa.md,
          fontWeight: "700",
          color: C.text,
          marginBottom: S.md,
        },
        breakdownRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: C.card,
          borderRadius: 12,
          padding: S.md,
          marginBottom: S.sm,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: theme.isDark ? 0.15 : 0.05,
              shadowRadius: 4,
            },
            android: {
              elevation: theme.isDark ? 2 : 1,
            },
          }),
        },
        breakdownItem: {
          alignItems: "center",
          flex: 1,
        },
        breakdownValue: {
          fontSize: Fa.md,
          fontWeight: "700",
          color: C.text,
          marginBottom: 2,
        },
        breakdownLabel: {
          fontSize: Fa.sm,
          color: C.textMuted,
        },
        // Recent Tickets
        recentTicketsList: {
          flex: 1,
        },
        ticketCard: {
          backgroundColor: C.card,
          borderRadius: 12,
          padding: S.md,
          marginBottom: S.sm,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: theme.isDark ? 0.15 : 0.05,
              shadowRadius: 4,
            },
            android: {
              elevation: theme.isDark ? 2 : 1,
            },
          }),
        },
        ticketHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: S.sm,
        },
        ticketCode: {
          fontSize: Fa.sm,
          fontWeight: "700",
          color: C.primary,
        },
        ticketStatus: {
          fontSize: Fa.xs,
          fontWeight: "600",
          color: C.textMuted,
          paddingHorizontal: S.sm,
          paddingVertical: 2,
          borderRadius: 8,
          backgroundColor: theme.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
        },
        ticketVehicle: {
          fontSize: Fa.sm,
          color: C.text,
          marginBottom: 2,
        },
        ticketParking: {
          fontSize: Fa.xs,
          color: C.textMuted,
        },
        // Loading
        loadingContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        loadingText: {
          fontSize: Fa.sm,
          color: C.textMuted,
          marginTop: S.md,
        },
        emptyText: {
          fontSize: Fa.sm,
          color: C.textMuted,
          textAlign: "center",
          paddingVertical: S.xl,
        },
      }),
    [C, S, Fa, responsive.contentMaxWidth, responsive.sectionPadding, theme.isDark]
  );

  if (!user) {
    return <Redirect href="/login" />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "REQUEST_PARKING":
        return C.warning;
      case "PARKED":
        return C.success;
      case "REQUEST_DELIVERY":
        return C.primary;
      default:
        return C.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "REQUEST_PARKING":
        return "Solicitud";
      case "PARKED":
        return "Estacionado";
      case "REQUEST_DELIVERY":
        return "Entrega";
      default:
        return status;
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.card}
        translucent={Platform.OS === "android"}
      />
      <View style={styles.frame}>
        <View style={[styles.header, { paddingTop: insets.top + theme.space.md }]}>
          <ValetBackButton
            onPress={() => router.back()}
            accessibilityLabel={t(locale, "common.back")}
          />
          <Text style={styles.title} numberOfLines={1}>
            Flujo de Trabajo
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Cargando flujo de trabajo...</Text>
            </View>
          ) : workflowData ? (
            workflowData.recentTickets.length === 0 ? (
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={C.primary}
                    colors={[C.primary]}
                  />
                }
              >
                <View style={{ paddingBottom: S.xl }}>
                  {/* Premium Banner */}
                  <LinearGradient
                    colors={[C.primary, C.primary + "CC"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.banner}
                  >
                    <View style={styles.bannerGradient}>
                      <Text style={styles.bannerTitle}>
                        {workflowData.activeProcesses} Procesos Activos
                      </Text>
                      <Text style={styles.bannerSubtitle}>
                        {workflowData.completedToday} completados hoy · {workflowData.pendingTasks} pendientes
                      </Text>
                    </View>
                  </LinearGradient>

                  {/* Stats Grid */}
                  <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                      <View style={styles.statHeader}>
                        <View style={[styles.statIconContainer, { backgroundColor: C.primary + "20" }]}>
                          <IconUsersGroup size={20} color={C.primary} />
                        </View>
                      </View>
                      <Text style={styles.statValue}>{workflowData.valets.available}</Text>
                      <Text style={styles.statLabel}>Disponibles</Text>
                    </View>
                    <View style={styles.statCard}>
                      <View style={styles.statHeader}>
                        <View style={[styles.statIconContainer, { backgroundColor: C.warning + "20" }]}>
                          <IconSteeringWheel size={20} color={C.warning} />
                        </View>
                      </View>
                      <Text style={styles.statValue}>{workflowData.valets.busy}</Text>
                      <Text style={styles.statLabel}>Ocupados</Text>
                    </View>
                    <View style={styles.statCard}>
                      <View style={styles.statHeader}>
                        <View style={[styles.statIconContainer, { backgroundColor: C.success + "20" }]}>
                          <IconTicket size={20} color={C.success} />
                        </View>
                      </View>
                      <Text style={styles.statValue}>{workflowData.completedToday}</Text>
                      <Text style={styles.statLabel}>Completados Hoy</Text>
                    </View>
                    <View style={styles.statCard}>
                      <View style={styles.statHeader}>
                        <View style={[styles.statIconContainer, { backgroundColor: C.textMuted + "20" }]}>
                          <IconPulse size={20} color={C.textMuted} />
                        </View>
                      </View>
                      <Text style={styles.statValue}>{workflowData.performance.avgServiceMinutes}m</Text>
                      <Text style={styles.statLabel}>Tiempo Promedio</Text>
                    </View>
                  </View>

                  {/* Breakdown Section */}
                  <Text style={styles.sectionTitle}>Desglose de Tickets</Text>
                  <View style={styles.breakdownRow}>
                    <View style={styles.breakdownItem}>
                      <Text style={styles.breakdownValue}>{workflowData.breakdown.requestParking}</Text>
                      <Text style={styles.breakdownLabel}>Solicitudes</Text>
                    </View>
                    <View style={styles.breakdownItem}>
                      <Text style={styles.breakdownValue}>{workflowData.breakdown.parked}</Text>
                      <Text style={styles.breakdownLabel}>Estacionados</Text>
                    </View>
                    <View style={styles.breakdownItem}>
                      <Text style={styles.breakdownValue}>{workflowData.breakdown.requestDelivery}</Text>
                      <Text style={styles.breakdownLabel}>Entregas</Text>
                    </View>
                  </View>

                  {/* Recent Tickets */}
                  <Text style={styles.sectionTitle}>Tickets Recientes</Text>
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                    <Text style={styles.emptyText}>No hay tickets activos</Text>
                  </View>
                </View>
              </ScrollView>
            ) : (
              <FlatList
                style={[styles.recentTicketsList, { flex: 1 }]}
                data={workflowData.recentTickets}
                keyExtractor={(item) => item.id}
                renderItem={({ item: ticket }) => (
                  <View style={styles.ticketCard}>
                    <View style={styles.ticketHeader}>
                      <Text style={styles.ticketCode}>{ticket.ticketCode}</Text>
                      <Text style={[styles.ticketStatus, { color: getStatusColor(ticket.status) }]}>
                        {getStatusText(ticket.status)}
                      </Text>
                    </View>
                    <Text style={styles.ticketVehicle}>
                      {ticket.vehicle.brand} {ticket.vehicle.model} ({ticket.vehicle.plate})
                    </Text>
                    <Text style={styles.ticketParking}>{ticket.parking.name}</Text>
                  </View>
                )}
                ListHeaderComponent={
                  <View style={{ paddingBottom: S.xl }}>
                    {/* Premium Banner */}
                    <LinearGradient
                      colors={[C.primary, C.primary + "CC"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.banner}
                    >
                      <View style={styles.bannerGradient}>
                        <Text style={styles.bannerTitle}>
                          {workflowData.activeProcesses} Procesos Activos
                        </Text>
                        <Text style={styles.bannerSubtitle}>
                          {workflowData.completedToday} completados hoy · {workflowData.pendingTasks} pendientes
                        </Text>
                      </View>
                    </LinearGradient>

                    {/* Stats Grid */}
                    <View style={styles.statsGrid}>
                      <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                          <View style={[styles.statIconContainer, { backgroundColor: C.primary + "20" }]}>
                            <IconUsersGroup size={20} color={C.primary} />
                          </View>
                        </View>
                        <Text style={styles.statValue}>{workflowData.valets.available}</Text>
                        <Text style={styles.statLabel}>Disponibles</Text>
                      </View>
                      <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                          <View style={[styles.statIconContainer, { backgroundColor: C.warning + "20" }]}>
                            <IconSteeringWheel size={20} color={C.warning} />
                          </View>
                        </View>
                        <Text style={styles.statValue}>{workflowData.valets.busy}</Text>
                        <Text style={styles.statLabel}>Ocupados</Text>
                      </View>
                      <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                          <View style={[styles.statIconContainer, { backgroundColor: C.success + "20" }]}>
                            <IconTicket size={20} color={C.success} />
                          </View>
                        </View>
                        <Text style={styles.statValue}>{workflowData.completedToday}</Text>
                        <Text style={styles.statLabel}>Completados Hoy</Text>
                      </View>
                      <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                          <View style={[styles.statIconContainer, { backgroundColor: C.textMuted + "20" }]}>
                            <IconPulse size={20} color={C.textMuted} />
                          </View>
                        </View>
                        <Text style={styles.statValue}>{workflowData.performance.avgServiceMinutes}m</Text>
                        <Text style={styles.statLabel}>Tiempo Promedio</Text>
                      </View>
                    </View>

                    {/* Breakdown Section */}
                    <Text style={styles.sectionTitle}>Desglose de Tickets</Text>
                    <View style={styles.breakdownRow}>
                      <View style={styles.breakdownItem}>
                        <Text style={styles.breakdownValue}>{workflowData.breakdown.requestParking}</Text>
                        <Text style={styles.breakdownLabel}>Solicitudes</Text>
                      </View>
                      <View style={styles.breakdownItem}>
                        <Text style={styles.breakdownValue}>{workflowData.breakdown.parked}</Text>
                        <Text style={styles.breakdownLabel}>Estacionados</Text>
                      </View>
                      <View style={styles.breakdownItem}>
                        <Text style={styles.breakdownValue}>{workflowData.breakdown.requestDelivery}</Text>
                        <Text style={styles.breakdownLabel}>Entregas</Text>
                      </View>
                    </View>

                    {/* Recent Tickets */}
                    <Text style={styles.sectionTitle}>Tickets Recientes</Text>
                  </View>
                }
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={C.primary}
                    colors={[C.primary]}
                  />
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: S.xl }}
              />
            )
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.emptyText}>No hay datos disponibles</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
