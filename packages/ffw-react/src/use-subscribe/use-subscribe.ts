import {useCallback, useMemo, useSyncExternalStore} from 'react';

type Get<TValue = any> = () => TValue;
type Cb<TValue = any> = (value: TValue) => void;
type Unsubscribe = () => void;
type Subscribe<TValue = any> = (cb: Cb<TValue>) => Unsubscribe;

export function useSubscribe(get: Get, subscribe: Subscribe) {
  const store = useMemo(
    () => ({
      immutable: {
        value: get(),
      },
    }),
    [],
  );
  const savedSubscribe = useCallback((cb: Cb) => {
    const unsubscribe = subscribe((value) => {
      store.immutable = {...store.immutable};
      store.immutable.value = value;
      cb(value);
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
