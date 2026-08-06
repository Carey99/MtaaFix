import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/src/context/AuthContext';
import type { UserRole } from '@/src/types';
import * as Haptics from 'expo-haptics';

const ROLES: { value: UserRole; label: string; subtitle: string }[] = [
  { value: 'worker', label: 'Worker', subtitle: 'I offer services' },
  { value: 'client', label: 'Client', subtitle: 'I need work done' },
];

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { register } = useAuth();

  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('worker');
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const handleRegister = async () => {
    if (!phone.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Phone number and password are required.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Make sure both password fields are identical.');
      return;
    }
    setLoading(true);
    try {
      await register({
        phone: phone.trim(),
        password,
        confirm_password: confirmPassword,
        role,
        name: name.trim() || undefined,
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/');
    } catch (err: unknown) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const data = (err as { response?: { data?: Record<string, unknown> } })?.response?.data;
      // Django returns field-level errors as arrays
      const firstError = data
        ? Object.entries(data)
            .map(([field, msgs]) =>
              `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`,
            )
            .join('\n')
        : 'Registration failed. Please try again.';
      Alert.alert('Error', firstError);
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
          { paddingTop: topPad + 40, paddingBottom: insets.bottom + 40 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.brand, { color: colors.primary }]}>MtaaFix</Text>
        <Text style={[styles.tagline, { color: colors.mutedForeground }]}>Join your local marketplace</Text>

        <View style={styles.form}>
          <Text style={[styles.formTitle, { color: colors.foreground }]}>Create account</Text>

          {/* Role picker */}
          <View style={[styles.roleRow, { backgroundColor: colors.card }]}>
            {ROLES.map((r) => {
              const isSelected = role === r.value;
              return (
                <TouchableOpacity
                  key={r.value}
                  onPress={() => setRole(r.value)}
                  style={[styles.roleBtn, isSelected && { backgroundColor: colors.primary }]}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.roleBtnLabel, { color: isSelected ? colors.primaryForeground : colors.foreground }]}>
                    {r.label}
                  </Text>
                  <Text style={[styles.roleBtnSub, { color: isSelected ? colors.primaryForeground : colors.mutedForeground }]}>
                    {r.subtitle}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.foreground, borderColor: colors.border }]}
            placeholder="Phone number *"
            placeholderTextColor={colors.mutedForeground}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.foreground, borderColor: colors.border }]}
            placeholder="Full name (optional)"
            placeholderTextColor={colors.mutedForeground}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.foreground, borderColor: colors.border }]}
            placeholder="Password *"
            placeholderTextColor={colors.mutedForeground}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.foreground, borderColor: colors.border }]}
            placeholder="Confirm password *"
            placeholderTextColor={colors.mutedForeground}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleRegister}
          />

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: colors.primary }, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={colors.primaryForeground} />
              : <Text style={[styles.btnText, { color: colors.primaryForeground }]}>Create account</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} style={styles.link}>
            <Text style={[styles.linkText, { color: colors.mutedForeground }]}>
              Already have an account?{' '}
              <Text style={{ color: colors.foreground, fontWeight: '600' }}>Sign in</Text>
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
  brand: { fontSize: 36, fontWeight: '800', letterSpacing: -1, marginBottom: 4 },
  tagline: { fontSize: 15, marginBottom: 36 },
  form: { gap: 12 },
  formTitle: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  roleRow: { flexDirection: 'row', borderRadius: 14, padding: 4, gap: 4 },
  roleBtn: { flex: 1, paddingVertical: 12, paddingHorizontal: 10, alignItems: 'center', borderRadius: 11, gap: 2 },
  roleBtnLabel: { fontSize: 14, fontWeight: '700' },
  roleBtnSub: { fontSize: 11 },
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
