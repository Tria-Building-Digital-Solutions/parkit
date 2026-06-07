import React from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, Image } from 'react-native';
import { IconCamera, IconGallery, IconCircleX } from '@/components/Icons';
import { useValetTheme } from '@/theme/valetTheme';

interface DamagePhoto {
  id: string;
  uri: string;
}

interface DamagePhotoSelectorProps {
  photos: DamagePhoto[];
  maxPhotos: number;
  onTakePhoto: () => void;
  onPickFromGallery: () => void;
  onRemovePhoto: (id: string) => void;
  cameraText: string;
  galleryText: string;
  disabled?: boolean;
}

export default function DamagePhotoSelector({
  photos,
  maxPhotos,
  onTakePhoto,
  onPickFromGallery,
  onRemovePhoto,
  cameraText,
  galleryText,
  disabled = false,
}: DamagePhotoSelectorProps) {
  const theme = useValetTheme();
  const styles = createStyles(theme);

  const renderPhoto = ({ item }: { item: DamagePhoto }) => (
    <View style={styles.photoContainer}>
      <Image source={{ uri: item.uri }} style={styles.photo} />
      <Pressable
        style={styles.removeButton}
        onPress={() => onRemovePhoto(item.id)}
        accessibilityLabel="Remove photo"
      >
        <IconCircleX size={16} color={theme.colors.logout} />
      </Pressable>
    </View>
  );

  const canAddMore = photos.length < maxPhotos && !disabled;

  return (
    <View style={styles.container}>
      <View style={styles.photoGrid}>
        <FlatList
          data={photos}
          renderItem={renderPhoto}
          keyExtractor={(item) => item.id}
          numColumns={3}
          scrollEnabled={false}
          style={styles.photoList}
        />
        
        {canAddMore && (
          <Pressable
            style={[styles.addPhotoButton, { borderColor: theme.colors.border }]}
            onPress={onTakePhoto}
            disabled={disabled}
          >
            <IconCamera size={20} color={theme.colors.textMuted} />
          </Pressable>
        )}
        
        {canAddMore && (
          <Pressable
            style={[styles.addPhotoButton, { borderColor: theme.colors.border }]}
            onPress={onPickFromGallery}
            disabled={disabled}
          >
            <IconGallery size={20} color={theme.colors.textMuted} />
          </Pressable>
        )}
      </View>
      
      <View style={styles.buttonRow}>
        <Pressable
          style={({ pressed }) => [
            styles.footerSecondaryBtn,
            { borderColor: theme.colors.border, backgroundColor: theme.colors.card },
            pressed && styles.pressed,
            !canAddMore && styles.btnDisabled,
          ]}
          onPress={onTakePhoto}
          disabled={!canAddMore}
        >
          <IconCamera size={20} color={theme.colors.text} />
          <Text style={[styles.footerSecondaryBtnText, { color: theme.colors.text }]}>
            {cameraText}
          </Text>
        </Pressable>
        
        <Pressable
          style={({ pressed }) => [
            styles.footerSecondaryBtn,
            { borderColor: theme.colors.border, backgroundColor: theme.colors.card },
            pressed && styles.pressed,
            !canAddMore && styles.btnDisabled,
          ]}
          onPress={onPickFromGallery}
          disabled={!canAddMore}
        >
          <IconGallery size={20} color={theme.colors.text} />
          <Text style={[styles.footerSecondaryBtnText, { color: theme.colors.text }]}>
            {galleryText}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function createStyles(theme: any) {
  const S = theme.space;
  const R = theme.radius;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    photoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: S.md,
    },
    photoList: {
      width: '100%',
    },
    photoContainer: {
      width: '33%',
      aspectRatio: 1,
      padding: S.xs,
    },
    photo: {
      flex: 1,
      borderRadius: R.sm,
      backgroundColor: theme.colors.bg,
    },
    removeButton: {
      position: 'absolute',
      top: S.xs + 4,
      right: S.xs + 4,
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 2,
    },
    addPhotoButton: {
      width: '33%',
      aspectRatio: 1,
      marginHorizontal: S.xs,
      marginBottom: S.xs,
      borderRadius: R.sm,
      borderWidth: 2,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonRow: {
      flexDirection: 'row',
      gap: S.sm,
    },
    footerSecondaryBtn: {
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: S.sm,
      paddingVertical: S.md,
      paddingHorizontal: S.sm,
      borderRadius: R.card,
      borderWidth: 2,
      backgroundColor: theme.colors.card,
    },
    footerSecondaryBtnText: {
      color: theme.colors.text,
      fontWeight: '800',
      fontSize: theme.font.base,
    },
    pressed: {
      opacity: 0.7,
    },
    btnDisabled: {
      opacity: 0.5,
    },
  });
}
