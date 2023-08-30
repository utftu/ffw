import {useCallback, useMemo, useSyncExternalStore} from 'react';

export function useSubscribe(get, subscribe) {
  const store = useMemo(
    () => ({
      immutable: {
        value: get(),
      },
    }),
    [],
  );
  const savedSubscribe = useCallback((cb) => {
    const unsubscribe = subscribe((value) => {
      store.immutable = {...store.immutable};
      store.immutable.value = value;
      cb();
    });

    return unsubscribe;
  }, []);
  const immutable = useSyncExternalStore(
    savedSubscribe,
    () => store.immutable,
    () => store.immutable,
  );

  return immutable.value;
}
