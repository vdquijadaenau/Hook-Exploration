import { useEffect, useRef } from 'react';
import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect';

function useInterval(callBack: () => void, delay: number | null) {
  const saveCallBack = useRef(callBack);

  useIsomorphicLayoutEffect(() => {
    saveCallBack.current = callBack;
  }, [callBack]);

  useEffect(() => {
    if (!delay && delay !== 0) return;
    const id = setInterval(() => saveCallBack.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
}

export default useInterval;
