import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { t } from '@/lib/i18n';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type AspectRatio = '1:1' | '4:3' | '16:9' | '9:16' | 'free';
type CropMode = 'profile' | 'banner' | 'custom';

interface CropSettings {
  aspectRatio: AspectRatio;
  circular: boolean;
  quality: number;
  outputSize: number;
}

type Props = {
  visible: boolean;
  imageUrl: string;
  onClose: () => void;
  onCrop: (croppedImageUri: string) => void;
  locale?: 'es' | 'en';
  mode?: CropMode;
  settings?: Partial<CropSettings>;
};

const ASPECT_RATIOS: Record<AspectRatio, number> = {
  '1:1': 1,
  '4:3': 4/3,
  '16:9': 16/9,
  '9:16': 9/16,
  'free': 0,
};

const ASPECT_RATIO_LABELS: Record<AspectRatio, string> = {
  '1:1': '1:1',
  '4:3': '4:3',
  '16:9': '16:9',
  '9:16': '9:16',
  'free': 'Free',
};

const DEFAULT_SETTINGS: Record<CropMode, CropSettings> = {
  profile: {
    aspectRatio: '1:1',
    circular: true,
    quality: 1.0,
    outputSize: 800,
  },
  banner: {
    aspectRatio: '16:9',
    circular: false,
    quality: 0.9,
    outputSize: 1200,
  },
  custom: {
    aspectRatio: 'free',
    circular: false,
    quality: 0.9,
    outputSize: 800,
  },
};

export function CropModal({
  visible,
  imageUrl,
  onClose,
  onCrop,
  locale = 'es',
  mode = 'profile',
  settings = {}
}: Props) {
  const cropSettings = { ...DEFAULT_SETTINGS[mode], ...settings };
  const { circular, quality, outputSize, aspectRatio: initialAspectRatio } = cropSettings;

  const [currentAspectRatio, setCurrentAspectRatio] = useState<AspectRatio>(initialAspectRatio);
  const [rotation, setRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  // Calculate crop area dimensions
  let cropWidth: number, cropHeight: number;
  if (circular) {
    const minDimension = Math.min(screenWidth, screenHeight * 0.7);
    cropWidth = minDimension * 0.85;
    cropHeight = cropWidth;
  } else if (initialAspectRatio === 'free') {
    const availableHeight = screenHeight * 0.55;
    cropWidth = screenWidth * 0.95;
    cropHeight = availableHeight;
  } else {
    const availableHeight = screenHeight * 0.55;
    const maxCropWidth = screenWidth * 0.95;
    const maxCropHeight = availableHeight;
    const ratio = ASPECT_RATIOS[initialAspectRatio];
    if (maxCropWidth / ratio <= maxCropHeight) {
      cropWidth = maxCropWidth;
      cropHeight = cropWidth / ratio;
    } else {
      cropHeight = maxCropHeight;
      cropWidth = cropHeight * ratio;
    }
  }

  useEffect(() => {
    if (imageUrl && visible) {
      Image.getSize(imageUrl, (width, height) => {
        console.log('Image size:', width, height);
        setImageSize({ width, height });
        
        // Calculate scale to ensure image fits completely within circle
        const imageAspect = width / height;
        const cropAspect = cropWidth / cropHeight;
        let minScale;
        if (imageAspect > cropAspect) {
          minScale = cropHeight / height;
        } else {
          minScale = cropWidth / width;
        }
        // Use exact fit to ensure no black spaces
        scale.setValue(minScale);
        
        // Center the image
        translateX.setValue(0);
        translateY.setValue(0);
      });
    }
  }, [imageUrl, visible, cropWidth, cropHeight]);

  const handleRotate = () => {
    console.log('Rotate button pressed');
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    console.log('Reset button pressed');
    setRotation(0);
    Animated.spring(translateX, { toValue: 0, useNativeDriver: false }).start();
    Animated.spring(translateY, { toValue: 0, useNativeDriver: false }).start();
  };

  const handleAspectRatioChange = (newRatio: AspectRatio) => {
    console.log('Aspect ratio changed to:', newRatio);
    setCurrentAspectRatio(newRatio);
  };

  const onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    { 
      useNativeDriver: false,
      listener: (event: any) => {
        if (imageSize.width === 0 || imageSize.height === 0) return;

        const scaledWidth = imageSize.width * scale._value;
        const scaledHeight = imageSize.height * scale._value;

        // Calculate limits to ensure image always covers the circle completely
        const maxTranslateX = Math.max(0, (scaledWidth - cropWidth) / 2);
        const maxTranslateY = Math.max(0, (scaledHeight - cropHeight) / 2);

        // Allow movement in any direction but ensure no black spaces
        const newX = Math.max(-maxTranslateX, Math.min(maxTranslateX, event.nativeEvent.translationX));
        const newY = Math.max(-maxTranslateY, Math.min(maxTranslateY, event.nativeEvent.translationY));

        translateX.setValue(newX);
        translateY.setValue(newY);
      }
    }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      if (imageSize.width === 0 || imageSize.height === 0) return;

      const scaledWidth = imageSize.width * scale._value;
      const scaledHeight = imageSize.height * scale._value;

      // Calculate limits to ensure image always covers the circle completely
      const maxTranslateX = Math.max(0, (scaledWidth - cropWidth) / 2);
      const maxTranslateY = Math.max(0, (scaledHeight - cropHeight) / 2);

      const newX = Math.max(-maxTranslateX, Math.min(maxTranslateX, event.nativeEvent.translationX));
      const newY = Math.max(-maxTranslateY, Math.min(maxTranslateY, event.nativeEvent.translationY));

      // Keep the position where user left it, but ensure no empty spaces
      Animated.spring(translateX, { toValue: newX, useNativeDriver: false }).start();
      Animated.spring(translateY, { toValue: newY, useNativeDriver: false }).start();
    }
  };

  const handleCrop = async () => {
    setIsProcessing(true);
    try {
      const scaledWidth = imageSize.width * scale._value;
      const scaledHeight = imageSize.height * scale._value;

      const centerX = scaledWidth / 2 + translateX._value;
      const centerY = scaledHeight / 2 + translateY._value;

      const cropLeft = centerX - cropWidth / 2;
      const cropTop = centerY - cropHeight / 2;

      const cropX = cropLeft / scale._value;
      const cropY = cropTop / scale._value;
      const cropWidthPx = cropWidth / scale._value;
      const cropHeightPx = cropHeight / scale._value;

      const clampedCropX = Math.max(0, Math.min(cropX, imageSize.width - cropWidthPx));
      const clampedCropY = Math.max(0, Math.min(cropY, imageSize.height - cropHeightPx));
      const clampedCropWidth = Math.min(cropWidthPx, imageSize.width - clampedCropX);
      const clampedCropHeight = Math.min(cropHeightPx, imageSize.height - clampedCropY);

      const operations: any[] = [];

      if (rotation % 360 !== 0) {
        operations.push({ rotate: rotation });
      }

      operations.push({
        crop: {
          originX: clampedCropX,
          originY: clampedCropY,
          width: clampedCropWidth,
          height: clampedCropHeight,
        },
      });

      const currentRatio = currentAspectRatio === 'free' ? 1 : ASPECT_RATIOS[currentAspectRatio];
      operations.push({ 
        resize: { 
          width: outputSize, 
          height: currentAspectRatio === 'free' ? outputSize : outputSize / currentRatio 
        } 
      });

      const result = await manipulateAsync(
        imageUrl,
        operations,
        {
          compress: quality,
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
    } finally {
      setIsProcessing(false);
    }
  };

  console.log('CropModal rendering, visible:', visible, 'imageUrl:', imageUrl);

  const cropFrameTop = (screenHeight - cropHeight) / 2 - 80;
  const cropFrameLeft = (screenWidth - cropWidth) / 2;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.fullScreenOverlay}>
        <View style={[styles.overlayTop, { height: cropFrameTop }]} />
        <View style={[styles.overlayBottom, { top: cropFrameTop + cropHeight }]} />
        <View style={[styles.overlayLeft, { top: cropFrameTop, height: cropHeight, width: cropFrameLeft }]} />
        <View style={[styles.overlayRight, { top: cropFrameTop, height: cropHeight, left: cropFrameLeft + cropWidth, width: screenWidth - (cropFrameLeft + cropWidth) }]} />
        
        <View style={[styles.cropFrame, { width: cropWidth, height: cropHeight, borderRadius: circular ? cropWidth / 2 : 0, position: 'absolute', top: cropFrameTop, left: cropFrameLeft }]}>
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
          >
            <Animated.View style={[
              styles.imageContainer,
              {
                transform: [
                  { translateX: translateX },
                  { translateY: translateY },
                  { scale: scale },
                  { rotate: `${rotation}deg` },
                ],
              }
            ]}>
              <Image 
                source={{ uri: imageUrl }} 
                style={{ width: imageSize.width, height: imageSize.height, resizeMode: 'cover' }} 
              />
            </Animated.View>
          </PanGestureHandler>
          
          {!circular && (
            <>
              <View style={styles.gridLineHorizontal} />
              <View style={styles.gridLineVertical} />
            </>
          )}
          
          <View style={[styles.cropFrameBorder, { borderRadius: circular ? cropWidth / 2 : 0 }]} />
        </View>

        {isProcessing && (
          <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.processingText}>{locale === 'es' ? 'Procesando...' : 'Processing...'}</Text>
          </View>
        )}

        <View style={styles.controlsOverlay}>
          <View style={styles.header}>
            <Pressable onPress={onClose} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>✕</Text>
            </Pressable>
            <Text style={styles.headerTitle}>{t(locale, mode === 'profile' ? "settings.cropLogoTitle" : "settings.cropBannerTitle")}</Text>
            <Pressable onPress={handleReset} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>↺</Text>
            </Pressable>
          </View>

          {!circular && (
            <View style={styles.aspectRatioSelector}>
              {(Object.keys(ASPECT_RATIOS) as AspectRatio[]).map((ratio) => (
                <Pressable
                  key={ratio}
                  onPress={() => handleAspectRatioChange(ratio)}
                  style={[styles.aspectRatioButton, currentAspectRatio === ratio && styles.aspectRatioButtonActive]}
                >
                  <Text style={[styles.aspectRatioButtonText, currentAspectRatio === ratio && styles.aspectRatioButtonTextActive]}>
                    {ASPECT_RATIO_LABELS[ratio]}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          <View style={styles.toolbar}>
            <Pressable onPress={handleRotate} style={styles.toolbarButton}>
              <Text style={styles.toolbarIcon}>↻</Text>
              <Text style={styles.toolbarLabel}>{locale === 'es' ? 'Rotar' : 'Rotate'}</Text>
            </Pressable>
          </View>

          <Text style={styles.instructions}>{locale === 'es' ? 'Selecciona el área de recorte' : 'Select crop area'}</Text>

          <View style={styles.buttonContainer}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onClose} disabled={isProcessing}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>{t(locale, "settings.cropCancel")}</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.applyButton, isProcessing && styles.buttonDisabled]} onPress={handleCrop} disabled={isProcessing}>
              <Text style={[styles.buttonText, styles.applyButtonText]}>{isProcessing ? (locale === 'es' ? 'Procesando...' : 'Processing...') : t(locale, "settings.cropApply")}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlayTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  overlayBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  overlayLeft: {
    position: 'absolute',
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  overlayRight: {
    position: 'absolute',
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  processingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  cropFrame: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
    position: 'relative',
    zIndex: 10,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  cropFrameBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 3,
    borderColor: '#fff',
    pointerEvents: 'none',
  },
  gridLineHorizontal: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    pointerEvents: 'none',
  },
  gridLineVertical: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    pointerEvents: 'none',
  },
  controlsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
    fontFamily: 'CalSans',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    padding: 6,
    alignSelf: 'center',
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  toolbarIcon: {
    color: '#fff',
    fontSize: 18,
    marginRight: 6,
  },
  toolbarLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  aspectRatioSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  aspectRatioButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  aspectRatioButtonActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
    borderColor: '#007AFF',
  },
  aspectRatioButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontWeight: '600',
  },
  aspectRatioButtonTextActive: {
    color: '#fff',
  },
  instructions: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  cancelButtonText: {
    color: '#fff',
  },
  applyButtonText: {
    color: '#fff',
  },
});
