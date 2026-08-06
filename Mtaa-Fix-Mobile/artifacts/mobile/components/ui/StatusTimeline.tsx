/**
 * Vertical status timeline shown on the Home screen current-job section.
 * Maps JobStatus → three visual steps: paid → in progress → accepted.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/useColors';
import type { JobStatus } from '@/src/types';

interface Step {
  key: string;
  label: string;
}

const STEPS: Step[] = [
  { key: 'paid', label: 'paid' },
  { key: 'in_progress', label: 'in progress' },
  { key: 'accepted', label: 'accepted' },
];

function statusToIndex(status: JobStatus): number {
  switch (status) {
    case 'open': return 0;
    case 'in_progress': return 1;
    case 'closed': return 2;
    default: return 0;
  }
}

interface StatusTimelineProps {
  status: JobStatus;
}

export function StatusTimeline({ status }: StatusTimelineProps) {
  const colors = useColors();
  const activeIndex = statusToIndex(status);

  return (
    <View style={styles.container}>
      {STEPS.map((step, i) => {
        const isActive = i === activeIndex;
        const isDone = i < activeIndex;
        const isLast = i === STEPS.length - 1;

        return (
          <View key={step.key} style={styles.row}>
            {/* Left: dot + connecting line */}
            <View style={styles.dotCol}>
              <View
                style={[
                  styles.dot,
                  isDone && { backgroundColor: colors.primary },
                  isActive && styles.dotActive,
                  !isActive && !isDone && { backgroundColor: colors.border },
                ]}
              />
              {!isLast && (
                <View
                  style={[
                    styles.line,
                    { backgroundColor: isDone ? colors.primary : colors.border },
                  ]}
                />
              )}
            </View>

            {/* Right: label */}
            <Text
              style={[
                styles.label,
                {
                  color: isActive
                    ? colors.foreground
                    : isDone
                    ? colors.primary
                    : colors.mutedForeground,
                },
                isActive && styles.activeLabel,
              ]}
            >
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    minHeight: 36,
  },
  dotCol: {
    alignItems: 'center',
    width: 12,
    marginTop: 3,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#ffffff',
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  line: {
    width: 2,
    height: 24,
    marginTop: 3,
    borderRadius: 1,
  },
  label: {
    fontSize: 14,
    paddingTop: 0,
  },
  activeLabel: {
    fontWeight: '600',
  },
});
