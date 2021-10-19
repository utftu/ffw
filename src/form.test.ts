import Form from './form';
import * as yup from 'yup';
import {waitAsync} from './utils';

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

  it('validateOnMount', async () => {
    const form = new Form({
      options: {
        validateOnMount: true,
      },
      initValues: {
        age: 'wrong',
        age1: 'wrong1',
      },
      validateSchema: yup.object({
        age: yup.number().required(),
        age1: yup.number().required(),
      }),
    });
    await waitAsync();
    const errors = form.getErrors();
    expect(errors.age).not.toBe('');
    expect(errors.age1).not.toBe('');
  });
});
