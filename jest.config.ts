import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // Style mocks must come BEFORE the @/ alias so SCSS files aren't resolved as real paths
    '^@/.*\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: './tsconfig.test.json' }],
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{ts,tsx}',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.types.ts',
    '!src/**/index.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/mocks/**',
    '!src/config/**',
    '!src/constants/**',
    '!src/i18n/locales/**',
    '!src/i18n/types/**',
    '!src/i18n/context/**',
    '!src/i18n/hooks/**',
    '!src/features/orders/enums/**',
    '!src/features/orders/schemas/**',
    '!src/features/orders/context/**',
    '!src/features/orders/components/**',
    '!src/features/orders/hooks/**',
    '!src/features/orders/services/**',
    '!src/pages/**',
    '!src/layouts/**',
    '!src/providers/**',
    '!src/router/**',
    '!src/App.tsx',
  ],
  coverageThreshold: {
    global: { lines: 80, functions: 80, branches: 70, statements: 80 },
  },
};

export default config;
