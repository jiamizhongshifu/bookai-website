/**
 * 单元测试设置文件
 * 在每个测试文件执行前运行
 */

// 扩展Jest匹配器
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `期望 ${received} 不在 ${floor} 到 ${ceiling} 范围内`,
        pass: true,
      };
    } else {
      return {
        message: () => `期望 ${received} 在 ${floor} 到 ${ceiling} 范围内`,
        pass: false,
      };
    }
  },
});

// 模拟localStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

// 设置全局模拟
global.localStorage = new LocalStorageMock();
global.sessionStorage = new LocalStorageMock();

// 模拟IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe() {
    return null;
  }

  unobserve() {
    return null;
  }

  disconnect() {
    return null;
  }
}; 