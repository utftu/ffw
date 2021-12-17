import type Form from './form';

export function createFormProxy(form: Form, deps: string[]) {
  function checkAndThrow(property) {
    if (deps.length !== 0 && !deps.includes(property)) {
      throw new Error(`You don't have access to field - ${property}`);
    }
  }

  return new Proxy(form, {
    get(target, property, receiver) {
      if (property === 'fields' || property === 'f') {
        return new Proxy(Reflect.get(target, property, receiver), {
          get(target, property) {
            checkAndThrow(property);
            return Reflect.get(target, property, receiver);
          },
        });
      }
      if (
        property === 'setValues' ||
        property === 'setErrors' ||
        property === 'setTouches'
      ) {
        return new Proxy(form[property], {
          apply(target, thisArg, args) {
            for (const name in args[0]) {
              checkAndThrow(name);
            }
            return Reflect.apply(target, thisArg, args);
          },
        });
      }
      return Reflect.get(target, property, receiver);
    },
  });
}
