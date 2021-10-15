import * as yup from 'yup';

const schema = yup.object({
  age: yup.number().required(),
});

try {
  await schema.fields.age.validate('heheheh');
} catch (error) {
  console.log('-----', 'error', error);
}
