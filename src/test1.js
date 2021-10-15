import Form from './form.js';
import * as yup from 'yup';

const form = new Form({
  initValues: {
    age: 42,
  },
  validateSchema: yup.object({
    age: yup.number().required(),
  }),
});
await form.fields.age.validate();
