import { useEffect, useCallback, useState } from 'react';
import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect';

type useLocked = [boolean, (locked: boolean) => void];

function useLockedBody(initialLocked = false): useLocked {
  const [locked, setLocked] = useState(initialLocked);

  useIsomorphicLayoutEffect(() => {
    if (!locked) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    //lock scroll
    document.body.style.overflow = 'hidden';

    //Get Scrollbar width
    const root = document.getElementById('__gatsby'); //or root
    const scrollBarWidth = root ? root.offsetWidth - root.scrollWidth : 0;

    if (scrollBarWidth) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }
    return () => {
      document.body.style.overflow = originalOverflow;

      if (scrollBarWidth) {
        document.body.style.paddingRight = originalPaddingRight;
      }
    };
  }, [locked]);

  //update if initial value chnages
  useEffect(() => {
    if (locked !== initialLocked) {
      setLocked(initialLocked);
    }
  }, [initialLocked]);

  return [locked, setLocked];
}

export default useLockedBody;
