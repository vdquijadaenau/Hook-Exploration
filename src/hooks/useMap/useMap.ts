import { useCallback, useState } from 'react';

export type MapEntries<K, V> = Map<K, V> | [K, V][];

export interface Actions<K, V> {
  set: (key: K, value: V) => void;
  setAll: (entries: MapEntries<K, V>) => void;
  remove: (key: K) => void;
  reset: Map<K, V>['clear'];
}

type MapReturn<K, V> = [Omit<Map<K, V>, 'set' | 'clear' | 'delete'>, Actions<K, V>];

function useMap<K, V>(initialState: MapEntries<K, V> = new Map()): MapReturn<K, V> {
  const [map, setMap] = useState(new Map(initialState));

  const actions: Actions<K, V> = {
    set: useCallback((key, value) => {
      setMap(prev => {
        const copy = new Map(prev);
        copy.set(key, value);
        return copy;
      });
    }, []),

    setAll: useCallback(entries => {
      setMap(() => new Map(entries));
    }, []),

    remove: useCallback(key => {
      setMap(prev => {
        const copy = new Map(prev);
        copy.delete(key);
        return copy;
      });
    }, []),

    reset: useCallback(() => {
      setMap(() => new Map());
    }, []),
  };

  return [map, actions];
}

export default useMap;
