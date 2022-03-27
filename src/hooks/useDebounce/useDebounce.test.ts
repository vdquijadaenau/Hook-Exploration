import { renderHook } from '@testing-library/react-hooks/native';
import useDebounce from './useDebounce';

function mockSetTimeout() {
  jest.useFakeTimers();
  jest.spyOn(global, 'setTimeout');
}

function mockClearTimeout() {
  jest.useFakeTimers();
  jest.spyOn(global, 'clearTimeout');
}

describe('useDebounce()', () => {
  afterEach(() => {
    jest.useRealTimers();
  });
  test('should returne debounce value', () => {
    const value = 'value';
    const {
      result: { current: debounceValue },
    } = renderHook(() => useDebounce(value));

    expect(debounceValue).toBe(value);
  });

  test('should debounce with default debounce of 500ms', () => {
    mockSetTimeout();
    renderHook(() => useDebounce('value'));

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500);
  });

  test('should debounce with given debounce value', () => {
    mockSetTimeout();
    renderHook(() => useDebounce('value', 1458));

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1458);
  });

  test('should call clearTimeount on umount', () => {
    mockClearTimeout();
    const { unmount } = renderHook(() => useDebounce('value'));
    unmount();

    expect(clearTimeout).toBeCalledTimes(1);
  });
});
