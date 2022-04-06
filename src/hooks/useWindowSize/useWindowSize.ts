import { useState } from 'react';
import { useEventListener } from '../useEventListener';
import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect';

interface WindowSize {
  width: number;
  height: number;
}
export default function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  const handlesize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEventListener('resize', handlesize);

  useIsomorphicLayoutEffect(() => {
    handlesize();
  }, []);

  return windowSize;
}
