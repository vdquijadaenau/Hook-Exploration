import { act, renderHook } from '@testing-library/react-hooks/native';
import { globalAgent } from 'http';

import useCopyToClipboard from './useCopyToClipboard';

describe('useClipboard', () => {
  const originalClipboard = { ...global.navigator.clipboard };
  const mockData = 'Test Value';

  beforeEach(() => {
    const mockClipboard = { writeText: jest.fn() };
    //@ts-ignore mock clipboard
    global.navigator.clipboard = mockClipboard;
  });

  afterEach(() => {
    jest.resetAllMocks();
    //@ts-ignore mock clipboarf
    global.navigator.clipboard = originalClipboard;
  });

  test('Should use clipboard', () => {
    const { result } = renderHook(() => useCopyToClipboard());

    expect(result.current[0]).toBe(null);
    expect(typeof result.current[1]).toBe('function');
  });

  test('should copy to the clipboard and the state', async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current[1](mockData);
    });
    expect(navigator.clipboard.writeText).toBeCalledTimes(1);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockData);
    expect(result.current[0]).toBe(mockData);
  });
});
