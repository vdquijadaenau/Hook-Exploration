import { renderHook } from '@testing-library/react-hooks/native';
import useInterval from './useInterval';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function mockSetInterval() {
  jest.useFakeTimers();
  jest.spyOn(global, 'setInterval');
}

function mockClearInterval() {
  jest.useFakeTimers();
  jest.spyOn(global, 'clearInterval');
}

describe('useInterval()', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fire callback function(1)', async () => {
    const timeout = 500;
    const callBack = jest.fn();
    renderHook(() => useInterval(callBack, timeout));
    await sleep(timeout);
    expect(callBack).toHaveBeenCalledTimes(1);
  });

  test('should fire callback function(2)', async () => {
    const timeout = 500;
    const earlyTimeout = 400;
    const callBack = jest.fn();
    renderHook(() => useInterval(callBack, timeout));
    await sleep(earlyTimeout);
    expect(callBack).not.toHaveBeenCalled();
  });

  test('should call the set interval on start', () => {
    const timeout = 1200;
    mockSetInterval();
    const callBack = jest.fn();
    renderHook(() => useInterval(callBack, timeout));
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), timeout);
  });

  test('should call clearTimeout on unmount', () => {
    mockClearInterval();
    const callBack = jest.fn();
    const { unmount } = renderHook(() => useInterval(callBack, 1200));
    unmount();
    expect(clearInterval).toHaveBeenCalledTimes(1);
  });
});
