import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
  Platform, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/src/context/AuthContext';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const handleLogout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarLarge, { backgroundColor: colors.card }]}>
            <Ionicons name="person" size={50} color={colors.mutedForeground} />
          </View>
          <Text style={[styles.name, { color: colors.foreground }]}>
            {user?.name || user?.phone || 'User'}
          </Text>
          <View style={[styles.roleBadge, { backgroundColor: colors.primary + '25' }]}>
            <Text style={[styles.roleText, { color: colors.primary }]}>
              {user?.role ?? 'worker'}
            </Text>
          </View>
        </View>

        {/* Info card */}
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <InfoRow icon="call-outline" label="Phone" value={user?.phone ?? '—'} colors={colors} />
          {!!user?.name && (
            <InfoRow icon="person-outline" label="Name" value={user.name} colors={colors} showBorder />
          )}
          <InfoRow icon="shield-outline" label="Role" value={user?.role ?? '—'} colors={colors} showBorder />
        </View>

        {/* Sign out */}
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: colors.destructive + '44' }]}
          onPress={handleLogout}
          activeOpacity={0.75}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.destructive} />
          <Text style={[styles.logoutText, { color: colors.destructive }]}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ─── Helper component ─────────────────────────────────────────────────────────

interface InfoRowProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  colors: ReturnType<typeof import('@/hooks/useColors').useColors>;
  showBorder?: boolean;
}

function InfoRow({ icon, label, value, colors, showBorder }: InfoRowProps) {
  return (
    <View style={[rowStyles.row, showBorder && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }]}>
      <Ionicons name={icon} size={16} color={colors.mutedForeground} />
      <View style={rowStyles.info}>
        <Text style={[rowStyles.label, { color: colors.mutedForeground }]}>{label}</Text>
        <Text style={[rowStyles.value, { color: colors.foreground }]}>{value}</Text>
      </View>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  info: { flex: 1 },
  label: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 2 },
  value: { fontSize: 15, fontWeight: '500' },
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 17, fontWeight: '600' },
  content: { paddingHorizontal: 20, paddingBottom: 60, gap: 20 },
  avatarSection: { alignItems: 'center', paddingTop: 16, gap: 12 },
  avatarLarge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  roleBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  roleText: { fontSize: 13, fontWeight: '700', textTransform: 'capitalize' },
  infoCard: { borderRadius: 16, paddingHorizontal: 16, paddingVertical: 4 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 15,
  },
  logoutText: { fontSize: 15, fontWeight: '600' },
});
