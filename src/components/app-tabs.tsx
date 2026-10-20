import { NativeTabs } from 'expo-router/native-tabs';
import { useThemeColor } from 'heroui-native';

export default function AppTabs() {
  const [background, surfaceSecondary, foreground] = useThemeColor([
    'background',
    'surface-secondary',
    'foreground',
  ]);

  return (
    <NativeTabs
      backgroundColor={background}
      indicatorColor={surfaceSecondary}
      labelStyle={{ selected: { color: foreground } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
