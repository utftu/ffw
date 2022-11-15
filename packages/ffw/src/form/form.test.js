import * as yup from 'yup';
import {jest} from '@jest/globals';
import Field from '../field/field.js';
import waitTime from 'utftu/wait-time.js';
import prepareYup from '../validators/yup.js';
import Form from './form.js';

describe('form', () => {
  it('initValues', () => {
    const form = new Form({
      initValues: {
        age: 42,
        name: 'robbin',
      },
    });
    expect(form.fields.age.value).toBe(42);
    expect(form.fields.name.value).toBe('robbin');
  });
  describe('getValues() || .values', () => {
    it('shallow', () => {
      const values = {
        age: 42,
        name: 'robbin',
      };
      const form = new Form({
        initValues: values,
      });

      expect(form.getValues()).toEqual(values);
      expect(form.values).toEqual(values);
    });
    it('deep', () => {
      const form = new Form();
      form.fields.testField = new Field({
        form,
        value: {
          arr: [new Field({form, value: 'arr'})],
          objectField: new Field({
            form,
            value: 'obj',
          }),
        },
      });
      expect(form.getValues()).toEqual({
        testField: {
          arr: ['arr'],
          objectField: 'obj',
        },
      });
    });
  });
  describe('getTouches() || .touches', () => {
    it('shallow', () => {
      const form = new Form({
        initValues: {
          age: 42,
          name: 'robbin',
        },
      });
      form.fields.age.setTouched(true);
      form.fields.name.setTouched(false);

      expect(form.getTouches()).toEqual({
        age: true,
      });
      expect(form.touches).toEqual({
        age: true,
      });
    });
    it('deep', () => {
      const form = new Form();
      form.fields.testField = new Field({
        form,
        value: {
          arr: [new Field({form, touched: true})],
          objectField: new Field({
            form,
            touched: true,
          }),
        },
      });
      expect(form.getTouches()).toEqual({
        testField: {
          arr: [true],
          objectField: true,
        },
      });
    });
  });
  describe('getData()', () => {});
  describe('getErrors() || .errors', () => {
    it('shallow', () => {
      const form = new Form({
        initValues: {
          age: 42,
          name: 'robbin',
          address: 'moscow',
        },
      });
      form.fields.age.setError('error');
      form.fields.name.setError('error1');

      expect(form.getErrors()).toEqual({
        age: 'error',
        name: 'error1',
      });
      expect(form.errors).toEqual({
        age: 'error',
        name: 'error1',
      });
    });
    it('deep', () => {
      const form = new Form();
      form.fields.testField = new Field({
        form,
        value: {
          arr: [new Field({form, error: 'arr'})],
          objectField: new Field({
            form,
            error: 'obj',
          }),
        },
      });
      expect(form.getErrors()).toEqual({
        testField: {
          arr: ['arr'],
          objectField: 'obj',
        },
      });
    });
  });
  it('validate()', async () => {
    const form = new Form({
      initValues: {
        age: 'wrong',
        name: 'robbin',
      },
      validateSchema: prepareYup({
        age: yup.number().required(),
        name: yup.string().required(),
      }),
    });
    const validateResult = await form.validate();
    expect(validateResult).toBe(false);
    form.fields.age.set(42);
    const validateResult1 = await form.validate();
    expect(validateResult1).toBe(true);
  });
  it('onSubmit()', async () => {
    const submitListener = jest.fn();
    const form = new Form({
      initValues: {
        age: 42,
        name: 'robbin',
      },
      onSubmit: submitListener,
      validateSchema: prepareYup({
        age: yup.number().required(),
        name: yup.string().required(),
      }),
    });
    form.f.age.set('wrong');
    await form.submit();
    expect(submitListener.mock.calls.length).toBe(0);
    form.f.age.set(43);
    await form.submit();
    expect(submitListener.mock.calls.length).toBe(1);
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
      validateSchema: prepareYup({
        age: yup.number().required(),
        age1: yup.number().required(),
      }),
    });
    await waitTime(100);
    const errors = form.getErrors();
    expect(errors.age).not.toBe('');
    expect(errors.age1).not.toBe('');
  });

  it('reset()', () => {
    const form = new Form({
      initValues: {
        age: 42,
        name: 'robbin',
        address: 'Moscow',
      },
    });
    const age = form.fields.age;
    const name = form.fields.name;
    const address = form.fields.address;

    age.data.value = 43;
    age.data.touched = true;

    name.data.value = 'bobbin';
    name.data.error = 'WRONG NAME';

    address.data.value = 'London';

    form.reset();
    expect(form.getValues()).toEqual({
      age: 42,
      name: 'robbin',
      address: 'Moscow',
    });
    expect(form.getErrors()).toEqual({});
    expect(form.getTouches()).toEqual({});
  });

  describe('.valid', () => {
    it('shallow', async () => {
      const form = new Form({
        initValues: {
          age: 'hello',
        },
        validateSchema: {
          age: () => '',
        },
      });
      const valid = await form.validate();
      expect(valid).toBe(true);
    });
    it('deep', async () => {
      const form = new Form({
        initValues: {
          outerField: '',
        },
      });
      form.fields.outerField.set({
        inner1: {
          inner2: {
            innerField: new Field({
              form,
              test: () => '',
            }),
          },
        },
      });
      const valid = await form.validate();
      expect(valid).toBe(true);
    });
  });
  describe('validate()', () => {
    it('shallow', async () => {
      const form = new Form({
        initValues: {
          age: 'hello',
        },
        validateSchema: {
          age: () => 'age error',
        },
      });
      const valid = await form.validate();
      expect(valid).toBe(false);
    });
    it('deep', async () => {
      const form = new Form({
        initValues: {
          outerField: '',
        },
      });
      form.fields.outerField.set({
        inner1: {
          inner2: {
            innerField: new Field({
              form,
              test: () => 'innerField error',
            }),
          },
        },
      });
      const valid = await form.validate();
      expect(valid).toBe(false);
    });
  });
});
