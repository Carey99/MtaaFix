/**
 * Reusable bid/application card — used on the Bids screen.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { Application } from '@/src/types';

interface BidCardProps {
  bid: Application;
  onPress?: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  applied: '#FF9800',
  accepted: '#4CAF50',
  rejected: '#ef4444',
};

export function BidCard({ bid, onPress }: BidCardProps) {
  const colors = useColors();
  const job = typeof bid.job === 'object' ? bid.job : null;
  const statusColor = STATUS_COLORS[bid.status] ?? '#888888';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.card, { backgroundColor: colors.card }]}
    >
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
        <Ionicons name="hammer-outline" size={18} color={colors.mutedForeground} />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
          {job?.title ?? 'Job Application'}
        </Text>
        <Text style={[styles.meta, { color: colors.mutedForeground }]} numberOfLines={1}>
          {[job?.category, job?.location].filter(Boolean).join(' • ')}
        </Text>
      </View>

      {/* Status badge */}
      <View style={[styles.badge, { backgroundColor: statusColor + '22' }]}>
        <View style={[styles.dot, { backgroundColor: statusColor }]} />
        <Text style={[styles.badgeText, { color: statusColor }]}>
          {bid.status}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 14,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  meta: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
