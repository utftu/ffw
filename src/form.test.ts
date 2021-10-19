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

  it('validateOnMount', () => {
    const form = new Form({
      options: {
        validateOnMount: true,
      },
      initValues: {
        age: 42,
        name: '',
      },
      validateSchema: yup.object({
        age: yup.number().required(),
        name: yup.string().required(),
      }),
    });
    const errors = form.getErrors();
    expect(errors.age).not.toBe('');
    expect(errors.name).not.toBe('');
  });
});
