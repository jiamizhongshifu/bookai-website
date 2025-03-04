/**
 * Jest配置文件
 * 用于单元测试
 */

module.exports = {
  // 测试环境
  testEnvironment: 'jsdom',
  
  // 测试文件匹配模式
  testMatch: [
    "**/tests/**/*.test.js",
    "**/tests/**/*.spec.js"
  ],
  
  // 覆盖率收集
  collectCoverage: true,
  collectCoverageFrom: [
    'js/**/*.js',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  
  // 测试超时时间
  testTimeout: 10000,
  
  // 测试报告
  reporters: [
    'default',
    'jest-junit'
  ],
  
  // 模块别名
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  
  // 在每个测试文件执行前设置
  setupFilesAfterEnv: [
    '<rootDir>/tests/unit/setup.js'
  ],

  moduleDirectories: ['node_modules'],
  setupFiles: [],
  transform: {},
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ]
}; 