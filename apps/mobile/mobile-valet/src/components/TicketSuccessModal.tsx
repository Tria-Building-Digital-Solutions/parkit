import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, Pressable, LayoutChangeEvent, ActivityIndicator } from "react-native";
import Svg, { Defs, Mask, Rect, Circle, Line } from "react-native-svg";
import { useValetTheme } from "@/theme/valetTheme";
import { IconX } from "@/components/Icons";

interface TicketData {
  ticketCode: string;
  vehiclePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  driverName: string;
  valetName: string;
  parkingName: string;
  createdAt: string;
}

interface TicketSuccessModalProps {
  visible: boolean;
  ticketData: TicketData;
  onConfirm: () => void;
  onCancel: () => void;
  submitting?: boolean;
}

const NOTCH_RADIUS = 8;
const NOTCH_DIAMETER = NOTCH_RADIUS * 2;
const NOTCH_SPACING = 4;

/**
 * RippedEdge — Perforated ticket edge.
 *
 * The punched-out notches are now transparent instead of showing
 * the dark backdrop color — this removes the black shadow halo effect.
 *
 * How transparency works here:
 *   The SVG Mask cuts circles out of the paper-colored Rect.
 *   Where the mask is black (the notches), nothing is drawn at all —
 *   React Native renders those pixels as fully transparent, so whatever
 *   is behind the ticketContainer (the modal backdrop) shows through
 *   naturally without any hardcoded color bleed.
 */
const RippedEdge = ({
  isBottom = false,
  color = "#fefefe",
}: {
  isBottom?: boolean;
  color?: string;
}) => {
  const [width, setWidth] = useState(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const slotWidth = NOTCH_DIAMETER + NOTCH_SPACING;
  const notchCount = width > 0 ? Math.floor(width / slotWidth) : 0;
  const totalNotchesWidth = notchCount * slotWidth;
  const offsetX = (width - totalNotchesWidth) / 2;
  const height = NOTCH_RADIUS;

  // Top edge: cy=0 → bottom semicircle hangs into the ticket
  // Bottom edge: cy=height → top semicircle rises into the ticket
  const cy = isBottom ? height : 0;
  const maskId = `mask-${isBottom ? "bot" : "top"}`;

  return (
    <View
      onLayout={handleLayout}
      style={{
        width: "100%",
        height,
        zIndex: 2,
        marginTop: isBottom ? -1 : 0,
        marginBottom: isBottom ? 0 : -1,
      }}
    >
      {width > 0 && (
        // transparent background on the SVG itself so notch holes are truly clear
        <Svg width={width} height={height} style={{ backgroundColor: "transparent" }}>
          <Defs>
            <Mask id={maskId}>
              {/* White = draw the paper strip */}
              <Rect x="0" y="0" width={width} height={height} fill="white" />
              {/* Black = punch out each notch — no fill drawn here, becomes transparent */}
              {Array.from({ length: notchCount }).map((_, i) => (
                <Circle
                  key={i}
                  cx={offsetX + i * slotWidth + slotWidth / 2}
                  cy={cy}
                  r={NOTCH_RADIUS}
                  fill="black"
                />
              ))}
            </Mask>
          </Defs>

          {/*
           * Single layer: paper strip with notches masked out.
           * No backdrop Rect underneath — the holes are transparent.
           */}
          <Rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill={color}
            mask={`url(#${maskId})`}
          />
        </Svg>
      )}
    </View>
  );
};

/**
 * DashedDivider — Horizontal dashed line separator.
 * Used between the header/body and body/footer sections
 * to mimic a classic tear-off ticket perforation line.
 */
const DashedDivider = ({ color = "#e2e8f0" }: { color?: string }) => (
  <View style={{ width: "100%", height: 10, backgroundColor: "#fefefe", justifyContent: "center" }}>
    <Svg width="100%" height="10">
      <Line
        x1="0"
        y1="5"
        x2="10000"
        y2="5"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray="6,5"
      />
    </Svg>
  </View>
);

export function TicketSuccessModal({
  visible,
  ticketData,
  onConfirm,
  onCancel,
  submitting = false,
}: TicketSuccessModalProps) {
  const theme = useValetTheme();
  const S = theme.space;
  const F = theme.font;

  // Formatear fecha y hora
  const formatDateTime = (dateString?: string) => {
    const formatTime = (date: Date) => {
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12
      return `${hours}:${minutes} ${ampm}`;
    };

    if (!dateString) {
      const now = new Date();
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear();
      
      return {
        date: `${day}/${month}/${year}`,
        time: formatTime(now)
      };
    }
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Si la fecha es inválida, usar fecha actual
      const now = new Date();
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear();
      
      return {
        date: `${day}/${month}/${year}`,
        time: formatTime(now)
      };
    }
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return {
      date: `${day}/${month}/${year}`,
      time: formatTime(date)
    };
  };

  const { date, time } = formatDateTime(ticketData.createdAt);

  const BACKDROP = "rgba(15, 23, 42, 0.9)";
  const PAPER = "#fefefe";

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: BACKDROP,
      justifyContent: "center",
      alignItems: "center",
      padding: S.md,
    },
    ticketContainer: {
      width: "90%",
      maxWidth: 380,
      backgroundColor: "transparent",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.3,
      shadowRadius: 15,
      elevation: 20,
    },
    ticketTop: {
      backgroundColor: PAPER,
      paddingTop: S.lg,
      paddingBottom: S.md,
      alignItems: "center",
    },
    ticketTitle: {
      fontSize: F.xs,
      fontWeight: "700",
      color: "#64748b",
      letterSpacing: 2,
    },
    ticketSubtitle: {
      fontSize: F.lg,
      fontWeight: "900",
      color: "#0f172a",
      marginTop: 4,
    },
    ticketBody: {
      paddingHorizontal: S.xl,
      paddingVertical: S.lg,
      backgroundColor: PAPER,
    },
    ticketCodeBox: {
      backgroundColor: "#f1f5f9",
      borderRadius: 12,
      padding: S.lg,
      marginBottom: S.xl,
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: "#e2e8f0",
      borderStyle: "dashed",
    },
    ticketCodeLabel: {
      fontSize: F.xs,
      color: "#64748b",
      fontWeight: "700",
    },
    ticketCode: {
      fontSize: F.xxxl,
      fontWeight: "800",
      letterSpacing: 8,
      color: "#000",
      fontFamily: "Courier",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: S.sm,
      borderBottomWidth: 1,
      borderBottomColor: "#f1f5f9",
    },
    label: {
      fontSize: F.sm,
      fontWeight: "700",
      color: "#1e293b",
    },
    value: {
      fontSize: F.sm,
      fontWeight: "700",
      color: "#94a3b8",
      textAlign: "right",
      flex: 1,
      marginLeft: S.md,
    },
    ticketBottom: {
      backgroundColor: PAPER,
      padding: S.xl,
    },
    confirmButton: {
      backgroundColor: "#0f172a",
      paddingVertical: S.md,
      borderRadius: 12,
      alignItems: "center",
    },
    confirmButtonDisabled: {
      opacity: 0.6,
    },
    confirmButtonText: {
      color: "#FFF",
      fontWeight: "700",
      fontSize: F.sm,
    },
    closeIcon: {
      position: "absolute",
      // Offset below the notch strip height so it doesn't overlap the edge
      top: NOTCH_RADIUS + 12,
      right: S.lg,
      zIndex: 10,
    },
    singleUseText: {
      fontSize: F.xs,
      color: "#94a3b8",
      marginTop: S.xl,
      textAlign: "center",
      fontWeight: "600",
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.ticketContainer}>

          <Pressable style={styles.closeIcon} onPress={onCancel} hitSlop={20}>
            <IconX size={theme.icon.md} color="#0f172a" />
          </Pressable>

          {/* Top perforated edge — notches hang downward, holes are transparent */}
          <RippedEdge color={PAPER} />

          {/* Header */}
          <View style={styles.ticketTop}>
            <Text style={styles.ticketTitle}>Comprobante de parqueo</Text>
            <Text style={styles.ticketSubtitle}>Valet Parking</Text>
          </View>

          {/* Dashed line separating header from body */}
          <DashedDivider />

          {/* Body */}
          <View style={styles.ticketBody}>
            <View style={styles.ticketCodeBox}>
              <Text style={styles.ticketCodeLabel}>Código para retiro</Text>
              <Text style={styles.ticketCode}>{ticketData.ticketCode}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Ubicación</Text>
              <Text style={styles.value}>{ticketData.parkingName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Placa</Text>
              <Text style={styles.value}>{ticketData.vehiclePlate}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Vehículo</Text>
              <Text style={styles.value}>
                {ticketData.vehicleBrand} {ticketData.vehicleModel}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Conductor</Text>
              <Text style={styles.value}>{ticketData.driverName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Valet</Text>
              <Text style={styles.value}>{ticketData.valetName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Fecha</Text>
              <Text style={styles.value}>{date}</Text>
            </View>
            <View style={[styles.row, { borderBottomWidth: 0 }]}>
              <Text style={styles.label}>Hora</Text>
              <Text style={styles.value}>{time}</Text>
            </View>

            <Text style={styles.singleUseText}>Código de un único uso</Text>
          </View>

          {/* Dashed line separating body from footer */}
          <DashedDivider />

          {/* Footer */}
          <View style={styles.ticketBottom}>
            <Pressable 
              style={[styles.confirmButton, submitting && styles.confirmButtonDisabled]} 
              onPress={onConfirm}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              )}
            </Pressable>
          </View>

          {/* Bottom perforated edge — notches rise upward, holes are transparent */}
          <RippedEdge isBottom color={PAPER} />

        </View>
      </View>
    </Modal>
  );
}