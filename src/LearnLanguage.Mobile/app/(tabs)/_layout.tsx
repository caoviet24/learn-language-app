import { Tabs } from "expo-router";
import CustomTabBar from "@/components/CustomTabBar";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: "Học" }} />
      <Tabs.Screen name="vocabulary" options={{ title: "Từ vựng" }} />
      <Tabs.Screen name="test" options={{ title: "Test API" }} />
      <Tabs.Screen name="settings" options={{ title: "Cài đặt" }} />
    </Tabs>
  );
}
