import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useValetTheme } from "@/theme/valetTheme";
import { useLocaleStore, useParkingPreferenceStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { IconUsersGroup, IconCheck } from "@/components/Icons";
import { useEffect, useState } from "react";
import { parkitTilePalette } from "@/lib/homeUtils";
import api from "@/lib/api";
import type { ValetOpt } from "@/types/receive";

interface WorkflowTileProps {
  styles: {
    tile: object;
    tileWorkflow: object;
    pressed: object;
  };
  isDark: boolean;
}

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

export function WorkflowTile({ styles: parentStyles, isDark }: WorkflowTileProps) {
  const theme = useValetTheme();
  const locale = useLocaleStore((s) => s.locale);
  const manualParkingId = useParkingPreferenceStore((s) => s.manualParkingId);
  const C = theme.colors;
  const F = theme.font;
  const P = parkitTilePalette(isDark);

  const [status, setStatus] = useState<WorkflowStatus | null>(null);
  const [valets, setValets] = useState<ValetOpt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statusUrl = manualParkingId
          ? `/valets/workflow-status?parkingId=${encodeURIComponent(manualParkingId)}`
          : "/valets/workflow-status";
        const valetsUrl = manualParkingId
          ? `/valets/for-parking/${encodeURIComponent(manualParkingId)}`
          : "/valets/for-company";

        const [statusRes, valetsRes] = await Promise.all([
          api.get<WorkflowStatus>(statusUrl),
          api.get<{ data: ValetOpt[] }>(valetsUrl),
        ]);
        setStatus(statusRes.data);
        setValets(Array.isArray(valetsRes.data?.data) ? valetsRes.data.data : []);
      } catch {
        setStatus({
          activeProcesses: 0,
          completedToday: 0,
          pendingTasks: 0,
          lastUpdated: new Date().toISOString(),
          breakdown: { requestParking: 0, parked: 0, requestDelivery: 0 },
          valets: { available: 0, busy: 0, away: 0, total: 0 },
          performance: { avgServiceMinutes: 0, throughputPerHour: 0 },
          recentTickets: [],
        });
        setValets([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
    const interval = setInterval(() => void fetchData(), 15000);
    return () => clearInterval(interval);
  }, [manualParkingId]);

  const baseFontSize = F.sm;
  const iconSizeSmall = 20;
  const iconSizeMedium = 24;

  const responsiveStyles = {
    container: {
      padding: 10,
    },
    header: {
      gap: 8,
    },
    iconWrap: {
      width: 28,
      height: 28,
      borderRadius: 8,
    },
    valetsSection: {
      borderRadius: 8,
      padding: 6,
      marginTop: 6,
      minHeight: 140,
    },
    statsHeader: {
      gap: 6,
      marginTop: 6,
    },
    statBadge: {
      borderRadius: 6,
      padding: 6,
    },
    valetsScroll: {
      minHeight: 120,
    },
    loadingContainer: {
      paddingVertical: 16,
    },
    emptyContainer: {
      paddingVertical: 16,
    },
    emptyIconWrap: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginBottom: 12,
    },
    emptyTitle: {
      marginBottom: 4,
    },
    listContent: {
      gap: 6,
    },
    valetItem: {
      padding: 8,
      borderRadius: 6,
    },
    statusBadge: {
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusRow: {
      gap: 5,
    },
    statusDot: {
      width: 7,
      height: 7,
      borderRadius: 7 / 2,
    },
  };

  return (
    <View style={[parentStyles.tile, parentStyles.tileWorkflow, localStyles.container, responsiveStyles.container]}>
      <View style={[localStyles.header, responsiveStyles.header]}>
        <View style={[localStyles.iconWrap, responsiveStyles.iconWrap, { backgroundColor: isDark ? "#1E293B" : "#F1F5F9" }]}>
          <IconUsersGroup size={iconSizeSmall} color={P.workflow} />
        </View>
        <Text style={[localStyles.title, { color: C.text, fontSize: baseFontSize }]} numberOfLines={1} maxFontSizeMultiplier={1.5} adjustsFontSizeToFit={true}>
          {t(locale, "home.workflowTitle")}
        </Text>
      </View>

      <View style={[localStyles.valetsSection, responsiveStyles.valetsSection, { borderColor: C.border, backgroundColor: isDark ? "rgba(15, 23, 42, 0.6)" : "rgba(226, 232, 240, 0.7)" }]}>
        <ScrollView
          style={[localStyles.valetsScroll, responsiveStyles.valetsScroll]}
          nestedScrollEnabled
          contentContainerStyle={valets.length === 0 ? { flexGrow: 1, justifyContent: 'center' } : undefined}
        >
          {loading ? (
            <View style={[localStyles.loadingContainer, responsiveStyles.loadingContainer]}>
              <Text style={[localStyles.loadingText, { color: C.textMuted }]} maxFontSizeMultiplier={1.5}>
                {t(locale, "common.loading")}
              </Text>
            </View>
          ) : valets.length === 0 ? (
            <View style={[localStyles.emptyContainer, responsiveStyles.emptyContainer]}>
              <View style={[localStyles.emptyIconWrap, responsiveStyles.emptyIconWrap, { backgroundColor: isDark ? "rgba(30, 41, 59, 0.5)" : "rgba(255, 255, 255, 0.5)" }]}>
                <IconCheck size={iconSizeMedium} color={C.success} />
              </View>
              <Text style={[localStyles.emptyTitle, responsiveStyles.emptyTitle, { color: C.text, fontSize: F.sm }]} maxFontSizeMultiplier={1.5} adjustsFontSizeToFit={true}>
                {t(locale, "home.allInOrder")}
              </Text>
              <Text style={[localStyles.emptyText, { color: C.textMuted }]} maxFontSizeMultiplier={1.5}>
                {t(locale, "home.workflowEmpty")}
              </Text>
            </View>
          ) : (
            <View style={[localStyles.listContent, responsiveStyles.listContent]}>
              {valets.map((item) => (
                <View key={item.id} style={[localStyles.valetItem, responsiveStyles.valetItem, { backgroundColor: isDark ? "rgba(30, 41, 59, 0.5)" : "rgba(255, 255, 255, 0.5)" }]}>
                  <View style={localStyles.valetInfo}>
                    <View style={localStyles.valetHeader}>
                      <Text style={[localStyles.valetName, { color: C.text }]} numberOfLines={1} maxFontSizeMultiplier={1.5} adjustsFontSizeToFit={true}>
                        {item.user.firstName} {item.user.lastName}
                      </Text>
                      <View style={[
                        localStyles.statusBadge,
                        responsiveStyles.statusBadge,
                        { backgroundColor: item.currentStatus === "AVAILABLE" ? C.success + "20" : item.currentStatus === "BUSY" ? C.warning + "20" : C.textMuted + "20" }
                      ]}>
                        <View style={[
                          localStyles.statusDot,
                          responsiveStyles.statusDot,
                          { backgroundColor: item.currentStatus === "AVAILABLE" ? "#10B981" : item.currentStatus === "BUSY" ? "#F59E0B" : "#94A3B8" }
                        ]} />
                        <Text style={[localStyles.statusText, { color: item.currentStatus === "AVAILABLE" ? "#10B981" : item.currentStatus === "BUSY" ? "#F59E0B" : "#94A3B8", fontSize: F.sm }]} maxFontSizeMultiplier={1.5}>
                          {item.currentStatus === "AVAILABLE" ? t(locale, "receive.valetStatusAvailableShort") :
                           item.currentStatus === "BUSY" ? t(locale, "receive.valetStatusBusyShort") :
                           "—"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
        <View style={[localStyles.statsHeader, responsiveStyles.statsHeader]}>
          <View style={[localStyles.statBadge, responsiveStyles.statBadge, { backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.8)", borderColor: C.border }]}>
            <Text style={[localStyles.statBadgeValue, { color: C.text }]} maxFontSizeMultiplier={1.5}>
              {status?.pendingTasks ?? "—"}
            </Text>
            <Text style={[localStyles.statBadgeLabel, { color: C.textMuted }]} maxFontSizeMultiplier={1.5}>
              {t(locale, "home.pending")}
            </Text>
          </View>
          <View style={[localStyles.statBadge, responsiveStyles.statBadge, { backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.8)", borderColor: C.border }]}>
            <Text style={[localStyles.statBadgeValue, { color: C.text }]} maxFontSizeMultiplier={1.5}>
              {status?.activeProcesses ?? "—"}
            </Text>
            <Text style={[localStyles.statBadgeLabel, { color: C.textMuted }]} maxFontSizeMultiplier={1.5}>
              {t(locale, "home.active")}
            </Text>
          </View>
          <View style={[localStyles.statBadge, responsiveStyles.statBadge, { backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.8)", borderColor: C.border }]}>
            <Text style={[localStyles.statBadgeValue, { color: C.text }]} maxFontSizeMultiplier={1.5}>
              {status?.completedToday ?? "—"}
            </Text>
            <Text style={[localStyles.statBadgeLabel, { color: C.textMuted }]} maxFontSizeMultiplier={1.5}>
              {t(locale, "home.completed")}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "800",
    flex: 1,
  },
  valetsSection: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 6,
    marginTop: 6,
    flex: 1,
    width: "100%",
    minWidth: 0,
    minHeight: 140,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
    marginTop: 6,
  },
  statBadge: {
    flex: 1,
    borderRadius: 6,
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  statBadgeValue: {
    fontWeight: "800",
  },
  statBadgeLabel: {
    fontWeight: "600",
  },
  valetsScroll: {
    flex: 1,
    minHeight: 120,
    alignContent: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  loadingText: {
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: {
    fontWeight: "700",
    marginBottom: 4,
  },
  emptyText: {
    fontWeight: "500",
  },
  listContent: {
    gap: 6,
  },
  valetItem: {
    padding: 8,
    borderRadius: 6,
  },
  valetInfo: {
    flex: 1,
  },
  valetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  valetName: {
    fontWeight: "600",
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusText: {
    fontWeight: "500",
  },
});
