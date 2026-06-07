import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { t } from '@/lib/i18n';

type Props = {
  visible: boolean;
  imageUrl: string;
  onClose: () => void;
  onCrop: (croppedImageUri: string) => void;
  locale: 'es' | 'en';
};

const { width: screenWidth } = Dimensions.get('window');
const CROP_SIZE = Math.min(screenWidth * 0.8, 300);
const OUTPUT_SIZE = 400;

export function ImageCropModal({ visible, imageUrl, onClose, onCrop, locale }: Props) {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // No action needed on grant
      },
      onPanResponderMove: (_, gestureState) => {
        setPosition({
          x: gestureState.dx,
          y: gestureState.dy,
        });
      },
      onPanResponderRelease: () => {
        // Keep the position when released
      },
    })
  ).current;

  useEffect(() => {
    if (imageUrl) {
      Image.getSize(imageUrl, (width, height) => {
        setImageSize({ width, height });
        // Initial scale to fit the crop area
        const imageAspect = width / height;
        const cropAspect = 1; // Square crop
        let initialScale = 1;
        
        if (imageAspect > cropAspect) {
          initialScale = CROP_SIZE / height;
        } else {
          initialScale = CROP_SIZE / width;
        }
        
        setScale(initialScale);
        setPosition({ x: 0, y: 0 });
      });
    }
  }, [imageUrl]);

  const handleCrop = async () => {
    try {
      // Calculate the crop area based on current scale and position
      const cropWidth = OUTPUT_SIZE / scale;
      const cropHeight = OUTPUT_SIZE / scale;
      const cropX = (imageSize.width - cropWidth) / 2 + (position.x / scale);
      const cropY = (imageSize.height - cropHeight) / 2 + (position.y / scale);

      const result = await manipulateAsync(
        imageUrl,
        [
          {
            crop: {
              originX: Math.max(0, cropX),
              originY: Math.max(0, cropY),
              width: Math.min(cropWidth, imageSize.width - Math.max(0, cropX)),
              height: Math.min(cropHeight, imageSize.height - Math.max(0, cropY)),
            },
          },
          { resize: { width: OUTPUT_SIZE, height: OUTPUT_SIZE } },
        ],
        {
          compress: 0.8,
          format: SaveFormat.JPEG,
          base64: true,
        }
      );

      if (result.base64) {
        const dataUri = `data:image/jpeg;base64,${result.base64}`;
        onCrop(dataUri);
      }
    } catch (error) {
      console.error('Error cropping image:', error);
      onClose();
    }
  };

  const scaledWidth = imageSize.width * scale;
  const scaledHeight = imageSize.height * scale;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {t(locale, "settings.cropLogoTitle")}
            </Text>
          </View>

          {/* Crop Area */}
          <View style={styles.cropContainer}>
            <View style={styles.cropArea}>
              {/* Image */}
              <Animated.View
                style={[
                  styles.imageContainer,
                  {
                    width: scaledWidth,
                    height: scaledHeight,
                    transform: [
                      { translateX: position.x },
                      { translateY: position.y },
                    ],
                  },
                ]}
                {...panResponder.panHandlers}
              >
                <Image
                  source={{ uri: imageUrl }}
                  style={{
                    width: scaledWidth,
                    height: scaledHeight,
                    resizeMode: 'cover',
                  }}
                />
              </Animated.View>
            </View>
            {/* Crop overlay */}
            <View style={styles.cropOverlay} />
          </View>

          {/* Instructions */}
          <Text style={styles.instructions}>
            {t(locale, "settings.cropHint")}
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                {t(locale, "settings.cropCancel")}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.applyButton]}
              onPress={handleCrop}
            >
              <Text style={[styles.buttonText, styles.applyButtonText]}>
                {t(locale, "settings.cropApply")}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1f2937',
  },
  cropContainer: {
    width: CROP_SIZE,
    height: CROP_SIZE,
    marginBottom: 16,
    position: 'relative',
  },
  cropArea: {
    width: CROP_SIZE,
    height: CROP_SIZE,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cropOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CROP_SIZE,
    height: CROP_SIZE,
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderRadius: 8,
    pointerEvents: 'none',
  },
  instructions: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  applyButton: {
    backgroundColor: '#3b82f6',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#374151',
  },
  applyButtonText: {
    color: 'white',
  },
});
