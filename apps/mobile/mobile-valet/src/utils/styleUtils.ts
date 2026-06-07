import { StyleSheet } from 'react-native';
import { useValetTheme } from '@/theme/valetTheme';

type ValetTheme = ReturnType<typeof useValetTheme>;

export interface StyleParams {
  contentMaxWidth: number;
  sectionPadding: number;
}

// Función base para crear estilos comunes
export function createBaseStyles(theme: ValetTheme, params: StyleParams) {
  const { contentMaxWidth, sectionPadding } = params;

  return {
    colors: theme.colors,
    space: theme.space,
    radius: theme.radius,
    font: theme.font,
    fontFamily: theme.fontFamily,
    contentMaxWidth,
    sectionPadding,
  };
}

// Estilos comunes para pantallas
export function createScreenStyles(theme: ValetTheme, params: StyleParams) {
  const base = createBaseStyles(theme, params);
  const { colors, space, radius, font, fontFamily, contentMaxWidth, sectionPadding } = base;

  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    container: {
      flex: 1,
      backgroundColor: colors.bg,
      alignItems: 'center',
    },
    frame: {
      flex: 1,
      width: '100%',
      maxWidth: contentMaxWidth,
      alignSelf: 'center',
    },
    content: {
      flex: 1,
      paddingHorizontal: sectionPadding,
    },
    header: {
      backgroundColor: colors.card,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    screenHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: sectionPadding,
      paddingTop: space.sm,
      paddingBottom: space.md,
    },
    screenTitle: {
      fontSize: font.base,
      fontWeight: '800',
      fontFamily: fontFamily.primary,
      color: colors.text,
      flex: 1,
      textAlign: 'center',
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: radius.card,
      padding: space.md,
      marginBottom: space.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.card,
      paddingHorizontal: space.md,
      paddingVertical: space.sm,
      fontSize: font.base,
      color: colors.text,
      fontFamily: fontFamily.primary,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: radius.card,
      paddingVertical: space.md,
      paddingHorizontal: space.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      fontSize: font.base,
      fontWeight: '700',
      fontFamily: fontFamily.primary,
      color: '#fff',
    },
    text: {
      fontSize: font.base,
      color: colors.text,
      fontFamily: fontFamily.primary,
    },
    textMuted: {
      fontSize: font.base,
      color: colors.textMuted,
      fontFamily: fontFamily.primary,
    },
    textSmall: {
      fontSize: font.sm,
      color: colors.textMuted,
      fontFamily: fontFamily.primary,
    },
    separator: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: space.sm,
    },
    loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}

// Estilos para formularios
export function createFormStyles(theme: ValetTheme, params: StyleParams) {
  const base = createBaseStyles(theme, params);
  const { colors: C, space: S, radius: R, font: F, fontFamily: Fonts } = base;

  return StyleSheet.create({
    formContainer: {
      flex: 1,
      padding: S.md,
    },
    inputGroup: {
      marginBottom: S.md,
    },
    label: {
      fontSize: F.sm,
      fontWeight: '600',
      color: C.text,
      marginBottom: S.xs,
      fontFamily: Fonts.primary,
    },
    input: {
      backgroundColor: C.card,
      borderWidth: 1,
      borderColor: C.border,
      borderRadius: R.card,
      paddingHorizontal: S.md,
      paddingVertical: S.sm,
      fontSize: F.base,
      color: C.text,
      fontFamily: Fonts.primary,
    },
    inputError: {
      borderColor: C.logout,
    },
    errorText: {
      fontSize: F.xs,
      color: C.logout,
      marginTop: S.xs,
      fontFamily: Fonts.primary,
    },
    button: {
      backgroundColor: C.primary,
      borderRadius: R.card,
      paddingVertical: S.md,
      paddingHorizontal: S.lg,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: S.lg,
    },
    buttonDisabled: {
      backgroundColor: C.border,
      opacity: 0.5,
    },
    buttonText: {
      fontSize: F.base,
      fontWeight: '700',
      fontFamily: Fonts.primary,
      color: '#fff',
    },
  });
}

// Estilos para listas y cards
export function createListStyles(theme: ValetTheme, params: StyleParams) {
  const base = createBaseStyles(theme, params);
  const { colors: C, space: S, radius: R, font: F, fontFamily: Fonts } = base;

  return StyleSheet.create({
    listContainer: {
      flex: 1,
      paddingHorizontal: S.md,
    },
    listItem: {
      backgroundColor: C.card,
      borderRadius: R.card,
      padding: S.md,
      marginBottom: S.sm,
      borderWidth: 1,
      borderColor: C.border,
    },
    listItemTitle: {
      fontSize: F.base,
      fontWeight: '600',
      color: C.text,
      fontFamily: Fonts.primary,
      marginBottom: S.xs,
    },
    listItemSubtitle: {
      fontSize: F.sm,
      color: C.textMuted,
      fontFamily: Fonts.primary,
    },
    listItemAction: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: S.sm,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: S.xl,
    },
    emptyStateText: {
      fontSize: F.base,
      color: C.textMuted,
      textAlign: 'center',
      fontFamily: Fonts.primary,
    },
  });
}

// Estilos para modales y overlays
export function createModalStyles(theme: ValetTheme) {
  const C = theme.colors;
  const S = theme.space;
  const R = theme.radius;
  const F = theme.font;
  const Fonts = theme.fontFamily;

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
    modal: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: C.card,
      borderTopLeftRadius: R.card,
      borderTopRightRadius: R.card,
      paddingTop: S.sm,
      paddingBottom: S.xl,
    },
    modalHandle: {
      width: 36,
      height: 5,
      borderRadius: 3,
      backgroundColor: C.border,
      alignSelf: 'center',
      marginBottom: S.md,
    },
    modalTitle: {
      fontSize: F.lg,
      fontWeight: '700',
      color: C.text,
      textAlign: 'center',
      marginBottom: S.lg,
      fontFamily: Fonts.primary,
    },
    modalContent: {
      paddingHorizontal: S.lg,
    },
    modalButton: {
      backgroundColor: C.card,
      borderWidth: 1,
      borderColor: C.border,
      borderRadius: R.card,
      paddingVertical: S.md,
      alignItems: 'center',
      marginHorizontal: S.lg,
      marginBottom: S.sm,
    },
    modalButtonText: {
      fontSize: F.base,
      fontWeight: '600',
      color: C.text,
      fontFamily: Fonts.primary,
    },
    modalCancelButton: {
      backgroundColor: C.bg,
      borderWidth: 1,
      borderColor: C.border,
      borderRadius: R.card,
      paddingVertical: S.md,
      alignItems: 'center',
      marginHorizontal: S.lg,
    },
  });
}
