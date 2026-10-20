import { Button, Card, Chip } from 'heroui-native';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}>
        <View className="gap-6 px-6 pt-16">
          <View className="items-start gap-3">
            <Chip variant="soft" color="accent">
              HeroUI Native
            </Chip>
            <Text className="text-4xl font-bold text-foreground">Welcome to Raven</Text>
            <Text className="text-base text-muted">
              HeroUI Native 已配置完成，以它作为应用的基础 UI 组件库。
            </Text>
          </View>

          <Card>
            <Card.Header>
              <Card.Title>快速开始</Card.Title>
              <Card.Description>
                编辑 src/app/index.tsx，使用 HeroUI 组件搭建你的第一个界面。
              </Card.Description>
            </Card.Header>
            <Card.Footer className="flex-row gap-3">
              <Button size="sm">Get Started</Button>
              <Button size="sm" variant="outline">
                Documentation
              </Button>
            </Card.Footer>
          </Card>

          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Button variants</Text>
            <View className="flex-row flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
