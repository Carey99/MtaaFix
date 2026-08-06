import { Tabs } from 'expo-router';
import { BottomTabBar } from '@/components/ui/BottomTabBar';

/**
 * Tab layout with a fully custom bottom bar (black + yellow pill on active tab).
 * NativeTabs / liquid glass is intentionally skipped to preserve the brand design.
 */
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="work" options={{ title: 'Work' }} />
      <Tabs.Screen name="bids" options={{ title: 'Bids' }} />
    </Tabs>
  );
}
