/**
 * Custom bottom tab bar — black background, yellow pill on active tab.
 * Matches the MtaaFix Figma design.
 */
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Route {
  key: string;
  name: string;
}

interface TabBarProps {
  state: { index: number; routes: Route[] };
  navigation: { navigate: (name: string) => void };
}

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_CONFIG: Record<string, { label: string; icon: IoniconName; activeIcon: IoniconName }> = {
  index: { label: 'home', icon: 'home-outline', activeIcon: 'home' },
  work: { label: 'work', icon: 'briefcase-outline', activeIcon: 'briefcase' },
  bids: { label: 'bids', icon: 'hammer-outline', activeIcon: 'hammer' },
};

export function BottomTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom > 0 ? insets.bottom : 16;

  return (
    <View style={[styles.container, { paddingBottom: bottomPad }]}>
      {state.routes.map((route, index) => {
        const isActive = state.index === index;
        const cfg = TAB_CONFIG[route.name] ?? {
          label: route.name,
          icon: 'ellipse-outline' as IoniconName,
          activeIcon: 'ellipse' as IoniconName,
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            onPress={() => navigation.navigate(route.name)}
            style={[styles.tab, isActive && styles.activeTab]}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isActive ? cfg.activeIcon : cfg.icon}
              size={18}
              color={isActive ? '#000000' : '#666666'}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {cfg.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    paddingTop: 12,
    paddingHorizontal: 16,
    gap: 8,
    borderTopWidth: 0,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 50,
  },
  activeTab: {
    backgroundColor: '#D4E157',
  },
  label: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#000000',
    fontWeight: '700',
  },
});
