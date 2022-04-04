import { useCallback, useEffect, useState } from 'react';
import { useEventListener } from '../useEventListener';

type Value<T> = T | null;

export default function useReadLocalStorage<T>(key: string): Value<T> {
  const readValue = useCallback((): Value<T> => {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.warn(`Error reading local storage key "${key}":`, error);
      return null;
    }
  }, [key]);

  const [storedValue, setStoreValue] = useState<Value<T>>(readValue);

  useEffect(() => {
    setStoreValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStorageChange = useCallback(() => {
    setStoreValue(readValue());
  }, [readValue]);

  // this only works for other documents, not the current one
  useEventListener('storage', handleStorageChange);

  useEventListener('local-storage', handleStorageChange);

  return storedValue;
}
