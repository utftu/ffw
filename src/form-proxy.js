function createFormProxy(form, deps) {
  function checkAndThrow(property) {
    if (!deps.contains(property)) {
      throw new Error(`You don't have access to field with name - ${property}`);
    }
  }

  return new Proxy(form, {
    get(target, property) {
      if (property === 'fields') {
        return new Proxy(form.fields, {
          get(target, property) {
            checkAndThrow(property);
            return target[property];
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
