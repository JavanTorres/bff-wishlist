import type { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  roots: ['<rootDir>/src'],

  testMatch: ['<rootDir>/src/**/*.spec.ts', '<rootDir>/src/**/*.test.ts'],

  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  moduleNameMapper: pathsToModuleNameMapper(
    compilerOptions.paths as Record<string, string[]>,
    { prefix: '<rootDir>/src/' },
  ),

  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  coverageDirectory: '<rootDir>/coverage',
};

export default config;
