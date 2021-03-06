import { renderHook, act } from '@testing-library/react-hooks/native';
import useCounter from './useCounter';

describe('useCounter', () => {
  test('should use counter', () => {
    const { result } = renderHook(() => useCounter());

    expect(result.current.count).toBe(0);
    expect(typeof result.current.increment).toBe('function');
    expect(typeof result.current.decrement).toBe('function');
    expect(typeof result.current.reset).toBe('function');
    expect(typeof result.current.setCount).toBe('function');
  });

  test('should increment the counter', () => {
    const { result } = renderHook(() => useCounter());
    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);
  });

  test('should decrement the counter', () => {
    const { result } = renderHook(() => useCounter());
    act(() => {
      result.current.decrement();
    });
    expect(result.current.count).toBe(-1);
  });

  test('should initial value works', () => {
    const { result } = renderHook(() => useCounter(3));
    expect(result.current.count).toBe(3);
  });

  test('should set counter', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.setCount(5);
    });

    expect(result.current.count).toBe(5);
  });

  test('should set counter with prev value', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.setCount(x => x + 2);
    });

    expect(result.current.count).toBe(7);
  });
});
