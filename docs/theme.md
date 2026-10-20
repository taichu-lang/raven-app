# HeroUI Native 主题定制指南

本项目使用 `heroui-native` + `uniwind`（Tailwind CSS v4）。定制主题时踩过两个坑，本文先讲正确的定制方法，再记录这两个问题的原因和排查手段。

## 主题的两层结构

heroui-native 的主题分两层（见 `node_modules/heroui-native/lib/module/styles/`）：

1. **基础语义变量**（`variables.css`）— 定义在 `:root { @variant light/dark { ... } }` 中：
   `--accent`、`--background`、`--foreground`、`--surface`、`--default`、`--muted`、`--success`、`--warning`、`--danger`、`--border`、`--focus`、`--overlay` 等。
2. **颜色 token**（`theme.css`）— `@theme inline static` 中的 `--color-*`，是 Tailwind 类（`bg-accent`、`text-danger-soft-foreground`……）**实际读取**的值。所有 `*-soft`、`*-hover` 颜色都由基础变量经 `color-mix` **自动派生**，例如：

   ```css
   --color-accent-soft: color-mix(in oklab, var(--accent) 15%, transparent);
   ```

**推论：大多数情况下只需要覆盖第 1 层的基础变量，派生色会自动跟随。**

## 定制规则（四条铁律）

### 0. 必须包在 `:root` 里，否则原生端静默失效

```css
@layer theme {
  :root {                    /* ← 必须，与 heroui 官方写法一致 */
    @variant light { ... }
    @variant dark  { ... }
  }
}
```

### 1. 覆盖 heroui 已有变量：可以只写一个主题

另一个主题会继承 heroui 的默认值。例如只在 dark 里覆盖 `--background` 是合法的。

### 2. 新增自定义变量名：必须在所有主题中成对出现

Uniwind 会把所有 `@variant` 块的变量名**按主题求并集**并校验一致（包括 heroui 自带的 CSS），不一致则启动报错。

### 3. 自定义变量必须映射到 `--color-*` token 才会生效

组件类读的是 `--color-*`，单独定义 `--danger-soft` 这样的变量没有任何视觉效果。需要：

```css
@theme inline static {
  --color-danger-soft: var(--danger-soft);
}
```

## 完整示例（当前 src/global.css 的结构）

```css
@import "tailwindcss";
@import "uniwind";
@import "heroui-native/styles";

@layer theme {
  :root {
    @variant light {
      --accent: oklch(0.6016 0.07 211.92);   /* 覆盖已有变量 */
      --danger-soft: oklch(0.8715 0.0685 25.22);  /* 新增变量：dark 中必须也有 */
    }
    @variant dark {
      --accent: oklch(0.3719 0.0166 251.78);
      --background: oklch(0.235 0 0);        /* 只覆盖 dark，合法 */
      --danger-soft: oklch(0.7848 0.1249 25.04 / 23.9%);
    }
  }
}

/* 把新增变量接到 token 上，否则不生效 */
@theme inline static {
  --color-danger-soft: var(--danger-soft);
}
```

## 问题 1：启动报 "All themes must have the same variables"

**现象**

```
Uniwind Error - Theme light is missing variable --accent-soft-foreground
Uniwind Error - Theme light is missing variable --warning-soft
Uniwind Error - All themes must have the same variables
```

**原因**

在 dark 块里定义了 heroui 基础主题中不存在的变量（`--accent-soft-foreground`、`--warning-soft`），而 light 块没写。Uniwind 的校验逻辑（`node_modules/uniwind/src/bundler/artifacts/css/themes.ts`）是：扫描入口 CSS 及所有 `@import`（含 heroui-native 的样式），把每个 `@variant light/dark` 块里的变量名按主题求并集，**要求所有主题的变量名集合完全一致**。

注意 heroui 的派生 token 叫 `--color-accent-soft-foreground`，并不存在 `--accent-soft-foreground` 基础变量——所以它是"新增变量"，触发不对称校验。

**修复**：新增的变量名在 light/dark 块中成对声明；不想定制的主题用 heroui 的默认派生公式占位（见规则 2 的示例）。

## 问题 2：Web 正常，Android 上颜色还是默认蓝

**现象**：同样的 CSS，web 端主题覆盖生效，Android 上 Button 仍是 heroui 默认蓝（`#0485f7`）。

**原因**：`@variant` 块没有包 `:root`。Tailwind v4 会把 `@variant` 里的裸声明编译成 `:scope:where(.light, .light *)` 选择器，而 Uniwind **原生端**的 CSS 解析器（`node_modules/uniwind/src/bundler/css-processor/processor.ts` 的 `readSelectorVariants`）只认识 `:root` 和 `:where(.light/.dark)`，遇到 `:scope` 等无法识别的选择器组件会把**整条规则静默丢弃**——不报错，但变量值根本没编进原生 bundle。Web 端浏览器原生支持 `:scope`，所以表现正常，极具迷惑性。

**修复**：主题变量一律写在 `:root { @variant ... }` 里（heroui 官方 `variables.css` 的写法）。修复后经导出验证：自定义值 `#4a8c99` 等已编入 Android bundle，默认蓝被完全替换。

## 主题切换

- **Uniwind 默认自动跟随系统主题**（内部监听 RN `Appearance`），无需任何代码。
- **应用内手动切换**用 `Uniwind.setTheme`：
  - `Uniwind.setTheme('dark' | 'light')` — 钉住主题，停止跟随系统
  - `Uniwind.setTheme('system')` — 恢复跟随系统
  - 配合 `const { theme } = useUniwind()` 读取当前主题
- **导航框架配色**（tab bar、header 等 React Navigation 绘制的部分）由 `ThemeProvider` 控制，与 HeroUI 组件颜色是两套系统。根布局里用 `useUniwind().theme` 驱动它（见 `src/app/_layout.tsx`），三端行为一致；不要用 `useColorScheme()`——web 端 `Uniwind.setTheme` 不会同步 RN 的 `Appearance`，手动切换后两者会不一致。
- 局部区域强制主题：用 uniwind 导出的 `ScopedTheme` 组件包裹。

## 排查手段：验证主题值是否编进原生 bundle

改动 `global.css` 后如疑似未生效，可直接检查编译产物：

```bash
# 1. 导出 android bundle
CI=1 bunx expo export --platform android --output-dir /tmp/export-check

# 2. 把自定义颜色的 hex 值在 bundle 里 grep（oklch 会被转成 hex）
grep -c "#4a8c99" /tmp/export-check/_expo/static/js/android/*.hbc
```

- 自定义值 **不在** bundle 里 → 检查是否漏了 `:root` 包裹（问题 2）
- 报 "missing variable" → 检查变量名是否成对（问题 1）

改完 CSS 记得清缓存重启：

```bash
bunx expo start --clear
```
