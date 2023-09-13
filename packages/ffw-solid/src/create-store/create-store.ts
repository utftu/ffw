import {createSignal, onCleanup} from 'solid-js';

type Get<TValue = any> = () => TValue;
type Cb<TValue = any> = (value: TValue) => void;
type Unsubscribe = () => void;
type Subscribe<TValue = any> = (cb: Cb<TValue>) => Unsubscribe;

function createStore<TGet extends Get, TValue = any>(
  get: TGet,
  subscribe: Subscribe,
) {
  const [state, setState] = createSignal<ReturnType<TGet>>(get(), {
    equals: false,
  });

  const unsubscribe = subscribe((value) => {
    setState(value);
  });

  onCleanup(() => unsubscribe());

  return state;
}

export default createStore;
