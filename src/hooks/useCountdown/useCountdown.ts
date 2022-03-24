import { useBoolean } from '../useBoolean';
import { useCounter } from '../useCounter';
import { useInterval } from '../useInterval';

interface IUseCountdownType {
  seconds: number;
  interval: number;
  isIncrement?: boolean;
}

interface ICountdownHelpers {
  start: () => void;
  stop: () => void;
  reset: () => void;
}

/**
 *
 * @param seconds the countdown's number, generally time seconds
 * @param interval the countdown's interval, milliseconds
 * @param isIncrement determine the countdown is increment, otherwise is decrement
 * @returns
 */

function useCountdown({ seconds, interval, isIncrement }: IUseCountdownType): [number, ICountdownHelpers] {
  const { count, increment, decrement, reset: resetCounter } = useCounter(seconds);
  /**
   * Note: used to control the useInterval
   * running: If true, the interval is running
   * start: Should set running true to trigger interval
   * stop: Should set running false to remove interval
   */
  const { value: running, setTrue: start, setFalse: stop } = useBoolean(false);

  const reset = () => {
    stop();
    resetCounter();
  };

  useInterval(isIncrement ? increment : decrement, running ? interval : null);

  return [count, { start, stop, reset }];
}

export default useCountdown;
