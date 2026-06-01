import React from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator, type ViewStyle } from "react-native";
import { colors, typography, spacing, radii } from "../theme";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type Props = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
};

const variantStyles: Record<ButtonVariant, { bg: string; text: string; border?: string }> = {
  primary: { bg: colors.primary, text: colors.white },
  secondary: { bg: colors.secondary, text: colors.white },
  outline: { bg: "transparent", text: colors.primary, border: colors.primary },
  ghost: { bg: "transparent", text: colors.primary },
  danger: { bg: colors.error, text: colors.white },
};

const sizeStyles: Record<ButtonSize, { paddingH: number; paddingV: number; fontSize: number }> = {
  sm: { paddingH: spacing.md, paddingV: spacing.sm, fontSize: 13 },
  md: { paddingH: spacing.lg, paddingV: spacing.md, fontSize: 14 },
  lg: { paddingH: spacing.xl, paddingV: spacing.lg, fontSize: 16 },
};

export function Button({ title, onPress, variant = "primary", size = "md", disabled, loading, fullWidth, style }: Props) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: disabled ? colors.gray300 : v.bg,
          paddingHorizontal: s.paddingH,
          paddingVertical: s.paddingV,
          borderColor: v.border ?? "transparent",
          borderWidth: v.border ? 1.5 : 0,
          opacity: pressed ? 0.85 : 1,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.text} />
      ) : (
        <Text style={[styles.text, { color: disabled ? colors.gray500 : v.text, fontSize: s.fontSize }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  fullWidth: {
    width: "100%",
  },
  text: {
    ...typography.bodyBold,
  },
});
