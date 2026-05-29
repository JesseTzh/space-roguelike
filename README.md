# Space Roguelike MVP

基于 `MVP开发文档.md` 实现的 2D Roguelike 飞船弹幕网页游戏 MVP。

## 已实现内容

- Vite + TypeScript + Phaser 项目结构
- 竖屏 9:16 游戏画布与 Phaser Scene 流程
- Phaser TileSprite 三层宇宙背景与玩家移动视差
- PC WASD 移动、PC 鼠标拖拽移动、移动端任意位置拖拽移动
- 不支持点击移动
- 玩家自动索敌攻击最近敌人
- 普通敌人、快速敌人、重型敌人、Boss
- 玩家子弹、敌人子弹、敌人、爆炸对象池
- 生命、护盾、护盾恢复、受伤无敌、护盾破裂清弹
- 普通关卡倒计时、多波次敌人生成、多关卡推进
- 金钱、击杀奖励、关卡奖励、剩余生命奖励
- 强化模块三选一、通用插槽、模块安装/替换、插槽购买
- 最终属性计算与事件型模块效果
- Boss 固定循环弹幕与胜利/失败结算
- localStorage 基础统计与设置保存
- Vitest 单元/集成测试与覆盖率配置
- Playwright E2E 测试文件与 e2e 模式测试 Hook
- 程序化生成的 PNG/WAV 占位资源

## 运行环境

文档要求的版本被写入 `package.json`：

- Node.js：`>=24.16.0 <25`
- pnpm：`11.4.0`
- Vite：`8.0.14`
- TypeScript：`6.0.3`
- Phaser：`4.1.0`
- Vitest：`4.1.7`
- Playwright：`1.60.0`

当前交付包中同时包含 `package-lock.json`，原因是本次沙盒环境只能稳定使用 npm 完成依赖安装和验证；严格按文档使用 pnpm 时，请在 Node 24.16.0 环境下执行：

```bash
corepack enable
corepack prepare pnpm@11.4.0 --activate
pnpm install
pnpm exec playwright install chromium webkit
pnpm test:all
```

## 本地启动

```bash
npm install
npm run dev
```

或在符合文档要求的环境中：

```bash
pnpm install
pnpm dev
```

## 测试命令

```bash
npm run typecheck
npm run test:coverage
npm run build
```

E2E：

```bash
npm run test:e2e
```

如果本机已有 Chromium，但 Playwright 浏览器二进制未下载，可使用：

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --project=desktop-chromium
```

## 本次沙盒验证结果

已通过：

```txt
npm run typecheck
npm run test:coverage
npm run build
```

覆盖率结果：

```txt
Statements: 93.75%
Branches:   85.95%
Functions:  97.53%
Lines:      95.83%
```

未能在本沙盒完成的部分：

```txt
Playwright 浏览器安装失败：cdn.playwright.dev DNS EAI_AGAIN。
使用系统 /usr/bin/chromium 运行 Playwright 时，页面访问 localhost/127.0.0.1 被当前环境的 Chromium 管理策略拦截，错误为 ERR_BLOCKED_BY_ADMINISTRATOR。
因此 E2E 用例已随项目提供，但没有在当前沙盒环境完整跑通。
```

## 美术资源说明

`public/assets` 下资源为程序化生成的可运行占位 PNG/WAV，用于保证游戏可以启动、构建和测试。正式 MVP 美术仍应按开发文档中的 GPT Image 2 Model / ChatGPT 图像创建能力 Prompt 重新生成并人工验收替换。

## 目录说明

```txt
src/data       静态配置：敌人、关卡、模块、背景、插槽价格
src/entities   Phaser 运行实体：玩家、敌人、Boss、子弹、爆炸
src/systems    可测试核心逻辑与运行系统
src/scenes     Phaser Scene：加载、菜单、战斗、结算
src/tests      Vitest 单元测试与集成测试
e2e            Playwright E2E 用例
public/assets  游戏占位资源
```
