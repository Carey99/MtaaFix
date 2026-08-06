import React from 'react';
import {
  ScrollView, View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/src/context/AuthContext';
import { useMyJobs } from '@/src/services/jobService';
import { StatusTimeline } from '@/components/ui/StatusTimeline';
import type { JobStatus } from '@/src/types';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { data: myJobs, isLoading } = useMyJobs();

  const currentJob = myJobs?.[0] ?? null;
  const firstName = user?.name?.split(' ')[0] ?? user?.phone ?? 'there';
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad + 12, paddingBottom: 110 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header row */}
      <View style={styles.header}>
        <View />
        <TouchableOpacity onPress={() => router.push('/profile')} activeOpacity={0.7}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.card }]}>
            <Ionicons name="person-outline" size={20} color={colors.foreground} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Greeting card */}
      <View style={[styles.greetingCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.greeting, { color: colors.cardForeground }]}>
          Hi {firstName}!
        </Text>
        <Text style={[styles.greetingBody, { color: colors.mutedForeground }]}>
          {user?.role === 'worker'
            ? 'Browse open jobs nearby and start earning today.'
            : 'Post a job and connect with skilled workers in your area.'}
        </Text>
      </View>

      {/* Quick action */}
      {user?.role === 'client' && (
        <TouchableOpacity
          style={[styles.postBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/post-job')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={18} color={colors.primaryForeground} />
          <Text style={[styles.postBtnText, { color: colors.primaryForeground }]}>Post a job</Text>
        </TouchableOpacity>
      )}

      {/* Current job */}
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>current job</Text>

      {isLoading ? (
        <ActivityIndicator color={colors.foreground} style={{ marginTop: 24 }} />
      ) : currentJob ? (
        <View style={styles.jobSection}>
          <Text style={[styles.statusLabel, { color: colors.mutedForeground }]}>status</Text>
          <StatusTimeline status={currentJob.status as JobStatus} />
        </View>
      ) : (
        <View style={styles.emptySection}>
          <Ionicons name="briefcase-outline" size={36} color={colors.mutedForeground} />
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No active job</Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/work')}
            style={[styles.emptyAction, { borderColor: colors.border }]}
          >
            <Text style={[styles.emptyActionText, { color: colors.foreground }]}>
              {user?.role === 'worker' ? 'Browse jobs' : 'Post a job'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingCard: {
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 22,
    marginBottom: 16,
    gap: 10,
  },
  greeting: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  greetingBody: { fontSize: 14, lineHeight: 22 },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 24,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignSelf: 'flex-start',
  },
  postBtnText: { fontSize: 14, fontWeight: '700' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 18,
    letterSpacing: 0.2,
  },
  jobSection: { paddingHorizontal: 20 },
  statusLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emptySection: { alignItems: 'center', paddingTop: 36, gap: 12 },
  emptyText: { fontSize: 14 },
  emptyAction: {
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  emptyActionText: { fontSize: 14, fontWeight: '600' },
});
