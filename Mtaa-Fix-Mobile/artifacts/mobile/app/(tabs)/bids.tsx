import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useMyBids } from '@/src/services/bidService';
import { BidCard } from '@/components/ui/BidCard';
import { TabFilter } from '@/components/ui/TabFilter';
import type { Application, ApplicationStatus } from '@/src/types';

const TABS = ['applied', 'accepted', 'rejected'] as const;
type BidsTab = typeof TABS[number];

const TAB_STATUS: Record<BidsTab, ApplicationStatus> = {
  applied: 'applied',
  accepted: 'accepted',
  rejected: 'rejected',
};

export default function BidsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<BidsTab>('applied');
  const { data: bids, isLoading, refetch } = useMyBids();

  const statusFilter = TAB_STATUS[activeTab];
  const filtered: Application[] = (bids ?? []).filter((b) => b.status === statusFilter);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>My Bids</Text>
      </View>

      <TabFilter tabs={TABS} active={activeTab} onSelect={setActiveTab} />

      {isLoading ? (
        <ActivityIndicator color={colors.foreground} style={{ marginTop: 48 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BidCard bid={item} />}
          contentContainerStyle={styles.list}
          onRefresh={refetch}
          refreshing={isLoading}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="hammer-outline" size={40} color={colors.mutedForeground} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                No {activeTab} applications yet
              </Text>
              <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
                Apply to jobs from the Work tab
              </Text>
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
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: { fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
  list: { paddingBottom: 110, paddingTop: 8 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '600' },
  emptySub: { fontSize: 14 },
});
