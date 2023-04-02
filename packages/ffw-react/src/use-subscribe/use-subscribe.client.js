import {useCallback, useEffect, useState} from 'react';

function useForceUpdate() {
  const [, forceUpdate] = useState({});

  return useCallback(() => {
    forceUpdate({});
  }, []);
}

function useSubscribeClient(get, subscribe) {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const listener = () => forceUpdate();

    const unsubscribe = subscribe(listener);
    return unsubscribe;
  }, [get, subscribe]);

  return get();
}

export default useSubscribeClient;
