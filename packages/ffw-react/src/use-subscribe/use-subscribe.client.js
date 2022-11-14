import {useEffect} from 'react';
import useForceUpdate from 'utftu/use-force-update.js';

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
