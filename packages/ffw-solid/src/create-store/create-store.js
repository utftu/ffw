import {createSignal, onCleanup} from 'solid-js';

function createStore(get, subscribe) {
  const [state, setState] = createSignal(get(), {equals: false});

  const unsubscribe = subscribe((value) => {
    setState(value);
  });

  onCleanup(() => unsubscribe());

  return state;
}

export default createStore;
