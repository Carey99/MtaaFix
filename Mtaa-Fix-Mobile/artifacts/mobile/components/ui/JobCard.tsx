/**
 * Reusable job card — used on Work screen and search results.
 * Shows job avatar placeholder, title, category/location, and a status badge.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { Job } from '@/src/types';

interface JobCardProps {
  job: Job;
  onPress?: () => void;
  statusLabel?: string;
  statusColor?: string;
}

const STATUS_COLORS: Record<string, string> = {
  open: '#4CAF50',
  in_progress: '#FF9800',
  closed: '#888888',
};

export function JobCard({ job, onPress, statusLabel, statusColor: statusColorOverride }: JobCardProps) {
  const colors = useColors();
  const statusColor = statusColorOverride ?? STATUS_COLORS[job.status] ?? '#888888';
  const label = statusLabel ?? job.status.replace('_', ' ');

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.card, { backgroundColor: colors.card }]}
    >
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
        <Ionicons name="briefcase-outline" size={18} color={colors.mutedForeground} />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
          {job.title}
        </Text>
        <Text style={[styles.meta, { color: colors.mutedForeground }]} numberOfLines={1}>
          {job.category} {job.location ? `• ${job.location}` : ''}
        </Text>
      </View>

      {/* Status badge */}
      <View style={[styles.badge, { backgroundColor: statusColor + '22' }]}>
        <View style={[styles.dot, { backgroundColor: statusColor }]} />
        <Text style={[styles.badgeText, { color: statusColor }]}>
          {label}
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
