import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { colors, typography, spacing, radii } from "../theme";
import { Button } from "../components";
import { useAppState } from "../state/app-state";

type Mode = "login" | "register";

export function AuthScreen() {
  const { login, register, loading, error } = useAppState();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  function validate(): boolean {
    if (!email.trim() || !email.includes("@")) {
      setValidationError("Please enter a valid email address");
      return false;
    }
    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return false;
    }
    if (mode === "register" && (!/[a-z]/i.test(password) || !/\d/.test(password))) {
      setValidationError("Password must include letters and numbers");
      return false;
    }
    setValidationError(null);
    return true;
  }

  async function handleSubmit() {
    if (!validate()) return;
    if (mode === "login") {
      await login(email.trim(), password);
    } else {
      await register(email.trim(), password);
    }
  }

  const displayError = validationError || error;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>Rentiqo</Text>
          <Text style={styles.tagline}>Find your perfect home</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>{mode === "login" ? "Welcome back" : "Create account"}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Email address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder={mode === "register" ? "Min 8 chars, letters + numbers" : "Enter password"}
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              accessibilityLabel="Password"
            />
          </View>

          {displayError && <Text style={styles.error}>{displayError}</Text>}

          <Button
            title={mode === "login" ? "Sign In" : "Create Account"}
            onPress={handleSubmit}
            loading={loading}
            fullWidth
            size="lg"
            style={styles.submitButton}
          />

          <Button
            title={mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            onPress={() => { setMode(mode === "login" ? "register" : "login"); setValidationError(null); }}
            variant="ghost"
            fullWidth
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: "center", padding: spacing.xxl },
  header: { alignItems: "center", marginBottom: spacing.xxxl },
  logo: { ...typography.display, color: colors.primary },
  tagline: { ...typography.bodyLarge, color: colors.textSecondary, marginTop: spacing.sm },
  form: { width: "100%" },
  formTitle: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.xxl },
  inputGroup: { marginBottom: spacing.lg },
  label: { ...typography.captionBold, color: colors.textSecondary, marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.bodyLarge,
    color: colors.textPrimary,
    backgroundColor: colors.white,
  },
  error: { ...typography.body, color: colors.error, marginBottom: spacing.md },
  submitButton: { marginTop: spacing.sm, marginBottom: spacing.md },
});
