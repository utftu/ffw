import {useCallback, useSyncExternalStore} from 'react';

function useFfwFields(field) {
  const subscribe = useCallback(
    (listener) => {
      return field.subscribe('*', listener);
    },
    [field]
  );

  const get = useCallback(() => {
    return field.getValue();
  }, [field]);

  return useSyncExternalStore(subscribe, get, get);
}

export default useFfwFields;
