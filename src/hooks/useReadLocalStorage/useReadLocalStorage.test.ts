import { renderHook } from '@testing-library/react-hooks/native';
import useLocalStorage from '../useLocalStorage/useLocalStorage';
import useReadLocalStorage from './useReadLocalStorage';

class localStorageMock {
  store: Record<string, unknown> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: unknown) {
    this.store[key] = value + '';
  }

  deleteItem(key: string) {
    delete this.store[key];
  }
}

Object.defineProperty(window, 'localstorage', {
  value: new localStorageMock(),
});

describe('useReadLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    [jest.clearAllMocks()];
  });
  test('should return null', () => {
    const { result } = renderHook(() => useReadLocalStorage('test'));

    expect(result.current).toBe(null);
  });
});
