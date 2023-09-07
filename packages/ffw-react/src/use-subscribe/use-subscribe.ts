import {useCallback, useMemo, useSyncExternalStore} from 'react';

type Get<TValue = any> = () => TValue;
export type Cb<TValue = any> = (value: TValue) => void;
type Unsubscribe = () => void;
export type Subscribe<TValue = any> = (cb: Cb<TValue>) => Unsubscribe;

export function useSubscribe(get: Get, subscribe: Subscribe) {
  const store = useMemo(
    () => ({
      immutable: {
        value: get(),
      },
    }),
    [get, subscribe],
  );
  const savedSubscribe = useCallback(
    (cb: Cb) => {
      const unsubscribe = subscribe((value) => {
        store.immutable = {...store.immutable};
        store.immutable.value = value;
        cb(value);
      });

      return unsubscribe;
    },
    [get, subscribe],
  );
  const immutable = useSyncExternalStore(
    savedSubscribe,
    () => store.immutable,
    () => store.immutable,
  );

  return immutable.value;
}
