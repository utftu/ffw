import transformStructure from '../transform-structure/transform-structure.js';
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

export const prepareYup = (structure) => {
  return transformStructure(
    structure,
    (yupSchema) => {
      return yupToTest(yupSchema);
    },
    (value) => value instanceof yup.BaseSchema
  );
};
