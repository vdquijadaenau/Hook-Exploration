import { renderHook } from '@testing-library/react-hooks/native';
import useReadLocalStorage from './useReadLocalStorage';

describe('useReadLocalStorage', () => {
  test('should return null', () => {
    const { result } = renderHook(() => useReadLocalStorage('test'));

    expect(result.current).toBe(null);
  });
});
