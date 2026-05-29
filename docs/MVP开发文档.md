# Roguelike 飞船弹幕网页游戏 MVP 开发文档

## 一、项目定位

本项目是一款 **2D Roguelike 飞船弹幕网页游戏 MVP**。

游戏以单局制闯关为核心。玩家操控飞船在竖屏战斗区域内移动，飞船自动索敌攻击，敌人按关卡和波次出现。玩家通过击败敌人、完成关卡获得金钱，并在每个普通关卡结束后从随机强化模块中选择一个安装到飞船通用插槽中，逐步形成不同的飞船构筑，最终挑战 Boss。

MVP 只实现一局完整可玩的核心闭环，不做账号系统、服务器系统、联机系统、排行榜系统、剧情系统、局外养成系统、经验系统和复杂装备系统。

---

## 二、MVP 核心目标

MVP 完成后，玩家应可以完整体验以下流程：

```txt
进入游戏首页
  ↓
点击开始游戏
  ↓
控制飞船移动
  ↓
飞船自动索敌攻击
  ↓
敌人按关卡和波次出现
  ↓
击败敌人获得金钱
  ↓
普通关卡倒计时结束后进入关卡结算
  ↓
从 3 个强化模块中选择 1 个
  ↓
将模块安装到任意已解锁插槽
  ↓
插槽不足时，替换旧模块或花费金钱解锁新插槽
  ↓
进入下一关
  ↓
最终关挑战 Boss
  ↓
击败 Boss 后通关
  ↓
玩家生命归零后失败
  ↓
展示本局结果
  ↓
本地保存基础游玩统计与设置
```

---

## 三、MVP 范围

### 1. 必须实现

```txt
Vite 8.0.14 + TypeScript 6.0.3 + Phaser 4.1.0 项目
PC 端 WASD 移动
PC 端鼠标拖拽移动
PC 端不支持点击移动
手机端任意屏幕位置单指拖拽移动
玩家飞船自动锁定并攻击距离最近的敌人
TileSprite 多层滚动背景
玩家子弹对象池
敌人生成与移动
普通敌人对象池
敌人子弹对象池
玩家与敌人的碰撞
玩家子弹与敌人的碰撞
敌人子弹与玩家的碰撞
生命与护盾系统
受伤无敌时间
普通关卡倒计时
多关卡推进
金钱系统
关卡结算界面
强化模块三选一
通用插槽系统
模块安装与替换
插槽购买
最终属性计算
Boss 战
胜利与失败结算
本地设置保存
本地基础统计保存
TileSprite 背景视差与滚动
移动端适配
基础音效与背景音乐开关
Phaser TileSprite 多层可滚动宇宙背景
Vitest 单元测试与覆盖率报告
Playwright 端到端测试
PC 与手机端输入自动化测试
核心玩法闭环自动化测试
交付前质量门禁脚本
```

### 2. 不属于 MVP

```txt
不做账号系统
不做服务器
不做联机
不做排行榜
不做经验系统
不做技能树
不做局外成长
不做装备养成
不做剧情系统
不做任务系统
不做内购
不做云存档
不做复杂道具掉落
不做多角色选择
不做复杂主动技能系统
不保存进行中的单局进度
```

---

## 四、技术选型与稳定版本锁定

本项目的技术栈必须明确锁定到当前查询到的最新稳定版本，避免开发过程中因为 `latest` 漂移导致构建结果不一致。

版本核对日期：**2026-05-29**。

### 1. 技术栈版本表

| 分类 | 技术 | MVP 指定版本 | 版本策略 | 说明 |
|---|---|---:|---|---|
| JavaScript 运行环境 | Node.js | 24.16.0 | 最新 LTS 稳定版 | 用于本地开发、依赖安装、构建与预览 |
| 构建工具 | Vite | 8.0.14 | npm latest stable | 用于开发服务器与生产构建 |
| 开发语言 | TypeScript | 6.0.3 | npm latest stable | 全项目使用 TypeScript 编写 |
| 游戏引擎 | Phaser | 4.1.0 | npm latest stable | 用于 2D 渲染、Scene、资源加载、音频、输入、TileSprite 背景 |
| 包管理器 | pnpm | 11.4.0 | npm latest stable | 用于安装依赖与锁定依赖树 |
| 单元测试框架 | Vitest | 4.1.7 | npm latest stable | 测试纯逻辑、数据计算、状态机与覆盖率 |
| 测试覆盖率 | @vitest/coverage-v8 | 4.1.7 | npm latest stable | 使用 V8 coverage 生成覆盖率报告 |
| DOM 测试环境 | jsdom | 29.1.1 | npm latest stable | 用于测试少量 DOM Overlay、localStorage 与浏览器 API 包装层 |
| E2E 测试框架 | @playwright/test | 1.60.0 | npm latest stable | 用于浏览器真实运行、PC/移动端输入与完整玩法闭环测试 |
| 本地存储 | localStorage | 浏览器内置 API | 无需版本号 | 保存设置与基础游玩统计 |
| AI 贴图生成 | GPT Image 2 Model / ChatGPT 图像创建能力 | 交付时平台正式可用版本 | 官方正式可用能力 | 用于生成玩家、敌人、Boss、子弹、背景、UI 与模块图标等科幻现实风格贴图 |
| 主要资源格式 | PNG、无缝可平铺 PNG、Spritesheet、JSON、MP3、WAV | 通用格式 | 无需版本号 | 用于贴图、配置、音效与音乐 |

### 2. 版本锁定要求

```txt
package.json 中必须使用精确版本号。
不允许在 dependencies 和 devDependencies 中使用 latest。
不建议使用 ^ 或 ~。
pnpm-lock.yaml 必须提交到代码仓库。
本地开发、测试、打包必须使用 pnpm 11.4.0。
Node.js 统一使用 24.16.0 LTS 稳定版。
测试依赖也必须使用精确版本号。
Playwright 浏览器二进制版本必须随 @playwright/test 1.60.0 一起安装并锁定。
```

### 3. package.json 基准配置

```json
{
  "name": "space-roguelike-mvp",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@11.4.0",
  "engines": {
    "node": ">=24.16.0 <25",
    "pnpm": "11.4.0"
  },
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "dev:e2e": "vite --host 127.0.0.1 --mode e2e",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 0.0.0.0",
    "typecheck": "tsc -b --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:report": "playwright show-report",
    "test:all": "pnpm typecheck && pnpm test:coverage && pnpm build && pnpm test:e2e"
  },
  "dependencies": {
    "phaser": "4.1.0"
  },
  "devDependencies": {
    "@playwright/test": "1.60.0",
    "@vitest/coverage-v8": "4.1.7",
    "jsdom": "29.1.1",
    "typescript": "6.0.3",
    "vite": "8.0.14",
    "vitest": "4.1.7"
  }
}
```

### 4. 初始化命令

```bash
corepack enable
corepack prepare pnpm@11.4.0 --activate

mkdir space-roguelike
cd space-roguelike
pnpm init

pnpm add phaser@4.1.0
pnpm add -D vite@8.0.14 typescript@6.0.3 vitest@4.1.7 @vitest/coverage-v8@4.1.7 jsdom@29.1.1 @playwright/test@1.60.0
pnpm exec playwright install chromium webkit
```

如果使用脚手架创建项目，允许先用脚手架生成基础目录，但生成后必须回到本章节的版本表，手动锁定依赖版本。

### 5. 选择 Phaser 4.1.0 的原因

```txt
适合 2D 网页游戏
对 Canvas / WebGL 支持成熟
内置 Scene、资源加载、音频、动画等基础能力
内置 TileSprite，适合制作循环滚动的宇宙背景
适合快速完成弹幕类 MVP
PC 浏览器和手机浏览器兼容性较好
当前文档统一以 Phaser 4.1.0 最新稳定版为实现基线
```

### 6. 不引入的前端框架

```txt
MVP 不引入 React。
MVP 不引入 Vue。
MVP 不引入 Zustand、Redux 等外部状态库。
MVP UI 优先使用 Phaser Scene 与 Phaser GameObject 实现。
如需少量 HTML 面板，可以使用普通 DOM，但不得引入大型 UI 框架。
```

原因：

```txt
本项目核心是 Phaser 画布内的实时战斗。
MVP 阶段引入额外前端框架会增加状态同步、生命周期管理和构建复杂度。
当前 UI 需求可以由 Phaser 内部 UI 对象、简单 DOM Overlay 或原生 HTML/CSS 满足。
```

### 7. 测试框架选择原因

```txt
Vitest 用于测试纯 TypeScript 逻辑，例如属性计算、模块叠加、插槽规则、伤害结算、关卡推进、自动索敌、金钱结算和本地存储包装层。
@vitest/coverage-v8 用于生成覆盖率报告，作为交付门禁之一。
jsdom 仅用于少量 DOM Overlay、本地存储和浏览器 API 包装层测试，不用于模拟 Phaser 主战斗。
Playwright 用于在真实浏览器中运行 Phaser 游戏，验证画布加载、PC 输入、手机拖拽、自动攻击、结算流程、Boss 战和完整闭环。
Phaser Scene、WebGL/Canvas 渲染、触摸输入、音频解锁等浏览器行为，不通过 Node 单元测试伪造，必须通过 Playwright 或人工验收覆盖。
```

### 8. 升级策略

```txt
MVP 开发期间不随意升级主版本。
如需升级 Phaser、Vite、TypeScript、pnpm 或 Node.js，必须先建立单独升级分支。
升级后必须重新验证：项目启动、生产构建、TileSprite 背景、移动端触摸、音频播放、对象池和 Boss 战。
```

---

## 五、推荐目录结构

```txt
space-roguelike/
├── public/
│   └── assets/
│       ├── images/
│       │   ├── backgrounds/
│       │   ├── player/
│       │   ├── enemies/
│       │   ├── bullets/
│       │   ├── modules/
│       │   ├── effects/
│       │   └── ui/
│       ├── audio/
│       │   ├── bgm/
│       │   └── sfx/
│       └── data/
│           ├── enemies.json
│           ├── modules.json
│           ├── stages.json
│           └── boss.json
│
├── src/
│   ├── main.ts
│   ├── game/
│   │   ├── config.ts
│   │   ├── constants.ts
│   │   ├── GameApp.ts
│   │   └── GameStateMachine.ts
│   │
│   ├── scenes/
│   │   ├── BootScene.ts
│   │   ├── PreloadScene.ts
│   │   ├── MenuScene.ts
│   │   ├── GameScene.ts
│   │   ├── PauseScene.ts
│   │   ├── StageResultScene.ts
│   │   └── GameResultScene.ts
│   │
│   ├── entities/
│   │   ├── PlayerShip.ts
│   │   ├── Enemy.ts
│   │   ├── Boss.ts
│   │   ├── Bullet.ts
│   │   ├── EnemyBullet.ts
│   │   └── ExplosionEffect.ts
│   │
│   ├── systems/
│   │   ├── PlayerControlSystem.ts
│   │   ├── PlayerAutoAttackSystem.ts
│   │   ├── BulletSystem.ts
│   │   ├── BackgroundSystem.ts
│   │   ├── EnemySpawner.ts
│   │   ├── EnemyAttackSystem.ts
│   │   ├── CollisionSystem.ts
│   │   ├── DamageSystem.ts
│   │   ├── StageSystem.ts
│   │   ├── WaveSystem.ts
│   │   ├── BossSystem.ts
│   │   ├── MoneySystem.ts
│   │   ├── ShipSlotSystem.ts
│   │   ├── ModuleSystem.ts
│   │   ├── BuildSystem.ts
│   │   ├── SlotShopSystem.ts
│   │   ├── SaveSystem.ts
│   │   ├── AudioSystem.ts
│   │   ├── MobileAdaptSystem.ts
│   │   └── ObjectPool.ts
│   │
│   ├── data/
│   │   ├── playerBaseStats.ts
│   │   ├── enemyTypes.ts
│   │   ├── moduleTypes.ts
│   │   ├── stageTypes.ts
│   │   ├── bossTypes.ts
│   │   ├── backgroundLayers.ts
│   │   └── slotUnlocks.ts
│   │
│   ├── types/
│   │   ├── GameTypes.ts
│   │   ├── PlayerTypes.ts
│   │   ├── EnemyTypes.ts
│   │   ├── ModuleTypes.ts
│   │   ├── ShipTypes.ts
│   │   ├── StageTypes.ts
│   │   └── SaveTypes.ts
│   │
│   └── ui/
│       ├── Hud.ts
│       ├── HealthBar.ts
│       ├── ShieldBar.ts
│       ├── BossHealthBar.ts
│       ├── StageResultPanel.ts
│       ├── ModuleCard.ts
│       ├── ShipSlotPanel.ts
│       ├── PausePanel.ts
│       └── GameResultPanel.ts
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 六、游戏视口与适配

### 1. 基础视口

```txt
设计分辨率：720 x 1280
推荐比例：9:16
主要方向：竖屏
```

PC 浏览器中，游戏区域居中显示。手机浏览器中，游戏画面按屏幕比例缩放，优先保证战斗区域完整可见。

### 2. 移动端要求

```txt
页面禁止滚动
游戏区域禁用浏览器默认触摸行为
触摸拖动只控制飞船，不触发页面滑动
手机端允许从屏幕任意位置开始拖拽，不要求手指按在飞船上
手机端拖拽采用位移增量控制飞船，不使用点击移动或瞬移到手指位置
音频必须在用户点击开始游戏后播放
适配刘海屏和底部安全区域
横屏访问时提示建议竖屏游玩
结算界面按钮必须适合手指点击
```

---

## 七、游戏运行状态机

游戏必须以明确状态驱动，避免战斗逻辑、结算逻辑和 UI 操作混杂。

```txt
Menu
  ↓
Preload
  ↓
StageStart
  ↓
Playing
  ↓
Paused
  ↓
StageCleared
  ↓
StageResult
  ↓
ModuleSelect
  ↓
SlotInstall
  ↓
NextStage
  ↓
BossStage
  ↓
Victory / Defeat
  ↓
GameResult
```

状态规则：

```txt
Menu：只显示首页和设置入口
Preload：只加载资源
StageStart：初始化当前关卡
Playing：更新玩家、敌人、子弹、碰撞、计时器、敌人生成器
Paused：暂停战斗对象、生成器、计时器和音效
StageCleared：停止敌人生成，清理战斗对象
StageResult：显示关卡结算，不更新战斗逻辑
ModuleSelect：玩家选择一个强化模块
SlotInstall：玩家将模块安装到插槽
NextStage：准备进入下一关
BossStage：运行 Boss 战逻辑
Victory：Boss 被击败，进入胜利结算
Defeat：玩家生命归零，进入失败结算
GameResult：展示本局结果，允许重新开始或返回首页
```

---

## 八、单局流程

### 1. 总体流程

```txt
开始游戏
  ↓
初始化 RunState
  ↓
进入第 1 关
  ↓
普通关卡战斗
  ↓
倒计时结束
  ↓
关卡结算
  ↓
选择强化模块
  ↓
安装到飞船插槽
  ↓
可购买新插槽
  ↓
进入下一关
  ↓
完成第 4 关后进入 Boss 关
  ↓
击败 Boss 则通关
  ↓
玩家死亡则失败
```

### 2. 单局时长

```txt
总关卡数：5 关
普通关卡：4 关
Boss 关卡：1 关
普通关卡时长：60 - 90 秒
Boss 关目标战斗时长：约 120 秒
单局总时长：6 - 8 分钟
```

Boss 关的 120 秒是数值设计目标，不作为强制失败倒计时。

---

## 九、关卡胜利与失败规则

### 1. 普通关卡胜利条件

```txt
玩家存活到普通关卡倒计时结束，即判定关卡完成。
普通关卡不要求清空场上所有敌人。
```

普通关卡完成时：

```txt
立即停止敌人生成
立即停止敌人攻击
清除场上普通敌人
清除场上玩家子弹
清除场上敌人子弹
停止战斗碰撞检测
进入关卡结算界面
```

### 2. Boss 关胜利条件

```txt
玩家在生命归零前击败 Boss，即判定本局通关。
```

### 3. 失败条件

```txt
玩家生命归零时，本局失败。
```

如果玩家拥有可触发复活的模块，则先执行复活效果。复活次数耗尽后，再判定失败。

---

## 十、玩家飞船系统

### 1. 玩家属性结构

```ts
export interface PlayerStats {
  maxHp: number
  hp: number

  maxShield: number
  shield: number
  shieldRegen: number

  moveSpeed: number

  damage: number
  fireRate: number
  bulletSpeed: number
  bulletCount: number
  bulletSpread: number

  critRate: number
  critDamage: number

  moneyBonus: number
}
```

### 2. 玩家初始数值

| 属性 | 初始值 | 说明 |
|---|---:|---|
| maxHp | 100 | 最大生命 |
| hp | 100 | 当前生命 |
| maxShield | 0 | 最大护盾 |
| shield | 0 | 当前护盾 |
| shieldRegen | 0 | 每秒护盾恢复 |
| moveSpeed | 360 | 移动速度 |
| damage | 10 | 单发子弹基础伤害 |
| fireRate | 4 | 每秒射击次数 |
| bulletSpeed | 700 | 玩家子弹速度 |
| bulletCount | 1 | 每次发射子弹数量 |
| bulletSpread | 0 | 子弹散射角，单位为度 |
| critRate | 0.05 | 暴击率 |
| critDamage | 1.5 | 暴击倍率 |
| moneyBonus | 0 | 金钱获取加成 |

### 3. 属性上下限

```txt
maxHp 最低不低于 1
hp 最低不低于 0
maxShield 最低不低于 0
shield 最低不低于 0
moveSpeed 最低不低于 180
moveSpeed 最高不超过 600
fireRate 最低不低于 1
fireRate 最高不超过 12
bulletCount 最低不低于 1
bulletCount 最高不超过 6
bulletSpread 最低不低于 0
bulletSpread 最高不超过 60
critRate 最低不低于 0
critRate 最高不超过 0.8
critDamage 最低不低于 1
moneyBonus 最低不低于 0
moneyBonus 最高不超过 1
```

### 4. 玩家操作

MVP 中，玩家只负责控制飞船位置，不需要手动开火。

玩家移动采用两类输入：

```txt
PC 端：WASD 移动，鼠标拖拽移动。
手机端：单指拖拽屏幕任意位置移动。
```

不支持点击移动。

也就是说：

```txt
点击战斗区域某个位置，不会让飞船自动飞向该位置。
只有按住并拖动时，飞船才会跟随拖拽位移移动。
```

#### PC 端

| 操作 | 功能 | MVP 规则 |
|---|---|---|
| W | 向上移动 | 按住持续移动 |
| A | 向左移动 | 按住持续移动 |
| S | 向下移动 | 按住持续移动 |
| D | 向右移动 | 按住持续移动 |
| 鼠标按住并拖拽战斗区域 | 移动飞船 | 飞船根据鼠标拖拽位移移动 |
| 鼠标单击战斗区域 | 无移动效果 | 不支持点击移动 |
| 鼠标点击 UI | 选择按钮、模块、插槽 | 仅 UI 区域响应点击 |
| ESC | 暂停或恢复 | 仅 Playing / Paused 状态有效 |

PC 端不要求支持方向键。

#### 手机端

| 操作 | 功能 | MVP 规则 |
|---|---|---|
| 单指按住并拖动屏幕任意位置 | 控制飞船移动 | 飞船根据手指拖拽位移移动 |
| 单指点击战斗区域 | 无移动效果 | 不支持点击移动 |
| 点击模块卡片 | 选择强化模块 | 仅结算界面有效 |
| 点击插槽 | 安装或替换模块 | 仅结算界面有效 |
| 点击暂停按钮 | 暂停或恢复 | 战斗中有效 |

手机端拖拽不要求从飞船本体开始。

示例：

```txt
玩家手指在屏幕左上角按住并向右拖动 40 像素，
飞船也向右移动对应距离。

玩家手指在屏幕空白区域按住并向下拖动，
飞船也向下移动。
```

### 5. 输入控制实现规则

#### 拖拽移动规则

```txt
pointerdown：记录当前指针位置，不立即移动飞船。
pointermove：计算本次指针位置与上次指针位置的差值。
飞船位置 += 指针位移差值 * dragSensitivity。
pointerup / pointercancel：结束拖拽状态。
```

推荐默认值：

```ts
const dragSensitivity = 1
```

拖拽移动必须使用位移差值，不使用目标点寻路。

错误做法：

```txt
点击哪里，飞船飞到哪里。
```

正确做法：

```txt
手指或鼠标拖动多少，飞船移动多少。
```

#### PC 输入优先级

```txt
鼠标正在拖拽时，优先使用鼠标拖拽控制。
没有鼠标拖拽时，使用 WASD 控制。
```

这样可以避免鼠标拖拽和键盘移动同时生效导致飞船速度异常。

#### UI 与战斗区域输入隔离

```txt
点击 UI 按钮、模块卡片、插槽时，不触发飞船移动。
拖拽战斗区域时，不触发 UI 点击。
结算界面打开时，禁用战斗移动输入。
暂停界面打开时，禁用战斗移动输入。
```

#### 飞船边界限制

```txt
飞船不能移动出游戏区域。
飞船 x 坐标限制在 [shipHalfWidth, screenWidth - shipHalfWidth]。
飞船 y 坐标限制在 [topSafeArea + shipHalfHeight, screenHeight - bottomSafeArea - shipHalfHeight]。
```

---

## 十一、玩家自动索敌攻击系统---

## 十一、玩家自动索敌攻击系统

玩家飞船不需要手动攻击。

MVP 中，玩家飞船会自动寻找距离最近的敌人并开火。

### 1. 自动攻击总规则

```txt
玩家不需要点击攻击按钮。
玩家飞船自动攻击当前距离最近的存活敌人。
普通敌人与 Boss 都可以成为自动攻击目标。
如果当前没有可攻击目标，则不生成玩家子弹。
```

### 2. 目标选择规则

可攻击目标必须满足：

```txt
目标处于 active 状态
目标未死亡
目标仍在战斗区域内或可被判定命中
目标类型为普通敌人或 Boss
```

目标距离计算方式：

```ts
const distance = Phaser.Math.Distance.Between(
  player.x,
  player.y,
  target.x,
  target.y,
)
```

选择规则：

```txt
每次到达攻击间隔时，重新查找一次最近目标。
如果多个目标距离相同，优先选择更靠近屏幕下方的目标。
Boss 不拥有强制优先级。
如果 Boss 战中场上只有 Boss，则自动攻击 Boss。
```

### 3. 攻击频率规则

```txt
攻击频率由 fireRate 控制。
fireRate 表示每秒攻击次数。
攻击间隔 = 1000 / fireRate。
```

示例：

```txt
fireRate = 2，表示每秒攻击 2 次。
攻击间隔为 500ms。
```

如果攻击间隔到达但没有可攻击目标：

```txt
本次不发射子弹。
攻击冷却保持就绪或按正常节奏继续均可。
MVP 推荐保持就绪，保证敌人出现后可以立即开火。
```

### 4. 子弹基础规则

| 属性 | 默认值 |
|---|---:|
| 伤害 | 10 |
| 速度 | 700 |
| 生命周期 | 2 秒 |
| 碰撞半径 | 12 |
| 是否穿透 | 否 |
| 是否追踪 | 否 |

玩家子弹只在发射瞬间确定方向。

```txt
子弹发射后不继续追踪目标。
目标死亡后，已经发射出去的子弹继续按原方向飞行。
```

### 5. 子弹方向规则

子弹方向由玩家飞船中心指向目标中心。

```ts
const angle = Phaser.Math.Angle.Between(
  player.x,
  player.y,
  target.x,
  target.y,
)
```

子弹速度向量：

```ts
bullet.velocity.x = Math.cos(angle) * bulletSpeed
bullet.velocity.y = Math.sin(angle) * bulletSpeed
```

### 6. 多子弹与散射规则

```txt
bulletCount = 1：向最近目标发射 1 枚子弹。
bulletCount = 2：围绕目标方向左右各偏移一半散射角。
bulletCount >= 3：以目标方向为中心，按照 bulletSpread 均匀展开。
```

示例：

```txt
bulletCount = 3，bulletSpread = 30°
如果目标方向为 -90°，则子弹角度为 -105°、-90°、-75°。

bulletCount = 5，bulletSpread = 40°
如果目标方向为 -90°，则子弹角度为 -110°、-100°、-90°、-80°、-70°。
```

### 7. 暴击规则

```txt
玩家子弹命中敌人时，根据 critRate 判定是否暴击。
未暴击伤害 = damage。
暴击伤害 = damage * critDamage。
```

### 8. PlayerAutoAttackSystem 职责

```txt
维护自动攻击计时器。
根据当前敌人列表和 Boss 状态查找最近目标。
根据最终属性计算攻击间隔、子弹数量、子弹速度和散射角。
调用 BulletSystem 生成玩家子弹。
没有目标时不生成子弹。
暂停、结算、失败、胜利状态下停止自动攻击。
```

---

## 十二、生命、护盾与受伤规则---

## 十二、生命、护盾与受伤规则

### 1. 扣血规则

玩家受到伤害时，优先扣除护盾。护盾不足时，剩余伤害继续扣除生命。

```ts
function applyDamageToPlayer(player: PlayerStats, damage: number) {
  const shieldDamage = Math.min(player.shield, damage)
  player.shield -= shieldDamage

  const hpDamage = damage - shieldDamage
  player.hp = Math.max(0, player.hp - hpDamage)
}
```

### 2. 无敌时间

```txt
玩家受到伤害后获得 0.6 秒无敌时间。
无敌时间内，玩家不再受到敌人碰撞和敌方子弹伤害。
无敌时间内，飞船显示闪烁效果。
```

### 3. 护盾恢复

```txt
shieldRegen 表示每秒恢复的护盾值。
护盾恢复不能超过 maxShield。
玩家死亡后不再恢复护盾。
```

### 4. 进入下一关时的生命与护盾

```txt
进入下一关前，重新计算模块带来的最终属性。
当前 hp 继承上一关结算后的 hp。
如果新的 maxHp 小于当前 hp，则当前 hp 限制为新的 maxHp。
护盾在每关开始时恢复到 maxShield。
```

---

## 十三、敌人系统

### 1. 敌人类型

MVP 包含 4 类敌人：

| 敌人 | 定位 | 行为 |
|---|---|---|
| 小型敌机 | 基础杂兵 | 从上方直线向下移动，不射击 |
| 快速敌机 | 高速干扰 | 从侧边或斜向移动，不射击 |
| 重型敌机 | 高血量敌人 | 缓慢移动，定时向下发射子弹 |
| Boss | 关底敌人 | 使用固定循环弹幕攻击 |

### 2. 敌人配置结构

```ts
export interface EnemyConfig {
  id: string
  name: string
  hp: number
  contactDamage: number
  moveSpeed: number
  money: number
  texture: string
  attack?: EnemyAttackConfig
}

export interface EnemyAttackConfig {
  bulletDamage: number
  bulletSpeed: number
  fireInterval: number
  pattern: 'straight' | 'aimed' | 'spread'
}
```

### 3. 初始敌人表

| ID | 名称 | HP | 碰撞伤害 | 速度 | 金钱 | 攻击方式 |
|---|---|---:|---:|---:|---:|---|
| enemy_small | 小型敌机 | 20 | 10 | 180 | 3 | 无 |
| enemy_fast | 快速敌机 | 15 | 8 | 280 | 4 | 无 |
| enemy_heavy | 重型敌机 | 80 | 20 | 100 | 10 | 每 2 秒向下发射 1 枚子弹 |
| boss_01 | 巡航母舰 | 2000 | 25 | 60 | 100 | Boss 专属弹幕 |

### 4. 敌人死亡规则

```txt
敌人 hp <= 0 时死亡。
敌人死亡后播放爆炸效果。
敌人死亡后根据 enemy.money 增加金钱。
敌人死亡后从对象池中回收。
```

---

## 十四、敌人子弹系统

### 1. 敌人子弹规则

```txt
敌人子弹只伤害玩家。
敌人子弹命中玩家后消失。
敌人子弹离开屏幕后回收。
敌人子弹不与玩家子弹相互抵消。
```

### 2. 敌人子弹基础属性

| 属性 | 默认值 |
|---|---:|
| 伤害 | 10 |
| 速度 | 320 |
| 生命周期 | 5 秒 |
| 碰撞半径 | 12 |

---

## 十五、关卡系统

### 1. 关卡配置结构

```ts
export interface StageConfig {
  id: string
  name: string
  type: 'normal' | 'boss'
  duration: number
  baseReward: number
  waves: StageWaveConfig[]
}

export interface StageWaveConfig {
  enemyId: string
  timeStart: number
  timeEnd: number
  spawnInterval: number
  maxAlive: number
  pattern: 'top' | 'side' | 'diagonal' | 'random'
}
```

### 2. MVP 关卡设计

| 关卡 | 类型 | 时长 | 目标 |
|---|---|---:|---|
| Stage 1 | 普通关 | 60 秒 | 熟悉移动和射击 |
| Stage 2 | 普通关 | 75 秒 | 增加敌人密度 |
| Stage 3 | 普通关 | 90 秒 | 出现重型敌人 |
| Stage 4 | 普通关 | 90 秒 | 多类型敌人混合压迫 |
| Stage 5 | Boss 关 | 目标 120 秒 | 击败 Boss |

### 3. 关卡配置示例

```ts
export const stageTypes: StageConfig[] = [
  {
    id: 'stage_01',
    name: '外围巡航区',
    type: 'normal',
    duration: 60,
    baseReward: 80,
    waves: [
      {
        enemyId: 'enemy_small',
        timeStart: 0,
        timeEnd: 60,
        spawnInterval: 1200,
        maxAlive: 12,
        pattern: 'top',
      },
    ],
  },
  {
    id: 'stage_02',
    name: '碎星带',
    type: 'normal',
    duration: 75,
    baseReward: 100,
    waves: [
      {
        enemyId: 'enemy_small',
        timeStart: 0,
        timeEnd: 75,
        spawnInterval: 1000,
        maxAlive: 16,
        pattern: 'top',
      },
      {
        enemyId: 'enemy_fast',
        timeStart: 20,
        timeEnd: 75,
        spawnInterval: 1600,
        maxAlive: 8,
        pattern: 'side',
      },
    ],
  },
  {
    id: 'stage_05',
    name: '母舰拦截战',
    type: 'boss',
    duration: 120,
    baseReward: 0,
    waves: [],
  },
]
```

---

## 十六、Boss 系统

### 1. Boss 基础设定

```txt
Boss 名称：巡航母舰
出现关卡：Stage 5
生命值：2000
碰撞伤害：25
胜利条件：击败 Boss
失败条件：玩家生命归零且没有可用复活效果
```

### 2. Boss 攻击模式

| 攻击模式 | 触发间隔 | 子弹数量 | 子弹伤害 | 子弹速度 | 说明 |
|---|---:|---:|---:|---:|---|
| 直线弹幕 | 2 秒 | 5 | 10 | 360 | 从 Boss 下方向下发射多枚直线子弹 |
| 扇形弹幕 | 4 秒 | 9 | 12 | 320 | 以扇形角度向下散射 |
| 追踪弹 | 5 秒 | 3 | 15 | 280 | 朝玩家当前位置发射 |

### 3. Boss 技能循环

MVP 中 Boss 不做复杂 AI，使用固定循环：

```txt
直线弹幕
  ↓
直线弹幕
  ↓
扇形弹幕
  ↓
追踪弹
  ↓
循环
```

### 4. Boss 血条

```txt
Boss 出现时，顶部显示 Boss 血条。
Boss 生命归零后停止所有 Boss 弹幕。
Boss 死亡后清除场上敌方子弹。
进入胜利结算。
```

---

## 十七、金钱系统

### 1. 金钱来源

```txt
击杀普通敌人
击杀 Boss
普通关卡完成奖励
普通关卡剩余生命奖励
模块带来的金钱获取加成
```

### 2. 击杀金钱

击杀敌人时立即获得金钱。

```ts
const killMoney = Math.floor(enemy.money * (1 + playerStats.moneyBonus))
```

### 3. 关卡完成金钱

普通关卡完成时，结算关卡奖励。

```ts
const hpPercent = playerStats.hp / playerStats.maxHp
const hpBonus = Math.floor(hpPercent * 50)
const stageReward = stage.baseReward + hpBonus
const finalStageReward = Math.floor(stageReward * (1 + playerStats.moneyBonus))
```

### 4. 金钱加成规则

```txt
moneyBonus 只对获得金钱时生效。
moneyBonus 对击杀金钱和关卡完成金钱都生效。
已经获得的金钱不会因为后续安装模块而重新计算。
```

### 5. 金钱用途

```txt
购买新插槽
扩展飞船模块容量
```

---

## 十八、飞船插槽系统

### 1. 插槽规则

```txt
飞船拥有多个通用插槽。
每个插槽最多安装 1 个模块。
任何模块都可以安装到任意已解锁插槽。
未解锁插槽不能安装模块。
插槽可以通过金钱解锁。
MVP 不对插槽设置武器、护盾、反应炉等类型限制。
```

### 2. 初始插槽

| 插槽 | 状态 |
|---|---|
| slot_1 | 已解锁 |
| slot_2 | 已解锁 |
| slot_3 | 已解锁 |
| slot_4 | 已解锁 |
| slot_5 | 未解锁 |
| slot_6 | 未解锁 |
| slot_7 | 未解锁 |
| slot_8 | 未解锁 |
| slot_9 | 未解锁 |

```txt
玩家初始拥有 4 个可用插槽。
MVP 最大插槽数为 9 个。
```

### 3. 插槽结构

```ts
export interface ShipSlot {
  id: string
  unlocked: boolean
  module?: ShipModule
}
```

模块直接挂在插槽上，不再单独维护 `installedModules` 映射，避免状态重复。

### 4. 插槽解锁价格

| 解锁次数 | 解锁插槽 | 花费 |
|---|---|---:|
| 第 1 次 | slot_5 | 100 |
| 第 2 次 | slot_6 | 180 |
| 第 3 次 | slot_7 | 280 |
| 第 4 次 | slot_8 | 420 |
| 第 5 次 | slot_9 | 600 |

### 5. 插槽安装规则

```txt
玩家选择一个强化模块后，必须将其安装到一个已解锁插槽。
如果目标插槽为空，则直接安装。
如果目标插槽已有模块，则弹出确认，确认后替换旧模块。
如果没有空插槽，玩家可以购买新插槽或替换旧模块。
如果金钱不足且没有空插槽，只能替换旧模块。
未完成模块安装前，不能进入下一关。
```

---

## 十九、强化模块系统

### 1. 模块分类

```ts
export type ModuleCategory =
  | 'weapon'
  | 'reactor'
  | 'shield'
  | 'utility'
```

模块分类只用于展示和奖励池控制，不限制安装位置。

### 2. 模块结构

```ts
export interface ShipModule {
  id: string
  name: string
  description: string
  category: ModuleCategory
  rarity: 'common' | 'rare' | 'epic'
  effects: ModuleEffect[]
}
```

### 3. 模块效果类型

```ts
export type ModuleEffectType =
  | 'damage_percent'
  | 'fire_rate_percent'
  | 'bullet_count_add'
  | 'bullet_speed_percent'
  | 'bullet_spread_add'
  | 'max_hp_add'
  | 'max_shield_add'
  | 'shield_regen_add'
  | 'move_speed_percent'
  | 'money_bonus_percent'
  | 'on_stage_end_heal'
  | 'on_shield_break_clear_enemy_bullets'
  | 'on_death_revive_once'

export interface ModuleEffect {
  type: ModuleEffectType
  value: number
}
```

### 4. MVP 模块清单

#### 武器类模块

| ID | 名称 | 稀有度 | 效果 |
|---|---|---|---|
| weapon_laser_1 | 轻型激光炮 | common | 伤害 +15% |
| weapon_fast_1 | 速射炮管 | common | 射速 +15% |
| weapon_double_1 | 双联炮 | rare | 子弹数量 +1 |
| weapon_spread_1 | 散射炮口 | rare | 子弹散射角 +20° |
| weapon_railgun_1 | 轨道炮 | epic | 伤害 +40%，射速 -10% |

#### 反应炉类模块

| ID | 名称 | 稀有度 | 效果 |
|---|---|---|---|
| reactor_small_1 | 小型反应炉 | common | 射速 +10% |
| reactor_power_1 | 高能反应炉 | rare | 伤害 +20%，子弹速度 +10% |
| reactor_engine_1 | 推进反应炉 | common | 移动速度 +10% |
| reactor_overload_1 | 过载反应炉 | epic | 伤害 +35%，最大生命 -20 |

#### 护盾类模块

| ID | 名称 | 稀有度 | 效果 |
|---|---|---|---|
| shield_basic_1 | 护盾发生器 | common | 最大护盾 +40 |
| shield_regen_1 | 再生护盾 | rare | 护盾每秒恢复 +2 |
| shield_heavy_1 | 重型护盾 | rare | 最大护盾 +80，移动速度 -8% |
| shield_burst_1 | 爆裂护盾 | epic | 护盾破裂时清除周围敌方子弹 |

#### 通用类模块

| ID | 名称 | 稀有度 | 效果 |
|---|---|---|---|
| utility_engine_1 | 推进器强化 | common | 移动速度 +12% |
| utility_radar_1 | 战利品雷达 | common | 金钱获取 +15% |
| utility_repair_1 | 自动维修装置 | rare | 每关结束恢复 20 生命 |
| utility_core_1 | 备用核心 | epic | 死亡时复活一次，恢复 30% 最大生命 |

### 5. 模块三选一规则

```txt
每个普通关卡结算时随机出现 3 个模块。
玩家只能选择 1 个模块。
同一次三选一中不出现重复模块。
不同关卡之间允许重复出现同一个模块。
同一个模块允许重复安装。
模块可以安装到任意已解锁插槽。
模块安装后，在进入下一关前重新计算属性。
Boss 关结束后不再出现模块选择。
```

### 6. 模块稀有度权重

| 稀有度 | 权重 |
|---|---:|
| common | 100 |
| rare | 35 |
| epic | 10 |

### 7. 模块叠加规则

```txt
同类百分比效果采用加法叠加。
例如两个伤害 +15% 模块，最终伤害倍率为 1 + 0.15 + 0.15 = 1.3。
固定值效果直接相加。
事件型效果按模块数量分别生效，但同一触发时机需要做次数限制。
```

事件型效果限制：

```txt
on_death_revive_once：每个备用核心每局最多触发 1 次。
on_stage_end_heal：每个模块在每次普通关卡结束时触发 1 次。
on_shield_break_clear_enemy_bullets：护盾从大于 0 降到 0 时触发，触发后需要等护盾重新大于 0 才能再次触发。
```

---

## 二十、飞船构筑状态

```ts
export interface ShipBuildState {
  money: number
  slots: ShipSlot[]
}
```

获取已安装模块：

```ts
export function getInstalledModules(slots: ShipSlot[]): ShipModule[] {
  return slots
    .filter(slot => slot.unlocked && slot.module)
    .map(slot => slot.module!)
}
```

---

## 二十一、最终属性计算

### 1. 计算时机

```txt
开始新一局时计算初始属性。
每次安装、替换模块后重新计算属性预览。
每次进入下一关前重新计算最终属性。
```

### 2. 计算规则

```ts
export function calculateFinalStats(
  baseStats: PlayerStats,
  modules: ShipModule[],
  currentHp: number
): PlayerStats {
  const finalStats = structuredClone(baseStats)

  for (const module of modules) {
    for (const effect of module.effects) {
      applyModuleEffect(finalStats, effect)
    }
  }

  clampPlayerStats(finalStats)

  finalStats.hp = Math.min(currentHp, finalStats.maxHp)
  finalStats.shield = finalStats.maxShield

  return finalStats
}
```

### 3. 百分比效果处理

```txt
damage_percent：影响 damage
fire_rate_percent：影响 fireRate
bullet_speed_percent：影响 bulletSpeed
move_speed_percent：影响 moveSpeed
money_bonus_percent：影响 moneyBonus
```

---

## 二十二、关卡结算系统

### 1. 结算触发

```txt
普通关卡倒计时结束
Boss 被击败
玩家生命归零且没有可用复活效果
```

### 2. 普通关卡结算内容

```txt
本关名称
本关击杀数量
本关击杀金钱
本关完成奖励
当前总金钱
剩余生命
当前飞船插槽
当前已安装模块
强化模块三选一
购买插槽按钮
进入下一关按钮
```

### 3. Boss 关结算内容

```txt
通关结果
总击杀数
总获得金钱
最终飞船模块构筑
最终存活时间
最远到达关卡
重新开始按钮
返回首页按钮
```

### 4. 失败结算内容

```txt
失败提示
失败所在关卡
总击杀数
总获得金钱
最终飞船模块构筑
最终存活时间
重新开始按钮
返回首页按钮
```

---

## 二十三、场景设计

### 1. BootScene

职责：

```txt
初始化游戏配置
设置屏幕适配
注册全局事件
进入 PreloadScene
```

### 2. PreloadScene

职责：

```txt
加载图片
加载 TileSprite 背景无缝贴图
加载音频
加载 JSON 配置
显示加载进度条
加载完成后进入 MenuScene
```

### 3. MenuScene

内容：

```txt
游戏标题
开始游戏按钮
通关次数
失败次数
最长存活时间
最远到达关卡
基础设置按钮
```

基础设置：

```txt
音乐开关
音效开关
震动开关
```

### 4. GameScene

职责：

```txt
创建 TileSprite 宇宙背景
创建玩家飞船
创建 HUD
初始化对象池
初始化背景滚动系统
初始化敌人生成器
初始化敌人攻击系统
初始化碰撞系统
初始化关卡系统
初始化 Boss 系统
运行主游戏循环
处理关卡完成
处理玩家死亡
处理暂停与恢复
```

### 5. PauseScene

职责：

```txt
暂停战斗逻辑
显示继续游戏按钮
显示返回首页按钮
显示设置按钮
```

### 6. StageResultScene

职责：

```txt
展示当前关卡结果
计算本关金钱奖励
显示模块三选一
显示飞船插槽
处理模块选择
处理模块安装
处理模块替换
处理插槽购买
进入下一关
```

### 7. GameResultScene

职责：

```txt
展示胜利或失败
展示最终关卡
展示总击杀数量
展示总获得金钱
展示最终存活时间
展示最终飞船构筑
保存本地统计
支持重新开始
支持返回首页
```

---

## 二十四、HUD 设计

### 1. 战斗 HUD 显示内容

```txt
玩家生命条
玩家护盾条
当前关卡
当前金钱
普通关卡剩余时间
Boss 血条
暂停按钮
```

### 2. HUD 布局

```txt
顶部：生命、护盾、关卡、时间
右上角：暂停按钮
底部：当前金钱
Boss 出现时：顶部额外显示 Boss 血条
```

---

## 二十五、结算界面设计

### 1. 普通关卡结算界面

```txt
顶部：关卡完成提示

左侧：
- 本关击杀
- 本关击杀金钱
- 本关完成奖励
- 当前总金钱
- 剩余生命

中间：
- 3 张强化模块卡片

右侧：
- 飞船插槽列表
- 已安装模块
- 未解锁插槽
- 插槽购买按钮

底部：
- 进入下一关
- 返回首页
```

### 2. 模块卡片内容

```txt
模块名称
模块分类
模块稀有度
模块效果描述
模块图标
选择按钮
```

### 3. 插槽显示内容

```txt
插槽编号
是否解锁
当前安装模块
模块稀有度
模块效果
替换按钮
购买按钮
```

### 4. 进入下一关按钮规则

```txt
玩家未选择模块时，不能进入下一关。
玩家已选择模块但未安装时，不能进入下一关。
玩家完成模块安装后，才允许进入下一关。
```

---

## 二十六、碰撞系统

需要处理的碰撞：

| 碰撞双方 | 结果 |
|---|---|
| 玩家子弹 vs 普通敌人 | 敌人扣血，子弹消失 |
| 玩家子弹 vs Boss | Boss 扣血，子弹消失 |
| 普通敌人 vs 玩家 | 玩家受到碰撞伤害，敌人消失 |
| 敌人子弹 vs 玩家 | 玩家受到子弹伤害，敌人子弹消失 |
| 玩家护盾 > 0 时受到伤害 | 优先扣除护盾 |
| 玩家护盾不足以抵消伤害 | 剩余伤害扣除生命 |
| 玩家处于无敌时间 | 忽略本次伤害 |

碰撞系统只负责检测碰撞并派发事件，具体伤害计算由 DamageSystem 处理。

---

## 二十七、对象池系统

MVP 必须对以下对象使用对象池：

```txt
玩家子弹
敌人子弹
普通敌人
爆炸特效
```

对象池接口：

```ts
export interface Poolable {
  active: boolean
  spawn(x: number, y: number, data?: unknown): void
  despawn(): void
}
```

对象池基础实现：

```ts
export class ObjectPool<T extends Poolable> {
  private items: T[] = []

  constructor(
    private createItem: () => T,
    private initialSize: number
  ) {
    for (let i = 0; i < initialSize; i++) {
      this.items.push(this.createItem())
    }
  }

  get(): T {
    const item = this.items.find(i => !i.active)

    if (item) {
      return item
    }

    const newItem = this.createItem()
    this.items.push(newItem)
    return newItem
  }

  release(item: T) {
    item.despawn()
  }
}
```

规则：

```txt
ObjectPool.get() 只负责取出可用对象。
对象激活必须由 spawn() 完成。
对象回收必须由 despawn() 完成。
spawn() 内部设置 active = true。
despawn() 内部设置 active = false，并隐藏对象、关闭碰撞体。
```

---

## 二十八、运行数据结构

```ts
export interface RunState {
  currentStageIndex: number

  money: number
  totalKills: number
  totalMoneyEarned: number
  survivalTime: number

  isPaused: boolean
  isGameOver: boolean
  isStageCleared: boolean
  isBossActive: boolean

  shipSlots: ShipSlot[]

  reviveChargesUsed: Record<string, number>
}
```

单局数据只存在于内存中。

```txt
刷新页面会结束当前单局。
关闭页面会结束当前单局。
返回首页会结束当前单局。
MVP 不保存进行中的单局进度。
```

---

## 二十九、本地存档系统

### 1. localStorage Key

```txt
space_roguelike_save_v1
```

### 2. 存档结构

```ts
export interface SaveData {
  version: number

  clearCount: number
  deathCount: number
  totalRuns: number
  totalKills: number
  bestSurvivalTime: number
  bestStageReached: number

  settings: {
    musicEnabled: boolean
    sfxEnabled: boolean
    vibrationEnabled: boolean
  }
}
```

### 3. 存档触发时机

```txt
游戏胜利
游戏失败
通关次数变化
失败次数变化
最长存活时间变化
最远到达关卡变化
修改设置
```

### 4. 存档兼容

```txt
读取存档时检查 version。
如果没有存档，则创建默认存档。
如果存档损坏，则忽略旧数据并创建默认存档。
```

---


## 三十、Phaser TileSprite 背景系统

MVP 的战斗背景必须使用 **Phaser TileSprite** 实现，不使用一张超长背景图向下滚动。

TileSprite 的作用是用一张较小的无缝贴图重复铺满指定区域，并通过修改 `tilePositionX`、`tilePositionY` 和 `tileScale` 产生滚动效果。背景对象本身只需要保持与游戏视口相同大小，不允许为了模拟滚动创建远大于画布的图片。

---

### 1. 背景实现目标

```txt
使用 2 到 3 层 TileSprite 组合出深邃宇宙背景
通过不同滚动速度制造纵向飞行感
通过玩家移动方向制造轻微横向相对位移
背景不能参与碰撞
背景不能遮挡玩家、敌人、子弹和 HUD
背景尺寸始终跟随当前游戏视口
```

MVP 推荐使用三层背景：

| 层级 | 文件名 | 作用 | 透明背景 | 滚动速度 |
|---|---|---|---|---:|
| 远景层 | bg_star_tile_far_01.png | 深色星空底层 | 否 | 慢 |
| 中景层 | bg_nebula_tile_mid_01.png | 星云与空间雾气 | 可选 | 中 |
| 近景层 | bg_dust_tile_near_01.png | 近景星尘和速度感 | 是 | 快 |

---

### 2. 背景资源技术要求

```txt
背景 TileSprite 纹理必须是无缝可平铺贴图。
推荐尺寸为 512x512。
允许使用 1024x1024，但不建议更大。
优先使用 2 的幂尺寸，例如 256、512、1024。
贴图边缘不能出现明显接缝。
贴图中不能包含飞船、敌人、子弹、文字、UI、Logo。
远景层整体亮度必须偏低，避免影响子弹识别。
近景层星点数量不能过密，避免造成视觉噪音。
```

背景资源路径：

```txt
public/assets/images/backgrounds/bg_star_tile_far_01.png
public/assets/images/backgrounds/bg_nebula_tile_mid_01.png
public/assets/images/backgrounds/bg_dust_tile_near_01.png
```

---

### 3. BackgroundSystem 职责

新增 `BackgroundSystem.ts`，专门管理背景创建、滚动和视口变化。

职责：

```txt
创建 TileSprite 背景层
设置背景层级 depth
根据 delta 推进纵向滚动
根据玩家移动产生轻微横向视差
根据窗口尺寸变化重新设置 TileSprite 尺寸和位置
暂停状态下停止背景滚动
销毁 Scene 时释放引用
```

`BackgroundSystem` 不负责：

```txt
不负责加载资源
不负责创建玩家
不参与碰撞检测
不保存任何运行进度
不直接读取模块和关卡数据
```

---

### 4. 背景层级规则

```txt
背景层 depth 必须小于所有战斗对象。
远景层 depth = -300。
中景层 depth = -290。
近景层 depth = -280。
玩家、敌人、子弹、爆炸特效 depth 必须大于 0。
HUD depth 必须大于 1000。
```

推荐显示顺序：

```txt
远景星空 TileSprite
  ↓
中景星云 TileSprite
  ↓
近景星尘 TileSprite
  ↓
玩家 / 敌人 / 子弹
  ↓
爆炸特效
  ↓
HUD
```

---

### 5. 背景滚动规则

MVP 背景采用持续向下滚动，表达飞船向前飞行的感觉。

```txt
远景星空层：每秒 12 像素
中景星云层：每秒 24 像素
近景星尘层：每秒 56 像素
```

当玩家横向移动时，背景产生轻微反向位移：

```txt
远景层横向视差系数：0.02
中景层横向视差系数：0.04
近景层横向视差系数：0.08
```

当玩家纵向移动时，背景滚动速度可以轻微变化：

```txt
玩家向上移动时，近景层滚动速度略微增加。
玩家向下移动时，近景层滚动速度略微降低。
变化只用于视觉反馈，不影响实际关卡时间和敌人移动速度。
```

MVP 中不要让背景滚动速度参与任何战斗计算。

---

### 6. TypeScript 数据结构

```ts
export interface BackgroundLayerConfig {
  key: string
  depth: number
  alpha: number
  tileScale: number
  scrollSpeedY: number
  parallaxX: number
  parallaxY: number
}
```

推荐配置：

```ts
export const BACKGROUND_LAYERS: BackgroundLayerConfig[] = [
  {
    key: 'bg_star_tile_far_01',
    depth: -300,
    alpha: 1,
    tileScale: 1,
    scrollSpeedY: 12,
    parallaxX: 0.02,
    parallaxY: 0.01,
  },
  {
    key: 'bg_nebula_tile_mid_01',
    depth: -290,
    alpha: 0.55,
    tileScale: 1.15,
    scrollSpeedY: 24,
    parallaxX: 0.04,
    parallaxY: 0.02,
  },
  {
    key: 'bg_dust_tile_near_01',
    depth: -280,
    alpha: 0.45,
    tileScale: 1,
    scrollSpeedY: 56,
    parallaxX: 0.08,
    parallaxY: 0.04,
  },
]
```

---

### 7. BackgroundSystem 示例代码

```ts
import Phaser from 'phaser'
import { BACKGROUND_LAYERS, type BackgroundLayerConfig } from '../data/backgroundLayers'

interface RuntimeBackgroundLayer {
  config: BackgroundLayerConfig
  sprite: Phaser.GameObjects.TileSprite
}

export class BackgroundSystem {
  private readonly scene: Phaser.Scene
  private readonly layers: RuntimeBackgroundLayer[] = []
  private lastPlayerX = 0
  private lastPlayerY = 0
  private paused = false

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  create(initialPlayerX: number, initialPlayerY: number): void {
    const { width, height } = this.scene.scale

    for (const config of BACKGROUND_LAYERS) {
      const sprite = this.scene.add
        .tileSprite(width / 2, height / 2, width, height, config.key)
        .setOrigin(0.5, 0.5)
        .setDepth(config.depth)
        .setAlpha(config.alpha)
        .setTileScale(config.tileScale, config.tileScale)
        .setScrollFactor(0)

      this.layers.push({ config, sprite })
    }

    this.lastPlayerX = initialPlayerX
    this.lastPlayerY = initialPlayerY
  }

  update(deltaMs: number, playerX: number, playerY: number): void {
    if (this.paused) return

    const deltaSeconds = deltaMs / 1000
    const playerDeltaX = playerX - this.lastPlayerX
    const playerDeltaY = playerY - this.lastPlayerY

    for (const layer of this.layers) {
      const { sprite, config } = layer

      sprite.tilePositionY -= config.scrollSpeedY * deltaSeconds
      sprite.tilePositionX += playerDeltaX * config.parallaxX
      sprite.tilePositionY += playerDeltaY * config.parallaxY
    }

    this.lastPlayerX = playerX
    this.lastPlayerY = playerY
  }

  resize(width: number, height: number): void {
    for (const layer of this.layers) {
      layer.sprite.setPosition(width / 2, height / 2)
      layer.sprite.setSize(width, height)
    }
  }

  setPaused(paused: boolean): void {
    this.paused = paused
  }

  destroy(): void {
    for (const layer of this.layers) {
      layer.sprite.destroy()
    }

    this.layers.length = 0
  }
}
```

说明：

```txt
如果实际运行时背景横向移动方向与预期相反，只需要调整 playerDeltaX 的正负号。
背景视差只用于视觉表现，不影响玩家真实坐标。
resize 时只改变 TileSprite 显示区域，不重新加载图片。
```

---

### 8. GameScene 接入方式

`GameScene` 中应在创建玩家之前创建背景，确保背景位于最底层。

```ts
export class GameScene extends Phaser.Scene {
  private backgroundSystem!: BackgroundSystem
  private player!: PlayerShip

  create(): void {
    this.player = new PlayerShip(this, this.scale.width / 2, this.scale.height - 160)

    this.backgroundSystem = new BackgroundSystem(this)
    this.backgroundSystem.create(this.player.x, this.player.y)

    this.createPools()
    this.createSystems()
    this.createCollisions()
    this.createHud()

    this.scale.on('resize', this.handleResize, this)
  }

  update(_time: number, delta: number): void {
    if (this.isPaused()) return

    this.player.update(delta)
    this.backgroundSystem.update(delta, this.player.x, this.player.y)

    this.updateCombatSystems(delta)
  }

  private handleResize(gameSize: Phaser.Structs.Size): void {
    this.backgroundSystem.resize(gameSize.width, gameSize.height)
  }

  shutdown(): void {
    this.scale.off('resize', this.handleResize, this)
    this.backgroundSystem.destroy()
  }
}
```

注意：

```txt
背景系统可以在玩家之前创建，但如果需要读取玩家初始坐标，则需要先创建玩家再创建背景。
无论创建顺序如何，必须通过 depth 确保背景在最底层。
暂停时必须停止 backgroundSystem.update。
```

---

### 9. PreloadScene 加载要求

```ts
this.load.image('bg_star_tile_far_01', 'assets/images/backgrounds/bg_star_tile_far_01.png')
this.load.image('bg_nebula_tile_mid_01', 'assets/images/backgrounds/bg_nebula_tile_mid_01.png')
this.load.image('bg_dust_tile_near_01', 'assets/images/backgrounds/bg_dust_tile_near_01.png')
```

加载要求：

```txt
背景贴图必须在进入 GameScene 前加载完成。
任意背景贴图加载失败时，允许降级为纯黑色背景。
降级时不阻塞核心战斗流程。
```

---

### 10. TileSprite 背景验收标准

```txt
进入 GameScene 后，背景完整铺满游戏视口。
背景连续滚动 3 分钟后不能看到明显接缝。
玩家横向移动时，背景产生轻微反向相对移动。
背景不会遮挡玩家、敌人、子弹、爆炸和 HUD。
暂停游戏时，背景滚动停止。
恢复游戏时，背景继续滚动。
浏览器窗口尺寸变化后，背景仍然铺满视口。
移动端运行时背景不引发明显卡顿。
背景层不会创建超出画布尺寸的大型长图对象。
```

---

## 三十一、美术资源、贴图规范与生成 Prompt

本章节定义 MVP 版本必须准备的贴图资源、贴图格式、尺寸规范、文件命名规则，以及可直接用于 AI 生成图片的 Prompt。

MVP 美术目标不是追求完整商业品质，而是保证所有核心玩法对象都有清晰可识别的贴图，能够支撑一局完整游戏体验。

---

### 1. 贴图生成工具与制作原则

本项目的正式美术贴图，明确采用 **GPT Image 2 Model** 或同等级的 **ChatGPT 图像创建能力** 作为主要生成手段。

使用原则：

```txt
玩家飞船、敌机、Boss、子弹、爆炸、背景、UI 底图、模块图标，默认优先使用 GPT Image 2 Model 生成。
如果交付环境中不直接显示 “GPT Image 2 Model” 名称，但提供等效的 ChatGPT 图像生成能力，则允许使用该能力，输出要求必须保持一致。
最终交付资源必须符合本章节定义的尺寸、透明背景、命名、无缝平铺和可读性要求。
AI 生成结果不是直接无条件入库，必须经过人工筛选、裁切、缩放、透明背景检查和游戏内验收。
同一批资源应尽量使用统一的 Prompt 结构，以保持整体美术风格一致。
对于同系列资源，建议先定稿玩家飞船，再基于相同视觉语言生成敌机、Boss 与模块图标。
背景 TileSprite 纹理必须明确要求 “seamless / tileable / repeating texture”。
透明背景资源必须明确要求 “transparent background / isolated object”。
```

贴图风格目标：

```txt
整体方向：科幻感、现实风格、硬表面金属质感、能量发光细节、适合太空飞船弹幕游戏
风格定义：偏现实风格的 2D 游戏贴图，不做卡通风，不做 Q 版，不做照片拼贴
可读性要求：即使采用现实风格，也必须优先保证小尺寸下的识别性
移动端要求：缩放到手机端显示尺寸后，主体轮廓、朝向和敌我区分必须清楚
```

### 2. MVP 贴图总体风格

```txt
题材方向：宇宙飞船、太空战争、Roguelike 弹幕
画面风格：2D 科幻现实风格、暗色宇宙背景、硬表面金属质感、适度能量发光、高对比清晰剪影
视角要求：竖屏弹幕游戏视角，飞船与敌机使用俯视或轻微俯视角
美术复杂度：中高细节，偏现实风格，但必须优先服务游戏内识别性，不做卡通化，不做照片拼贴
识别要求：玩家、敌人、Boss、子弹、模块图标必须一眼可区分
移动端要求：缩小到手机屏幕尺寸后仍然能识别主体轮廓
```

MVP 贴图应遵守以下原则：

```txt
战斗单位贴图优先保证轮廓清楚
子弹贴图优先保证颜色和形状清楚
模块图标优先保证类别识别清楚
UI 底图优先保证文字可读性
背景层不能抢占前景战斗对象的视觉注意力
```

---

### 3. 通用贴图技术要求

| 项目 | 要求 |
|---|---|
| 图片格式 | PNG |
| 色彩模式 | sRGB |
| 透明背景 | 飞船、敌人、Boss、子弹、爆炸、模块图标必须透明背景 |
| 背景 TileSprite 纹理 | 允许不透明；星尘/星云叠加层可使用透明 PNG |
| UI 底图 | 可透明或半透明 |
| 文件名 | 小写英文 + 下划线 |
| 单体贴图主体位置 | 居中 |
| 单体贴图留白 | 四周保留 8% 到 15% 安全边距 |
| 默认锚点 | 中心点 |
| 图片内容 | 不允许包含文字、水印、Logo、签名 |
| 生成方式 | 默认使用 GPT Image 2 Model 或等效 ChatGPT 图像创建能力生成，生成后允许人工裁切和尺寸整理，但不得改变核心风格 |
| 方向 | 玩家飞船朝上，敌人和 Boss 默认朝下 |
| 光效 | 允许轻微发光，不允许大面积强光污染 |
```

生成图片时建议先生成较大尺寸，再缩放到游戏实际尺寸。

```txt
单体单位贴图：建议先生成 1024x1024，再裁切缩放
模块图标：建议先生成 1024x1024，再裁切缩放
背景 TileSprite 纹理：建议生成 512x512 或 1024x1024 正方形无缝贴图，优先使用 2 的幂尺寸
爆炸特效：建议生成单帧后手工或工具制作序列帧，也可以直接生成 Sprite Sheet
```

---

### 4. MVP 必须贴图清单

| 类别 | 资源 | 数量 | 文件名 | 游戏内建议尺寸 | 透明背景 |
|---|---|---:|---|---:|---|
| 玩家 | 玩家飞船 | 1 | player_ship_01.png | 128x128 | 是 |
| 敌人 | 小型敌机 | 1 | enemy_small_01.png | 64x64 | 是 |
| 敌人 | 快速敌机 | 1 | enemy_fast_01.png | 64x64 | 是 |
| 敌人 | 重型敌机 | 1 | enemy_heavy_01.png | 96x96 | 是 |
| Boss | Boss 母舰 | 1 | boss_carrier_01.png | 512x512 | 是 |
| 子弹 | 玩家子弹 | 1 | bullet_player_01.png | 32x32 | 是 |
| 子弹 | 敌人子弹 | 1 | bullet_enemy_01.png | 32x32 | 是 |
| 背景 | 远景星空无缝贴图 | 1 | bg_star_tile_far_01.png | 512x512 | 否 |
| 背景 | 中景星云无缝贴图 | 1 | bg_nebula_tile_mid_01.png | 512x512 | 可选 |
| 背景 | 近景星尘无缝贴图 | 1 | bg_dust_tile_near_01.png | 512x512 | 建议是 |
| 特效 | 爆炸序列帧 | 1 组 | effect_explosion_01.png | 512x512 | 是 |
| UI | 按钮底图 | 1 | ui_button_01.png | 256x96 | 建议是 |
| UI | 模块卡片底图 | 1 | ui_module_card_01.png | 360x520 | 建议是 |
| UI | 插槽底图 | 1 | ui_slot_01.png | 128x128 | 建议是 |
| 图标 | 金钱图标 | 1 | icon_money_01.png | 64x64 | 是 |
| 图标 | 生命图标 | 1 | icon_hp_01.png | 64x64 | 是 |
| 图标 | 护盾图标 | 1 | icon_shield_01.png | 64x64 | 是 |
| 模块 | 模块图标 | 17 | module_xxx.png | 96x96 | 是 |

---

### 5. 模块图标文件清单

模块图标需要与模块数据 ID 一一对应。

| 模块 ID | 名称 | 文件名 | 视觉关键词 |
|---|---|---|---|
| weapon_laser_1 | 轻型激光炮 | module_weapon_laser_1.png | 蓝白激光炮口 |
| weapon_fast_1 | 速射炮管 | module_weapon_fast_1.png | 多管速射炮 |
| weapon_double_1 | 双联炮 | module_weapon_double_1.png | 双联武器组件 |
| weapon_spread_1 | 散射炮口 | module_weapon_spread_1.png | 扇形分流炮口 |
| weapon_railgun_1 | 轨道炮 | module_weapon_railgun_1.png | 电磁轨道炮 |
| reactor_small_1 | 小型反应炉 | module_reactor_small_1.png | 小型能量核心 |
| reactor_power_1 | 高能反应炉 | module_reactor_power_1.png | 高亮反应堆 |
| reactor_engine_1 | 推进反应炉 | module_reactor_engine_1.png | 推进器核心 |
| reactor_overload_1 | 过载反应炉 | module_reactor_overload_1.png | 红橙过载核心 |
| shield_basic_1 | 护盾发生器 | module_shield_basic_1.png | 蓝色护盾核心 |
| shield_regen_1 | 再生护盾 | module_shield_regen_1.png | 环形再生护盾 |
| shield_heavy_1 | 重型护盾 | module_shield_heavy_1.png | 厚重防御装甲 |
| shield_burst_1 | 爆裂护盾 | module_shield_burst_1.png | 破裂能量护盾 |
| utility_engine_1 | 推进器强化 | module_utility_engine_1.png | 小型推进喷口 |
| utility_radar_1 | 战利品雷达 | module_utility_radar_1.png | 扫描雷达盘 |
| utility_repair_1 | 自动维修装置 | module_utility_repair_1.png | 机械维修臂 |
| utility_core_1 | 备用核心 | module_utility_core_1.png | 备用生命核心 |

---

### 6. 贴图尺寸与碰撞范围

| 对象 | 图片尺寸 | 推荐显示尺寸 | 推荐碰撞范围 |
|---|---:|---:|---:|
| 玩家飞船 | 128x128 | 72x72 到 88x88 | 主体宽高的 55% 到 65% |
| 小型敌机 | 64x64 | 48x48 到 56x56 | 主体宽高的 70% |
| 快速敌机 | 64x64 | 44x44 到 52x52 | 主体宽高的 65% |
| 重型敌机 | 96x96 | 72x72 到 88x88 | 主体宽高的 70% |
| Boss | 512x512 | 260x180 到 360x240 | 主体宽高的 75% |
| 玩家子弹 | 32x32 | 12x24 到 18x32 | 主体宽高的 80% |
| 敌人子弹 | 32x32 | 14x14 到 24x24 | 主体宽高的 80% |
```

碰撞体不应直接使用完整贴图矩形，应根据主体轮廓缩小。

```txt
玩家碰撞范围要小于视觉贴图，避免移动端体验过于苛刻。
Boss 碰撞范围可以略大，但不能覆盖透明区域。
子弹碰撞范围以核心亮点区域为准，不计算外层光晕。
```

---

### 7. Sprite Sheet 要求

MVP 只强制爆炸效果使用 Sprite Sheet。

```txt
文件名：effect_explosion_01.png
推荐尺寸：512x512
帧排列：4 列 x 4 行
总帧数：16 帧
单帧尺寸：128x128
背景：透明
播放方式：非循环
播放速度：18 到 24 FPS
播放结束后回收到对象池
```

爆炸效果要求：

```txt
第 1 到 3 帧：亮点膨胀
第 4 到 8 帧：主爆炸扩散
第 9 到 12 帧：火光和碎片散开
第 13 到 16 帧：光效消散
```

玩家飞船、敌人、Boss 在 MVP 中不要求序列帧动画，可以使用静态 PNG，通过代码实现轻微浮动、受击闪烁、缩放和透明度变化。

---

### 8. Texture Atlas 要求

MVP 初期允许直接加载独立 PNG。

当贴图数量稳定后，建议将以下资源合并为 Texture Atlas：

```txt
玩家飞船
普通敌人
玩家子弹
敌人子弹
模块图标
UI 图标
```

MVP 不强制合并 Boss、背景 TileSprite 纹理和爆炸 Sprite Sheet。

```txt
Boss 可以独立加载。
背景 TileSprite 纹理必须独立加载，不放入 Texture Atlas。
爆炸 Sprite Sheet 可以独立加载。
```

---

### 9. Prompt 通用规则

以下 Prompt 默认用于 GPT Image 2 Model 或同等级的 ChatGPT 图像创建能力来生成 MVP 贴图。生成时需要根据资源类型选择是否透明背景，并在生成后进行人工筛选与简单后处理。

通用正向描述：

```txt
2D game asset, vertical space shooter, roguelike bullet hell game, dark sci-fi semi-realistic style, realistic hard-surface spacecraft design, metallic material feeling, clean silhouette, high contrast, readable at small size, centered composition, polished mobile game asset, no text, no logo, no watermark
```

通用透明背景要求：

```txt
transparent background, isolated object, centered, full object visible, no shadow outside the object, no environment, no border
```

通用负向描述：

```txt
text, letters, numbers, logo, watermark, signature, realistic photograph, cartoon style, cute style, human pilot, cockpit interior, messy background, cropped object, multiple objects, low contrast, blurry shape, overexposed glow, excessive particles, UI text
```

战斗单位通用补充：

```txt
top-down view or slight top-down view, front nose direction clearly visible, symmetrical design, readable silhouette, compact shape, suitable for arcade shooter gameplay
```

模块图标通用补充：

```txt
single equipment module icon, compact sci-fi component, square icon composition, transparent background, centered object, readable silhouette, game item icon, no frame, no text
```

---

补充要求：

```txt
若同一资源需要多次生成迭代，优先保持主体结构与颜色体系稳定，再微调细节。
玩家飞船、敌机、Boss 建议使用统一的材质语言：深灰金属装甲 + 蓝色玩家能量体系 + 红橙敌方能量体系。
模块图标建议延续飞船世界观中的硬表面科技部件风格。
如平台支持基于参考图继续生成，可将已定稿的玩家飞船或敌机作为参考，以保持系列一致性。
```

### 10. 玩家与敌人贴图生成 Prompt

#### 9.1 玩家飞船 `player_ship_01.png`

```txt
2D game asset, player spaceship for a vertical roguelike bullet hell game, dark sci-fi style, top-down view, nose pointing upward, sleek compact fighter ship, blue-white energy core, subtle cyan engine glow, clean sharp silhouette, symmetrical design, readable at small mobile size, polished arcade shooter sprite, centered composition, transparent background, isolated object, full object visible, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, signature, background, planet, stars, cockpit interior, human pilot, cropped wings, blurry shape, overexposed glow, excessive particles, multiple ships
```

#### 9.2 小型敌机 `enemy_small_01.png`

```txt
2D game asset, small enemy drone spaceship for a vertical space shooter, dark sci-fi style, top-down view, nose pointing downward, compact hostile drone, red-orange energy light, angular armor plates, simple readable silhouette, weaker enemy look, centered composition, transparent background, isolated object, full object visible, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, player-like blue color scheme, human pilot, oversized weapon, cropped object, blurry shape, excessive glow, multiple ships
```

#### 9.3 快速敌机 `enemy_fast_01.png`

```txt
2D game asset, fast enemy interceptor spaceship for a vertical bullet hell game, dark sci-fi style, top-down view, nose pointing downward, slim aerodynamic shape, narrow wings, aggressive red energy accents, lightweight fast silhouette, sharp triangular profile, readable at small size, centered composition, transparent background, isolated object, full object visible, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, bulky shape, player-like blue color scheme, human pilot, cropped object, blurry edges, excessive particles, multiple ships
```

#### 9.4 重型敌机 `enemy_heavy_01.png`

```txt
2D game asset, heavy enemy gunship for a vertical space shooter, dark sci-fi style, top-down view, nose pointing downward, bulky armored spacecraft, wide body, visible cannon pods, red and amber hostile lights, strong durable silhouette, slower heavy enemy look, centered composition, transparent background, isolated object, full object visible, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, tiny drone shape, player-like blue color scheme, human pilot, cropped object, blurry shape, excessive glow, multiple ships
```

#### 9.5 Boss 母舰 `boss_carrier_01.png`

```txt
2D game asset, massive boss carrier spaceship for a vertical roguelike bullet hell game, dark sci-fi style, top-down view, nose pointing downward, large symmetrical capital ship, layered armor plates, multiple weapon ports, red energy cores, ominous hostile presence, readable silhouette, suitable as final boss sprite, centered composition, transparent background, isolated object, full object visible, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, planet, stars, human pilot, cockpit view, cropped ship, blurry shape, excessive glow covering silhouette, multiple ships, UI frame
```

---

### 11. 子弹与特效贴图生成 Prompt

#### 10.1 玩家子弹 `bullet_player_01.png`

```txt
2D game asset, player bullet projectile for a vertical space shooter, small blue-white energy bolt, vertical oval laser shot, bright core with subtle cyan glow, clear readable shape, centered composition, transparent background, isolated object, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, explosion, missile, huge object, excessive glow, blurry projectile, multiple bullets
```

#### 10.2 敌人子弹 `bullet_enemy_01.png`

```txt
2D game asset, enemy bullet projectile for a vertical bullet hell game, small red-orange plasma orb, bright hostile core with subtle glow, circular readable shape, centered composition, transparent background, isolated object, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, explosion, missile, blue player color, huge object, excessive glow, blurry projectile, multiple bullets
```

#### 10.3 爆炸序列帧 `effect_explosion_01.png`

```txt
2D sprite sheet, explosion effect for a space shooter game, 16 frames, 4 columns and 4 rows, transparent background, orange yellow energy explosion, starts from small flash, expands into fire burst, fades into sparks and smoke, clean frame separation, centered explosion in every frame, game VFX sprite sheet, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, single frame only, irregular grid, cropped explosion, realistic photograph, excessive smoke covering all frames, blurry frames
```

---

### 12. 背景与 UI 贴图生成 Prompt

#### 11.1 远景星空无缝贴图 `bg_star_tile_far_01.png`

```txt
seamless tileable 2D space background texture for Phaser TileSprite, square 512x512, power of two texture, dark deep space starfield, sparse distant stars, very low brightness, subtle blue black tone, no visible seams, edges match perfectly horizontally and vertically, clean background layer for vertical bullet hell game, not distracting, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, spaceship, enemies, bullets, planets, UI, bright center object, large nebula, obvious border, visible seam, noisy stars, overexposed glow, non-tileable edges
```

#### 11.2 中景星云无缝贴图 `bg_nebula_tile_mid_01.png`

```txt
seamless tileable 2D nebula texture for Phaser TileSprite, square 512x512, power of two texture, dark sci-fi space nebula, faint blue purple gas clouds, soft atmospheric depth, low contrast, no visible seams, edges match perfectly horizontally and vertically, suitable as a semi-transparent parallax background layer, no ships, no bullets, no UI, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, spaceship, enemies, bullets, planet, bright sun, high contrast center, obvious border, visible seam, noisy details, overexposed glow, non-tileable edges
```

#### 11.3 近景星尘无缝贴图 `bg_dust_tile_near_01.png`

```txt
seamless tileable 2D star dust overlay texture for Phaser TileSprite, square 512x512, power of two texture, sparse small star particles and tiny space dust streaks, transparent background preferred, subtle cyan white particles, clean readable overlay, no visible seams, edges match perfectly horizontally and vertically, suitable for fast parallax movement in a vertical space shooter, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, spaceship, enemies, bullets, planet, dense snow-like particles, large bright objects, obvious border, visible seam, noisy clutter, excessive glow, non-tileable edges
```

#### 11.4 按钮底图 `ui_button_01.png`

```txt
2D sci-fi UI button background, dark metallic panel, subtle cyan edge glow, rounded rectangle shape, transparent background, no text, no icon, clean mobile game UI asset, centered, polished, readable, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background scene, complex decoration, heavy glow, dirty texture, button label, cropped object
```

#### 11.5 模块卡片底图 `ui_module_card_01.png`

```txt
2D sci-fi module card background for a roguelike upgrade selection screen, vertical rounded rectangle card, dark translucent metallic glass panel, subtle blue cyan border glow, empty center area for icon and text, no text, no icon, transparent background, clean mobile game UI asset, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, character, spaceship, background scene, too many decorations, heavy glow, filled text areas, cropped card
```

#### 11.6 插槽底图 `ui_slot_01.png`

```txt
2D sci-fi equipment slot background, square socket frame, dark metallic material, subtle cyan inner glow, empty center, transparent background, no text, no icon, clean game UI asset, centered, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, item inside the slot, complex background, overexposed glow, cropped frame, multiple slots
```

#### 11.7 金钱图标 `icon_money_01.png`

```txt
2D game icon, futuristic space coin or credit token, gold metallic coin with subtle sci-fi circuit pattern, readable at small size, centered composition, transparent background, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, pile of coins, realistic photo, cropped coin, blurry icon
```

#### 11.8 生命图标 `icon_hp_01.png`

```txt
2D game icon, spaceship hull integrity health icon, red medical energy core with subtle heart-like shield shape, sci-fi style, readable at small size, centered composition, transparent background, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, realistic heart organ, human body, cropped icon, blurry shape
```

#### 11.9 护盾图标 `icon_shield_01.png`

```txt
2D game icon, sci-fi energy shield icon, blue hexagonal shield shape, glowing protective barrier, readable at small size, centered composition, transparent background, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, medieval shield, realistic photo, cropped icon, blurry shape, excessive glow
```

---

### 13. 模块图标生成 Prompt

#### 12.1 轻型激光炮 `module_weapon_laser_1.png`

```txt
2D game item icon, light laser cannon module for a spaceship, compact blue-white laser emitter, dark sci-fi metal, clean silhouette, square icon composition, centered, transparent background, isolated object, no frame, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, full spaceship, human, multiple objects, cropped object, blurry icon, excessive glow
```

#### 12.2 速射炮管 `module_weapon_fast_1.png`

```txt
2D game item icon, rapid fire cannon barrel module for a spaceship, small multi-barrel rotary gun component, dark metal with cyan highlights, compact sci-fi weapon part, readable silhouette, centered, transparent background, isolated object, no frame, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, full spaceship, realistic firearm, human, cropped object, blurry icon, excessive glow
```

#### 12.3 双联炮 `module_weapon_double_1.png`

```txt
2D game item icon, twin cannon module for a spaceship, two parallel energy barrels, dark sci-fi metal, blue energy lines, compact upgrade component, readable silhouette, centered, transparent background, isolated object, no frame, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, full spaceship, handheld gun, human, cropped object, blurry icon, excessive particles
```

#### 12.4 散射炮口 `module_weapon_spread_1.png`

```txt
2D game item icon, spread shot muzzle module for a spaceship, fan-shaped triple energy emitter, dark metal, cyan split-beam glow, compact sci-fi component, readable silhouette, centered, transparent background, isolated object, no frame, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, full spaceship, random weapons, cropped object, blurry icon, excessive glow
```

#### 12.5 轨道炮 `module_weapon_railgun_1.png`

```txt
2D game item icon, electromagnetic railgun module for a spaceship, long compact rail weapon component, dark gunmetal, electric blue arcs, powerful epic upgrade look, clean silhouette, centered, transparent background, isolated object, no frame, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, full spaceship, modern rifle, human, cropped object, blurry icon, excessive lightning covering shape
```

#### 12.6 小型反应炉 `module_reactor_small_1.png`

```txt
2D game item icon, small spaceship reactor module, compact circular energy core, blue cyan glow inside dark metal housing, simple common upgrade look, readable silhouette, centered, transparent background, isolated object, no frame, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, full spaceship, nuclear symbol, human, cropped object, blurry icon, excessive glow
```

#### 12.7 高能反应炉 `module_reactor_power_1.png`

```txt
2D game item icon, high energy spaceship reactor module, bright blue plasma core inside reinforced sci-fi casing, powerful rare upgrade look, clean compact silhouette, centered, transparent background, isolated object, no frame, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, full spaceship, nuclear warning symbol, cropped object, blurry icon, overexposed core
```

#### 12.8 推进反应炉 `module_reactor_engine_1.png`

```txt
2D game item icon, propulsion reactor module for a spaceship, compact engine core with small thruster nozzles, cyan exhaust glow, dark sci-fi metal, readable silhouette, centered, transparent background, isolated object, no frame, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, full spaceship, rocket body, cropped object, blurry icon, excessive flame
```

#### 12.9 过载反应炉 `module_reactor_overload_1.png`

```txt
2D game item icon, overloaded spaceship reactor module, unstable red-orange energy core, dark cracked metal casing, dangerous epic upgrade look, compact readable silhouette, centered, transparent background, isolated object, no frame, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, full spaceship, explosion cloud, nuclear symbol, cropped object, blurry icon, glow covering entire icon
```

#### 12.10 护盾发生器 `module_shield_basic_1.png`

```txt
2D game item icon, spaceship shield generator module, blue hexagonal energy emitter inside compact metal device, defensive sci-fi component, clean readable silhouette, centered, transparent background, isolated object, no frame, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, medieval shield, full spaceship, cropped object, blurry icon, excessive glow
```

#### 12.11 再生护盾 `module_shield_regen_1.png`

```txt
2D game item icon, regenerative shield module for a spaceship, circular blue energy ring, small repair-like pulses, compact sci-fi device, rare upgrade look, readable silhouette, centered, transparent background, isolated object, no frame, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, medieval shield, medical cross text, cropped object, blurry icon, excessive particles
```

#### 12.12 重型护盾 `module_shield_heavy_1.png`

```txt
2D game item icon, heavy shield module for a spaceship, thick armored shield generator, dark metal plating, deep blue energy barrier core, durable defensive look, clean silhouette, centered, transparent background, isolated object, no frame, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, medieval shield, full spaceship, cropped object, blurry icon, overcomplicated armor
```

#### 12.13 爆裂护盾 `module_shield_burst_1.png`

```txt
2D game item icon, burst shield module for a spaceship, cracked blue energy shield core releasing a small shockwave, dark sci-fi metal casing, epic defensive upgrade look, readable silhouette, centered, transparent background, isolated object, no frame, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, large explosion, medieval shield, cropped object, blurry icon, excessive glow covering shape
```

#### 12.14 推进器强化 `module_utility_engine_1.png`

```txt
2D game item icon, spaceship thruster booster module, compact twin micro thrusters, cyan exhaust glow, dark metal, utility upgrade look, clean readable silhouette, centered, transparent background, isolated object, no frame, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, full rocket, full spaceship, cropped object, blurry icon, excessive flame
```

#### 12.15 战利品雷达 `module_utility_radar_1.png`

```txt
2D game item icon, loot radar module for a spaceship, compact scanning dish with golden signal waves, dark sci-fi casing, utility upgrade look, readable silhouette, centered, transparent background, isolated object, no frame, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, full satellite, map, coin pile, cropped object, blurry icon, excessive signal lines
```

#### 12.16 自动维修装置 `module_utility_repair_1.png`

```txt
2D game item icon, automatic repair module for a spaceship, compact mechanical repair arm with blue diagnostic light, dark sci-fi metal, utility support upgrade look, readable silhouette, centered, transparent background, isolated object, no frame, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, human mechanic, medical cross text, full robot, cropped object, blurry icon, too many tools
```

#### 12.17 备用核心 `module_utility_core_1.png`

```txt
2D game item icon, backup life core module for a spaceship, small protected energy core, blue and gold glow, reinforced sci-fi casing, rare survival upgrade look, clean readable silhouette, centered, transparent background, isolated object, no frame, no text, no logo, no watermark

Negative prompt: text, letters, numbers, logo, watermark, background, human heart, full spaceship, cropped object, blurry icon, excessive glow, multiple cores
```

---

### 14. 贴图验收标准

每张贴图进入项目之前需要检查以下内容：

```txt
文件名是否符合约定
图片是否为 PNG
需要透明背景的资源是否真的透明
主体是否居中
主体是否完整，没有被裁切
缩小到游戏内尺寸后是否仍然能识别
是否包含文字、水印、Logo、签名
玩家、敌人、Boss 的朝向是否正确
子弹颜色是否容易区分敌我
背景 TileSprite 层是否不会影响前景对象识别
模块图标是否能大致看出功能类别
贴图整体是否符合科幻感、现实风格、硬表面科技感的统一美术方向
是否明显出现卡通化、Q 版化、照片拼贴或与项目基调不一致的问题
```

战斗资源验收要求：

```txt
玩家飞船在深色背景上清晰可见
敌人不能与玩家飞船颜色过于接近
玩家子弹与敌人子弹颜色必须明显不同
Boss 缩放到战斗显示尺寸后仍然有压迫感
爆炸播放时不能遮挡过多战斗信息
```

UI 资源验收要求：

```txt
按钮底图上放置文字后必须清晰可读
模块卡片底图不能影响模块名称和描述阅读
插槽底图必须能区分空槽、已安装、未解锁三种状态
图标在 64x64 下必须可识别
```

---

### 15. MVP 贴图制作优先级

| 优先级 | 内容 | 说明 |
|---|---|---|
| P0 | 玩家飞船、三种敌人、玩家子弹、敌人子弹、背景 TileSprite 纹理 | 没有这些无法开始战斗开发 |
| P0 | Boss、Boss 子弹可复用敌人子弹 | 没有 Boss 无法完成完整通关闭环 |
| P1 | 爆炸 Sprite Sheet | 提升击杀反馈，但不影响核心逻辑 |
| P1 | 模块图标 | 支撑三选一和插槽界面体验 |
| P1 | 金钱、生命、护盾图标 | 支撑 HUD 可读性 |
| P2 | UI 按钮、模块卡片、插槽底图 | 可以先用代码绘制占位，后续替换 |

开发初期允许使用纯色几何图形占位，但正式 MVP 验收前必须替换为本章节定义的贴图资源。

---

## 三十二、音频资源清单

| 类型 | 文件 | 说明 |
|---|---|---|
| BGM | bgm_battle.mp3 | 战斗背景音乐 |
| 音效 | sfx_shoot.wav | 玩家射击 |
| 音效 | sfx_enemy_hit.wav | 敌人受击 |
| 音效 | sfx_explosion.wav | 爆炸 |
| 音效 | sfx_module_select.wav | 选择模块 |
| 音效 | sfx_slot_unlock.wav | 解锁插槽 |
| 音效 | sfx_player_hit.wav | 玩家受击 |
| 音效 | sfx_boss_warning.wav | Boss 出现 |
| 音效 | sfx_victory.wav | 胜利 |
| 音效 | sfx_defeat.wav | 失败 |

---

## 三十三、性能要求

### 1. 目标性能

| 平台 | 目标 |
|---|---|
| PC 浏览器 | 稳定 60 FPS |
| 中端手机浏览器 | 尽量接近 60 FPS |
| 低端手机浏览器 | 不低于 30 FPS |

### 2. 同屏数量限制

| 对象 | 同屏上限 |
|---|---:|
| 玩家子弹 | 150 |
| 敌人子弹 | 120 |
| 普通敌人 | 30 |
| 爆炸特效 | 30 |

### 3. 移动端优化要求

```txt
避免每帧创建新对象
使用对象池管理高频对象
限制同屏子弹数量
限制同屏敌人数量
减少大尺寸贴图
背景使用 TileSprite，禁止使用超大长图模拟滚动
减少透明叠加
控制粒子数量
控制音效并发数量
资源加载前显示进度
TileSprite 背景层数量控制在 2 到 3 层
```

---

## 三十四、开发调试工具

MVP 开发环境建议增加 Debug 面板，只在开发模式启用。

```txt
显示 FPS
显示当前普通敌人数量
显示当前玩家子弹数量
显示当前敌人子弹数量
显示对象池总量与活跃数量
显示当前关卡 ID
显示当前金钱
一键增加金钱
一键跳转下一关
一键进入 Boss 关
一键清除场上敌人子弹
```

Debug 面板不得出现在正式构建中。

---


## 三十五、自动化测试与交付保障

MVP 必须以“真实可玩”为交付目标。测试不是附加项，而是开发过程中的强制交付内容。

本项目采用三层测试策略：

```txt
类型检查与构建测试：保证代码可编译、可构建、依赖版本正确。
Vitest 单元测试：保证核心规则、数据计算和状态机稳定。
Playwright E2E 测试：保证游戏在真实浏览器中可以完成完整玩法闭环。
```

### 1. 测试目标

```txt
确保游戏可以正常启动。
确保 PC 端 WASD、鼠标拖拽输入正常。
确保 PC 端点击屏幕不会触发点击移动。
确保手机端可以拖拽屏幕任意位置移动飞船。
确保玩家飞船会自动攻击距离最近的敌人。
确保敌人生成、移动、受击、死亡流程正常。
确保玩家受伤、护盾扣除、无敌时间、死亡结算正常。
确保普通关卡倒计时结束后进入结算。
确保强化模块三选一、安装、替换、插槽购买流程正常。
确保模块效果真实影响最终属性。
确保 Boss 出现、释放弹幕、被击败、胜利结算正常。
确保本地设置与基础统计可以保存和读取。
确保生产构建版本可以运行，不只是在 dev 模式可运行。
```

### 2. 测试目录结构

```txt
src/
  game/
    systems/
    entities/
    data/
    state/
    test-support/
      testHooks.ts
      fixedRng.ts
      scenarioBuilder.ts
  tests/
    unit/
      stats.test.ts
      damage.test.ts
      targeting.test.ts
      money.test.ts
      modules.test.ts
      slots.test.ts
      stage.test.ts
      storage.test.ts
      rng.test.ts
    integration/
      runState.test.ts
      stageFlow.test.ts
      moduleInstallFlow.test.ts
      bossFlow.test.ts

e2e/
  app-load.spec.ts
  input-desktop.spec.ts
  input-mobile.spec.ts
  auto-attack.spec.ts
  stage-flow.spec.ts
  module-slot.spec.ts
  boss-flow.spec.ts
  persistence.spec.ts
  resize.spec.ts
  smoke-production.spec.ts

playwright.config.ts
vitest.config.ts
```

### 3. 可测试性设计要求

Phaser 游戏容易因为渲染、时间、随机数和输入耦合导致难以测试。MVP 必须在设计阶段预留测试边界。

```txt
所有核心规则必须写成纯 TypeScript 函数或轻量 class。
Scene 只负责资源加载、对象创建、输入转发和画面更新。
属性计算、伤害结算、金钱结算、关卡推进、模块安装、插槽购买、自动索敌不得直接写死在 Scene 中。
随机数必须通过 Rng 接口注入，不允许在核心规则中直接调用 Math.random。
时间推进必须允许测试环境使用固定 delta 或快进模式。
对象池必须暴露只读统计信息，便于测试是否复用对象。
生产环境不得暴露测试接口。
```

建议抽离以下纯逻辑模块：

```txt
StatsCalculator
DamageResolver
TargetingSystem
MoneyResolver
ModuleResolver
SlotResolver
StageResolver
WaveResolver
BossPatternResolver
StorageRepository
RunStateMachine
```

### 4. 测试专用 Hook

为了让 Playwright 能测试 Phaser 画布内部状态，MVP 允许在 e2e 模式下暴露测试 Hook。

```ts
export interface MvpTestHooks {
  getStateSnapshot(): GameStateSnapshot
  getPlayerSnapshot(): PlayerSnapshot
  getEnemySnapshots(): EnemySnapshot[]
  getBulletSnapshots(): BulletSnapshot[]
  getMetrics(): GameRuntimeMetrics

  setRngSeed(seed: number): void
  startNewRun(options?: Partial<TestRunOptions>): void
  jumpToStage(stageId: string): void
  fastForward(ms: number): Promise<void>

  setPlayerHp(hp: number): void
  setPlayerShield(shield: number): void
  addMoney(amount: number): void
  unlockAllSlots(): void

  spawnEnemy(options: TestEnemyOptions): string
  spawnBoss(options?: Partial<TestBossOptions>): string
  clearEnemies(): void
  clearBullets(): void

  forceStageTimer(seconds: number): void
  forceModuleChoices(moduleIds: string[]): void
  selectModule(moduleId: string): void
  installModule(slotId: string): void
}

declare global {
  interface Window {
    __MVP_TEST__?: MvpTestHooks
  }
}
```

启用规则：

```txt
仅在 import.meta.env.MODE === 'e2e' 时挂载 window.__MVP_TEST__。
正式 production build 不得挂载 window.__MVP_TEST__。
测试 Hook 只能操作测试状态，不得改变正式玩法规则。
Playwright 用 Hook 做状态断言，用真实键盘、鼠标、触摸事件做输入测试。
```

### 5. Vitest 配置

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: [
      'src/tests/unit/**/*.test.ts',
      'src/tests/integration/**/*.test.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: [
        'src/game/systems/**/*.ts',
        'src/game/state/**/*.ts',
        'src/game/data/**/*.ts',
        'src/game/entities/**/*.ts'
      ],
      exclude: [
        'src/**/*.d.ts',
        'src/main.ts',
        'src/game/scenes/**/*.ts',
        'src/game/test-support/**/*.ts'
      ],
      thresholds: {
        statements: 85,
        branches: 80,
        functions: 85,
        lines: 85
      }
    }
  }
})
```

说明：

```txt
Phaser Scene 文件不强制纳入 Vitest 覆盖率，因为 Scene 更适合通过 Playwright 在真实浏览器中验证。
核心系统、状态机和数据规则必须纳入 Vitest 覆盖率。
覆盖率不达标时，不允许交付 MVP。
```

### 6. Playwright 配置

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  webServer: {
    command: 'pnpm dev:e2e',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      }
    },
    {
      name: 'mobile-chromium',
      use: {
        ...devices['Pixel 7'],
        viewport: { width: 412, height: 915 },
        isMobile: true,
        hasTouch: true
      }
    },
    {
      name: 'desktop-webkit-smoke',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 }
      }
    }
  ]
})
```

说明：

```txt
desktop-chromium 覆盖主要 PC 玩法。
mobile-chromium 覆盖手机触摸拖拽和竖屏适配。
desktop-webkit-smoke 只做基础启动和一局短流程冒烟测试，用于提前发现 Safari/WebKit 兼容问题。
移动端真机仍需要人工验收，自动化测试不能完全替代真机触摸体验。
```

### 7. 单元测试覆盖范围

#### 7.1 属性计算测试

```txt
基础属性正确生成。
模块百分比加成采用加法叠加。
模块固定值加成正确累加。
maxHp 增加后，当前 hp 不超过新的 maxHp。
护盾上限和护盾恢复规则正确。
属性上下限生效，例如 bulletCount、critRate、moveSpeed、fireRate 不越界。
```

#### 7.2 伤害测试

```txt
护盾优先扣除伤害。
护盾不足时，溢出伤害扣除生命。
生命最低为 0。
无敌时间内不重复受伤。
无敌时间结束后可以再次受伤。
玩家死亡后不再继续扣血。
爆裂护盾触发时可以清除敌方子弹。
备用核心触发时可以复活一次。
备用核心只触发一次。
```

#### 7.3 自动索敌测试

```txt
没有敌人时不发射子弹。
存在多个敌人时，选择距离玩家最近的存活敌人。
死亡敌人、未激活敌人、离场敌人不参与索敌。
Boss 存活时也参与索敌。
最近敌人变化后，下次射击目标同步变化。
距离相等时，选择创建时间更早的敌人，保证结果稳定。
```

#### 7.4 金钱测试

```txt
击杀敌人时获得 enemy.money。
普通关卡结束时获得 stage.baseReward。
剩余生命奖励正确计算。
moneyBonus 只影响关卡结束奖励，不影响敌人击杀即时金钱。
金钱不得小于 0。
购买插槽时正确扣除金钱。
金钱不足时不能购买插槽。
```

#### 7.5 模块与插槽测试

```txt
三选一中不出现重复模块。
模块池不足 3 个时展示实际可用数量。
模块可以安装到任意已解锁空插槽。
模块可以替换任意已解锁插槽中的旧模块。
未解锁插槽不能安装模块。
购买插槽后插槽状态变为已解锁。
所有百分比模块按加法叠加。
事件型模块可以注册并触发。
```

#### 7.6 关卡与状态机测试

```txt
首页进入游戏后进入 StageStart。
StageStart 后进入 Playing。
Playing 状态下才生成敌人、子弹和碰撞。
Paused 状态下停止计时器、敌人生成、子弹更新和音效。
普通关卡倒计时结束后进入 StageResult。
选择模块并完成安装后进入下一关。
最终关进入 BossStage。
击败 Boss 后进入 Victory。
玩家生命归零后进入 Defeat。
刷新页面不恢复进行中的单局。
```

#### 7.7 本地存储测试

```txt
音量设置可以保存和读取。
音效开关可以保存和读取。
基础统计可以累加保存。
本地存储损坏时使用默认值，不导致白屏。
localStorage 不可用时游戏仍可运行，只是不保存设置和统计。
```

### 8. Playwright E2E 测试场景

#### 8.1 启动冒烟测试

```txt
打开首页。
点击开始游戏。
等待 Phaser canvas 出现。
等待第一关 HUD 出现。
确认没有控制台 error。
确认 window.__MVP_TEST__ 在 e2e 模式存在。
确认生产构建 smoke 测试中 window.__MVP_TEST__ 不存在。
```

#### 8.2 PC WASD 移动测试

```txt
开始游戏。
记录玩家初始坐标。
按住 D，玩家 x 增加。
按住 A，玩家 x 减少。
按住 W，玩家 y 减少。
按住 S，玩家 y 增加。
连续按住方向键时，玩家不会移出战斗区域。
```

#### 8.3 PC 鼠标拖拽测试

```txt
开始游戏。
在画布任意位置 mouse down。
移动鼠标到新位置。
玩家飞船跟随拖拽方向移动。
mouse up 后停止拖拽。
再次移动鼠标但不按下时，玩家不继续移动。
```

#### 8.4 PC 不支持点击移动测试

```txt
开始游戏。
记录玩家初始坐标。
在远离玩家的位置单击画布。
等待 500ms。
玩家坐标不应向点击位置自动移动。
```

#### 8.5 手机端任意位置拖拽测试

```txt
使用 mobile-chromium 项目。
开始游戏。
在画布左上区域触摸按下，不要求按在飞船上。
手指拖动到右下区域。
玩家飞船跟随拖拽方向移动。
释放触摸后停止移动。
页面不发生滚动。
浏览器不出现缩放或选中文本行为。
```

#### 8.6 自动攻击最近敌人测试

```txt
开始游戏。
清空敌人和子弹。
在玩家远处生成 enemy_far。
在玩家近处生成 enemy_near。
等待一次开火。
确认第一发玩家子弹目标为 enemy_near。
击杀 enemy_near 后，下一次开火目标切换为 enemy_far。
```

#### 8.7 关卡流程测试

```txt
开始游戏。
使用测试 Hook 将普通关卡倒计时设为 3 秒。
等待关卡结束。
确认进入关卡结算界面。
确认显示 3 个强化模块。
选择一个模块。
安装到空插槽。
点击进入下一关。
确认关卡编号增加，玩家重新进入 Playing 状态。
```

#### 8.8 模块与插槽测试

```txt
开始游戏。
强制给出指定 3 个模块。
选择伤害模块并安装到 slot_1。
确认最终 damage 增加。
选择护盾模块并安装到 slot_2。
确认 maxShield 增加。
填满所有已解锁插槽。
再次选择模块时，确认可以替换旧模块。
增加足够金钱。
购买新插槽。
确认新插槽已解锁且金钱被扣除。
```

#### 8.9 失败结算测试

```txt
开始游戏。
将玩家生命设为 1。
生成一枚敌方子弹命中玩家。
确认进入 Defeat。
确认失败结算界面出现。
点击重新开始。
确认进入新的一局。
```

#### 8.10 Boss 胜利测试

```txt
开始游戏。
跳转到 Boss 关。
将 Boss 生命设置为低值。
确认 Boss 可以释放弹幕。
等待玩家自动攻击击败 Boss。
确认进入 Victory。
确认胜利结算界面出现。
点击重新开始可以重新进入首页或新一局。
```

#### 8.11 本地保存测试

```txt
打开游戏。
关闭背景音乐。
完成一次失败或胜利结算。
刷新页面。
确认背景音乐开关状态保持。
确认基础统计已更新。
确认不会恢复到上一次进行中的战斗。
```

#### 8.12 Resize 与适配测试

```txt
桌面端从 1280x720 调整到 900x600。
canvas 保持完整显示。
HUD 不遮挡玩家飞船出生点。
移动端竖屏显示正常。
横屏时显示建议竖屏游玩的提示或保持核心操作可用。
```

### 9. 性能与稳定性测试

性能测试不追求复杂压测，但必须覆盖弹幕游戏最容易出问题的对象数量、对象池复用和长时间运行。

```txt
桌面端连续运行 10 分钟不白屏。
手机端连续运行 5 分钟不白屏。
同屏 40 个敌人、160 枚玩家子弹、120 枚敌人子弹时，游戏仍可继续操作。
对象池 active 数量会随对象回收下降。
对象池 total 数量不会无限增长。
关卡切换后，上一关敌人、子弹、计时器全部清理。
重新开始 5 次后，内存和对象数量没有明显累积。
```

建议 Debug Metrics：

```ts
export interface GameRuntimeMetrics {
  fps: number
  activeEnemies: number
  activePlayerBullets: number
  activeEnemyBullets: number
  pooledEnemies: number
  pooledPlayerBullets: number
  pooledEnemyBullets: number
  activeTimers: number
  currentSceneKey: string
  currentGameState: GameState
}
```

性能门槛：

```txt
桌面端平均 FPS 不低于 55。
移动端平均 FPS 不低于 35。
测试环境中的 FPS 只作为参考，最终仍需人工体验确认。
不能出现白屏、卡死、输入完全失效、结算界面无法操作等阻塞问题。
```

### 10. 人工验收清单

自动化测试通过后，还必须进行一次人工完整游玩。

```txt
PC Chrome 完整通关 1 次。
PC Chrome 故意失败 1 次。
PC Safari 或 WebKit 完成至少前 2 关。
Android Chrome 或移动端模拟器完整游玩至少 1 次。
iPhone Safari 或 WebKit 移动端模拟完成至少前 2 关。
确认鼠标拖拽手感自然。
确认手机端拖拽不要求手指按在飞船上。
确认手机端页面不滚动、不缩放、不误触。
确认自动攻击最近敌人的表现符合直觉。
确认模块选择、安装、替换、购买插槽没有理解障碍。
确认 Boss 战能看清子弹、敌人和玩家位置。
确认音效、背景音乐开关有效。
```

### 11. 交付门禁

交付 MVP 前必须执行：

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test:coverage
pnpm build
pnpm test:e2e
pnpm test:all
```

通过标准：

```txt
所有命令退出码必须为 0。
Vitest 测试全部通过。
覆盖率达到配置阈值。
Playwright E2E 测试全部通过。
生产构建成功。
preview 或 production smoke 测试可以打开游戏。
测试报告中没有 failed、flaky 或 skipped 的核心用例。
浏览器控制台没有未处理异常。
```

允许存在的非阻塞问题：

```txt
少量贴图仍为临时美术，但尺寸、透明背景和命名必须符合文档。
正式交付版本中，玩家、敌机、Boss、背景、UI 与模块图标应优先替换为使用 GPT Image 2 Model 或等效图像创建能力生成并验收通过的正式贴图。
移动端性能略低于 PC，但不能影响正常操作。
WebKit 上音频自动播放受浏览器限制，但用户点击开始游戏后必须可以播放。
```

不允许交付的问题：

```txt
游戏无法开始。
玩家无法移动。
手机端不能拖拽任意位置移动。
PC 端点击触发了点击移动。
玩家不会自动攻击最近敌人。
敌人无法死亡。
玩家不会死亡或死亡后无法结算。
普通关卡无法进入结算。
模块无法安装或安装后不生效。
插槽购买无法正常扣钱或解锁。
Boss 无法出现、无法攻击或无法被击败。
胜利、失败、重新开始流程任一阻塞。
刷新页面导致白屏。
构建失败。
自动化测试失败。
```

### 12. 测试开发优先级

```txt
P0：属性计算、伤害、自动索敌、金钱、关卡状态机、模块插槽、PC/手机输入、完整通关 E2E。
P1：本地存储、Resize、对象池复用、Boss 弹幕、失败重开、生产构建 smoke。
P2：性能长跑、WebKit 兼容、更多模块组合、更多分辨率截图对比。
```

P0 测试未完成时，不得宣称 MVP 可交付。

## 三十六、开发阶段

### 阶段 1：项目初始化

目标：搭建可运行的 Phaser 4.1.0 项目。

任务：

```txt
创建 Vite 8.0.14 + TypeScript 6.0.3 项目
安装 Phaser 4.1.0
创建 main.ts
创建 Phaser GameConfig
创建背景资源预加载配置
创建 BootScene
创建 PreloadScene
创建 MenuScene
创建 GameScene
浏览器中成功显示游戏画面
GameScene 中成功显示 TileSprite 宇宙背景
```

验收标准：

```txt
pnpm dev 可以启动项目
浏览器可以看到游戏首页
点击开始游戏可以进入 GameScene
进入 GameScene 后可以看到循环铺满屏幕的宇宙背景
```

### 阶段 2：TileSprite 背景系统

目标：完成可循环滚动的多层宇宙背景。

任务：

```txt
创建 backgrounds 资源目录
准备 2 到 3 张无缝可平铺背景贴图
在 PreloadScene 中加载背景贴图
创建 BackgroundSystem
使用 Phaser TileSprite 创建背景层
实现背景持续纵向滚动
实现玩家移动时的轻微横向视差
实现窗口尺寸变化后的背景重设
暂停时停止背景滚动
```

验收标准：

```txt
进入 GameScene 后背景铺满屏幕
背景滚动时看不到明显接缝
玩家左右移动时背景有轻微相对移动
暂停后背景停止滚动
恢复后背景继续滚动
```

### 阶段 3：玩家飞船移动

目标：完成 PC 端 WASD / 鼠标拖拽，以及手机端任意位置拖拽操控。

任务：

```txt
创建 PlayerShip 类
加载 player_ship_01.png
实现 PC 端 WASD 移动
实现 PC 端鼠标拖拽移动
明确不支持点击移动
实现手机端任意屏幕位置单指拖拽移动
拖拽采用位移增量控制飞船
限制玩家不能飞出屏幕
实现玩家基础属性
```

验收标准：

```txt
PC 端可用 WASD 控制飞船
PC 端可用鼠标拖拽控制飞船
PC 端点击战斗区域不会触发移动
手机端可从屏幕任意位置拖拽飞船
飞船不会移出游戏区域
移动手感流畅
```

### 阶段 4：玩家自动索敌攻击

目标：完成自动锁定最近敌人的基础攻击系统。

任务：

```txt
创建 Bullet 类
创建 PlayerAutoAttackSystem
创建 BulletSystem
实现自动攻击计时
实现最近敌人查找
实现向目标方向发射子弹
实现无目标时不发射子弹
实现子弹越界回收
实现子弹对象池
```

验收标准：

```txt
玩家飞船可以自动射击
子弹持续向上移动
子弹离开屏幕后被回收
长时间运行不会明显卡顿
```

### 阶段 5：敌人生成与移动

目标：完成基础敌人系统。

任务：

```txt
创建 Enemy 类
创建 EnemySpawner
加载敌人资源
实现敌人从屏幕边缘生成
实现敌人移动
实现敌人越界回收
实现敌人对象池
```

验收标准：

```txt
敌人会持续生成
敌人会按照配置移动
敌人离开屏幕后消失
同屏敌人数量受控
```

### 阶段 6：碰撞、伤害与击杀

目标：完成核心战斗反馈。

任务：

```txt
创建 CollisionSystem
创建 DamageSystem
实现玩家子弹与敌人的碰撞
实现玩家子弹与 Boss 的碰撞
实现敌人与玩家的碰撞
实现敌人子弹与玩家的碰撞
实现敌人扣血
实现敌人死亡
实现玩家扣血
实现护盾优先扣除
实现受伤无敌时间
实现爆炸效果
```

验收标准：

```txt
子弹命中敌人后敌人扣血
敌人血量归零后死亡
玩家被敌人或敌人子弹命中后扣血
护盾可以优先抵消伤害
玩家受伤后短时间不会连续扣血
爆炸效果正常播放
```

### 阶段 7：金钱系统

目标：完成击杀收益和关卡收益。

任务：

```txt
创建 MoneySystem
击杀敌人后增加金钱
关卡完成后计算基础奖励
根据剩余生命计算额外奖励
根据 moneyBonus 计算加成奖励
HUD 显示当前金钱
```

验收标准：

```txt
击杀敌人可以获得金钱
完成普通关卡后可以获得关卡奖励
金钱数值显示正确
金钱加成模块可以生效
```

### 阶段 8：关卡系统

目标：完成多关卡推进。

任务：

```txt
创建 StageSystem
创建 WaveSystem
创建 stageTypes.ts
根据当前关卡加载波次配置
普通关卡按倒计时结束
普通关卡结束后停止生成和清理场上战斗对象
Boss 关击败 Boss 后结束
关卡结束后进入对应结算界面
```

验收标准：

```txt
游戏可以从第 1 关推进到第 5 关
每关敌人配置不同
普通关卡可以正常结束
Boss 关卡可以正常结束
```

### 阶段 9：飞船通用插槽系统

目标：实现飞船模块安装基础。

任务：

```txt
创建 ShipSlot 类型
创建 ShipSlotSystem
初始化 9 个飞船插槽
默认解锁前 4 个插槽
显示当前飞船插槽
支持判断插槽是否解锁
支持判断插槽是否为空
支持模块安装
支持模块替换
```

验收标准：

```txt
玩家飞船拥有初始插槽
所有插槽都是通用插槽
任何模块都可以安装到任意已解锁插槽
未解锁插槽不能安装模块
已有模块的插槽可以被替换
```

### 阶段 10：强化模块系统

目标：实现关卡结算后的强化三选一。

任务：

```txt
创建 ShipModule 类型
创建 ModuleSystem
创建 moduleTypes.ts
关卡结算时随机生成 3 个模块
玩家可以选择其中 1 个
玩家可以将模块安装到任意已解锁插槽
模块安装后重新计算飞船属性
实现模块叠加规则
实现事件型模块效果
```

验收标准：

```txt
每个普通关卡结束后出现 3 个模块
玩家只能选择其中 1 个
模块可以安装到任意已解锁插槽
模块安装后属性生效
进入下一关后可以明显感受到强化效果
```

### 阶段 11：插槽购买系统

目标：实现使用金钱扩展飞船插槽。

任务：

```txt
创建 SlotShopSystem
创建 slotUnlocks.ts
结算界面显示购买插槽按钮
判断金钱是否足够
购买后解锁下一个插槽
扣除对应金钱
```

验收标准：

```txt
玩家可以使用金钱解锁新插槽
金钱不足时不能购买
解锁后的插槽可以安装任意模块
插槽购买价格逐步提高
```

### 阶段 12：Boss 战

目标：完成最终关卡。

任务：

```txt
创建 Boss 类
创建 BossSystem
进入第 5 关时生成 Boss
Boss 显示血条
Boss 循环释放弹幕
Boss 血量归零后进入胜利结算
```

验收标准：

```txt
第 5 关可以进入 Boss 战
Boss 有血条
Boss 可以攻击玩家
击败 Boss 后进入胜利结算
```

### 阶段 13：胜利、失败与结算

目标：完成完整单局闭环。

任务：

```txt
玩家生命归零后游戏失败
可复活模块优先触发
Boss 被击败后游戏胜利
进入 GameResultScene
显示总击杀数、总获得金钱、存活时间、最终构筑
支持重新开始
支持返回首页
```

验收标准：

```txt
玩家死亡会结算
Boss 死亡会结算
结算数据正确
可以重新开始一局
可以返回首页
```

### 阶段 14：本地存档

目标：保存基础游玩数据。

任务：

```txt
创建 SaveSystem
保存通关次数
保存失败次数
保存总游玩次数
保存累计击杀数量
保存最长存活时间
保存最远到达关卡
保存音频与震动设置
读取本地存档并展示到首页
```

验收标准：

```txt
刷新页面后设置项不丢失
通关次数正常累计
失败次数正常累计
最长存活时间正常更新
最远到达关卡正常更新
```

### 阶段 15：移动端适配与性能优化

目标：让游戏可以在手机浏览器中正常游玩。

任务：

```txt
适配 9:16 竖屏
实现手机端任意位置单指拖拽
禁止手机端点击移动
调整 HUD 尺寸
调整结算界面尺寸
限制同屏对象数量
检查对象池复用情况
压缩 PNG 图片
减少粒子数量
测试手机浏览器性能
禁用页面默认滚动
处理移动端音频播放限制
```

验收标准：

```txt
手机端可以打开游戏
手机端可以从屏幕任意位置流畅拖动飞船
UI 不遮挡核心战斗区域
结算界面可以正常操作
中端手机可以稳定游玩
没有明显掉帧或白屏
```

---


### 阶段 16：测试覆盖与交付门禁

实现内容：

```txt
补齐 Vitest 单元测试
补齐核心流程集成测试
补齐 Playwright E2E 测试
实现 e2e 模式测试 Hook
实现固定随机种子
实现测试场景构造工具
实现覆盖率配置
实现 Playwright HTML 报告
实现生产构建 smoke 测试
执行完整交付门禁脚本
```

验收标准：

```txt
pnpm typecheck 通过
pnpm test:coverage 通过
pnpm build 通过
pnpm test:e2e 通过
pnpm test:all 通过
P0 测试用例全部完成且通过
覆盖率达到阈值
Playwright 报告没有核心失败用例
正式构建中不暴露 window.__MVP_TEST__
```

---

## 三十七、MVP 必须完成功能清单

```txt
Phaser 4.1.0 项目初始化
PC 端 WASD 移动
PC 端鼠标拖拽移动
PC 端不支持点击移动
手机端任意位置拖拽移动
玩家自动攻击最近敌人
玩家子弹对象池
敌人生成
敌人移动
敌人对象池
敌人子弹对象池
子弹命中敌人
敌人死亡
玩家受伤
护盾系统
无敌时间
金钱系统
关卡系统
波次系统
Boss 战
Boss 弹幕
关卡结算
强化模块三选一
飞船通用插槽
模块安装
模块替换
插槽购买
模块属性生效
事件型模块效果
胜利结算
失败结算
本地基础统计保存
本地设置保存
移动端适配
Vitest 单元测试
核心规则覆盖率报告
Playwright E2E 测试
PC WASD 自动化测试
PC 鼠标拖拽自动化测试
PC 不支持点击移动自动化测试
手机端任意位置拖拽自动化测试
自动攻击最近敌人自动化测试
关卡结算与模块安装 E2E 测试
Boss 胜利与玩家失败 E2E 测试
生产构建 smoke 测试
```

---

## 三十八、最终验收标准

### 1. 功能验收

```txt
可以进入游戏
可以控制飞船移动
飞船可以自动射击
敌人可以生成
敌人可以被击杀
敌人可以伤害玩家
敌人子弹可以伤害玩家
玩家护盾可以抵消伤害
玩家可以获得金钱
关卡可以推进
普通关卡倒计时结束后可以进入结算界面
结算界面可以显示 3 个强化模块
玩家可以选择 1 个模块
模块可以安装到任意已解锁插槽
模块可以替换旧模块
玩家可以使用金钱购买新插槽
模块效果可以影响玩家属性
事件型模块可以触发
Boss 可以出现
Boss 可以释放弹幕
Boss 可以被击败
玩家死亡可以结算
胜利可以结算
可以重新开始
可以保存基础统计
手机端可以操作，且不需要手指按在飞船上才能拖动
```

### 2. 测试验收

```txt
pnpm install --frozen-lockfile 可以成功安装
pnpm typecheck 通过
pnpm test:coverage 通过
pnpm build 通过
pnpm test:e2e 通过
pnpm test:all 通过
核心逻辑覆盖率达到阈值
Playwright desktop-chromium 用例通过
Playwright mobile-chromium 用例通过
生产构建 smoke 用例通过
P0 自动化测试全部通过
正式构建中不暴露 window.__MVP_TEST__
浏览器控制台无未处理异常
```

### 3. 性能验收

```txt
PC 端 60 FPS 基本稳定
手机端不出现严重卡顿
同屏大量子弹时不白屏
长时间游玩无明显内存暴涨
对象池正常复用对象
资源加载时间可接受
```

### 4. 体验验收

```txt
WASD、鼠标拖拽、手机拖拽手感顺畅
射击反馈清晰
击杀反馈明确
受伤反馈明确
关卡节奏清楚
模块选择有明显收益
插槽安装操作清晰
购买插槽操作清晰
前 1 关容易上手
第 3 关开始压力提升
Boss 战有明显压迫感
失败后可以快速重新开始
```

---

## 三十九、MVP 完成标准

MVP 完成时，玩家应可以在 PC 或手机浏览器中完成一局完整游戏：

```txt
开始游戏
  ↓
连续完成多个普通关卡
  ↓
每关获得金钱
  ↓
每关选择强化模块
  ↓
将模块安装到飞船通用插槽
  ↓
使用金钱解锁更多插槽
  ↓
形成飞船构筑
  ↓
挑战最终 Boss
  ↓
胜利或失败结算
```

本 MVP 的最终完成标准为：

```txt
玩家可以在 6 - 8 分钟内完成一局由多个小关卡组成的飞船弹幕战斗，并通过通用插槽模块构筑形成不同的战斗体验。

同时，项目必须通过类型检查、单元测试、覆盖率检查、生产构建和 Playwright 端到端测试，证明该版本不是只能启动的 Demo，而是真实可玩、主要功能均正常的 MVP。
```

# 请根据以上文档，将本项目完整实现并确保所有测试通过，并最终将整个项目打包发给我
