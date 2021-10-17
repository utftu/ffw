import Form from './form';
import * as yup from 'yup';

describe('form', () => {
  it('initValues', () => {
    const form = new Form({
      initValues: {
        age: 42,
        name: 'robbin',
      },
      validateSchema: yup.object({}),
    });
    expect(form.fields.age.value).toBe(42);
    expect(form.fields.name.value).toBe('robbin');
  });
});
