import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: [
      'src/tests/unit/**/*.test.ts',
      'src/tests/integration/**/*.test.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: [
        'src/systems/Rng.ts',
        'src/systems/DamageResolver.ts',
        'src/systems/TargetingSystem.ts',
        'src/systems/MoneyResolver.ts',
        'src/systems/StatsCalculator.ts',
        'src/systems/ModuleResolver.ts',
        'src/systems/SlotResolver.ts',
        'src/systems/StageResolver.ts',
        'src/systems/StorageRepository.ts',
        'src/systems/ModuleEventResolver.ts',
        'src/systems/BossPatternResolver.ts',
        'src/systems/ObjectPool.ts',
        'src/systems/SaveSystem.ts',
        'src/systems/MoneySystem.ts',
        'src/game/GameStateMachine.ts',
        'src/game/RunState.ts',
        'src/game/data/**/*.ts',
      ],
      exclude: [
        'src/**/*.d.ts',
        'src/main.ts',
      ],
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
  },
})
