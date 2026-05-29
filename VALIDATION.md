# Validation Notes

执行环境：当前沙盒 Node.js 为 v22.16.0，低于文档要求的 Node.js 24.16.0，因此安装阶段出现 engine warning，但命令仍可执行。

## 已执行并通过

```txt
npm run typecheck
npm run test:coverage
npm run build
```

覆盖率：

```txt
Statements: 93.75%
Branches:   85.95%
Functions:  97.53%
Lines:      95.83%
```

## 未能在当前沙盒完成

```txt
npx playwright install chromium webkit
```

失败原因：`cdn.playwright.dev` DNS `EAI_AGAIN`。

尝试使用系统 `/usr/bin/chromium` 运行 Playwright 时，访问 `localhost/127.0.0.1` 被当前 Chromium 管理策略阻止：

```txt
net::ERR_BLOCKED_BY_ADMINISTRATOR
```

因此本包包含 Playwright E2E 用例与测试 Hook，但 E2E 未在当前沙盒完整通过。建议在正常开发机或 CI 中执行：

```bash
pnpm exec playwright install chromium webkit
pnpm test:e2e
```
