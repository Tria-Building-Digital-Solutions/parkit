import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { IconCamera, IconGallery } from '@/components/Icons';
import { useValetTheme } from '@/theme/valetTheme';

interface PhotoSelectorProps {
  visible: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onPickFromGallery: () => void;
  title: string;
  cameraText: string;
  galleryText: string;
  cancelText: string;
}

export default function PhotoSelector({
  visible,
  onClose,
  onTakePhoto,
  onPickFromGallery,
  title,
  cameraText,
  galleryText,
  cancelText,
}: PhotoSelectorProps) {
  const theme = useValetTheme();
  const styles = createStyles(theme);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.selector, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        
        <View style={styles.options}>
          <Pressable
            style={({ pressed }) => [
              styles.option,
              { borderColor: theme.colors.border, backgroundColor: theme.colors.card },
              pressed && styles.pressed,
            ]}
            onPress={onTakePhoto}
          >
            <IconCamera size={24} color={theme.colors.primary} />
            <Text style={[styles.optionText, { color: theme.colors.text }]}>{cameraText}</Text>
          </Pressable>
          
          <Pressable
            style={({ pressed }) => [
              styles.option,
              { borderColor: theme.colors.border, backgroundColor: theme.colors.card },
              pressed && styles.pressed,
            ]}
            onPress={onPickFromGallery}
          >
            <IconGallery size={24} color={theme.colors.primary} />
            <Text style={[styles.optionText, { color: theme.colors.text }]}>{galleryText}</Text>
          </Pressable>
        </View>
        
        <Pressable
          style={[styles.cancel, { backgroundColor: theme.colors.bg }]}
          onPress={onClose}
        >
          <Text style={[styles.cancelText, { color: theme.colors.text }]}>{cancelText}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function createStyles(theme: any) {
  const S = theme.space;
  const R = theme.radius;

  return StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 1000,
    },
    backdrop: {
      flex: 1,
    },
    selector: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      borderTopLeftRadius: R.card,
      borderTopRightRadius: R.card,
      paddingTop: S.sm,
      paddingBottom: S.xl,
      borderTopWidth: 1,
    },
    handle: {
      width: 36,
      height: 5,
      borderRadius: 3,
      alignSelf: 'center',
      marginBottom: S.md,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: S.lg,
      paddingHorizontal: S.lg,
    },
    options: {
      paddingHorizontal: S.lg,
      marginBottom: S.sm,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: S.md,
      paddingHorizontal: S.md,
      borderRadius: R.card,
      borderWidth: 1,
      marginBottom: S.sm,
    },
    optionText: {
      fontSize: 16,
      fontWeight: '600',
      marginLeft: S.md,
    },
    cancel: {
      marginHorizontal: S.lg,
      paddingVertical: S.md,
      borderRadius: R.card,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cancelText: {
      fontSize: 16,
      fontWeight: '600',
    },
    pressed: {
      opacity: 0.7,
    },
  });
}
