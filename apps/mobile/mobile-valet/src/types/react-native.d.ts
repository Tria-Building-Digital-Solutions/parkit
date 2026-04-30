// Type declarations for React Native modules
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
  
  // Gesture handlers
  export const PanGestureHandler: any;
  export type PanGestureHandler = any;
  export const PinchGestureHandler: any;
  export type PinchGestureHandler = any;
  export const TapGestureHandler: any;
  export type TapGestureHandler = any;
  export const State: any;
}

declare module 'react-native-safe-area-context' {
  export * from 'react-native-safe-area-context';
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
  export * from 'expo-image-picker';
}

declare module 'expo-image-manipulator' {
  export * from 'expo-image-manipulator';
}

declare module '@react-native-community/datetimepicker' {
  export * from '@react-native-community/datetimepicker';
}

declare module '@parkit/shared' {
  export * from '@parkit/shared';
}
