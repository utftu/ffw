export function convertYupToTest(yupSchema) {
  return async (value) => {
    try {
      await yupSchema.validate(value);
      return '';
    } catch (error) {
      return error.message;
    }
  };
}

export function prepareYup(obj) {
  const newObj = {};
  for (const key in obj) {
    newObj[key] = convertYupToTest(obj[key]);
  }
  return newObj;
}
