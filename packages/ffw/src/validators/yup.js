import transform from '../transform-structure/transform.js';
import * as yup from 'yup';

function yupToTest(yupSchema) {
  return async (value) => {
    try {
      await yupSchema.validate(value);
      return '';
    } catch (error) {
      return error.message;
    }
  };
}

function prepareYup(structure) {
  return transform(
    structure,
    (yupSchema) => {
      return yupToTest(yupSchema);
    },
    (value) => value instanceof yup.BaseSchema
  );
}

export default prepareYup;
