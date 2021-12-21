import {getContext} from 'svelte';
import type {Form} from 'ffw-base';

function useForm(deps: string[]) {
  const form = getContext<Form>('ffw-s');

  return form;

  return deps.reduce((store, dep) => {
    const field = form.getField(dep);
    store[dep] = {
      subscribe(cb) {
        const listener = (field) => cb(field.value);
        cb(field);
        field.subscribe(listener);
        return () => field.unsubscribe(listener);
      },
      getField() {
        return field;
      },
    };
    return store;
  }, {});
}

// function useForm(deps: string[]) {
//   const form = getContext<Form>('ffw-s');
//
//   return deps.reduce((store, dep) => {
//     const field = form.getField(dep);
//     store[dep] = {
//       subscribe(cb) {
//         const listener = (field) => cb(field.value);
//         cb(field.value);
//         field.subscribe(listener);
//         return () => field.unsubscribe(listener);
//       },
//       set: (value) => field.set(value),
//       getField() {
//         return field;
//       },
//       touched: {},
//     };
//     return store;
//   }, {});
// }

export default useForm;
