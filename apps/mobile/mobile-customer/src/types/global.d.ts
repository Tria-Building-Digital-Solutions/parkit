// Global type declarations for React Native and Expo modules

declare module 'react-native' {
  // Core React Native components
  export const View: any;
  export const Text: any;
  export const Image: any;
  export const ScrollView: any;
  export const FlatList: any;
  export const SectionList: any;
  export const TextInput: any;
  export const Pressable: any;
  export const TouchableOpacity: any;
  export const TouchableHighlight: any;
  export const TouchableWithoutFeedback: any;
  export const Modal: any;
  export const ActivityIndicator: any;
  export const StatusBar: any;
  export const Platform: any;
  export const Dimensions: any;
  export const StyleSheet: any;
  export const Animated: any;
  export const PanResponder: any;
  export const Easing: any;
  export const NativeModules: any;
  export const DeviceInfo: any;
  export const PixelRatio: any;
  export const useColorScheme: any;
  export const AppState: any;
  export const Linking: any;
  export const Alert: any;
  export const Keyboard: any;
  export const BackHandler: any;
  export const PermissionsAndroid: any;
  export const Share: any;
  export const Clipboard: any;
  export const ToastAndroid: any;
  export const InteractionManager: any;
  export const LayoutAnimation: any;
  export const UIManager: any;
  export const Appearance: any;
  export const ColorPropType: any;
  export const EdgeInsetsPropType: any;
  export const PointPropType: any;
  export const ViewPropTypes: any;
  export const requireNativeComponent: any;
  
  // Additional components
  export const KeyboardAvoidingView: any;
  export const useWindowDimensions: any;
  export const RefreshControl: any;
  export const StyleProp: any;
  export type StyleProp<_T> = any;
  export const ViewStyle: any;
  export type ViewStyle = any;
  export const TextStyle: any;
  export type TextStyle = any;
  export const ImageStyle: any;
  export type ImageStyle = any;
  export const LayoutChangeEvent: any;
  export type LayoutChangeEvent = any;
  export const AlertButton: any;
  export type AlertButton = any;
  export const AlertOptions: any;
  export type AlertOptions = any;
  export const Animated: any;
  export namespace Animated {
    export const CompositeAnimation: any;
  }
  export const AppStateStatus: any;
  export type AppStateStatus = any;
}

declare module 'react-native-safe-area-context' {
  export const SafeAreaView: any;
  export const useSafeAreaInsets: any;
  export const SafeAreaProvider: any;
  export const SafeAreaConsumer: any;
  export const useSafeAreaFrame: any;
}

declare module 'expo-router' {
  export const useRouter: any;
  export const useLocalSearchParams: any;
  export const useFocusEffect: any;
  export const useGlobalSearchParams: any;
  export const Link: any;
  export const Redirect: any;
  export const Stack: any;
  export const Tabs: any;
  export const Drawer: any;
  export const SplashScreen: any;
}

declare module 'expo-image-picker' {
  export const launchImageLibraryAsync: any;
  export const launchCameraAsync: any;
  export const getMediaLibraryPermissionsAsync: any;
  export const getCameraPermissionsAsync: any;
  export const requestMediaLibraryPermissionsAsync: any;
  export const requestCameraPermissionsAsync: any;
  export const MediaTypeOptions: any;
}

declare module 'expo-image-manipulator' {
  export const manipulateAsync: any;
  export const SaveFormat: any;
  export const FlipType: any;
  export const ResizeMode: any;
}

declare module '@react-native-community/datetimepicker' {
  const DateTimePicker: any;
  export default DateTimePicker;
  export const EVENT_DATE_SET: any;
  export const EVENT_TIME_SET: any;
  export const EVENT_DISMISSED: any;
}

declare module '@parkit/shared' {
  export const ValetStaffRole: any;
  export type ValetStaffRole = any;
  export const messageFromAxios: any;
  export const formatPhoneWithCountryCode: any;
  export const getDeviceCountryCode: any;
  export const parseYmdLocal: any;
  export const formatYmdLocal: any;
  export const LICENSE_TYPE_OPTIONS: any;
  export const createFeedback: any;
  export const Locale: any;
  export type Locale = any;
  export const Logo: any;
  export const getAppVersionString: any;
  export const formatPlate: any;
  export const getVehicleColorOptions: any;
  export const formatVehicleColorLabel: any;
  export const normalizeVehicleColorValue: any;
  export const haversineKm: any;
  export const ParkingWithCoords: any;
  export type ParkingWithCoords = any;
  export const NearestParkingResult: any;
  export type NearestParkingResult = any;
  export const User: any;
  export type User = any;
  export const ValetOperationalStatus: any;
  export type ValetOperationalStatus = any;
  export const COUNTRY_DIAL_CODES: any;
  export const formatPhone: any;
  export const formatPhoneInternational: any;
  export const isValidPhoneOptional: any;
  export const phoneDigitsForApi: any;
  export const COUNTRY_CR: any;
  export const MANUAL_TICKET_CODE_RE: any;
  export const MAX_DAMAGE_PHOTOS: any;
  export const isValidCrPlate: any;
  export const formatBenefitTime: any;
  export const extractBookingIdFromScan: any;
  export const randomWalkInPassword: any;
}

declare module 'expo-constants' {
  export const expoConfig: any;
  export const manifest: any;
  export const sessionId: any;
  export const installationId: any;
  export const deviceName: any;
  export const deviceYearClass: any;
}

declare module 'expo-font' {
  export const loadAsync: any;
  export const useFonts: any;
  export const isLoaded: any;
  export const unloadAsync: any;
}

declare module 'expo-linear-gradient' {
  export const LinearGradient: any;
}

declare module 'expo-location' {
  export const requestForegroundPermissionsAsync: any;
  export const requestBackgroundPermissionsAsync: any;
  export const getForegroundPermissionsAsync: any;
  export const getBackgroundPermissionsAsync: any;
  export const getCurrentPositionAsync: any;
  export const watchPositionAsync: any;
  export const Accuracy: any;
  export const Location: any;
}

declare module 'expo-notifications' {
  export const scheduleNotificationAsync: any;
  export const cancelScheduledNotificationAsync: any;
  export const getAllScheduledNotificationsAsync: any;
  export const setNotificationHandler: any;
  export const getNotificationChannelAsync: any;
  export const setNotificationChannelAsync: any;
  export const deleteNotificationChannelAsync: any;
  export const getBadgeCountAsync: any;
  export const setBadgeCountAsync: any;
  export const Permission: any;
}

declare module 'expo-secure-store' {
  export const getItemAsync: any;
  export const setItemAsync: any;
  export const removeItemAsync: any;
  export const deleteItemAsync: any;
  export const isAvailableAsync: any;
}

declare module 'expo-system-ui' {
  export const setBackgroundColorAsync: any;
  export const getBackgroundColorAsync: any;
}

declare module '@react-native-async-storage/async-storage' {
  export const getItem: any;
  export const setItem: any;
  export const removeItem: any;
  export const clear: any;
  export const getAllKeys: any;
  export const multiGet: any;
  export const multiSet: any;
  export const multiRemove: any;
}

declare module '@react-native-google-signin/google-signin' {
  export const GoogleSignin: any;
  export const statusCodes: any;
}

declare module '@react-native-ml-kit/text-recognition' {
  export const recognize: any;
}

declare module '@shopify/react-native-skia' {
  export const Canvas: any;
  export const Group: any;
  export const Rect: any;
  export const Circle: any;
  export const Text: any;
  export const Image: any;
  export const Path: any;
  export const LinearGradient: any;
  export const RadialGradient: any;
  export const SweepGradient: any;
  export const Shader: any;
  export const useFont: any;
  export const Skia: any;
}

declare module '@stripe/stripe-react-native' {
  export const useStripe: any;
  export const StripeProvider: any;
  export const ApplePayButton: any;
  export const GooglePayButton: any;
  export const CardField: any;
  export const CardForm: any;
}

declare module 'qrcode' {
  export const toDataURL: any;
  export const toString: any;
}

declare module 'axios' {
  const axios: any;
  export default axios;
}

declare module 'ajv' {
  const ajv: any;
  export default ajv;
}

declare module 'react-native-gesture-handler' {
  export const PanGestureHandler: any;
  export const PinchGestureHandler: any;
  export const TapGestureHandler: any;
  export const RotationGestureHandler: any;
  export const State: any;
}

declare module 'react-native-reanimated' {
  export const useSharedValue: any;
  export const useAnimatedStyle: any;
  export const withSpring: any;
  export const withTiming: any;
  export const withDecay: any;
  export const withRepeat: any;
  export const withSequence: any;
  export const interpolate: any;
  export const runOnJS: any;
  export const cancelAnimation: any;
}

declare module 'react-native-screens' {
  export const enableScreens: any;
  export const screensEnabled: any;
}

declare module 'react-native-svg' {
  export const Svg: any;
  export const Circle: any;
  export const Ellipse: any;
  export const G: any;
  export const Text: any;
  export const TSpan: any;
  export const TextPath: any;
  export const Path: any;
  export const Polygon: any;
  export const Polyline: any;
  export const Line: any;
  export const Rect: any;
  export const Use: any;
  export const Image: any;
  export const Symbol: any;
  export const Defs: any;
  export const LinearGradient: any;
  export const RadialGradient: any;
  export const Stop: any;
  export const ClipPath: any;
  export const Pattern: any;
  export const Mask: any;
}

declare module 'react-native-toast-message' {
  export const show: any;
  export const hide: any;
  export const Toast: any;
}

declare module 'react-native-keyboard-controller' {
  export const KeyboardProvider: any;
  export const useKeyboardController: any;
}

declare module 'react-native-worklets' {
  export const createWorklet: any;
  export const runOnJS: any;
  export const runOnUI: any;
}

export {};
