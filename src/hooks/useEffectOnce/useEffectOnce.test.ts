import { renderHook } from '@testing-library/react-hooks/native';
import useEffectOnce from './useEffectOnce';

describe('useEffectOnce()', () => {
  test('should only triggered once', () => {
    const effect = jest.fn();
    const { rerender } = renderHook(() => useEffectOnce(effect));

    expect(effect).toBeCalledTimes(1);

    rerender();
    expect(effect).toBeCalledTimes(1);
  });
});
