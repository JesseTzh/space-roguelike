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
        'src/systems/**/*.ts',
        'src/game/GameStateMachine.ts',
        'src/game/RunContext.ts'
      ],
      exclude: [
        'src/**/*.d.ts',
        'src/main.ts',
        'src/scenes/**/*.ts',
        'src/game/test-support/**/*.ts',
        'src/systems/BackgroundSystem.ts',
        'src/systems/AudioSystem.ts',
        'src/systems/MobileAdaptSystem.ts'
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
