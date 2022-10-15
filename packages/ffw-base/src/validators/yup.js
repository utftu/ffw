import transformStructure from '../transform-structure/transform-structure.js';
import * as yup from 'yup';

function yupToTest(yupSchema) {
  return async () => {
    try {
      await yupSchema.validate(this.value);
      return '';
    } catch (error) {
      return error.errors[0];
    }
  };
}

const prepareYup = (structure) => {
  return transformStructure(
    structure,
    (yupSchema) => {
      return yupToTest(yupSchema);
    },
    (value) => value instanceof yup.BaseSchema
  );
};
