import { Tabs } from "expo-router";
import CustomTabBar from "@/components/CustomTabBar";
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: t('tabs.learn') }} />
      <Tabs.Screen name="vocabulary" options={{ title: t('tabs.vocabulary') }} />
      <Tabs.Screen name="practice" options={{ title: t('tabs.practice') }} />
      <Tabs.Screen name="test" options={{ title: t('tabs.test_api') }} />
      <Tabs.Screen name="settings" options={{ title: t('tabs.settings') }} />
    </Tabs>
  );
}
