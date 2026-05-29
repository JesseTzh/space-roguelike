import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/tests/unit/**/*.test.ts', 'src/tests/integration/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: ['src/systems/**/*.ts', 'src/data/**/*.ts', 'src/entities/**/*.ts', 'src/game/**/*.ts'],
      exclude: ['src/**/*.d.ts', 'src/main.ts', 'src/scenes/**/*.ts', 'src/game/test-support/**/*.ts'],
      thresholds: {
        statements: 85,
        branches: 80,
        functions: 85,
        lines: 85,
      },
    },
  },
})
