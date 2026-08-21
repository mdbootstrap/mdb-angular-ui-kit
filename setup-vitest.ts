import { afterAll, beforeAll, vi, type MockInstance } from 'vitest';

function createStorageMock(): Storage {
  let storage: Record<string, string> = {};

  return {
    getItem: (key: string) => (key in storage ? storage[key] : null),
    setItem: (key: string, value: string) => {
      storage[key] = value || '';
    },
    removeItem: (key: string) => {
      delete storage[key];
    },
    clear: () => {
      storage = {};
    },
    key: (index: number) => Object.keys(storage)[index] ?? null,
    get length() {
      return Object.keys(storage).length;
    },
  };
}

class ResizeObserverMock implements ResizeObserver {
  observe = vi.fn(() => 'Mocking works') as unknown as ResizeObserver['observe'];
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, 'localStorage', {
  configurable: true,
  value: createStorageMock(),
});
Object.defineProperty(window, 'sessionStorage', {
  configurable: true,
  value: createStorageMock(),
});
Object.defineProperty(window, 'getComputedStyle', {
  configurable: true,
  value: () => ({
    getPropertyValue: () => '',
  }),
});
Object.defineProperty(globalThis, 'ResizeObserver', {
  configurable: true,
  writable: true,
  value: ResizeObserverMock,
});
Object.defineProperty(document.body.style, 'transform', {
  configurable: true,
  value: () => ({
    enumerable: true,
    configurable: true,
  }),
});

let consoleSpy: MockInstance;

beforeAll(() => {
  consoleSpy = vi.spyOn(console, 'error').mockImplementation((message) => {
    if (!message?.message?.includes('Could not parse CSS stylesheet')) {
      console.warn(message);
    }
  });
});

afterAll(() => consoleSpy.mockRestore());
