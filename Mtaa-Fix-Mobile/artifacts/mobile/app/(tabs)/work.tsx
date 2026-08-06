import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, Platform,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/src/context/AuthContext';
import { useJobs, useMyJobs } from '@/src/services/jobService';
import { useMyBids } from '@/src/services/bidService';
import { JobCard } from '@/components/ui/JobCard';
import { TabFilter } from '@/components/ui/TabFilter';
import type { Job } from '@/src/types';

const TABS = ['open', 'applied'] as const;
type WorkTab = typeof TABS[number];

export default function WorkScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const isWorker = user?.role === 'worker';
  const [activeTab, setActiveTab] = useState<WorkTab>('open');

  // Workers browse all jobs; clients see their own posted jobs
  const { data: allJobs, isLoading: loadingAll, refetch: refetchAll } = useJobs();
  const { data: myJobs, isLoading: loadingMy, refetch: refetchMy } = useMyJobs();
  const { data: applications, isLoading: loadingApps, refetch: refetchApps } = useMyBids();

  const jobs: Job[] = (isWorker ? allJobs : myJobs) ?? [];
  const appliedJobs = (applications ?? []).map((application) => application.job);
  const openJobs = isWorker ? jobs.filter((job) => !appliedJobs.some((applicationJob) => applicationJob.id === job.id)) : jobs;
  const isLoading = isWorker ? loadingAll || loadingApps : loadingMy;
  const refetch = isWorker ? async () => {
    await Promise.all([refetchAll(), refetchApps()]);
  } : refetchMy;
  const filtered = isWorker ? (activeTab === 'open' ? openJobs : appliedJobs) : jobs;

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {isWorker ? 'Find Work' : 'My Jobs'}
        </Text>
        {!isWorker && (
          <TouchableOpacity
            onPress={() => router.push('/post-job')}
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={20} color={colors.primaryForeground} />
          </TouchableOpacity>
        )}
      </View>

      <TabFilter tabs={TABS} active={activeTab} onSelect={setActiveTab} />

      {isLoading ? (
        <ActivityIndicator color={colors.foreground} style={{ marginTop: 48 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JobCard
              job={item}
              onPress={() => router.push(`/job/${item.id}`)}
              statusLabel={isWorker && activeTab === 'applied' ? 'Applied' : undefined}
              statusColor={isWorker && activeTab === 'applied' ? colors.primary : undefined}
            />
          )}
          contentContainerStyle={styles.list}
          onRefresh={refetch}
          refreshing={isLoading}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={40} color={colors.mutedForeground} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                No {activeTab} jobs
              </Text>
              {!isWorker && activeTab === 'open' && (
                <TouchableOpacity
                  style={[styles.emptyAction, { backgroundColor: colors.primary }]}
                  onPress={() => router.push('/post-job')}
                >
                  <Text style={{ color: colors.primaryForeground, fontWeight: '700', fontSize: 14 }}>
                    Post a job
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: { fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { paddingBottom: 110, paddingTop: 8 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '600' },
  emptyAction: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 50,
  },
});
