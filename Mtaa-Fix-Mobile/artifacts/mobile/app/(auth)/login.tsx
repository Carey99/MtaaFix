import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/src/context/AuthContext';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const handleLogin = async () => {
    if (!phone.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Enter your phone number and password.');
      return;
    }
    setLoading(true);
    try {
      await login({ phone: phone.trim(), password });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/');
    } catch (err: unknown) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const data = (err as { response?: { data?: Record<string, unknown> } })?.response?.data;
      const msg =
        (data?.detail as string) ??
        (data?.non_field_errors as string[])?.join(' ') ??
        'Wrong phone or password.';
      Alert.alert('Login failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: topPad + 60, paddingBottom: insets.bottom + 40 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand */}
        <Text style={[styles.brand, { color: colors.primary }]}>MtaaFix</Text>
        <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
          Your local fix, fast.
        </Text>

        <View style={styles.form}>
          <Text style={[styles.formTitle, { color: colors.foreground }]}>Welcome back</Text>

          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.foreground, borderColor: colors.border }]}
            placeholder="Phone number"
            placeholderTextColor={colors.mutedForeground}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.foreground, borderColor: colors.border }]}
            placeholder="Password"
            placeholderTextColor={colors.mutedForeground}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: colors.primary }, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={colors.primaryForeground} />
              : <Text style={[styles.btnText, { color: colors.primaryForeground }]}>Sign in</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.link}>
            <Text style={[styles.linkText, { color: colors.mutedForeground }]}>
              New here?{' '}
              <Text style={{ color: colors.foreground, fontWeight: '600' }}>Create account</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { paddingHorizontal: 28, flexGrow: 1, justifyContent: 'center' },
  brand: { fontSize: 44, fontWeight: '800', letterSpacing: -1.5, marginBottom: 6 },
  tagline: { fontSize: 16, marginBottom: 52 },
  form: { gap: 14 },
  formTitle: { fontSize: 24, fontWeight: '700', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  btn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 6,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontSize: 16, fontWeight: '700' },
  link: { alignItems: 'center', paddingVertical: 10 },
  linkText: { fontSize: 14 },
});
