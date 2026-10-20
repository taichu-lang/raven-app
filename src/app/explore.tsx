import { Button, Chip, Separator, Spinner, Switch } from 'heroui-native';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(false);

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}>
        <View className="gap-6 px-6 pt-16">
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">组件</Text>
            <Text className="text-base text-muted">HeroUI Native 基础组件一览。</Text>
          </View>

          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Chip</Text>
            <View className="flex-row flex-wrap gap-2">
              <Chip color="accent">Accent</Chip>
              <Chip variant="soft" color="success">
                Success
              </Chip>
              <Chip variant="soft" color="warning">
                Warning
              </Chip>
              <Chip variant="soft" color="danger">
                Danger
              </Chip>
            </View>
          </View>

          <Separator />

          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Switch</Text>
            <View className="gap-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-foreground">推送通知</Text>
                <Switch isSelected={notificationsEnabled} onSelectedChange={setNotificationsEnabled} />
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-foreground">自动更新</Text>
                <Switch isSelected={autoUpdateEnabled} onSelectedChange={setAutoUpdateEnabled} />
              </View>
            </View>
          </View>

          <Separator />

          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Spinner</Text>
            <View className="flex-row items-center gap-6">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" color="success" />
            </View>
          </View>

          <Separator />

          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Button sizes</Text>
            <View className="flex-row flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
