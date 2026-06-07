import { Modal, View, Pressable, Text, StyleSheet, Platform } from "react-native";
import type { ReactNode } from "react";
import type { useValetTheme } from "@/theme/valetTheme";

interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  theme: ReturnType<typeof useValetTheme>;
}

export function BaseModal({ visible, onClose, title, children, theme }: BaseModalProps) {
  const C = theme.colors;
  const Fonts = theme.fontFamily;
  const F = theme.font;

  const styles = StyleSheet.create({
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
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 20,
      backgroundColor: C.card,
      borderColor: C.border,
    },
    modalTitle: {
      fontSize: F.md,
      fontWeight: Platform.OS === "android" ? "normal" : "800",
      textAlign: "center",
      marginBottom: 12,
      color: C.text,
      fontFamily: Fonts.primary,
    },
    modalList: {
      maxHeight: 300,
    },
    modalRow: {
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    modalRowName: {
      fontSize: F.base,
      fontWeight: "800",
    },
    modalRowWithCheck: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    modalRowText: {
      flex: 1,
    },
    modalRowAddr: {
      fontSize: F.xs,
      marginTop: 4,
      lineHeight: F.sm,
    },
    pressed: { opacity: 0.9 },
  });

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdropPress} onPress={onClose} accessibilityLabel="Cancel" />
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>{title}</Text>
          {children}
        </View>
      </View>
    </Modal>
  );
}

export const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.45)",
  },
  modalBackdropPress: {
    flex: 1,
  },
  modalSheet: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderColor: "rgba(0, 0, 0, 0.08)",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: Platform.OS === "android" ? "normal" : "800",
    textAlign: "center",
    marginBottom: 12,
    color: "#0F172A",
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
  },
  modalList: {
    maxHeight: 300,
  },
  modalRow: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalRowName: {
    fontSize: 14,
    fontWeight: "800",
  },
  modalRowWithCheck: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalRowText: {
    flex: 1,
  },
  modalRowAddr: {
    fontSize: 10,
    marginTop: 4,
    lineHeight: 12,
  },
  pressed: { opacity: 0.9 },
});
