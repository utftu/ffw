import Form from './form';

export function createFormProxy(form: Form, deps: string[]) {
  function checkAndThrow(property) {
    if (!deps.includes(property) && deps.length !== 0) {
      throw new Error(`You don't have access to field with name - ${property}`);
    }
  }

  return new Proxy(form, {
    get(target, property) {
      if (property === 'fields' || property === 'f') {
        return new Proxy(form.fields, {
          get(target, property) {
            checkAndThrow(property);
            return target[property as string];
          },
        });
      }
      return {
        __proto__: target,
        // setFieldValue(name, ...args) {
        //   checkAndThrow(name)
        //   target.setFieldValue(name, ...args)
        // }
      };
    },
  });
}
