# Space Roguelike MVP

2D Roguelike 飞船弹幕(bullet hell)Web 游戏 MVP。基于 Vite 8 + TypeScript 6 + Phaser 4。

- 渲染:Phaser 4.1.0(`AUTO` 选 WebGL/Canvas, `Phaser.Scale.FIT`)
- 构建:Vite 8.0.14
- 类型:TypeScript 6.0.3 (`strict`, ES2022, ESM)
- 单测:Vitest 4.1.7 + jsdom + @vitest/coverage-v8
- 端测:Playwright 1.60.0 (desktop-chromium 1280x720 + mobile-chromium Pixel 7 412x915 hasTouch)
- 包管理:pnpm 11.4.0(`packageManager` 字段已锁定)
- Node:>= 24.16.0 < 25
- 美术:全部使用 Phaser Graphics 程序化生成的占位贴图(无外部图片资源)

---

## 1. 一次性环境准备

```bash
# 启用 Corepack(Node 24 自带 Corepack;一次即可)
corepack enable

# 进入项目目录
cd space-roguelike

# 让 Corepack 校准 pnpm 11.4.0
corepack prepare pnpm@11.4.0 --activate

# 安装依赖(锁定到 package.json 中的精确版本)
pnpm install

# 安装 Playwright 浏览器(只需一次)
pnpm exec playwright install chromium
```

> `pnpm install` 不会自动下载浏览器,Playwright 浏览器必须单独装一次。
> 如果只想跑单测和构建,可以跳过 `playwright install`。

---

## 2. 日常开发

```bash
# 启动开发服务器(默认 http://localhost:5173)
pnpm dev

# 启动 e2e 模式开发服务器(挂载 window.__MVP_TEST__ 测试钩子)
pnpm dev:e2e

# 构建生产产物到 dist/
pnpm build

# 本地预览生产产物
pnpm preview
```

---

## 3. 测试

```bash
# 类型检查
pnpm typecheck

# 单元测试 + 集成测试(一次性运行)
pnpm test

# 单元测试 watch 模式
pnpm test:watch

# 单元测试 + 覆盖率(阈值 70%,见 vitest.config.ts)
pnpm test:coverage

# 端到端(Playwright)— 需要先 build,playwright.config.ts 里 webServer 会自动起 preview 或 dev
pnpm test:e2e

# 带 UI 调试 e2e
pnpm test:e2e:ui

# 查看上一次 e2e 报告
pnpm test:e2e:report

# 一键全跑:typecheck + 单测覆盖率 + 构建 + e2e
pnpm test:all
```

### 测试覆盖范围

- **单元测试** (`src/tests/unit/`):
  - `Rng` (Mulberry32 确定性 RNG)
  - `DamageResolver` / `StatsCalculator` / `TargetingSystem`
  - `MoneyResolver` / `MoneySystem`
  - `ModuleResolver` / `ModuleEventResolver` / `SlotResolver`
  - `StageResolver` / `BossPatternResolver`
  - `StorageRepository` / `SaveSystem` (FakeBackend)
  - `GameStateMachine` / `ObjectPool`
- **集成测试** (`src/tests/integration/`):
  - `runState.test.ts` — 关卡、模块、金钱、插槽间的整合
  - `stageFlow.test.ts` — 5 关流程驱动
- **E2E** (`e2e/`):
  - `01-app-load` — 启动 + 无致命错误 + 暴露 `window.__MVP_GAME__`
  - `02-smoke` — 进入游戏 + 通过 `__MVP_TEST__` 读 hp/stage
  - `03-input` — desktop 鼠标拖动 + mobile touch tap
  - `04-persistence` — `localStorage` save key 写入
  - `05-resize` — Phaser FIT 跟随视口

---

## 4. 项目结构

```
space-roguelike/
├─ index.html
├─ package.json / tsconfig.json / vite.config.ts / vitest.config.ts / playwright.config.ts
├─ src/
│  ├─ main.ts                       # Phaser.Game 引导
│  ├─ types/                        # 全部类型定义
│  ├─ game/
│  │  ├─ config.ts / constants.ts
│  │  ├─ GameStateMachine.ts        # 13 状态机
│  │  ├─ RunState.ts                # 单局运行状态
│  │  ├─ data/                      # 玩家/敌人/模块/关卡/Boss/插槽/背景 数据表
│  │  └─ test-support/testHooks.ts  # window.__MVP_TEST__ (仅 mode==='e2e')
│  ├─ systems/                      # 纯逻辑 + Phaser 运行时系统
│  ├─ entities/                     # PlayerShip/Enemy/Boss/Bullet/EnemyBullet/ExplosionEffect
│  ├─ scenes/                       # Boot/Preload/Menu/Game/StageResult/GameResult
│  ├─ ui/                           # HUD/HealthBar/ModuleCard/ShipSlotPanel/PausePanel/Button
│  └─ tests/{unit,integration}/
└─ e2e/                             # Playwright 测试
```

---

## 5. 关键设计要点

- **占位贴图**:`PreloadScene` 用 `make.graphics().generateTexture()` 程序化生成 10 张贴图(player_ship_01、enemy_*_01、boss_carrier_01、bullet_player_01、bullet_enemy_01、bg_*_tile_*_01)。生成过程使用 inline mulberry32,种子固定,贴图确定。
- **状态机**:13 个状态(Boot/Preload/Menu/Loading/Playing/Paused/StageClear/ModuleSelect/SlotInstall/Shop/StageEnd/Victory/Defeat)+ 显式合法转移表。
- **Roguelike 模块**:17 个模块、4 大类、3 稀有度,加权随机抽取。装备时通过 `StatsCalculator` 重算最终面板。
- **插槽系统**:9 槽,4 槽初始解锁,后续解锁价 100/180/280/420/600。
- **自动索敌**:最近敌人,稳定打破平局(更靠下 y 优先,其次 createdAt 早者优先)。
- **存档**:`StorageRepository` 优先 `localStorage`,失败回退 `MemoryBackend`,key 为 `space_roguelike_save_v1`。
- **测试钩子**:`window.__MVP_TEST__` 仅在 `import.meta.env.MODE === 'e2e'` 注入,不污染生产 bundle。

---

## 6. 一键自检命令(推荐第一次运行)

```bash
corepack enable
cd space-roguelike
corepack prepare pnpm@11.4.0 --activate
pnpm install
pnpm exec playwright install chromium
pnpm test:all
```

`pnpm test:all` 全绿即代表 MVP 验收通过。

---

## 7. 故障排查

| 现象 | 原因 / 处理 |
| --- | --- |
| `pnpm` 找不到 | 先执行 `corepack enable` |
| Phaser 报 WebGL 错误 | 测试中已忽略,见 `e2e/01-app-load.spec.ts` 的 errors 过滤 |
| `playwright test` 报浏览器缺失 | 跑 `pnpm exec playwright install chromium` |
| 覆盖率不达标 | `vitest.config.ts` 阈值 70%;运行 `pnpm test:coverage` 查看 HTML 报告 |
| jsdom 下 Phaser 引入报错 | 单测只覆盖纯逻辑,Phaser 系统不进 coverage(已在 `vitest.config.ts` include 中限制) |
