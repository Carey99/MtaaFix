/**
 * Horizontal tab filter — underline-style tabs used on Work and Bids screens.
 */
import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

interface TabFilterProps<T extends string> {
  tabs: readonly T[];
  active: T;
  onSelect: (tab: T) => void;
}

export function TabFilter<T extends string>({ tabs, active, onSelect }: TabFilterProps<T>) {
  const colors = useColors();

  return (
    <View style={[styles.wrapper, { borderBottomColor: colors.border }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {tabs.map((tab) => {
          const isActive = tab === active;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => onSelect(tab)}
              style={[styles.tab, isActive && { borderBottomColor: colors.foreground, borderBottomWidth: 2 }]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.label,
                  { color: isActive ? colors.foreground : colors.mutedForeground },
                  isActive && styles.activeLabel,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 4,
  },
  content: {
    paddingHorizontal: 20,
    gap: 28,
  },
  tab: {
    paddingVertical: 12,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  activeLabel: {
    fontWeight: '600',
  },
});
