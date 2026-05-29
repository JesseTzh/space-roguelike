# Space Roguelike MVP

这是根据 `MVP开发文档.md` 实现的 2D Roguelike 飞船弹幕网页游戏 MVP。项目保留文档要求的精确依赖版本，并提供可离线执行的 TypeScript 类型检查、核心规则测试、构建和 smoke 测试脚本。

## 快速运行

```bash
corepack enable
corepack prepare pnpm@11.4.0 --activate
pnpm install --frozen-lockfile
pnpm dev
```

当前交付包也支持在没有 npm 网络的环境下用全局 `tsc` 执行核心验证：

```bash
npm run typecheck
npm run test:coverage
npm run build
npm run test:e2e
npm run test:all
```

## 已实现

- 竖屏 720x1280 Canvas 游戏视口，移动端页面禁滚动。
- 多层 TileSprite 风格滚动背景与横向视差。
- PC WASD、PC 鼠标拖拽、手机任意位置单指拖拽。
- 禁止点击移动，拖拽以位移增量控制飞船。
- 自动索敌攻击最近敌人，多子弹散射，暴击。
- 敌人波次、普通敌人对象池、玩家子弹池、敌人子弹池、爆炸效果池。
- 生命、护盾、护盾恢复、受伤无敌时间。
- 金钱、关卡奖励、普通关卡倒计时、多关卡推进。
- 强化模块三选一、通用插槽安装/替换、插槽购买。
- Boss 战、Boss 血条、固定弹幕循环、胜利/失败结算。
- localStorage 设置与基础统计保存。
- e2e 模式测试 Hook：`?e2e=1` 或 Vite `mode=e2e` 下挂载 `window.__MVP_TEST__`。

## 说明

正式依赖已在 `package.json` 中精确锁定；本环境无法从 npm 下载依赖，因此 `pnpm-lock.yaml` 以占位说明文件随包提交。若在可联网环境运行，请执行 `pnpm install --frozen-lockfile` 生成真实锁文件后提交。

美术资源为程序生成的 PNG 占位资源，命名、尺寸、透明背景与目录结构符合 MVP 文档。正式上线前建议替换为文档中的 GPT Image 2 / ChatGPT 图像生成资源。
