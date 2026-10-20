import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  type TabTriggerSlotProps,
  type TabListProps,
} from 'expo-router/ui';
import { Pressable, Text, View, type PressableProps } from 'react-native';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton>Explore</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...(props as PressableProps)} style={({ pressed }) => pressed && { opacity: 0.7 }}>
      <View className={`rounded-lg px-4 py-1.5 ${isFocused ? 'bg-surface-secondary' : ''}`}>
        <Text
          className={`text-sm font-medium ${isFocused ? 'text-foreground' : 'text-muted'}`}>
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} className="absolute w-full flex-row justify-center p-4">
      <View className="max-w-200 grow flex-row items-center gap-2 rounded-2xl bg-surface px-6 py-2">
        <Text className="mr-auto text-sm font-bold text-foreground">Raven</Text>
        {props.children}
      </View>
    </View>
  );
}
